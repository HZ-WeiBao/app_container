
exports.commonAction = function(){
  this.Page.load({
    method:'get',
    url:this.Router.url(),
    func:function(rep){
      return rep;
    }
  });
  this.Page.commonEventBind = function(){
    var $as = document.querySelectorAll('.page .statusBar a'),
        $module = document.querySelector('.page #module');

    $as.forEach(function($a) {
      $a.addEventListener('click',function(){
        $as.forEach(function($a){
          $a.classList.add('none');
        },this);
        $a.classList.remove('none');

        Ajax({
          method:'post',
          url:this.Router.url('Setting','StatusSwitch'),
          data:JSON.stringify({
            module:$module.getAttribute('name'),
            switchTo:$a.getAttribute('name')
          }),
          func:function(){}
        });
      }.bind(this));
    }, this);
  }.bind(this);
}

exports.actionEmptyClass = exports.actionAuditor = function(){
  this.Page.eventBind = function(){
    var $as = document.querySelectorAll('.page .statusBar a'),
        $btnUpdate = document.querySelector('.page #btnUpdate'),
        $module = document.querySelector('.page #module'),
        $captcha = document.querySelector('.page #captcha');

    $btnUpdate.addEventListener('click',function(){
      //是否正在更新也设置一个状态吧
      Ajax({
        method:'post',
        url:this.Router.url('Setting','Update'),
        data:JSON.stringify({
          captcha:$captcha.value,
          sessionId:$btnUpdate.getAttribute('sessionId'),
          module:$module.getAttribute('name')
        }),
        func:function(rep){
          if(rep == '开始更新~'){
            $as.forEach(function($a){
              $a.classList.add('none');
            },this);
            $as[1].classList.remove('none');
            $btnUpdate.innerHTML = '开始更新了~耐心等待~'
          }else{
            var oldInnerHTML = $btnUpdate.innerHTML;
            $btnUpdate.innerHTML = rep;
            var t = setTimeout(function(){
              $btnUpdate.innerHTML = oldInnerHTML;
            },1500);
          }
        }
      });
    }.bind(this));
  }.bind(this);
}

exports.actionOneSaying = function(){
  this.Page.eventBind = function(){
    var $as = document.querySelectorAll('.page .statusBar a'),
        $btnUpdate = document.querySelector('.page #btnUpdate'),
        $module = document.querySelector('.page #module');

    $btnUpdate.addEventListener('click',function(){
      //是否正在更新也设置一个状态吧
      Ajax({
        method:'post',
        url:this.Router.url('Setting','Update'),
        data:JSON.stringify({
          module:$module.getAttribute('name')
        }),
        func:function(rep){
          if(rep == '开始更新~'){
            $as.forEach(function($a){
              $a.classList.add('none');
            },this);
            $as[1].classList.remove('none');
            $btnUpdate.innerHTML = '开始更新了~耐心等待~'
          }else{
            var oldInnerHTML = $btnUpdate.innerHTML;
            $btnUpdate.innerHTML = rep;
            var t = setTimeout(function(){
              $btnUpdate.innerHTML = oldInnerHTML;
            },1500);
          }
        }
      });
    }.bind(this));
  }.bind(this);
}

exports.actionAdmin = function(){
  this.Page.eventBind = function(){
    var $switcher = document.querySelector('.page .switcher'),
        $swtichStatus = document.querySelector('.page .switcher > div');
    
    $switcher.addEventListener('click',function(){
      var to = ('on' == $swtichStatus.getAttribute('class'))? 'off' : 'on' ,
          form = ('on' == $swtichStatus.getAttribute('class'))? 'on' : 'off';

      Ajax({
        method:'post',
        url:this.Router.url('Setting','Switch'),
        data:JSON.stringify({
          name:$switcher.getAttribute('name'),
          to:to
        }),
        func:function(rep){
          if(rep == 'done'){
            $swtichStatus.classList.remove(form);
            $swtichStatus.classList.add(to);
          }else{
            console.log('操作失败~');
          }
        }
      });
    }.bind(this));
  }.bind(this);
}