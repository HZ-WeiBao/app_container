<?php

class __base__ {
  public static $proxy;//这个静态变量不知道有没有用对,但是用得怪怪的

  public function getData(){}
  public function store(){}
  public function parse(){
    // HTTP/1.1 200 OK
    // Server: nginx/1.11.8
    // Date: Tue, 28 Feb 2017 07:44:54 GMT
    // Content-Type: image/jpeg
    // Content-Length: 25717
    // Last-Modified: Sat, 17 Sep 2016 07:44:26 GMT
    // Connection: keep-alive
    // ETag: "57dcf45a-6475"
    // Accept-Ranges: bytes

    //$this->raw->headers['Content-Type'] = 'image/jpeg'
    //要不要封装成$this->raw->type = 'image/jpeg'
    //我应该是怎么,如果返回默认是image/*的话,我应该是怎样处理?
    //还有一丢丢的事件
  }


  public function __invoke($params){
    return $this->data;
  }

  public function __get($variable){
    if($variable == 'raw'){
      $this->raw = $this->getData();
      return $this->raw;
    }elseif($variable == 'data'){
      $this->data = $this->parse();
      return $this->data;
    }elseif($variable == 'dom'){
      $dom = (string)$this->raw;
      $this->dom = new DOMDocument;
      @$this->dom->loadHTML($this->htmlFinishing($dom));
      return $this->dom;
    }
    //默认的行为
    return self::$proxy->{$variable};
  }

  public function __call($func, $params){
    //使用的一个优化,相当于公用变量,不过注入是通过那个啥注入的,用到的插件都需要手动进行一个转发咯
    //有限去判断的还是与class相关的
    if($func == 'store'){
      return call_user_func_array(array($this,$func),$params);
    }elseif(method_exists(self::$proxy,$func))
      return call_user_func_array(array(self::$proxy,$func),$params);
    elseif(method_exists(self::$proxy->Curl,$func))
      return call_user_func_array(array(self::$proxy->Curl,$func),$params);
    elseif(method_exists(self::$proxy->DataMgr,$func))
      return call_user_func_array(array(self::$proxy->DataMgr,$func),$params);
  }

  public function htmlFinishing($html) {
      $html = str_replace('<br>', '', $html);
      $html = str_replace('&nbsp;', '', $html);
      $html = '
          <meta
              http-equiv="Content-Type"
              content="text/html; charset=utf-8">' . $html;
      return $html;
  }
  //面对一些比较多级深度页面抓取的话,其实现在觉得这个dom的转化应该也是放在response里面的,算了这次手动就算咯
  public function getDom(string $domStr){
    $dom = new DOMDocument;
    @$dom->loadHTML($this->htmlFinishing($domStr));
    return $dom;
  }

  //一些通用的结构的数据抓取
  public function getOptionsTo(&$arr, $selects, $name){
    foreach($selects as $select){
      if($select->getAttribute('name') == $name){
        $options = $select->getElementsByTagName('option');

        //看来只能是foreach咯,这就是奇怪了,count是显示出只有一个元素的捏??
        foreach($options as $options){
          if($options->textContent !== ''){
            $arr[] = array(
              'id' => $options->getAttribute('value'),
              'name'=>$options->textContent
            );
          }
        }
      }
    }
  }
}