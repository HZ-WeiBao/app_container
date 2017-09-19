<?php

class classTableModel extends Sql {
  public function get($majorName){
    //数据库的访问
    $sql = 
    "SELECT `teacher`,`sectionStart`,`sectionEnd`,`weekHaveClass`,`name`,`weekly`,`weekDay`,`room`,`class`,COUNT(DISTINCT `sectionStart`,`sectionEnd`,`weekHaveClass`,`name`,`weekly`,`weekDay`) FROM `edu_major_info` WHERE `class` LIKE '%{$majorName}%' AND (`classType` like '%必修课%' or `classType` LIKE '%专业课%') GROUP BY `sectionStart`,`sectionEnd`,`weekHaveClass`,`name`,`weekly`,`weekDay` order by `weekDay`";
    
    return $this->query($sql);
  }
}