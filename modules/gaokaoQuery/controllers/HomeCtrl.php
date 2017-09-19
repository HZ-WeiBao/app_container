<?php

class HomeCtrl extends BaseCtrl {

  public function actionIndex($args = []){
    $captcha = $this->Proxy->gaokao->getCaptcha();
    $session  = $this->Proxy->gaokao->getSession();
    $serverId = $this->Proxy->gaokao->getServerID();
    $aliyungf_tc = $this->Proxy->gaokao->get_aliyungf_tc();
    parent::actionIndex(array(
      'session' => $session,
      'serverId' => $serverId,
      'aliyungf_tc' => $aliyungf_tc,
      'captcha' => 'data:image/*;base64,'.base64_encode($captcha)
    ));
  }

  public function actionQuery(){
    global $_JSON;
    @$this->Proxy->gaokao->setSession($_JSON->session);
    @$this->Proxy->gaokao->setServerId($_JSON->serverId);
    @$this->Proxy->gaokao->set_aliyungf_tc($_JSON->aliyungf_tc);

    $error = false;
    if($_JSON->studentId != '' && 
      $_JSON->studentBrithday != '' && 
      $_JSON->captcha != ''){
      $result = @$this->Proxy->gaokao->get($_JSON);

      $serverId = $this->Proxy->gaokao->getServerID();
      if($result === '高考成绩信息不存在~')
        $error = '高考成绩信息不存在~~';
      elseif($result === '验证码不正确~')
        $error = '验证码不正确~~';
      else {
        View::render('this',array(
          'data' => $result->data
        ));
      }
    }else
      $error = '请把数据填写完整~~';

    if($error !== false){
      View::render('Home_/Error',array(
        'message' => $error
      ),false,true);
    }
  }

  public function actionGetCaptcha(){
    global $_JSON;
    @$this->Proxy->gaokao->setSession($_JSON->session);
    @$this->Proxy->gaokao->setServerId($_JSON->serverId);

    $captcha = $this->Proxy->gaokao->getCaptcha();
    $serverId = $this->Proxy->gaokao->getServerID();
    echo json_encode(array(
      'src' => 'data:image/*;base64,'.base64_encode($captcha),
      'serverId' => $serverId
    ));
  }
}