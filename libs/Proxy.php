<?php
include Router::$basePath.'/libs/functions/__base__.php';

class Proxy extends Component {
    public static $sid;
    public static $pwd;
    public static $baseUrl;
    public static $schoolCode;
    public static $orcApi;
    public static $startDate;

    public $isTestOk = false;

    public static function globalConfig($config){//这个设计的十分不好
      foreach($config as $key=>$value)
        self::$$key = $value;
    }

    public function init(){//一些其他component的调用初始化需要放在这里
        //这里是包括component的runtime config
        $this->Curl->timeout(1);
        $this->Curl->autoReferer(true);
        $this->Curl->cookies(array('name'=>'value'));
        $this->Curl->headers(array(
            'DNT' => '1',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding' => 'gzip, deflate',
            'Accept-Language' => 'zh-CN,zh;q=0.8',
            'Origin' => 'http://119.146.68.54',
            'Upgrade-Insecure-Requests' => '1',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'no-cache'

        ));
        __base__::$proxy = $this;

        //write($uri,$extension,$conent)
        $this->DataMgr->Hook->before('write',function(&$uri,&$extension,&$content){
            $imagesExt = array(
                'jpeg',
                'png',
                'jpg'
            );
            if(in_array($extension,$imagesExt))
                $this->waterMark->loadFromStr($content)
                                ->addText('微报',[156,156,156],'迷你简黄草',20)
                                ->run();
        });
    }

    public function __construct($session=null) {
        //component的基本workflow
        if($session != null)
            $this->setSession($session);
    }

    public function __call($func, $arguments){//对,还是有点优势的,因为从执行流上面就暗示了没有加载过嘛
      include 'functions/' . $func . '.php';
      $this->{$func} = new $func;
      return call_user_func_array(array($this,$func), $arguments);
    }

    public function updateFields(array $fields, bool $newTerm){
        //没有了就是这个而已
        foreach($fields as $value){
            $this->{$fields}->store();
            //你看折腾这么久,其实这个func只有那么这几行代码而已,压档的工作都放在store里面去了,这里只管更新
        }
    }

    public function login($sid, $pwd, $captcha) {
        //getData
        $_hash = function($s) {
            return strtoupper(substr(md5($s), 0, 30));
        };
        // echo 'login发送之前的cookies<br>';
        // var_dump($this->Curl->_cookies);

        foreach($data as $key=>$value)
            $datas[] = $key.'='.$value;

        $responseText = $this->Curl
                             ->post()
                             ->url(self::$baseUrl.'_data/home_login.aspx')
                             ->data(http_build_query(array(
                                // 'typeName' => '%D1%A7%C9%FA',
                                'Sel_Type' => 'STU',
                                'txt_asmcdefsddsd' => $sid,
                                'fgfggfdgtyuuyyuuckjg' => $_hash($_hash(strtoupper($captcha)) . self::$schoolCode),
                                'dsdsdsdsdxcxdfgfg' => $_hash($sid . $_hash($pwd) . self::$schoolCode),
                                'txt_pewerwedsdfsdff' => '',
                                'txt_sdertfgsadscxcadsads' => ''
                            )))
                            ->headers(array(
// Host: 119.146.68.54
// Connection: keep-alive
// Content-Length: 5829
// Pragma: no-cache
// Cache-Control: no-cache
// Origin: http://119.146.68.54
// Upgrade-Insecure-Requests: 1
// User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.19 Safari/537.36
// Content-Type: application/x-www-form-urlencoded
// Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
// DNT: 1
// Referer: http://119.146.68.54/Jwweb/_data/home_login.aspx
// Accept-Encoding: gzip, deflate
// Accept-Language: zh-CN,zh;q=0.8
// Cookie: name=value; ASP.NET_SessionId=xty2nwi14g4xzdmz02jhwm45
                            ))
                        ->getResponse()->convert('gb2312','utf-8');
        
        // echo 'login收到请求的cookies:<br>';
        // var_dump($responseText->cookies);
        $responseText = $responseText->body;
        // echo '<pre>'.htmlspecialchars($responseText).'</pre>';
        //parse
        if (!strpos($responseText, '正在加载权限数据')) {
            preg_match(
                '/"color:White;">(.*?)<br>登录失败！/U', $responseText, $matches);
            if (isset($matches[1])) {
                return $matches[1];//这里输出验证码错误还有密码错误信息
            } else {
                return '系统错误，无法登录';
            }
        } else {
            return true;
        }
    }

    public function autoLogin(){
        for($i = 0, $check = false; $check !== true && $i < 3; $i++){
            $captcha = $this->getCaptchaText();
            var_dump($captcha);
            // sleep(5);
            if(strlen($captcha) > 0){
                $check = $this->login(self::$sid, self::$pwd, $captcha);
                if($check === true)
                    return true;
                else{
                    echo $check.'<br>';
                }
            }
        }
        return $check;
    }

    public function getSession() {
        if (!isset($this->Curl->_cookies['ASP.NET_SessionId']))
            return $this->generateSessionId();
        return $this->Curl->_cookies['ASP.NET_SessionId'];
    } 

    public function getCaptcha() {
        // echo 'captcha发送之前的cookies<br>';
        // var_dump($this->Curl->_cookies);
        $result = $this->Curl->get()
                          ->url(self::$baseUrl.'sys/ValidateCode.aspx')
                          ->getResponse();
        // echo 'captcha发送之后的cookies<br>';
        // var_dump($result->cookies);
        return $result->body;
    }

    public function getCaptchaText(){
        $src = $this->getCaptcha();
        $src_base64 = base64_encode($src);
        echo "<img src='data:image/png;base64,{$src_base64}'>";
        $this->DataMgr->Pub->direct->write('captcha','jpg',$src);
        $captchaUrl = 'http://'.$_SERVER['HTTP_HOST'].'/data/captcha.jpg';
        return $this->Curl->get()->url(self::$orcApi.$captchaUrl)
                    ->getResponse()->body;
    }

    public function setSession($session) {
        echo '初始化cookies:<br>';
        $this->Curl->cookies(array('ASP.NET_SessionId' => $session));
    }

    protected function generateSessionId() {
        $str = '012345abcdefghijklmnopqrstuvwxyz';
        $result = '';
        for ($i=0; $i < 24; $i++) {
            $result .= $str[rand(0, strlen($str)-1)];
        }
        return $result;
    }
    
    public function weekNumber($date=null) {
        if ($date)
            $now = strtotime($date);
        else
            $now = time();
        $start = strtotime(self::$startDate);
        $week_offset  = (int)date('N',$start) - 1;
        $start_ajusted = $start - $week_offset * 86400;
        $day = ($now - $start_ajusted)/86400;
        $week = floor($day/7);
        return $week;
    }

    public function getXNXQ() {
        return $this->getXN() . $this->getXQ();
    }
    public function getXN() {
        $month = (int) date('m');
        $year = (int) date('Y');
        if ($month <= 7)
            $year -= 1;
        return $year;
    }
    public function getXQ() {
        $month = (int) date('m');
        return ($month < 2 || $month > 7 ? '0' : '1');
    }
    
}