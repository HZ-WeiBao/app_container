<?php
// function issets($arr){
//     for($i = 0 ; $i < count($arr) ; $i++){
//         echo $arr[$i];
//         $seted &= isset($arr[i]);
//     }
//     unset($arg);
//     return (bool)$seted;
// }

function checkRange($arg,$form,$to){
    if($arg >= $form && $arg <= $to)
        return true;
    else
        return false;
}
function checkIn($arg,$arr){
    if( gettype($arg) == 'string'){
        foreach($arr as $value)
            if($value != $arg) return false;
    }elseif( gettype($arg) == 'array' ){
        $same_count = 0;
        foreach($arg as $key)
            foreach($arr as $value)
                if($key == $value) $same_count++;
        if($same_count != count($arg)) 
            return false;
    }
    return true;
}
function start_week(){
    //上下学期
    if(time() > strtotime('8/1')){
        $start_week = date('W',strtotime(FIRST_TREM_START));
    }else{
        $start_week = date('W',strtotime(SECOND_TREM_START));
    }
    return $start_week;
}

function whichWeek(){
    //第几周
    $whichWeek =  date('W', time());
    $start_week = start_week();
    $week = $whichWeek - $start_week;
    return $week;
}
function single_double_week(){
    // $week = 1;
    $week = whichWeek();
    $weekly = ($week%2)?1:2; //偶数2,奇数1
    // $noneWeekly = ($week%2)?2:1; //偶数2,奇数1,但是如果是单周的就是说不选择双周的
    return $weekly;
}