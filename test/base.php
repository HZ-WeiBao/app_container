<?php

function excuteTime($func){
  $startTime = microtime(true);
  $func();
  return (microtime(true) - $startTime)*1000;
}

function loop($func){
  for($i=0; $i<10000; $i++)
    $func();
}

function percent($first,$second){
    return ($first/$second)*100;
}

function echoLine($str=''){
  echo $str."\n";
}