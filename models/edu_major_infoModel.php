<?php

class edu_major_infoModel extends Sql {
  public function write($majors){
    $this->truncate();

    foreach($majors as $major){
      if(isset($major['course']))
      foreach($major['course'] as $course){
        $name = explode('|',$major['name']);
        $course['room'] = str_replace('(金)','',$course['room']);

        $week_result = $this->_caller->explodeWeek($course['week']);
        $sections = $this->_caller->explodeSections($course['section']);

        $this->id = $name[0];
        $this->name = $name[1];
        $this->teacher = $course['teacher'];
        $this->class = $course['class'];
        $this->classType = $course['classType'];
        $this->room = $course['room'];
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