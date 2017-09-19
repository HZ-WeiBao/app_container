exports.deps = {
  'js': [
    { name: 'slider', url: 'littleChat/views/Widget/slider.js' }
  ],
  css:[
    'littleChat/views/Widget/slider.css'
  ]
};

exports.actionIndex = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  });
  
  this.Page.eventBind = function(){
    var $tabSlider = document.querySelector('.page .tab.slider'),
      $tabBar = document.querySelector('.page .tabBar'),
      $indicator = document.querySelector('.page .indicator'),
      $handpickSlider = document.querySelector('.page .handpick.slider'),
      $moreSlider = document.querySelector('.page .more.slider'),
      indicatorWidth;

    this.controller.slider.parse($tabSlider,{});

    $tabSlider.generateCtrl($tabBar,[
      '<div>精选表情</div>',
      '<div>更多表情</div>'
    ],{
      onSlide: function ($from, $to, percentage,from,to){
        var offset = indicatorWidth * from;
        if(from > to)
          offset -= indicatorWidth * percentage;
        else
          offset += indicatorWidth * percentage;

        $indicator.classList.add('noneAnimation');
        $indicator.style.transform = 'translate3d('+ offset +'px,0,0)';
      },
      onSlideDone: function ($form, $to,from,to){
        $indicator.classList.remove('noneAnimation');
        $indicator.style.transform = 'translate3d(' + indicatorWidth * to + 'px,0,0)';
      }
    });

    indicatorWidth = screen.width / $tabSlider.getLen();
    $indicator.style.width = indicatorWidth + 'px';

    this.controller.slider.parse($handpickSlider, {
      loop:true
    });
    this.controller.slider.parse($moreSlider, {
      loop: true
    });
  };
}


exports.actionDetial = function (queryParams) {
  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) { return rep; }
  })
}