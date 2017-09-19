//好难拆分, 第一次伟大尝试失败...不过css部分还是可以做拆分的

var emojis = [
  "微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭", "尴尬", "发怒", "调皮", "呲牙", "惊讶", "难过", "囧", "抓狂", "吐", "偷笑",

  "愉快", "白眼", "傲慢", "困", "惊恐", "流汗", "憨笑", "悠闲", "奋斗", "咒骂", "疑问", "嘘", "晕", "衰", "骷髅", "敲打", "再见", "擦汗", "抠鼻", "鼓掌",

  "坏笑", "左哼哼", "右哼哼", "哈欠", "鄙视", "委屈", "快哭了", "阴险", "亲亲", "可怜", "菜刀", "西瓜", "啤酒", "咖啡", "猪头", "玫瑰", "凋谢", "嘴唇", "爱心", "心碎",

  "蛋糕", "炸弹", "便便", "月亮", "太阳", "拥抱", "强", "弱", "握手", "胜利", "抱拳", "勾引", "拳头", "OK", "跳跳", "发抖", "怄火", "转圈", "高兴", "口罩",

  "笑哭", "吐舌头", "傻呆", "恐惧", "悲伤", "不屑", "嘿哈", "捂脸", "奸笑", "机智", "皱眉", "耶", "鬼脸", "合十", "加油", "庆祝", "礼物", "红包", "鸡"
];

exports.init = function($inputBar){
  var $emojiTypeSlider = $inputBar.querySelector('.emojiTypeSlider'),
    $emojiTypeCtrlContainer = $inputBar.querySelector('.emojiTypeCtrlContainer'),
    $commonEmojiSlider = $inputBar.querySelector('.commonEmojiSlider'),
    $commonCtrl = $inputBar.querySelector('.commonCtrl .ctrlContainer'), $customEmojiSlider = $inputBar.querySelector('.customEmojiSlider'),
    $customCtrl = $inputBar.querySelector('.customCtrl .ctrlContainer')
    ,
    $moreSlider = $inputBar.querySelector('.moreSlider'),
    $moreCtrl = $inputBar.querySelector('.moreCtrl .ctrlContainer'),
    $dot = `<div class="ctrl">
                  <div class="dot"></div>
                </div>`,
    $btn = [
      `<div class="btn"><img src="/data/littleChat/emoji-ctrlbar-default-icon.png"></div>`,
      `<div class="btn"><img src="/data/littleChat/emoji-ctrlbar-custom-icon.png"></div>`,
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

  emojiSliderGenerator.run($customEmojiSlider.querySelector('ul'), {
    useDelBtn: false,
    perPage: 8,
    format: '.png',
    url: '/data/littleChat/customEmoji/',
    containerClass: 'customContainer',
    emojis: ['more', 'RPS', 'dice'],
    bindDelEvent: function ($item) { },
    bindEmojiEvent: function ($item, emoji) {
      //添加preview部分的代码,这个就变得不是很好了,应该把tpl分离出来的
      //这里算是打补丁吧因为那时候还没有弄到Emmmet出来
      var $preview = this.module.Emmet.make(`div.preview > img[src="@url"]`, {
        url: emoji.src
      }).parse()[0];

      var getOffsetTo = function (toNode, fromNode, type) {
        var offset = 0;
        while (fromNode != toNode) {
          offset += fromNode[type];
          fromNode = fromNode.offsetParent;
        }
        return offset;
      };

      $item.onPress = function () {
        $customEmojiSlider.statusPressing = true;
        $item.onEnter.call($item);
      }
      $item.addEventListener('touchend', function () {
        if ($customEmojiSlider.statusPressing) {
          $customEmojiSlider.statusPressing = false;
        }
      });
      $item.onEnter = function () {
        if ($customEmojiSlider.statusPressing) {
          var offset = {
            x: $item.offsetLeft,
            y: getOffsetTo(document.querySelector('body'), $item, 'offsetTop')
          }
          requestAnimationFrame(function () {
            $preview.classList.add('on');
            $preview.style.top = (offset.y - 121) + 'px';
            $preview.style.left = (offset.x - 4) + 'px';
            document.querySelector('body').appendChild($preview);
          });
        }
      };
      $item.onLeave = function () {
        requestAnimationFrame(function () {
          $preview.classList.remove('on');
          if ($preview.parentNode)
            document.querySelector('body').removeChild($preview);
        });
      };
    }.bind(this),
  });

  var moreSliderGenerator = {
    useDelBtn: false,
    format: null,
    perPage: null,
    url: null,
    items: null,
    containerClass: null,
    bindDelEvent: function ($item) { },
    bindEmojiEvent: function ($item) { },
    newPage: function (items) {
      var $page = document.createElement('li'),
        $container = document.createElement('div');

      items.forEach(function (item) {
        var data = {
          name: item.name,
          src: this.url + item.name + this.format,
          href: item.href
        };
        var $item = this.newItem(data);
        this.bindEmojiEvent($item, data);
        $container.appendChild($item);
      }, this);

      if (items.length < this.perPage)
        for (var i = 0, len = this.perPage - items.length; i < len; i++)
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
    newItem: function (item) {
      var $img = document.createElement('img'),
        $item = document.createElement('div'),
        $icon = document.createElement('div'),
        $name = document.createElement('div');

      $item.classList.add('item');
      $icon.classList.add('icon');
      $name.classList.add('name');
      $item.appendChild($icon);
      $item.appendChild($name);

      if (item.src) {
        $img.setAttribute('src', item.src);
        $img.setAttribute('alt', item.name);
        $name.innerText = item.name;
        $item.setAttribute('click', item.href)
        $icon.appendChild($img);
      }
      return $item;
    },
    run: function ($ul, configs) {
      for (var name in configs)
        this[name] = configs[name];

      var items = [];
      for (var page = 0, len = Math.ceil(this.items.length / this.perPage); page < len; page++) {
        var temp = [];
        var restNum = ((page + 1) * this.perPage < this.items.length) ? this.perPage : this.items.length - page * this.perPage;

        for (var i = 0; i < restNum; i++)
          temp.push(this.items[page * this.perPage + i]);

        items.push(temp);
      }

      items.forEach(function (page) {
        var $page = this.newPage(page);
        $ul.appendChild($page);
      }, this);
    }
  };

  var morePlanBtns = [
    {
      name: '相册',
      href: '#Chat/AboutChat'
    }, {
      name: '拍照',
      href: ''
    }, {
      name: '视频聊天',
      href: ''
    }, {
      name: '位置',
      href: ''
    }, {
      name: '红包',
      href: ''
    }, {
      name: '转账',
      href: ''
    }, {
      name: '语音输入',
      href: ''
    }, {
      name: '名片',
      href: ''
    }, {
      name: '收藏',
      href: ''
    }
  ];

  //然后根据目前是群聊还是文件传输来打补丁就是了,感觉挺头疼的..

  moreSliderGenerator.run($moreSlider.querySelector('ul'), {
    useDelBtn: false,
    format: '.png',
    perPage: 8,
    url: '/data/littleChat/more/',
    containerClass: 'itemContainer',
    items: morePlanBtns
  });

  $commonEmojiSlider.generateCtrl($commonCtrl, $dot);
  $customEmojiSlider.generateCtrl($customCtrl, $dot);
  $moreSlider.generateCtrl($moreCtrl, $dot);
  $emojiTypeSlider.generateCtrl($emojiTypeCtrlContainer, $btn);

  //这部分开始变得十分的混乱
  var $flex = $inputBar.querySelector('.flex'),
    $textVoiceSwitcher = $flex.querySelector('.textVoiceSwitcher'),
    $textOrVoiceInput = $inputBar.querySelector('.textOrVoiceInput'),
    $textInput = $inputBar.querySelector('.textInput'),
    $voiceInput = $inputBar.querySelector('.voiceInput'),
    updateHeight = function (currentHeight) {
      $textOrVoiceInput.style.height = currentHeight + 1 + 'px';
      var textInputHeight = $flex.offsetHeight + 1,
        m_scrollHeight = $messages.scrollHeight;

      requestAnimationFrame(function () {
        if ($inputBar.classList.contains('expanded'))
          textInputHeight += 275;

        $inputBar.style.height = textInputHeight - 1 + 'px';
        $messages.style.height = 'calc(100vh - 45px - ' + textInputHeight + 'px)';
        $messages.scrollTop = m_scrollHeight;
      });
    };

  $textInput.onfocus = function () {
    this.classList.add('focus');
    $messages.scrollTop = $messages.scrollHeight;
  }
  $textInput.onblur = function () {
    this.classList.remove('focus');
  }
  $messages.onSlide = function () {
    $textInput.blur();
  };

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

  $textInput.registerHeight = $textInput.offsetHeight;
  $textOrVoiceInput.style.height = $textInput.registerHeight + 1 + 'px';
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

  $textVoiceSwitcher.onClick = function () {
    $flex.replaceChild($flex.nodeRepo.btn_keyboard_back, $flex.nodeRepo.btn_textVoiceSwitcher);
    $inputBar.classList.remove('textInputOn');
    $inputBar.classList.add('voiceInputOn');
    $textOrVoiceInput.style.height = $voiceInput.clientHeight + 2 + 'px';

    if (this.Router.actionConfig.viewStatus)
      history.back();
  }.bind(this);

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

  $inputBar.switchToTextInput = function () {
    var $flex = $inputBar.querySelector('.flex');
    $inputBar.classList.remove('voiceInputOn');
    $inputBar.classList.add('textInputOn');

    if ($flex.querySelector('.keyboard') == $flex.nodeRepo.btn_keyboard_back)
      $flex.replaceChild(
        $flex.nodeRepo.btn_textVoiceSwitcher,
        $flex.nodeRepo.btn_keyboard_back);

  };
  //初始化页面
  if ($textInput.innerText.trim().length != 0) {
    $textInput.registerLength = 0;
    $textInput.collapse(function () {
      $textInput.dispatchEvent(new KeyboardEvent('keyup', {}));

      //格式化之后再获取
      var lastNode = $textInput.childNodes[$textInput.childNodes.length - 1],
        selection = window.getSelection();

      if (lastNode instanceof Text)
        selection.collapse(lastNode, lastNode.length);
      //还是使用格式化的形式吧因为就不给原本的img添加事件了
    });
  }


  //这里如果是有一个需要共享的状态变量可以储存在node节点当作一个作用域的,就不新建一层作用域了
  $voiceInput.addEventListener('touchstart', function () {
    $voiceInput.classList.add('pressing');
    $voiceInput.querySelector('span').innerHTML = '松开 结束';
    $voiceInput.startRecordTimer = setTimeout(function () {
      $voiceInput.classList.add('voiceRecordOn');
      $voiceInput.startRecordTimer = null;
      //开始录制
      $voiceInput.recordStartTime = (new Date).getTime();
    }, 175);
  });
  $voiceInput.addEventListener('touchmove', function (e) {
    //到达一定高度改变显示
    if (e.touches[0].clientY > screen.height * 0.7305) {
      $voiceInput.classList.remove('cancelVoiceRecordOn');
      $voiceInput.classList.add('voiceRecordOn');
      $voiceInput.isCancel = false;
      $voiceInput.querySelector('span').innerHTML = '松开 结束';
    } else {
      $voiceInput.classList.add('cancelVoiceRecordOn');
      $voiceInput.classList.remove('voiceRecordOn');
      $voiceInput.isCancel = true;
      $voiceInput.querySelector('span').innerHTML = '松开手指, 取消发送';
    }
  });
  $voiceInput.addEventListener('touchend', function () {
    //判断发送还是终止
    if ($voiceInput.startRecordTimer) {
      clearTimeout($voiceInput.startRecordTimer);
      $voiceInput.classList.remove('pressing');
      $voiceInput.querySelector('span').innerHTML = '按住 说话';
    } else {
      $voiceInput.recordEndTime = (new Date).getTime();
      //判断时间长短
      //处理语音
      //发送语音
      if ($voiceInput.recordEndTime - $voiceInput.recordStartTime < 1000) {
        if (!$voiceInput.isCancel) {
          $voiceInput.classList.remove('voiceRecordOn');
          $voiceInput.classList.add('recordTimeTooShortOn');
        }
      } else if (!$voiceInput.isCancel) {//发送

      }
      //然后是UI反馈
      setTimeout(function () {
        $voiceInput.classList.remove('pressing');
        $voiceInput.querySelector('span').innerHTML = '按住 说话';
        $voiceInput.classList.remove('voiceRecordOn');
        $voiceInput.classList.remove('recordTimeTooShortOn');
        $voiceInput.classList.remove('cancelVoiceRecordOn');
      }, 300);
    }
  });

};