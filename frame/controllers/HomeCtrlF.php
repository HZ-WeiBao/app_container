<?php

class HomeCtrlF extends BaseCtrl {

  public function init(){}

  public function actionApps(){
    View::render('this');
  }

  public function actionComment(){
    global $_JSON;
    if($_JSON){
      $sid = '';
      if(isset($_COOKIE['wxid']))
        if($this->userModel->findOne('openid = ?', array($_COOKIE['wxid']))->success())
          $sid = $this->userModel->sid;

      $this->module_commentModel->sid = $sid;
      $this->module_commentModel->moduleName = F::$R->module;
      $this->module_commentModel->content = $_JSON->content;
      $this->module_commentModel->save();
    }else{
      $comments = $this->module_commentModel
        ->limit(10)->DESC()
        ->orderBy(array('time'))
        ->findAll('moduleName = ? and markStar = 1', array(F::$R->module));
      View::render('this',array('comments' => $comments));
    }
  }

  public function actionCommentLike(){
    global $_JSON;
    if(isset($_JSON->id)){
      $this->module_commentModel->findOne('id = ?',array($_JSON->id))
        ->inc('likeNum')
        ->save();
      echo $this->module_commentModel->likeNum;
    }
  }
  public function actionCommentUnLike(){
    global $_JSON;
    if(isset($_JSON->id)){
      $this->module_commentModel->findOne('id = ?',array($_JSON->id))
        ->dec('likeNum')
        ->save();
      echo $this->module_commentModel->likeNum;
    }
  }


  public function actionStatistics(){
    $this->module_statisticsModel->get(F::$R->module)->inc('useNum')->save();
  }

  public function actionLike(){
    $this->module_statisticsModel->get(F::$R->module)->inc('likeNum')->save();
    echo $this->module_statisticsModel->likeNum;
  }

  public function actionUnlike(){
    $this->module_statisticsModel->get(F::$R->module)->dec('likeNum')->save();
    echo $this->module_statisticsModel->likeNum;
  }

  public function actionSetting(){//设置留言是否显示,还有手动数据更新
    
  }

  public function actionAbout(){
    View::render('this',array(
      'config' => $this->ConfigMgr));
  }
}