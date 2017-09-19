<?php

class littlechat_userModel extends Sql {
  use lazyGetCall;
  protected $id = null;

  public function __construct($id=null){
    $this->id = id;
  }
  public function getId(){
    return $this->id;
  }
  public function login($name, $pwd){
    //只是md5的在哪里生成而已,应该是在前端生成的,这部分逻辑到时候再细化就好了
    $this->findOne('name = ? and password = ?',[$name,$pwd]);
    return ($this->success() == 1)? true: false;
  }
  public function logout(){
    $this->init();
  }
  public function resetPassword($newPwd){
    //需要加载了id的情况去操作咯
    $this->password = $newPwd;
    $this->save();
    return $this->success();
  }
  public function register($name,$pwd){
    $this->init();
    $this->name = $name;
    $this->pwd = $pwd;
    $this->save();
  }
  public function exists($name){
    $this->findOne('name = ?',[$name]);
    return $this->success();
  }
}

trait lazyGetCall {
  public function get__($variable){
    if($variable == 'profile'){//这是不应该共享的,但是但是,唉算了
      $this->findOne('id = ?',[$this->id]);
      return $this;
    }elseif(class_exists('littlechat_'.$variable.'Model')){
      $classname = 'littlechat_'.$variable.'Model';
      $class = new $classname;
      $class->caller = $this;
      $this->$variable = $class;
      return $class;
    }
    if($result = parent::get__() != null)
      return $result;
  }
  public function __call($func,$args){
    if(class_exists('littlechat_'.$func.'Model')){
      $classname = 'littlechat_'.$func.'Model';
      $class = new $classname($args);
      $class->caller = $this;
      $this->$func = $class;
      return $class;
    }
  }
}
trait commonlistfunc {
  public function __construct($user=null){
    if($user != null)
      $this->_user = $user;
  }
  public function list(){
    $id = $this->_user ?? $this->_caller->getId();
    return $this->setRange(['on_user'])
      ->findAll('user = ?',$id);
  }
  public function check($whoId){
    $id = $this->_user ?? $this->_caller->getId();
    if(!isset( $this->_list )){
      $id = $id;
      $this->findOne('user = ? and on_user = ?',[
        $id , $whoId
      ]);
      return (bool)$this->success();
    }else{
      return in_array($whoId, $this->_list);
    }
  }
  public function makeCache(){
    $this->_list = $this->list();
  }
  public function add($whoId){
    $id = $this->_user ?? $this->_caller->getId();
    $this->init();
    $this->user = $id;
    $this->on_user = $whoId;
    $this->save();
    return (bool)$this->success();
  }
  public function remove($whoId){
    $id = $this->_user ?? $this->_caller->getId();
    $this->findOne('user = ? and on_user = ?',[
      $id , $whoId
    ])->del();
    return (bool)$this->success();
  }
}