<?php
date_default_timezone_set('Asia/Shanghai');

return array(
  'components' => array(//这个时候config相当于init
    'Router' => array(
      'basePath'=>__DIR__
    ),
    'Sql' => array(
      'dsn' => 'mysql:dbname=tiny_frame;host=localhost;charset=utf8',
      'user' => 'root',
      'pwd' => 'sDA6kFbInOrtELb6lEI6!'
    ),
    'ConfigMgr' => array(),
    'View' => array(),
    'Proxy' => array(
      'sid' => '1514080902121',
      'pwd' => '458200',
      'baseUrl' => 'http://119.146.68.54/jwweb/',
      'schoolCode' => '10577',
      'orcApi' => 'http://meanchun.com/wb/wbocr/wbocr.php?url=',
      'startDate' => '2/17'
    )
  ),
  'theme' => 'defalut',//框架的主题，包括控件，不过一般不会很大的风格修改只是增加饰物
  'params'=>array(
    'debug'=>false,
    'curlDebug'=>false
  )

);