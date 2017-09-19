
exports.init = function($scrollBar,$showing_letter,config){
  if(!config)
    config = {};
  
  var letter_start,scrollFunc,letterShow,letterUnShow
      w_height = screen.height,
      optionsLength = $scrollBar.querySelectorAll('div').length;
      $scrollBar.s_offsetTop = config.scrollBarOffsetTop || $scrollBar.offsetTop;
      $scrollBar.s_clientHeight = config.scrollBarClientHeight || $scrollBar.clientHeight;
      $scrollBar.o_clientHeight = $scrollBar.s_clientHeight / optionsLength;

  $scrollBar.trunOn = function(){
    $scrollBar.style['display'] = 'block';
    setTimeout(function(){
      $scrollBar.classList.remove('off');
      $scrollBar.classList.add('on');
    },35);
  }
  $scrollBar.trunOff = function(){
    $scrollBar.style['display'] = 'none';
    $scrollBar.classList.add('off');
    $scrollBar.classList.remove('on');
  }

  scrollFunc = function(){
    //根据来触发letter_start就行了
    var letter = $scrollBar.children[letter_start].innerHTML;
    $showing_letter.innerHTML = $scrollBar.children[letter_start].innerHTML;
    //定位的func由外部编写
    if ($scrollBar.onScroll)
      $scrollBar.onScroll(letter);
  };

  letterShow = function(){
    $scrollBar.classList.add('pressing');
    $showing_letter.classList.add('on');
  };
  letterUnShow = function(){
    $scrollBar.classList.remove('pressing');
    $showing_letter.classList.remove('on');
  };

  $scrollBar.addEventListener('touchstart',function(e){
    var moving_y = e.touches[0].clientY;
    
    letter_start = parseInt((moving_y - $scrollBar.s_offsetTop) / $scrollBar.o_clientHeight);
    scrollFunc();
    letterShow();
  });

  $scrollBar.addEventListener('touchend',letterUnShow);

  $scrollBar.onSlide = function(info){
    var letter_moving;

    if (info.y > $scrollBar.s_offsetTop && info.y < $scrollBar.s_offsetTop + $scrollBar.s_clientHeight){
      letter_moving = parseInt(
        (info.y - $scrollBar.s_offsetTop) / $scrollBar.o_clientHeight
      );

      if(letter_moving != letter_start){
        letter_start = letter_moving;
        scrollFunc();
      }
    }
  };
}