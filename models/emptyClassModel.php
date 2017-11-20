<?php

class emptyClassModel extends Sql {
  public function get($ls,$le,$bd,$wd,$week,$noneWeekly){
    //数据库的访问
    $sql = 
    "SELECT DISTINCT `room` FROM `edu_classroom_list` WHERE `room` not in (
      SELECT `room` FROM `edu_classroom_activity` WHERE ((`sectionStart` <= {$ls} and `sectionEnd` >= {$ls} ) OR ( `sectionStart` <= {$le} and `sectionEnd` >= {$le}) or (`sectionStart` >= {$ls} and `sectionEnd` <= {$le})) and `building` = {$bd} and `weekDay` = {$wd} and (`weekHaveClass` like '%,{$week}' OR `weekHaveClass` like '%,{$week},%' or `weekHaveClass` like {$week} or `weekHaveClass` like '{$week},%') and `weekly` <> {$noneWeekly}
          UNION
      SELECT `room` FROM `edu_classroom_course` WHERE ((`sectionStart` <= {$ls} and `sectionEnd` >= {$ls} ) OR ( `sectionStart` <= {$le} and `sectionEnd` >= {$le}) or (`sectionStart` >= {$ls} and `sectionEnd` <= {$le})) and `building` = {$bd} and `weekDay` = {$wd} and (`weekHaveClass` like '%,{$week}' OR `weekHaveClass` like '%,{$week},%' or `weekHaveClass` like {$week} or `weekHaveClass` like '{$week},%') and `weekly` <> {$noneWeekly}
      )
    and `building` = {$bd}
    ";
    //不绑定参数看看~~
    return $this->query($sql);
  }
}