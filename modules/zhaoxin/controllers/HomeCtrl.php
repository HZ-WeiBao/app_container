<?php

class HomeCtrl extends BaseCtrl {
  public function actionIndex($arg=array()){
    $this->updateStatistics();

    View::render('this',[
      'home' => View::render(F::$R->controller.'/Home', [], true)
    ]);
  }
}