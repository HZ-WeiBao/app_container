exports.deps = {
  'js': [
    // { name: 'slider', url: 'littleChat/views/Widget/slider.js' }
  ]
};

exports.actionTab = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
  this.Page.eventBind = function(){
    var $iframe = document.querySelector('.page .main iframe'),
      $title = document.querySelector('.page .topBar .center .name');
    
    $title.innerText = decodeURIComponent(queryParams.title);
    setTimeout(function(){
      $iframe.setAttribute('src', decodeURIComponent(queryParams.url));
    },300);

    $iframe.onclick = function(info){
      
      console.log('here');
    }
  };
}

exports.viewPopUpBottomMenu = function (queryParams) {
  var host = decodeURIComponent(queryParams.url);
  host = host.match(/:\/\/([^\/]*)\//i);

  this.PopUp.config({
    position: 'fromEdge',
    y: '-0px',
    x: '0px',
    maskOnStyle: 'maskOn-lightdark',
    inAnimation: 'in-slide-bottom',
    outAnimation: 'out-slide-bottom',
    initial: 'initial-slide-bottom'
  });

  this.PopUp.switchToDom(this.module.Emmet.make(`
    div.menuContainer > 
      div.hostInfo{@hostInfo} +
      ul.list >
        (
          li.flex-1-4[popUpClick=$href] >
            img[src=$src] + span{$name}
        ) * @menu
    `,{
      hostInfo: '网页由'+host[1]+'提供',
      menu:[
        {
          name:'发送给朋友',
          src:'/data/littleChat/broswerBottomMenu/发送给朋友.png',
          href:''
        },{
          name: '分享到朋友圈',
          src: '/data/littleChat/broswerBottomMenu/分享到朋友圈.png',
          href: ''
        },{
          name: '收藏',
          src: '/data/littleChat/broswerBottomMenu/收藏.png',
          href: ''
        },{
          name: '搜索页面内容',
          src: '/data/littleChat/broswerBottomMenu/搜索页面内容.png',
          href: ''
        },{
          name: '复制链接',
          src: '/data/littleChat/broswerBottomMenu/复制链接.png',
          href: ''
        }, {
          name: '查看公众号',
          src: '/data/littleChat/broswerBottomMenu/查看公众号.png',
          href: ''
        }, {
          name: '在聊天置顶',
          src: '/data/littleChat/broswerBottomMenu/在聊天置顶.png',
          href: ''
        }, {
          name: '在浏览器打开',
          src: '/data/littleChat/broswerBottomMenu/在浏览器打开.png',
          href: ''
        }, {
          name: '调整字体',
          src: '/data/littleChat/broswerBottomMenu/调整字体.png',
          href: ''
        }, {
          name: '刷新',
          src: '/data/littleChat/broswerBottomMenu/刷新.png',
          href: ''
        }, {
          name: '投诉',
          src: '/data/littleChat/broswerBottomMenu/投诉.png',
          href: ''
        }
      ]
    }).parse());
};