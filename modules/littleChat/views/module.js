exports.deps = {
  'js': [
    {name:'Emmet', url:'littleChat/views/Tools/Emmet.js'},
    { name: 'Broswer', url:'littleChat/views/Widget/broswer.js'}
  ]
};

exports.config = { //一些module级别的默认值设置
  forwardRefresh: true,
  homePage:'#Main/Index'
  // pageInitial:'initial-slide-left',
  // pageInAnimation:'in-slide-left',
  // pageOutAnimation:'initial-slide-left-1-of-10',
  // pageBackInitial:'initial-slide-left-1-of-10',
  // pageBackInAnimation:'in-slide-left',
  // pageBackOutAnimation:'initial-slide-left'
}

exports.init = function() {
  var $viewport = document.querySelector('meta.__viewport__'),
    screenScaleRate;
  console.log('hello world');
  this.Broswer.init();
  
  //修正scale
  if(screen.width != 360 && 0){
    screenScaleRate = screen.width/360;
    $viewport.setAttribute('content', 'width=360,user-scalable=no, initial-scale=' + screenScaleRate + ', maximum-scale=' + screenScaleRate + ', minimum-scale=' + screenScaleRate);
  }

};