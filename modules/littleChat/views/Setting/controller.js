
exports.commonAction = function () {
  this.Page.load({
    method:'get',
    url:this.Router.url(),
    func:function(rep){ return rep;}
  });
}

exports.viewPopUpBottomMenu = function(config){
  this.PopUp.config({
    position:'fromEdge',
    y:'-0px',
    x:'0px',
    maskOnStyle:'maskOn-lightdark',
    inAnimation:'in-slide-bottom',
    outAnimation:'out-slide-bottom',
    initial:'initial-slide-bottom'
  });
  this.PopUp.switchToDom(`
    <ul class="bottomMenu">
      <li>分享二维码</li>
      <li>换个样式</li>
      <li>保存到手机</li>
      <li>扫描二维码</li>
    </ul>
  `);
};