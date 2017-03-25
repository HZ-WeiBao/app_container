<?php

class Component {
  public $_caller = null;

  public function getClassName(){
    return static::class;
  }
  public function __get($variable){
    //这时候的$this一般都是上层的
    //优先还是转发到上一层的__get处理机制
    //如果上层有get__的话优先调用

    // echo "call :".$variable.'<br>';
    if(method_exists($this,'get__')){//这是调用有在这样可以避免一句parent::__get($variable);
      $result = call_user_func(array($this,'get__'),$variable);
      if($result !== null)
        return $result;
    }
    
    try{
      $this->{$variable} = new $variable;
      $this->{$variable}->_caller = $this;
      if(method_exists($this->{$variable},'init'))
        $this->{$variable}->init();
      return $this->{$variable};
    }catch(Exception $e){
      F::end(3,$e->getMessage());
    }
  }
}