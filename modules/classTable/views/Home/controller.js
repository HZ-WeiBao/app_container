exports.deps = {
  'js': [
    // {name:'custom1', url:'emptyClass/views/Home/custom1.js'}
  ]
};

exports.actionIndex = function() {
  var $inputKeyword = document.querySelector('.inputKeyword input');
  var valid_input = new RegExp(/\d+\D+\d+班/g);
  
  if($inputKeyword.value.match(valid_input))
    exports.viewUpdateMatchList();

  //缩放
  var $displayer = document.querySelector('.display_result'),
    startTouches, movingTouhces, 
    startLen, movingLen,
    originStartX, originStartY,
    originMobingX, originMobingY,
    centerStartX, centerStartY,
    centerMovingX, centerMovingY;

  function getLenOf2Point(pointA, pointB){
    return Math.sqrt(
      Math.pow((pointA.clientX - pointB.clientX), 2) + 
      Math.pow((pointA.clientY - pointB.clientY), 2)
    )
  }

  $displayer.addEventListener('touchstart', function(e){
    var rect;

    if(e.touches.length === 2){
      startTouches[0] = e.touches[0];
      startTouches[1] = e.touches[1];

      centerStartX = (startTouches[0].clientX + startTouches[1].clientX) / 2;
      centerStartY = (startTouches[0].clientY + startTouches[1].clientY) / 2;
      
      rect = $displayer.getBoundingClientRect();
      originStartX = centerStartX - rect.x;
      originStartY = centerStartY - rect.y;
      startLen = getLenOf2Point(startTouches[0], startTouches[1]);

    }
  });

  $displayer.addEventListener('touchmove', function(e){
    var offsetX, offsetY, scale;

    if(e.touches.length === 2){
      movingTouhces[0] = e.touches[0];
      movingTouhces[1] = e.touches[1];

      centerMovingX = (movingTouches[0].clientX + movingTouches[1].clientX) / 2;
      centerMovingY = (movingTouches[0].clientY + movingTouches[1].clientY) / 2;
      
      rect = $displayer.getBoundingClientRect();
      originMovingX = centerMovingX - rect.x;
      originMovingY = centerMovingY - rect.y;
      movingLen = getLenOf2Point(movingTouches[0], movingTouches[1]);

      offsetX = originMovingX - originStartX;
      offsetY = originMovingY - originStartY;
      scale = (movingLen - startLen) / 1.5;

      requestAnimationFrame(function(){
        $displayer.style.transform = 
          'translate3d('+offsetX+'px,'+offsetY+'px,0) scale('+scale+')';
      });
    }
  });
}

exports.viewUpdateMatchList = function() {
  var $inputKeyword = document.querySelector('.inputKeyword input');
  var valid_input = new RegExp(/\d+\D+\d+班/g);

  css($$('display_result')[0], {
    'opacity': 0,
    'transform': 'translateY(-10px)'
  });

  if ( $inputKeyword.value == 'PHP是世界上最好的语言' ) {
    alert('我也这样觉得~');
  } else if ( $inputKeyword.value.trim().length < 1 ) {
    alert('不输入东西,不能愉快的搜索了~');
  } else if ( !$inputKeyword.value.match(valid_input) ) {
    alert('格式不太对,找到的数据也会不太对的~');
  }else
    Ajax({
      method: 'get',
      url: this.Router.url('Home', 'Query'),
      arg: {
        majorName: $inputKeyword.value
      },
      func: function(rep) {
        var result = JSON.parse(rep);
        var weekDay = ['一', '二', '三', '四', '五', '六', '日'];
        var weekly = ['', '单', '双'];
        var $display_result = document.querySelector('.display_result ');

        var $table = strToDom(`
        <table border="1">
          <tr>
            <th colspan="2">微报</th>
            <th>星期一</th>
            <th>星期二</th>
            <th>星期三</th>
            <th>星期四</th>
            <th>星期五</th>
            <th>星期六</th>
            <th>星期日</th>
          </tr>
          <tr>
            <th rowspan="2">上午</th>
            <td>一</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>二</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th rowspan="2">下午</th>
            <td>三</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>四</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th rowspan="3">晚上</th>
            <td>五</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>六</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
        `);

        result.forEach(function(info){
          var $tr = $table.getElementsByTagName('tr')[Math.floor(parseInt(info.sectionStart) / 2) + 1],
            $td = $tr.getElementsByTagName('td')[parseInt(info.weekDay) +1];

          var content = info.name + '<br>';
          content += info.teacher + '<br>';
          content += shorten_week_has_class(info.weekHaveClass) + '周'
          if (weekly[info.weekly] == ''){
            content += weekly[info.weekly]
          }else
            content += '['+ weekly[info.weekly]+']'
          content += '['+info.sectionStart+'-'+info.sectionEnd+'节]'+ '<br>';
          content += info.room;

          var $div = document.createElement('div');
          $div.innerHTML = content;

          $td.appendChild($div);
        });
        
        $display_result.innerHTML = '';
        $display_result.appendChild($table);

        css($$('display_result')[0], {
          'opacity': 1,
          'transform': 'translateY(0px)'
        });
      }
    });
};

function shorten_week_has_class(str) {
  var arr = str.split(',');
  var first = parseInt(arr[0]);
  var next = first + 1;
  var now = null;
  var result = [];
  for (var i = 1; i < arr.length; i++) {
    now = parseInt(arr[i]);
    if (now == next) {
      next++;
    } else {
      result.push(first + '-' + (next - 1));
      first = now;
      next = now + 1;
    }
  }
  if (first != --next)
    result.push(first + '-' + next);
  else
    result.push(first.toString());
  return result;
}