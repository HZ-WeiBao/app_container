<?php

class gaokao extends __base__ {
  public function getCaptcha(){
    return $this->Curl->get()->direct
      ->url('https://query-score.5184.com/web/captcha?random=0.'.time())
      ->headers(array(
        'Accept' => 'image/*'
      ))
      ->getResponse();
  }
  public function getData(){
    $verify = $this->Curl->get()->direct
      ->url('https://query-score.5184.com/web/captcha/verify?callback=jQuery180042006550200060877_'.time().'&verify_code='.$this->captcha.'&_='.time())
      ->getResponse();

    if(strlen($verify) != 76){
      return $verify;
    }

    return $this->Curl->get()->direct
      ->url('https://query-score.5184.com/web/score?callback=jQuery180042006550200060877_'.time().'&verify_code='.$this->captcha.'&issue_date=20170600&data_type=gk_cj&ksh='.$this->studentId.'&csrq='.$this->studentBrithday.'&_='.time())
      ->referer('http://page-resoures.5184.com/cjquery/w/gkcj/query.html?20170600gk_cj')
      ->getResponse();
  }
  public function parse(){
    if(strpos($this->raw,'高考成绩信息不存在') !== false)
      return '高考成绩信息不存在~';
    elseif(strpos($this->raw,'验证码') !== false)
      return '验证码不正确~';
    else {
      $this->raw = str_replace(');','',$this->raw);
      $this->raw = preg_replace('/\/\*\*\/[^\(]*\(/i','',$this->raw);
      return json_decode($this->raw);
    }
  }
  public function store(){}

  public function get($post){
    foreach($post as $key=>$value)
      $this->{$key} = $value;
    
    // $this->edu_gaokaoModel->write($post);

    return $this->data;
  }

  public function getSession(){//获取JSESSION
    return $this->Curl->_cookies['JSESSIONID'];
  }
  public function setSession($sessionid){
    $this->Curl->cookies(array(
      'JSESSIONID' => str_replace(';path=/;HttpOnly','',$sessionid)
    ));
  }
  public function getServerID(){//获取JSESSION
    return $this->Curl->_cookies['SERVERID'];
  }
  public function setServerID($serverID){
    $this->Curl->cookies(array(
      'SERVERID' => str_replace(';Path=/','',$serverID)
    ));
  }
  public function get_aliyungf_tc(){//获取JSESSION
    return $this->Curl->_cookies['aliyungf_tc'];
  }
  public function set_aliyungf_tc($aliyungf_tc){
    $this->Curl->cookies(array(
      'aliyungf_tc' => $aliyungf_tc
    ));
  }
}