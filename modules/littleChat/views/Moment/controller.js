exports.deps = {
  js:[
    { name: 'slider', url: 'littleChat/views/Widget/slider.js' }
  ],
  css:[
    'littleChat/views/Widget/inputBar.css',
    'littleChat/views/Widget/slider.css',
    'littleChat/views/Widget/zoomPhoto.css'
  ]
};

var emojis = [
  "微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭", "尴尬", "发怒", "调皮", "呲牙", "惊讶", "难过", "囧", "抓狂", "吐", "偷笑",

  "愉快", "白眼", "傲慢", "困", "惊恐", "流汗", "憨笑", "悠闲", "奋斗", "咒骂", "疑问", "嘘", "晕", "衰", "骷髅", "敲打", "再见", "擦汗", "抠鼻", "鼓掌",

  "坏笑", "左哼哼", "右哼哼", "哈欠", "鄙视", "委屈", "快哭了", "阴险", "亲亲", "可怜", "菜刀", "西瓜", "啤酒", "咖啡", "猪头", "玫瑰", "凋谢", "嘴唇", "爱心", "心碎",

  "蛋糕", "炸弹", "便便", "月亮", "太阳", "拥抱", "强", "弱", "握手", "胜利", "抱拳", "勾引", "拳头", "OK", "跳跳", "发抖", "怄火", "转圈", "高兴", "口罩",

  "笑哭", "吐舌头", "傻呆", "恐惧", "悲伤", "不屑", "嘿哈", "捂脸", "奸笑", "机智", "皱眉", "耶", "鬼脸", "合十", "加油", "庆祝", "礼物", "红包", "鸡"
];

exports.actionIndex = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });

  this.Page.eventBind = function(){
    var $slideContainer = document.querySelector('.page .slideContainer'),
      $loadingCircle = document.querySelector('.page .loadingCircle'),
      $inputBar = document.querySelector('.page .inputBar');

    //下拉刷新
    $slideContainer.status = {
      offsetStart:null,
      rafLock: false,
      initLock: false,
      loadingTimer:null
    };

    $slideContainer.addEventListener('touchstart',function(){
      $slideContainer.status.offsetStart = $slideContainer.parentElement.scrollTop;
    });

    $slideContainer.onSlide = function(info){
      if (
        info.direction == 'down' && 
        $slideContainer.parentElement.scrollTop == 0 
      ){
        var offset = ( -$slideContainer.status.offsetStart - info.offset) / 2;

        if (!$slideContainer.status.rafLock && offset > 0){
          $slideContainer.status.rafLock = true;
          requestAnimationFrame(function(){
            if (!$slideContainer.status.initLock){
              $slideContainer.classList.add('noneAnimation');
              $loadingCircle.classList.add('noneAnimation');
              $slideContainer.status.initLock = false;
            }

            $slideContainer.style.transform = 'translate3d(0,'+ offset +'px,0)';

            if(offset < 141/3)
              $loadingCircle.style.transform = 'translate3d(0,' + offset + 'px,0) rotateZ(' + -offset*8 +'deg)';
            else{
              $loadingCircle.style.transform = 'translate3d(0,' + 141 / 3 + 'px,0) rotateZ(' + -offset*8+'deg)';
              $loadingCircle.classList.remove('loading');
            }
            $slideContainer.status.rafLock = false;
          });
        }
      }else if(info.direction == 'up'){
        $loadingCircle.classList.remove('loading');
      }
    };
    $slideContainer.onSlideDone = function(info){
      // debugger;
      function loadCircleDone() {
        requestAnimationFrame(function () {
          $loadingCircle.classList.remove('loading');
          $loadingCircle.style.transform = 'translate3d(0,' + 141 / 3 + 'px,0) rotateZ(0deg)';
          requestAnimationFrame(function () {
            $loadingCircle.style.transform = null;
          });
        });
      };

      if (info.directionLock == 'vertical' && $slideContainer.parentElement.scrollTop == 0 ){
        var offset = (-$slideContainer.status.offsetStart - info.offset) / 2;
        
        $slideContainer.status.initLock = false;
        $slideContainer.status.rafLock = false;

        requestAnimationFrame(function(){
          $slideContainer.classList.remove('noneAnimation');
          $loadingCircle.classList.remove('noneAnimation');
          $slideContainer.style.transform = 'translate3d(0,0,0)';
          $loadingCircle.style.transform = 'translate3d(0,' + 141 / 3 + 'px,0) rotateZ(0deg)';

          if (offset > 141 / 3){
            $loadingCircle.classList.add('loading');
            //刷新数据
            $slideContainer.status.loadingTimer = setTimeout(loadCircleDone,4000);
          }else
            $loadingCircle.style.transform = null;
        });
      } else{
        //隐藏,但是定时器怎么处理?
        if ($slideContainer.status.loadingTimer){
          //像这样的,可以封转, .clear();就不需要这样的判断了
          clearTimeout($slideContainer.status.loadingTimer);
          $slideContainer.status.loadingTimer = null;
        }
        
        requestAnimationFrame(function () {
          $loadingCircle.classList.remove('loading');
          $loadingCircle.classList.remove('noneAnimation');
          $slideContainer.style.transform = 'translate3d(0,0,0)';
          $loadingCircle.style.transform = 'translate3d(0,0,0)';
        });
      }
    };

    //临时的,之后需要挪到viewUpdate里面去
    var btnExpands = document.querySelectorAll('.page .main .btnExpand');
    btnExpands.forEach(function($btn){
      $btn.setAttribute('focus','.temp');//好尴尬..这里是设置一个假的..这里为了使用blur
      $btn.setAttribute('blur', '|');
      $btn.setAttribute('click','.focus');//这个才是真的
    },this);

    var btnContainer = document.querySelectorAll('.page .main .expandContainer');
    btnContainer.forEach(function ($container) {
      $container.classList.remove('on');
      $container.setAttribute('focus','.focus');
      $container.setAttribute('blur', '|');
    });

    //点赞
    var $btnLikes = document.querySelectorAll('.page .main .btnLike');

    $btnLikes.forEach(function ($btn) {
      $btn.onClick = function(){
        $btn.addEventListener('animationend',function(){//应该是冒泡扑捉上来的
          $btn.classList.remove('liked');
          $btn.removeEventListener('animationend',arguments.callee);

          this.Event.triggerBlur([]);
        }.bind(this));

        $btn.classList.add('liked');
        $btn.innerText = '取消';
      }.bind(this);
    },this);

    //评论
    var $btnComments = document.querySelectorAll('.page .main .btnComment');

    $btnComments.forEach(function ($btn) {
      $btn.onClick = function () {
        $inputBar.classList.remove('disable');
        this.Event.triggerBlur([]);
      }.bind(this);
    }, this);




    //这个粘贴复制一点都不舒服...一定要组件化
    var $emojiTypeSlider = document.querySelector('.page .emojiTypeSlider'),
      $emojiTypeCtrlContainer = document.querySelector('.page .emojiTypeCtrlContainer'),
      $commonEmojiSlider = document.querySelector('.page .commonEmojiSlider'),
      $commonCtrl = document.querySelector('.page .commonCtrl .ctrlContainer'), 
      $dot = `<div class="ctrl">
                  <div class="dot"></div>
                </div>`,
      $btn = [
        `<div class="btn"><img src="/data/littleChat/emoji-ctrlbar-default-icon.png"></div>`
      ];

    var emojiSliderGenerator = {
      useDelBtn: null,
      perPage: null,
      format: null,
      url: null,
      emojis: [],
      containerClass: null,
      bindDelEvent: function ($item) { },
      bindEmojiEvent: function ($item) { },
      newPage: function (emojis) {
        var $page = document.createElement('li'),
          $container = document.createElement('div');

        emojis.forEach(function (emoji) {
          var data = {
            name: emoji,
            src: this.url + emoji + this.format
          };
          var $item = this.newItem(data);
          this.bindEmojiEvent($item, data);
          $container.appendChild($item);
        }, this);

        if (emojis.length < this.perPage)
          for (var i = 0, len = this.perPage - emojis.length; i < len; i++)
            $container.appendChild(this.newItem({}));

        if (this.useDelBtn) {
          var $delBtn = this.newItem({
            name: '删除',
            src: this.url + '删除' + this.format
          });
          this.bindDelEvent($delBtn);
          $container.appendChild($delBtn);
        }
        $container.setAttribute('class', this.containerClass);
        $page.appendChild($container);
        return $page;
      },
      newItem: function (emoji) {
        var $img = document.createElement('img'),
          $item = document.createElement('div');

        $item.setAttribute('class', 'item');
        if (emoji.src) {
          $img.setAttribute('src', emoji.src);
          $img.setAttribute('alt', emoji.name);
          $item.appendChild($img);
        }
        return $item;
      },
      run: function ($ul, configs) {
        for (var name in configs)
          this[name] = configs[name];

        var emojis = [];
        for (var page = 0, len = Math.ceil(this.emojis.length / this.perPage); page < len; page++) {
          var temp = [];
          var restNum = ((page + 1) * this.perPage < this.emojis.length) ? this.perPage : this.emojis.length - page * this.perPage;

          for (var i = 0; i < restNum; i++)
            temp.push(this.emojis[page * this.perPage + i]);

          emojis.push(temp);
        }

        emojis.forEach(function (page) {
          var $page = this.newPage(page);
          $ul.appendChild($page);
        }, this);
      }
    };

    this.controller.slider.init();

    emojiSliderGenerator.run($commonEmojiSlider.querySelector('ul'), {
      useDelBtn: true,
      perPage: 20,
      format: '.png',
      url: '/data/littleChat/emoji/',
      containerClass: 'commonContainer',
      emojis: emojis,
      bindDelEvent: function ($item) {
        $item.onClick = function () {
          var $textInput = $inputBar.querySelector('.textInput');

          $textInput.collapse(function () {
            $textInput.dispatchEvent(new KeyboardEvent('keydown'), {});
            document.execCommand('delete', false, null);
            $textInput.dispatchEvent(new KeyboardEvent('keyup'), {});
          });
        };
      },
      bindEmojiEvent: function ($item) {
        $item.onClick = function () {
          var selection = window.getSelection(),
            frontpart, laterpart, textNode, nextSibling,
            $textInput = $inputBar.querySelector('.textInput'),
            emojiCode = '[' + $item.querySelector('img').getAttribute('alt') + ']';

          $textInput.collapse(function () {
            $textInput.dispatchEvent(new KeyboardEvent('keydown'), {});

            if (selection.anchorNode instanceof Text) {
              frontpart = selection.anchorNode.data.slice(0, selection.anchorOffset);
              laterpart = selection.anchorNode.data.slice(selection.anchorOffset);

              selection.anchorNode.data = frontpart + emojiCode + laterpart;
            } else {
              textNode = document.createTextNode(emojiCode);
              nextSibling = selection.anchorNode.childNodes[selection.anchorOffset];
              if (nextSibling)
                selection.anchorNode.insertBefore(
                  textNode,
                  nextSibling);
              else
                selection.anchorNode.appendChild(textNode);

              selection.collapse(textNode, 0);
            }

            $textInput.dispatchEvent(new KeyboardEvent('keyup'), {});
          });
        };
      },
    });

    $commonEmojiSlider.generateCtrl($commonCtrl, $dot);
    $emojiTypeSlider.generateCtrl($emojiTypeCtrlContainer, $btn);

    //这部分开始变得十分的混乱
    var $flex = $inputBar.querySelector('.flex'),
      $textVoiceSwitcher = $flex.querySelector('.textVoiceSwitcher'),
      $textOrVoiceInput = $inputBar.querySelector('.textOrVoiceInput'),
      $textInput = $inputBar.querySelector('.textInput'),
      $voiceInput = $inputBar.querySelector('.voiceInput'),
      updateHeight = function (currentHeight) {
        $textOrVoiceInput.style.height = currentHeight + 1 + 'px';
        var textInputHeight = $flex.offsetHeight + 1;

        requestAnimationFrame(function () {
          if ($inputBar.classList.contains('expanded'))
            textInputHeight += 275;

          $inputBar.style.height = textInputHeight - 1 + 'px';
        });
      };

    $textInput.onfocus = function () {
      this.classList.add('focus');
    }
    $textInput.onblur = function () {
      this.classList.remove('focus');
    }

    $commonEmojiSlider.onClick = function () {
      $textInput.collapse();
    };

    $textInput.addEventListener('click', function () {
      var selection = window.getSelection();
      $textInput.registerSelection = {
        anchorNode: selection.anchorNode,
        anchorOffset: selection.anchorOffset,
      };
      $textInput.registerScrollTop = $textInput.scrollTop;

      if (this.Router.actionConfig.viewStatus == 'More' || this.Router.actionConfig.viewStatus == 'Emoji')
        history.back();

    }.bind(this));

    requestAnimationFrame(function(){
      $textInput.registerHeight = $textInput.offsetHeight;
      $textOrVoiceInput.style.height = $textInput.registerHeight + 1 + "px";
    });

    $textInput.addEventListener('keydown', function (e) {
      //高度还没更新把旧的写到容器当中
      $textOrVoiceInput.style.height =
        $textInput.registerHeight + 1 + 'px';

      $textInput.registerLength = $textInput.innerHTML.length;

      setTimeout(function () {
        var currentHeight = $textInput.offsetHeight
        if (currentHeight != $textInput.registerHeight) {
          $textInput.registerHeight = currentHeight;
          updateHeight(currentHeight);
        }
      }, 0);
    });

    $textInput.addEventListener('paste', function (e) {
      var text = e.clipboardData.getData('text/plain'),
        selection = window.getSelection(),
        frontpart, laterpart, textNode, nextSibling,
        offsetChildNodes = selection.anchorNode.childNodes[selection.anchorOffset];

      e.preventDefault();

      if (selection.anchorNode instanceof Text) {
        frontpart = selection.anchorNode.data.slice(0, selection.anchorOffset);
        laterpart = selection.anchorNode.data.slice(selection.anchorOffset);
        selection.anchorNode.data = frontpart + text + laterpart;

        selection.collapse(
          selection.anchorNode,
          frontpart.length + text.length
        );
      } else if (offsetChildNodes == undefined) {
        textNode = document.createTextNode(text);
        selection.anchorNode.appendChild(textNode);

        selection.collapse(
          textNode,
          text.length
        );
      } else if (offsetChildNodes instanceof Text) {
        offsetChildNodes.data = text;
        selection.collapse(
          offsetChildNodes,
          text.length
        );
      } else if (offsetChildNodes.classList.contains('emojiInputed')) {
        textNode = document.createTextNode(text);
        nextSibling = offsetChildNodes.nextSibling;

        if (nextSibling)
          selection.anchorNode.insertBefore(textNode, nextSibling);
        else
          selection.anchorNode.appendChild(textNode);

        selection.collapse(
          textNode,
          text.length
        );
      }
    });

    $textInput.addEventListener('keyup', function (e) {
      var selection = window.getSelection(),
        search, frontpart, laterpart, textNode,
        $emoji, i, offset, overflowOffset, splitArr, matchArr,
        collapseTextNode = selection.anchorNode,
        parentNode = collapseTextNode.parentNode,
        nextSibling = collapseTextNode.nextSibling,
        innerHTML = $textInput.innerHTML,
        innerText = $textInput.innerText,
        $send = $inputBar.querySelector('.send');

      var getEmojiNode = function (emojiCode) {
        var $emoji = (new Emmet(`img.emojiInputed[src="@url" alt="@name" onclick=>@click]`, {
          url: '/data/littleChat/emoji/' + emojiCode + '.png',
          name: '[' + emojiCode + ']',
          click: function () {
            for (var i = 0; i < this.parentNode.childNodes.length; i++) {
              if (this.parentNode.childNodes[i] == this) {
                window.getSelection().collapse(this.parentNode, i + 1);
                break;
              }
            }
          }
        })).parse()[0];
        return $emoji;
      };
      //方向键等没必要卡顿的
      var excludeKey = [
        'Enter',
        'ArrowRight',
        'ArrowLeft',
        'ArrowDown',
        'ArrowUp',
        'Backspace',
        'Control',
      ];

      //更新发送按钮
      if (innerText.trim().length != 0) {
        requestAnimationFrame(function () {
          $send.classList.add('inital');
          requestAnimationFrame(function () {
            $inputBar.classList.add('sendOn');
          });
        });
      } else if ($inputBar.classList.contains('sendOn')) {
        $send.addEventListener('transitionend', function () {
          $send.classList.remove('inital');
          $send.removeEventListener('transitionend', arguments.callee);
        });
        $inputBar.classList.remove('sendOn');
      }

      if (!excludeKey.includes(e.code))
        if (collapseTextNode instanceof Text &&
          $textInput.registerLength < innerHTML.length
        ) {
          //格式化emojiCode
          search = collapseTextNode.data.match(/\[([^\]]+)\]/i);
          matchArr = collapseTextNode.data.match(/\[([^\]]+)\]/gi);

          if (search && search[1] && matchArr.length == 1) {
            if (emojis.includes(search[1])) {

              frontpart = collapseTextNode.data.slice(0, search.index);
              laterpart = collapseTextNode.data.slice(search.index + search[0].length);

              collapseTextNode.data = frontpart;

              textNode = document.createTextNode(laterpart);

              $emoji = getEmojiNode(search[1]);

              if (nextSibling) {
                parentNode.insertBefore(
                  $emoji,
                  nextSibling);

                parentNode.insertBefore(
                  textNode,
                  nextSibling);
              } else {
                parentNode.appendChild($emoji);

                parentNode.appendChild(textNode);
              }

              for (i = parentNode.childNodes.length - 1; i > -1; i--) {
                if (parentNode.childNodes[i] == $emoji) {
                  offset = i;
                  break;
                }
              }
              //然后调整光标,定位到emoji后面
              selection.collapse(parentNode, offset + 1);

              //修正scrollTop
              overflowOffset = $textInput.offsetTop + $textInput.clientHeight - $emoji.offsetTop + $textInput.scrollTop - $emoji.clientHeight;

              if (overflowOffset < 0) {
                $textInput.scrollTop =
                  $textInput.registerScrollTop =
                  $textInput.scrollTop - overflowOffset + 3;
              }
            }
          } else if (matchArr) {
            parentNode.removeChild(collapseTextNode);
            splitArr = collapseTextNode.data.split(/\[[^\]]+\]/gi);

            for (var i = 0; i < matchArr.length; i++) {
              textNode = document.createTextNode(splitArr[i]);
              $emoji = getEmojiNode(matchArr[i].slice(1, -1));
              if (nextSibling) {
                parentNode.insertBefore(
                  textNode,
                  nextSibling);
                parentNode.insertBefore(
                  $emoji,
                  nextSibling);
              } else {
                parentNode.appendChild(textNode);
                parentNode.appendChild($emoji);
              }
            }
            textNode = document.createTextNode(splitArr[splitArr.length - 1]);;
            if (nextSibling) {
              parentNode.insertBefore(
                textNode,
                nextSibling);
            } else {
              parentNode.appendChild(textNode);
            }

            //然后调整光标,末尾文本
            selection.collapse(textNode, textNode.length);
            //滚动位置还是需要修正的,想不到办法,先放弃好了
          }
        }

      //刷新缓存
      selection = window.getSelection();

      $textInput.registerSelection = {
        anchorNode: selection.anchorNode,
        anchorOffset: selection.anchorOffset,
      };
      $textInput.registerScrollTop = $textInput.scrollTop;
    });

    $textInput.collapse = function (callback) {
      var selection = $textInput.registerSelection,
        anchorNodeTemp, anchorOffsetTemp;

      if (selection) {
        anchorNodeTemp = selection.anchorNode;
        anchorOffsetTemp = selection.anchorOffset;
      } else {
        $lastNode = $textInput.childNodes[$textInput.childNodes.length - 1];

        if ($lastNode instanceof Text) {
          anchorNodeTemp = $lastNode;
          anchorOffsetTemp = $lastNode.data.trim().length;
        } else {
          anchorNodeTemp = $textInput;
          anchorOffsetTemp = $textInput.childNodes.length - 1;
        }

        $textInput.registerSelection = {
          anchorNode: anchorNodeTemp,
          anchorOffset: anchorOffsetTemp,
        };
      }
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          $textInput.focus();
          window.getSelection().collapse(anchorNodeTemp, anchorOffsetTemp);
          $textInput.scrollTop = $textInput.registerScrollTop;
          callback && callback();
        });
      });
    };

    $flex.nodeRepo = {
      btn_keyboard: this.module.Emmet.make(
        `div.keyboard[click="#back"] >
            img[src="/data/littleChat/inputbar-keyboard-icon.png"]`
      ).parse()[0],
      btn_keyboard_back: this.module.Emmet.make(
        `div.keyboard[onClick=>@click] >
            img[src="/data/littleChat/inputbar-keyboard-icon.png"]
        `, {
          click: function () {
            $flex.replaceChild($flex.nodeRepo.btn_textVoiceSwitcher, $flex.nodeRepo.btn_keyboard_back);
            $inputBar.classList.remove('voiceInputOn');
            $inputBar.classList.add('textInputOn');
            $textOrVoiceInput.style.height = $textInput.clientHeight + 1 + 'px';

            if (this.Router.actionConfig.viewStatus)
              history.back();
          }.bind(this)
        }).parse()[0],
      btn_more_back: this.module.Emmet.make(
        `div.more[click="#back"] >
            img[src="/data/littleChat/inputbar-plus-icon.png"]`
      ).parse()[0],
      btn_emoji: $flex.querySelector('.emoji'),
      btn_more: $flex.querySelector('.more'),
      btn_textVoiceSwitcher: $textVoiceSwitcher,
      btn_send: this.module.Emmet.make(`div.send[onClick=>@click]`, {
        click: function () {
          //发送成功就会清空输入还原现场咯~
        }
      }).parse()[0]
    };

    //初始化完成在dispalynone;
    $inputBar.classList.add('disable');
    $inputBar.style.opacity = 1;

    $slideContainer.ontouchstart = function () {
      if (this.Router.actionConfig.viewStatus)
        history.back();

      $inputBar.classList.add('disable');
    }.bind(this);
    

  };
}

var panleIn = function ($panle) {
  var $page = document.querySelector('.page'),
    $inputBar = document.querySelector('.page .inputBar'),
    $flex = $inputBar.querySelector('.flex'),
    w_height = screen.height,
    textInputHeight = $flex.offsetHeight + 1 + 275;

  requestAnimationFrame(function () {
    $panle().classList.add('expanded');
    $inputBar.classList.add('expanded');
    $inputBar.style.height = textInputHeight - 1 + 'px';
  });
},
  panleOut = function ($panle) {
    var $page = document.querySelector('.page'),
      $inputBar = document.querySelector('.page .inputBar'),
      $flex = $inputBar.querySelector('.flex'),
      w_height = screen.height,
      textInputHeight = $flex.offsetHeight + 1;

    requestAnimationFrame(function () {
      $panle().classList.remove('expanded');
      $inputBar.classList.remove('expanded');
      $inputBar.style.height = textInputHeight - 1 + 'px';
    });
  };


exports.viewStatusInEmoji = panleIn.bind(this, function () {
  var $flex = document.querySelector('.page .inputBar .flex'),
    $textInput = document.querySelector('.page .inputBar .textInput'),
    $emojiTypeSlider = document.querySelector('.page .emojiTypeSlider'),
    $commonEmojiSlider = document.querySelector('.page .commonEmojiSlider'),
    $customEmojiSlider = document.querySelector('.page .customEmojiSlider');

  $flex.replaceChild($flex.nodeRepo.btn_keyboard, $flex.nodeRepo.btn_emoji);

  $textInput.collapse();

  if ($textInput.innerText.trim().length != 0) {
    requestAnimationFrame(function () {
      $emojiTypeSlider.reset();
      $commonEmojiSlider.reset();
    });
  }

  return document.querySelector('.page .emojiPanle');
});
exports.viewStatusOutEmoji = panleOut.bind(this, function () {
  var $flex = document.querySelector('.page .inputBar .flex'),
    $textInput = document.querySelector('.page .inputBar .textInput');

  $textInput.collapse();
  $flex.replaceChild($flex.nodeRepo.btn_emoji, $flex.nodeRepo.btn_keyboard);

  return document.querySelector('.page .emojiPanle');
});

exports.viewPopUpZoomPhoto = function (config) {
  var $photo = this.Event.triggerElement;

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

  var $messages = document.querySelector('.page .main'),
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
      img: $photo
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

    var endFunc = function () {
      //addEventLister的处理函数不能是匿名函数
      $img.removeEventListener('transitionend', endFunc);
      $img.style.width = null;
      $img.style.transform = null;

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
    });

  }.bind(this);

  this.PopUp.switchToDom(this.module.Emmet.make(`
    div.zoomPhotoContianer > (
        div.slider[clickOnce="#back" press="&viewPopUp=PhotoZoomedPressMenu"] >
          ul > ( 
            li > 
              img[src=$src imgFromMessages=>$img] 
          ) * @photos 
      ) + ( 
        div.ctrlContainer.noneAnimation.subNoneAnimation
      ) + 
        div.blackBg
  `, {
      photos: photosArr
    }).parse());

}

exports.viewPopUpPhotoZoomedPressMenu = function (config) {
  this.PopUp.config({
    position: 'fromEdge',
    y: '-0px',
    x: '0px',
    maskOnStyle: 'maskOn-lightdark',
    inAnimation: 'in-slide-bottom',
    outAnimation: 'out-slide-bottom',
    initial: 'initial-slide-bottom'
  });

  this.PopUp.switchToDom(`
  <ul class="bottomMenu" onselectstart="window.event.returnValue=false" oncontextmenu="window.event.returnValue=false" ondragstart="window.event.returnValue=false">
    <li>发送给朋友</li>
    <li>收藏</li>
    <li>保存图片</li>
    <li>编辑</li>
  </ul>
`);
};

exports.viewPopUpDeleteConfirmWindow = function (config) {
  this.PopUp.config({
    position: 'center',
    maskOnStyle: 'maskOn-dark'
  });
  this.PopUp.eventBind = function () {
    var $popUp_window = document.querySelector('.popUp .popUp-window'),
      $cancel = document.querySelector('.popUp .btn-cancel'),
      $confirm = document.querySelector('.popUp .btn-confirm');

    $cancel.onclick = function () {
      history.back();//这是关闭popUUp
    }.bind(this);

    $confirm.onclick = function () {
      history.back();//这是关闭popUp
    }.bind(this);
  };
  this.PopUp.switchToDom(`
    <div class="popUp-window">
      <div class="title">提示</div>
      <div class="content">
        <p>确定删除吗?</p>
      </div>
      <div class="controllBar">
        <div class="btn-cancel">取消</div>
        <div class="btn-confirm">删除</div>
      </div>
    </div>
  `);
};

exports.viewPopUpTextPressMenu = function (config) {
  var fromPressElement = this.Event.triggerElement;

  this.PopUp.config({
    position: 'clickRelative',
    initial: 'popUp-initial',
    inAnimation: 'popUp-in',
    outAnimation: 'popUp-out',
    autoSetOrthocenter: true
  });
  this.PopUp.switchToDom('\
    <ul class="pressMenu" onselectstart="window.event.returnValue=false" oncontextmenu="window.event.returnValue=false" ondragstart="window.event.returnValue=false" >\
      <li>复制</li>\
      <li>收藏</li>\
      <li>翻译</li>\
    </ul>\
  ');
  this.PopUp.inViewUpdateFunc = function () {
    if (fromPressElement)
      fromPressElement.classList.add('pressing');
  }
  this.PopUp.outViewUpdateFunc = function () {
    if (fromPressElement)
      fromPressElement.classList.remove('pressing');
  }
};

exports.viewPopUpPhotoNoneZoomPressMenu = function (config) {
  var fromPressElement = this.Event.triggerElement;

  this.PopUp.config({
    position: 'clickRelative',
    initial: 'popUp-initial',
    inAnimation: 'popUp-in',
    outAnimation: 'popUp-out',
    autoSetOrthocenter: true
  });
  this.PopUp.switchToDom(`
    <ul class="pressMenu" onselectstart="window.event.returnValue=false" oncontextmenu="window.event.returnValue=false" ondragstart="window.event.returnValue=false" >
      <li>收藏</li>
      <li>编辑</li>
    </ul>
  `);
  this.PopUp.inViewUpdateFunc = function () {
    if (fromPressElement)
      fromPressElement.classList.add('pressing');
  }
  this.PopUp.outViewUpdateFunc = function () {
    if (fromPressElement)
      fromPressElement.classList.remove('pressing');
  }
};

exports.viewPopUpPortraitPressMenu = function (config) {
  var fromPressElement = this.Event.triggerElement;

  this.PopUp.config({
    position: 'clickRelative',
    initial: 'popUp-initial',
    inAnimation: 'popUp-in',
    outAnimation: 'popUp-out',
    autoSetOrthocenter: true
  });
  this.PopUp.switchToDom(`
    <ul class="pressMenu" onselectstart="window.event.returnValue=false" oncontextmenu="window.event.returnValue=false" ondragstart="window.event.returnValue=false" >
      <li>设置朋友圈权限</li>
      <li>投诉</li>
    </ul>
  `);
  this.PopUp.inViewUpdateFunc = function () {
    if (fromPressElement)
      fromPressElement.classList.add('pressing');
  }
  this.PopUp.outViewUpdateFunc = function () {
    if (fromPressElement)
      fromPressElement.classList.remove('pressing');
  }
};

exports.viewPopUpTakePhotoMenu = function (config) {
  this.PopUp.config({
    position: 'center',
    maskOnStyle: 'maskOn-dark'
  });
  this.PopUp.switchToDom(`
    <ul class="centerMenu" onselectstart="window.event.returnValue=false" oncontextmenu="window.event.returnValue=false" ondragstart="window.event.returnValue=false" >
      <li>拍照<span class="description">照片或视频</span></li>
      <li>从相册选择</li>
    </ul>
  `);
};

exports.viewUpdateIndex = function () {
  //那么那个集中的地方叫什么捏?
  //像清楚,逻辑先

};

exports.actionPhotoAlbum = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}