<?php

class HomeCtrl extends BaseCtrl {
  public function actionIndex($arg=[]){
    $adminConfig = new ConfigMgr('admin');
    $lastUpdateTime = $adminConfig->module->emptyClass->lastUpdateTime;
    
    parent::actionIndex([
      'lastUpdateTime' => date('Y-m-d', strtotime($lastUpdateTime))
    ]);
  }
  
  public function actionSearchCourse(){
    if(isset($_GET['keyWord']) && isset($_GET['type'])){
      $keyword = $_GET['keyWord'];
      $type = $_GET['type'];

      //class的话先模糊搜索,再查看详细
      if($type === 'class')
        echo json_encode(
          $this->edu_major_listModel->findAll('`name` LIKE ?',
            array("%{$keyword}%"))
        );

      //teacher就输出这个老师的课程就是了
      elseif ($type === 'teacher') {
        echo json_encode(
          $this->edu_major_infoModel->findAll('`teacher` LIKE ?',
            array("%{$keyword}%"))
        );
      }

      
    }
  }
  public function actionCourseDetial(){
    if(isset($_GET['id'])){
      echo json_encode(
        $this->edu_major_infoModel->findAll('`id` = ?',
          array($_GET['id']))
      );
    }else{
      echo json_encode([]);
    }
  }
}