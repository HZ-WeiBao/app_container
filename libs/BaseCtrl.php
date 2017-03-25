<?php

class BaseCtrl extends Component {

  public function init(){}
  public function _init(){}

  public function actionIndex(){
    View::render('layoutF',[
      'content' => View::render('Home/Index',[],true),
      'config' => $this->ConfigMgr,
    ]);
  }

  public function __destruct(){
    //这里可以做一个hook比如config自动保存之类的
  }
}