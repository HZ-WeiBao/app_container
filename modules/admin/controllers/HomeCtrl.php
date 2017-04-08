<?php

class HomeCtrl extends BaseCtrl {
  public function actionTestyg(){
    set_time_limit(0);
    // $filePath = F::$R->getDataDir().'/dsign.js';
    // $url = exec("node {$filePath} -p");
    // var_dump($url);
    // $this->Proxy->youngGirl->store();
    // $json = json_decode($this->DataMgr->get('sayings.1','json'),true);
    // $this->char_sayingsModel->write($json);

    //设置上次更新时间~~
    // $this->Proxy->youngGirlForum->setLastUpdateTime(
    //   $this->ConfigMgr->component->Proxy->youngGirlForum->LastUpdatTime);

    // $this->Proxy->youngGirlForum->store();

    // $this->ConfigMgr->component->Proxy->youngGirlForum->LastUpdatTime = $this->Proxy->youngGirlForum->getLatestTime();

    // $this->ConfigMgr->save();
  }
  public function actionTestnercquery(){
    
    $this->Proxy->nerc->setSession($_COOKIE['46session'] ?? '');
    $this->Proxy->nerc->setSession($_COOKIE['46pool'] ?? '');
    var_dump($this->Proxy->nerc->getSession());
  }

  public function actionTestnerc(){
    $this->Proxy->nerc->setSession($_COOKIE['46session'] ?? '');
    $this->Proxy->nerc->setPool($_COOKIE['46pool'] ?? '');

    echo 'cookies: 46session --> '.$_COOKIE['46session'];
    echo '<br>';
    echo 'cookies: 46pool --> '.$_COOKIE['46pool'];
    echo '<br>';
    $result = $this->Proxy->nerc->getParams();
    // var_dump($result);
    setcookie('46session',$this->Proxy->nerc->getSession(),time() + 86400);
    setcookie('46pool',$this->Proxy->nerc->getPool(),time() + 86400);

    echo 'curlcookies: 46session --> '.$this->Proxy->nerc->getSession();
    echo '<br>';
    echo 'curlcookies: 46pool --> '.$this->Proxy->nerc->getPool();
    echo '<br>';
    
    echo '<img src="data:image/png;base64,'.base64_encode($this->Proxy->nerc->getCaptcha()).'">';
  }
  
  public function actionTestmandarin(){
    $result = $this->Proxy->mandarin->get('test','test');
    var_dump($result);
  }
  public function actionTestcet(){
    $this->Proxy->cet->get('440570162211317','陈惠敏');
  }
  public function actionTest(){
    $time_start = microtime(true);

    $this->Proxy->setSession($_GET['id']);
    $src = $this->Proxy->getCaptcha();

    var_dump($this->Proxy->Curl->_cookies);
    $src_base64 = base64_encode($src);
    // echo '<pre>'.htmlspecialchars($src).'</pre>';
    echo "<img src='data:image/png;base64,{$src_base64}'>";

    
    var_dump((microtime(true)-$time_start));

  }
  public function actionTestreferer(){
    $time_start = microtime(true);
    $check = $this->Proxy->autoLogin();
    var_dump($check);
    
    $page = $this->Proxy->Curl->get()
                 ->url(Proxy::$baseUrl.'znpk/Pri_StuSel.aspx')->getResponse()->convert('gb2312','utf-8')->body;
    echo "<pre>{$page}</pre>";
  }
  public function actionLogin(){
    $time_start = microtime(true);

    $this->Proxy->setSession($_GET['id']);
    // echo 'sessionid:';
    // var_dump($this->Proxy->Curl->_cookies);
    // $check = $this->Proxy->login('1514080902121','458200', $_GET['c']);
    // var_dump($check);
    //真的是挺烦人的,现在测试数据抓取吧
    // $this->Proxy->classRoomInfo->store();
    // $data = $this->Proxy->classRoomList->data;
    // $data = $this->Proxy->majorInfo->data;
    // var_dump($data);
    // $this->Proxy->majorInfo->store();
    // var_dump($this->Proxy->getXNXQ());

    $this->Proxy->classRoomInfo->store();
    
    // $check = $this->Proxy->autoLogin();
    var_dump((microtime(true)-$time_start));

  }
  public function actionAutoLogin(){
    $time_start = microtime(true);

    $check = $this->Proxy->autoLogin();
    var_dump($check);
    var_dump((microtime(true)-$time_start));

  }
  public function actionTestOtheroption(){
    $time_start = microtime(true);

    // $one = $this->testModel->findOne('foo = ?',[1]);
    $all = $this->Sql->usetable('test')->orderBy(array('foo'))->DESC()->distinct()->findAll();

    header('TTFB : '.(microtime(true)-$time_start));
    var_dump($all);
    var_dump((microtime(true)-$time_start));

  }
  public function actionTestinsertbind(){
    $time_start = microtime(true);

    for($i = 0; $i < 100 ;$i++){
      $this->Sql->query('insert into test (foo,bar,time) values (?,?,?)',array(
        1,"long string~~~~~~~~~~~~~~","2017-03-21 00:00:00"
      ));
    }

    header('TTFB : '.(microtime(true)-$time_start));
    var_dump((microtime(true)-$time_start));
    //9.204479932785
    //增加参数绑定之后10.130572080612
  }
  public function actionTestinsertunbind(){
    $time_start = microtime(true);

    for($i = 0; $i < 10000 ;$i++){
      $this->testModel->foo = 1;
      $this->testModel->bar = 'long string~~~~~~~~~~~~~~';
      $this->testModel->time = date('y-m-d');
      // var_dump($this->testModel);
      $status = $this->testModel->save();
    }

    header('TTFB : '.(microtime(true)-$time_start));
    var_dump((microtime(true)-$time_start));
    //10.062386035919
  }
  public function actionTestinsert(){
    $this->testModel->foo = 1;
    $this->testModel->bar = 'string';
    $this->testModel->time = date('y-m-d');
    // var_dump($this->testModel);
    $status = $this->testModel->save();
    // var_dump($status);
  }
  public function actionTestqudate(){
    $test = $this->testModel;
    $test->findOne('foo = ?',array(20));
    $test->foo = 20;
    $test->bar = 'pass test';
    if($test->save()){
      echo 'done~';
    }
  }
}