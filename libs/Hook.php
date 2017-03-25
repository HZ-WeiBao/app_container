<?php

class Hook extends Component {//可以做函数代理来实现一些转发,委托,感觉这不属于主键而是框架内提供更好的程序任务安排的东东
  private $_direct = false;
  private $_before_action_list;
  private $_after_action_list;

  public function init(){
    $componentName = $this->_caller->getClassName();
    $this->_caller->_caller->{$componentName} = $this;
    //默认代理的是这个hook的挂接点咯~~~
    //这样就是置换成功咯
  }
  public function before($func,$callbacks){
      $this->_before_action_list[$func][] = $callbacks->bindTo($this->_caller->_caller);
  }
  public function after($func,$callbacks){
    $this->_after_action_list[$func][] = $callbacks->bindTo($this->_caller->_caller);
  }

  public function __set($variable, $params){
    return $this->_caller->{$variable} = $params;
  }
  public function get__($variable){
    if($variable == 'direct'){
      $this->_direct = true;
      return $this;
    }else{
      return $this->_caller->{$variable};
      //基本上可以说Hook也算是这个component的基础部件了,但是一般不太会在这里面使用上层的的component了
    }
  }
  public function __call($func, $params){
    if(isset($this->_before_action_list[$func]) && 
       is_array($this->_before_action_list[$func]) && 
       !$this->_direct
    ){
      foreach($this->_before_action_list[$func] as $_func){
         //还有一点是这个foreach是怎样的一个复制方法啊??应该是引用复制的~~已验证了
         call_user_func_array($_func,$params);//在接收部分使用引用就可以了
      }
    }

    $result = call_user_func_array(array($this->_caller,$func), $params);

    if(isset($this->_after_action_list[$func]) && 
       is_array($this->_after_action_list[$func]) && 
       !$this->_direct
    ){
      $params[] = &$result;
      foreach($this->_after_action_list[$func] as $func){
         $result = call_user_func_array($func,$params);
      }
    }
    $this->_direct = false;
    return $result;
  }
}