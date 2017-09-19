
exports.init = function(){
  var $backColumn = document.querySelector('.page .backColumn'),
    $page = document.querySelector('.page'),
    status = {
      x:null,
      rafLock:false,
      initLock:false,
      direction:null
    };

  $backColumn.onSlide = function(info){
    if(!status.rafLock){
      if (status.x < info.x){
        status.direction = 'right';
      }else{
        status.direction = 'left';
      }

      status.x = info.x;
      status.rafLock = true;

      requestAnimationFrame(function () {
        if (!status.initLock) {
          $page.classList.add('noneAnimation');
          $page.classList.add('pageShadow');
          status.initLock = true;
        }
        $page.style.transform = 'translate3d(' + info.x + 'px, 0, 0)';
        status.rafLock = false;
      });
    }
  }.bind(this);

  $backColumn.onSlideDone = function(info){
    requestAnimationFrame(function () {
      $page.style.transform = 'translate3d(' + info.x + 'px, 0, 0)';

      status.initLock = false;
      status.rafLock = false;

      requestAnimationFrame(function(){
        $page.classList.remove('noneAnimation');
        $page.style.transform = null;
        $page.classList.remove('pageShadow');
        
        requestAnimationFrame(function(){
          if (status.x > 70 && status.direction == 'right')
            history.back();
        });
      });
    });
  }
}