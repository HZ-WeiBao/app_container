exports.deps = {
  'js': [
    {name:'slider', url:'littleChat/views/Widget/slider.js'}
  ]
};

exports.actionIndex = function () {
  
}

exports.viewPopUpMenu = function (config) { 
  // 一般写了viewPopUp就不要写action了
  // 还有一个问题,当跨controller的时候不要写在action.css或者controller.css
  // 需要写在custom.css好了
  // 在这里加载显示需要popup的东西咯~,其实获取这个信息的短信不是那么容易的咯~因为是分离了
  // 不过还是有传递的途径的~~
  this.PopUp.config({
    position:'clickRelative',
    x:'10vh',
    y:'-100px'
  });
  this.PopUp.switchToDom('\
    <ul class="pressMenu">\
      <li>标为未读</li>\
      <li>置顶聊天</li>\
      <li>删除该聊天</li>\
    </ul>\
  ');
  //但是一般是通过事件绑定的,那么这个又怎样做捏?无论是使用那个都是那样的呀,我觉得clickonce也提添加进去吧
}
