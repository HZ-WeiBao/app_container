<?php

class module_statisticsModel extends Sql {
  public function get($moduleName){
    if($this->findOne('moduleName = "'.$moduleName.'"')->success()){
      return $this;
    }else{
      $log = new self;
      $log->moduleName = F::$R->module;
      $this->_caller->{self} = $log;
      return $log;
    }
  }

  public function inc($columnName){
    $this->{$columnName} = intval($this->{$columnName}) + 1;
    return $this;
  }

  public function dec($columnName){
    if($this->{$columnName} != '0'){
      $i = intval($this->{$columnName}) - 1;
      $this->{$columnName} = $i;
    }else{
      $this->{$columnName} = 0;
    }
    return $this;
  }
}