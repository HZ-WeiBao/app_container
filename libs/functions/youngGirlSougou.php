<?php

class youngGirlSougou extends __base__ {

  public function getSearchPage($pageNum, $timeStart, $timeEnd){
    $page = $this->getDom($this->Curl->get()->direct
      ->url('http://weixin.sogou.com/weixin',array(
        'type' => 2,
        'query' => '女青年',
        'usip' => 'lovenqn',
        'ie' => 'utf8',
        'tsn' => 5,
        'interation' => 'null',
        'wxid' => 'oIWsFtx7ZigNXPYHxgruIJb2Cx_E',
        'from' => 'tool',
        'page' => $pageNum,
        'ft' => $timeStart,
        'et' => $timeEnd ))
      ->referer('http://weixin.sogou.com')
      ->getResponse());

    $infos = array();
    foreach($page->getElementsByTagName('ul') as $ul){
      if($ul->getAttribute('class') == 'news-list'){
        foreach($ul->getElementsByTagName('li') as $li){
          $a = $li->getElementsByTagName('h3')->item(0)->getElementsByTagName('a')->item(0);
          preg_match('/【女青年(\d+)】(.+)/',$a->textContent,$aInfo);
          if(!empty($aInfo)){
            $info = array(
              'link' => $a->getAttribute('href'),
              'title' => $aInfo[2],
              'time' => $aInfo[1]
            );
            //然后抓取页面
            $this->parseWXPage($info);
            $infos[] = $info;
            sleep(3);
          }
        }
      }
    }
    return $infos;
  }
  public function parseWXPage(&$info){
    $page = $this->getDom($this->Curl->get()->direct
      ->url($info['link'])
      ->getResponse());
    
    foreach($page->getElementsByTagName('span') as $span){
      preg_match('/「\d+」【看(.+)】(.+)/',$span->textContent,$saying);
      if(!empty($saying)){
        $info['sayings'][] = array(
          'content' => $saying[2],
          'category' => $saying[1]
        );
      }
    }
  }
  public function getData(){
    //我还是通过时间的筛选,到处绝大部分吧,就不留痕迹了
    $this->Curl->get()->direct->url('http://weixin.sogou.com')->getResponse();

    //还是的时间还是自己去找吧~~~
    $startYear = 2017;
    $startMounth = 3;
    $endYear = 2017;
    $endMounth = 4;
    $fill = function ($num){
      if($num < 10) $num = '0'.$num;
      return $num;
    };
    $miusOneMonth = function(&$month, &$year){
      if(--$month == 0){
        $month = 12;
        $year--;
      }
    };
    $UA = array(
      'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)',
      'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.2)',
      'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.19 Safari/537.36',
      'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
      'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)',
      'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E) ',
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:16.0) Gecko/20121026 Firefox/16.0',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
      'Mozilla/5.0 (Linux; U; Android 2.2.1; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
    );
    $oneMonth = array();
    for($j=0; $j < 2; $j++){
      $pages = array();
      for($i=0; $i < 10; $i++){
        $this->Curl->headers(array( 'User-Agent' => $UA[$i] ));
        $this->Curl->cookies(array(
          'successCount'=>'1|'.gmdate("l d F Y H:i:s")." GMT",
          'refresh'=>$i
        ));
        $infos = $this->getSearchPage($i,
            $startYear.'-'.$fill($startMounth).'-02', 
            $endYear.'-'.$fill($endMounth).'-01'
        );
        sleep(5);
        if(empty($infos)) break;
        $pages[] = $infos;
      }
      $miusOneMonth($startMounth,$startYear);
      $miusOneMonth($endMounth,$endYear);
      if(empty($pages))
        break;
      $oneMonth[] = $pages;
      sleep(3);
    }
    var_dump($oneMonth);
    return $oneMonth;
  }
  public function parse(){
    return $this->raw;
  }
  public function store(){
    //还是需要测试一下workflow是否跑通的
    $this->char_sayingsModel->write($this->data);
  }
}