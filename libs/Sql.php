<?php

class Sql extends Component {
  public static $dblink = null;
  public static $user = '';
  public static $pwd = '';
  public static $dsn = '';

  protected $_ranges = array('*');
  protected $_where = null;
  protected $_where_value = null;
  protected $_limit = null;
  protected $_groupBy = null;
  protected $_orderpBy = null;
  protected $_distinct = null;
  protected $_resultOrder = null;
  protected $_table = null;
  protected $_lastStatment = null;

  //等一下,应该默认是默认全部返回数组,只是读取的时候默认是操作这个数组的第一个数据?
  //如果这样就是说,不能够批量修改东西咯
  //还是先规定一下用法吧

  //像这些,还有必要转存一下吗,可能一些操作比如断开数据库连接,需要重连的时候就会需要这些信息
  public static function globalConfig($config){
    foreach($config as $key => $value){
      self::$$key = $value;
    }
    //想这些其实基本上都是必须使用到的,没必要在来弄一个按需加载
    self::connect();
  }
  public static function connect(){
    self::$dblink = new PDO(self::$dsn,self::$user,self::$pwd,array());
  }
  public function query($queryStr, $params=array()){
    //感觉有点数据的不统一,把这个当作更加底层的接口就可以了
    //还是使用?作为参数替换符,其实这里因为没有涉及自动参数绑定,可以同时使用两种,哈哈~~
    $this->_lastStatment = self::$dblink->prepare($queryStr);
    $this->_lastStatment->execute($this->toValueArr($params));
    return $this->_lastStatment->fetchAll(PDO::FETCH_CLASS);
  }
  public function insert($params){
    $marks = array();
    $fields = array_keys($params);
    $table = $this->getTable();
    $this->checkFieldNames($fields);
    $this->checkFieldNames(array($table));

    foreach($params as $value){
      $marks[] = ' ? ';
    }
    $marks_str = implode($marks,',');
    $fields_str = implode($this->addFieldQuotes($fields),',');
    $values = array_values($params);

    $this->_lastStatment = self::$dblink->prepare(
        "INSERT INTO `{$table}` ({$fields_str}) VALUES ({$marks_str})"
      );
    $status = $this->_lastStatment->execute($this->toValueArr($values));

    
    return $status;
  }
  public function select(){
    $this->checkFieldNames($this->_ranges);
    $values = array();
    $fields_str = implode($this->addFieldQuotes($this->_ranges),',');
    $table = $this->getTable();
    $this->checkFieldNames(array($table));
    $where_mark_str = $this->getWhereStr($values);
    $distinct_str = ($this->_distinct)? 'DISTINCT': '';
    $orderBy_str =  ($this->_resultOrder && $this->_orderBy)?$this->_resultOrder: '';
    $groupBy_str = ($this->_resultOrder && $this->_groupBy)?$this->_resultOrder: '';
    $limit_str = ($this->_limit)? 'LIMIT '.$this->_limit:'';
    $groupBy_marks_str = '';
    $groupBy_marks = array();
    if(is_array($this->_groupBy)){
      $this->checkFieldNames($this->_groupBy);
      $groupBy_str = 'GROUP BY '.implode($this->addFieldQuotes($this->_groupBy),',').' '.$groupBy_str;
    }
    if(is_array($this->_orderBy)){
      $this->checkFieldNames($this->_orderBy);
      $orderBy_str = 'ORDER BY '.implode($this->addFieldQuotes($this->_orderBy),',').' '.$orderBy_str;
    }

    $this->_lastStatment = self::$dblink->prepare(
      "SELECT {$distinct_str} {$fields_str} FROM `{$table}` WHERE {$where_mark_str} {$groupBy_marks_str} {$groupBy_str} {$orderBy_str} {$limit_str}"
    );

    $status = $this->_lastStatment->execute($this->toValueArr($values));//execute的时候进行绑定
    $this->_rows = $this->_lastStatment->fetchAll(PDO::FETCH_CLASS);
    return $status;
  }
  public function update(array $params){
    $marks = array();
    $values = array();
    $fields = array_keys($params);
    
    $table = $this->getTable();

    $this->checkFieldNames($fields);
    $this->checkFieldNames(array($table));

    $i = 0;
    foreach($params as $key=>$value){
      $marks[] = '`'.$fields[$i].'` = ? ';
      $values[] = $value;
      $i++;
    }

    $marks_str = implode($marks,',');
    $where_str = $this->getWhereStr($values);

    $this->_lastStatment = self::$dblink->prepare(
      "UPDATE `{$table}` SET {$marks_str} WHERE {$where_str}"
    );
    // var_dump("UPDATE `{$table}` SET {$marks_str} WHERE {$where_str}");
    $status = $this->_lastStatment->execute($this->toValueArr($values));//execute的时候进行绑定

    
    return $status;
  }
  public function del(){
    $table = $this->getTable();
    $values = array();
    $where_str = $this->getWhereStr($values);

    $this->_lastStatment = self::$dblink->prepare(
      "DELETE FROM `{$table}` WHERE {$where_str}"
    );
    $status = $this->_lastStatment->execute($this->toValueArr($values));//execute的时候进行绑定

    return $status;
  }
  public function save(){// \所以这里看出save的作用,把对象储存环境的数据转换为更容易字符串操作的array
    $edited_row = array();
    foreach((array)$this as $key=>$value){
      if(strpos($key,'_') === false && !is_numeric($key))
        $edited_row[$key] = $value;
    }
    if($this->_where != null){
      if(!$this->update($edited_row))// | $this->_lastStatment->rowCount() == 0
        $this->error();
    }else{
      if(!$this->insert($edited_row))// | $this->_lastStatment->rowCount() == 0
        $this->error();
    }
    return $this;
  }
  public function setRange(array $ranges=array()){
    $this->_ranges = $ranges;
  }
  //规定是要用的绑定符号是'?'这个
  public function getWhereStr(&$value){
    if(is_string($this->_where)){
      $value = array_merge($value,$this->_where_value);//str的缺点就是如果数据多的时候你比较难改那个位置,要一个一个数
      return $this->_where;
    }elseif(is_array($this->_where)){
      //这个之后再去考虑是否使用吧
    }
  }
  public function findOne(string $where, array $where_value){//像这些就是默认限定为返回数据唯一的
    //接口学习一下Yii的,这里是不需要填写tableName的,这部分交给了model的className所绑定,但是是否需要这个呢
    //之后再去拓展where的表示方式吧
    $this->_limit = 1;
    $this->_where = $where;
    if($where_value != null && is_string($where))
      $this->_where_value = $where_value;
    return $this;
  }

  public function findAll(string $where='1',array $where_value=array()){
    $this->_where = $where;
    $this->_limit = null;
    $this->_where_value = $where_value;
    $this->_return_array = true;
    $this->_fetch();
    return $this->_rows;
  }
  public function limit(int $num){
    $this->_limit = $num;
    return $this;
  }
  public function useTable(string $tableName){//不过现在只是单张表的model,暂时是不涉及多表的处理
    $this->_table = $tableName;
    return $this;
  }
  public function groupBy(array $columns){
    $this->_groupBy = $columns;
    return $this;
  }
  public function orderBy(array $columns){
    $this->_orderBy = $columns;
    return $this;
  }
  public function distinct(){
    $this->_distinct = true;
    return $this;
  }
  public function DESC(){
    $this->_resultOrder = 'DESC';
    return $this;
  }
  public function ASC(){
    $this->_resultOrder = 'ASC';
    return $this;
  }
  public function __set($variable, $value){
    $this->{$variable} = $value;
  }
  public function get__($variable){
    //当出现未知的Get的时候,如果$_row如果没有数据的时候,说明这个时候需要从数据库那数据
    $this->_fetch();
    if(isset($this->_rows[0]) && isset($this->_rows[0]->{$variable})){
      return $this->_rows[0]->{$variable};
    }else{
      F::end(4,"没有找到字段{$variable}~");//没有了出错行数了,感觉这是一种失败
    }
  }
  public function _fetch(){
    if( !isset($this->_rows) ){
      //执行一次query然后查看query之后的结果集是否含有该字段,如果没有返回null
      if($this->_where != null){
        if($this->select())
          foreach($this->_rows as $key=>$value){
              $this->{$key} = $value;
          }
        else
          $this->error();
      }else{
        F::end(4,'需要指定where,全选的话请使用findAll~');
      }
    }
  }
  public function getTable(){
    if(get_class($this) == __CLASS__ && !isset($this->_table))//其实这个属性会挂接在子类的实例当中去的
      F::end(4,'单独时使用的时候请,指定表名~');
    $table = ($this->_table != null)? $this->_table: 
                  str_replace('Model','',get_class($this));
    return $table;
  }

  public function getType(&$variable){
    switch($variable){
      case is_bool($variable):return 'bool';
      case is_float($variable):return 'float';
      case is_numeric($variable):return 'number';
      case is_string($variable):return 'string';
    }
  }
  public function toValueArr($array){
    //给参数绑定用的,这样就可以即便你是含有变量的也是可以的咯,哈哈
    //其实这里一定程度是反应了PHP的运作机制了
    //[$array] 与 ["$array"]的区别?
    // var_dump($array);
    foreach($array as $key=>$value){
      $array[$key] = "$value";
    }
    return $array;
  }
  public function addFieldQuotes($array){
    //给参数绑定用的,这样就可以即便你是含有变量的也是可以的咯,哈哈
    //其实这里一定程度是反应了PHP的运作机制了
    //[$array] 与 ["$array"]的区别?
    // var_dump($array);
    foreach($array as $key=>$value){
      $array[$key] = "`$value`";
    }
    return $array;
  }
  public function checkFieldNames($names){
      foreach($names as $name){
        preg_match('/[\w_\*]+/i',$name,$match);

        if($name != $match[0])
          F::end(4,"列名({$name}=>{$match[0]})不符合规范~");
      }
  }
  public function error(){
    $errorMessage = str_replace(
      'You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near ',
      'SQL语法错误,在: ',
      $this->_lastStatment->errorInfo()[2]);
    $errorMessage .= '<br>发送的Sql语句为: '.$this->_lastStatment->queryString;
    // $this->_lastStatment->debugDumpParams();

    F::end(4,$errorMessage);
  }
}