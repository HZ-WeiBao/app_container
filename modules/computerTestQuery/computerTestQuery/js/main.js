
var date = new Date();
var wd = date.getDay();
if(wd == 0) wd = 7;

var week_day = ['一','二','三','四','五','六','日'];
var weekly = ['','单','双'];

var schoolCodeInput = inputHit($('schoolCodeInput'));
var validCodeInput = inputHit($('validCodeInput'));


$$('buttom_submit')[0].addEventListener('click',function(){
    if($('schoolCodeInput').value == schoolCodeInput.defalutText()){
        alert('空即是色,色既是空~');
        return 0;
    }else if($('validCodeInput').value == validCodeInput.defalutText()){
        alert('验证码捏~');
        return 0;
    }
    css($$('display_result')[0],{
        'opacity':0,
        'transform':'translateY(-10px)'
    });
    ajax('get','action.php',{
        'studentCode':$('schoolCodeInput').value,
        'validCode':$('validCodeInput').value
    },'',function(rep){
        var result = JSON.parse(rep);
        var display_result = $$('display_result')[0];
        if(result){
            if(result.length >0){
                var list = strToDom('\
                <ul class="possible_options"></ul>\
                ');
                for(var i = 0; i < result.length ; i++){
                    var li = strToDom('\
                    <li style="display: block;"><a href="#" onclick="return get_course_detial(this)">'+result[i].major_name+'</a></li>\
                    ');
                    css(li,{
                        'transform':'translateY(50px)',
                        'transition-delay':(i/28)+'s',
                    });
                    list.appendChild(li);
                }
                console.log(result);
            }else{
                var list = strToDom('\
                <div style="text-align:center;margin-top:30px;">找不到~</div>\
                ');
            }
            setTimeout(function(){
                display_result.innerHTML = '';
                display_result.appendChild(list);
                css(display_result,{
                    'opacity':1,
                    'transform':'translateY(0px)'
                });
                setTimeout(function(){
                    //list animation
                    var li = list.getElementsByTagName('li');
                    for(var i=0; i < li.length; i++){
                        css(li[i],{
                            'transform':'translateY(0px)'
                        });
                    }
                    !function(){
                        var li_ = li
                        setTimeout(function(){
                            for(var i=0; i < li_.length; i++){
                                css(li_[i],{
                                    // 'transform':'translateY(50px)',
                                    'transition-delay':'0s'
                                });
                            }
                        },360);
                    }();
                },17);
            },350);
        }
    });
});

//样式初始化

$$('logo')[0].getElementsByTagName('img')[0].src =  'img/hello-'+wd+'.jpg';

//其实课程大概也就是993多个,额还以为很少呢

function getValidCode(){
    ajax('get','action.php',{
        'act':'getValidCode'
    },'',function(rep){
        $('validCodeImg').setAttribute('src',rep);
    });
}
