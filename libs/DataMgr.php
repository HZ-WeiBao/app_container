<?php

class DataMgr extends Component {
  private $_path = null;//临时的path,当设置为Pub时值为publicDataPath,默认是private
  
  public function init(){
    //这里在会在初始化的时候执行的
    $this->_path = F::$R->getDataDir();
  }
  //使用方式的优化func
  public function get__($variable){
    if($variable == 'Pub'){
        $this->_path = F::$R->getPublicDataDir();
        return $this;
    }
    //我知道原来是这里阻止了组件的加载,呼呼~~
    //也说明一个问题,当程序运行结果不符合预期的时候你会怀疑是不是语言的bug啊哈哈~~
    //注意只有命中的时候才Return
  }

  
  //module 接口
  public function rename($fromName,$fromExtension,$toName,$toExtension){//约定是这样的弄的通过一个过滤器之后的尾部处理,把一行不想复制的代码变成加上前面_
    //加上extension之后好像使用起来文件夹的重命名是有点混淆的,最好是传'',或者null
    //正常使用的时候还是$obj->funcName();
    //返回是后面都是自带斜杠的/的了
    return rename($this->_path.$fromName.'.'.$fromExtension , $this->_path.$toName.'.'.$toExtension);
  }
  public function renameDir($fromName,$toName){
    //正常使用的时候还是$obj->funcName();
    //返回是后面都是自带斜杠的/的了
    return rename($this->_path.$fromName , $this->_path.$toName);
  }
  public function mkdir($uri, $mod=0777, $recursive=false){
    return mkdir($this->_path.$uri, $mod, $recursive);
  }

  public function write($uri,$extension,$content){
    //之后再去学习try catch是怎样使用的
    return file_put_contents($this->_path.'.'.$extension, $content);
  }
  public function get($uri,$extension){//这里要做一个自动资源格式化
    return file_get_contents($this->_path.'.'.$extension);
  }
  public function append($uri,$extension,$conent){
    return file_put_contents($this->_path.'.'.$extension, $content, FILE_APPEND);
  }
}