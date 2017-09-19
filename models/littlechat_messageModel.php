<?php

class littlechat_messageModel{
  public function to($whoId){
    $class = new littlechat_group_messageModel($whoId);
    $class->_caller = $this->caller;
    return $class;
  }
  public function toGroup($groupId){
    $class = new littlechat_person_messageModel($groupId);
    $class->_caller = $this->caller;
    return $class;
  }
}

class littlechat_person_messageModel extends Sql{
  use littlechat_messageTrait;
}

class littlechat_group_messageModel extends Sql{
  use littlechat_messageTrait;
}

trait littlechat_messageTrait {
  public function __construct($receiver){
    $this->receiver = $receiver;
  }
  public function send($type,$content){
    $this->sender = $this->_caller->getId();
    $this->type = $type;
    $this->content = $content;
    $this->save();
  }
  public function withdraw($timestamp){
    $this->findOne('receiver = ? and sender = ? and time = ?',[
        $this->receiver,
        $this->_caller->getId(),
        $timestamp ])
      ->del();
    return $this->success();
  }
  public function history($toTimestamp){
    return $this->findAll('receiver = ? and sender = ? and time >= ?',[
      $this->receiver,
      $this->_caller->getId(),
      $timestamp
    ]);
  }//不可能是所有的记录都加载出来的
}