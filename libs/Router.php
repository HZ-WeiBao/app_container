<?php

class Router extends Component {
  public $module = '';
  public $controller = '';
  public $action = '';
  public $isFrame = false;
  public static $basePath = null;

  public static function globalConfig(&$config){
    self::$basePath = $config['basePath'];
  }
  public function run(){
    //处理post数据格式化
    global $_JSON;
    try{
      $_JSON = json_decode(file_get_contents('php://input'));
    }catch(Error $e){
      $_JSON = null;
    }
    //解析
    // sleep(1);
    $url = $this->analysisUrl($_SERVER['REQUEST_URI']);
    if(isset($url['module'])){
      $this->module     = $url['module'];
      $this->controller = $url['controller'];
      $this->action     = $url['action'];

      $len = strlen($this->controller);
      if($this->controller[$len-1] == '_'){

        $ctrlName = substr($this->controller,0,$len-1).'CtrlF';

        // $this->controller = substr($this->controller,0,$len-1);
        // $ctrlName = $this->controller.'CtrlF';
        // $this->isFrame = true;
      }else
        $ctrlName = $this->controller.'Ctrl';
      
      $this->{$ctrlName}->init();

      // global $startTime;
      // $endInitTime = 'initTime: '.( (microtime(true) - $startTime)*1000 )."\n";
      // header('initTime: '.(microtime(true) - $startTime)*1000);

      F::$C = $this->{$ctrlName};

      try{
        // $excuteStartTime = microtime(true);

        $this->{$ctrlName}->{'action'.$this->action}();

        // $excuteTime = 'excuteTime: '.(( microtime(true) - $excuteStartTime )*1000 )."\n";

        // $runTime = 'runTime: '.( (microtime(true) - $startTime)*1000 )."\n";

        // $despcrition = "\n".$_SERVER['REQUEST_URI']."\n";
        // $str = $despcrition.$endInitTime.$excuteTime.$runTime;

        // file_put_contents(Router::$basePath.'/log/time.txt',$str ,FILE_APPEND);

      }catch(Error $e){
        F::end(5,"找不到到对应的Action({$this->action})~或者视图有语法错误");
      }
    }else{
      echo '小小的应用框架~';
    }
    F::end();
  }

  public function url($str){
    //localhost?m=module#controller/action
    return 'index.php?m='.$str;
  }

  public function analysisUrl($url){
    preg_match('/([a-zA-Z-_]+)\/?([a-zA-Z-_]+)?\/?([a-zA-Z-_]+)?/iu',$url,$params);
    if(isset($params[1])){
      $module = ($params[1]);

      //00
      //10
      //11
      if(!isset($params[2])){
        $controller = 'Home';
        $action     = 'Index';
      }elseif(!isset($params[3])){
        $controller = 'Home';
        $action     = $params[2];
      }else{
        $controller = $params[2];
        $action     = $params[3];
      }

      return array(
        // 'module'=>F::moduleName($module),
        // 'controller'=>F::controllerName($controller),
        // 'action'=>F::actionName($action)
        'module'=>$module,
        'controller'=>$controller,
        'action'=>$action
      );
    }
    return array();
  }
  //无论是web的url路由还是,文件路由,都是会放在这个类处理
  public function getModulesDir(){
    return self::$basePath .'/modules/'.$this->module.'/';
  }
  public function getControllersDir(){
    return self::$basePath .'/modules/'.$this->module.'/controllers/';
  }
  public function getViewsDir(){
    return self::$basePath .'/modules/'.$this->module.'/views/';
  }
  public function getDataDir(){
    return self::$basePath .'/modules/'.$this->module.'/data/';
  }
  public function getPublicDataDir(){
    return self::$basePath .'/public/data/';
  }
  public static function font($name,$extension='ttf'){
    return self::$basePath.'/font/'.$name.'.'.$extension;
  }
}