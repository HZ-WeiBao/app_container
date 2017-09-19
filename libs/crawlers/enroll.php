<?php

class enroll extends __base__ {
  public function getData(){
    $posfield = "by={$this->by}&sqltext={$this->value}&Submit=%B5%E3%BB%F7%B2%E9%D1%AF";

    return $this->Curl->post()->direct
      ->url('http://zs.hzu.edu.cn/result/result.asp')
      ->referer('http://zs.hzu.edu.cn/result/index.asp')
      ->data($posfield)
      ->getResponse();
  }
  public function parse(){
    if(strpos($this->raw,'result1.htm') !== false)
      return '查询不到此考生~';

    $i = function($tds,$num){
      $str = trim($tds->item($num)->textContent);
      $str = str_replace('　','',$str);
      return $str;
    };

    try{
      foreach ($this->dom->getElementsByTagName('table') as $table) {
        if($table->getAttribute('class') == 'messageBlock'){
          $tds = $table->getElementsByTagName('td');

          $info = array(
            '姓名'=>      $i($tds,3),
            '考生号'=>    $i($tds,1),
            '身份证号'=>  $i($tds,5),
            '录取专业'=>  $i($tds,7),
            '培养层次'=>  $i($tds,9),
            '生源所在地'=>$i($tds,11),
            '录取通知书邮寄单号'=>$i($tds,13)
          );

          break;
        }
      }
    }catch(Error $e){
      return false;
    }
    return $info;
  }
  public function store(){}

  public function get($post){
    foreach($post as $key=>$value)
      $this->{$key} = $value;
    
    // $this->edu_gaokaoModel->write($post);

    return $this->data;
  }
}