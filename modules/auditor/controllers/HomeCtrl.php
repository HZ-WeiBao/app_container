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
  public function actionGetCourseDetial(){
    if(isset($_GET['courseInfo'])){
      // $courseInfo = urldecode($_GET['courseInfo']);
      $courseInfo = $_GET['courseInfo'];
      echo json_encode(
        $this->edu_major_infoModel->findAll('`name` = ?',
          array($courseInfo))
      );
    }
  }
}