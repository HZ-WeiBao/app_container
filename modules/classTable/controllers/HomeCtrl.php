<?php

class HomeCtrl extends BaseCtrl {

  public function actionIndex($args=[]){
    parent::actionIndex([
      'lastKeyWord' => $_SESSION['lastClassTableKeyWord'] ?? ''
    ]);
  }
  public function actionQuery(){
    //输入数据的预处理
    $majorName = $_GET['majorName'] ?? null;
    
    $week = $this->Proxy->weekNumber();
    $_SESSION['lastClassTableKeyWord'] = $majorName;

    echo json_encode($this->classTableModel->get($majorName));
  }
}