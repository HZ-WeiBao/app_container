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