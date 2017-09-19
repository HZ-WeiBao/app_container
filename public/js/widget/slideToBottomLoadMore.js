
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
    setTimeout(loadMore,17);
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
    console.log('接受到scroll事件了');
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
    checkImgLoad($lisNeedToShow);

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
        $li.style['transition-delay'] = null;
        $li.style['will-change'] = null;
        $li.removeEventListener('transitionend',arguments.callee);
      });

      $li.style['transition-delay'] = delay*index + 'ms';
      $li.style['will-change'] = 'transform, opacity';
      $li.classList.remove(initalClass);
    });
  }

  function checkImgLoad($lis){
    var loadDone = true;
    var imgloader = new MultiAsyncLoader;

    Array.prototype.forEach.call($lis,function($li,index){
      //检查图片加载情况

      var $imgs = $li.querySelectorAll('img');
      Array.prototype.forEach.call($imgs,function($img){
        if(!$img.complete){
          loadDone = false;
          $img.onload = imgloader.loadPointAdd(function(){
            $img.onload = function(){};
          });
        }
      })
    });

    if(loadDone)
      showLis($lis);
    else{
      imgloader.setAllLoadedFunc(function(){
        requestAnimationFrame(function(){
          showLis($lis);
        });
      });
    }
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
    if($li instanceof HTMLElement && $li.offsetFromBody === undefined)
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