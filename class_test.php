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
    // testinner();
    
  }
  public function getself(){
    $newer = new self;
    $newer->name = '是新的';
    return $newer;
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
  function testinner(){echo 'testinner ok';}
  public function getXN() {
        $month = (int) date('m');
        $year = (int) date('Y');
        if ($month <= 7)
            $year -= 1;
        return '2017';
        return $year;
    }
    public function getXQ() {
        $month = (int) date('m');
        return '0';
        return ($month < 2 || $month > 7 ? '0' : '1');
    }
    public function lastXN(){
        return (!$this->lastXQ())? $this->getXN() : $this->getXN() -1;
    }
    public function lastXQ(){
        return ($this->getXQ())?0:1;
    }
}
$url = array('Home_','Index');
$len = strlen($url[0]);
var_dump(strpos($url[0],'_') == $len-1);
var_dump(substr($url[0],0,$len-1));
die();
$str = 'g_img={url: "/az/hprichbg/rb/EuropeanRabbitGreeting_ZH-CN10625718769_1920x1080.jpg",id:\'bgDi';
preg_match('/g_img={url: "(.+)\",/',$str,$match);
var_dump($match);
die();
echo urldecode('%2FQueryMarkUpAction.do%3Fact%3DdoQueryCond%26sid%3D300%26pram%3Dresults%26ksnf%3D4723%26sf%3D%26bkjb%3D14%26sfzh%3D445381199306086030%26name%3D%E9%99%88%E4%B8%96%E6%9D%B0&ksnf=4723&bkjb=14&sfzh=445381199306086030&name=%E9%99%88%E4%B8%96%E6%9D%B0&verify=yn8n');
die();
$test = new test;
echo $test->getXN().$test->getXQ()."\n";
echo $test->lastXN().$test->lastXQ();


die();
echo time();
var_dump(iconv('UCS-2BE', 'UTF-8', pack('H4','6709')));

die();
$a = system("pwd");
print_r($a);  
// print_r($out);  
die();

$str = '「1」无水印图片盼我疯魔 还盼我孑孓不独活 想我冷艳 还想我轻佻又下贱「2」天青色等烟雨 而你们是不是在等我更新？木雕黑背，足以乱真亮点自寻「3」来！各位壮士，趁热干了这杯“反鸡汤”「4」真正的好朋友。高考和大学考试的对比，无法反驳！希望人人都有自知之明我本来不喜欢化妆的针不扎在你身上，你永远不知道疼。「5」好有道理「6」没毛病「7」没有性基础好神奇一句话解决情侣间90％的矛盾。你是个好男孩好像哪里不对「8」当你觉得自己胖的时候，你可能不知道，那只是刚刚开始「9」憋屈「10」来玩一个辨识度的小游戏【初级版】：以下是小猪罗志祥的女朋友周扬清，请记住她的脸再来，号称“天王嫂”的郭富城新女友方媛，请记住她的脸林更新前绯闻女友王柳雯，请记住她的脸“国民老公”王思聪前女友雪梨，请记住她的脸接下来厉害了！提问：请从下方的图中找出天王嫂方媛哈？？？？【进阶版】：天王嫂方媛的照片请大家再看一眼！题来了！请在以上照片中找出方媛！怎么办，我感觉自己似乎是瞎了一言不合逼死脸盲之【终极版】：天下网红一张脸，同脸同鼻同医生，我选择狗带......整容脸不漂亮吗？当然不是她们的眼睛、脸型、鼻子......都有经过精心的设计欧式大眼、锥子脸、高鼻梁因为想要追求美的定义大同小异所以张张脸才会像流水线下生产出来的产品毫无辨识度美，却并不能让人记住。丑得别具一格又如何？宋X宝？罗X凤？王X强？X渤？特色虽有，却不能让人觉得赏心悦目美和特色不可兼得？也不见得「11」女子和“男友”交往一年被骗走一百多万 完全不知对方居然是个女的。被害人雯雯说，自己和“男朋友”交往一年被骗了一百多万并欠下了高利贷。当民警将雯雯“男友”的信息输入户籍系统进行查询时，却发现身份信息显示这个“男朋友”性别竟然是女。据雯雯说，她从来没有怀疑过“男友”的性别。由于“男友”人胖，有点胸部雯雯也觉得正常。刘某的妻子长相漂亮，刘某便用妻子的照片当头像，假装“妹子”到处诈骗“痴情男”，总共骗了7万多。而骗来的钱，都被刘某打赏给了女主播。刘某被抓后还感慨：什么样的傻子都有啊！刘某获刑3年7个月。「12」两百平米的供暖设施「13」这绝对是只色猫「14」深深的伤害了我「15」人是可以貌相的「16」岛国一小姑娘想要个娃娃屋，央求爷爷给做一个，爷爷说我也不懂洋玩意，给你做个和式的吧...然后就诞生出了这个「17」有故事的买家「18」你是怎么知道的？骗你我是小狗！喜欢吃榴莲么？「19」没有任何特长是种什么体验？「20」如果妈妈比女儿漂亮，那么两个人分别会有怎样的心理体验？「21」家里的狗突然冲到爸爸面前狂吠，咬裤腿咬鞋子，把他拽到家附近的水坝边。令人震惊的一幕出现，两岁的儿子面朝下地浮在水面上，毫无知觉。「22」荷兰耗资700万欧元，专门给翘首以盼15年的大熊猫修了一座超豪华的中式熊猫宫殿“Pandasia”！。。熊猫真的不是你想借就能借。。。待遇太好了「23」动漫「24」福利「25」功夫死神来了人与人之间的信任呢妈的，智障...「26」【看时间】有时候我们不得不承认，我们害怕时间的到来，更害怕时间说实话。「27」【看力量】真正的力量是：当所有的人都希望你崩溃的时候，你还可以聚精会神。「28」【看背叛】 这个世界上谁都有可能背叛你，除了你的知识和财富。「29」【看懦弱】柔弱不是你的错，但是懦弱你会一错再错。';

preg_match_all('/「/',$str,$sayingSplit);
var_dump($sayingSplit);

die();
$endYear = 2017;
$endMounth = 4;
$miusOneMonth = function(&$month, &$year){
  if(--$month == 0){
    $month = 12;
    $year--;
  }
};
for($i = 0 ; $i<12 ; $i++){
  $miusOneMonth($endMounth,$endYear);
  echo $endYear.'-'.$endMounth."\n";
}

die();
$major =  '123123|test';
$name = preg_split('/[|]/',$major);

var_dump($name);

die();
$arr = [
  'test'=>'ok',
  'test2'=>'ok2'
];
$str = http_build_query($arr);
var_dump($str);
die();
$dom = new DOMDocument;
@$dom->loadHTMLFile('./classList.html');
print_r($dom->getElementsByTagName('select')[0]);

die();
$test = $tset ?? true;
var_dump($test);
die();
$test1 = new test;
$test2 = $test1;

var_dump($test1 == $test2);

die();

$_hash = function($s) {
    return strtoupper(substr(md5($s), 0, 30));
};
var_dump($_hash($_hash(strtoupper('k842')) . '10577'));

var_dump(http_build_query(array('test'=>'sdf','test2'=>'2')));
die();
var_dump(array() == null);
$name = 'color="White">验证码错误！<br>';
preg_match('/color="White">(.+)</',$name,$match);

var_dump($match);
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