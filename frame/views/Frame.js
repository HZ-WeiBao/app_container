window.F = {
  error: function(code, event) {
    var codeToMeans = [
      '初始化失败',//前端的错误处理还没有统一想好,至今都没使用过~~
    ];
    if (code > 0) {
      console.log(codeToMeans[code] + ' => ' + event);
    }
  },
  addComponent: function(name, obj, toWhere) {
    toWhere || (toWhere = this);

    obj.__proto__ = toWhere;
    toWhere[name] = obj;
    obj.__type = 'component';
    if (obj.hasOwnProperty('init') && typeof obj.init === 'function') {
      obj.init();
    }
  },
  isComponent: function(obj) {
    return obj.__type === 'component';
  }
};

window.AjaxCache = {};

F.addComponent('module', { config: {} });

F.addComponent('Event', {
  x_start: null,
  y_start: null,
  timer: {
    press: null,
    tap: null,
    doubleClick:null,
    pressing:null//弃用, :active是更好的选择,滑动的时候会取消状态的~和想要的一样~
    //不过缺点就是和click触发的dom不是一致的..
  },
  locker:{
    checkOverElement:false//默认关闭,需要再打开
  },
  offset: null,
  direction: null,
  directionLock: null,
  triggerStatus: null,
  clickCount: 0,
  clickStopTime: null,
  clickStartTime: null,
  clickStartEvent: null,
  clickEndEvent: null,
  triggerElement: null,
  triggerIndex: null,
  lastTriggerElement: null,
  lastFocusElements: [],
  lastOverElements: [],
  lastDoubleClickElements: [],
  triggerDoubleClickElements:[],
  endSearchTriggerElement: false,
  customTriggerStack:{},
  statusPressing:false,
  init: function() {
    var downEvent = function(e) {
        this.clickStartEvent = e;
        this.clickStartTime = (new Date).getMilliseconds();
        this.x_start = this.clickStartEvent.touches[0].pageX;
        this.y_start = this.clickStartEvent.touches[0].pageY;
        //在这里搜索一遍启用那个事件,并且调整start
        //在这里选择那些事件的监听
        var focusElements = [],
            doubleClickElements = [],
            doubleClickElementsForNext = [],
            doubleClickElementsForTrigger = [];

        e.path.forEach(function($element, i) {
          if ($element.getAttribute) {
            if ($element.getAttribute('press') || $element.onPress )
              this.startTimer('press');
            // if ($element.getAttribute('tap') || $element.onTap)
            //   this.startTimer('tap');
            // if($element.onSlide || $element.onSlide)
            //   window.addEventListener('touchmove',moveEvent,false);
            if ($element.getAttribute('focus') || $element.onFocus)
              focusElements.push($element);

            if($element.getAttribute('doubleClick') || $element.onDoubleClick){
              doubleClickElements.push($element);
              this.startTimer('doubleClick');
            }
            
            if ($element.getAttribute('pressing'))
              this.startTimer('pressing');
          }
        }, this);
        //因为focus不是互斥事件不走this.trigger
        this.triggerBlur(focusElements);
        this.triggerFocus(focusElements);

        if(this.locker.checkOverElement){
          var overElement = document.elementFromPoint(this.x_start, this.y_start);
          //一样需要寻找出list出来在做对比才行
          var overElements = [],
              $html = document.querySelector('html');
          
          while (overElement != $html){
            if (overElement && overElement.onEnter)
              overElements.push(overElement);
            overElement = overElement.parentNode;
          }

          this.triggerLeave(overElements);
          this.triggerEnter(overElements);
        }

        //doubleClick的处理
        doubleClickElements.forEach(function($element_){
          if (this.lastDoubleClickElements.includes($element_))
            doubleClickElementsForTrigger.push($element_);
          else
            doubleClickElementsForNext.push($element_);
        },this);
        //清除旧的timer , trigger doubleClick是在touchend的时候触发的?click和doubleClick是互斥事件来的,就是说检查到所有的有doubleClick的path都会进入click的延迟执行,这TM就难咯

        this.lastDoubleClickElements = doubleClickElementsForNext;
        this.triggerDoubleClickElements = doubleClickElementsForTrigger;
        
      }.bind(this),

      //移动
      moveEvent = function(e) {
        // this.moveEvent = e;

        this.triggerPressEnd();

        this.stopTimer('all');

        if (this.triggerStatus == null || this.triggerStatus == 'slide') {
          //判断方向
          this.moving_x = e.touches[0].clientX;
          this.moving_y = e.touches[0].clientY;

          var x = this.moving_x - this.x_start,
            y = this.y_start - this.moving_y;

          //锁定方向(纵向/横向 | vertical/horizontal)
          if (this.directionLock == null)
            this.directionLock = (Math.abs(y) <= Math.abs(x)) ? 'horizontal' : 'vertical';

          //根据生成directionLock偏移量和左右
          if (this.directionLock === 'vertical') {
            this.offset = y;
            this.direction = (y >= 0) ? 'up' : 'down';
          } else {
            this.offset = x;
            this.direction = (x > 0) ? 'right' : 'left';
          }

          this.trigger('slide');
          // this.trigger('move');
        }else{
          if(this.locker.checkOverElement){
            var overElement = document.elementFromPoint(
              e.touches[0].clientX, 
              e.touches[0].clientY
            );
            if(!overElement)
              return;
            
            //一样需要寻找出list出来在做对比才行
            var overElements = [],
              $body = document.querySelector('body');
            while (overElement && overElement != $body) {
              if (overElement.onEnter)
                overElements.push(overElement);
              overElement = overElement.parentNode;
            }

            this.triggerLeave(overElements);
            this.triggerEnter(overElements);
          }
        }
      }.bind(this),

      upEvent = function(e) {
        //pressing end
        this.triggerPressEnd();

        //判断一下按下时长,小于200毫秒,click,大于press
        this.clickStopTime = (new Date).getMilliseconds();
        this.clickEndEvent = e;
        this.stopTimer('press');

        if (this.triggerStatus == null) {
          if(this.triggerDoubleClickElements.length > 0){
            this.trigger('doubleClick');
            this.stopTimer('doubleClick');
          }else if(this.lastDoubleClickElements.length == 0)
            this.trigger('click');
        } else if (this.triggerStatus == 'slide') {
          this.trigger('slideDone');
        }
        this.reset();
      }.bind(this);

    window.addEventListener('touchstart', downEvent, false);
    window.addEventListener('touchmove', moveEvent, false);
    window.addEventListener('touchend', upEvent, false);

    // window.addEventListener('mousedown',downEvent,false);
    // window.addEventListener('mousemove',moveEvent,false);
    // window.addEventListener('mouseup',upEvent,false);
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
  },
  reset:function(){
    this.triggerStatus = null;
    this.direction = null;
    this.directionLock = null;
    this.endSearchTriggerElement = false;
    this.lastTriggerElement = this.triggerElement;
    this.triggerElement = null;
    this.triggerLeave([]);
    this.lastOverElements = [];
  },
  startTimer: function(i) {
    if (i == 'all' || i == 'press' && this.timer.press == null)
      this.timer.press = setTimeout(function() {
        this.trigger('press');
        this.stopTimer('all');
      }.bind(this), 230);

    if (i == 'all' || i == 'tap' && this.timer.tap == null)
      this.timer.tap = setTimeout(function() {
        this.stopTimer('tap');
      }.bind(this), 100);

    if (i == 'all' || i == 'doubleClick' && this.timer.doubleClick === null)
      this.timer.doubleClick = setTimeout(function () {
        this.lastDoubleClickElements = [];
        this.triggerDoubleClickElements = [];
        this.stopTimer('doubleClick');
        this.trigger('click');
        this.reset();
      }.bind(this), 350);

    if (i == 'all' || i == 'pressing' && this.timer.pressing == null)
      this.timer.pressing = setTimeout(function () {
        this.triggerPressStart();
        this.stopTimer('pressing');
      }.bind(this), 25);
  },
  stopTimer: function(i) {
    if (i == 'all')
      for (var i in this.timer) {
        if (this.timer[i] != null) {
          clearTimeout(this.timer[i]);
          this.timer[i] = null;
        }
      }
    else {
      if (this.timer[i] != null) {
        clearTimeout(this.timer[i]);
        this.timer[i] = null;
      }
    }
  },
  trigger: function(event) {
    this.triggerStatus = event;
    event = this.formatTriggerName(event);
    this['trigger' + event]();
  },
  formatTriggerName:function(name){
    name = name[0].toUpperCase() + name.slice(1);
    return name;
  },
  addTrigger:function(type,checkFunc,executeFunc){
    type = this.formatTriggerName(type);

    if(!(this.customTriggerStack[type] instanceof Array))
      this.customTriggerStack[type] = [];

    this.customTriggerStack[type].push({
      check:checkFunc,
      execute:executeFunc
    });
  },
  triggerClick: function() {
    var passCheckTrigger = [];

    if(this.customTriggerStack['Click']){
      //这是一个数组,将会提取执行所有检查通过的trigger,
      this.customTriggerStack['Click'].forEach(function(trigger){
        if(trigger.check())
          passCheckTrigger.push(trigger);
      },this);
    }

    for (var i = 0, len = this.clickStartEvent.path.length; i < len; i++) {
      var $element = this.clickStartEvent.path[i],hash,checked=true;
      if ($element.getAttribute) {
        this.triggerElement = $element;

        if($element.clickCheck)
          checked = $element.clickCheck();
        
        if(!checked)
          continue;

        if($element.onClickOnce){
          $element.onClickOnce.call($element);
          $element.onClickOnce = function(){};
          return;
        }else if($element.onClick){
          $element.onClick.call($element);
          return;
        }

        if ($element.getAttribute('clickOnce')) {
          var href = $element.getAttribute('clickOnce');
          $element.removeAttribute('clickOnce');
          this.Router.parseCommand(href, $element);
          return;
        }else {
          var command = $element.getAttribute('click');

          if (command) {
            this.Router.parseCommand(command, $element);
            return;
          }
        }

        for(var j = 0; j < passCheckTrigger.length; j++){
          var returnValue = passCheckTrigger[j].execute($element);
          if(returnValue != 'pass')
            return;
        }
      }
    }
  },
  triggerDoubleClick:function () {
    this.triggerDoubleClickElements.every(function($element){
      this.triggerElement = $element;
      if ($element.onDoubleClick) {
        if ($element.onDoubleClick.call($element) == 'pass')
          return true;
      }else if ($element.getAttribute('doubleClick'))
        this.Router.parseHashCommand($element.getAttribute('doubleClick'));
      
      return false;
    },this);

    this.lastDoubleClickElements = [];
    this.triggerDoubleClickElements = [];
  },
  triggerPress: function() {
    // console.log('press', this.x, this.y);

    for (var i = 0, len = this.clickStartEvent.path.length; i < len; i++) {
      var $element = this.clickStartEvent.path[i], hash;
      if ($element.getAttribute) {
        this.triggerElement = $element;

        if ($element.onPress) {
          $element.onPress.call($element);
          return;
        }

        if ($element.getAttribute('press')) {
          var href = $element.getAttribute('press');
          hash = $element.getAttribute('click');
          this.Router.parseHashCommand(href);
          return;
        }
      }
    }
  },
  triggerSlide: function() {
    var $path = this.clickStartEvent.path,
      info = {
        offset: this.offset,
        direction: this.direction,
        directionLock: this.directionLock,
        x: this.moving_x,
        y: this.moving_y,
        offsetX: this.moving_x - this.x_start,
        offsetY: this.moving_y - this.y_start
      };
    function recursion(start) {
      for (var i = start, len = $path.length; i < len; i++) {
        if ($path[i].onSlide) {
          returnValue = $path[i].onSlide(info);
          if (returnValue != 'pass') {
            this.triggerElement = $path[i];
            this.triggerIndex = i;
            return;
          }
        }
      }
      this.endSearchTriggerElement = true;
    };

    if (!this.endSearchTriggerElement)
      if (this.triggerElement === null) {
        recursion(0);
      } else {
        returnValue = this.triggerElement.onSlide(info);
        if (returnValue == 'pass')
          recursion(this.triggerIndex + 1);
      }
      // console.log('slide ' + this.direction + '  offset:' + this.offset);
  },
  triggerSlideDone: function() {
    var info = {
        offset: this.offset,
        direction: this.direction,
        directionLock: this.directionLock,
      },
      $path = this.clickStartEvent.path;

    for (var i = 0, len = $path.length; i < len; i++) {
      if ($path[i].onSlideDone) {
        returnValue = $path[i].onSlideDone(info);
        if (returnValue != 'pass') {
          return;
        }
      }
    }
  },
  triggerTap: function() {
    console.log('tap');
  },
  triggerFocus: function(focusElements){
    var needToFocusElements = [];

    focusElements.forEach(function (elem) {
      if (!this.lastFocusElements.includes(elem))
        needToFocusElements.push(elem);
    },this);

    needToFocusElements.every(function (elem) {
      if (elem.onFocus) {
        if(elem.onFocus.call(elem) == 'pass')
          return true;
      } else {
        var command = elem.getAttribute('focus');

        if (command)
          this.Router.parseCommand(command, elem);
      }
      return false;
    }, this);

    this.lastFocusElements = focusElements;
  },
  triggerBlur: function (focusElements){
    var needToBlurElements = [];
    this.lastFocusElements.forEach(function (elem) {
      if (!focusElements.includes(elem))
        needToBlurElements.push(elem);
    });

    needToBlurElements.every(function(elem){
      if(elem.onBlur){
        if(elem.onBlur.call(elem) == 'pass')
          return true;
      }else {
        var command = elem.getAttribute('blur');

        if (command)
          this.Router.parseCommand(command, elem);
      }
      
      return false;
    },this);
  },
  triggerEnter: function (overElement) {
    var needToEnterElements = [];

    overElement.forEach(function (elem) {
      if (!this.lastOverElements.includes(elem))
        needToEnterElements.push(elem);
    }, this);

    needToEnterElements.forEach(function (elem) {
      if (elem.onEnter) {
        elem.onEnter.call(elem);
      } else {
        var command = elem.getAttribute('enter');

        if (command) {
          this.Router.parseCommand(command, elem);
          return;
        }
      }
    });

    this.lastOverElements = overElement;
  },
  triggerLeave: function (overElement) {
    var needToLeaveElements = [];
    this.lastOverElements.forEach(function (elem) {
      if (!overElement.includes(elem))
        needToLeaveElements.push(elem);
    });

    needToLeaveElements.forEach(function (elem) {
      if (elem.onLeave) {
        elem.onLeave.call(elem);
      } else{
        var command = elem.getAttribute('leave');

        if (command) {
          this.Router.parseCommand(command, elem);
          return;
        }
      }
    });
  },
  triggerOver: function (overElement) {
    if (overElement.onOver)
      overElement.onOver.call(overElement);
    else{
      var command = overElement.getAttribute('over');

      if(command)
        this.Router.parseCommand(command, overElement);
    }
  },
  triggerPressStart: function () {
    for (var i = 0, len = this.clickStartEvent.path.length; i < len; i++) {
      var $element = this.clickStartEvent.path[i],
          command, checked = true;

      if ($element.getAttribute) {
        command = $element.getAttribute('pressing');

        if(command){
          this.Router.parseCommand(command,$element);
          this.pressingElement = $element;
          return 'pass';
        }
      }
    }
  },
  triggerPressEnd: function () {
    if (this.pressingElement){
      this.pressingElement.setAttribute('class', this.pressingElement.backupClass);
      this.pressingElement = null;
    }
  }
});

F.addComponent('Loader', {
  multiAsyncLoader: new MultiAsyncLoader,

  status: 'loaded',
  afterAction: function() {},
  beforeAction: function() {},

  $controllerCss: document.querySelector('#_cssContainer_ ._controller_'),
  $actionCss: document.querySelector('#_cssContainer_ ._action_'),
  $customCss: document.querySelector('#_cssContainer_ ._custom_'),
  $moduleCss: document.querySelector('#_cssContainer_ ._module_'),

  controllersCache: {},
  customJsCache: {},
  moduleJsCache: {},

  cssSwitchFunc: [],

  init: function() {
    var loadedFunc = function() {
      this.status = 'loaded';

      this.Page.initStatus();
      this.beforeAction();

      this.addComponent('controller', this.controllersCache[this.Router.controllerName], this.__proto__);

      if (this.controller.hasOwnProperty('commonAction') && !this.Router.isBack) {
        this.controller['commonAction'].call(this.__proto__, this.Router.actionConfig);
      }

      var forwardRefresh = this.Router.actionConfig.forwardRefresh;
      if (this.controller.hasOwnProperty('action' + this.Router.actionName) &&
        !this.Router.isBack &&
        ((forwardRefresh === true ||
            forwardRefresh === 'true') ||
          document.getElementById(location.hash).getAttribute('status') === 'loading'
        )) {
        this.controller['action' + this.Router.actionName].call(this.__proto__, this.Router.actionConfig);
      }

      if (this.controller.hasOwnProperty('viewUpdate' + this.Router.actionName))
        this.controller['viewUpdate' + this.Router.actionName].call(this.__proto__, this.Router.actionConfig);

      this.afterAction();
      this.Router.afterAction();
    }.bind(this);

    this.multiAsyncLoader.setAllLoadedFunc(function() {
      this.Loader.cssSwitch();
      document.querySelector('.pageContainer .page').setAttribute('id', this.Router.history[0]);
      
      loadedFunc();
      requestAnimationFrame(function(){
        setTimeout(function () {
          document.querySelector('.pageContainer').classList.remove('subNoneAnimation');
          document.querySelector('.pageContainer').style.opacity = 1;
        }, 30);
        console.log('首页加载成功~~send from 小小框架~~');
      }.bind(this));

      this.multiAsyncLoader.setAllLoadedFunc(loadedFunc);
    }.bind(this));

    window.addEventListener('DOMContentLoaded', this.multiAsyncLoader.loadPointAdd());
  },
  run: function() {
    this.status = 'loading';
    this.loadStart = (new Date).getTime();

    //加载css
    var viewPath = this.Router.moduleName + '/views/' + this.Router.controllerName,

      commonControlleCss = viewPath + '/controller.css',
      commonActionCss = viewPath + '/' + this.Router.actionName + '.css',
      commonJs = viewPath + '/controller.js';

    this.cssSwitchFunc = [];
    this.cssLoader(this.$actionCss, [commonActionCss]);
    this.cssLoader(this.$controllerCss, [commonControlleCss]);

    //加载js
    if (!this.controllersCache.hasOwnProperty(this.Router.controllerName)) {
      this.jsLoader(commonJs, this.multiAsyncLoader.loadPointAdd(function(rep) {
        var code = new Function('exports', rep),
          exports = {};

        this.controllersCache[this.Router.controllerName] = exports;
        code(exports);
        if (exports.deps) {
          if (exports.deps.css)
            this.cssLoader(this.$customCss, exports.deps.css);
          if (exports.deps.js)
            exports.deps.js.forEach(function(js) {
              if (this.customJsCache.hasOwnProperty(js.url)) {
                exports[js.name] = this.customJsCache[js.url];
              } else {
                this.jsLoader(js.url,
                  this.multiAsyncLoader.loadPointAdd(function(rep) {
                    var code = new Function('exports', rep),
                      exportsCustom = {};

                    code(exportsCustom);

                    this.customJsCache[js.url] = exportsCustom;
                    exportsCustom.__proto__ = this.__proto__;
                    exports[js.name] = exportsCustom;
                  }, this)
                );
              };
            }.bind(this));
        }
      }, this));
    } else {
      var controller = this.controllersCache[this.Router.controllerName];
      if (controller.deps && controller.deps.css)
        this.cssLoader(this.$customCss, controller.deps.css);
    }
  },
  cssSwitch: function() {
    this.cssSwitchFunc.forEach(function(func) {
      func();
    });
  },
  cssLoader: function(container, cssUriArr) {
    var unique = [];

    container.querySelectorAll('style').forEach(function(style) {
      style.setAttribute('check', '');
    });

    cssUriArr.forEach(function(cssUri) {
      var check = container.querySelector('style[name="' + cssUri + '"]');
      if (check) {
        check.removeAttribute('check');
      } else {
        unique.push(cssUri);
      }
    });

    var emptyStyles = container.querySelectorAll('style[check]');
    var uniqueLen = unique.length;

    emptyStyles.forEach(function(style, i) {
      if (i < uniqueLen) {
        style.removeAttribute('check');

        var args = {
          method: 'get',
          url: unique[i],
          func: this.multiAsyncLoader.loadPointAdd(function(rep) {
            this.cssSwitchFunc.push(function() {
              style.innerHTML = rep;
              style.setAttribute('name', unique[i]);
            }.bind(this));
            if (this.debug)
              console.log('one css loaded');
          }.bind(this)),
          error: function(errorCode) {
            if (this.debug)
              console.log(errorCode + ' when loading :' + args.url);
            args.func('');
          }.bind(this)
        };

        var xhr = Ajax(args);
      }
    }.bind(this));

    if (emptyStyles.length > unique.length) {
      this.cssSwitchFunc.push(function(){
        container.querySelectorAll('style[check]').forEach(function (style) {
          container.removeChild(style);
        });
      });
    } else {
      for (var i = emptyStyles.length; i < unique.length; i++) {
        ! function(i) {
          var style = document.createElement('style');
          style.setAttribute('type', 'text/css');
          style.setAttribute('name', unique[i]);
          var args = {
            method: 'get',
            url: unique[i],
            func: this.multiAsyncLoader.loadPointAdd(function(rep) {
              this.cssSwitchFunc.push(function() {
                style.innerHTML = rep;
                style.setAttribute('name', unique[i]);
              }.bind(this));
              if (this.debug)
                console.log('one css loaded');
            }.bind(this)),
            error: function(errorCode) {
              if (this.debug)
                console.log(errorCode + ' when loading :' + args.url);
              args.func('');
            }.bind(this)
          };
          var xhr = Ajax(args);
          container.appendChild(style);
        }.bind(this)(i);
      }
    }
  },
  jsLoader: function(url, func, optional) {
    optional = optional || false;
    var args = {
      method: 'get',
      url: url,
      func: func,
      optional: optional
    };
    Ajax(args);
  },
  moduleJsLoader: function() {
    var loader = new MultiAsyncLoader;
    loader.setAllLoadedFunc(this.multiAsyncLoader.loadPointAdd(function() {
      this.addComponent('module', this.moduleJsCache[this.Router.moduleName], this.__proto__);
    }.bind(this)));

    this.jsLoader(this.Router.moduleName + '/views/module.js', loader.loadPointAdd(function(rep) {
      var code = new Function('exports', rep),
        exports = { config: {} };

      this.moduleJsCache[this.Router.moduleName] = exports;
      code(exports);

      if (exports.deps) {
        if (exports.deps.css)
          this.cssLoader(this.$moduleCss, exports.deps.css);
        if (exports.deps.js)
          exports.deps.js.forEach(function(js) {
            if (this.moduleJsCache.hasOwnProperty(js.url)) {
              exports[js.name] = this.moduleJsCache[js.url];
            } else {
              this.jsLoader(js.url,
                loader.loadPointAdd(function(rep) {
                  var code = new Function('exports', rep),
                    exportsCustom = {};
                  code(exportsCustom);
                  this.moduleJsCache[js.url] = exportsCustom;
                  exports[js.name] = exportsCustom;
                  exportsCustom.__proto__ = this.__proto__;
                }, this)
              );
            };
          }.bind(this));
      }
    }, this), true);
  },
  addBeforeAction: function(func) {
    var oldBeforeAction = this.beforeAction;
    this.beforeAction = function() {
      oldBeforeAction();
      func();
    };
  }
});

F.addComponent('Router', {
  moduleName: null,
  controllerName: null,
  actionName: null,
  actionConfig: {},
  history: [],
  isBack: false,
  isRefreshed:false,
  refreshFrom:null,
  enable:true,
  lastViewStatus:null,

  afterAction: function() {
    if (this.isRefreshed) {

      if(this.isRefreshed == true){
        this.analysisUrl();
        
        var hash = location.hash,check;

        hash = hash.replace(/(viewPopUp=[^&]*&)/,'');
        hash = hash.replace(/(viewStatus=[^&]*&)/,'');
        check = hash.match(/\?(.*)/);

        if(check && check[1] == '')
          hash = hash.replace('?','');
        this.refreshFrom = location.hash;
        history.replaceState({},'',this.refreshFrom);
        this.hashProcesser();

        if(this.actionConfig.viewPopUp || this.actionConfig.viewStatus)
          this.isRefreshed = 'action';
        else
          this.isRefreshed = false;
        //需要去除viewPopUp或者viewStatus
      }

      if(this.isRefreshed == 'action'){
        var eventBind = this.Page.eventBind ;
        this.Page.eventBind = function(){
          eventBind.call(this);
          this.isRefreshed = false;
          history.replaceState({},'',this.refreshFrom);
          this.refreshFrom = null;
          this.hashProcesser();
        }.bind(this);
      }
    }
    if (this.actionConfig.multiClick === 'true' && location.hash.search(/\[reseted\]/) == -1) {
      location.hash += '[reseted]';
    }
  },
  hashProcesser: function() {
    if(!this.enable) return ;
    if (location.hash == '#back') {//弃用的,不过因为兼容旧的代码
      history.replaceState({}, '', this.history[this.history.length - 2]);
    }

    this.analysisUrl();
    if (location.hash.search(/\[reseted\]/) == -1 && location.hash != this.history[this.history.length - 1]) { //反正这真的是不适合这个拓展的方式
      var fromPage = null
          lastPage = this.analysisUrl(this.history[this.history.length - 1]);

      var lastViewStatusOut = function(){
        if (this.lastViewStatus && this.controller.hasOwnProperty('viewStatusOut' + this.lastViewStatus)) {
          this.controller['viewStatusOut' + this.lastViewStatus].call(this.__proto__, this.actionConfig);
          this.lastViewStatus = null;
        }
      }.bind(this);

      //先检查viewStatus
      if (lastPage.actionConfig.viewStatus && 
          this.actionName == lastPage.actionName &&
          this.controllerName == lastPage.controllerName
      ){
        this.lastViewStatus = this.history.pop().match('viewStatus=([^\&]*)')[1];
        
        if (location.hash.search(/viewStatus=/) >= 0 || 
          location.hash.search(/viewPopUp=/) >= 0) {
          fromPage = location.hash;
          history.go(-2);
          setTimeout(function() {
            location.hash = fromPage;
          }, 6);
        }else
          lastViewStatusOut();
        return;
      }

      if (this.actionConfig.viewUpdate == 'true') {
        this.isBack = true;
        this.Loader.run();
        history.replaceState({}, '', this.history[this.history.length - 1]);

      } else if (this.actionConfig.viewPopUp != null && this.isRefreshed !== 'action' ) { // 上层View的变化,实现mask
        if (location.hash == this.history[this.history.length - 2]) {
          //返回
          fromPage = this.history.pop();
          //检测上一个是否是popUp
          if (fromPage.search(/viewPopUp=/) >= 0) {
            this.popUpOut(fromPage);
            this.PopUp.historyTop();
          }
          this.isBack = true;
        } else {
          //前进
          fromPage = this.history[this.history.length - 1];
          this.isBack = false;

          lastViewStatusOut();
          
          this.history.push(location.hash);
          if (this.actionConfig.viewPopUp != null && !this.isBack &&
            this.controller.hasOwnProperty('viewPopUp' + this.actionConfig.viewPopUp)) {
            this.PopUp.initStatus();
            this.controller['viewPopUp' + this.actionConfig.viewPopUp].call(this.__proto__, this.actionConfig);
            this.PopUp.historyPush();
          }
        }
      } else if (this.actionConfig.viewStatus != null && this.isRefreshed !== 'action') {
        if(location.hash == this.history[this.history.length - 2]){
          this.isBack = true;
          fromPage = this.history.pop();
          this.Loader.run();
          this.pageSwitch(fromPage , this.history[this.history.length - 2]);
        }else{
          this.isBack = false;
          this.history.push(location.hash);

          lastViewStatusOut();

          if (this.controller.hasOwnProperty('viewStatusIn' + this.actionConfig.viewStatus)) {
            this.controller['viewStatusIn' + this.actionConfig.viewStatus].call(this.__proto__, this.actionConfig);
          }

        }
      } else { // 页面切换
        this.viewUpddateCount = 0;
        var isPopBack = false;
        if (location.hash == this.history[this.history.length - 2]) {
          //返回
          fromPage = this.history.pop();
          isPopBack = fromPage.search(/viewPopUp=/) >= 0;
          if (isPopBack)
            this.popUpOut(fromPage);
          this.isBack = true;
        } else {
          //前进
          if(lastPage.actionConfig.viewStatus)
            fromPage = this.history[this.history.length - 2];
          else
            fromPage = this.history[this.history.length - 1];
          this.isBack = false;
          this.history.push(location.hash);
        }
        // debugger;
        this.Loader.run();
        if (!isPopBack)
          this.pageSwitch(fromPage, location.hash);
      }
    }
  },
  init: function() {
    this.analysisUrl();
    if (location.hash == '' || this.actionName != 'Index' || this.controllerName != 'Home' || this.actionConfig.viewPopUp != null) {
      this.isRefreshed = true;
      // location.hash = '#Home/Index';
      this.actionName = 'Index';
      this.controllerName = 'Home';
    }

    if(location.hash == '')
      history.replaceState(null, null, '#Home/Index');
      
    this.history.push('#Home/Index');

    var params = this.urlParams(location.search);
    if (params.openid) {
      Object.defineProperty(this, 'openid', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: params.openid
      });
      delete params.openid;
      history.replaceState(null, null,
        this.moduleName + arrToUrlArg(params) + location.hash);
    }

    this.Loader.moduleJsLoader();
    this.Loader.run();
    window.addEventListener('popstate', this.hashProcesser.bind(this));
  },
  analysisUrl: function(hash) {
    var temp, href, uri = [],actionConfig;

    if(hash == null){
    temp = location.href.replace(location.protocol + '//' + location.host + '/', '');

    temp = (location.hash == '') ?
      temp.match(/([^?]+)(\?.*)?/i) :
      temp.match(/([^?]+)(\?.*)?#([^?]*)(\?.*)?/i);

    uri = temp[3] ?
      (temp[1] + '/' + temp[3]).split('/') :
      temp[1].split('/');
    
    }else{
      temp = hash.match(/#([^?]*)(\?.*)?/i);
      uri = temp[1].split('/');
      uri[2] = uri[1];
      uri[1] = uri[0];
      uri[0] = this.moduleName;
    }
    //格式规范
    uri[0] = uri[0];
    if (uri[1])
      uri[1] = firstLetterUp(uri[1]);
    if (uri[2])
      uri[2] = firstLetterUp(uri[2]);

    //缺省补全
    uri[1] = uri[1] || 'Home';
    uri[2] = uri[2] || 'Index';

    //处理queryString,这里不是发送给服务器 而是action的setting
    actionConfig = {};
    //一些常用的默认值设置
    actionConfig.forwardRefresh = (this.module.config.forwardRefresh === undefined) ? true : this.module.config.forwardRefresh;

    var parseParams = function(str) {
      str.slice(1).split('&').forEach(function(i) {
        var config = i.split('=');
        actionConfig[config[0]] = config[1];
      }.bind(this));
    }.bind(this);
    temp[2] && parseParams(temp[2]);
    temp[4] && parseParams(temp[4]);
    
    if(hash == null){
      this.moduleName = uri[0];
      this.controllerName = uri[1];
      this.actionName = uri[2];

      this.actionConfig = actionConfig;
    }else{
      return {
        moduleName: uri[0],
        controllerName: uri[1],
        actionName: uri[2],
        actionConfig:actionConfig
      }
    }
  },
  url: function(controllerName, actionName) {
    controllerName = controllerName || this.controllerName;
    actionName = actionName || this.actionName;
    return [this.moduleName, controllerName, actionName].join('/');
  },
  parseCommand:function(command,$element){
    if(this.parseCssCommand(command, $element))
      return;
    if (this.parseHashCommand(command, $element))
      return;
  },
  parseHashCommand: function (command){
    if(command == '#back'){
      history.back();
      return;
    }
    if (command == '#void'){
      return;
    }

    if (command[0] == '&') {
      var currentParams = this.urlParams(location.hash);
      var params = this.urlParams('?' + command.slice(1));
      for (var p in params)
        currentParams[p] = params[p];

      command = arrToUrlArg(currentParams);

      if (location.hash.indexOf('?') != -1)
        command = location.href.slice(0, location.href.indexOf('#')) +
          location.hash.slice(0, location.hash.indexOf('?')) +
          command;
      else
        command = location.href.slice(0, location.href.indexOf('#')) +
          location.hash +
          command;
    } else if (command[0] == '?'){
      if (location.hash.indexOf('?') != -1)
        command = location.href.slice(0, location.href.indexOf('#')) +
          location.hash.slice(0, location.hash.indexOf('?')) +
          command;
      else
        command = location.href.slice(0, location.href.indexOf('#')) +
          location.hash +
          command;
    }

    location.href = command;
    return true;
  },
  parseCssCommand: function (command, $element) {
    if (command[0] == '.' || command[0] == '|'){

      if (command[0] == '|' && $element.backupClass){
        $element.setAttribute('class',$element.backupClass);
        command = command.slice(1);
      }else
        $element.backupClass = $element.getAttribute('class');

      //想在这一层实现css class的变量
      var classes = command.split('.');

      classes.forEach(function(_class){
        if(_class != '')
        $element.classList.add(_class);
      });
      return true;
    }else
      return false;
  },
  reload: function() {
    this.Loader.multiAsyncLoader.allLoadedFunc();
    this.pageSwitch(this.history[this.history.length - 1], location.hash);
  },
  urlParams: function (url) {
    var params = {};
    if (url.indexOf("?") != -1) {
      url = url.slice(url.indexOf("?"));
      var str = url.substr(1),
          strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        params[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
      }
    }
    return params;
  },
  pageSwitch: function(fromPage, toPage) {
    var $fromPage = document.getElementById(fromPage),
      $toPage = document.getElementById(toPage),
      outAnimation = 'out',
      inAnimation = 'in',
      initial = 'initial',
      animationDoneTime = 280,
      isRefreshed = this.isRefreshed,
      fromPageOutFunc = this.Page.outViewUpdateFunc; //转存

    if (!$toPage) {
      $toPage = document.createElement('div');
      $toPage.setAttribute('id', toPage);
      $toPage.setAttribute('status', 'loading');
      document.querySelector('.pageContainer').appendChild($toPage);
    }
    outAnimation = this.Page.settings.outAnimation ||
      this.module.config.pageOutAnimation ||
      outAnimation;

    if (this.isBack) {
      outAnimation = this.Page.settings.backOutAnimation ||
        this.module.config.pageBackOutAnimation ||
        outAnimation;
    }

    $fromPage.classList.add(outAnimation);
    if(isRefreshed){
      $fromPage.classList.add('noneAnimation');
      animationTime = 0;
    }
    var t = setTimeout(function() {
      $fromPage.classList.add('pageCache');
      $fromPage.classList.remove('page', outAnimation);

      if(isRefreshed)
        $fromPage.classList.remove('noneAnimation');
      
      var showLoading = function() {
        var $loadingBox = strToDom(`
          <div class="loadingBox">
            <div class="scale">
              <div class="color"></div>
            </div>
          </div>
          `);

        // debugger;

        if(!this.isBack){
          $toPage.innerHTML = '';
          $toPage.appendChild($loadingBox);
          $toPage.classList.add('loading');
        }else{
          $toPage.classList.add('subNoneAnimation');
          $toPage.style.setProperty('opacity','0','important');
        }

        var restLoader = new MultiAsyncLoader,
          pageLoadFunc = this.Page.afterDomLoadFunc,
          loadAfterFunc = this.Loader.afterAction;

        restLoader.allLoadedFunc = function(){
          setTimeout(function(){
            this.Loader.cssSwitch();
            $toPage.classList.remove('loading');

            if(!this.isBack){
              this.appendDom($toPage, this.Page.rep);
              $toPage.setAttribute('status', 'loaded');

              this.Page.commonEventBind();
              this.Page.eventBind();
            }else{
              $toPage.style.setProperty('opacity', null);
              setTimeout(function(){
                $toPage.classList.remove('subNoneAnimation');
              },30);
            }

            this.Page.inViewUpdateFunc();

            delete restLoader;
          }.bind(this),250);
        }.bind(this);

        if (this.Loader.status == 'loading')
          this.Loader.afterAction = restLoader.loadPointAdd(function () {
            loadAfterFunc();

            if (this.Page.status == 'loading')
              this.Page.afterDomLoadFunc = restLoader.loadPointAdd(function () {
                pageLoadFunc();

                //这里弄退出动画咯
                $loadingBox.classList.add('out');
                this.Page.afterDomLoadFunc = pageLoadFunc;
              }, this);

            this.Loader.afterAction = loadAfterFunc;
          }, this);
        else {
          if (this.Page.status == 'loading')
            this.Page.afterDomLoadFunc = restLoader.loadPointAdd(function () {
              pageLoadFunc();
              
              //这里弄退出动画咯
              $loadingBox.classList.add('out');
              this.Page.afterDomLoadFunc = pageLoadFunc;
            }, this);
        }

      }.bind(this);

      fromPageOutFunc();

      $toPage.classList.add('noneAnimation', 'subNoneAnimation');
      initial = this.Page.settings.initial ||
        this.module.config.pageInitial ||
        initial;
      if (this.isBack) {
        initial = this.Page.settings.backInitial ||
          this.module.config.pageBackInitial ||
          initial;
      }

      $toPage.classList.add(initial, 'page');
      $toPage.classList.remove('pageCache');

      if (this.Loader.status == 'loaded' && this.Page.status == 'loaded') {
        this.Loader.cssSwitch();
        if (!this.isBack) {
          if (this.actionConfig.forwardRefresh === true ||
            this.actionConfig.forwardRefresh === 'true' ||
            $toPage.getAttribute('status') === 'loading'
          ) {
            this.appendDom($toPage, this.Page.rep);
            $toPage.setAttribute('status', 'loaded');

            this.Page.commonEventBind();
            this.Page.eventBind();
          }
        }
        this.Page.inViewUpdateFunc();
      } else 
          showLoading();

      inAnimation = this.Page.settings.inAnimation ||
        this.module.config.pageInAnimation ||
        inAnimation;

      if (this.isBack) {
        if (this.module.config.pageBackInAnimation)
          inAnimation = this.module.config.pageBackInAnimation;
        if (this.Page.settings.backInAnimation)
          inAnimation = this.Page.settings.backInAnimation;
      }

      setTimeout(function() {
        requestAnimationFrame(function() {
          $toPage.classList.remove('noneAnimation', 'subNoneAnimation');
          $toPage.classList.add(inAnimation);
        });
      }.bind(this), 30);

      setTimeout(function() {
        $toPage.classList.remove(inAnimation, initial);
      }.bind(this), animationDoneTime+20);
    }.bind(this), animationDoneTime);
  },
  popUpIn: function(fromPopUp) {
    var $fromPopUp = document.getElementById(fromPopUp),
      $popUpContainer = document.querySelector('.popUpContainer'),
      initial = this.PopUp.settings.initial || 'initial',
      inAnimation = this.PopUp.settings.inAnimation || 'in',
      outAnimation = this.PopUp.settings.outAnimation || 'out',
      position = this.PopUp.settings.position || 'center',
      settings = this.PopUp.settings,
      w_width = window.innerWidth,
      w_height = window.innerHeight,
      d_width, d_height, from_left, from_top, $div, $bgMask, origin_x, origin_y;

    // debugger;
    //所以这里是pop的加载任务都已经是准备好的了,这里是根据设置去做view的更新的~
    $popUpContainer.classList.remove('off');
    $popUpContainer.classList.add('on', 'subNoneAnimation','noneAnimation');

    //先在popUp占位置
    if (!$fromPopUp) {
      var $fromPopUp = document.createElement('div');
      $fromPopUp.setAttribute('id', fromPopUp);
      $fromPopUp.setAttribute('class', 'popUp off');
      $popUpContainer.appendChild($fromPopUp);
    }
    //设置初始化状态这是initial , 样式上面
    //dom填充
    $bgMask = $fromPopUp.querySelector('.bgMask');
    this.appendDom($fromPopUp, this.PopUp.rep);

    $div = $fromPopUp.firstElementChild;

    //事件绑定
    this.PopUp.eventBind();
    this.PopUp.inViewUpdateFunc($div);

    requestAnimationFrame(function(){
      //根据设置定位还有动画重心
      //是获取fromPopUp里面的第一个元素
      $popUpContainer.classList.remove('subNoneAnimation');
      $fromPopUp.classList.add('subNoneAnimation');
      $fromPopUp.classList.remove('off');
      $fromPopUp.classList.add('on');
      $div.classList.add(initial,'noneAnimation');
      d_width = $div.clientWidth;//这里是否有更好的方式来弄捏?不过这里出现layout也没问题这时候动画还没开始
      d_height = $div.clientHeight;//那掉帧原因在那里捏?

      // x:'center' y:'center'
      var x_center = function () {
        from_left = (w_width - d_width) / 2;
        $div.style['margin-left'] = from_left + 'px';
      }
      var y_center = function () {
        if ((d_height + 0.07 * w_height) < w_height) {
          from_top = (w_height - d_height) / 2;
          $div.style['margin-top'] = from_top + 'px';
        } else {
          $div.style['margin-top'] = 0.07 * w_height + 'px';
          $div.style['margin-bottom'] = 0.07 * w_height + 'px';
        }
      }
      if (position == 'center') {
        x_center();
        y_center();
        //重心居中,默认就是
        origin_x = origin_y = 'center';
      } else if (position == 'fromEdge') {
        //其实需要解析的是,是否含有-号,如果是有的话那么这个还以适合css不同的
        //但是还是可以使用居中咯~
        //先处理x
        if (settings.x)
          if (settings.x == 'center') {
            x_center();
          } else if (settings.x[0] == '-') {
            //右边
            $div.style['right'] = settings.x.slice(1);
            origin_x = 'right';
          } else { //不影响所使用css单位
            $div.style['left'] = settings.x;
            origin_x = 'left';
          }
        if (settings.y)
          if (settings.y == 'center') {
            y_center();
          } else if (settings.y[0] == '-') {
            $div.style['bottom'] = settings.y.slice(1);
            origin_y = 'bottom';
          } else { //不影响所使用css单位
            $div.style['top'] = settings.y;
            origin_y = 'top';
          }
      } else if (position == 'clickRelative') {
        //先写workflow

        //获取鼠标位置,这里需要Event帮忙

        //左右
        from_left = ((w_width - this.Event.x_start) > (d_width + 0.1 * w_width)) ?
          this.Event.x_start : this.Event.x_start - d_width;
        //上下
        from_top = ((w_height - this.Event.y_start) > (d_height + 0.1 * w_height)) ?
          this.Event.y_start : this.Event.y_start - d_height;

        origin_x = (from_left === this.Event.x_start) ? 'left' : 'right';
        origin_y = (from_top === this.Event.y_start) ? 'top' : 'bottom';

        $div.style['left'] = from_left + 'px';
        $div.style['top'] = from_top + 'px';
      }
      //设置动画重心
      if (settings.autoSetOrthocenter == true)
        $div.style['transform-origin'] = (origin_y + ' ' + origin_x);

      //生成layer
      $div.style['will-change'] = 'transform, opacity, top, left';
      //, width, height

      //mask需要放到同层来能使用z-index控制层级...
      
      if (!$bgMask) {
        $bgMask = document.createElement('div');
        $bgMask.setAttribute('class', 'bgMask');
        $fromPopUp.appendChild($bgMask);
      }
      $bgMask.onClickOnce = function () { history.back(); };
      
      $div.classList.remove('noneAnimation');
      requestAnimationFrame(function () {
        $fromPopUp.classList.remove('subNoneAnimation');
        
        requestAnimationFrame(function () {
          $div.classList.remove(initial);
          $bgMask.classList.add('on');
          $div.classList.add(inAnimation);

          if (settings.maskOnStyle)
            $bgMask.classList.add(settings.maskOnStyle);
        });
      });
    }.bind(this));
  },
  popUpOut: function(fromPopUp) {
    this.PopUp.historyPop();

    //上一个退出动画~
    var $fromPopUp = document.getElementById(fromPopUp),
      $bgMask = $fromPopUp.getElementsByClassName('bgMask')[0],
      $div = $fromPopUp.firstElementChild,
      $popUpContainer = document.querySelector('.popUpContainer'),
      initial = this.PopUp.settings.initial || 'initial',
      inAnimation = this.PopUp.settings.inAnimation || 'in',
      outAnimation = this.PopUp.settings.outAnimation || 'out';

    this.PopUp.outViewUpdateFunc($div);

    //mask off
    requestAnimationFrame(function() {
      $bgMask.classList.add('off');
      $bgMask.classList.remove('on');

      $div.classList.add(outAnimation);
      $div.classList.remove(inAnimation);
    });

    setTimeout(function() {
      requestAnimationFrame(function() {
        $fromPopUp.classList.add('off');
        $fromPopUp.classList.remove('on');

        requestAnimationFrame(function() {
          $fromPopUp.classList.add('subNoneAnimation');
          $bgMask.classList.remove('bgMask');
          this.PopUp.outAnimationDoneFunc();
          if (this.PopUp.historyStack.length == 0) {
            $popUpContainer.classList.remove('on');
            $popUpContainer.classList.add('subNoneAnimation', 'off');
            $div.classList.remove(outAnimation);
          }
        }.bind(this));
      }.bind(this));
    }.bind(this), 280);
  },
  popUp:function(name){
    location.hash = this.controllerName +'/'+ this.actionName +'?viewPopUp='+name;
  },
  appendDom: function ($to,$dom) {
    if ($dom instanceof HTMLElement) {
      $to.innerHTML = '';
      $to.appendChild($dom);
    } else if ($dom instanceof Array) {
      $to.innerHTML = '';
      $dom.forEach(function ($element) {
        $to.appendChild($element);
      });
    } else if (typeof $dom === 'string')
      $to.innerHTML = $dom;
  }
});

F.addComponent('Page', {
  status: 'loading',
  rep: '',
  eventBind: null,
  settings: {},
  commonEventBind: null,
  inViewUpdateFunc: null,
  outViewUpdateFunc: null,
  afterDomLoadFunc: function() {},
  initStatus: function() {
    rep = '';
    this.afterDomLoadFunc =
      this.eventBind =
      this.commonEventBind =
      this.inViewUpdateFunc =
      this.outViewUpdateFunc = function() {};
    this.settings = {};
  },
  config: function(settings) {
    this.settings = settings;
    // var settings = {
    //   inAnimation:'',
    //   backInAnimation:'',
    //   outAnimation:'',
    //   initial:''
    // };
  },
  switchToDom: function(dom) {
    this.status = 'loaded';
    this.rep = dom;
  },
  load: function(args) {
    this.status = 'loading';
    var func = args.func || function(rep){return rep;};

    args.func = function(rep) {
      this.status = 'loaded';
      this.rep = func(rep);
      this.afterDomLoadFunc();
      this.afterDomLoadFunc = function() {};
    }.bind(this);

    Ajax(args);
  }
});

F.addComponent('PopUp', {
  status: 'loading',
  rep: '',
  eventBind: null,
  settings: {},
  historyStack: [],
  inViewUpdateFunc: null,
  outViewUpdateFunc: null,
  outAnimationDoneFunc:null,
  afterDomLoadFunc: function() {},
  init:function(){
    this.Event.addTrigger('click',
      function(){
        return (this.Router.actionConfig.viewPopUp != null)? true : false;
      }.bind(this),
      function($element){
        var popUpClick = $element.getAttribute('popUpClick'),
            onPopUpClick = $element.onPopUpClick,
            triggerElement = this.Event.triggerElement;
        if(popUpClick || onPopUpClick){
          if(onPopUpClick){
            setTimeout(function(){
              //还原一下执行状态,唉执行流不是一般混乱啊
              this.Event.triggerElement = triggerElement;
              onPopUpClick.call($element);
              this.Event.triggerElement = null;
            }.bind(this), 20);
          }else if (popUpClick) {
            setTimeout(function () {
              this.Event.triggerElement = triggerElement;
              this.Router.parseHashCommand(popUpClick);
              this.Event.triggerElement = null;
            }.bind(this), 20);
          }
          history.back();
        }else
          return 'pass';
      }.bind(this));
  },
  initStatus: function() {
    this.afterDomLoadFunc =
      this.eventBind =
      this.inViewUpdateFunc =
      this.outAnimationDoneFunc = 
      this.outViewUpdateFunc = function() {};
    this.settings = {};
  },
  config: function(settings) {
    this.settings = settings;
    // var setting = {
    //   position:'fromEdge', // clickRelative center
    //   x:'123',            // -123 123 12% -12%
    //   y:'123',           // -123 123 12% -12%
    //   inAnimation:'',//这个和那边是一样的咯~
    //   outAnimation:'',
    //   initial:''
    //   autoSetOrthocenter:false
    // };
  },
  set:function(type,value){
    this.historyStack[this.historyStack.length-1][type] = value;
  },
  switchToDom: function(dom) {
    this.status = 'loaded';
    this.rep = dom;
    this.afterDomLoadFunc();
    this.afterDomLoadFunc = function() {};
    setTimeout(function(){//避免active无法触发
      this.Router.popUpIn(this.Router.history[this.Router.history.length - 1]);
    }.bind(this),35);
  },
  load: function(args) {
    var func = args.func;
    this.status = 'loading';

    if(func instanceof Function == false)
      func = function(rep){return rep;};

    args.func = function (rep) {
      this.rep = func(rep);
      this.status = 'loaded';
      this.afterDomLoadFunc();
      this.afterDomLoadFunc = function() {};
      setTimeout(function () {
        this.Router.popUpIn(this.Router.history[this.Router.history.length - 1]);
      }.bind(this), 35);
    }.bind(this);

    Ajax(args);
  },
  historyPush: function() {
    this.historyStack.push({
      status: this.status,
      rep: this.rep,
      eventBind: this.eventBind,
      settings: this.settings,
      historyStack: this.historyStack,
      inViewUpdateFunc: this.inViewUpdateFunc,
      outViewUpdateFunc: this.outViewUpdateFunc,
      outAnimationDoneFunc: this.outAnimationDoneFunc
    });
  },
  historyPop: function() {
    var status = this.historyStack.pop();
    this.status = status.status,
      this.rep = status.rep,
      this.eventBind = status.eventBind,
      this.settings = status.settings,
      this.historyStack = status.historyStack,
      this.inViewUpdateFunc = status.inViewUpdateFunc,
      this.outViewUpdateFunc = status.outViewUpdateFunc,
      this.outAnimationDoneFunc = status.outAnimationDoneFunc
  },
  historyTop: function() {
    var status = this.historyStack[this.historyStack.length - 1];
    this.status = status.status,
      this.rep = status.rep,
      this.eventBind = status.eventBind,
      this.settings = status.settings,
      this.historyStack = status.historyStack,
      this.inViewUpdateFunc = status.inViewUpdateFunc,
      this.outViewUpdateFunc = status.outViewUpdateFunc,
      this.outAnimationDoneFunc = status.outAnimationDoneFunc
  }
});

function MultiAsyncLoader() {
  var loadedCount = 0;
  var needToLoadCount = 0;
  this.allLoadedFunc = function(){};

  this.loadPointAdd = function(thisLoadedFunc, that) {
    needToLoadCount++;
    thisLoadedFunc || (thisLoadedFunc = function() {});
    that || (that = null);

    return function() {
      thisLoadedFunc.apply(that, arguments);
      loadedCount++;
      if (loadedCount === needToLoadCount)
        this.allLoadedFunc();
    }.bind(this);
  };

  this.setAllLoadedFunc = function(func) {
    this.allLoadedFunc = func;
  };

  this.init = function() {
    loadedCount = needToLoadCount = 0;
  }
}

function Ajax(args) {
  var method = args['method'],
    url = args['url'],
    arg = args['arg'] || null,
    data = args['data'] || '',
    func = args['func'] || function() {},
    error = args['error'] || function() {},
    cache = args['cache'] || false,
    optional = args['optional'] || false;

  function toJson(arr) {
    var temp = [];
    arr.forEach(function(value, i) {
      temp[i] = (typeof value == 'object') ? JSON.stringify(value) : value;
    });
    return temp;
  }
  var ids = toJson([method, url, arg, data]);

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    function cacheFunc() {
      if (window.AjaxCache[ids[0]] === undefined)
        window.AjaxCache[ids[0]] = {};
      if (window.AjaxCache[ids[0]][ids[1]] === undefined)
        window.AjaxCache[ids[0]][ids[1]] = {};
      if (window.AjaxCache[ids[0]][ids[1]][ids[2]] === undefined)
        window.AjaxCache[ids[0]][ids[1]][ids[2]] = {};

      window.AjaxCache[ids[0]][ids[1]][ids[2]][ids[3]] = {
        status: xhr.status,
        responseText: xhr.responseText
      };
    }
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status <= 207)) {
        func(xhr.responseText);
        if (cache) cacheFunc();
      } else {
        error(xhr.status, xhr.statusText, xhr.responseText);
        if (optional) {
          func('');
        }
      }
      //把404的拦截下来就可以了,现在只能用全部变量了,就是浏览器缓存不了的东西
      if (method == 'get' && xhr.status == 404)
        cacheFunc();

    }
  };
  //先查找缓存
  function checkCahce() {
    if (window.AjaxCache[ids[0]] === undefined)
      return false;
    if (window.AjaxCache[ids[0]][ids[1]] === undefined)
      return false;
    if (window.AjaxCache[ids[0]][ids[1]][ids[2]] === undefined)
      return false;
    if (window.AjaxCache[ids[0]][ids[1]][ids[2]][ids[3]] === undefined)
      return false;
    return true;
  }
  if (!checkCahce()) {
    xhr.onabort = xhr.onerror = error;
    if (!arg)
      xhr.open(method, url, true);
    else
      xhr.open(method, url + arrToUrlArg(arg), true);
    xhr.send(data);
  } else {
    xhr = window.AjaxCache[ids[0]][ids[1]][ids[2]][ids[3]];
    if (xhr.status == 404) {
      var t = setTimeout(function() {
        error(xhr.status);
      }, 0);
    } else if (xhr.status >= 200 &&
      xhr.status <= 207) {
      var t = setTimeout(function() {
        func(xhr.responseText);
      }, 0);
    }
  }
  return xhr;
}

function arrToUrlArg(obj) {
  var arg = '?';
  for (var p in obj)
    arg += p + '=' + obj[p] + '&';
  return arg.slice(0, -1);
}

window.widget = {
  add: function(name, constructor) {
    constructor.prototype = this;
    this[name] = constructor;
  }
};

//这部分是utility,现在大部分是之前旧的函数,之后慢慢重写~~~
function firstLetterUp(str) {
  str = str[0].toUpperCase() + str.substr(1);
  return str;
}
function css(elem, style) {
  for (var p in style)
    elem.style[p] = style[p];
}
function checkIn(arg, arr) {
  for (var i = 0; i < arr.length; i++)
    if (arr[i] == arg)
      return true;
  return false;
}
function strToDom(str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  return div.firstElementChild;
}
function dump(dom) {
  for (var p in dom)
    console.log(p + ':' + dom[p]);
}
function $(elem) {
  return document.getElementById(elem);
}
function $$(elem) {
  return document.getElementsByClassName(elem);
}