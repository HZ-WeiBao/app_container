<?php

$str = "test cHar(): ok";
$str = preg_replace('/Char\(/i','',$str);

// var_dump($str);
//我靠感觉i的运算两会大很多,能不用就不用
$row['major_name'] = '公共体育1123';
// var_dump(strpos($row['major_name'],'公共体育'));

$str = 'is/*test*/ ok';
$str = preg_replace('/\/\*.*\*\//i','',$str);
var_dump($str);