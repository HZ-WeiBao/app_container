exports.deps = {
  'js': [
    // { name: 'slider', url: 'littleChat/views/Widget/slider.js' }
  ]
};

exports.actionIndex = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.viewPopUpBottomMenu = function (config) {
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
    <ul class="bottomMenu">
      <li>交易记录</li>
      <li popUpClick="#Wallet/PayManagement">支付管理</li>
      <li>支付安全</li>
      <li>帮助中心</li>
    </ul>
  `);
};

exports.actionChange = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.actionPayReceive = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.actionBankCard = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.actionQrReceive = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.viewPopUpQrReceiveBottomMenu = function (config) {
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
    <ul class="bottomMenu">
      <li>开启收款提示音</li>
    </ul>
  `);
};

exports.actionPayManagement = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.actionGroupReceive = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.actionFaceRedPacket = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.viewPopUpFaceRedPacketBottomMenu = function (config) {
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
    <ul class="bottomMenu">
      <li>收回剩余红包</li>
    </ul>
  `);
};

exports.actionCardBag = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}