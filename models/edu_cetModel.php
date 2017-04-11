<?php

class edu_cetModel extends Sql {
  public function write($student){
    foreach($student as $key=>$value)
      $this->{$key} = $value;
    $this->save();
  }
  public function get($sid){
    if($this->findOne('sid = "'.$sid.'"')->success()){
      return $this;
    }else{
      $item = new self;
      $item->{$sid} = $sid;
      $this->_caller->{self} = $item;
      return $item;
    }
  }
}