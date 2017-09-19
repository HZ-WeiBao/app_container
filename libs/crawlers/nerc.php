<?php

class nerc extends __base__ {
  public function getParams(){
    $page = $this->getDom(
      $this->Curl->get()->direct
        ->url('http://search.neea.edu.cn/QueryMarkUpAction.do?act=doQueryCond&sid=300&pram=results')
        ->getResponse() );
    
    $params = array();
    $this->getOptionsTo($params['examTime'],
      $page->getElementsByTagName('select'),'ksnf');

    $this->getOptionsTo($params['examLevel'],
      $page->getElementsByTagName('select'),'bkjb');

    $params['province'] = $this->getProvince($params['examTime'][0]['id']);

    return $params;
  }

  public function getProvince($id){
    return (array)$this->Curl->get()->direct
      ->url('http://search.neea.edu.cn/QueryDataAction.do?act=doQuerySfBkjb&examid='.$id)
      ->getResponse()->json();
  }

  public function getCaptcha(){
    return $this->Curl->get()->direct
      ->url('http://search.neea.edu.cn/Imgs.do?act=verify&t='.time())
      ->headers(array(
        'Accept' => 'image/*'
      ))
      ->getResponse();
  }
  public function getData(){
    return $this->Curl->post()->direct
      ->url('http://search.neea.edu.cn/QueryMarkUpAction.do?act=doQueryResults')
      ->data(http_build_query(array(
        'pram'=>'results',
        'ksxm'=>'300',
        'sf'=>'',
        'zkzh'=>'',
        'ksnf'=>$this->examTime,
        'bkjb'=>$this->examLevel,
        'name'=>$this->name,
        'sfzh'=>$this->cardId,
        'verify'=>$this->captcha
      )))
      ->referer('http://search.neea.edu.cn/QueryMarkUpAction.do?act=doQueryCond&sid=300&pram=results')
      ->getResponse();
  }
  public function parse(){
    if(strpos($this->raw,'抱歉，验证码错误！') !== false)
      return '抱歉，验证码错误！';
    elseif(strpos($this->raw,'您查询的结果为空') !== false)
      return '您查询的结果为空';
    else {
      $i = function($tds,$num){
        return trim($tds->item($num)->textContent);
      };

      foreach ($this->dom->getElementsByTagName('table') as $table) {
        if($table->getAttribute('class') == 'imgtab'){
          
          $imgSrc = 'http://cjcx.neea.edu.cn/';
          $imgSrc .= $table->getElementsByTagName('img')->item(0)->getAttribute('src');
          $tds = $table->getElementsByTagName('td');

          $grade = array(
            'id' =>     $i($tds,4),
            'cardId'=>  $i($tds,6),
            'name'=>    $i($tds,2),
            'examTime'=>$i($tds,10).'年'.$i($tds,14).'月',
            'score'=>   $i($tds,8),
            'grade'=>   $i($tds,12),
            'certificateId'=>$i($tds,6),
            'selfieUrl'=>$imgSrc
          );

          return $grade;
        }
      }

      return $this->raw;
    }
  }
  public function store(){}

  public function get($post){
    foreach($post as $key=>$value)
      $this->{$key} = $value;
    
    $this->edu_nercModel->write($post);

    return $this->data;
  }

  public function getSession(){//获取JSESSION
    return $this->Curl->_cookies['esessionid'];
  }
  public function setSession($sessionid){
    $this->Curl->cookies(array(
      'esessionid' => $sessionid
    ));
  }
  public function getPool(){//获取JSESSION
    return $this->Curl->_cookies['BIGipServersearchtest.neea.edu.cn_search.neea.cn_pool'];
  }
  public function setPool($poolid){
    $this->Curl->cookies(array(
      'BIGipServersearchtest.neea.edu.cn_search.neea.cn_pool' => $poolid
    ));
  }
  public function getVerify(){//获取JSESSION
    return $this->Curl->_cookies['verify'];
  }
  public function setVerify($verify){
    $this->Curl->cookies(array(
      'verify' => $verify
    ));
  }
}