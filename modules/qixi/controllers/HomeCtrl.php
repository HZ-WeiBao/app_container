<?php

class HomeCtrl extends BaseCtrl {
  public function actionIndex($arg=array()){
    $this->updateStatistics();

    View::render('this',[
      'openid' => $_SESSION['openid'] ?? ''
    ]);
  }
  public function actionInbox(){
    View::render('this',[
      'openid' => $_SESSION['openid'] ?? ''
    ]);
  }
}