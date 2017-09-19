
function factory(config){
  var $ul = config.listConatiner,
    $lisInital, $lisNeedToShow ,$liLastOne
    delay = config.delayToShow,//ms
    initalClass = config.initalClass,
    startIndex = config.startIndex,
    displayIndex = config.startIndex,
    noMore = false,
    showDone = false,
    status = 'done',
    orginalLoadFunc = config.loadArgs.func;
  
  this.init = function(){
    loadMore();
  };

  if(displayIndex === undefined)
    displayIndex = -1;
  else
    displayIndex--;

  //添加钩子咯~
  config.loadArgs.func = function(rep){
    var result = orginalLoadFunc(rep);
    
    if(result.status == 0){
      requestAnimationFrame(function(){
        //append
        result.dom.forEach(function($li){
          $ul.appendChild($li);
        });
        
        requestAnimationFrame(function(){
          //show
          status = 'done';
          if(displayIndex == startIndex)
            scroll();
        });
      });
    }else if(result.status == 1){
      noMore = true;
      
      if($ul.nextSibling){
        result.dom.forEach(function($dom){
          $ul.parentElement.insertBefore($dom, $ul.nextSibling);
        });
      }else{
        result.dom.forEach(function($dom){
          $ul.parentElement.appendChild($dom);
        });
      }
    }
  };

  function scroll(){
    if(showDone) return ;

    //querySelectot不可以在语义上是所有子元素,包括孙元素
    //性能更好的方式是在内部维护这个lisInital列表,而不是每次都去获取
    $lisInital = [];
    $lisNeedToShow = [];
    $liLastOne = $ul.children[$ul.children.length - 1];

    Array.prototype.forEach.call($ul.children, function($child){
      if($child.classList.contains(initalClass))
        $lisInital.push($child);
    });

    //检查是否需要把已经加载的显示出来就是了
    //生成需要显示的列表
    $lisInital.forEach(function($li){
      if(isOnShow($li))
        $lisNeedToShow.push($li);
    });
    showLis($lisNeedToShow);

    //检查是否需要加载更多
    if(isOnShow($liLastOne) && status == 'done' && !noMore)
      loadMore();
    else if(noMore)
      showDone = true;
  }

  window.addEventListener('scroll',scroll);

  function showLis($lis){
    Array.prototype.forEach.call($lis,function($li,index){
      $li.addEventListener('transitionend',function(){
        
        $li.style['will-change'] = null;
        $li.removeEventListener('transitionend',arguments.callee);
      });

      $li.style['transition-delay'] = '0ms';
      $li.style['will-change'] = 'transform, opacity';

      animate(
        $li,
        [
          // ['scale3d',0.9],
          // ['translateY',30,'%'],
          ['opacity', 0]
        ],
        [
          // ['scale3d',1],
          // ['translateY',0,'%'],
          ['opacity', 1]
        ],
        delay*index,
        function(){
          console.log('hi~');
        }
      );
    });
  }

  function loadMore(){
    var backupData = config.loadArgs.data;
    status = 'loading';

    backupData[config.pageKey] = ++displayIndex;
    config.loadArgs.data = JSON.stringify(backupData);

    Ajax(config.loadArgs);
    //还原
    config.loadArgs.data = backupData;
  }

  function getOffsetFormBody($li){
    if($li.offsetFromBody === undefined)
      $li.offsetFromBody = getRecursivelySumFrom($li, document.body, 'offsetTop');
    return $li.offsetFromBody;
  }

  function isOnShow($li){
    return getOffsetFormBody($li) - window.scrollY < window.innerHeight
  }
};

//依赖的小工具

//获取从startNode到endNode的属性的sum
function getRecursivelySumFrom($startNode,$endNode,type){
  var sum = 0;

  while($startNode != $endNode && $startNode != document){
    sum += $startNode[type];
    $startNode = $startNode.parentElement;
  }

  return sum;
}

exports.getInstance = function(config){
  return new factory(config);
}

/*  des:tween算法。
    t: 动画已经执行的时间（实际上时执行多少次/帧数）
    b: 起始位置
    c: 终止位置
    d: 从起始位置到终止位置的经过时间（实际上时执行多少次/帧数） */

var easeOut = function (t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
}

var animate = function ($element, fromPorpertys, toPorpertys, delay, doneFunc) {

  var start = 0,
      during = 20,//234ms
      transformValue;

  var reslove = function () {//对齐都最终的位置
    toPorpertys.forEach(function (porperty) {
      porperty[2] = porperty[2] || '';
      $element.style[porperty[0]] = porperty[1] + porperty[2];
    });
  }

  var handelTransform = function(porperty, i){
    
  }

  var isTransform = function(porpertyName){
    var transformProperty = [
      'scale3d',
      'translateY',//用到再加吧~
    ];

    return transformProperty.includes(porpertyName);
  };

  var formatTransformValues = function(values){
    // 含有3d的就是复制三份就是了
    var output = [];
    values.forEach(function(value){
      if(value[0].indexOf('3d') !== -1 ){
        
        output.push(value[0]+
          '('+
            value[1]+value[2]+','+
            value[1]+value[2]+','+
            value[1]+value[2]+
          ')'
        );
      }else{
        output.push(value[0]+'('+value[1]+value[2]+')');
      }
    });

    return output.join(' ');
  };

  var _run = function () {
    if (status.animateLock) return;

    start++;

    transformValue = [];
    fromPorpertys.forEach(function (porperty, i) {
      var changeValue = toPorpertys[i][1] - porperty[1];//这一行可以初始化执行一次就可以的了
      var next = easeOut(start, porperty[1], changeValue, during);
      
      porperty[2] = porperty[2] || '';

      if(isTransform(porperty[0]))
        transformValue.push([porperty[0], next, porperty[2]]);
      else
        $element.style[porperty[0]] = next + porperty[2];
      
    });
    //transform的在这里处理咯

    $element.style.transform = formatTransformValues(transformValue);

    if (start < during)
      requestAnimationFrame(_run);
    else {
      requestAnimationFrame(reslove);
      doneFunc();
    }
  }

  if(delay)
    setTimeout(_run,delay);
  else
    _run();
};