
"use strict";

var Router = {
  'rules':{
    '':function(){
      alert('here');
    }
  },
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
      if( this.rules[ location.hash.slice(1) ] ){
        this.rules[location.hash.slice(1)]();//注意匿名函数在传过来的时候就应该bind好~~
      }
    }.bind(this));
  }
};

Router.init();
//现在Router大致的方法就这么简单拉~
