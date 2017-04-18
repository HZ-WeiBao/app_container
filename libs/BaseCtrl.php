<?php

class BaseCtrl extends Component {

  public function init(){}
  public function _init(){}

  public function actionIndex($arg=array()){
    // var_dump($this->module_statisticsModel->get(F::$R->module));
    $this->module_statisticsModel->get(F::$R->module)->inc('useNum')->save();
    View::render('layout_',[
      'content' => View::render('Home/Index',$arg,true),
      'config' => $this->ConfigMgr,
      'statistics' => $this->module_statisticsModel->get(F::$R->module),
      'commentNum' => $this->module_commentModel->numOf(F::$R->module)
    ],false);
  }

  public function __destruct(){
    //这里可以做一个hook比如config自动保存之类的
  }
}