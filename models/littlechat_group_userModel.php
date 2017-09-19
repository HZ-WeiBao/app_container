<?php

class littlechat_group_userModel extends Sql {
  public function __construct($groupId){
    $this->_group = $groupId;
    $this->_user = $this->_caller->getId();
  }
  public function get($variable){
    $nickname = $this->findOne('group = ? and user = ?',[
      $this->_group, $this->_user
    ]);
    if($this->success())
      return $nickname->$variable;
    return false;
  }
  public function set($variable, $value){
    $nickname = $this->findOne('group = ? and user = ?',[
      $this->_group, $this->_user
    ]);
    if($this->success()){
      $this->$variable = $value;
      $this->save();
    }else{
      $this->init();
      $this->group = $this->_group;
      $this->user = $this->_user;
      $this->$variable = $value;
      $this->save();
    }
    return (bool)$this->success();
  }
  public function list(){
    return $this->findAll('group = ?',[
      $this->_group
    ]);
  }
}