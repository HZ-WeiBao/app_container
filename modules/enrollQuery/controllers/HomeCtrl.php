<?php

class HomeCtrl extends BaseCtrl {

  public function actionQueryEnroll(){
    global $_JSON;

    $error = false;
    if($_JSON->studentId != '' || 
      $_JSON->cardId != ''
    ){
      $_JSON->by = ($_JSON->studentId != '')? 2 : 1;
      $_JSON->value = ($_JSON->studentId != '')? $_JSON->studentId : $_JSON->cardId;

      $result = @$this->Proxy->enroll->get($_JSON);

      if($result === '查询不到此考生~' || $result == null)
        $error = '查询不到此考生~~';
      else {
        View::render('this',array(
          'data' => $result
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
  public function actionQueryYiKao(){
    global $_JSON;

    $error = false;
    if($_JSON->studentId != '' || 
      $_JSON->cardId != ''
    ){
      $_JSON->by = ($_JSON->studentId != '')? 2 : 1;
      $_JSON->value = ($_JSON->studentId != '')? $_JSON->studentId : $_JSON->cardId;

      $result = @$this->Proxy->yikao->get($_JSON);
      
      if($result === '查询不到此考生~')
        $error = '查询不到此考生~~';
      else {
        View::render('this',array(
          'data' => $result
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
}