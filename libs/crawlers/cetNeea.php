<?php

class cetNeea extends __base__ {
  public function transferCookies(){
    foreach ($_COOKIE as $key => $value) {
      if($key != 'PHPSESSID')
        $this->Curl->cookies(array(
          $key => $value
        ));
    }

    if(isset($this->pool))
      $this->Curl->cookies(array(
          'BIGipServercache.neea.edu.cn_pool' => $this->pool
        ));
  }
  public function getCaptcha($id){
    $this->transferCookies();
    $url = $this->Curl->get()->direct
      ->url('http://cache.neea.edu.cn/Imgs.do?ik='.$id.'&t=0.'.time())
      ->headers(array(
        'Accept' => 'image/*'
      ))
      ->referer('http://cet.neea.edu.cn/cet/')
      ->getResponse();

    //提取地址
    $url = str_replace('result.imgs("','',$url);
    $url = str_replace('");','',$url);
    
    if(strpos($url,'证号不能为空') !== false)
      return '';

    //获取数据
    return $this->Curl->get()->direct
      ->url($url)
      ->headers(array(
        'Accept' => 'image/*'
      ))
      ->getResponse();
  }

  public function getData(){
    $this->transferCookies();

    if($this->id[9] == '1'){
      $exameType = 'CET4_171_DANGCI';
    }elseif($this->id[9] == '2'){
      $exameType = 'CET6_171_DANGCI';
    }

    $post = 'data='.urlencode("{$exameType},{$this->id},{$this->name}");
    $post .= '&v='.$this->captcha;

    
    return $this->Curl->post()->direct
      ->url('http://cache.neea.edu.cn/cet/query')
      ->data($post)
      ->headers(array(
        'Host' => 'cache.neea.edu.cn',
        'Connection' => 'keep-alive',
        'Content-Length' => strlen($post),
        'Pragma' => 'no-cache',
        'Cache-Control ' => 'no-cache',
        'Origin' => 'http://cet.neea.edu.cn',
        'Upgrade-Insecure-Requests ' => '1',
        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3178.0 Safari/537.36',
        'Content-Type' => 'application/x-www-form-urlencoded',
        'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'DNT ' => '1',
        'Referer ' => 'http://cet.neea.edu.cn/cet/',
        'Accept-Encoding ' => 'gzip, deflate',
        'Accept-Language ' => 'zh-CN,zh;q=0.8',
      ))
      ->getResponse();
  }
  
  public function parse(){
    if(strpos($this->raw,'对不起，参数错误') !== false)
      return '对不起，参数错误';
    elseif(strpos($this->raw,'验证码错误') !== false)
      return '抱歉，验证码错误！';
    else{
      $str = $this->raw;
      $str = str_replace('<script>document.domain=\'neea.edu.cn\';</script><script>parent.result.callback("','',$str);
      $str = str_replace('");</script>','',$str);
      $str = str_replace('\'','"',$str);
      $str = preg_replace('/(\w+):/','"$1":',$str);

      return json_decode($str);
    }
  }
  public function store(){}

  public function get($post){
    foreach($post as $key=>$value)
      $this->{$key} = $value;
    // $this->edu_nercModel->write($post);

    return $this->data;
  }

  public function getPool(){//获取JSESSION
    if(isset($this->Curl->_cookies['BIGipServercache.neea.edu.cn_pool']))
      return $this->Curl->_cookies['BIGipServercache.neea.edu.cn_pool'];
    else
      return '';
  }
  public function setPool($poolid){
    $this->Curl->cookies(array(
      'BIGipServercache.neea.edu.cn_pool' => $poolid
    ));
  }
}