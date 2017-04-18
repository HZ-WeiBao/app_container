<?php

class edu_mandarinModel extends Sql {
  public function write($data){
    foreach($data as $key=>$value)
      $this->{$key} = $value;
    $this->save();
  }
}