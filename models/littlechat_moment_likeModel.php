<?php

class littlechat_moment_likeModel extends Sql {
  public function __construct($user,$moment_time){
    $this->_user = $user;
    $this->_moment_time = $moment_time;
  }
  public function like(){
    $this->init();
    $this->user = $this->_user;
    $this->moment_time = $this->_moment_time;
    $this->like_user = $this->_caller->getId();
    $this->save();
    return (bool)$this->success();
  }
  public function unlike(){
    $this->findOne('user = ? and moment_time = ? and like_user = ?',[
      $this->_user , $this->_moment_time , $this->_caller->getId()
    ])->del();
    return (bool)$this->success();
  }
  public function list($whoId){//应该是叫watcher才对的~~
    return $this->query('
select like_user from littlechat_moment_like where
  exists (
    select * from littlechat_friends where
      ( littlechat_friends.sender = littlechat_moment_like.like_user and littlechat_friends.receiver = ? )
      or
      ( littlechat_friends.receiver = littlechat_moment_like.like_user and littlechat_friends.sender = ? )
  )
  and not exists (
    select * from littlechat_friends_blacklist where
      ( littlechat_friends_blacklist.user = littlechat_moment_like.like_user and littlechat_friends_blacklist.on_user = ? )
      or
      ( littlechat_friends_blacklist.on_user = littlechat_moment_like.like_user and littlechat_friends_blacklist.user = ? )
  )
    ',[
      $whoId, $whoId, $whoId, $whoId
    ]);
  }
}