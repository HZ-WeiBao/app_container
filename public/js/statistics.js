
//获取数据初始化

var appName = 'get_empty_class';

!function(){
    ajax('get','action.php',{
        'act':'init_num'
    },'',function(rep){
        var result = JSON.parse(rep);
        $$('num_of_like')[0].innerHTML = result.num_of_like;
        $$('num_of_use')[0].innerHTML = result.num_of_use;
    });
    //查看cookie是否点赞了
    if(getCookie(appName+'_like') == 'true'){
        $$('bt_like')[0].getElementsByTagName('img')[0].setAttribute('src','./img/hearted.png');
        $$('num_of_like')[0].style.color = 'lightcoral'
    }
}();

//点赞
$$('bt_like')[0].onclick = function(){
    if(getCookie(appName+'_like') != 'true'){
        ajax('get','action.php',{
            'act':'like'
        },'',function(rep){
            setCookie(appName+'_like','true',2);
            $$('num_of_like')[0].innerHTML = parseInt($$('num_of_like')[0].innerHTML)+1;
        });
        $$('bt_like')[0].getElementsByTagName('img')[0].setAttribute('src','./img/hearted.png');
        $$('num_of_like')[0].style.color = 'lightcoral'
    }
}
//之后会整合出一个龙猫小应用框架的