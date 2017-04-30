<?php

//配置完之后记得把文件名改为config.php

date_default_timezone_set('Asia/Shanghai');

return array(
  'components' => array(
    'Router' => array(
      'basePath'=>__DIR__
    ),
    'Sql' => array(
      'dsn' => 'mysql:dbname=tiny_frame;host=localhost;charset=utf8',
      'user' => '数据库用户名',
      'pwd' => '数据库密码'
    ),
    'ConfigMgr' => array(),
    'View' => array(),
    'Proxy' => array(
      'sid' => '你的学号',
      'pwd' => '教务系统密码,同于更新数据的~',
      'baseUrl' => '你学校外网可以访问的外网可以访问的的青果教务系统地址例如http://xxx.xxx.xxx.xxx/Jwweb/',
      'schoolCode' => '你的学校的代码,可以教务系统那边找找~',
      'orcApi' => '你的图片识别API',
      'startDate' => '2/17'//开学的日子
    )
  ),
  // 'theme' => 'defalut',
  'params'=>array(
    'debug'=>true,
    'curlDebug'=>true
  )

);