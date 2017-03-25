<?php

class emptyClassModel extends Sql {
  public function get($ls,$le,$bd,$wd,$week,$noneWeekly){
    //数据库的访问
    $sql = 
    "SELECT `full_name`,`floor` FROM `edu_all_classrooms` WHERE `full_name` not in (
      SELECT `full_name` FROM `edu_temp_activity_of_room` WHERE ((`section_start` <= {$ls} and `section_end` >= {$ls} ) OR ( `section_start` <= {$le} and `section_end` >= {$le})) and `building` = {$bd} and `week_day` = {$wd} and (`week_have_class` like '%,{$week}' OR `week_have_class` like '%,{$week},%' or `week_have_class` like {$week} or `week_have_class` like '{$week},%') and `weekly` <> {$noneWeekly}
          UNION
      SELECT `full_name` FROM `edu_kebiao_of_room` WHERE ((`section_start` <= {$ls} and `section_end` >= {$ls} ) OR ( `section_start` <= {$le} and `section_end` >= {$le})) and `building` = {$bd} and `week_day` = {$wd} and (`week_have_class` like '%,{$week}' OR `week_have_class` like '%,{$week},%' or `week_have_class` like {$week} or `week_have_class` like '{$week},%') and `weekly` <> {$noneWeekly}
      )
    and `building` = {$bd}
    ";
    //不绑定参数看看~~
    return $this->query($sql);
  }
}