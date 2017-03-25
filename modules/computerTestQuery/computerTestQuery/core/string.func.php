<?php


function preg_date($date_str){
    preg_match_all("/\d+/",$date_str,$dateArray);
    return $dateArray[0];
}

function logs(){
    
    
}

function uid(){
    //生成一个临时的唯一标识符,这一段copy算了,不想去了解那个算法,只想实现功能
    $charid = strtoupper(md5(uniqid(mt_rand(), true)));
    $hyphen = chr(45);// "-"
    $uuid = chr(123)// "{"
    .substr($charid, 0, 8).$hyphen
    .substr($charid, 8, 4).$hyphen
    .substr($charid,12, 4).$hyphen
    .substr($charid,16, 4).$hyphen
    .substr($charid,20,12)
    .chr(125);// "}"
    return $uuid;
}