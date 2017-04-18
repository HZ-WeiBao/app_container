<?php

class HomeCtrl extends BaseCtrl {
  public function actionQuery(){
    global $_JSON;
    // @$_JSON->id = '4422316030957';
    // @$_JSON->name = '林莉';
    // @$_JSON->cardId = '';
    $count = 0;
    if($_JSON->id == '') $count++;
    if($_JSON->name == '') $count++;
    if($_JSON->cardId == '') $count++;

    if($count <= 1){
      $data = $this->Proxy->mandarin->get($_JSON->id,$_JSON->name,$_JSON->cardId);
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
}