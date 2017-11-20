<?php

class BaseCtrl extends Component {

  public function init(){
    if($this->ConfigMgr->status != 'normal'){
      
      $module_statisticsModel = new module_statisticsModel;
      $module_commentModel = new module_commentModel;

      $statistics = $module_statisticsModel->get(F::$R->module);
      $commentNum = $module_commentModel->numOf(F::$R->module);
      $statistics->useNum = $this->parseNum($statistics->useNum);
      $statistics->likeNum = $this->parseNum($statistics->likeNum);
      $commentNum = $this->parseNum($commentNum);
  
      View::render('layout_',[
        'content' => View::render('Home_/Maintain', array() ,true),
        'config' => $this->ConfigMgr,
        'statistics' => $statistics,
        'commentNum' => $commentNum
      ],false);

      exit();
    }

    //openid的解析
    if(isset($_GET['openid'])){
      $_SESSION['openid'] = $_GET['openid'];
    }
  }

  public function updateStatistics(){
    $module_statisticsModel = new module_statisticsModel;
    $module_commentModel = new module_commentModel;

    $adminConfig = new ConfigMgr('admin');
    if($adminConfig->switcher->logCount == 'on')
      $module_statisticsModel->get(F::$R->module)->inc('useNum')->save();
  }

  public function actionIndex($arg=array()){
    $module_statisticsModel = new module_statisticsModel;
    $module_commentModel = new module_commentModel;

    $adminConfig = new ConfigMgr('admin');
    if($adminConfig->switcher->logCount == 'on')
      $module_statisticsModel->get(F::$R->module)->inc('useNum')->save();
    
    $statistics = $module_statisticsModel->get(F::$R->module);
    $commentNum = $module_commentModel->numOf(F::$R->module);
    $statistics->useNum = $this->parseNum($statistics->useNum);
    $statistics->likeNum = $this->parseNum($statistics->likeNum);
    $commentNum = $this->parseNum($commentNum);

    View::render('layout_',[
      'content' => View::render(F::$R->controller.'/Index',$arg,true),
      'config' => $this->ConfigMgr,
      'statistics' => $statistics,
      'commentNum' => $commentNum
    ],false);
  }

  public function parseNum ($num){
    $num = intval($num);
    
    if($num > 500){
      $num = round($num/1000, 1) . 'k';
    }
    return $num;
  }

  // public function __destruct(){
  //   //这里可以做一个hook比如config自动保存之类的
  // }
}