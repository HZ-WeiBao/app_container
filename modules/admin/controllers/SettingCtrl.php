<?php

class SettingCtrl extends BaseCtrl {
  public $updateFiled = array(
    'emptyClass' => array('classRoomInfo'),
    'auditor' => array('majorInfo'),
    'oneSaying' => array('youngGirlForum')
  );

  private function page($setting){
    $this->moduleConfig = new ConfigMgr(lcfirst(F::$R->action));
    View::render('Setting/Index',array(
      'module' => lcfirst(F::$R->action),
      'config' => $this->moduleConfig,
      'setting' => $setting
    ));
  }
  public function __call($func,$args){
    $this->page('');
  }
  
  public function actionAdmin(){
    $this->page(View::render('this',array(
      'config' => $this->ConfigMgr
    ),true));
  }

  public function actionEmptyClass(){
    $this->page(View::render('Setting/EduUpdate',array(
      'config' => $this->ConfigMgr->module->{lcfirst(F::$R->action)},
      'captcha' => 'data:image/*;base64,'.base64_encode($this->Proxy->getCaptcha()),
      'sessionId'=> $this->Proxy->getSession()
    ),true));
  }
  public function actionAuditor(){
    $this->page(View::render('Setting/EduUpdate',array(
      'config' => $this->ConfigMgr->module->{lcfirst(F::$R->action)},
      'captcha' => 'data:image/*;base64,'.base64_encode($this->Proxy->getCaptcha()),
      'sessionId'=> $this->Proxy->getSession()
    ),true));
  }
  public function actionOneSaying(){
    $this->page(View::render('this',array(
      'config' => $this->ConfigMgr->module->{lcfirst(F::$R->action)}
    ),true));
  }
  
  public function actionStatusSwitch(){
    global $_JSON;

    if(in_array($_JSON->switchTo,array('normal','maintain','close'))){
      
      $config = new ConfigMgr($_JSON->module);
      $config->status = $_JSON->switchTo;
      $config->save();
      echo 'done';
    }else{
      header('HTTP/1.1 404 Argument Error');
    }
  }

  public function actionUpdate(){
    global $_JSON;

    $config = new ConfigMgr($_JSON->module);
    $config->status = 'maintain';
    $config->save();

    if($_JSON->module == 'oneSaying'){
      echo '开始更新~';
      if(function_exists('fastcgi_finish_request'))
        fastcgi_finish_request();

      $this->ConfigMgr->module->{$_JSON->module}->isUpdating = true;
      $this->ConfigMgr->save();

      $this->Proxy->youngGirlForum->setLastUpdateTime($this->ConfigMgr->module->{$_JSON->module}->lastUpdateTime);

      ignore_user_abort(true);

      $this->Proxy->updateFields($this->updateFiled[$_JSON->module]);

      $this->ConfigMgr->module->{$_JSON->module}->isUpdating = false;
      $this->ConfigMgr->module->{$_JSON->module}->lastUpdateTime = $this->Proxy->youngGirlForum->getLatestTime();
      $this->ConfigMgr->save();
      
      $config->status = 'normal';
      $config->save();

    }else{//针对emptyClass 还有 auditor的
      $this->Proxy->setSession($_JSON->sessionId);
      if($check = $this->Proxy->login(Proxy::$sid, Proxy::$pwd, $_JSON->captcha)){
        echo '开始更新~';
        if(function_exists('fastcgi_finish_request'))
          fastcgi_finish_request();

        $this->ConfigMgr->module->{$_JSON->module}->isUpdating = true;
        $this->ConfigMgr->save();

        ignore_user_abort(true);
        ini_set('memory_limit', '128M');

        $this->Proxy->updateFields($this->updateFiled[$_JSON->module]);

        $this->ConfigMgr->module->{$_JSON->module}->isUpdating = false;
        $this->ConfigMgr->module->{$_JSON->module}->lastUpdateTime = date('Y-m-d h:m');
        $this->ConfigMgr->save();
        
        $config->status = 'normal';
        $config->save();
      }else{
        echo $check;
      }
    }
  }
  public function actionSwitch(){
    global $_JSON;

    if(isset($this->ConfigMgr->switcher->{$_JSON->name})){
      $this->ConfigMgr->switcher->{$_JSON->name} = $_JSON->to;
      $this->ConfigMgr->save();
      echo 'done';
    }else{
      echo 'none';
    }
  }
}