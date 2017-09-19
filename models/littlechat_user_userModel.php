<?php

class littlechat_user_userModel extends Sql {
  public function __construct($whoId){
    $this->_on_user = $whoId;
    $this->_id = $this->_caller->getId();
  }
  public function get($variable){
    $nickname = $this->findOne('user = ? and on_user = ?',[
      $this->_id, $this->_on_user
    ]);
    if($this->success())
      return $nickname->$variable;
    return false;
  }
  public function set($variable, $value){
    $nickname = $this->findOne('user = ? and on_user = ?',[
      $this->_id, $this->_on_user
    ]);
    if($this->success()){
      $this->$variable = $value;
      $this->save();
    }else{
      $this->init();
      $this->user = $this->_id;
      $this->on_user = $this->_on_user;
      $this->$variable = $value;
      $this->save();
    }
    return (bool)$this->success();
  }
  public function list(){
    return $this->findAll('user = ?',[
      $this->_caller->gitId()
    ]);
  }
}