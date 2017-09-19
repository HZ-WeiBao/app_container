<?php

class littlechat_commentModel extends Sql {
  public function __construct($user=null,$moment_time=null){
    if($user && $moment_time){
      $this->_user = $user;
      $this->_moment_time = $moment_time;
    }
  }
  public function moment($user,$time){
    $this->_user = $user;
    $this->_moment_time = $moment_time;
  }
  public function replyTo($whoId){}
  public function with(){

  }
  public function remove(){}
  public function list($whoId){//列出谁可以了看到某条碰朋友圈的评论集合
    return $this->query('
select * from littlechat_comment where 
  user = ?
  and moment_time = ?
  and exists 
    select * from littlechat_friends where 
      (littlechat_friends.sender = littlechat_comment.comment_user and littlechat_friends.receiver = ?)
      or
      (littlechat_friends.receiver = littlechat_comment.comment_user and littlechat_friends.sender = ?)
  and not exists 
    select * from littlechat_frirends_blacklist where user = littlechat_comment.comment_user and on_user = ?
    ',[
      $this->_user,
      $this->_moment_time,
      $whoId, $whoId, $whoId
    ]);
  }
}