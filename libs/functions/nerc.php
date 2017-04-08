<?php

class nerc extends __base__ {
  public function getParams(){
    $page = $this->getDom(
      $this->Curl->get()->direct
        ->url('http://chaxun.neea.edu.cn/examcenter/query.cn?op=doQueryCond&sid=300&pram=results')
        ->getResponse() );

    $params = array();
    $this->getOptionsTo($params['examinTime'],
      $page->getElementsByTagName('select'),'ksnf');

    $this->getOptionsTo($params['level'],
      $page->getElementsByTagName('select'),'bkjb');

    $params['province'] = (array)$this->Curl->get()->direct
      ->url('http://chaxun.neea.edu.cn/examcenter/querydata.cn?op=doQuerySF&examid=4723')
      ->getResponse()->json();

    return $params;
  }
  public function getCaptcha(){
    return $this->Curl->get()->direct
      ->url('http://chaxun.neea.edu.cn/examcenter/myimage.jsp')
      ->getResponse();
  }
  public function getData(){
    
  }
  public function parse(){}
  public function store(){}

  public function get($post = array()){
    foreach($post as $key=>$value)
      $this->{$key} = $value;
    return $this->data;
  }

  public function getSession(){//获取JSESSION
    return $this->Curl->_cookies['JSESSIONID'];
  }
  public function setSession($sessionid){
    $this->Curl->cookies(array(
      'JSESSIONID' => $sessionid
    ));
  }
  public function getPool(){//获取JSESSION
    return $this->Curl->_cookies['BIGipServercet46-chaxun-pool'];
  }
  public function setPool($poolid){
    $this->Curl->cookies(array(
      'BIGipServercet46-chaxun-pool' => $poolid
    ));
  }
}