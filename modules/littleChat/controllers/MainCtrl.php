<?php

class MainCtrl extends BaseCtrl {
  public function actionIndex($args=array()){
    View::render('this');
  }
}