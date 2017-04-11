<?php

class HomeCtrl extends BaseCtrl {
  public function actionReadBackup(){
    var_dump($this->edu_cetModel->findOne('sid = ?',array($_POST['sid'])));
  }

  public function actionQuery(){
    global $_JSON;
    echo json_encode($this->Proxy->cet->get($_JSON->id, $_JSON->name));
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