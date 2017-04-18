<?php

class bingPicture extends __base__ {
  public function getData(){
    return $this->Curl->get()->direct->url('http://cn.bing.com/')->getResponse();
  }

  public function parse(){
    preg_match('/g_img={url: "(.+)\",/U',$this->raw,$match);
    return 'http://cn.bing.com'.$match[1];
  }

  public function store(){}
}