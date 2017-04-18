<?php

class edu_nercModel extends Sql {
  public function write($data){
    $this->examTime = $data->examTime;
    $this->examLevel = $data->examLevel;
    $this->name = $data->name;
    $this->cardId = $data->cardId;
    $this->save();
  }
}