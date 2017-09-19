<?php

class Curl extends Component {
    public $_cookies = array();
    public $_autoReferer = false;
    public $_autoConvertTo = false;
    public $ch = null;
    public $_tempHeaders = array();
    public $_headers = array(
        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.19 Safari/537.36',
    );

    public function __construct() {
        $this->ch = curl_init();
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($this->ch, CURLOPT_HEADER, true);
        if(F::$params['curlDebug']){
            curl_setopt($this->ch,CURLOPT_PROXY,'127.0.0.1:8887');
            curl_setopt($this->ch,CURLOPT_SSL_VERIFYPEER,0);
        }
    }

    public function autoReferer(bool $set){
        $this->_autoReferer = $set;
    }
    public function autoConvertTo(string $set){
        $this->_autoConvertTo = $set;
    }
    
    public function followLoaction($config = true){
        curl_setopt($this->ch, CURLOPT_FOLLOWLOCATION, $config);
        return $this;
    }

    public function timeout($timeout) {
        curl_setopt($this->ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        return $this;
    }

    public function url($url, $params=null) {
        if ($params) $url .= '?' . http_build_query($params);
        curl_setopt($this->ch, CURLOPT_URL,  $url);

        if($this->_autoReferer){
            $this->headers(array(
                'Referer' => $url
            ));
        }
        return $this;
    }

    public function method($method) {
        switch (strtolower($method)) {
            case 'get':
                curl_setopt($this->ch, CURLOPT_HTTPGET, true);
                break;

            case 'post':
                curl_setopt($this->ch, CURLOPT_POST, true);
                break;
        }
        return $this;
    }

    public function get(){
        curl_setopt($this->ch, CURLOPT_HTTPGET, true);
        return $this;
    }
    public function post(){
        curl_setopt($this->ch, CURLOPT_POST, true);
        return $this;
    }

    public function data($data) {
        curl_setopt($this->ch, CURLOPT_POSTFIELDS, $data);
        if(is_string($data)){
            $this->headers(array(
                'Content-Length' => strlen($data)
            ));
        }
        return $this;
    }

    public function port($port) {
        curl_setopt($this->ch, CURLOPT_PORT, $port);
        return $this;
    }

    public function headers($headers) {
        $this->_tempHeaders = array_merge($this->_tempHeaders, $headers);
        return $this;
    }
    protected function _headers() {//这是真实执行的
        $this->_headers = array_merge($this->_headers, $this->_tempHeaders);
        foreach ($this->_headers as $key => $value)
            $_headers[] = $key . ': ' . $value;

        curl_setopt($this->ch, CURLOPT_HTTPHEADER, $_headers);

        foreach($this->_tempHeaders as $key => $value){
            if(!($this->_autoReferer && $key === 'Referer'))
                unset($this->_headers[$key]);
        }
        $this->_tempHeaders = array();
        return $this;
    }
    public function referer($url){
        $this->headers(array(
            'Referer'=>$url
        ));
        return $this;
    }

    public function cookies($cookies) {
        $this->_cookies = array_merge($this->_cookies, $cookies);
        $_cookies = array();
        foreach ($this->_cookies as $key => $value)
            $_cookies[] = $key . '=' . $value;

        curl_setopt($this->ch, CURLOPT_COOKIE, join('; ', $_cookies));
    }

    public function send() {
        return curl_exec($this->ch);
    }

    public function getResponse($callback=null) {
        $autoConvertTo = $this->_autoConvertTo;

        if(isset($this->_tempHeaders['Accept']))
            if(strpos($this->_tempHeaders['Accept'],'text') === false)
                $autoConvertTo = false;

        $this->_headers();//有点像打补丁啊~~

        $response = new curl_response(
            $this->send(), curl_getInfo($this->ch), $autoConvertTo);

        $this->cookies($response->cookies);

        if ($callback) $callback();

        return $response;
    }
}

class Curl_response {
    public $cookies = array();
    public $headers = array();
    public $header = '';
    public $body = '';

    public function __construct($response, $info, $autoConevrtTo) {
        $this->header = substr($response, 0, $info['header_size'] - 4);
        $this->body = substr($response,  -$info['size_download']);

        $headers = explode("\r\n", $this->header);
        foreach ($headers as $header) {
            preg_match('/(.*?): (.*)/', $header, $matches);

            if (count($matches) == 3) {
                $key = strtolower($matches[1]);
                $value = $matches[2];

                if ($key == 'set-cookie') {
                    $cookie = explode('; ', $value);
                    preg_match('/(.*?)=(.*)/', $cookie[0], $matches);
                    $this->cookies[$matches[1]] = $matches[2];
                } else {
                    $this->headers[$key] = $value;
                }
            }
        }

        if($autoConevrtTo !== false){
            if($this->charset){//有chaset的时候然后就是自动转换就可以咯,这个不行
                $this->convert($this->charset,'utf-8');
            }
        }
    }
    public function convert($from, $to){//autoConvert应该是可以的,唉图片那些那会是给出错误的信息来
    //一般服务端输出图片应该是通过请求头来确定类型的,虽然可以判断文件类型来去自动转换,但是感觉是有点那个
    //判断太多,性能不太好,可能是遮掩的,不过这个是否传autoconvert可以在请求里面直接判断啊
        $this->body = iconv($from, "{$to}//ignore", $this->body);
        return $this;
    }
    public function json() {
        return json_decode($this->body);
    }

    public function __toString() {
        // if(is_string($this->body))
            return $this->body;
        // else{
        //     return '';
        // }
    }
    //享用__get就用吧
    public function __get($variable){
        switch($variable){
            case 'charset':
                if(isset($this->headers['content-type'])){
                    preg_match('/charset=([\w-]+)/',$this->headers['content-type'],$match);
                    $this->charset = $match[1] ?? false;
                }else
                    $this->charset = false;
                    
                if($this->charset == false){
                    preg_match('/<meta .* charset=([\w-]+).*>/i',$this->body,$match);
                    $this->charset = $match[1] ?? false;
                }
                return $this->charset;
            break;
        }
    }
}