<?php

class Curl extends Component {
    public $baseUrl = null;
    public $cookies = array();
    public $_autoReferer = false;
    public $ch = null;
    public $headers = array(
        'User-Agent' => 'Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/6.0)',
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

    public function timeout($timeout) {
        curl_setopt($this->ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        return $this;
    }

    public function url($url, $params=null) {
        if ($params) $url .= '?' . http_build_query($params);
        curl_setopt($this->ch, CURLOPT_URL, $url);

        if($this->_autoReferer){
            $this->headers(array(
                'Referer' => $this->baseUrl . $url
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
        return $this;
    }

    public function port($port) {
        curl_setopt($this->ch, CURLOPT_PORT, $port);
        return $this;
    }

    public function headers($headers) {
        $this->headers = array_merge($this->headers, $headers);
        foreach ($this->headers as $key => $value)
            $_headers[] = $key . ': ' . $value;

        curl_setopt($this->ch, CURLOPT_HTTPHEADER, $_headers);
        return $this;
    }
    public function referer($url){
        $this->headers(array(
            'Referer'=>$url
        ));
    }

    public function cookies($cookies) {
        $this->cookies = array_merge($this->cookies, $cookies);
        $_cookies = array();
        foreach ($this->cookies as $key => $value)
            $_cookies[] = $key . '=' . $value;

        curl_setopt($this->ch, CURLOPT_COOKIE, join('; ', $_cookies));
    }

    public function send() {
        return curl_exec($this->ch);
    }

    public function getResponse($callback=null) {
        $response = new curl_response(
            $this->send(), curl_getInfo($this->ch));

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

    public function __construct($response, $info) {
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
    }
    public function convert($from, $to){//autoConvert应该是可以的
        $this->body = iconv($from, $to.'//ignore',$this->body);
        return $this;
    }
    public function json() {
        return json_decode($this->body);
    }

    public function __toString() {
        return $this->body;
    }
}