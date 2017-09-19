<?php

class HomeCtrl extends BaseCtrl {
  public function actionIndex($args=array()){
    View::render('this');
  }
  public function actionTest(){
    echo 'hello world~~';
  }
}