<?php

class edu_cetModel extends Sql {
  public function write($student){
    foreach($student as $key=>$value)
      $this->{$key} = $value;
    $this->save();
  }
}