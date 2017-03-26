<?php

$_cookies = array();
$_headers = array();

$header_str = file_get_contents('headers.txt');
$headers = explode("\r\n", $header_str);
foreach ($headers as $header) {
    preg_match('/(.*?): (.*)/', $header, $matches);
    if (count($matches) == 3) {
        $key = strtolower($matches[1]);
        $value = $matches[2];

        if ($key == 'set-cookie') {
            $cookie = explode('; ', $value);
            preg_match('/(.*?)=(.*)/', $cookie[0], $matches);
            $_cookies[$matches[1]] = $matches[2];
        } else {
            $_headers[$key] = $value;
        }
    }
}

var_dump($_cookies);
var_dump($_headers);