<?php

class HomeCtrlF extends BaseCtrl {

  public function init(){

  }

  public function actionFeedback(){
    $sid = '';
    if(isset($_COOKIE['wxid']))
      if($this->userModel->findOne('openid = ?', array($_COOKIE['wxid']))->success())
        $sid = $this->userModel->sid;

    $this->module_commentModel->sid = $sid;
    $this->module_commentModel->moduleName = F::$R->module;
    $this->module_commentModel->name = $_POST['name'];
    $this->module_commentModel->content = $_POST['content'];
    $this->module_commentModel->save();
  }

  public function actionGetFeedbackList(){
    $comments = $this->module_commentModel
      ->limit(1)->DESC()
      ->orderBy(array('time'))
      ->findAll('moduleName = ?', array(F::$R->module));
    var_dump($comments);
  }

  public function actionStatistics(){
    $this->module_statisticsModel->get(F::$R->module)->inc('useNum')->save();
  }

  public function actionLike(){
    $this->module_statisticsModel->get(F::$R->module)->inc('likeNum')->save();
  }

  public function actionUnLike(){
    $this->module_statisticsModel->get(F::$R->module)->dec('likeNum')->save();
  }

  public function actionSetting(){//设置留言是否显示,还有手动数据更新
    
  }
}