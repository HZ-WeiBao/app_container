exports.deps = {
  'js': [
    {name:'slider', url:'littleChat/views/Widget/slider.js'},
    {name:'scrollBar', url:'littleChat/views/Widget/scrollBar.js'}
  ],
  'css':[
    'littleChat/views/Widget/slider.css',
    'littleChat/views/Widget/scrollBar.css',
    // 'littleChat/views/Widget/pressMenu.css'
  ]
};


exports.actionIndex = function () {
  // window.onbeforeunload = function(){event.returnValue="确定?"};
  this.Page.load({
    method:'get',
    url:this.Router.url(),
    func:function(rep){return rep;}
  });

  this.Page.eventBind = function(){
    var $slider = document.querySelector('.page .slider'),
        $scrollBar = document.querySelector('.page .scrollBar'),
        $footer = document.querySelector('.page .footer'),
        $contactList = document.querySelector('.page .slider .contactList');

    this.controller.slider.parse($slider,{});

    $slider.onPageEnter(1, function(){
      $scrollBar.trunOn();
    });
    $slider.onPageLeave(1, function(){
      $scrollBar.trunOff();
    });
    $slider.handleOverflow = function(){
      return ;
    };
    $slider.generateCtrl($footer,[`
      <div class="flex-1-4 redDot">
        <div class="small-notification"></div>
        <div class="num-notification"></div>
        <div class="icon" style="background:url(/data/littleChat/bottom-bar-1-dark-icon.png);">
          <img style="opacity:1;" src="/data/littleChat/bottom-bar-1-icon.png" alt=""/>
        </div>
        <div class="text">微信</div>
      </div>`,`
      <div class="flex-1-4 redDot">
        <div class="small-notification"></div>
        <div class="num-notification"></div>
        <div class="icon" style="background:url(/data/littleChat/bottom-bar-2-dark-icon.png);">
          <img style="opacity:0;" src="/data/littleChat/bottom-bar-2-icon.png" alt=""/>
        </div>
        <div class="text">通讯录</div>
      </div>`,`
      <div class="flex-1-4 redNum">
        <div class="small-notification"></div>
        <div class="num-notification">1</div>
        <div class="icon" style="background:url(/data/littleChat/bottom-bar-3-dark-icon.png);">
          <img style="opacity:0;" src="/data/littleChat/bottom-bar-3-icon.png" alt=""/>
        </div>
        <div class="text">发现</div>
      </div>`,`
      <div class="flex-1-4">
        <div class="small-notification"></div>
        <div class="num-notification"></div>
        <div class="icon" style="background:url(/data/littleChat/bottom-bar-4-dark-icon.png);">
          <img style="opacity:0;" src="/data/littleChat/bottom-bar-4-icon.png" alt=""/>
        </div>
        <div class="text">我</div>
      </div>
    `],{
      onSlide:function($from ,$to , percentage){
        var r_to   = 192 - (192-69)*percentage,
            b_to   = 192 - (192-38)*percentage,
            r_from = 192 - (192-69)*(1-percentage),
            b_from = 192 - (192-38)*(1-percentage),
            $from_text = $from.querySelector('.text'),
            $to_text = $to.querySelector('.text'),
            $from_img = $from.querySelector('.icon img'),
            $to_img = $to.querySelector('.icon img');
        
        $from_text
          .style.color = 'rgb(' + parseInt(r_from) + ',192,' + parseInt(b_from) + ')';
        $to_text
          .style.color = 'rgb(' + parseInt(r_to) + ',192,' + parseInt(b_to) + ')';
        $from_img
          .style.opacity = 1 - percentage;
        $to_img
          .style.opacity = percentage;
      },
      onSlideDone:function($from ,$to){
        setTimeout(function(){
          $from.querySelector('.text')
            .style.color = 'rgb(192,192,192)';
          $to.querySelector('.text')
            .style.color = 'rgb(69,192,38)';
          $from.querySelector('.icon img')
            .style.opacity = 0;
          $to.querySelector('.icon img')
            .style.opacity = 1;
        },20);
      },
    });

    this.controller.scrollBar.init(
      $scrollBar,
      $scrollBar.querySelector('.showing-letter'),
      {
        scrollBarOffsetTop:45,
        scrollBarClientHeight:screen.height - 96
      }
    );//这是变成指定式 , 不能批量运作

    $scrollBar.onScroll = function(toLetter){
      var $segment = $contactList
            .querySelector('.segment[value="'+toLetter+'"]');

      if($segment)
        $contactList.scrollTop = $segment.offsetTop;
      else if(toLetter == '↑')
        $contactList.scrollTop = 0;
    };
  }.bind(this);
};

exports.viewPopUpPressMenu = function (config) { 
  // 一般写了viewPopUp就不要写action了
  // 还有一个问题,当跨controller的时候不要写在action.css或者controller.css
  // 需要写在custom.css好了
  // 在这里加载显示需要popup的东西咯~,其实获取这个信息的短信不是那么容易的咯~因为是分离了
  // 不过还是有传递的途径的~~
  var fromPressElement = this.Event.triggerElement;

  this.PopUp.config({
    position:'clickRelative',
    initial:'popUp-initial',
    inAnimation:'popUp-in',
    outAnimation:'popUp-out',
    autoSetOrthocenter:true
  });
  this.PopUp.switchToDom('\
    <ul class="pressMenu" onselectstart="window.event.returnValue=false" oncontextmenu="window.event.returnValue=false" ondragstart="window.event.returnValue=false" >\
      <li>标为未读</li>\
      <li>置顶聊天</li>\
      <li>删除该聊天</li>\
    </ul>\
  ');
  this.PopUp.inViewUpdateFunc = function(){
    if (fromPressElement)
      fromPressElement.classList.add('pressing');
  }
  this.PopUp.outViewUpdateFunc = function () {
    if (fromPressElement)
      fromPressElement.classList.remove('pressing');
  }
  //但是一般是通过事件绑定的,那么这个又怎样做捏?无论是使用那个都是那样的呀,我觉得clickonce也提添加进去吧
};

exports.viewPopUpPlusMenu = function (config) { 
  // 一般写了viewPopUp就不要写action了
  // 还有一个问题,当跨controller的时候不要写在action.css或者controller.css
  // 需要写在custom.css好了
  // 在这里加载显示需要popup的东西咯~,其实获取这个信息的短信不是那么容易的咯~因为是分离了
  // 不过还是有传递的途径的~~
  this.PopUp.config({
    position:'fromEdge',
    x:'-13px',
    y:'45px',
    initial:'popUp-initial',
    inAnimation:'popUp-in',
    outAnimation:'popUp-out',
    autoSetOrthocenter:true
  });
  this.PopUp.switchToDom(`
    <ul class="plusMenu" onselectstart="window.event.returnValue=false" oncontextmenu="window.event.returnValue=false" ondragstart="window.event.returnValue=false">
      <li popUpClick="#Group/New">
        <div class="icon" style="background:url(/data/littleChat/groupchat-icon.png);"></div>
        <div class="name">发起群聊</div>
      </li>
      <li popUpClick="#Friend/Add">
        <div class="icon" style="background:url(/data/littleChat/addFriend-icon.png);"></div>
        <div class="name">添加朋友</div>
      </li>
      <li>
        <div class="icon" style="background:url(/data/littleChat/scan-qr-icon.png);"></div>
        <div class="name">扫一扫</div>
      </li>
      <li popUpClick="#Wallet/PayReceive">
        <div class="icon" style="background:url(/data/littleChat/recieve-pay-icon.png);"></div>
        <div class="name">收付款</div>
      </li>
      <li popUpClick="#Broswer/Tab?url=https%3A%2F%2Fkf.qq.com%2Ftouch%2Fproduct%2Fwechat_app.html&title=%E5%B8%AE%E5%8A%A9%E4%B9%9F%E5%8F%8D%E9%A6%88">
        <div class="icon" style="background:url(/data/littleChat/help-feedback-icon.png);"></div>
        <div class="name">帮助与反馈</div>
      </li>
    </ul>
  `);
  //但是一般是通过事件绑定的,那么这个又怎样做捏?无论是使用那个都是那样的呀,我觉得clickonce也提添加进去吧
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
  this.PopUp.eventBind = function () {

  };
  this.PopUp.switchToDom(`
<div style="width:100%;height:100%;">
  <div class="topBar flex">
    <div class="back" click="#back">
      
    </div>
    <div class="center flex">
      <div class="inputBar flex">
        <div class="icon search">
          <img src="/data/littleChat/search-small-icon.png" alt="">
        </div>
        <input type="text" class="input" placeholder="搜索"/>
        <div class="icon voice">
          <img src="/data/littleChat/voice-small-icon.png" alt="">
        </div>
      </div>
      
    </div>
  </div>
  <div class="main" style="height:calc(100% - 45px);background:#f5f5f7;">
    <div class="searchMenu">
      <div class="description">搜索指定内容</div>
      <div class="type flex">
        <div click="&viewPopUp=SearchMoment">朋友圈</div><span></span>
        <div click="&viewPopUp=SearchArticle">文章</div><span></span>
        <div click="&viewPopUp=SearchOfficalAccounts">公众号</div>
      </div>
      <div class="type flex">
        <div click="&viewPopUp=SearchFiction">小说</div><span></span>
        <div click="&viewPopUp=SearchMusic">音乐</div><span></span>
        <div click="&viewPopUp=SearchEmoji">表情</div>
      </div>
      
      <div class="lookAround flex" click="&viewPopUp=LookAround">
        <img class="icon" src="/data/littleChat/look-around-icon.png" alt="">
        <div>看一看</div>
      </div>
    </div>
  </div>
</div>
  `);
};

exports.viewPopUpSearchMoment = function (config) {
  this.PopUp.config({
    position: 'fromEdge',
    x: '0px',
    y: '0px',
    inAnimation: 'in-zoom',
    outAnimation: 'out-slide-left',
    initial: 'initial-zoom'
  });
  this.PopUp.eventBind = function () {

  };
  this.PopUp.switchToDom(`
<div style="width:100%;height:100%;">
  <div class="topBar flex">
    <div class="back" click="#back">
      
    </div>
    <div class="center flex">
      <div class="inputBar flex">
        <div class="icon search">
          <img src="/data/littleChat/search-small-icon.png" alt="">
        </div>
        <input type="text" class="input" placeholder="搜索朋友圈"/>
        <div class="icon voice">
          <img src="/data/littleChat/voice-small-icon.png" alt="">
        </div>
      </div>
      
    </div>
  </div>
  <div class="main" style="height:calc(100% - 45px);">
    
  </div>
</div>
  `);
};

exports.viewPopUpSearchArticle = function (config) {
  this.PopUp.config({
    position: 'fromEdge',
    x: '0px',
    y: '0px',
    inAnimation: 'in-zoom',
    outAnimation: 'out-slide-left',
    initial: 'initial-zoom'
  });
  this.PopUp.eventBind = function () {

  };
  this.PopUp.switchToDom(`
<div style="width:100%;height:100%;">
  <div class="topBar flex">
    <div class="back" click="#back">
      
    </div>
    <div class="center flex">
      <div class="inputBar flex">
        <div class="icon search">
          <img src="/data/littleChat/search-small-icon.png" alt="">
        </div>
        <input type="text" class="input" placeholder="搜索文章"/>
        <div class="icon voice">
          <img src="/data/littleChat/voice-small-icon.png" alt="">
        </div>
      </div>
      
    </div>
  </div>
  <div class="main" style="height:calc(100% - 45px);">
    
  </div>
</div>
  `);
};

exports.viewPopUpSearchOfficalAccounts = function (config) {
  this.PopUp.config({
    position: 'fromEdge',
    x: '0px',
    y: '0px',
    inAnimation: 'in-zoom',
    outAnimation: 'out-slide-left',
    initial: 'initial-zoom'
  });
  this.PopUp.eventBind = function () {

  };
  this.PopUp.switchToDom(`
<div style="width:100%;height:100%;">
  <div class="topBar flex">
    <div class="back" click="#back">
      
    </div>
    <div class="center flex">
      <div class="inputBar flex">
        <div class="icon search">
          <img src="/data/littleChat/search-small-icon.png" alt="">
        </div>
        <input type="text" class="input" placeholder="搜索公众号"/>
        <div class="icon voice">
          <img src="/data/littleChat/voice-small-icon.png" alt="">
        </div>
      </div>
      
    </div>
  </div>
  <div class="main" style="height:calc(100% - 45px);">
    
  </div>
</div>
  `);
};

exports.viewPopUpSearchFiction = function (config) {
  this.PopUp.config({
    position: 'fromEdge',
    x: '0px',
    y: '0px',
    inAnimation: 'in-zoom',
    outAnimation: 'out-slide-left',
    initial: 'initial-zoom'
  });
  this.PopUp.eventBind = function () {

  };
  this.PopUp.switchToDom(`
<div style="width:100%;height:100%;">
  <div class="topBar flex">
    <div class="back" click="#back">
      
    </div>
    <div class="center flex">
      <div class="inputBar flex">
        <div class="icon search">
          <img src="/data/littleChat/search-small-icon.png" alt="">
        </div>
        <input type="text" class="input" placeholder="搜索小说"/>
        <div class="icon voice">
          <img src="/data/littleChat/voice-small-icon.png" alt="">
        </div>
      </div>
      
    </div>
  </div>
  <div class="main" style="height:calc(100% - 45px);">
    
  </div>
</div>
  `);
};

exports.viewPopUpSearchMusic = function (config) {
  this.PopUp.config({
    position: 'fromEdge',
    x: '0px',
    y: '0px',
    inAnimation: 'in-zoom',
    outAnimation: 'out-slide-left',
    initial: 'initial-zoom'
  });
  this.PopUp.eventBind = function () {

  };
  this.PopUp.switchToDom(`
<div style="width:100%;height:100%;">
  <div class="topBar flex">
    <div class="back" click="#back">
      
    </div>
    <div class="center flex">
      <div class="inputBar flex">
        <div class="icon search">
          <img src="/data/littleChat/search-small-icon.png" alt="">
        </div>
        <input type="text" class="input" placeholder="搜索音乐"/>
        <div class="icon voice">
          <img src="/data/littleChat/voice-small-icon.png" alt="">
        </div>
      </div>
      
    </div>
  </div>
  <div class="main" style="height:calc(100% - 45px);">
    
  </div>
</div>
  `);
};

exports.viewPopUpSearchEmoji = function (config) {
  this.PopUp.config({
    position: 'fromEdge',
    x: '0px',
    y: '0px',
    inAnimation: 'in-zoom',
    outAnimation: 'out-slide-left',
    initial: 'initial-zoom'
  });
  this.PopUp.eventBind = function () {

  };
  this.PopUp.switchToDom(`
<div style="width:100%;height:100%;">
  <div class="topBar flex">
    <div class="back" click="#back">
      
    </div>
    <div class="center flex">
      <div class="inputBar flex">
        <div class="icon search">
          <img src="/data/littleChat/search-small-icon.png" alt="">
        </div>
        <input type="text" class="input" placeholder="搜索表情"/>
        <div class="icon voice">
          <img src="/data/littleChat/voice-small-icon.png" alt="">
        </div>
      </div>
      
    </div>
  </div>
  <div class="main" style="height:calc(100% - 45px);">
    
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
//问题跨controller的 东西无法复用