<?php

class edu_classroom_activityModel extends Sql {
  //如果是跨多表操作的话,建议是使用new的方式,因为sql里面虽然是继承了component,但是还是get的请求没有触发到那里面去的
  public function write($campuses){
    $this->truncate();
    foreach($campuses as $campus){
      foreach($campus['buildings'] as $building){
        foreach($building['rooms'] as $room){
          if(isset($room['activity']))
          foreach($room['activity'] as $activity){
            //格式化数据
            $week_result = $this->_caller->explodeWeek($activity['week']);
            $sections = $this->_caller->explodeSections($activity['section']);
            $room['name'] = str_replace('(金)','',$room['name']);
            
            $this->name = $activity['name'];
            $this->room = $room['name'];
            $this->building = $building['name'];
            $this->organization = $activity['organization'];
            $this->weekly = $this->_caller->weeklyToNum($sections[4]);
            $this->weekDay = $this->_caller->weekToNum($sections[1]);
            $this->sectionStart = $sections[2];
            $this->sectionEnd = ($sections[3] != '')?$sections[3]:$sections[2];
            $this->weekHaveClass = implode(',',$week_result);
            $this->save();
          }
        }
      }
    }
  }
}