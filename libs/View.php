<?php

class View extends Component {
  public static function globalConfig($config){//这样就是全局执行一次咯
    ini_set('short_open_tag',true);;
  }
  public static function render($_uri_,$_data_=null,$_return_=false){
    $_viewFile_ = self::src($_uri_,'.htm');
    $_styleFile_ = self::src($_uri_,'.css');
    $_data_ = is_object($_data_)? (array)$_data_ : $_data_;
    
    if(is_array($_data_))
      extract($_data_,EXTR_PREFIX_SAME,'data');
    else
      $data=$_data_;
    
    if($_return_){
      ob_start();
      ob_implicit_flush(false);
    }
      
      require($_viewFile_);

    if($_return_)
      return ob_get_clean();
  }
  
  public static function src($_viewFile_, $_suffix_){
    if(strlen($_viewFile_) - strpos($_viewFile_,'F') === 1){
      return Router::$basePath.'/frame/views/'.$_viewFile_.$_suffix_;
    }elseif(strpos($_viewFile_,'/') !== false)
      return Router::$basePath.'/modules/'.F::$R->module.'/views/'.$_viewFile_.$_suffix_;
    return Router::$basePath.'/modules/'.F::$R->module.'/views/'.F::$R->controller.'/'.$_viewFile_.$_suffix_;
  }
}