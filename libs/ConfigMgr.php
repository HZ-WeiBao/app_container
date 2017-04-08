<?php

class ConfigMgr extends Component {//module config manager
  private $_config = null;
  private $_path = null;

  public function __construct($module = null){
    if(!$module)
      $module = F::$R->module;
    $this->load($module);
  }

  public static function globalConfig($config){//同时充当init初始化函数

  }

  public function save(){
    foreach($this as $key=>$value){
      if(strpos($key,'_') !== 0){
        $this->_config->$key = $value;
      }
    }
    try{
      $json = preg_replace_callback("#\\\u([0-9a-f]{4})#i",function($match){
        return iconv('UCS-2BE', 'UTF-8', pack('H4',$match[1]));
      } , json_encode($this->_config));
      file_put_contents($this->_path, $json);
    }catch(Exception $e){
      F::end(3,$e->getMessage());
    }
  }

  public function load($module){
    //对了这就是面临,不同分支应该是怎样来处理,像现在是相同如果通过参数区分
    //还是通过入口的不同呢??,如果通过参数内容,之后分支的所有不同都是需要使用参数再次判断的,
    //但是如果通过入口作为分支,那么,公共部分处理结构就需要重复了,所以好像没有找到更加好代码复用方式
    $this->_path = Router::$basePath . ( ($module == 'frame')? '/frame': '/modules/'.$module ) . '/config.json';
    if(file_exists($this->_path)){
      $str = file_get_contents($this->_path);
      $this->_config = json_decode($str, false);//当然是使用->方式访问啦~

      foreach($this->_config as $key=> $value){
        $this->{$key} = $value;
      }//用哪个好捏,通过__get转发,还是复制捏??还是要改为转发的
    }else{
      F::end(3,"没有找到模块{$module}的config.json文件~");
    }
  }
}