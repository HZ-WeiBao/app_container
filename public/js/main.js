
var ls_time_arr = {
    '1':'8:00',
    '2':'8:40',
    '3':'9:55',
    '4':'10:45',
    '5':'14:30',
    '6':'15:20',
    '7':'16:20',
    '8':'17:10',
    '9':'19:30',
    '10':'20:20',
    '11':'21:10'
};
var le_time_arr = {
    '1':'8:45',
    '2':'9:35',
    '3':'10:20',
    '4':'11:30',
    '5':'15:15',
    '6':'16:05',
    '7':'17:05',
    '8':'17:55',
    '9':'20:15',
    '10':'20:15',
    '11':'21:55'
};

//默认是选中今天
function setting(a,doms){
    var _this = this;
    this.state = a-1 || 0;
    this.value = function(){
        return doms[_this.state].getAttribute('value');
    };
    //绑定dom显示
    this.setDom = function (){
        css(doms[_this.state],{
            'background':'black',
            'color':'white'
        });
    };
    this.setDom();
    this.unsetDom = function (){
        css(doms[_this.state],{
            'background':'none',
            'color':'black'
        });
    };
    this.swtichTo = function(n){
        _this.unsetDom();
        _this.state = n;
        _this.setDom();
    };
    //事件绑定
    for(var i = 0; i < doms.length ; i++){
        !function(i){
            doms[i].addEventListener('click',function(){
                _this.swtichTo(i);
            });
        }(i);
    }

}
var wddoms = $$('select_wd')[0].getElementsByTagName('div');
var date = new Date();
var wd = date.getDay();
if(wd == 0) wd = 7;
var setting_wd = new setting(wd,wddoms);

var bddoms = $('select_bd').getElementsByTagName('div');
var setting_bd = new setting(1,bddoms);

$('select_ls').addEventListener('change',function(){
    if(parseInt($('select_ls').value)+1 > parseInt($('select_le').value) )
        $('select_le').value = parseInt($('select_ls').value)+1;
    $('ls_time').innerHTML = ls_time_arr[$('select_ls').value];
    $('le_time').innerHTML = le_time_arr[$('select_le').value];
});

$('select_le').addEventListener('change',function(){
    //自动跳到比ls+1的最小值
    if(parseInt($('select_ls').value)+1 > parseInt($('select_le').value) )
        $('select_le').value = parseInt($('select_ls').value)+1;
    $('le_time').innerHTML = le_time_arr[$('select_le').value];
});

$$('buttom_submit')[0].addEventListener('click',function(){
    var wd = parseInt(setting_wd.value())-1;
    css($$('display_result')[0],{
        'opacity':0,
        'transform':'translateY(-10px)'
    });
    ajax('get','action.php',{
        'wd':wd,
        'ls':$('select_ls').value,
        'le':$('select_le').value,
        'bd':setting_bd.value(),
    },'',function(rep){
        var result = JSON.parse(rep);
        //分类floor
        var floor = [];
        for(var i = 0 ; i < result.length ; i++){
            if(!checkIn(result[i][1],floor)){
                floor.push(result[i][1]);
            }
        }
        var floor_group = {};
        //填充数据
        for(i = 0; i < floor.length; i++ ){
            floor_group[floor[i]] = Array();
            for(var j =0 ; j < result.length; j++){
                if(result[j][1] == floor[i]){
                    floor_group[floor[i]].push(result[j][0]);
                }
            }
        }
        //用恶心的拼接大法
        var result_dom = '<div class="chunk">';
        for(i = 0; i < floor.length; i++ ){
            result_dom += '<div class="column animation_list" style="transform:translateY(50px);transition-delay:'+(i/26)+'s">';
            for(j = 0; j < floor_group[floor[i]].length ; j++){
                result_dom += '<div>'+floor_group[floor[i]][j]+'</div>';
            }
            result_dom += '</div>';
            if( (i+1) % 3 == 0){
                result_dom += '</div><div class="chunk">';
            }
        }
        result_dom += '</div>';
        setTimeout(function(){
            $$('display_result')[0].innerHTML = result_dom;
            css($$('display_result')[0],{
                'opacity':1,
                'transform':'translateY(0px)'
            });
            setTimeout(function(){
                //tr animation
                var div = $$('display_result')[0].getElementsByClassName('animation_list');
                for(var i=0; i < div.length; i++){
                    css(div[i],{
                        'transform':'translateY(0px)'
                    });
                }
            },20);
        },400);
    });
});

//样式初始化

$$('logo')[0].getElementsByTagName('img')[0].src =  'img/hello-'+wd+'.jpg';

//问题反馈提交

$('contactMe').onclick = function(){
    maskOn($('rp_cancel').onclick);
    css($('report'),{
        'display': 'block',
        'z-index': '100',
    });
    setTimeout(function() {
        css($('report'),{
            'opacity': '1'
        });
    }, 10);
}

$('rp_cancel').onclick = function(){
    css($('report'),{
        'opacity': '0'
    });
    setTimeout(function() {
        css($('report'),{
        'display': 'none',
        'z-index': '-10',
    });
    }, 300);
    maskOff();
}

$('rp_comfirm').onclick = function(){
    //检查内容
    if($('rp_content').innerText.length < 5){
        alert('希望详细一点~~');
    }else if($('rp_content').innerText.length > 400){
        alert('希望言简意骇~~');
    }else{
        ajax('post','action.php',{'act':'feeback'},JSON.stringify({
            'content':$('rp_content').innerText
        }),function(rep){
            var result = JSON.parse(rep);
            console.log(result);
            if(result.isOk){
                alert('谢谢反馈~~');
                $('rp_cancel').onclick();
            }else{
                alert('未知错误~');
                $('rp_cancel').onclick();
            }
        });
    }
}

function maskOn(func){
    css($('mask'),{
        'display': 'block',
        'z-index': '100',
        
    });
    setTimeout(function() {
        css($('mask'),{
            'opacity': '0.3'
        });
    }, 10);
    //禁止页面滚动
    // document.body.style.overflow='hidden';
    css($('mask-blur'),{
        '-webkit-filter': 'blur(1.5px)',
        'filter': 'blur(1.5px)',
    });
    $('mask').onclick = function(){
        if(func) func();
        maskOff();
    };
    //至于mask使用的唯一性,只能通过自己注意一下
}
function maskOff(){
    css($('mask'),{
        'opacity': '0'
    });
    setTimeout(function() {
        css($('mask'),{
            'display': 'none',
            'z-index': '-10',
        });
    }, 300);
    // document.body.style.overflow='';
    css($('mask-blur'),{
        '-webkit-filter': 'blur(0px)',
        'filter': 'blur(0px)',
    });
}