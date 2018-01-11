<?php

// $timeArr = array();
$total = 0;
$len = 1;

$ch = curl_init('http://localhost:83/emptyClass#Home/Index');
curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);

for($i=0;$i<$len;$i++){
  $page = curl_exec($ch);
  $total += curl_getinfo($ch)['starttransfer_time']*1000;
}

echo ($total/$len).'ms';