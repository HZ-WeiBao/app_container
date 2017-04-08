<?php

include($path.'/../libs/ClassLoader.php');

class F {
  public static $params = null;
  // public static $moduleList = null;
  public static $componentList = null;
  public static $C = null;
  public static $R = null;
  public static $loader = null;

  public static function init(&$config){
    // self::$moduleList = $config['modules'];
    self::$componentList = $config['components'];
    self::$params = $config['params'];

    foreach($config['components'] as $key => $value)
      if(method_exists($key,'globalConfig'))
        $key::globalConfig($value);

    if(self::$params['debug'] && false){
      $debug = json_encode($_SERVER);
      echo '<script>var $debug=';
      echo $debug.';</script>';
    }
    //参数预处理 todo

    return self::$R = new Router;
  }

  public static function end($status=0 ,$event=''){
    if($status != 0){
      self::error($status,$event);
      exit($status);
    }
  }

  public static function urlFilter($str){

  }

  public static function moduleName($str){
    return strtolower($str);
  }
  public static function controllerName($str){
    return ucfirst(strtolower($str));
  }
  public static function actionName($str){
    return ucfirst(strtolower($str));
  }

  public static function error($status, $event){
    $codeMeaning = array(
      0 => '成功退出',//不会执行到这里的
      1 => '框架错误',//分类标准是出错的位置
      2 => '组件错误',
      3 => '模块错误',
      4 => '数据库错误',
      5 => '其他错误'
    );
    if(self::$params['debug']){
      echo $codeMeaning[$status].' => '.$event;
      echo '<br><br>小小框架~';
    }else{
      echo $codeMeaning[$status];
      echo '<br><br>小小框架~';
    }
  }
}