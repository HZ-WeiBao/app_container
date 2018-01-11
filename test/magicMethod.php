<?php

include 'base.php';

class magic {
  private $var = 'here';

  public function __contruct(){

  }
  public function __get($var){
    if($var == 'var')
      return $this->{$var};
  }
  public function __call($func,$arg){
    if($func == 'func')
      return null;
  }
  public function __set($var,$value){
    $this->{$var} = $value;
  }
  public static function __callStatic($func,$arg) {
    if($func == 'callStatic')
      return null;
  }
}

class traditional {
  private $var = 'here';

  public function traditional(){

  }

  public function get($var){
    return $this->{$var};
  }

  public function call($func,$arg=array()){
    return null;
  }
  public function set($var,$value){
    $this->{$var} = $value;
  }
  public static function callStatic($func='callStatic',$arg=array()){
    return null;
  }
}

class traditional2 {
  private $var = 'here';

  public function construct(){}

  public function contructTraditional(){
    $class = __CLASS__;
    $this->construct();
  }

  public function get($var){
    return $this->{$var};
  }

  public function call($func,$arg=array()){
    return null;
  }
  public function set($var,$value){
    $this->{$var} = $value;
  }
  public static function callStatic($func='callStatic',$arg=array()){
    return null;
  }
}

$magicContruct = excuteTime(function(){
  loop(function(){
    new magic;
  });
});

$traditionalContruct = excuteTime(function(){
  loop(function(){
    new traditional;
  });
});

// $traditionalContruct2 = excuteTime(function(){
//   loop(function(){
    
//     (new traditional2)->contructTraditional();
//   });
// });

// ========================

$traditionalGet = excuteTime(function(){
  loop(function(){
    $temp = new traditional;
    // if(!isset($temp->var))
      $temp->get('var');
  });
});

$magicGet = excuteTime(function(){
  loop(function(){
    $temp = new magic;
    // if(!isset($temp->var))
      $temp->var;
  });
});

// ========================

$traditionalCall = excuteTime(function(){
  loop(function(){
    $temp = new traditional;
    // if(!method_exists($temp,'func'))
      $temp->call('func');
  });
});

$magicCall = excuteTime(function(){
  loop(function(){
    $temp = new magic;
    // if(!method_exists($temp,'func'))
      $temp->func();
  });
});

// ========================

$traditionalSet = excuteTime(function(){
  loop(function(){
    $temp = new traditional;
    // if(!isset($temp->set))
      $temp->set('set',null);
  });
});

$magicSet = excuteTime(function(){
  loop(function(){
    $temp = new magic;
    // if(!isset($temp->set))
      $temp->set = null;
  });
});

// ========================

$traditionalCallStatic = excuteTime(function(){
  loop(function(){
    if(!function_exists('traditional::CallStatic'))
      traditional::CallStatic('callStatic');
  });
});

$magicCallStatic = excuteTime(function(){
  loop(function(){
    // if(!function_exists('magic::CallStatic'))
      magic::CallStatic();
  });
});

// ========================



echoLine("magicContruct: \t\t".$magicContruct);
echoLine("traditionalContruct: \t".$traditionalContruct);
// echoLine("traditionalContruct2: \t".$traditionalContruct2);
echoLine("differ: \t\t".($magicContruct-$traditionalContruct));
echoLine("percentage: \t\t".percent($magicContruct-$traditionalContruct,$traditionalContruct));

echo "\n";

echoLine("magicGet: \t\t".$magicGet);
echoLine("traditionalGet: \t".$traditionalGet);
echoLine("differ: \t\t".($magicGet-$traditionalGet));
echoLine("percentage: \t\t".percent(($magicGet-$traditionalGet),$traditionalGet));

echo "\n";


echoLine("magicCall: \t\t".$magicCall);
echoLine("traditionalCall: \t".$traditionalCall);
echoLine("differ: \t\t".($magicCall-$traditionalCall));
echoLine("percentage: \t\t".percent(($magicCall-$traditionalCall),$traditionalCall));

echo "\n";

echoLine("magicSet: \t\t".$magicSet);
echoLine("traditionalSet: \t".$traditionalSet);
echoLine("differ: \t\t".($magicSet-$traditionalSet));
echoLine("percentage: \t\t".percent(($magicSet-$traditionalSet),$traditionalSet));

echo "\n";

echoLine("magicCallStatic: \t".$magicCallStatic);
echoLine("traditionalCallStatic: \t".$traditionalCallStatic);
echoLine("differ: \t\t".($magicCallStatic-$traditionalCallStatic));
echoLine("percentage: \t\t".percent(($magicCallStatic-$traditionalCallStatic),$traditionalCallStatic));