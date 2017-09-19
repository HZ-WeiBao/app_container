<?php

class edu_cet_backupModel extends Sql {
  public function get($openid){
    if($this->findOne('openid = ?',[$openid])->success()){
      return $this;
    }else{
      $className = __CLASS__;
      $item = new $className;
      $item->openid = $openid;
      $this->_caller->{$className} = $item;
      return $item;
    }
  }
}