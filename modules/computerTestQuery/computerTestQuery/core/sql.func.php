<?php
//链接
function Connect(){
    $link = mysql_connect(DB_HOST,DB_USER,DB_PSWD) or die("数据库连接失败:".mysql_errno().":".mysql_error());
    mysql_set_charset(DB_CHARSET,$link);
    mysql_select_db(DB_NAME,$link) or die("指定数据库连接失败");
}

function insert($table,$array){
    $keys_arr = array_keys($array);
    foreach($keys_arr as $key => $value){
        $keys_arr[$key] = mysql_real_escape_string($value);
    }
    $values_arr = array_values($array);
    foreach($values_arr as $key => $value){
        $values_arr[$key] = mysql_real_escape_string($value);
    }
    $keys = join("`,`",$keys_arr);
    $vals = join("','",$values_arr);
    $table = mysql_real_escape_string($table);
    $sql = "insert into `{$table}` (`{$keys}`) values ('{$vals}')";
    return mysql_query($sql);
}

function update($table,$array,$where){
    $i = 0;
    $setting = array();
    foreach ($array as $key => $value) { $setting[$i++] = mysql_real_escape_string($key)."='".mysql_real_escape_string($value)."'"; }
    $keys = join(",",$setting);
    //处理where
    if($where != ""){
        $i = 0;
        $where_formatted = array();
        foreach ($where as $key => $value) { $where_formatted[$i++] = mysql_real_escape_string($key)."='".mysql_real_escape_string($value)."'"; }
        $where_keys = join(" and ",$where_formatted);
        $where_keys = " where ".$where_keys;
    }else
        $where_keys = "";
    $table = mysql_real_escape_string($table);
    $sql = "update {$table} set {$keys} {$where_keys}";
    return mysql_query($sql);
}

function queryLast($table,$array,$last){
    $values_arr = array_values($array);
    foreach($values_arr as $key => $value){
        $values_arr[$key] = mysql_real_escape_string($value);
    }
    $vals = join("','",$values_arr);
    $table = mysql_real_escape_string($table);
    $last = mysql_real_escape_string($last);
    $sql = "SELECT {$vals} FROM {$table} 
            ORDER BY {$last} DESC
            LIMIT 1;";
    //只有ms access 支持last函数
    $result = mysql_query($sql);
    return $result;
}
function remove($table,$where){
    if($where != ""){
        $i = 0;
        $where_formatted = array();
        foreach ($where as $key => $value) { $where_formatted[$i++] = mysql_real_escape_string($key)."='".mysql_real_escape_string($value)."'"; }
        $where_keys = join(" and ",$where_formatted);
        $where_keys = " where ".$where_keys;
    }else
        return 0;
    $table = mysql_real_escape_string($table);
    $sql = "delete from {$table} {$where_keys}";
    $result = mysql_query($sql);
    return $result;
}
function newTable($tableName,$column){
    $tableName = mysql_real_escape_string($tableName);
    $column = mysql_real_escape_string($column);
    $sql = "CREATE TABLE {$tableName}(
    {$column}
    )";
    return mysql_query($sql);
}
function sql_count($table,$array,$where=""){//一般只会统计一栏的数目
    $count_sql = select($table,$array,$where);
    $count_totle = 0;
    while($count = mysql_fetch_assoc($count_sql))
        if($array[0] == "*")
            $count_totle++;
        else
            $count_totle += intval($count[$array[0]]);//这里的意思是统计某一行数值的sum
    return $count_totle;
}

function select($table,$array,$where="",$additional_front="",$additional_Back=""){
    $values_arr = array_values($array);
    foreach($values_arr as $key => $value){
        $values_arr[$key] = mysql_real_escape_string($value);
    }
    $keys = join("','",$values_arr);
    if($where == ""){
        $where_keys = "";
    }else{
        $i = 0;
        $where_formatted = array();
        foreach ($where as $key => $value) { $where_formatted[$i++] = mysql_real_escape_string($key)."='".mysql_real_escape_string($value)."'"; }
        $where_keys = join(" and ",$where_formatted);
        $where_keys = " where ".$where_keys;
    }
    $table = mysql_real_escape_string($table);
    $additional_front = mysql_real_escape_string($additional_front);
    $additional_Back = mysql_real_escape_string($additional_Back);
    $sql = "select {$additional_front} {$keys} from {$table} {$where_keys} {$additional_Back}";
    return mysql_query($sql);
}
//where 有好多语句不仅仅是=,那么原来的select局限性就变大了,忘了改为怎样使用了
function select2($table,$array,$where="",$additional_front="",$additional_Back=""){
    $keys_arr = array_keys($array);
    foreach($keys_arr as $key => $value){
        $keys_arr[$key] = mysql_real_escape_string($value);
    }
    $keys = join("`,`",$keys_arr);
    if($where == ""){
        $where_keys = "";
    }else{
        $i = 0;
        $where_formatted = array();
        foreach ($where as $key => $value) { $where_formatted[$i++] = $value; }
        $where_keys = join(" and ",$where_formatted);
        $where_keys = " where ".$where_keys;
    }
    $sql = "select {$additional_front} {$keys} from {$table} {$where_keys} {$additional_Back}";
    return mysql_query($sql);
}

function search($table,$array,$where="",$additional_front="",$additional_Back=""){
    $values_arr = array_values($array);
    foreach($values_arr as $key => $value){
        $values_arr[$key] = mysql_real_escape_string($value);
    }
    $keys = join("','",$values_arr);
    if($where == ""){
        $where_keys = "";
    }else{
        $i = 0;
        $where_formatted = array();
        foreach ($where as $key => $value) { $where_formatted[$i++] = mysql_real_escape_string($key)." like '%".mysql_real_escape_string($value)."%'"; }
        $where_keys = join(" and ",$where_formatted);
        $where_keys = " where ".$where_keys;
    }
    $table = mysql_real_escape_string($table);
    $additional_front = mysql_real_escape_string($additional_front);
    $additional_Back = mysql_real_escape_string($additional_Back);
    $sql = "select {$additional_front} {$keys} from {$table} {$where_keys} {$additional_Back}";
    return mysql_query($sql);
}
//妈蛋之前没有把where和like部分分离,唉搞到不好
function search2($table,$array,$where="",$like="",$additional_front="",$additional_Back=""){
    $keys = join(",",array_values($array));
    if($where == ""){
        $where_keys = "";
    }else{
        $i = 0;
        $where_formatted = array();
        foreach ($where as $key => $value) { $where_formatted[$i++] = $key."='".$value."'"; }
        $where_keys = join(" and ",$where_formatted);
    }
    if($like == ""){
        $like_keys = "";
    }else{
        $i = 0;
        $like_formatted = array();
        foreach ($like as $key => $value) { $like_formatted[$i++] = $key." like '%".$value."%'"; }
        $like_keys = join(" and ",$like_formatted);
    }
    if($where_keys == '' && $like_keys == '')
        $where_keys = '';
    elseif($where_keys != '' && $like_keys == '')
        $where_keys = " where ".$where_keys;
    elseif($where_keys == '' && $like_keys != '')
        $where_keys = " where ".$like_keys;
    elseif($where_keys != '' && $like_keys != '')
        $where_keys = " where ".$where_keys.' and '.$like_keys;
    $sql = "select {$additional_front} {$keys} from {$table} {$where_keys} {$additional_Back}";
    return mysql_query($sql);
}

function drop($table){
    $table = mysql_real_escape_string($table);
    $sql = "DROP TABLE ".$table;
    return mysql_query($sql);
}

function truncate($table){
    $table = mysql_real_escape_string($table);
    $sql = "TRUNCATE TABLE ".$table;
    return mysql_query($sql);
}

function drop_col($tableName,$columnName){//支持批量多个colmn
    $columns = "";
    if(is_string($columnName)){
        $columns = "DROP COLUMN ".mysql_real_escape_string($columnName);
    }elseif(is_array($columnName)){
        $len = count($columnName);
        for($i = 0;$i < $len-1;$i++){
            $columns .= "DROP COLUMN '".mysql_real_escape_string($columnName[$i])."', ";
        }
        $columns .= "DROP COLUMN '".mysql_real_escape_string($columnName[$len-1])."'";
    }
    $tableName = mysql_real_escape_string($tableName);
    $sql = "alter table `".$tableName."` ".$columns;
    return mysql_query($sql);
}

function add_col($tableName,$columnName,$columnType){//columnType 除了类型还要注明默认值DEFAULT NULL或者NOT NULL
    //同样支持批量add吧,自后在支持吧,有点麻烦,但是为了性能,还是支持吧
    $columns = "";
    if(is_string($columnName) && is_string($columnType)){
        $columns = "add COLUMN ".mysql_real_escape_string($columnName)." ".mysql_real_escape_string($columnType);
    }elseif(is_array($columnName) && is_array($columnType)){
        $len = count($columnName);
        for($i = 0;$i < $len-1;$i++){
            $columns .= "add COLUMN '".mysql_real_escape_string($columnName[$i])."' ".mysql_real_escape_string($columnType[$i]).", ";
        }
        $columns .= "add COLUMN '".mysql_real_escape_string($columnName[$len-1])."' ".mysql_real_escape_string($columnType[$i]);
    }
    $tableName = mysql_real_escape_string($tableName);
    $sql = "alter table ".$tableName." ".$columns;
    return mysql_query($sql);
}

function alter_col(){

}

//适用范围不太广
function sqlFilter($str){
    $str = mysql_real_escape_string($str);
    $str = htmlspecialchars($str,ENT_QUOTES);
    // $str = str_replace("/**/","／＊＊／",$str);
    //这样还是不行的
    //面对/*test*/就是不行了
    $str = preg_replace('/\/\*.*\*\//isU','／＊＊／',$str);
    $str = str_replace("'","＇",$str);
    $str = str_replace(";","；",$str);
    $str = str_replace("<","＜",$str);
    $str = str_replace(">","＞",$str);
    $str = str_replace("javascript:","js：",$str);
    $str = str_replace("jscript:","js：",$str);
    $str = str_replace("vbscript:","vb：",$str);
    $str = str_replace("--","－－",$str);
    $str = preg_replace('/char\(/i','ｃｈａｒ（',$str);
    // $str = str_replace("char(","",$str);
    // $str = str_replace("CHAR(","",$str);
    $sqlCmd = [
        "select"=>'ｓｅｌｅｃｔ',
        "sysobjects"=>'ｓｙｓｏｂｊｅｃｔｓ',
        "exec"=>'ｅｘｅｃ',
        "creat"=>'ｃｒｅａｔ',
        "drop"=>'ｄｒｏｐ',
        "insert"=>'ｉｎｓｅｒｔ',
        "update"=>'ｕｐｄａｔｅ',
        "delete"=>'ｄｅｌｅｔｅ',
        "truncate"=>'ｔｒｕｎｃａｔｅ',
        "xp_cmdshell"=>'ｘｐ＿ｃｍｄｓｈｅｅｌｌ',
        "declare"=>'ｄｅｃｌａｒｅ',
        "<script"=>'＜ｓｃｒｉｐｔ＞',
        "<iframe"=>'＜ｉｆｒａｍｅ＞',
        "user"=>'ｕｓｅｒ',
        "host_name"=>'ｈｏｓｔ＿ｎａｍｅ',
        "system_user"=>'ｓｙｓｔｅｍ＿ｕｓｅｒ',
        "@@version"=>'＠＠ｖｅｒｓｉｏｎ',
        "quotename"=>'ｑｕｏｔｅｎａｍｅ',
        "db_name"=>'ｄｂ＿ｎａｍｅ',
        '='=>'＝'
    ];
    foreach($sqlCmd as $cmd => $bigCmd){
        $str = preg_replace('/'.$cmd.'/i',$bigCmd,$str);
    }
    return $str;
}