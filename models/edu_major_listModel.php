<?php

class edu_major_listModel extends Sql {
  public function write($majors){
    $this->truncate();
    foreach($majors as $major){
      $name = explode('|',$major['name']);
      $this->id = $name[0];
      $this->name = $name[1];
      $this->save();
    }
  }
}