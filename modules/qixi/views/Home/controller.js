
exports.actionIndex = function (params) {//首页可以直接绑定事件了
  var $envelope = document.querySelector('.page .envelope'),
      $btnSend = $envelope.querySelector('.page .envelope .btnSend'),
      $stamp = $envelope.querySelector('.page .envelope .stamp'),
      $blessing = document.querySelector('.page .blessing'),
      $copyright = document.querySelector('.page .copyright'),
      $btnLike = $copyright.querySelector('.btnLike'),
      $content = $envelope.querySelector('.page .envelope .content'),
      $receiver = $envelope.querySelector('.page .envelope .receiver'),
      $sender = $envelope.querySelector('.page .envelope .sender'),
      $openid = $envelope.querySelector('.page .envelope .openid');

  $envelope.style['margin-top'] = (screen.height - 360 * 0.7 * 0.4)/2 + 'px';

  var finishAnimation = function(){
    $stamp.addEventListener('animationend', function () {
      setTimeout(function () {
        $envelope.addEventListener('animationend', function () {
          $blessing.addEventListener('animationend', function () {
            $copyright.classList.add('show');
          });
          $blessing.classList.add('show');
        });
        $envelope.classList.add('ship');
      }, 800);
    });
    $envelope.classList.add('send');
  };
  
  $btnSend.onclick = function(){
    var postdata ;

    if(
      $receiver.value.trim() == '' ||
      $content.value.trim() == '' ||
      $sender.value.trim() == '' 
    ){
      alert('填全一些哦~, 动人一些哦~');

      if (params.test)
        finishAnimation();
      return;
    }

    if (params.test) {
      finishAnimation();
      return ;
    }

    Ajax({
      method: 'post',
      url: 'http://tmp0000000000000.deepkolos.cn/wechat/action.php',
      data: JSON.stringify({
        openid : $openid.value,
        receiver : $receiver.value,
        sender : $sender.value,
        content : $content.value
      }),
      func: function (rep) {
        if(rep == '0'){
          finishAnimation();
        } else if (rep == '-1'){
          alert('请从微报后台回复"告白"进入页面~');
        } else if (rep == '-2'){
          alert('数据库连接问题');
        } else if (rep == '-3'){
          alert('数据库执行问题');
        } else if (rep == '-4') {
          alert('你已经参与过一次咯~\n想看结果就后台回复 查看结果');
        }
      }
    });
  }.bind(this);

  $btnLike.onclick = function(){
    Ajax({
      method: 'get',
      url: this.Router.url('Home_', 'Like'),
      func: function (rep) {
        $btnLike.classList.add('clicked');
      }
    });
  }.bind(this);
}

exports.actionInbox = function (params){
  var $openid = document.querySelector('.page .envelope .openid'),
    dataParseToDom;

  this.Page.load({
    method: 'get',
    url: this.Router.url(),
    func: function (rep) {
      return rep;
    }
  });

  this.Page.eventBind = function(){
    var $envelope = document.querySelector('.page .envelope'),
      $btnSend = $envelope.querySelector('.page .envelope .btnSend'),
      $stamp = $envelope.querySelector('.page .envelope .stamp'),
      $content = $envelope.querySelector('.page .envelope .content'),
      $receiver = $envelope.querySelector('.page .envelope .receiver'),
      $sender = $envelope.querySelector('.page .envelope .sender'),
      $openid = $envelope.querySelector('.page .envelope .openid'),
      $objectContainer = document.querySelector('.page .objectContainer'),
      $standbyTyreContainer = document.querySelector('.page .standbyTyreContainer');

    $envelope.style['margin-top'] = (screen.height - 360 * 0.7 * 0.4) / 2 + 'px';
    $envelope.style.opacity = 1;

    dataParseToDom = function (data) {
      var $envelope = document.querySelector('.page .envelope');

      function strToTimestamp(str) {
        str = '2017-' + str;
        str = str.replace('月', '-').replace('日', '');
        return Date.parse(str);
      }

      function timeTilNow(timestamp) {
        var now = (new Date).getTime(),
          diff = now - timestamp,
          returnValue,
          rules = [
            [30 * 12 * 24 * 60 * 60 * 1000, '年'],
            [30 * 24 * 60 * 60 * 1000, '月'],
            [7 * 24 * 60 * 60 * 1000, '周'],
            [24 * 60 * 60 * 1000, '天'],
            [60 * 60 * 1000, '小时'],
            [60 * 1000, '分钟']//没有秒
          ];

        rules.every(function (rule) {
          if (diff > rule[0]) {
            returnValue = Math.ceil(diff / rule[0]) + rule[1] + '前';
            return false;
          }
          return true;
        });

        return returnValue || '1分钟前';
      }

      function parseToDom(data) {
        var $container = document.createElement('div'),
          $flex = document.createElement('div'),
          $name = document.createElement('div'),
          $time = document.createElement('div'),
          $loveLetter = document.createElement('div');

        if (data.name) {
          $container.setAttribute('class', 'object');
          $name.innerText = data.name;
        } else {
          $container.setAttribute('class', 'standbyTyre');
          $name.innerText = '匿名';
        }

        $time.timestamp = strToTimestamp(data.time);

        $time.update = function () {
          $time.innerText = timeTilNow($time.timestamp);

          setTimeout($time.update, 60 * 1000);
        };

        $time.update();

        $loveLetter.innerText = data.content;

        $loveLetter.className = 'loveLetter';
        $flex.className = 'flex';
        $name.className = 'name';
        $time.className = 'time';

        //组装
        $flex.appendChild($name);
        $flex.appendChild($time);
        $container.appendChild($flex);
        $container.appendChild($loveLetter);

        if (data.name)
          $objectContainer.appendChild($container);
        else
          $standbyTyreContainer.appendChild($container);
      }

      switch (parseInt(data.status)) {
        case 0:
          [{
            "time": "08月28日 24:00:00",
            "content": "还没有人给你告白哦~ 名字要写熟悉的暗号哦~",
            "name": "微报君"
          }].forEach(parseToDom);
          break;
        case 1:
          data.data.forEach(parseToDom);
          break;
        case -1:
          alert('请从微报后台回复"查看结果"进入页面~');
          break;
        case -2:
          alert('数据库连接问题');
          break;
        case -3:
          alert('数据库执行问题');
          break;
        case -4:
          alert('你告白里没写你名字,不造谁给你表白鸟~');
          break;
      }

      $envelope.onclick = function () {
        $envelope.classList.add('send');
        $envelope.classList.remove('swing');
      };
      requestAnimationFrame(function () {
        $envelope.classList.add('swing');
      });
    }.bind(this);

    setTimeout(function(){
      if (!params.test){
        Ajax({
          method: 'post',
          url: 'http://tmp0000000000000.deepkolos.cn/wechat/result.php',
          data: JSON.stringify({
            openid: $openid.value
          }),
          func: function (rep) {
            data = JSON.parse(rep);
            dataParseToDom(data);
          },
          error: function () {
            alert('网络错误');
          }
        });
      }else
        dataParseToDom({
          "status": 1,
          "data": [
            {
              "time": "08月27日 15:45:13",
              "content": "7年",
              "name" : "蓝精灵"
            },
            {
              "time": "08月27日 13:59:50",
              "content": "测试~"
            }
          ]
        });
    },300);
  };
}