<?php

class HomeCtrl extends BaseCtrl {
  public function actionSearchCourse(){
    if(isset($_GET['keyWord'])){
      $keyword = $_GET['keyWord'];
      echo json_encode(
        $this->edu_major_listModel->findAll('`name` LIKE ?',
          array("%{$keyword}%"))
      );
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