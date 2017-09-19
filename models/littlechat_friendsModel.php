<?php

class littlechat_friendsModel extends Sql {
  public function list(){
    $id = $this->_caller->getId();
    $this->_list = $this->query('
      select id,name,nickname from littlechat_user where 
        id in (
          select sender from littlechat_friends 
            where comfirmed = 1 and receiver = ?
          union
          select receiver from littlechat_friends 
            where comfirmed = 1 and sender = ?
        )
        and not in (
          select on_user from littlechat_friends_blacklist where
            user = ?
        )
    ',[
      $id , $id , $id
    ]);
    return $this->_list;
  }
  public function add($whoId){
    //先找一下对方是否有发送过请求过来,不过我倒觉得做这个是不需要的咯~
    $this->findOne('(sender = ? and receiver = ?) or (sender = ? and receiver = ?)',[
      $whoId , $this->_calller->getId() , $this->_calller->getId() , $whoId
    ]);
    if($this->success())
      return false;
    
    //是否在对方的黑名单
    $who_blacklist = new littlechat_friends_blacklistModel();
    if($who_blacklist->check($this->_calller->getId()))
      return false;

    $this->init();
    $this->sender = $this->_calller->getId();
    $this->receiver = $whoId;
    $this->save();
    return $this->success();
  }
  public function remove($whoId){
    $this->findOne('( sender = ? and receiver = ? ) or ( sender = ? and receiver = ? )',[
      $whoId , $this->_calller->getId() , $this->_calller->getId() , $whoId
    ])->del();
    return (bool)$this->success();
  }
  public function check($whoId){
    if(!isset($this->_relationship)){
      $this->findOne('( sender = ? and receiver = ? ) or ( sender = ? and receiver = ? ) and comfirm = 1',[
        $whoId , $this->_calller->getId() , $this->_calller->getId() , $whoId
      ]);
      return (bool)$this->success();
    }else{
      return in_array($whoId,$this->_relationship);
    }
  }
  public function requireList(){
    return $this->findAll('comfirm = 0 and ( receiver = ? )',[
      $this->_calller->getId()
    ]);
  }
  public function comfirm($whoId){
    $this->findOne('sender = ? and reciever = ?',[
      $whoId, $this->_calller->getId()
    ]);
    $this->comfirm = 1;
    $this->save();
    return (bool)$this->success();
  }
  public function makeCache(){//还是先手动去设置缓存吧
    $temp = $this->findAll('(sender = ? or receiver = ? ) and comfirm = 1');
    //然后理顺一下,如果使用集合来考虑的话
    $this->_relationship = array_merge(array_key($temp),array_value($temp));
    //朋友信息的缓存
    $this->_list = $this->list();
  }
}