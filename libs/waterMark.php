<?php

class waterMark extends Component {
  private $_img = null;
  private $_imgUri = null;
  private $_imgStr = null;
  private $_imgType = null;
  private $_imgWidth = null;
  private $_imgHeight = null;
  //只能加一种水印,如果设置了两种,优先加载图片,感觉图片比较高级嘛~~
  private $_config = array(
    'position'=>array(
      'X' => -20,
      'Y' => -20,
      'mode' => 'fromEgde'
    ),
    'rorate'=>0,
    'opacity'=>1
  );

  public static function globalConfig($config){
    
  }

  public function __destruct(){
    if($this->_img)
      imagedestroy($this->_img);
    if(isset($this->_config['img']) && is_resource($this->_config['img']['waterMark']))
      imagedestroy($this->_config['img']['waterMark']);
  }
  // workflow:
  // 1. 加载图片数据,要提供不同的loader
  // 2. 设定水印参数
  //   2.1 文字
  //     2.1.1 字体大小
  //     2.1.2 字体颜色
  //     2.1.3 字体
  //     2.1.4 内容
  //   2.2 图片
  //     2.2.1 水印图片来源
  //     2.2.2 水印图片大小
  //   2.3 位置
  //     2.3.1 X(像素/百分恩比)
  //     2.3.2 Y
  //     2.3.3 模式
  //       2.3.3.1 距离两边的模式,比如水印上左两边距离图片上左两边的距离(fromeEgde)
  //       2.3.3.2 中心对称模式(center)
  //   2.4 旋转
  //   2.5 透明度
  // 3. 保存图片
  //   3.1 覆盖保存
  //   3.2 另存为
  //   3.3 hook适配方式,是采用callback一个匿名function来组合调用的
  public function loadFromUri($uri){
    if($this->_img && is_resource($this->_img))
      imagedestroy($this->_img);

    $info = getimagesize($uri);
    $type = image_type_to_extension($info[2], false);
    $func = "imagecreatefrom".$type;
    $this->_imgType = $type;
    $this->_imgWidth = $info[0];
    $this->_imgHeight = $info[1];
    $this->_imgUri = $uri;
    $this->_img = $func($uri);
    return $this;
  }
  public function loadFromStr(&$str){
    if($this->_img && is_resource($this->_img))
      imagedestroy($this->_img);

    $info = getimagesizefromstring($str);
    $this->_imgType = image_type_to_extension($info[2], false);
    $this->_imgWidth = $info[0];
    $this->_imgHeight = $info[1];
    $this->_imgStr = &$str;
    $this->_img = imagecreatefromstring($str);
    return $this;
  }
  public function addText($content,array $color,$font,$size){
    $config = &$this->_config['text'];
    $config['size'] = $size;
    $config['font'] = Router::font($font);
    $config['content'] = $content;
    $config['color'] = $color;
    return $this;
  }
  public function addImg($src,$width=null,$height=null){//如果不设置宽高就是用图片原本的
    $config = &$this->_config['img'];
    $config['info'] = getimagesize($src);
    $config['type'] = image_type_to_extension($info[2], false);
    $config['width'] = ($width)? $width: $config['type'][0];
    $config['height'] = ($height)? $height: $config['type'][1];
    $config['src'] = $src;

    if(isset($config['waterMark']) && is_resource($config['waterMark']))
      imagedestroy($config['waterMark']);//避免重复加载图片资源导致的内存泄漏

    $func = "imagecreatefrom".$config['type'];
    $config['waterMark'] =  $func($src);

    if($config['width'] != $width && $config['height'] != $height){
      $resized = imagecreatetruecolor($config['width'], $config['height']);

      imagecopyresampled(
        $resized, $config['waterMark'],
        0, 0, 0, 0, 
        $config['width'], $config['height'],
        $config['info'][0], $config['info'][1]
      );

      imagedestroy($config['waterMark']);
      $config['waterMark'] = $resized;
    }

    return $this;
  }

  public function position($X, $Y, $mode='fromEdge'){//默认是右下角的相离底边20px
    $config = &$this->_config['position'];
    $config['X'] = $X;
    $config['Y'] = $Y;
    $config['mode'] = $mode;
    return $this;
  }

  public function rorate($degree){
    $this->_config['rotate'] = $degree;
    return $this;
  }
  public function opacity($float){//还是使用和CSS一样的单位
    $this->_config['opacity'] = $float;
    return $this;
  }

  public function run(){
    if(!is_resource($this->_img))
      F::end(2,'请加载需要加水印的图片,通过loadFromUri()或者loadFromStr()~~');
    
    $config = &$this->_config;

    //定位处理
    $x = $config['position']['X'];
    $y = $config['position']['Y'];
    //百分比的处理
    if(is_string($x) && $x[count($x)] == '%'){
      $x = (float)substr($x,0,count($x)-2);
      $x *= $_imgWidth;
    }
    if(is_string($y) && $y[count($y)] == '%'){
      $y = (float)substr($y,0,count($y)-2);
      $y *= $_imgHeight;
    }
    if($config['position']['mode'] == 'fromeEgde'){
      if($x >= 0)
        $x_baseLeftTop = $x;
      else
        $x_baseLeftTop = $_imgWidth - $textWidth - $x;

      if($y >= 0)
        $y_baseLeftTop = $y;
      else
        $y_baseLeftTop = $_imgHeight - $textHeight - $y;
    }elseif($config['position']['mode'] == 'center'){
      $x_baseLeftTop = $x - $textWidth;
      $y_baseLeftTop = $y - $textHeight;
    }

    if(isset($config['img'])){
      $waterMark = $config['img']['waterMark'];
      //处理旋转
      $waterMark = imagerotate($config['img']['waterMark'], -$config['rorate'], 0);

      //处理透明度
      $opacity = floor($config['img']['opacity'] * 100);

      imagecopymerge(
        $this->_img,
        $waterMark,
        $x_baseLeftTop,
        $y_baseLeftTop,
        0, 0, $opacity
      );

      imagedestroy($waterMark);

    }elseif(isset($config['text'])){
      $textBox = imagettfbbox(
                    $config['text']['size'],
                    0,//angle还不知道怎样填
                    $config['text']['font'],
                    $config['text']['content']);
      $textWidth = abs($textBox[2] - $textBox[0]);
      $textHeight = abs($textBox[7] - $textBox[1]);

      //颜色和透明度处理
      $opacity = floor($config['opacity'] * 127);

      $color = imagecolorallocatealpha(
        $this->_img, 
        $config['text']['color'][0],//r
        $config['text']['color'][1],//g
        $config['text']['color'][2],//b
        $opacity );

      //处理旋转,修正一下位置,因为是以左下角为旋转的点的

      //角度(弧度单位)
      $_B = $config['rorate'] * pi() / 180;
      $_O = atan($_y/$_x);

      //边(像素单位)
      $_x = $textHeight/2;//突然有种想插入图片解释的念头~~~
      $_y = $textWidth/2;
      $_r = sqrt(pow($_x,2)+pow($_y,2));
      $_d = 2 * ($_r * sin($_B/2));

      $_e = cos(pi() - $_O - $_B/2 ) * $_d; 
      $_f = sin(pi() - $_O - $_B/2 ) * $_d; 
      
      $x_baseLeftTop += $f;
      $y_baseLeftTop += $e;

      //写入文字
      imagettftext(
        $this->_img, $config['text']['size'], 
        -$config['rorate'], $x_baseLeftTop, $y_baseLeftTop, 
        $color, $config['text']['font'], $config['text']['content']);


      $waterMark = $config['text'];
    }else
      F::end(2,'请设置水印,text或者img~~~');
    
    ob_start();
    $func = 'image'.$_imgType;
    $func();
    $this->_imgStr = ob_get_clean();//都会挂接在这个变量上面的咯

    if($this->_imgUri){//Uri传进来的时候
      file_put_contents($this->_imgUri,$this->_imgStr);
    }

    return $this->_imgStr;
  }
}