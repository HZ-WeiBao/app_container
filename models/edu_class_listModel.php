<?php

class edu_class_listModel extends Sql {
  public function write(array $options){//批量insert
    $this->truncate();
    foreach($options as $option){
      foreach($option as $key => $value){
        $this->{$key} = $value;
      }
      $this->save();
    }
  }
}