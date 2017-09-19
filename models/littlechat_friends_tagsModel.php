<?php

class littlechat_friends_tagsModel extends Sql {
  public function __construct(){
    $this->_user = $this->_caller->getId();
  }
  public function list($tagname=null){
    if($tagname){//获取某个tag的列表,
      return $this->setRange(['on_user'])->findAll('user = ? and tag = ?',[
        $this->_user , $tagname
      ]);
    }else{//获取tag的列表
      return $this->distinct->setRange(['tag'])->findAll('user = ?',[
        $this->_user
      ]);
    }
  }
  public function add($whoId,$tagname){
    $this->init();
    $this->tag = $tagname;
    $this->user = $this->_user;
    $this->on_user = $whoId;
    $this->save();
    return (bool)$this->success();
  }
  public function remove($whoId,$tagname){
    $this->findOne('user = ? and on_user = ? and tag = ? ',[
      $this->_user , $whoId , $tagname
    ])->del();
    return (bool)$this->success();
  }
}