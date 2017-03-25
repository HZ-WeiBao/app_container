//算了全部自己再写一一遍,当作是自己的复习

//@NetWork

function ajax(method,url,arg,content,func){
    function arrToUrlArg(obj){
        var arg = '?';
        for(var p in obj)
            arg += p+'='+obj[p]+'&';
        return arg.slice(0,-1);
    }

	var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if((xhr.status >= 200 && xhr.status < 300 && xhr.readyState == 4 ) || xhr.readyState == 304){
            func(xhr.responseText);
        }
    };
    xhr.open(method,url+arrToUrlArg(arg),true);
    xhr.send(content);
    return xhr;
}

function setCookie(key,value,expiredays){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = key+'='+escape(value)+((expiredays==null)?'':';expires='+exdate.toGMTString());
}
function getCookie(key){
    var cookies = document.cookie.split('; ');
    for(var i=0 ; i < cookies.length ; i++){
        if(cookies[i].indexOf(key+'=') != -1)
            return unescape(cookies[i].split(key+'=').join(''));
    }
    return -1;
}

//@DOM

function $(elem){
    return document.getElementById(elem);
}

function $$(elem){
    return document.getElementsByClassName(elem);
}

function css(elem,style){
    for(var p in style){
        elem.style[p] = style[p];
    }
}

//array

function checkIn(arg,arr){
    for(var i = 0; i < arr.length; i++){
        if(arr[i] == arg )
            return true;
    }
    return false;
}

//这就是不学习的坏处,明明已经是内置了一个in 操作符了,还自己写一个函数,哈哈~~~