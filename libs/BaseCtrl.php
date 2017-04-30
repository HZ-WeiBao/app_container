<?php

class BaseCtrl extends Component {

  public function init(){
    if($this->ConfigMgr->status != 'normal'){
      
      $module_statisticsModel = new module_statisticsModel;
      $module_commentModel = new module_commentModel;
      
      View::render('layout_',[
        'content' => View::render('Home_/Maintain', array() ,true),
        'config' => $this->ConfigMgr,
        'statistics' => $module_statisticsModel->get(F::$R->module),
        'commentNum' => $module_commentModel->numOf(F::$R->module)
      ],false);

      exit();
    }
  }

  public function actionIndex($arg=array()){
    $module_statisticsModel = new module_statisticsModel;
    $module_commentModel = new module_commentModel;

    $adminConfig = new ConfigMgr('admin');
    if($adminConfig->switcher->logCount == 'on')
      $module_statisticsModel->get(F::$R->module)->inc('useNum')->save();
      
    View::render('layout_',[
      'content' => View::render(F::$R->controller.'/Index',$arg,true),
      'config' => $this->ConfigMgr,
      'statistics' => $module_statisticsModel->get(F::$R->module),
      'commentNum' => $module_commentModel->numOf(F::$R->module)
    ],false);
  }

  // public function __destruct(){
  //   //这里可以做一个hook比如config自动保存之类的
  // }
}