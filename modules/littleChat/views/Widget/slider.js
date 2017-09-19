
var parse = function ($slider,config) {
  var $lis, $ul, $ctrl, ctrlOnClass = 'on',
    s_width = config.width || $slider.offsetWidth,
    gap = config.gap || 0,
    slideWidth = s_width + gap,
    ctrlOnSlide, ctrlOnSlideDone,
    status = {
      defalut: 0,
      page: 0,
      offsetStart: 0,
      offsetSlide: 0,
      initLock: false,
      rafLock: false,
      liScrocllLocker: false
    },
    onEnter = {},
    onLeave = {};
  //init

  Array.prototype.forEach.call($slider.children, function ($element) {
    if ($element.nodeName == 'UL') {
      $ul = $element;
      $lis = $ul.children;
      return;
    }
  });
  $slider.getLen = function () { return $lis.length; };
  $slider.getStatus = function () { return status };//想一下这真的有用么...传递的还是引用...
  $slider.status = status;
  $slider.goTo = function (page) {
    if (page != status.page && page < $lis.length) {
      var fromPage = status.page;

      status.page = page;
      status.offsetStart = status.page * slideWidth;
      $ul.addEventListener('transitionend', transitionendProcessor);

      requestAnimationFrame(function () {
        $ul.classList.remove('noneAnimation');
        requestAnimationFrame(function () {
          $ul.querySelector('.showing').classList.remove('showing');
          $lis[status.page].classList.add('showing');
          $ul.style['transform'] = 'translate3d(' + -status.offsetStart + 'px,0,0)';

          ctrlOnSlideDone(
            $ctrl.children[fromPage],
            $ctrl.children[status.page],
            fromPage,
            status.page
          );
          if (onEnter[page])
            onLeave[page]();
          if (onLeave[fromPage])
            onLeave[fromPage]();
        });
      });
    }
  };
  $slider.onPageEnter = function (page, func) {
    onEnter[page] = func;
  };
  $slider.onPageLeave = function (page, func) {
    onLeave[page] = func;
  };
  $slider.onEveryPageEnter = null;
  $slider.onEveryPageLeave = null;
  $slider.setDefault = function (page) {
    var fromPage = status.page,
      $showing = $ul.querySelector('.showing');

    status.defalut = page;
    if (page < $lis.length) {
      status.page = page;
      status.offsetStart = status.page * slideWidth;
      
      requestAnimationFrame(function(){
        $ul.classList.add('noneAnimation');
        $ul.style['transform'] = 'translate3d(' + -status.offsetStart + 'px,0,0)';
        $showing && $showing.classList.remove('showing');
        $lis[status.page].classList.add('showing');
        setCtrl();
      });
    }
  }
  $slider.reset = function () {
    $slider.goTo(status.defalut);
  };
  $slider.generateCtrl = function ($ctrlContainer, $tpl, config) {
    var $dom;
    config = config || {};
    if (!$ctrlContainer || !$tpl) {
      F.error(0, '需要传入$ctrlContainer和$tpl(目前仅支持stringDom,需要手动实现完整的节点clone方法,显然没有stringDom方便)~~');
      return;
    }

    for (i = 0; i < $lis.length; i++) {
      $dom = ($tpl instanceof Array) ? strToDom($tpl[i]) : strToDom($tpl);
      $dom.onclick = function (i) {
        $slider.goTo(i);
      }.bind($dom, i);
      $ctrlContainer.appendChild($dom);
    }
    //然后初始化
    $ctrl = $ctrlContainer;
    $ctrl.children[status.page].classList.add(ctrlOnClass);
    ctrlOnSlide = config.onSlide || function () { };
    ctrlOnSlideDone = config.onSlideDone || function () { };
    if (typeof config.turnOnClass == 'string')
      ctrlOnClass = turnOnClass;
  }

  //初始化样式
  requestAnimationFrame(function () {
    $slider.classList.add('noneAnimation');
    $ul.classList.add('noneAnimation','subNoneAnimation');
    $slider.style['opacity'] = 0;
    $lis[status.page].classList.add('showing');
    requestAnimationFrame(function () {
      $ul.style['width'] = ($lis.length * slideWidth) + 'px';
      $slider.querySelectorAll('li').forEach(function ($li) {
        $li.style['width'] = s_width + 'px';
        $li.style['margin-right'] = gap + 'px';
      });
      $slider.style['opacity'] = 1;
      
      if(config.loop){
        $slider.classList.add('loop','subNoneAnimation');
        Array.prototype.forEach.call($lis,function($li,i){
          $li.currentPosition = i * slideWidth ;
          $li.index = i;
          $li.style.transform = 'translate3d(' + $li.currentPosition + 'px,0,0)';
        });
        requestAnimationFrame(function(){
          $slider.classList.remove('subNoneAnimation');
        });
      }
      requestAnimationFrame(function(){
        $ul.classList.remove('subNoneAnimation');
      });
    });
  });

  var setCtrl = function () {
    requestAnimationFrame(function () {
      if ($ctrl) {
        $ctrl.querySelector('.' + ctrlOnClass).classList.remove(ctrlOnClass);
        $ctrl.children[status.page].classList.add(ctrlOnClass);
      }
    });
  };

  //set trigger event
  $slider.onSlide = function (info) {
    if (info.directionLock == 'horizontal') {
      var offset = status.offsetStart - info.offset,
        next = (info.offset > 0) ? status.page - 1 : status.page + 1,
        from = status.page,
        percentage = Math.abs(info.offset / s_width),
        needPass = false;

      //修正
      if(next < 0) next = $lis.length - 1;
      if (next > $lis.length - 1) next = 0;

      if (status.page < 0 || status.page > $lis.length - 1)
        return;

      //修正
      if (offset < 0) {
        offset = 0;
        needPass = true;
      } else if (offset > ($lis.length - 1) * slideWidth) {
        offset = ($lis.length - 1) * slideWidth;
        needPass = true;
      }
      status.offsetSlide = offset;

      if (!status.rafLock) {
        status.rafLock = true;
        requestAnimationFrame(function () {
          if (!status.initLock) {
            status.initLock = true;
    
            if(config.loop)
              $ul.classList.add('subNoneAnimation');
            else
              $ul.classList.add('noneAnimation');

            if ($slider.onEveryPageLeave instanceof Function)
              $slider.onEveryPageLeave(status.page);
            
            if (onLeave[status.page])
              onLeave[status.page]();
          }
          if(!config.loop){
            $ul.style.transform = 'translate3d(' + -status.offsetSlide + 'px,0,0)';
            // $ul.style.transform = 'translateX(' + -status.offsetSlide + 'px) translateY(0) translateZ(0)';
          }
          else{
            Array.prototype.forEach.call($lis,function($li){
              $li.style.transform = 'translate3d(' + ($li.currentPosition + info.offset) + 'px,0,0)';
            });
          }

          status.rafLock = false;
          if ((!needPass || config.loop) && $ctrl){
            ctrlOnSlide(
              $ctrl.children[from],
              $ctrl.children[next],
              percentage,
              from,
              next
            );
          }
        });
      }
      if (needPass && !config.loop){
        if($slider.handleOverflow instanceof Function)
          return $slider.handleOverflow(info);
        else
          return 'pass';
      }
    } else
      return 'pass';
  };

  var transitionendProcessor = function () {
    if ($slider.onEveryPageEnter instanceof Function)
      $slider.onEveryPageEnter(status.page);

    if (onEnter[status.page])
      onEnter[status.page]();

    requestAnimationFrame(function () {
      status.liScrocllLocker = false;
      
      if (status.page > $lis.length - 1)
        $lis[0].style['overflow-y'] = 'auto';
      else if (status.page < 0)
        $lis[$lis.length - 1].style['overflow-y'] = 'auto';
      else
        $lis[status.page].style['overflow-y'] = 'auto';

      // setCtrl();
    });

    $ul.removeEventListener('transitionend', transitionendProcessor);
  };

  $slider.onSlideDone = function (info) {
    if (info.directionLock == 'horizontal') {
      //检查将会触发的page
      var needToPass = false,
        max_offset = ($lis.length - 1) * slideWidth,
        i_from = status.page,
        i_to = i_from,
        $showing = $ul.querySelector('.showing');

      if (Math.abs(info.offset) / s_width > 0.15 &&
        status.offsetSlide <= max_offset &&
        status.offsetSlide >= 0
      ) {//跳转
        if (info.offset > 0) {
          if (status.page != 0 || config.loop)
            status.page--;
          else
            needToPass = true;
        } else
          if (status.page < $lis.length - 1 || config.loop)
            status.page++;
          else
            needToPass = true;
      } else
        needToPass = true;

      i_to = (info.offset > 0) ? i_from - 1 : i_from + 1;

      if(config.loop){
        if(i_to < 0)
          i_to =  $lis.length-1;
        else if (i_to > $lis.length - 1)
          i_to = 0;
      }else
        if (i_to < 0 || i_to > $lis.length - 1)
          i_to = i_from;

      $ul.addEventListener('transitionend', transitionendProcessor);

      status.offsetStart = status.page * slideWidth;
      requestAnimationFrame(function () {
        $showing && $showing.classList.remove('showing');

        if (status.page > $lis.length-1)
          $lis[0].classList.add('showing');
        else if(status.page < 0)
          $lis[$lis.length - 1].classList.add('showing');
        else
          $lis[status.page].classList.add('showing');

        if(!config.loop){
          $ul.classList.remove('noneAnimation');
          $ul.style['transform'] = 'translate3d(' + -status.offsetStart + 'px,0,0)';
        }else{
          var _loop = function(reset){
            if (!reset)
              $ul.classList.remove('subNoneAnimation');

            Array.prototype.forEach.call($lis, function ($li,i) {
              $li.classList.add('noneAnimation');
              $li.currentPosition = ($li.index - status.page) * slideWidth;
              $li.style.transform = 'translate3d(' + $li.currentPosition + 'px,0,0)';

              if(i == i_to || i == i_from)
                $li.classList.remove('noneAnimation');
              
            });

            //如果是确认到达边缘修把另一头挪过来
            if (status.page == 0) {
              $lis[$lis.length - 1].classList.add('noneAnimation');
              $lis[$lis.length - 1].currentPosition = (-1 - status.page) * slideWidth;
              $lis[$lis.length - 1].style.transform = 'translate3d(' + $lis[$lis.length - 1].currentPosition + 'px,0,0)';
              requestAnimationFrame(function(){
                $lis[$lis.length - 1].classList.remove('noneAnimation');
              });
            } else if (status.page == $lis.length - 1) {
              $lis[0].classList.add('noneAnimation');
              $lis[0].currentPosition = ($lis.length - status.page) * slideWidth;
              $lis[0].style.transform = 'translate3d(' + $lis[0].currentPosition + 'px,0,0)';
              requestAnimationFrame(function () {
                $lis[0].classList.remove('noneAnimation');
              });
            }

            //溢出重置处理
            var animationEnd = function () {
              var info = arguments[0];
              requestAnimationFrame(function () {
                $ul.classList.add('subNoneAnimation');

                if (status.page > $lis.length - 1) {
                  status.page = 0;
                  $lis[0].addEventListener('transitionend', animationEnd);
                } else if (status.page < 0) {
                  status.page = $lis.length - 1;
                  $lis[$lis.length - 1].addEventListener('transitionend', animationEnd);
                }

                Array.prototype.forEach.call($lis, function ($li) {
                  $li.currentPosition = ($li.index - status.page) * slideWidth;
                  $li.style.transform = 'translate3d(' + $li.currentPosition + 'px,0,0)';
                });

                _loop(true);

                requestAnimationFrame(function () {
                  $ul.classList.remove('subNoneAnimation');
                });
              });
            };
            if (status.page > $lis.length - 1) {
              $lis[0].addEventListener('transitionend', animationEnd.bind(null, info));
              //需要维持位置一会儿
              $lis[0].classList.remove('noneAnimation');
              $lis[0].currentPosition = ($lis.length - status.page) * slideWidth;
              $lis[0].style.transform = 'translate3d(' + $lis[0].currentPosition + 'px,0,0)';

            } else if (status.page < 0) {
              $lis[$lis.length - 1].classList.remove('noneAnimation');
              $lis[$lis.length - 1].addEventListener('transitionend', animationEnd.bind(null, info));
              $lis[$lis.length - 1].currentPosition = (-1 - status.page) * slideWidth;
              $lis[$lis.length - 1].style.transform = 'translate3d(' + $lis[$lis.length - 1].currentPosition + 'px,0,0)';
            }
          }

          _loop();
        }

        //重置locker
        status.rafLock = false;
        status.initLock = false;

        if(i_from == i_to)
          transitionendProcessor();

        if ($ctrl){
          i_from = (i_from > $lis.length - 1) ? $lis.length - 1: i_from;
          i_from = (i_from < 0) ? 0 : i_from;

          if (i_from == status.page) {
            if (i_from != i_to){
              ctrlOnSlideDone(
                $ctrl.children[i_to],
                $ctrl.children[i_from],
                i_to,
                i_from
              );
            }
          } else{
            ctrlOnSlideDone(
              $ctrl.children[i_from],
              $ctrl.children[status.page],
              i_from,
              status.page
            );
          }
        }
      });

      setCtrl();
      if (needToPass && !config.loop)
        return 'pass';
    } else
      return 'pass';
  };

  Array.prototype.forEach.call($lis, function ($li) {
    $li.onSlide = function (info) {
      if (info.directionLock == 'horizontal') {
        //不允许滚动
        if (!status.liScrocllLocker) {
          requestAnimationFrame(function () {
            status.liScrocllLocker = true;
            $li.style['overflow-y'] = 'hidden';
          });
        }
      }
      return 'pass';
    };
  });
};

exports.init = function(){
  document.querySelectorAll('.page .slider').forEach(parse,this);
}

exports.parse = parse;