<?php

class littlechat_attachmentModel extends Sql {
  public function __construct($user=null,$time=null){
    //如果是使用上下文信息来处理的话是不应该使用__construct来处理的
    //我这边应该使用独立模式好了,不过在后面编写的时候就需要两种模式使用优先级来判断了
    if($user && $time){
      $this->_user = $user;
      $this->_time = $time;
    }
  }
  public function add($type,array $datas){//在如果是统一的话,还有讲求代码复用的话还是需要新建一个操作才可以的
    $this->_caller->type = $type;
      $this->user = $this->_user ?? $this->_caller->getId();
      $this->time = $this->_time ?? $this->_caller->time;
      foreach ($datas as $value) {
        $this->src = $value;
        $this->save();
      }
  }
  public function list(){//获取moment的附件咯,如果是单条朋友圈,还有就是独立获取的
    $id = $this->_user ?? $this->_caller->getId();
    $time = $this->_time ?? $this->_caller->time;
    
    if($time)//time什么时候是不存在的捏
      return $this->setRange(['src'])
        ->findAll('user = ? and time = ?',[$id,$time]);
    else
      return $this->setRange(['src'])
        ->findAll('user = ?',[$id]);
  }
}