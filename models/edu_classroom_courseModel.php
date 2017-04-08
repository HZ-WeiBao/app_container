<?php

class edu_classroom_courseModel extends Sql {
  public function write($campuses){
    $this->truncate();
    foreach($campuses as $campus){
      foreach($campus['buildings'] as $building){
        foreach($building['rooms'] as $room){
          if(isset($room['course']))
          foreach($room['course'] as $course){
            //格式化数据
            preg_match('/\[(.+)\](.+)/',$course['name'],$name);

            $week_result = $this->_caller->explodeWeek($course['week']);
            $sections = $this->_caller->explodeSections($course['section']);
            $room['name'] = str_replace('(金)','',$room['name']);

            $this->id = $name[1];
            $this->name = $name[2];
            $this->room = $room['name'];
            $this->building = $building['name'];
            $this->teacher = $course['teacher'];
            $this->class = $course['class'];
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