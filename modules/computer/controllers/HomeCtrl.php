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

    $error = false;
    if($_JSON->name != '' && 
      $_JSON->cardId != '' && 
      $_JSON->examTime != '' && 
      $_JSON->examLevel != '' &&
      $_JSON->captcha != ''){
      $result = @$this->Proxy->nerc->get($_JSON);

      if($result === '抱歉，验证码错误！')
        $error = '验证码填错了~';
      elseif($result === '您查询的结果为空')
        $error = '查询结果为空~';
      else if($result){
        View::render('Home/Result',array(
          'data' => (object)$result)
        );
      }
    }else
      $error = '请把数据填写完整哦~';

    if($error !== false){
      View::render('Home_/Error',array(
        'message' => $error
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