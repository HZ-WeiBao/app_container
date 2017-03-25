var date = new Date();
var wd = date.getDay();
if(wd == 0) wd = 7;

var week_day = ['一','二','三','四','五','六','日'];
var weekly = ['','单','双'];

//样式初始化

$$('logo')[0].getElementsByTagName('img')[0].src = 'img/hello-'+wd+'.png';