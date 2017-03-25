<?php
date_default_timezone_set('Asia/Shanghai');

class base{
  public $verb = 'null';
  public function __construct(){
    // echo "base newed\n";
    
  }
  public function run(){
    var_dump(static::class);
  }
  public function findOneBy($location = null){
    echo 'class_name:'.get_class($this)."\n";
  }
}

class test extends base {
  public static $baseusrl = 'all right~';

  public function __construct(){
    parent::__construct();
    // echo self::$baseusrl;
    // $this->callstatic();
    
  }
  public function runtoo(){
    var_dump($this);
  }
  public function __get($variable){
    $config = json_decode('{"test1":"ok1","test2":true}',true);
    foreach($config as $key => $value){
      $this->{$key} = $value;;
    }
    echo '出现未设置的变量';
    return $this->{$variable};
  }
  public function __set($variable,$value){
    $this->{$variable} = $value;
    echo '增加了属性'.$variable.'->'.$value;
    return $this;
  }
  public function set($variable,$value){
    $this->{$variable} = $value;
    echo "set {$variable} -> {$value}\n";
    return $this; 
  }
  public function __toArray($key){
    echo 'is works'.$key;
  }
  public static function testnonestatic($kolos,$deep,&$result){//如果只是部分是引用传参呢,试一下咯
    $kolos .=  'love 蓝精灵~';
    $deep .= '低调,改了别人是看不到的';
    $result .= 'edited';
    var_dump($result);

  }

  public function callBack($func){
    $func($this);
  }
  public function hi($func,$args){
    //这样还是没输出~~
    echo "Calling object method '$func' ". implode(', ', $args). "\n";
    return '$reulst';
  }
  public function simple_hi(){
    //这样还是没输出~~
    echo 'here';
    
  }
  public static function callstatic(){
    echo 'called ~ '.PHP_EOL;
  }
  public function cite(&$str,&$kolos){
    self::testnonestatic($str,$kolos);
  }
  public function __call($func,$argument){//这里默认是引用传参哦~~
    //call 这一层是不能有输出的??
    //看是调用一定是要使用
    //原来是没有call进来

    // var_dump($func,$argument);
    
    $result = call_user_func(array($this,'hi'),$func,$argument);
    // call_user_func(array($this,'simple_hi'),array());
    $argument_result = $argument;
    $argument_result[] = &$result;
    // var_dump($argument_result);
    call_user_func_array(array(__CLASS__,'testnonestatic'),$argument_result);
    // count($argument_result);
    var_dump($argument_result[count($argument_result)-1]);
  }
}
var_dump(array() == null);
$name = 'ase_asd01q;';
preg_match('/[\w_]+/i',$name,$match);

var_dump($match == $name);
die();
$time_start = microtime(true);
header('TTFB : '.(microtime(true)-$time_start));

preg_match("/^\/(\w+)\/((\w+)\/)*[\w\.]+\.(js|css)$/",

            '/emptyclass/views/Home_/Feedback.css',$match);

var_dump($match);

preg_match('/^(.+)_$/',$match[3],$match2);
var_dump($match2);

preg_match('/^\/(\w+)\/(\w+\/)*(.+)$/','/emptyclass/views/Home_/Feedback.css',$match3);
var_dump($match3);
var_dump("/frame/views/{$match2[1]}/{$match3[3]}");
die();

$class = new test;

$func = function (){
  echo '这时候的This为:';
  var_dump($this);
};
$funcBinded = $func->bindTo($class);

$funcBinded();
$funcBinded2 = $funcBinded;

//funcBinded2 是不等于 funcBinded的,就是说即便它们的生成方式一致,但是还还是不同的实例来的

//看到没有即便是重新绑定还是不会有效的,如果remove这一层膜应该是蝾螈的,还是做不到的

var_dump($func == $funcBinded);
var_dump($funcBinded == $funcBinded2);
die();

$str = 'kolos';
$class = new test;
$class->callBack(function ($obj){
  // var_dump($str);//找不到str,说明这个func的运行环境是其调用环境
  $obj->simple_hi();
});


die();

$str = '-12%';
$str = (float)substr($str,0,count($str)-2);
var_dump($str);
echo cos(pi()*3/4);
die();
$array = [
  'kolos'=>'self'
];
var_dump((object)$array);
die();
//不行那么为什么要抛弃呢call_user_method_array,不懂~~
//肯定是因为callbacks这个类型
$test = new test;
$str = 'test';
// $str::callstatic();
// $test->testnonestatic($str,$kolos);
// $test->callstatic($str,$kolos);
//我靠,原来根本没有被__call捕捉到!! 对象实例也是可以通过箭头函数调用静态的func

// var_dump($str);
// var_dump($kolos);
//再加一层的call_user_func_array();
die();
$now = strtotime('2/24');

$start = strtotime('2017-02-17');
$week_offset  = (int)date('N',$start) - 1;
$start_ajusted = $start - $week_offset * 86400;
$day = ($now - $start_ajusted)/86400;
$week = floor($day/7);
echo "现在是第{$week}周";
exit;

$_rows = [
  [
    'love'=>'蓝精灵~'
  ],
  [
    'love'=>'还是蓝精灵~'
  ],
];
class test2 {
  public $enen = '可以显示';
  protected $nono = '不可以遍历';
  private $nonotoo = '同样不可以遍历';
}
$test = new test2;

foreach($_rows as $key=>$value){
  $test->{$key} = new stdClass;
  foreach($value as $value_key=>$value_value){
    $test->{$key}->$value_key = $value_value;
  }
}
var_dump($test);
foreach($test as $key=>$value){
  echo $key.': '.$value->love."\n";
}

exit;

$isnull = null;
if(!$isnull){
  var_dump($isnull);
  // die();
}

$params = [
  'testparams'=>'ok1',
  'testparams2'=>'ok2'
];
$values = array_merge(array_keys($params),array_values($params));
var_dump($values);

$class1 = new test;
//$class1 ->set('test_set','ok')
        // ->set('蓝精灵','~')
        // ->set('我','渣渣');
//要想办法实现这样的结构或者说使用方式,

// $class1->test = 3;
// $class1->test2 = 4;
$class1->findOneBy();

var_dump(strpos('te_st','_'));
// var_dump((array)$class1);
//based newed
//test newed
$stdclass = new stdClass;
var_dump($stdclass);

$isnull = null;
$testnull = $isnull || 'indeed null';//php不可以像js那样写哦,逻辑表达式但会的事bool
var_dump($testnull);

//测试混合数组编辑

$arr = array(
  'testRelated'=>'ok',
  ['testlike','like','ok too'],//这是对通用的格式
  '怎么都要很蓝精灵挂上钩哒~'=>['是吧','对哒~'],
  ['moreCommonUsed','oparetor','sets']
);

var_dump($arr);
$class1->run();//在没有吧base实例化的时候，还是可以运行base里面的函数的，就是只要实例化这个类，你就可以使用它所继承的func
//run ok 
$_GET['m'] = 'admin#index/test';
preg_match('/([a-zA-Z-_]+)\#?([a-zA-Z-_]+)?\/?([a-zA-Z-_]+)?/iu',$_GET['m'],$params);
var_dump($params);

echo ucfirst(strtolower('abc'));


$class = 'BaseCtrl';
$key = 'Ctrl';
if(strlen($class) - strpos($class,$key) == strlen($key)){//判断是否在末尾
  echo "\ntrue";
}

// echo "\ntest static var can echo in {Base::$verb} <- here \n";
// echo Base::$verb;
//no~

$date = 'test ok ';
require('./view.htm');

if(strpos('123','1') !== false)
  var_dump(true);

$_viewFile_ = 'layoutF';
var_dump(strlen($_viewFile_) - strpos($_viewFile_,'F') === 1);

function render($_viewFile_,$_data_=null,$_return_=false){
  //想不到，直接copy Yii框架的，发现好巧妙的解决办法啊，原来这么简单的就可以搞定了，关键还是传参通过共享作用域搞定了
  //佩服佩服~~巧妙~
  if(is_array($_data_))
    extract($_data_,EXTR_PREFIX_SAME,'data');//这里官方注释说的是用来避免冲突，不明原理
    // we use special variable names here to avoid conflict when extracting data
  else
    $data=$_data_;
  if($_return_)
  {
    ob_start();
    ob_implicit_flush(false);
    require($_viewFile_);
    return ob_get_clean();
  }
  else
    require($_viewFile_);
}

#render('./view.htm','string test');