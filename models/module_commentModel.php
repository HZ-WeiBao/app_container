<?php

class module_commentModel extends Sql {
  public function numOf($moduleName){
    return count($this->findAll('moduleName = ? and markStar = 1',array($moduleName)));
  }
}