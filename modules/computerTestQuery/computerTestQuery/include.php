<?php
// session_start();
define("ROOT",dirname(__FILE__));
set_include_path('.'.PATH_SEPARATOR.ROOT.'/core'.PATH_SEPARATOR.get_include_path());
require_once("config.php");
require_once("sql.func.php");
require_once("string.func.php");
require_once("utility.php");
require_once("log.php");
Connect();
