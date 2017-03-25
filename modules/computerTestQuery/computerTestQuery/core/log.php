<?php

function logCount($type){
    //检查log是否有对应的项
    $count_sql = select('log',['count'],['name'=>$type]);
    if($count = mysql_fetch_row($count_sql)){
        $i = update('log',['count'=>intval($count[0])+1],['name'=>$type]);
    }else{
        $i = insert('log',['name'=>$type , 'count'=>1]);
    }
}

function logLike($type){
    $count_sql = select('like_log',['count'],['name'=>$type]);
    if($count = mysql_fetch_row($count_sql)){
        $i = update('like_log',['count'=>intval($count[0])+1],['name'=>$type]);
    }else{
        $i = insert('like_log',['name'=>$type , 'count'=>1]);
    }
}