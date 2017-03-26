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

        $responseText = $this->Curl
                             ->post()
                             ->url(self::$baseUrl.'_data/home_login.aspx')
                             ->data(http_build_query(array(
                                '__VIEWSTATE' => 'dDwtNjMyNzQ3NTkxO3Q8O2w8aTwwPjtpPDE+O2k8Mj47PjtsPHQ8cDxsPFRleHQ7PjtsPOaDoOW3nuWtpumZojs+Pjs7Pjt0PHA8bDxUZXh0Oz47bDxcPHNjcmlwdCB0eXBlPSJ0ZXh0L2phdmFzY3JpcHQiXD4KZnVuY3Rpb24gQ2hrVmFsdWUoKXsKIHZhciB2VT0kKCdVSUQnKS5pbm5lckhUTUxcOwogdlU9dlUuc3Vic3RyaW5nKDAsMSkrdlUuc3Vic3RyaW5nKDIsMylcOwogdmFyIHZjRmxhZyA9ICJZRVMiXDsgaWYgKCQoJ3R4dF9hc21jZGVmc2Rkc2QnKS52YWx1ZT09JycpewogYWxlcnQoJ+mhu+W9leWFpScrdlUrJ++8gScpXDskKCd0eHRfYXNtY2RlZnNkZHNkJykuZm9jdXMoKVw7cmV0dXJuIGZhbHNlXDsKfQogZWxzZSBpZiAoJCgndHh0X3Bld2Vyd2Vkc2Rmc2RmZicpLnZhbHVlPT0nJyl7CiBhbGVydCgn6aG75b2V5YWl5a+G56CB77yBJylcOyQoJ3R4dF9wZXdlcndlZHNkZnNkZmYnKS5mb2N1cygpXDtyZXR1cm4gZmFsc2VcOwp9CiBlbHNlIGlmICgkKCd0eHRfc2RlcnRmZ3NhZHNjeGNhZHNhZHMnKS52YWx1ZT09JycgJiYgdmNGbGFnID09ICJZRVMiKXsKIGFsZXJ0KCfpobvlvZXlhaXpqozor4HnoIHvvIEnKVw7JCgndHh0X3NkZXJ0ZmdzYWRzY3hjYWRzYWRzJykuZm9jdXMoKVw7cmV0dXJuIGZhbHNlXDsKfQogZWxzZSB7ICQoJ2RpdkxvZ05vdGUnKS5pbm5lckhUTUw9J1w8Zm9udCBjb2xvcj0icmVkIlw+5q2j5Zyo6YCa6L+H6Lqr5Lu96aqM6K+BLi4u6K+356iN5YCZIVw8L2ZvbnRcPidcOwogICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgidHh0X3Bld2Vyd2Vkc2Rmc2RmZiIpLnZhbHVlID0gJydcOwogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInR4dF9zZGVydGZnc2Fkc2N4Y2Fkc2FkcyIpLnZhbHVlID0gJydcOyAKIHJldHVybiB0cnVlXDt9CiB9CmZ1bmN0aW9uIFNlbFR5cGUob2JqKXsKIHZhciBzPW9iai5vcHRpb25zW29iai5zZWxlY3RlZEluZGV4XS5nZXRBdHRyaWJ1dGUoJ3VzcklEJylcOwogJCgnVUlEJykuaW5uZXJIVE1MPXNcOwogc2VsVHllTmFtZSgpXDsKIGlmKG9iai52YWx1ZT09IlNUVSIpIHsKICAgZG9jdW1lbnQuYWxsLmJ0bkdldFN0dVB3ZC5zdHlsZS5kaXNwbGF5PScnXDsKICAgZG9jdW1lbnQuYWxsLmJ0blJlc2V0LnN0eWxlLmRpc3BsYXk9J25vbmUnXDsKICB9CiBlbHNlIHsKICAgIGRvY3VtZW50LmFsbC5idG5SZXNldC5zdHlsZS5kaXNwbGF5PScnXDsKICAgIGRvY3VtZW50LmFsbC5idG5HZXRTdHVQd2Quc3R5bGUuZGlzcGxheT0nbm9uZSdcOwogIH19CmZ1bmN0aW9uIG9wZW5XaW5Mb2codGhlVVJMLHcsaCl7CnZhciBUZm9ybSxyZXRTdHJcOwpldmFsKCJUZm9ybT0nd2lkdGg9Iit3KyIsaGVpZ2h0PSIraCsiLHNjcm9sbGJhcnM9bm8scmVzaXphYmxlPW5vJyIpXDsKcG9wPXdpbmRvdy5vcGVuKHRoZVVSTCwnd2luS1BUJyxUZm9ybSlcOyAvL3BvcC5tb3ZlVG8oMCw3NSlcOwpldmFsKCJUZm9ybT0nZGlhbG9nV2lkdGg6Iit3KyJweFw7ZGlhbG9nSGVpZ2h0OiIraCsicHhcO3N0YXR1czpub1w7c2Nyb2xsYmFycz1ub1w7aGVscDpubyciKVw7CnBvcC5tb3ZlVG8oKHNjcmVlbi53aWR0aC13KS8yLChzY3JlZW4uaGVpZ2h0LWgpLzIpXDtpZih0eXBlb2YocmV0U3RyKSE9J3VuZGVmaW5lZCcpIGFsZXJ0KHJldFN0cilcOwp9CmZ1bmN0aW9uIHNob3dMYXkoZGl2SWQpewp2YXIgb2JqRGl2ID0gZXZhbChkaXZJZClcOwppZiAob2JqRGl2LnN0eWxlLmRpc3BsYXk9PSJub25lIikKe29iakRpdi5zdHlsZS5kaXNwbGF5PSIiXDt9CmVsc2V7b2JqRGl2LnN0eWxlLmRpc3BsYXk9Im5vbmUiXDt9Cn0KZnVuY3Rpb24gc2VsVHllTmFtZSgpewogICQoJ3R5cGVOYW1lJykudmFsdWU9JE4oJ1NlbF9UeXBlJylbMF0ub3B0aW9uc1skTignU2VsX1R5cGUnKVswXS5zZWxlY3RlZEluZGV4XS50ZXh0XDsKfQp3aW5kb3cub25sb2FkPWZ1bmN0aW9uKCl7Cgl2YXIgc1BDPU1TSUU/d2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQrd2luZG93Lm5hdmlnYXRvci5jcHVDbGFzcyt3aW5kb3cubmF2aWdhdG9yLmFwcE1pbm9yVmVyc2lvbisnIFNOOk5VTEwnOndpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50K3dpbmRvdy5uYXZpZ2F0b3Iub3NjcHUrd2luZG93Lm5hdmlnYXRvci5hcHBWZXJzaW9uKycgU046TlVMTCdcOwp0cnl7JCgncGNJbmZvJykudmFsdWU9c1BDXDt9Y2F0Y2goZXJyKXt9CnRyeXskKCd0eHRfYXNtY2RlZnNkZHNkJykuZm9jdXMoKVw7fWNhdGNoKGVycil7fQp0cnl7JCgndHlwZU5hbWUnKS52YWx1ZT0kTignU2VsX1R5cGUnKVswXS5vcHRpb25zWyROKCdTZWxfVHlwZScpWzBdLnNlbGVjdGVkSW5kZXhdLnRleHRcO31jYXRjaChlcnIpe30KfQpmdW5jdGlvbiBvcGVuV2luRGlhbG9nKHVybCxzY3IsdyxoKQp7CnZhciBUZm9ybVw7CmV2YWwoIlRmb3JtPSdkaWFsb2dXaWR0aDoiK3crInB4XDtkaWFsb2dIZWlnaHQ6IitoKyJweFw7c3RhdHVzOiIrc2NyKyJcO3Njcm9sbGJhcnM9bm9cO2hlbHA6bm8nIilcOwp3aW5kb3cuc2hvd01vZGFsRGlhbG9nKHVybCwxLFRmb3JtKVw7Cn0KZnVuY3Rpb24gb3Blbldpbih0aGVVUkwpewp2YXIgVGZvcm0sdyxoXDsKdHJ5ewoJdz13aW5kb3cuc2NyZWVuLndpZHRoLTEwXDsKfWNhdGNoKGUpe30KdHJ5ewpoPXdpbmRvdy5zY3JlZW4uaGVpZ2h0LTMwXDsKfWNhdGNoKGUpe30KdHJ5e2V2YWwoIlRmb3JtPSd3aWR0aD0iK3crIixoZWlnaHQ9IitoKyIsc2Nyb2xsYmFycz1ubyxzdGF0dXM9bm8scmVzaXphYmxlPXllcyciKVw7CnBvcD1wYXJlbnQud2luZG93Lm9wZW4odGhlVVJMLCcnLFRmb3JtKVw7CnBvcC5tb3ZlVG8oMCwwKVw7CnBhcmVudC5vcGVuZXI9bnVsbFw7CnBhcmVudC5jbG9zZSgpXDt9Y2F0Y2goZSl7fQp9CmZ1bmN0aW9uIGNoYW5nZVZhbGlkYXRlQ29kZShPYmopewp2YXIgZHQgPSBuZXcgRGF0ZSgpXDsKT2JqLnNyYz0iLi4vc3lzL1ZhbGlkYXRlQ29kZS5hc3B4P3Q9IitkdC5nZXRNaWxsaXNlY29uZHMoKVw7Cn0KZnVuY3Rpb24gY2hrcHdkKG9iaikgeyAgaWYob2JqLnZhbHVlIT0nJykgIHsgICAgdmFyIHM9bWQ1KGRvY3VtZW50LmFsbC50eHRfYXNtY2RlZnNkZHNkLnZhbHVlK21kNShvYmoudmFsdWUpLnN1YnN0cmluZygwLDMwKS50b1VwcGVyQ2FzZSgpKycxMDU3NycpLnN1YnN0cmluZygwLDMwKS50b1VwcGVyQ2FzZSgpXDsgICBkb2N1bWVudC5hbGwuZHNkc2RzZHNkeGN4ZGZnZmcudmFsdWU9c1w7fSBlbHNlIHsgZG9jdW1lbnQuYWxsLmRzZHNkc2RzZHhjeGRmZ2ZnLnZhbHVlPW9iai52YWx1ZVw7fSB9ICBmdW5jdGlvbiBjaGt5em0ob2JqKSB7ICBpZihvYmoudmFsdWUhPScnKSB7ICAgdmFyIHM9bWQ1KG1kNShvYmoudmFsdWUudG9VcHBlckNhc2UoKSkuc3Vic3RyaW5nKDAsMzApLnRvVXBwZXJDYXNlKCkrJzEwNTc3Jykuc3Vic3RyaW5nKDAsMzApLnRvVXBwZXJDYXNlKClcOyAgIGRvY3VtZW50LmFsbC5mZ2ZnZ2ZkZ3R5dXV5eXV1Y2tqZy52YWx1ZT1zXDt9IGVsc2UgeyAgICBkb2N1bWVudC5hbGwuZmdmZ2dmZGd0eXV1eXl1dWNramcudmFsdWU9b2JqLnZhbHVlLnRvVXBwZXJDYXNlKClcO319Clw8L3NjcmlwdFw+Oz4+Ozs+O3Q8O2w8aTwxPjs+O2w8dDw7bDxpPDA+Oz47bDx0PHA8bDxUZXh0Oz47bDxcPG9wdGlvbiB2YWx1ZT0nU1RVJyB1c3JJRD0n5a2m44CA5Y+3J1w+5a2m55SfXDwvb3B0aW9uXD4KXDxvcHRpb24gdmFsdWU9J1RFQScgdXNySUQ9J+W3peOAgOWPtydcPuaVmeW4iOaVmei+heS6uuWRmFw8L29wdGlvblw+Clw8b3B0aW9uIHZhbHVlPSdTWVMnIHVzcklEPSfluJDjgIDlj7cnXD7nrqHnkIbkurrlkZhcPC9vcHRpb25cPgpcPG9wdGlvbiB2YWx1ZT0nQURNJyB1c3JJRD0n5biQ44CA5Y+3J1w+6Zeo5oi357u05oqk5ZGYXDwvb3B0aW9uXD4KOz4+Ozs+Oz4+Oz4+Oz4+Oz4ARUTDEdrJEi+PKNR1bNPc4LT0tA==',
                                'pcInfo' => 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.19 Safari/537.36undefined5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.19 Safari/537.36 SN:NULL',
                                'typeName' => 'ѧ��',
                                'dsdsdsdsdxcxdfgfg' => $_hash($sid . $_hash($pwd) . self::$schoolCode),
                                'fgfggfdgtyuuyyuuckjg' => $_hash($_hash(strtoupper($captcha)) . self::$schoolCode),
                                'Sel_Type' => 'STU',
                                'txt_asmcdefsddsd' => $sid,
                                'txt_pewerwedsdfsdff' => '',
                                'txt_sdertfgsadscxcadsads' => '',
                            )))
                            ->headers(array(
                                'DNT' => '1',
                                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                                'Accept-Encoding' => 'gzip, deflate',
                                'Accept-Language' => 'zh-CN,zh;q=0.8',
                                'Origin' => 'http://119.146.68.54',
                                'Upgrade-Insecure-Requests' => '1',
                                'Pragma' => 'no-cache',
                                'Cache-Control' => 'no-cache'
                            ))
                        ->getResponse()->convert('gb2312','utf-8');

        // echo 'login收到请求的cookies:<br>';
        // var_dump($responseText->cookies);
        $responseText = $responseText->body;
        // echo '<pre>'.htmlspecialchars($responseText).'</pre>';

        //parse
        if (!strpos($responseText, '正在加载权限数据')) {
            preg_match(
                '/color="White">(.*?)<br>登录失败！/U', $responseText, $matches);
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
        for($i = 0, $check = false; $check !== true && $i < 1; $i++){
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