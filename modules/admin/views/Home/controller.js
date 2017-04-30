//这里存放所有controller相互调用的操作
//比如一个Home调用Person里面的一个操作,然而这个数据发送前,发送后的行为将会定义在这里

exports.deps = {
  css:[
    'frame/views/Home/Error.css',
  ]
};

exports.actionSetting = function(args){
  this.Page.load({
    method:'post',
    url:this.Router.url(),
    data:JSON.stringify({
      module:args.module
    }),
    func:function(rep){
      return rep
    }
  });
};

exports.actionCommentMgr = function(args){
  this.Page.load({
    method:'post',
    url:this.Router.url(),
    data:JSON.stringify({
      module:args.module
    }),
    func:function(rep){
      return rep
    }
  });
  this.Page.eventBind = function(){
    navBarCtrl.call(this);
    btnLikeCtrl.call(this);
    btnStarCtrl.call(this);
    btnReplyCtrl.call(this);
  }.bind(this);
};

function navBarCtrl(){
  var $tabs = document.querySelectorAll('.page .navBar a'),
      $commentsContainer = document.querySelector('.page .commentsContainer'),
      $module = document.querySelector('.page #module'),
      tabs = ['UnRead','Read','All'];

  //eventBind
  $tabs.forEach(function($tab) {
    $tab.addEventListener('click',function(){
      var $selected = document.querySelector('.page .navBar .selected');

      $selected.classList.remove('selected');
      $tab.classList.add('selected');
      
      //更新commentList
      $commentsContainer.classList.add('out');
      var startTime = (new Date).getTime();
      Ajax({
        method:'post',
        url:this.Router.url('Home','CommentList'),
        data:JSON.stringify({
          tab:$tab.getAttribute('name'),
          module:$module.getAttribute('name')
        }),
        func:function(rep){
          var endTime = (new Date).getTime();
          var animationTime = 335 - (endTime - startTime);
          var t = setTimeout(function(){
            $commentsContainer.innerHTML = rep;
            var t = setTimeout(function(){
              $commentsContainer.classList.remove('out');
              $commentsContainer.classList.add('in');
              btnLikeCtrl.call(this);
              btnStarCtrl.call(this);
              btnReplyCtrl.call(this);
            }.bind(this),35);  
          }.bind(this),animationTime);
        }.bind(this)
      });
    }.bind(this))
  }, this);
}

function btnLikeCtrl(){//这应该也是批量的啊
  var $btnLikes = document.querySelectorAll('.page .btnLike');

  $btnLikes.forEach(function($btnLike){
    $btnLike.addEventListener('click',function(){
      var liked = false,
          url = this.Router.url('Home','CommentLike');

      if($btnLike.getAttribute('liked') == 'true'){
        liked = true;
        url = this.Router.url('Home','CommentUnLike');
      }
      Ajax({
        method:'post',
        url:url,
        data:JSON.stringify({
          id:$btnLike.parentNode.getAttribute('commentId'),
        }),
        func:function(rep){
          if(liked){
            $btnLike.setAttribute('liked','false');
            $btnLike.querySelector('i').innerHTML = '&#xe6c7;';
            $btnLike.querySelector('span').innerHTML = parseInt($btnLike.querySelector('span').innerHTML,10)-1;
          }else{
            $btnLike.setAttribute('liked','true');
            $btnLike.querySelector('i').innerHTML = '&#xe602;';
            $btnLike.querySelector('span').innerHTML = parseInt($btnLike.querySelector('span').innerHTML,10)+1;
          }
        },
        error:function(code,text,rep){
          alert('error:'.text);
        }
      });
    }.bind(this));
  },this);
}

function btnStarCtrl(){
  var $btnStars = document.querySelectorAll('.page .btnStar');

  $btnStars.forEach(function($btnStar){
    $btnStar.addEventListener('click',function(){
      var star = false,
          url = this.Router.url('Home','CommentStar');

      if($btnStar.getAttribute('star') == 'true'){
        star = true;
        url = this.Router.url('Home','CommentUnStar');
      }
      Ajax({
        method:'post',
        url:url,
        data:JSON.stringify({
          id:$btnStar.parentNode.getAttribute('commentId'),
        }),
        func:function(rep){
          if(star){
            $btnStar.setAttribute('star','false');
            $btnStar.querySelector('i').innerHTML = '&#xe623;';
          }else{
            $btnStar.setAttribute('star','true');
            $btnStar.querySelector('i').innerHTML = '&#xe600;';
          }
        },
        error:function(code,text,rep){
          alert('error:'.text);
        }
      });
    }.bind(this));
  },this);
}

function btnReplyCtrl(){
  $btnReplys = document.querySelectorAll('.page .btnReply');
  $btnReplys.forEach(function($btnReply){
    var $a = $btnReply.querySelector('a');
    $a.addEventListener('click',function(){
      Ajax({
        method:'post',
        url:this.Router.url('Home','Reply'),
        data:JSON.stringify({
          id:$btnReply.getAttribute('commentId'),
          content:$btnReply.querySelector('input').value
        }),
        func:function(rep){
          $a.innerHTML = '成功'
          $a.classList.add('success');
          var t = setTimeout(function(){
            $a.innerHTML = '回复';
            $a.classList.remove('success');
          },800);
        },
        error:function(code,text){
          alert('error:'+text);
        }
      });
    }.bind(this));
  },this);
}