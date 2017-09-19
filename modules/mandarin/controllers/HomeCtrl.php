<?php

class HomeCtrl extends BaseCtrl {
  public function actionIndex($arg=null){
    $cache = [];
    if(isset($_SESSION['openid'])){
      $backup = $this->edu_mandarin_backupModel;
      $backup->findOne('openid = ?', [$_SESSION['openid']]);

      if($backup->success()){
        $cache['id'] = $backup->id;
        $cache['name'] = $backup->name;
        $cache['cardId'] = $backup->cardId;
      }
    }
    parent::actionIndex($cache);
  }
  public function actionQuery(){
    global $_JSON;
    $count = 0;
    if($_JSON->id == '') $count++;
    if($_JSON->name == '') $count++;
    if($_JSON->cardId == '') $count++;

    if($count <= 1){
      $data = $this->Proxy->mandarinNew->get($_JSON->id,$_JSON->name,$_JSON->cardId);

      if($data){
          View::render('Home/Result',array(
              'data' => (object)$data));
      }else{
          View::render('Home_/Error',array(
              'message' => '查询失败~<br>请检查号码有没有输入错误' ));
      }
    }else{
      View::render('Home_/Error',array(
            'message' => '至少填写两项~' ));
    }
  }
  public function actionBackup(){
    global $_JSON;
    
    if(isset($_SESSION['openid'])){
      $this->edu_mandarin_backupModel->get($_SESSION['openid']);
      $this->edu_mandarin_backupModel->id = $_JSON->id;
      $this->edu_mandarin_backupModel->name = $_JSON->name;
      $this->edu_mandarin_backupModel->cardId = $_JSON->cardId;
      
      $this->edu_mandarin_backupModel->save();
      
      $message = '成功~';
    }else{
      $message = '需要从后台回复`普通话`,<br>再点进来这个页面,<br>不然不够信息备份的~~';
    }
    View::render('Home_/Error',array(
      'message' => $message
    ));
  }
}