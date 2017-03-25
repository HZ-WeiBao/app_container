
exports.deps = {
  'js':[
    {name:'custom1', url:'emptyClass/views/Home/custom1.js'}
  ]
};

exports.actionIndex = function(){
  //一般首页是没有东西需要执行的,但是也可以干点其他事情滴~~
  //如果是action一般是不会去设置什么东西但是是需要有默认的切换事件的
  this.Loader.cssSwitch();
  setTimeout(function(){
    document.querySelector('.module_body').classList.remove('noneAnimation');
    document.querySelector('.module_body').style.opacity = 1;
  },0);
  console.log('首页加载成功~~send from 小小框架~~');
}

exports.actionQuery = function(){
  

}