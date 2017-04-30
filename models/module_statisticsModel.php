<?php

class module_statisticsModel extends Sql {
  public function get($moduleName){
    if($this->findOne('moduleName = "'.$moduleName.'"')->success()){
      return $this;
    }else{
      $class = __CLASS__;
      $log = new $class;
      $log->moduleName = F::$R->module;
      $log->likeNum = 0;
      $log->useNum = 1;
      @$this->_caller->{__CLASS__} = $log;
      return $log;
    }
  }
}