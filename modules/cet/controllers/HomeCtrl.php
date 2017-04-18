<?php

class HomeCtrl extends BaseCtrl {
  public function actionReadBackup(){
    var_dump($this->edu_cetModel->findOne('sid = ?',array($_POST['sid'])));
  }

  public function actionQuery(){
    global $_JSON;
    if($_JSON->id != '' && $_JSON->name != ''){
      $data = $this->Proxy->cet->get($_JSON->id, $_JSON->name);
      if($data)
        View::render('Home/Result',array(
          'data' => $data
        ));
      else
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
    // $this->edu_cetModel->sid = $_JSON->sid;
    //首先还是看一下是不是已经有的了如果有的话就是更新咯
    $this->edu_cetModel->id = $_JSON->id;
    $this->edu_cetModel->name = $_JSON->name;
    echo $this->edu_cetModel->save()->success();
  }
}