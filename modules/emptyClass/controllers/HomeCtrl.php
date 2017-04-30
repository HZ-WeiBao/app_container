<?php

class HomeCtrl extends BaseCtrl {

  public function actionQuery(){
    //js jq react,
    //输入数据的预处理
    $wd = isset($_GET['wd'])?intval($_GET['wd'])-1:null;
    $ls = isset($_GET['ls'])?intval($_GET['ls']):null;
    $le = isset($_GET['le'])?intval($_GET['le']):null;
    $bd = isset($_GET['bd'])?intval($_GET['bd']):null;
    
    $week = $this->Proxy->weekNumber();
    $noneWeekly = ($week%2)?2:1;
    //数据获取输出
    echo json_encode($this->emptyClassModel->get(
      $ls,$le,$bd,$wd,$week,$noneWeekly));
  }

  public function actionTest(){
    $this->Proxy->Hook->after('weekNumber',function(&$result){
      echo '<br>传进来之前:'.$result;
      echo '<br>加1';
      $result++;
      return $result;//通过return返回修改之后的结果
    });
    echo '<br>'.$this->Proxy->weekNumber();
  }
}