
exports.deps = {
  'js': [
    { name: 'scrollBar', url: 'littleChat/views/Widget/scrollBar.js' },
    { name: 'backColumn', url: 'littleChat/views/Widget/backColumn.js' }
  ],
  'css': [
    'littleChat/views/Widget/scrollBar.css',
    'littleChat/views/Widget/listOverflow.css'
  ]
};

exports.actionList = function () {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.actionNew = function () {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });

  this.Page.eventBind = function(){
    var $scrollBar = document.querySelector('.page .scrollBar'),
      $main = document.querySelector('.page .main');

    this.controller.scrollBar.init($scrollBar, $scrollBar.querySelector('.showing-letter'));

    $scrollBar.onScroll = function (toLetter) {
      var $segment = $main
        .querySelector('.segment[value="' + toLetter + '"]');

      if ($segment)
        $main.scrollTop = $segment.offsetTop;
      else if (toLetter == '↑')
        $main.scrollTop = 0;
    };
  }.bind(this);
}

exports.actionTag = function () {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.actionSelectContact = function () {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.actionTagEdit = function () {
  this.Page.load({//这个个旧的接口肯定是需要砍掉的
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
}

exports.actionOfficalAccount = function () {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });

  this.Page.eventBind = function(){
    var $scrollBar = document.querySelector('.page .scrollBar'),
      $main = document.querySelector('.page .main');

    this.controller.scrollBar.init($scrollBar, $scrollBar.querySelector('.showing-letter'));

    $scrollBar.onScroll = function (toLetter) {
      var $segment = $main
        .querySelector('.segment[value="' + toLetter + '"]');

      if ($segment)
        $main.scrollTop = $segment.offsetTop;
      else if (toLetter == '↑')
        $main.scrollTop = 0;
    };
  };
}

exports.actionOfficalAccountSearch = function (config) {
  this.Page.switchToDom(this.module.Emmet.make(
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
              input[type="text" class="input" placeholder="搜索公众号"]
            )
        )
      ) +
      div.main
    `, {}).parse());
}

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
            )
        )
      ) +
      div.main.withHalfOpacity
    `, {

    }).parse());
}