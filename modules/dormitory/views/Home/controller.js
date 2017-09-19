exports.deps = {
  'js': [
    {name:'Emmet', url:'littleChat/views/Tools/Emmet.js'},
    {name:'loadMore', url:'js/widget/slideToBottomLoadMore.js'},
    {name:'slider', url: 'littleChat/views/Widget/slider.js'}
  ],
  css:[
    'littleChat/views/Widget/inputBar.css',
    'littleChat/views/Widget/slider.css',
    'littleChat/views/Widget/zoomPhoto.css'
  ]
};

exports.actionIndex = function() {
  var $imageUploadInput = document.getElementById('imageUpload'),
    $showUploadImage = document.getElementById('showUploadImage'),
    $btnSubmit = document.getElementById('btnSubmit'),
    $openid = document.getElementById('openid'),
    $douyin = document.getElementById('douyin'),
    _this = this;
  
  //上传图片
  $imageUploadInput.addEventListener('change',function(){
    var reader = new FileReader(),
      files = this.files,
      size = files[0].size / 1024;

    if(files.length === 1 ){
      if(size > 3072){
        alert('图片不能超过3mb~');
        return;
      }
      
      reader.onloadend = function(){
        if (reader.error) console.log("读取文件错误:" + reader.error);
        
        $showUploadImage.setAttribute("src", reader.result);
        $showUploadImage.setAttribute("alt", size + "kb");
      };
      reader.readAsDataURL(files[0]);
    }
  });

  //提交信息
  $btnSubmit.addEventListener('click',function(){
    var $name = document.getElementById('name');
    var $phone = document.getElementById('phone');
    var $department = document.getElementById('department');
    var $dormnum = document.getElementById('dormnum');
    var $description = document.getElementById('description');
    var $douyin = document.getElementById('douyin');
    var imgUrl = $showUploadImage.getAttribute('src');
    //单次提交限制
    var status = $btnSubmit.getAttribute('status');
    
    if (status == 'ready'){
      if($douyin.value != '' || imgUrl != ''){
        $btnSubmit.setAttribute('status', 'uploading');
        Ajax({
          method:'post',
          url:'http://dorm.chaoshy.cn/action.php',
          data:JSON.stringify({
            "openid": $openid.value,  //必填
            "action": "upload",                  //必填
            "name": $name.value,                 //必填
            "phone": $phone.value,               //必填
            "department": $department.value,
            "dormnum": $dormnum.value, 
            "description": $description.value,
            "douyin":$douyin.value,
            "file": imgUrl
          }),
          func:function(rep){
            var json = JSON.parse(rep);
            if(checkAjaxMessage(json)){
              alert('提交成功~');
              $btnSubmit.setAttribute('status', 'done');
              location.hash = '#Home/Vote';
            }else
              $btnSubmit.setAttribute('status', 'ready');
          }
        });
      }else{
        alert('宿舍照和抖音随便创意一个, 两个都上传都是可以滴~');
      }
    } else if (status == 'uploading'){
      alert('正在提交~不用多次点击提交哦');
    } else if (status == 'done'){
      alert('已经提交成功了~');
    }
  });

  $douyin.ontouchstart = function(e){
    e.preventDefault();
    _this.Router.popUp('Guidance');
    $douyin.setAttribute('placeholder','把抖音链接粘贴到这里吧~');
    $douyin.setAttribute('ime-mode','auto');
    $douyin.ontouchstart = function(){};
  }
}

exports.actionVote = function () {
  var Emmet = this.controller.Emmet,
    loadMore = this.controller.loadMore,
    _this = this;
  
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });

  this.Page.eventBind = function(){
    var $cardList = document.querySelector('.page .card-list'),
      $openid = document.getElementById('openid');
    //Emmet的tpl不知道如何管理比较好啊
    var newCard = function(lis){
      //这里做一些数据格式化的工作
      lis.forEach(function(li){
        li.isShow = 'off';

        if(li.douyin != '' && li.imgUrl != null){
          li.isShow = 'on';
        }else if(li.imgUrl == null && li.douyin != ''){
          li.imgUrl = 'http://cache.chaoshy.cn/douyin_main.jpg';
          li.isShow = 'center';
        }
      });
      return Emmet.make(`
        (
          li.inital > (
            div.img-container > 
              img[src=$imgUrl link=$douyin onClick=>@linkFunc] +
              div{$description} + 
              div.$isShow.douyinLogo
          ) + (
            div.info-bar >
              div.department{$department} +
              div.name{$dormnum} +
              div.vote-number{$voteNum} +
              div.btnVote[playerId=>$id onclick=>@voteFunc]{投票}
          )
        ) * @lis
      `,{
        lis:lis,
        linkFunc:function(){
          var link = this.getAttribute('link');
          if(link != ''){
            window.location.href = link;
          }else{
            _this.Router.popUp('ZoomPhoto');
          }
        },
        voteFunc:function(){
          if(this.voting == undefined){
            
            Ajax({
              method: 'post',
              url: 'http://dorm.chaoshy.cn/action.php',
              data:JSON.stringify({
                openid: $openid.value,
                action: 'vote',
                id: this.playerId
              }),
              func: function (rep) { 
                var json = JSON.parse(rep);

                if(checkAjaxMessage(json)){
                  this.voting = false;
                  alert('投票成功');
                  //更新数字
                  var $vote_number = this.parentElement.querySelector('.vote-number');
                  $vote_number.innerText = parseInt($vote_number.innerText) + 1;
                }
              }.bind(this)
            });
          }else if(this.voting == true){
            alert('提交当中~');
          }else if(this.voting == false){
            alert('每人只有一票哦~');
          }
        }
      }).parse();
    };
    var newEmptyMessage = function(){
      return Emmet.make(`
        div.emptyMessage{~没有更多~}
      `).parse();
    };

    var slideDownToLoadMore = loadMore.getInstance({
      listConatiner: $cardList,
      delayToShow: 60,
      initalClass: 'inital',
      pageKey: 'page',
      startIndex: 1,
      loadArgs:{
        method:'post',
        url:'http://dorm.chaoshy.cn/action.php',
        data:{
          openid: $openid.value,
          action: 'show',
          page_size: 3,
        },
        func:function(rep){
          var json = JSON.parse(rep);

          if(checkAjaxMessage(json)){
            if(json.data.length != 0){
              return {
                status: 0,
                dom: newCard(json.data)
              };
            }else
              return {
                status: 1,
                dom: newEmptyMessage()
              };
          }
        }
      }
    });

    slideDownToLoadMore.init();
  
  };
}

//这次的消息处理方式
function checkAjaxMessage(data){
  var codeToMessage = {
    '-1': '需要从后台回复\'投票\',进入页面哦~',
    '-22': '你刚访问了一个不存在的地方~~'
  };

  if(data.status != 0){
    setTimeout(function(){
      alert(codeToMessage[data.status] || data.message);
    });
    return false;
  }

  return true;
}

exports.viewPopUpGuidance = function (config) {
  this.PopUp.config({
    position: 'center',
    inAnimation: 'in-zoom',
    outAnimation: 'out-zoom',
    initial: 'initial-zoom'
  });
  this.PopUp.eventBind = function () {

  };
  this.PopUp.switchToDom(`
    <div class="guidance" click="#back">
      <img src="http://cache.chaoshy.cn/guidance.jpg">
    </div>
  `);
};

exports.viewPopUpZoomPhoto = function (config) {
  var $photo = this.Event.triggerElement;
  var Emmet = this.controller.Emmet;

  this.PopUp.config({
    position: 'fromEdge',
    x: '0px',
    y: '0px',
    inAnimation: 'in-full-screen',
    outAnimation: 'in-fade',
    initial: 'in-fade'
  });
  
  if (!$photo){
    this.PopUp.switchToDom('<div></div>');
    setTimeout(function () { history.back(); }, 70);
    return;
  }

  var $messages = document.querySelector('.page'),
    $photos = $photo.parentElement.querySelectorAll('img'),
    offsetTop, offsetLeft, clientHeight, clientWidth, fromBodyTop, scaleRate,
    x, y, photosArr = [],
    screenHeight = screen.height,
    screenWidth = screen.width;

  if ($photo)
    $photo = $photo.querySelector('img');

  function getInfoOfPhoto($photo) {
    $photo.crownProportion = $photo.crownProportion || $photo.clientWidth / $photo.clientHeight;

    var offsetTop = $photo.offsetTop,
      offsetLeft = $photo.offsetLeft,
      clientWidth = $photo.clientWidth,
      finallyPositionFromTop = (screenHeight - screenWidth / $photo.crownProportion) / 2,
      fromBodyTop = offsetTop - $messages.scrollTop + 45 - finallyPositionFromTop;

    if ($photo.crownProportion < screenWidth / screenHeight)
      fromBodyTop += (screenHeight - screenWidth / $photo.crownProportion) / 2;

    return {
      scaleRate: clientWidth / screenWidth,
      x: offsetLeft,
      y: fromBodyTop
    };
  }

  //获取src的集合
  $photos.forEach(function ($photo) {
    
    photosArr.push({
      src: $photo.getAttribute('src'),
      img: $photo,
      description:$photo.nextSibling.innerText
    });
  });

  this.PopUp.inViewUpdateFunc = function ($div) {
    var defaultIndex = Array.prototype.indexOf.call($photos, $photo),
      defaultIndex = (defaultIndex == -1) ? 0 : defaultIndex,
      $slider = $div.querySelector('.slider'),
      $img = $slider.getElementsByTagName('img')[defaultIndex],
      $bg = $div.querySelector('.blackBg'),
      $ctrlContainer = $div.querySelector('.ctrlContainer'),
      status = {
        rafLock:false,
        initLock:false
      },
      photoInfo, $lis,
      $dot = `<div class="ctrl">
                <div class="dot"></div>
              </div>`;

    //使用全部格式化显示
    $slider.querySelectorAll('img').forEach(function ($img) {
      if ($img.imgFromMessages.crownProportion < screenWidth / screenHeight)
        $img.parentElement.classList.add('displayOverflowHeight');
    });

    if ($photo)
      photoInfo = getInfoOfPhoto($photo);
    else
      photoInfo = {
        x: (screenWidth * 0.5 / 2),
        y: (screenHeight * 0.5 / 2),
        scaleRate: 0.5
      };

    $img.style.width = '100vw';
    $img.style.transform = 'translate3d(' + photoInfo.x + 'px,' + photoInfo.y + 'px, 0px) scale(' + photoInfo.scaleRate + ')';
    $img.style.opacity = 0;
    $img.nextSibling.style.opacity = 0;

    var endFunc = function () {
      //addEventLister的处理函数不能是匿名函数
      $img.removeEventListener('transitionend', endFunc);
      $img.style.width = null;
      $img.style.transform = null;
      $img.nextSibling.style.opacity = null;
    }.bind(this);

    $img.addEventListener('transitionend', endFunc);

    this.controller.slider.parse($slider, {
      width: screen.width,
      gap: 16
    });
    $slider.generateCtrl($ctrlContainer, $dot);
    $slider.setDefault(defaultIndex);

    //溢出处理
    $slider.handleOverflow = function (info) {
      var $ul = $slider.querySelector('ul'), x = 288 / 3 / 360;

      x = - $slider.status.offsetStart + info.offset * x;

      requestAnimationFrame(function () {
        $ul.style['transform'] = 'translate3d(' + x + 'px,0,0)';
      });
    };

    //进入页面重置缩放
    $slider.onEveryPageEnter = function (page) {
      var $img = $slider.getElementsByTagName('li')[page].querySelector('img');

      requestAnimationFrame(function () {
        $img.classList.add('noneAnimation');
        $img.style['transform-origin'] = null;
        $img.style.transform = null;
        $img.zoomed = false;
        requestAnimationFrame(function () {
          $img.classList.remove('noneAnimation');
        });

      });
    };

    //设置下滑关闭
    $lis = $slider.querySelectorAll('li');

    $lis.forEach(function ($li) {
      var $img = $li.querySelector('img');

      $li.onSlide = function (info) {
        var scale, x, y,
          scrollLeft = $li.scrollLeft,
          imgClientWidth = $img.clientWidth * $img.zoomScale,
          liClientWidth = $li.clientWidth,
          transformOrgin = 'center 25%';

        if ($img.zoomed) {
          //边缘支持滑动
          if (
            (scrollLeft == 0 && info.direction == 'right') ||
            (parseInt(scrollLeft) == parseInt(imgClientWidth - liClientWidth)
              && info.direction == 'left')
          ) {
            $img.scrolledToRightLeftEdge = true;
            return 'pass';
          } else
            return;
        }

        if (info.directionLock == 'vertical' && $li.scrollTop == 0) {
          if (info.direction == 'down')
            scale = 1 - ((-info.offset) / screenHeight);
          else
            scale = 1;

          y = info.offsetY;
          x = info.offsetX;

          if ($li.classList.contains('displayOverflowHeight'))
            transformOrgin = 'center 10%';

          requestAnimationFrame(function () {
            if(!status.initLock){
              status.initLock = true;
              $img.classList.add('noneAnimation');
              $bg.classList.add('noneAnimation');
              $img.style['transform-origin'] = transformOrgin;
              $li.style['overflow'] = 'hidden';
            }

            $img.style.setProperty(
              'transform',
              'translate3d(' + x + 'px,' + y + 'px,0) scale(' + scale + ')',
              'important'
            );
            $bg.style.opacity = scale;
          });
        } else
          return 'pass';
      };

      $li.onSlideDone = function (info) {
        status.rafLock = false;
        status.initLock = false;

        if ($img.zoomed) {
          if ($img.scrolledToRightLeftEdge) {
            $img.scrolledToRightLeftEdge = false;
            return 'pass';
          } else
            return;
        }

        requestAnimationFrame(function () {
          $img.classList.remove('noneAnimation');
          $bg.classList.remove('noneAnimation');
          $img.style['transform-origin'] = null;
          $img.style.transform = null;
          $bg.style.opacity = null;
        });

        if (info.direction == 'down' && -info.offset >= 284 / 3 && $li.scrollTop == 0){
          var $bgMask = document.querySelector('.popUp.on .bgMask');

          $bgMask && ($bgMask.onClickOnce = null);
          $slider.removeAttribute('clickOnce');
          $li.onSlide = null;
          $li.onSlideDone = null;
          history.back();
        }else{
          $li.style.overflow = null;
          return 'pass';
        }
      };
      //双击放大
      $img.onDoubleClick = function () {
        var clickX = this.Event.x_start,
          clickY = this.Event.y_start,
          imgClientHeight = $img.clientHeight;

        if (!$img.zoomed) {
          //长图的放大
          if ($img.parentElement.classList.contains('displayOverflowHeight')) {
            $img.zoomScale = 1.5;
            $img.zoomY = clickY * (1 - $img.zoomScale);
          } else {
            $img.zoomScale = screenHeight / imgClientHeight;
            $img.zoomY = -(screenHeight - imgClientHeight) / 2;
          }
          $img.zoomX = clickX * (1 - $img.zoomScale);

          var changeToPositionByScroll = function () {
            $img.removeEventListener('transitionend', changeToPositionByScroll);

            requestAnimationFrame(function () {
              $img.classList.add('noneAnimation');
              $img.style.setProperty(
                'transform',
                'translate3d(0px,' + $img.zoomY + 'px,0) scale(' + $img.zoomScale + ')',
                'important'
              );
              $li.scrollLeft = -$img.zoomX;

              requestAnimationFrame(function () {
                $img.classList.remove('noneAnimation');
              });
            });
          };

          $img.addEventListener('transitionend', changeToPositionByScroll);

          requestAnimationFrame(function () {
            $img.style.setProperty(
              'transform',
              'translate3d(' + $img.zoomX + 'px,' + $img.zoomY + 'px,0) scale(' + $img.zoomScale + ')',
              'important'
            );
          });
          $img.zoomed = true;
        } else {
          requestAnimationFrame(function () {
            $img.classList.add('noneAnimation');
            $img.style.setProperty(
              'transform',
              'translate3d(' + -$li.scrollLeft + 'px,' + $img.zoomY + 'px,0) scale(' + $img.zoomScale + ')',
              'important'
            );
            $li.scrollLeft = 0;

            requestAnimationFrame(function () {
              $img.classList.remove('noneAnimation');
              $img.style['transform-origin'] = null;
              $img.style.transform = null;
            });
          });

          $img.zoomed = false;
        }
      }.bind(this);
    }, this);
  }.bind(this);

  this.PopUp.outViewUpdateFunc = function ($div) {
    var $silder = $div.querySelector('.slider'),
      $img = $silder.querySelector('.showing img'),
      photoInfo;

    if ($img)
      photoInfo = getInfoOfPhoto($img.imgFromMessages);
    else
      photoInfo = {
        x: (screenWidth * 0.5 / 2),
        y: (screenHeight * 0.5 / 2),
        scaleRate: 0.5
      };

    requestAnimationFrame(function () {
      $img.style.width = '100vw';
      $img.style.transform = 'translate3d(' + photoInfo.x + 'px,' + photoInfo.y + 'px, 0px) scale(' + photoInfo.scaleRate + ')';
      $div.classList.remove('showBtns');
      $img.nextSibling.style.opacity = 0;
    });

  }.bind(this);

  this.PopUp.switchToDom(Emmet.make(`
    div.zoomPhotoContianer > (
        div.slider[clickOnce="#back" press="&viewPopUp=PhotoZoomedPressMenu"] >
          ul > ( 
            li > 
              img[src=$src imgFromMessages=>$img] +
              div.description{$description}
          ) * @photos 
      ) + ( 
        div.ctrlContainer.noneAnimation.subNoneAnimation
      ) + 
        div.blackBg
  `, {
      photos: photosArr
    }).parse());

}