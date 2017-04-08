<?php

class Router extends Component {
  public $module = '';
  public $controller = '';
  public $action = '';
  public static $basePath = null;

  public static function globalConfig(&$config){
    self::$basePath = $config['basePath'];
  }
  public function run(){
    //解析

    $url = $this->analysisUrl($_SERVER['REQUEST_URI']);
    if(isset($url['module'])){
      $this->module     = $url['module'];
      $this->controller = $url['controller'];
      $this->action     = $url['action'];

      $len = strlen($this->controller);
      if($this->controller[$len-1] == '_'){
        $this->controller = substr($this->controller,0,$len-1);
        $ctrlName = $this->controller.'CtrlF';
      }else
        $ctrlName = $this->controller.'Ctrl';
      
      $this->{$ctrlName}->init();
      F::$C = $this->{$ctrlName};

      if(method_exists($this->{$ctrlName},'action'.$this->action))
        $this->{$ctrlName}->{'action'.$this->action}();
      else
        F::end(5,"找到对应的{$this->action}~");
      
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