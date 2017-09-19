<?php

class yikao extends __base__ {
  public function getData(){
    $posfield = "by={$this->by}&sqltext={$this->value}&Submit=%C8%B7%B6%A8";

    return $this->Curl->post()->direct
      ->url('http://zs.hzu.edu.cn/yscx/result.asp')
      ->referer('http://zs.hzu.edu.cn/yscx/index.asp')
      ->data($posfield)
      ->getResponse();
  }
  public function parse(){
    if(strpos($this->raw,'查询不到此考生') !== false)
      return '查询不到此考生~';

    $i = function($tds,$num){
      $str = trim($tds->item($num)->textContent);
      $str = str_replace('　','',$str);
      return $str;
    };

    try{
      $table = $this->dom->getElementById('table2');
      $trs = $table->getElementsByTagName('tr');

      $td_name = $trs->item(0)->getElementsByTagName('td');
      $td_value = $trs->item(1)->getElementsByTagName('td');

      $info = array();

      for($j = 0 ; $j < $td_name->length - 1; $j++){
        $info[ $i($td_name,$j) ] = $i($td_value,$j);
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