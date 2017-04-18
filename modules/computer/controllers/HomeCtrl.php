<?php

class HomeCtrl extends BaseCtrl {

  public function actionIndex($args = []){
    $params  = $this->Proxy->nerc->getParams();
    $session = $this->Proxy->nerc->getSession();
    $pool    = $this->Proxy->nerc->getPool();
    
    parent::actionIndex(array(
      'params' => $params,
      'session' => $session,
      'pool' => $pool,
      'captcha' => ''
    ));
  }

  public function actionGetProvince(){
    echo json_encode($this->Proxy->nerc->getProvince($_GET['id']));
  }

  public function actionQuery(){
    global $_JSON;
    @$this->Proxy->nerc->setSession($_JSON->session);
    @$this->Proxy->nerc->setPool($_JSON->pool);
    @$this->Proxy->nerc->setVerify($_JSON->verify);

    if($_JSON->name != '' && 
      $_JSON->cardId != '' && 
      $_JSON->examTime != '' && 
      $_JSON->examLevel != '' &&
      $_JSON->captcha != ''){
      $result = @$this->Proxy->nerc->get($_JSON);
      echo $result;
    }else{
      View::render('Home_/Error',array(
        'message' => '请把数据填写完整哦~'
      ),false,true);
    }
    
  }

  public function actionGetCaptcha(){
    global $_JSON;
    @$this->Proxy->nerc->setSession($_JSON->session);
    @$this->Proxy->nerc->setPool($_JSON->pool);

    $captcha = $this->Proxy->nerc->getCaptcha();
    echo json_encode(array(
      'src' => 'data:image/*;base64,'.base64_encode($captcha),
      'verify' => $this->Proxy->nerc->getVerify()
    ));
  }
}