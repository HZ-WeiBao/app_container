<?php

class HomeCtrl extends BaseCtrl {
  public function actionTest(){
    $time_start = microtime(true);

    $check = $this->Proxy->autoLogin();
    var_dump($this->Proxy->Curl->_cookies);

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