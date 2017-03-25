
exports.deps = {
  'js':[
    {name:'hammer', url:'js/hammer.min.js'}
  ]
};

exports.actionIndex = function(){
  this.Loader.cssSwitch();
  setTimeout(function(){
    document.querySelector('.module_body').classList.remove('noneAnimation');
    document.querySelector('.module_body').style.opacity = 1;
  },0);
  console.log('首页加载成功~~send from 小小框架~~');
  setTimeout(function(){
      this.redHat = new RedHat;
  }.bind(this),100);
}

exports.actionUpload = function(){
  document.querySelector('#avatar_upload').click();
}

exports.actionNewAvatar = function(){
  this.redHat.show_new_avatar();
}

exports.actionAddAnother = function(){
  this.redHat.add_more();
}


this.redHat = null;
function RedHat(){
  var display_result = document.querySelector('.display_result');
  var changeImg = document.querySelector('.changeImg');

  function headwearContainer(){
      var len = 99;
      var ul = document.createElement('ul');
      ul.style.width = len * 44 + 'px';
      changeImg.appendChild(ul);

      //定时加载一批,算了现在还是不改这东西了
      var step = 5;//每次加载10个
      var start = 1;
      function loadImg(){
          for(var i = start; i <= start + step && i <= len; i++){
              !function(){
                  var li = document.createElement('li');
                  var img = document.createElement('img');
                  img.setAttribute('src','./img/redhat/'+i+'.png');
                  li.onclick = function(){
                      avatar_editor.changeImg(img);
                  }
                  li.appendChild(img);
                  ul.appendChild(li);
              }();
          }
          start = i;
          setTimeout(loadImg,800);
      }
      loadImg();
      this.addRandom = function (){
          var rand = Math.random();
          var rand = Math.ceil(rand*47);
          ul.getElementsByTagName('li')[rand].onclick();
      }
  }

  var headwear = new headwearContainer();

  function img_edit(canvas,img){
      var c_x = canvas.width;
      var c_y = canvas.height;
      var img_x = img.width;
      var img_y = img.height;
      var x = 0;
      var y = 0;
      var d = 0;
      var z = 2.5;
      this.show = function (){
          var context = canvas.getContext('2d');
          context.clearRect(0,0,c_x,c_y);
          context.save();
          context.translate(x + c_x/2,y + c_y/2);
          context.rotate(degree(d));
          context.drawImage(img,-img_x*z/2,-img_y*z/2,img_x*z,img_y*z);
          context.restore();
      }
      this.moveX = function(len){
          x += len;
          this.show();
      }
      this.moveY = function(len){
          y += len;
          this.show();
      }
      this.zoom = function(len){
          z = len;
          this.show();
      }
      this.rotate = function(len){
          d = len;
          this.show();
      }
      this.changeImg = function(replace_img){
          if(replace_img.complete){
              img = replace_img;
              updateInfo();
              this.show();
          }else{
              alert('加载图片失败~');
          }
      }
      this.toImg = function(){
          return canvas.toDataURL();
      }
      function updateInfo(){
          c_x = canvas.width;
          c_y = canvas.height;
          img_x = img.width;
          img_y = img.height;
          x = 0;
          y = 0;
          d = 0;
          z = 2.5;
      }
      function degree(n){
          return n * Math.PI / 180;
      }
  }

  var avatar_editor;

  var timer = setInterval(function() {
      var img = changeImg.getElementsByTagName('img')[0];
      if (img.complete) {
          avatar_editor = new img_edit(document.querySelector('#avatar_edit'),img);
          avatar_editor.show()
          clearInterval(timer);
      }
  }, 100);

  document.querySelector('#avatar_upload').onchange = function(){
      if(this.files.length == 1){
          var reader = new FileReader();
          reader.onloadend = function(){
              document.querySelector('#avatar_orignal').setAttribute('src',reader.result);
          }
          reader.readAsDataURL(this.files[0]);
      }
  }

  generate_avatar = function (){
      var ajusted_img = new Image();
      ajusted_img.src = avatar_editor.toImg();
      console.log(ajusted_img.complete);
      if(ajusted_img.complete){
          var canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 600;
          canvas.style.width = '200px';
          canvas.style.height = '200px';
          var context = canvas.getContext('2d');
          context.drawImage(document.querySelector('#avatar_orignal'),0,0,600,600);
          context.drawImage(ajusted_img,0,0,600,600);
      }
      return canvas.toDataURL();
  }

  this.show_new_avatar = function(){
      document.querySelector('#output_img').setAttribute('src',generate_avatar());
      maskOn(function(){
          css(document.querySelector('#output'),{
                  'opacity': '0'
              });
          setTimeout(function() {
              css(document.querySelector('#output'),{
                  'display': 'none',
                  'z-index': '-10',
              });
          }, 10);
      });
      css(document.querySelector('#output'),{
          'display': 'block',
          'z-index': '100',
      });
      setTimeout(function() {
          css(document.querySelector('#output'),{
              'opacity': '1'
          });
      }, 10);
    //   ajax('get','action.php',{act:'generate'},'',function(){});
  }

  var hammertime = new Hammer(document.querySelector('#avatar_edit'));
  hammertime.get('pinch').set({ enable: true });
  hammertime.get('rotate').set({ enable: true });
  hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });

  hammertime.on("pinchstart", function(e) {
      hammertime.startPinch = hammertime.startPinch || 1.1;
      hammertime.tempPinch = hammertime.tempPinch || 1.1;
    hammertime.startPinch = hammertime.startPinch + hammertime.tempPinch;
    hammertime.lastPinch = e.scale;
  });

  hammertime.on("pinchmove", function(e) {
      hammertime.tempPinch = (e.scale - hammertime.lastPinch)*3;
      avatar_editor.zoom(hammertime.startPinch + hammertime.tempPinch);
  });

  hammertime.on("rotatestart", function(e) {
      hammertime.startRotate = hammertime.startRotate || 0;
      hammertime.tempRotate = hammertime.tempRotate || 0;
    hammertime.startRotate = hammertime.startRotate + hammertime.tempRotate;
    hammertime.lastRotate = e.rotation;
  });

  hammertime.on("rotatemove", function(e) {
      hammertime.tempRotate = e.rotation - hammertime.lastRotate;
      avatar_editor.rotate(hammertime.startRotate + hammertime.tempRotate);
  });


  hammertime.on('pan pinch', function(ev) {
      avatar_editor.moveY(ev.velocityY*31);
      avatar_editor.moveX(ev.velocityX*31);
  });


  this.add_more = function(){
      document.querySelector('#avatar_orignal').setAttribute('src',generate_avatar());
      headwear.addRandom();
  }
}