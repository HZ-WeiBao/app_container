<?php

F::$loader = new AutoLoader;
spl_autoload_register(array(F::$loader,'load'));

class AutoLoader {
  private const libsPath = array(//已弃用了,又复用了,因为效率,真的这些文件检查其实不太比较,确定性是可以事先知道的
    'BaseCtrl',
    'Component',
    'ConfigMgr',
    'Curl',
    'DataMgr',
    'Hook',
    'Proxy',
    'Router',
    'Sql',
    'View',
    'WaterMark'
  );//这里还是很多东西可以复用的
  //还是不通过人工维护这个列表了优先是寻找看一下是否在这个目录就行了
  
  private $rules = array(
    'Ctrl',//还是可以通过命名的约定实现公用Ctrl
    'Model',
    'CtrlF'
  );
  private $comonRules = array();

  public function addRules($name,$uri){
    $this->comonRules[] = array($name,$uri);
  }

  public function load($class){
    $path = __DIR__.'/../'.'libs/'.$class.'.php';
    if(in_array($class,self::libsPath)){
      include($path);
    }else
      foreach($this->rules as $value){
        if(strlen($class) - strpos($class,$value) == strlen($value)){//如果标识符是在末尾的话
          $path = $this->{'get_'.$value.'_path'}($class).'.php';

          if(is_readable($path))
            include($path);
          else
            F::end(1,$class.'类('.$value.')加载失败,文件缺失~');
        }
      }

    // try{
    //   include($path);
    // }catch(Error $e){
    //   foreach($this->rules as $value){
    //     if(strlen($class) - strpos($class,$value) == strlen($value)){//如果标识符是在末尾的话
    //       $path = $this->{'get_'.$value.'_path'}($class).'.php';

    //       try{
    //         include($path);
    //       }catch(Error $e){
    //         F::end(1,$class.'类('.$value.')加载失败,文件缺失~');
    //       }
    //     }
    //   }
    // }
    
    if( !class_exists($class) ){
      F::end(1,$class.'类加载失败,请查看文件名和类名是否一致~,或者检查上层的get__返回值是否漏了');
    }else{
      if(isset(F::$componentConfig[$class]))
        if(method_exists($class,'globalConfig'))
          $class::globalConfig(F::$componentConfig[$class]);
    }
  }

  public function get_Ctrl_path($class){
    return Router::$basePath.'/modules/'.F::$R->module.'/controllers/'.$class;
  }

  public function get_Model_path($class){
    return Router::$basePath.'/models/'.$class;
  }
  public function get_CtrlF_path($class){
    return Router::$basePath.'/frame/controllers/'.$class;
  }
}