<?php

class HomeCtrl extends BaseCtrl {
  public function actionIndex($arg=null){
    $cache = [];
    if(isset($_SESSION['openid'])){
      $backup = $this->edu_cet_backupModel;
      $backup->findOne('openid = ?', [$_SESSION['openid']]);

      if($backup->success()){
        $cache['id'] = $backup->id;
        $cache['name'] = $backup->name;
      }
    }
    parent::actionIndex($cache);
  }

  public function actionQuery(){
    global $_JSON;
    if($_JSON->id != '' && $_JSON->name != ''){
      $data = $this->Proxy->cet->get($_JSON->id, $_JSON->name);
      if($data){
        if($data  == '数据库连接异常')
          View::render('Home_/Error',array(
            'message' => '查询失败<br>查询的服务器数据库宕机了[悲允]~'
          ));
        else
          View::render('Home/Result',array(
            'data' => $data
          ));
      }else
        View::render('Home_/Error',array(
          'message' => '查询失败<br>请检查号码有没有输入错误~'
        ));
    }else
      View::render('Home_/Error',array(
        'message' => '请把信息填写完整~'
      ));
  }
  public function actionBackup(){
    global $_JSON;
    
    if(isset($_SESSION['openid'])){
      $this->edu_cet_backupModel->get($_SESSION['openid']);
      $this->edu_cet_backupModel->id = $_JSON->id;
      $this->edu_cet_backupModel->name = $_JSON->name;
      
      $this->edu_cet_backupModel->save();
      $message = '成功~';
    }else{
      $message = '需要从后台回复`四六级`,<br>再点进来这个页面,<br>不然不够信息备份的~~';
    }
    View::render('Home_/Error',array(
      'message' => $message
    ));
  }
  public function actionGetCaptcha(){
    global $_JSON;
    $captcha = @$this->Proxy->cetNeea->getCaptcha($_JSON->id);
    echo 'data:image/*;base64,'.base64_encode($captcha);
    // echo $captcha;
  }
}