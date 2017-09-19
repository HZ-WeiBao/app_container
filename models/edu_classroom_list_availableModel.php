<?php

class edu_classroom_list_availableModel extends Sql {
  //如果是跨多表操作的话,建议是使用new的方式,因为sql里面虽然是继承了component,但是还是get的请求没有触发到那里面去的
  public function write(){
    $this->truncate();
    $this->query('
      INSERT INTO `edu_classroom_list_available`(`room`,`building`) SELECT `room`,`building` FROM (
        SELECT `room`,`building` FROM `edu_classroom_course`
        UNION 
        SELECT `room`,`building` FROM `edu_classroom_activity`
      ) AS temp
    ');
  }
}