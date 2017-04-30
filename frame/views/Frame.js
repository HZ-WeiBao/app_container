var F = {
  error: function(code, event) {
    var codeToMeans = [
      '初始化失败',
      '我也不知道是什么错误~~', //前端的错误处理还没有统一想好
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

window.AjaxCache = {}; //感觉是Ajax的设计不够长远啊~

//Loader
F.addComponent('Loader', {
  multiAsyncLoader: new MultiAsyncLoader,
  debug: false,

  //time
  status: 'loaded', //loading loaded
  loadStart: null,
  loadEnd: null,
  afterAction: function() {},
  beforeAction: function() {},

  //dom
  $controllerCss: document.querySelector('#_cssContainer_ ._controller_'),
  $actionCss: document.querySelector('#_cssContainer_ ._action_'),
  $customCss: document.querySelector('#_cssContainer_ ._custom_'),

  //js cache
  controllersCache: {}, //obj array js
  customJsCache: {}, //obj array还是存储在这里好了,挂载点是挂载到this.controller里面去的

  //等待css切换时候哦需要替换的css
  cssSwitchFunc: [],

  init: function() {
    var loadedFunc = function() {
      this.status = 'loaded';
      if (this.debug)
        console.log('css all load done : ' + this.status);
      this.loadEnd = (new Date).getTime();

      this.beforeAction();
      if (this.debug)
        console.log('load use time:' + (this.loadEnd - this.loadStart));

      this.addComponent('controller', this.controllersCache[this.Router.controllerName], this.__proto__);


      if (this.controller.hasOwnProperty('commonAction') && !this.Router.isBack)
        this.controller['commonAction'].call(this.__proto__, this.Router.actionConfig);

      if (this.controller.hasOwnProperty('action' + this.Router.actionName) && !this.Router.isBack) {
        try {
          this.controller['action' + this.Router.actionName].call(this.__proto__, this.Router.actionConfig);
        } catch (e) {

        }
      }

      if (this.controller.hasOwnProperty('viewUpdate' + this.Router.actionName))
        this.controller['viewUpdate' + this.Router.actionName].call(this.__proto__, this.Router.actionConfig);

      if (this.debug)
        console.log('load done~');

      this.afterAction();
      this.Router.afterAction();
    }.bind(this);

    this.multiAsyncLoader.setAllLoadedFunc(function() {
      //执行的页面初始化的init公用的initfunc,这个initfunc应该放在哪里好捏?
      //这个其实基本上不会再去复用的东西,我就直接卸载这里好了
      this.Loader.cssSwitch();
      setTimeout(function() {
        document.querySelector('.pageContainer').classList.remove('noneAnimation');
        document.querySelector('.pageContainer').style.opacity = 1;
      }, 35);
      console.log('首页加载成功~~send from 小小框架~~');

      document.querySelector('.pageContainer .page').setAttribute('id', this.Router.history[0]);

      loadedFunc();

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
        var code = new Function('exports', rep);

        this.controllersCache[this.Router.controllerName] = {},
          exports = this.controllersCache[this.Router.controllerName];

        code(exports);
        //然后读取deps,并且查询是否已经加载完成
        if (exports.deps) {
          if (exports.deps.css) //css可以完全不做查询因为是怎量加载的
            this.cssLoader(this.$customCss, exports.deps.css);
          if (exports.deps.js)
            exports.deps.js.forEach(function(js) {
              if (this.customJsCache.hasOwnProperty(js.url)) {
                //直接挂在到this.controller.__proto__里面去,其实问题都不大,只是如果挂接在F.里面可以复用一下,但是基本上一次是储存,基本上都吧这些deps当作独立的使用,名字也是自己确定的
                //还是挂接在controller里面,反正浏览器有缓存
                //不行啊这个挂接不应该放在这时候弄的,等等这时候controller已经是挂接了,所以啊我就挂接在缓存的controller咯
                exports[js.name] = this.customJsCache[js.url];
              } else {
                this.jsLoader(js.url,
                  this.multiAsyncLoader.loadPointAdd(function(rep) {
                    //感觉是需要做一些作用域的引用缓存的
                    var code = new Function('exports', rep),
                      exportsCustom = {};

                    code(exportsCustom);

                    this.customJsCache[js.url] = exportsCustom;
                    exports[js.name] = exportsCustom;

                  }, this)
                );
              };
            }.bind(this));
        }
      }, this));
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
        //如果已经有的话 mark
        check.removeAttribute('check');
      } else {
        unique.push(cssUri);
      }
    });

    var emptyStyles = container.querySelectorAll('style[check]');

    emptyStyles.forEach(function(style, i) {
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
    }.bind(this));

    if (emptyStyles.length > unique.length) {
      container.querySelectorAll('style[check]').forEach(function(style) {
        container.removeChild(style);
      });
    } else {
      for (var i = emptyStyles.length; i < unique.length; i++) {
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute('name', unique[i]);
        ! function(i) {
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
  jsLoader: function(url, func) {
    var xhr = Ajax({
      method: 'get',
      url: url,
      func: func
    }); //在想这一层有什么用.....就是封装了一个get而已.....其他都是转发,算了
  }
});

//class Router
F.addComponent('Router', {
  moduleName: null, //string
  actionName: null, //string
  actionConfig: {},
  preHash: null,
  history: [],
  isBack: false,

  afterAction: function() {
    if (this.preHash) {
      location.hash = this.preHash;
      this.hashProcesser();
      this.preHash = null;
    }
    if (this.actionConfig.multiClick === 'true' && location.hash.search(/\[reseted\]/) == -1) {
      location.hash += '[reseted]';
    }
  },
  hashProcesser: function() {
    if (location.hash == '#back') {
      // hash = this.pageIdDecode();
      // hash = '#'+hash[1]+'/'+hash[2];
      history.replaceState({}, '', this.history[this.history.length - 2]);
    }

    this.analysisUrl();
    if (location.hash.search(/\[reseted\]/) == -1 && location.hash != this.history[this.history.length - 1]) { //反正这真的是不适合这个拓展的方式|| this.preHash
      var fromPage = null;
      if (this.actionConfig.viewUpdate != 'true') {
        this.viewUpddateCount = 0;
        if (location.hash == this.history[this.history.length - 2]) {
          //返回
          fromPage = this.history.pop();
          this.isBack = true;
        } else {
          //前进
          fromPage = this.history[this.history.length - 1];
          this.isBack = false;
          this.history.push(location.hash);
        }

        this.Loader.run();

        this.pageSwitch(
          fromPage,
          location.hash);
      } else {
        this.isBack = true;
        this.Loader.run();
        //hash的还原
        // hash = this.pageIdDecode(this.history[this.history.length-1]);
        // hash = '#'+hash[1]+'/'+hash[2];
        history.replaceState({}, '', this.history[this.history.length - 1]);
      }
    }
  },
  init: function() {
    //因为知道Router获取资源只会是使用一个multiAsyncLoader就可以咯
    //即便是在前一次hashchange没加载完之前,触发另一个hashchange,前一次加载的内容都会进行缓存,因为请求已经发送了
    //但是最后触发的action只是当前的action,相当于action切换等于终止取消前一个action的执行~~~~~
    //如果这时候是在actionReset的时候初始化的,默认重置去首页
    this.analysisUrl();
    if (location.hash == '' || this.actionName != 'Index' || this.controllerName != 'Home') {
      this.preHash = location.hash;
      location.hash = '#Home/Index';
      this.actionName = 'Index';
      this.controllerName = 'Home';
    }
    this.history.push('#Home/Index');

    setTimeout(function() { //再次脱离本执行流之后执行
      window.addEventListener('popstate', this.hashProcesser.bind(this));
    }.bind(this), 0);

    this.Loader.run();
  },
  analysisUrl: function() {
    var temp = location.href
      .replace('#', '/')
      .replace(location.protocol + '//' + location.host + '/', '')
      .match(/([^?]+)(\?.*)?/i), //默认还是去掉uri参数去处理~~不知道以后需不需要模拟正常的workflow
      uri = [];
    uri = temp[1].split('/');
    // uri[0] => modules
    // uri[1] => controllerName
    // uri[2] => actionName

    //格式规范
    uri[0] = uri[0];
    if (uri[1])
      uri[1] = firstLetterUp(uri[1]);
    if (uri[2])
      uri[2] = firstLetterUp(uri[2]);

    //缺省补全
    uri[1] = uri[1] || 'Home';
    uri[2] = uri[2] || 'Index';

    this.moduleName = uri[0];
    this.controllerName = uri[1];
    this.actionName = uri[2];

    //处理queryString,这里不是发送给服务器 而是action的setting
    this.actionConfig = {};
    if (temp[2]) {
      temp[2].slice(1).split('&').forEach(function(i) {
        var config = i.split('=');
        this.actionConfig[config[0]] = config[1];
      }.bind(this));
    }
  },
  url: function(controllerName, actionName) {
    controllerName = controllerName || this.controllerName;
    actionName = actionName || this.actionName;
    return [this.moduleName, controllerName, actionName].join('/');
  },
  pageSwitch: function(fromPage, toPage) {
    var $fromPage = document.getElementById(fromPage),
      $toPage = document.getElementById(toPage),
      outAnimation = 'out',
      inAnimation = 'in',
      fromPageOutFunc = this.Page.outViewUpdateFunc; //转存

    if (!$toPage) {
      $toPage = document.createElement('div');
      $toPage.setAttribute('id', toPage);
      document.querySelector('.pageContainer').appendChild($toPage);
    }
    $fromPage.classList.add(outAnimation);

    var t = setTimeout(function() {
      $fromPage.classList.add('pageCache');
      $fromPage.classList.remove('page', outAnimation);

      this.Loader.beforeAction = function() {
        if (this.Router.actionConfig.viewUpdate != 'true')
          this.Page.init();
      };

      var showLoading = function() {
        // $toPage.innerHTML = '<span>loading</span>';

        //等待动画
        var i = 0;
        $toPage.innerHTML = '<div class="loadingBox"><span style="color:#03a9f4;">.</span> . .</div>';
        var tLoading = setInterval(function() {
          var str = ['.', '.', '.'];
          if (++i == str.length)
            i = 0;
          str[i] = '<span style="color:#03a9f4;">.</span>'
          $toPage.innerHTML = '<div class="loadingBox"><b>' + str.join(' ') + '</b></div>';
        }, 150);

        var func = this.Page.afterDomLoadFunc;

        this.Page.afterDomLoadFunc = function() {
          clearInterval(tLoading);
          this.Loader.cssSwitch();
          $toPage.innerHTML = this.Page.rep;

          this.Page.inViewUpdateFunc();
          var t = setTimeout(function() {
            this.Page.commonEventBind();
            this.Page.eventBind();
          }.bind(this), 35);
        }.bind(this);
      }.bind(this);

      fromPageOutFunc();

      this.Loader.cssSwitch();
      $toPage.classList.add('initial', 'noneAnimation');

      if (this.Loader.status == 'loaded' && this.Page.status == 'loaded') {
        if (!this.isBack) {
          $toPage.innerHTML = this.Page.rep;
          console.log('page switched');
        }
        this.Loader.cssSwitch();
        this.Page.inViewUpdateFunc();
      } else if (this.Loader.status == 'loaded' && this.Page.status == 'loaded') {
        this.Page.inViewUpdateFunc();
      } else if (this.Loader.status == 'loading') {
        if (this.isBack) {
          $toPage.style.opacity = '0';
          this.Loader.beforeAction = function() {
            this.Loader.cssSwitch();
            $toPage.setAttribute('style', '');
            this.Loader.beforeAction = function() {}
          };
        } else {
          this.Loader.afterAction = function() {
            showLoading();
            this.Loader.afterAction = function() {}
          };
        }
      } else if (this.Page.status == 'loading') {
        showLoading();
      }

      $toPage.classList.remove('pageCache');

      setTimeout(function() {
        $toPage.classList.add('page', inAnimation);
      }.bind(this), 35);

      setTimeout(function() {
        $toPage.classList.remove(inAnimation, 'initial', 'noneAnimation');
        if (this.Loader.status == 'loaded' && this.Page.status == 'loaded') {
          this.Page.commonEventBind();
          this.Page.eventBind();
        }
      }.bind(this), 370);
    }.bind(this), 345);
  }
});

F.addComponent('Page', {
  status: 'loaded',
  rep: '',
  eventBind: null,
  commonEventBind: null,
  inViewUpdateFunc: null,
  outViewUpdateFunc: null,
  afterDomLoadFunc: function() {},
  init: function() {
    this.afterDomLoadFunc =
      this.eventBind =
      this.commonEventBind =
      this.inViewUpdateFunc =
      this.outViewUpdateFunc = function() {};
  },
  switchToDom: function(domStr) {
    this.status = 'loaded';
    this.rep = domStr;
  },
  load: function(args) {
    this.status = 'loading';
    var func = args.func;

    if (func) args.func = function(rep) {
      this.status = 'loaded';
      this.rep = func(rep);
      this.afterDomLoadFunc();
      this.afterDomLoadFunc = function() {};
    }.bind(this);
    else args.func = function(rep) {
      this.rep = rep;
      this.status = 'loaded';
      this.afterDomLoadFunc();
      this.afterDomLoadFunc = function() {};
    }.bind(this);

    Ajax(args);
  }
});

function MultiAsyncLoader() {
  var loadedCount = 0;
  var needToLoadCount = 0;
  var debug = false;
  var allLoadedFunc = function() { console.log('hi') };

  this.loadPointAdd = function(thisLoadedFunc, that) {
    needToLoadCount++;
    thisLoadedFunc || (thisLoadedFunc = function() {});
    that || (that = null);

    if (debug)
      console.log('增加了一个加载项~');
    return function() {
      if (debug)
        console.log('加载了一个,还需加载:' + (needToLoadCount - loadedCount));
      thisLoadedFunc.apply(that, arguments);
      //我想传进来的func里面的this访问现在这一层this,不通过传参,但是之前已经bind一个this的obj
      //所以想把func里面所bind的this提取出来加工一下
      loadedCount++;
      if (loadedCount === needToLoadCount) {
        allLoadedFunc();
        if (debug)
          console.log('所有东东都加载完成了,最后的func也触发了~~');
      }
    };
  };

  this.setAllLoadedFunc = function(func) {
    allLoadedFunc = func;
  };
  this.init = function() {
    loadedCount = needToLoadCount = 0;
  }
}

function Ajax(args) { //method,url,arg,content,func,要么就是干脆不是get就是post算了,但是之后怎样做restful,,真纠结,还是通用一些吧~~
  var method = args['method'],
    url = args['url'],
    arg = args['arg'] || null,
    data = args['data'] || '',
    func = args['func'] || function() {},
    error = args['error'] || function() {},
    cache = args['cache'] || false;

  function arrToUrlArg(obj) {
    var arg = '?';
    for (var p in obj)
      arg += p + '=' + obj[p] + '&';
    return arg.slice(0, -1);
  }

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

//控件
var widget = {
  add: function(name, constructor) {
    constructor.prototype = this;
    this[name] = constructor;
  }
};

//这部分是utility,现在大部分是之前的函数,之后慢慢重写~~~

//其实这些 应该是很少的,如果是十分多的都应该是打包成一个类的其实要么就是直接挂接在
function firstLetterUp(str) {
  // str = str.toLowerCase();
  str = str[0].toUpperCase() + str.substr(1);
  return str;
}

function css(elem, style) {
  for (var p in style) {
    elem.style[p] = style[p];
  }
}

function checkIn(arg, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == arg)
      return true;
  }
  return false;
}

function strToDom(str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  return div.firstElementChild;
}

function dump(dom) {
  for (var p in dom) {
    console.log(p + ':' + dom[p]);
  }
}

function maskOn(func) {
  css(document.querySelector('#mask'), {
    'display': 'block',
    'z-index': '100',

  });
  setTimeout(function() {
    css(document.querySelector('#mask'), {
      'opacity': '0.3'
    });
  }, 10);
  //禁止页面滚动
  // document.body.style.overflow='hidden';
  css(document.querySelector('#mask-blur'), {
    '-webkit-filter': 'blur(1.5px)',
    'filter': 'blur(1.5px)',
  });
  document.querySelector('#mask').onclick = function() {
    if (func) func();
    maskOff();
  };
  //至于mask使用的唯一性,只能通过自己注意一下
}

function maskOff() {
  css(document.querySelector('#mask'), {
    'opacity': '0'
  });
  setTimeout(function() {
    css(document.querySelector('#mask'), {
      'display': 'none',
      'z-index': '-10',
    });
  }, 300);
  // document.body.style.overflow='';
  css(document.querySelector('#mask-blur'), {
    '-webkit-filter': 'blur(0px)',
    'filter': 'blur(0px)',
  });
}

function $(elem) {
  return document.getElementById(elem);
}

function $$(elem) {
  return document.getElementsByClassName(elem);
}