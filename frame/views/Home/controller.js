exports.actionComment = function() {
    this.Page.load({
      method:'get',
      url:this.Router.url(),
      cache:true,
      func:function(rep){
        return rep;
      }
    });

    this.Page.eventBind = function(){
      var $btnSend = document.querySelector('.page #btnSend');
      $btnSend.addEventListener('click',function(){
        var $inputComment = document.querySelector('#inputComment');
        //等待动画
        var i = 0;
        $btnSend.innerHTML = '<span style="color:grey;">.</span> . .';
        var t = setInterval(function(){
          var str = ['.','.','.'];
          if(++i == str.length)
            i = 0;
          str[i] = '<span style="color:grey;">.</span>'
          $btnSend.innerHTML = '<b>' + str.join(' ') + '</b>';
        },150);
        //输入数据检查
        if($inputComment.value.length > 5)
          Ajax({
            method:'post',
            url:this.Router.url(),
            data:JSON.stringify({
              content:$inputComment.value
            }),
            func:function(){
              clearInterval(t);
              $btnSend.innerHTML = '成功';
              $btnSend.classList.add('success');
              var t1 = setTimeout(function(){
                $btnSend.classList.remove('success');
                $btnSend.innerHTML = '发送';
              },2000);
            }
          });
        else{
          $btnSend.innerHTML = '太短';
          clearInterval(t);
          var t2 = setTimeout(function(){
                $btnSend.innerHTML = '发送';
              },2000);
        }
      }.bind(this))

      //添加点赞按钮事件
      document.querySelectorAll('.btnLike').forEach(function(btnLike) {
        var clicked = false;
        var oldIcon = btnLike.getElementsByTagName('i')[0].innerHTML;
        btnLike.addEventListener('click', function(){
            if(!clicked){
              clicked = true;
              btnLike.getElementsByTagName('i')[0].innerHTML = '&#xe602;';
              Ajax({
                method:'post',
                url:this.Router.url('Home_','CommentLike'),
                data:JSON.stringify({
                  id:btnLike.getAttribute('commentId')
                }),
                func:function(rep){
                  btnLike.getElementsByTagName('span')[0].innerHTML = rep;
                }
              });
            }else{
              clicked = false;
              btnLike.getElementsByTagName('i')[0].innerHTML = oldIcon;
              Ajax({
                method:'post',
                url:this.Router.url('Home_','CommentUnLike'),
                data:JSON.stringify({
                  id:btnLike.getAttribute('commentId')
                }),
                func:function(rep){
                  btnLike.getElementsByTagName('span')[0].innerHTML = rep;
                }
              });
            }
        }.bind(this));
      }, this);
    }.bind(this);
}

exports.viewUpdateComment = function() {
    this.Page.inViewUpdateFunc = function(){
      document.querySelector('.menu > ul > li:nth-child(2)').classList.add('selectedIn');
      document.querySelector('.menu > ul > li:nth-child(2) > a').setAttribute('href','#back')
    }

    this.Page.outViewUpdateFunc = function(){
      document.querySelector('.menu > ul > li:nth-child(2)').classList.remove('selectedIn');
      document.querySelector('.menu > ul > li:nth-child(2)').classList.add('selectedOut');
      document.querySelector('.menu > ul > li:nth-child(2) > a').setAttribute('href','#Home_/Comment')
      setTimeout(function(){
        document.querySelector('.menu > ul > li:nth-child(2)').classList.remove('selectedOut');
      },130);
    };
};

exports.actionApps = function() {
    this.Page.load({
      method:'get',
      url:this.Router.url(),
      cache:true,
      func:function(rep){
        return rep;
      }
    });
}

exports.viewUpdateApps = function() {
    this.Page.inViewUpdateFunc = function(){
      document.querySelector('.menu > span').classList.add('selectedIn');
      document.querySelector('.menu > span > a').setAttribute('href','#back')
    }

    this.Page.outViewUpdateFunc = function(){
      document.querySelector('.menu > span').classList.remove('selectedIn');
      document.querySelector('.menu > span').classList.add('selectedOut');
      document.querySelector('.menu > span > a').setAttribute('href','#Home_/Apps')
      setTimeout(function(){
        document.querySelector('.menu > span').classList.remove('selectedOut');
      },130);
    };
};

exports.viewUpdateLike = function(){
  Ajax({
    method:'get',
    url:this.Router.url('Home_','Like'),
    func:function(rep){
      document.querySelector('.menu > ul > li:nth-child(3) a span').innerHTML = rep;
      document.querySelector('.menu > ul > li:nth-child(3) a i').innerHTML = '&#xe615;';
      document.querySelector('.menu > ul > li:nth-child(3) a').setAttribute('href','#Home_/Unlike?viewUpdate=true');
    }
  });
};

exports.viewUpdateUnlike = function(){
  Ajax({
    method:'get',
    url:this.Router.url('Home_','Unlike'),
    func:function(rep){
      document.querySelector('.menu > ul > li:nth-child(3) a span').innerHTML = rep;
      document.querySelector('.menu > ul > li:nth-child(3) a i').innerHTML = '&#xe66c;';
      document.querySelector('.menu > ul > li:nth-child(3) a').setAttribute('href','#Home_/Like?viewUpdate=true');
    }
  });
};

exports.actionAbout = function (){
  this.Page.load({
    method:'get',
    url:this.Router.url(),
    func:function(rep){
      return rep;
    }
  });
}

exports.viewUpdateAbout = function() {
    this.Page.inViewUpdateFunc = function(){
      document.querySelector('.menu > ul > li:nth-child(1)').classList.add('selectedIn');
      document.querySelector('.menu > ul > li:nth-child(1) > a').setAttribute('href','#back')
    }

    this.Page.outViewUpdateFunc = function(){
      document.querySelector('.menu > ul > li:nth-child(1)').classList.remove('selectedIn');
      document.querySelector('.menu > ul > li:nth-child(1)').classList.add('selectedOut');
      document.querySelector('.menu > ul > li:nth-child(1) > a').setAttribute('href','#Home_/About')
      setTimeout(function(){
        document.querySelector('.menu > ul > li:nth-child(1)').classList.remove('selectedOut');
      },130);
    };
};