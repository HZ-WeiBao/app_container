<?php

class View extends Component {
  public static function globalConfig($config){//这样就是全局执行一次咯
    ini_set('short_open_tag',true);;
    ini_set('asp_tags',true);;
  }
  public static function render($_uri_,$_data_=null,$_return_=false){
    if($_uri_ == 'this'){
      $_uri_ = F::$R->controller.'/'.F::$R->action;
    }

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
    $url = explode('/',$_viewFile_);
    $len = strlen($url[0]);
    // if(F::$R->isFrame){
    //   return Router::$basePath.'/frame/views/'.$_viewFile_.$_suffix_;
    // }else

    if(strpos($url[0],'_') == $len-1 ){
      $url[0] = substr($url[0],0,$len-1);
      return Router::$basePath.'/frame/views/'.implode($url,'/').$_suffix_;
    }else{
      return Router::$basePath.'/modules/'.F::$R->module.'/views/'.$_viewFile_.$_suffix_;
    }
    return Router::$basePath.'/modules/'.F::$R->module.'/views/'.F::$R->controller.'/'.$_viewFile_.$_suffix_;
  }
}