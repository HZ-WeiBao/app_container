exports.deps = {
  'js': [
    {name:'md5', url:'js/md5.min.js'},
  ]
};

var liked = false,
  submited = false,
  message, okText;

exports.actionIndex = function (params) {
  var $page0 = document.querySelector('.page-0'),
      $page1 = document.querySelector('.page-1'),
      $page2 = document.querySelector('.page-2'),
      $page3 = document.querySelector('.page-3'),
      $accept = document.getElementById('btn-accept'),
      $next1 = document.getElementById('btn-next-1'),
      $next2 = document.getElementById('btn-next-2'),
      $next3 = document.getElementById('btn-next-3'),
      $tabs = $page2.querySelector('.tabs'),
      $icons = $tabs.querySelectorAll('.icon-container'),
      $names = $tabs.querySelectorAll('.left-panel .name'),
      $descripts = $tabs.querySelectorAll('.descript'),
      $headIcon = document.getElementById('head-icon'),
      $inputName = document.querySelector('.input-name input'),
      $inputContact = document.querySelector('.input-contact input'),
      $inputMajor = document.querySelector('.input-major input'),
      $inputSkill = document.querySelector('.input-skill input'),
      $inputHobby = document.querySelector('.input-hobby input'),
      $inputWantTobe = document.querySelector('.input-wantTobe input'),
      $body = document.querySelector('.body'),

      F = this,
      status = {
        tab: 0
      };
  
  if(location.hash !== '#Home/Index')
    location.hash = '#Home/Index';

  setTimeout(function(){
    $page0.classList.add('enter');
  }, 500);
  
  $accept.onclick = function(){
    switchPage($page0, $page1);
  };

  $next1.onclick = function(){
    if(
      $inputName.value.trim().length > 1 &&
      $inputContact.value.trim().length > 2 &&
      $inputMajor.value.trim().length > 1
    ){
      switchPage($page1, $page2);
    }else{
      message = '需要全部填写完,也不能写太少~';
      okText = '知道';
      F.Router.popUp('Error');
    }
  };

  $next2.onclick = function(){
    var src = $icons[status.tab].getElementsByTagName('img')[0].src;
    switchPage($page2, $page3);
    $headIcon.setAttribute('src', src);
  };

  $next3.onclick = function(){
    if(submited){
      message = '已经提交过一遍了~';
      okText = '知道';
      F.Router.popUp('Error');
    }else if(
      $inputSkill.value.trim().length > 3 &&
      $inputHobby.value.trim().length > 3 &&
      $inputWantTobe.value.trim().length > 3
    ){
      Ajax({
        method: 'post',
        url: 'http://rec.chaoshy.cn/action.php',
        data: JSON.stringify({
          "action": "recruit",
          "name": $inputName.value.trim(),
          "mobile": $inputContact.value.trim(),
          "major": $inputMajor.value.trim(),
          "department": $names[status.tab].innerText,
          "skill": $inputSkill.value.trim(),
          "hobby": $inputHobby.value.trim(),
          "wantTobe": $inputWantTobe.value.trim(),
          "sign": md5('ls*x!' + $inputContact.value.trim() + (new Date).getTime().toString().slice(0,10))
        }),
        func: function (rep) {
          var json = JSON.parse(rep);

          if(parseInt(json.status, 10) === 0){
            F.Router.popUp('Menu');
            submited = true;
          }else{
            message = json.message;
            okText = '唉';
            F.Router.popUp('Error');
          }
        },
        error: function(){
          message = '出现网络错误';
          okText = '唉';
          F.Router.popUp('Error');
        }
      });
    }else{
      message = '还是需要全部填写完,也不能写太少~';
      okText = '明白';
      F.Router.popUp('Error');
    }
  }.bind(this);

  function switchPage($from, $to){
    $from.classList.add('leave');
    $to.classList.add('enter');
  }

  //其他页面的事件
  function switchOn ($dom) {
    $dom.classList.add('enter');
    $dom.classList.remove('leave');
  }
  function switchOff ($dom) {
    $dom.classList.remove('enter');
    $dom.classList.add('leave');
  }

  Array.prototype.forEach.call($icons, function($icon, i){
    $icon.onclick = function(i){
      if(status.tab !== i){
        switchOff($icons[status.tab]);
        switchOff($descripts[status.tab]);
        switchOn($icons[i]);
        switchOn($descripts[i]);
        $body.style['background-position'] = i * 2 + '% 0';
        status.tab = i;
      }
    }.bind($icon, i);
  })

  switchOn($icons[status.tab]);
  switchOn($descripts[status.tab]);
}

exports.viewPopUpMenu = function (config) { 
  var fromPressElement = this.Event.triggerElement,
    F = this;

  this.PopUp.config({
    position:'center',
    initial:'popUp-initial',
    inAnimation:'popUp-in',
    outAnimation:'turbulenceOut',
  });
  this.PopUp.switchToDom('\
  <div class="popup-window">\
    <div class="content">\
      <div class="message">\
        距离战场还有1天(11月15号), 到时候会短信通知时间\
      </div>\
      <div class="flex-bottom"><div class="btn-normal"><span>赞</span></div></div>\
    </div>\
  </div>\
  ');

  this.PopUp.inViewUpdateFunc = function($div){
    var $next3 = document.getElementById('btn-next-3'),
      $like = $div.querySelector('.btn-normal');
      
    $next3.classList.add('turbulenceOut');
    if(liked) $like.innerText = '谢谢'
    $like.onclick = function(){
      if(!liked)
        Ajax({
          method: 'get',
          url: F.Router.url('Home_', 'Like'),
          func: function (rep) {
            $like.classList.add('clicked');
            liked = true;
            setTimeout(function(){
              $like.innerText = '谢谢'
            },700)
          }
        });
    }
  }

  this.PopUp.outViewUpdateFunc = function(){
    var $next3 = document.getElementById('btn-next-3');

    $next3.classList.remove('turbulenceOut');
  }
};

exports.viewPopUpError = function (config) { 
  var fromPressElement = this.Event.triggerElement;

  this.PopUp.config({
    position:'center',
    initial:'popUp-initial',
    inAnimation:'popUp-in',
    outAnimation:'turbulenceOut',
  });
  this.PopUp.switchToDom('\
  <div class="popup-window">\
    <div class="content">\
      <div class="message">\
        '+ message +'\
      </div>\
      <div class="flex-bottom"><div class="btn-normal" click="#back">'+okText+'</div></div>\
    </div>\
  </div>\
  ');
};