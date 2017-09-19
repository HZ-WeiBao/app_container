
exports.actionAbout = function () {
  this.Page.load({
    method:'get',
    url:this.Router.url(),
    func:function(rep){ return rep;}
  });
}

exports.actionNew = function () {
  this.Page.load({
    method:'get',
    url:this.Router.url(),
    func:function(rep){ return rep;}
  });
}

exports.actionAdd = function () {
  this.Page.load({
    method:'get',
    url:this.Router.url(),
    func:function(rep){ return rep;}
  });
}

exports.actionSetLabel = function () {
  this.Page.load({
    method:'get',
    url:this.Router.url(),
    func:function(rep){ return rep;}
  });
  this.Page.eventBind = function(){
    var $back = document.querySelector('.page .topBar .back');
    $back.clickCheck = function(){
      var changed = true;
      if(changed){
        setTimeout(function(){
          this.Router.popUp('Window');
        }.bind(this),0);
        return false;
      }else
        return true;
    }.bind(this)
  }.bind(this);
}

exports.actionAddFromContact = function () {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });

  this.Page.eventBind = function(){
    var $main = document.querySelector('.page .main');

    $main.appendChilds = function(childs){
      childs.forEach(function($child) {
        $main.appendChild($child);
      }, this);
    };

    $main.appendChilds(this.module.Emmet.make(`
    (
      div.item.segment[value=$key]{$key} + 
      (
        div.list.flex[click=$aboutLink pressing=".pressing"] > 
          ( 
            div.right > 
              img.icon[src="$avtar"]
          ) + ( 
            div.left > 
              div.name +
              div.wechat{$wechat}
          ) + (
            div.$btnClass{$btnWord}
          )
      ) *
    ) * 
    `,{

    }).parse());
  };
}

exports.viewPopUpBottomMenu = function(config){
  this.PopUp.config({
    position:'fromEdge',
    y:'-0px',
    x:'0px',
    maskOnStyle:'maskOn-lightdark',
    initial:'initial-slide-bottom',
    inAnimation:'in-slide-bottom',
    outAnimation:'out-slide-bottom'
  });
  this.PopUp.switchToDom(`
    <ul class="bottomMenu">
      <li><img src="/data/littleChat/friend-set-label-icon.png" alt="">设置备注及标签</li>
      <li><img src="/data/littleChat/friend-set-star-icon.png" alt="">标为星标朋友</li>
      <li><img src="/data/littleChat/friend-set-moment-icon.png" alt="">设置朋友圈权限</li>
      <li><img src="/data/littleChat/friend-send-card-icon.png" alt="">发送该名片</li>
      <li><img src="/data/littleChat/friend-complain-icon.png" alt="">投诉</li>
      <li><img src="/data/littleChat/friend-set-blacklist-icon.png" alt="">加入黑名单</li>
      <li><img src="/data/littleChat/friend-delete-icon.png" alt="">删除</li>
      <li><img src="/data/littleChat/friend-send-desktop-icon.png" alt="">添加到桌面</li>
    </ul>
  `);
};

exports.viewPopUpCall = function(config){
  this.PopUp.config({
    position:'center',
    maskOnStyle:'maskOn-dark'
  });
  this.PopUp.switchToDom(`
    <ul class="centerMenu">
      <li>呼叫</li>
    </ul>
  `);
};

exports.viewPopUpVideoCall = function(config){
  this.PopUp.config({
    position:'center',
    maskOnStyle:'maskOn-dark'
  });
  this.PopUp.switchToDom(`
    <ul class="centerMenu">
      <li>视频聊天</li>
      <li>语音聊天</li>
    </ul>
  `);
};

exports.viewPopUpWindow = function(config){
  this.PopUp.config({
    position:'center',
    maskOnStyle:'maskOn-dark'
  });
  this.PopUp.eventBind = function(){
    var $popUp_window = document.querySelector('.popUp .popUp-window'),
        $cancel = document.querySelector('.popUp .btn-cancel'),
        $confirm = document.querySelector('.popUp .btn-confirm');
    
    $cancel.onclick = function(){
      this.PopUp.set('outViewUpdateFunc',function(){
        history.back();//继续之前的操作
      });

      history.back();//这是关闭popUUp
    }.bind(this);

    $confirm.onclick = function(){
      this.PopUp.set('outViewUpdateFunc',function(){
        //保存数据
        console.log('saved~');
        history.back();
      });

      history.back();//这是关闭popUp
    }.bind(this);
  };
  this.PopUp.switchToDom(`
    <div class="popUp-window">
      <div class="content">
        <p>保存本次编辑?</p>
      </div>
      <div class="controllBar">
        <div class="btn-cancel">不保存</div>
        <div class="btn-confirm">保存</div>
      </div>
    </div>
  `);
};

exports.viewPopUpQrCode = function(config){
  this.PopUp.config({
    position:'center',
    maskOnStyle:'maskOn-lightdark'
  });
  this.PopUp.switchToDom(`
    <div style="padding:36px 26px;background:white;border-radius:4px;" clickOnce="#back">
      <div class="flex" style="align-items:center;">
        <img src="/data/littleChat/deepkolos-portrait.jpg" style="flex:0 0 57.5px;height:57.5px;width:57.5px">
        <div class="flex" style="padding-left:11px;width:158px;height:57.5px;flex:0 0 169px;align-items: center;">
          <div style="flex:auto;">
            <div style="font-size:17px;">
              <span>DeepKolos</span>
              <img src="/data/littleChat/man-icon.png" alt="" class="icon" style="width:16.5px;height:18.5px;position:relative;top:2px;"/>
            </div>
            <div class="description">广东 广州</div>
          </div>
        </div>
      </div>
      <img width="237px" height="237px" src="/data/littleChat/deepkolos-qrcode.png" alt=""/>
      <p class="description" style="text-align:center;">扫描上面的二维码图案, 加我微信</p>
    </div>
  `);
};

exports.viewPopUpSearch = function (config) {
  this.PopUp.config({
    position: 'fromEdge',
    x: '0px',
    y: '0px',
    inAnimation: 'in-zoom',
    outAnimation: 'out-slide-left',
    initial: 'initial-zoom'
  });

  this.PopUp.switchToDom(this.module.Emmet.make(
    `div[style="width:100vw;height:100vh;"] > (
      div.topBar.flex > ( 
        div.back[click="#back"] > 
          img[src="/data/littleChat/topbar-back-icon.png" alt=""]
        ) + (
          div.center.flex >
            div.inputBar.flex > (
              div.icon.search >
                img[src="/data/littleChat/search-small-icon.png" alt=""]
            ) + (
              input[type="text" class="input" placeholder="搜索"]
            ) + (
              div.icon.voice >
                img[src="/data/littleChat/voice-small-icon.png" alt=""]
            )
        )
      ) +
      div.main.withHalfOpacity
    `, {

    }).parse());
}