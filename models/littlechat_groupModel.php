<?php

class littlechat_groupModel extends Sql {
  public function __construct($groupId=null){
    $this->_id = $groupId;
  }
  public function getId(){
    return $this->_id;
  }
  public function new($name){
    $this->init();
    $this->name = $name;
    $this->owner = $this->_caller->getId();
    $this->time = time();
    $this->save();

    if($this->success()){
      $id = $this->lastInsertId();
      $letter = new littlechat_group_userModel;
      $letter->group = $id;
      $letter->user = $this->_caller->getId();
      $letter->comfirm = 1;
      $letter->save();
      return (bool)$this->success();
    }
  }
  public function invite($whoId){
    if($id = $this->getId() != null){
      $this->findOne('id = ?',[$id,]);
      if($this->can_member_invite ?? $this->owner == $this->_caller->getId()){
        $letter = new littlechat_group_userModel;
        $letter->group = $this->getId();
        $letter->user = $whoId;
        $letter->save();
        return true;
      }
    }else{
      //我好想使用Hook来做这个判断啊~但是性能啊~~
      throw new ErrorException('请在construct指定groupId~');
      return false;
    }
  }
  public function uninvite($whoId){
    if($id = $this->getId() != null){
      $this->findOne('id = ?',[ $id ]);
      if($this->can_member_invite ?? $this->owner == $this->_caller->getId()){
        $letter = new littlechat_group_userModel;
        $letter->findOne('group = ? and user = ?',[
          $this->getId(), $whoId
        ]);
        if(!$this->comfirm)
          $letter->del();
        return (bool)$this->success();
      }
    }else{
      throw new ErrorException('请在construct指定groupId~');
      return false;
    }
  }
  public function join(){ //收到邀请之后确认
    if($id = $this->getId() != null){
      $letter = new littlechat_group_userModel();
      if( $letter->findOne('group = ? and user = ?',[
        $id, $this->_caller->getId()
      ])->success() ){
        $letter->comfirm = 1;
        $letter->save();
        return (bool)$letter->success();
      }
    }else{
      throw new ErrorException('请在construct指定groupId~');
      return false;
    }
  }
  public function leave(){
    if($id = $this->getId() != null){
      $letter = new littlechat_group_userModel();
      if( $letter->findOne('group = ? and user = ?',[
        $id, $this->_caller->getId()
      ])->del()->success() ){
        return (bool)$letter->success();
      }
    }else{//真的好多重复啊
      throw new ErrorException('请在construct指定groupId~');
      return false;
    }
  }
  public function notice($content){
    if($id = $this->getId() != null){
      $this->findOne('id = ?',[ $id ]);
      if( $this->owner == $this->_caller->getId() ){
        $this->notice = $content;
        $this->save();
        return (bool)$this->success();
      }
    }else{
      throw new ErrorException('请在construct指定groupId~');
      return false;
    }
  }
  public function rename($newName){
    if($id = $this->getId() != null){
      $this->findOne('id = ?',[ $id ]);
      if( $this->owner == $this->_caller->getId() ){//确认是否是组员
        $this->name = $newName;
        $this->save();
        return (bool)$this->success();
      }
    }else{
      throw new ErrorException('请在construct指定groupId~');
      return false;
    }
  }
}