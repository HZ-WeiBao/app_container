<?php

class youngGirlForum extends __base__ {
  public function getTotalPage(){
    $this->indexInfo = $this->Curl->get()->direct
       ->url('http://www.nvqingnian.net/new/index.php')
       ->getResponse();
    preg_match('/\/ (\d+) 页/',$this->indexInfo,$match);
    return $match[1];
  }
  public function getLatestTime(){
    foreach($this->getDom($this->indexInfo)->getElementsByTagName('div') as $div){
      if($div->getAttribute('class') === 'news_inner'){
        $str = $div->getElementsByTagName('dd')->item(0)->textContent;
        preg_match('/发布于 (.+)/',$str,$match);
        return $match[1];
      }
    }
  }
  public function getArticle(&$list){
    $dsign = $this->Curl->get()->direct
      ->url('http://www.nvqingnian.net/'.$list['link'])
      ->getResponse();

    $dsign = str_replace('<script type="text/javascript">','',$dsign);
    $dsign = str_replace('</script>','',$dsign);
    $dsign = str_replace('location=','location.href=',$dsign);
    $dsign = 'var window = {},location = {};location.assign = location.replace = function(url){location.href = url};'.$dsign;
    $dsign .= 'console.log(location.href);';
    $this->DataMgr->write('dsign','js',$dsign);
    $filePath = F::$R->getDataDir().'/dsign.js';
    $url = exec("node {$filePath} -p");
    // var_dump($url);
    $dom = $this->getDom($this->Curl->get()->direct
      ->url('http://www.nvqingnian.net'.$url)
      ->getResponse());

    if($dom->getElementById('article_content') != null)
    foreach($dom->getElementById('article_content')
      ->getElementsByTagName('span') as $span ){
      preg_match('/「\d+」【看(.+)】(.+)/',$span->textContent,$saying);
      if(!empty($saying)){
        $list['sayings'][] = array(
          'category' => $saying[1],
          'content' => $saying[2]
        );
      }
    }
  }
  public function getPage($pageNum){
    $dom = $this->getDom($this->Curl->get()->direct
       ->url('http://www.nvqingnian.net/new/index.php',array(
         'page' => $pageNum))
       ->getResponse());
    $page = array();

    foreach($dom->getElementsByTagName('div') as $div){
      if($div->getAttribute('class') == 'xld'){
        foreach($div->getElementsByTagName('dl') as $dl){
          //获取链接/标题
          $titleA = $dl->getElementsByTagName('dt')->item(0)->getElementsByTagName('a')->item(0);
          $time = $dl->getElementsByTagName('dd')->item(0)->textContent;
          preg_match('/发布于 (.+)/',$time,$match);

          $list = array(
            'title' => $titleA->textContent,
            'link' => $titleA->getAttribute('href'),
            'time' => $match[1],
          );
          if($match[1] === $this->lastUpdateTime){
            $this->end = true;
            break;
          }
          $this->getArticle($list);
          $page[] = $list;
        }
        break;
      }
    }

    return $page;
  }
  public function setLastUpdateTime($lastUpdateTime){
    $this->lastUpdateTime = $lastUpdateTime;
  }
  public function get(){
    $this->end = false;
    $pages = array();
    for($i = 0,$len = $this->getTotalPage(); $i < $len; $i++){
      $pages[] = $this->getPage($i);
      if($this->end) break;
    }
    return $pages;
  }
  public function parse(){
    return $this->get();
  }
  public function store(){
    $this->char_sayingsModel->writeFromForum($this->data);
  }
}