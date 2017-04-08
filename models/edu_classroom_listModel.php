<?php

class edu_classroom_listModel extends Sql {
  //如果是跨多表操作的话,建议是使用new的方式,因为sql里面虽然是继承了component,但是还是get的请求没有触发到那里面去的
  public function write($campuses){
    $this->truncate();
    foreach($campuses as $campus){
      foreach($campus['buildings'] as $building){
        foreach($building['rooms'] as $room){
          $room['name'] = str_replace('(金)','',$room['name']);

          $this->campus = $campus['name'];
          $this->building = $building['name'];
          $this->room = $room['name'];
          $this->save();
        }
      }
    }
  }
}