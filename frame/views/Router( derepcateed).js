//Router将会接管hash的变化事件,然后只要Router.regiter('name',function(){});
//不过现在的功能还是很少仅仅是相当于一个if语句判断而已
//突然好像感觉到这样职责分离的好处,但我想要拓展这个Hash的路由层次,那么我就变成十分简单了

"use strict";

var Router = {
  'rules':{},
  'register':function(hash,func){//注意bind好this啊
    this.rules[hash] = func;
  },
  'unregiter':function(hash){
    this.rules[hash] = null;
  },
  'init':function(){
    window.addEventListener('hashchange',function(){
      //这里可以访问Router内部的东西吗?这些之前试过但是还是不记得了真的js里面的函数作用于真的会染人混淆的
      //果然挂载到事件里面的的函数都是这样的
      //loaction.hash 默认是带上#的
      var uri = location.hash.slice(1);
      if( this.rules[ uri ] ){
        this.rules[uri].call();//注意匿名函数在传过来的时候就应该bind好~~
      }
    }.bind(this));

    //check hash
    if(location.hash != ''){
      var uri = location.hash.slice(1);
      if( this.rules[ uri ] ){
        this.rules[uri].call();//注意匿名函数在传过来的时候就应该bind好~~
      }
    }
  }
};
//注册到Frame里面去执行
F.init(Router.init);

function Swtich(from, to, animation){
  //form dom 节点到to append的节点,默认是insert form节点的后面
  animation = animation || 'base';
  from.classList.add(animation+'out');
  setTimeout(function(){
    to.parentNode.insertBefore(to);
    to.classList.add(animation+'in');
  },800);
}

//动画切换的接口就是这么简单~~~,但是对比以前是有质的飞跃~~

//还是回到之前的开发方式,没错就是注释多余到吗,哈哈~~~~

//我觉得,还是先自己转一下应用吧~~~比在这里空想好得多

//其实这个和添加onclik事件没有什么区别,只不过接口统一起来了

//先写实例,然后再去抽象~~~,然后再写实例,再抽象

function firstLetterUp(str){
  str = str.toLowerCase();
  str = str[0].toUpperCase()+str.substr(1);
  return str;
}

function loader(){
  this.customCssList = [];
  this.customJsList = [];

  this.cssLoader = document.querySelector('#_cssloader_');
  this.jsLoader = document.querySelector('#_jsloader_');

  this.path = null;
  
  this.run = function (){
    this._getPath();

    //load css
    this._commonload('controller','css');
    this._commonload('action','css');
    this._customLoad(this.customCssList,'css');
    
    //load js
    this._customLoad(this.customJsList,'js');//你看,这传参是有明显的重复的啊,唉
    this._commonload('controller','js');
    this._commonload('action','js');

    //finish load
    this.customCssList = [];
    this.customJsList  = [];
  };

  this.load = function(uri, type, useModule){
    if(useModule)
      uri = this.path.module+uri;
    
    if(type == 'css'){
      this.customCssList.push(uri);
    }else if(type == 'js'){
      this.customJsList.push(uri); 
    }
  };

  this._getPath = function (){
    var uri = location.href
              .replace('#','/')
              .replace(location.protocol+'//'+location.host+'/','')
              .split('/');
    // uri[0] => modules
    // uri[1] => controller
    // uri[2] => action
    
    //格式规范
    uri[0] = uri[0].toLowerCase();
    if(uri[1])
      uri[1] = firstLetterUp(uri[1]);
    if(uri[2])
      uri[2] = firstLetterUp(uri[2]);

    //缺省补全
    uri[1] = uri[1] || 'Home';
    uri[2] = uri[2] || 'Index';

    if(uri[1][uri[1].length-1] == '_'){
      uri[0] = 'frame';
      uri[1] = uri[1].slice(0,-1);
    }

    //不全views
    uri[3] = uri[2];
    uri[2] = uri[1];
    uri[1] = 'views';

    var actionPath = uri.join('/');

    uri[3] = 'controller';
    var controllerPath = uri.join('/');

    this.path = {
      controller:controllerPath,
      action:actionPath,
      module:uri[0]+'/views',//or frame
    };
  }
  this._commonload = function (level, type){
    if(type == 'css'){
      var loader = this.cssLoader;
      var tag = 'link';
    }else if(type == 'js'){
      var loader = this.jsLoader;
      var tag = 'script';
    }

    var levelDom = loader.querySelector('._'+level+'_');
    var typeDom = loader.querySelector('._'+level+'_ '+tag);

    if(typeDom){
      if(typeDom.getAttribute('src') != this.path[level]+'.'+type){
        if(type == 'css')
          typeDom.setAttribute('href',this.path[level]+'.'+type);
        else if(type == 'js'){
          typeDom.setAttribute('src',this.path[level]+'.'+type);
          typeDom.setAttribute('defer',true);
        }
      }
    }else{
      var dom = document.createElement(tag);

      if(type == 'css'){
        dom.setAttribute('type','text/css');
        dom.setAttribute('rel','stylesheet');
        dom.setAttribute('href',this.path[level]+'.'+type);
      }else{
        dom.setAttribute('type',"text/javascript");
        dom.setAttribute('src',this.path[level]+'.'+type);
        dom.setAttribute('defer',true);
      }
      levelDom.appendChild(dom);
    }
  }
  this._customLoad = function (arr,type){
    if(type == 'css'){
      var loader = this.cssLoader;
      var tag = 'link';
    }else if(type == 'js'){
      var loader = this.jsLoader;
      var tag = 'script';
    }
    
    var levelDom = loader.querySelector('._custom_');
    levelDom.innerHTML = '';
    //加载数据
    for(var i=0; i < arr.length; i++){
      var dom = document.createElement(tag);
      
      if(type == 'css'){
        dom.setAttribute('type','text/css');
        dom.setAttribute('rel','stylesheet');
        dom.setAttribute('herf',arr[i]);
      }else{
        dom.setAttribute('type',"text/javascript");
        dom.setAttribute('src',arr[i]);
        dom.setAttribute('defer',true);
      }
      levelDom.appendChild(dom);
    }

  }
}

var Loader = new loader;

// F.init(function(){Loader.run();});
// console.log(Loader.run);//为什Router.run不能进行传参捏??
F.init(Loader.run.bind(Loader));

var actionClass = {
  autoLoad:function(){//这是直接执行的

  },
  customLoad:function(){//这是配置

  }
};

var actionHome = {
  run:function(){
    this.__proto__ = actionClass;//动态继承咯

  },
  
};
