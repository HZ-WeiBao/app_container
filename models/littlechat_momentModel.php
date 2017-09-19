<?php

class littlechat_momentModel extends Sql {
  use lazyGetCall;
  public function __construct($timestamp=null){
    if($timestamp)
      $this->time = $timestamp;
  }
  public function getId(){
    return $this->_caller->getId();
  }
  public function post(){
    $this->user = $this->getId();
    $this->save();
  }
  public function text($content){//缓存
    $this->content = $content;
  }
  public function del(){
    if(isset($this->time)){
      $this->findOne('user = ? and time = ?',[
        $this->getId() , $this->time
      ])->del();
      return (bool)$this->success();
    }else{
      throw new ErrorException('使用前需要construct传参数time');
      return false;
    }
  }
  public function limit($startTime,$num=10){
    $this->_startTime = $startTime ?? time();
    // $this->_limit = $num;
  }
  public function list($whoId=null){
    if(!$whoId){
      return $this->get_someone_moment($whoId);
    }else{//根据朋友关系获取朋友圈的内容
      return $this->get_my_moment();
    }
  }
  protected function get_someone_moment($whoId){
    $id = $this->getId();
    //读取该user的权限设置
    $moment_owner = new littlechat_userModel($whoId);
    $moment_owner->setRange([
      'allow_strange_visit_post',
      'allow_friends_visit_recent_post'
    ])->findOne('id = ?',[$whoId]);

    //是否在朋友圈黑名单 这应该是是自己的朋友圈不看而已,单独还是可以看的
    if($this->moment_blacklist->check($id))
      return [];

    //朋友
    if($this->_caller->friends->check($whoId)){
      //权限
      if($moment_owner->allow_friends_visit_recent_post){ //允许查看post数目
        $toTime = '';
      }else{
        $toTime = $moment_owner->allow_friends_visit_recent_post ;
        $toTime = $toTime * 24 * 60 * 60 ;
        $toTime = 'and time > '.$toTime;
      }
      
      //先获取朋友圈
      return $this->get_moment_query($moment_owner,$id,$this->_startTime,$toTime);

    //陌生人
    }else{
      //不许看
      if(!$moment_owner->allow_strange_visit_post)
        return [];

      return $this->get_moment_query($moment_owner,$id,time(),$toTime);
    }
  }

  protected function get_moment_query($moment_owner,$id,$startTime,$toTime){
    //只能看给定条数默认是10,这是我把这10储存在数据库里面了
    $moments = $moment_owner->moment->query('
select * from littlechat_moment where (
user = ? 
and time < ? '.$toTime.
' and $watcher not in (select banned from littlechat_moment_blacklist where user = ?) 
and (
  $watch not in (select on_user from littlechat_visibilty_exclude where user = ? and time = littlechat_moment.time)
  or
  $watch in (select on_user from littlechat_visibilty_include where user = ? and time = littlechat_moment.time)
)
) Order by time desc limit 10
    ',[$id,$startTime,$id,$id,$id]);
    

    foreach($moments as &$moment){//注意这里是非对象哦,没有方法哦,我的ORM没那么先进~
      //附件
      $attachment = new littlechat_attachmentModel(
        $moment->user,$moment->time);

      $moments->attachments = $attachment->list();
      
      //评论
      $comments = new littlechat_commentModel(
        $moment->user,$moment->time);

      $moments->comments = $comments->list($id);
      
      //点赞
      
    }
    //完事,返回,数据包
    return $moments;
  }

  protected function get_my_moment(){
    $id = $this->getId();
    $moments = $this->query('
select * from littlechat_moment where 
  ( littlechat_moment.user = $watcher 
  or (
    littlechat_moment.visibility_type != 1 
    and 
    exists (
      select * from littlechat_friends where 
        ( littlechat_friends.sender = $watcher and littlechat_friends.receiver = littlechat_moment.user) 
        or 
        ( littlechat_friends.receiver = $watcher and littlechat_friends.sender = littlechat_moment.user)
    ) 
    and not exists (
      select * from littlechat_friends_blacklist where
        user = littlechat_moment.user
        and 
        on_user = $watcher
    )
    and not exists (
      select * from littlechat_moment_ignore where
        user = $watcher
        and
        on_user = littlechat_moment.user
    )
    and not exists (
      select * from littlechat_moment_blacklist where
        user = littlechat_moment.user
        and
        on_user = $watcher
    )
    and (
      littlechat_moment.visibility_type = 0
      or 
      (
        littlechat_moment.visibility_type = 2
        and 
				exists 
					select * from littlechat_moment_include where
						user = littlechat_moment.user
						and
						on_user = $watcher
						and 
						time = littlechat_moment.time
			)
      or 
      (
        littlechat_moment.visibility_type = 3
        and 
        not exists 
          select * from littlechat_moment_exclude where
            user = littlechat_moment.user
            and
            on_user = $watcher
            and 
            time = littlechat_moment.time
      )
    )
  ))
	and time > $startTime
	and time < $endTime
	order by time desc
	limit 10
    ',[$id,$startTime,$id,$id,$id]);
    

    foreach($moments as &$moment){//注意这里是非对象哦,没有方法哦,我的ORM没那么先进~
      //获取附件
      $attachment = new littlechat_attachmentModel(
        $moment->user,$moment->time);

      $moments->attachments = $attachment->list();
      
      //在获取评论
      $comments = new littlechat_commentModel(
        $moment->user,$moment->time);

      $moments->comments = $comments->list($id);
    }
    //完事,返回,数据包
    return $moments;
  }
}