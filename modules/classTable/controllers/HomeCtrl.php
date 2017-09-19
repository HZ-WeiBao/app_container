<?php

class HomeCtrl extends BaseCtrl {

  public function actionQuery(){
    //输入数据的预处理
    $majorName = $_GET['majorName'] ?? null;
    
    $week = $this->Proxy->weekNumber();

    echo json_encode($this->classTableModel->get($majorName));
  }
}