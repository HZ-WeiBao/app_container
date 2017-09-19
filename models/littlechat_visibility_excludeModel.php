<?php

class littlechat_visibility_excludeModel extends Sql {
  public function check($whoId){
    $this->findOne('user = ? and time = ? and on_user = ?',[
      $this->_caller->getId() , $this->_caller->time , $whoId
    ]);
    return (bool)$this->success();
  }
  public function add($whoId){
    $this->init();
    $this->user = $this->_caller->getId();
    $this->time = $this->_caller->time;
    $this->on_user = $whoId;
    $this->save();
    return (bool)$this->success();
  }
  public function remove($whoId){
    $this->findOne('user = ? and time = ? and on_user = ?',[
      $this->_caller->getId() , $this->_caller->time , $whoId
    ])->del();
    return (bool)$this->success();
  }
}