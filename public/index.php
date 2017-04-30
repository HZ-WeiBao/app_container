<?php
global $startTime;
$startTime = microtime(true);

$path = __DIR__;
$config = include($path.'/../config.php');
include($path.'/../libs/Frame.php');

F::init($config)->run();