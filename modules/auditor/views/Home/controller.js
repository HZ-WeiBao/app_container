exports.deps = {
    'js': [
        // {name:'custom1', url:'emptyClass/views/Home/custom1.js'}
    ]
};

exports.actionIndex = function() {

}

exports.viewUpdateMatchList = function() {
    var $inputKeyword = document.querySelector('.inputKeyword input');

    css($$('display_result')[0],{
        'opacity':0,
        'transform':'translateY(-10px)'
    });

    if($inputKeyword.value == 'PHP是世界上最好的语言'){
        alert('我也这样觉得~');
    }else if($inputKeyword.value.trim().length < 1){
        alert('不输入东西,不能愉快的搜索了~');
    }else
        Ajax({
            method:'get',
            url:this.Router.url('Home','SearchCourse'),
            arg:{
                keyWord:$inputKeyword.value
            },
            func:function(rep){
                var result = JSON.parse(rep);
                var display_result = $$('display_result')[0];
                if(result){
                    if(result.length >0){
                        var list = strToDom('\
                        <ul class="possible_options"></ul>\
                        ');
                        for(var i = 0; i < result.length ; i++){
                            var li = strToDom('\
                            <li style="display: block;"><a href="#Home/CourseDetial?id='+result[i].id+'">'+result[i].name+'</a></li>\
                            ');
                            css(li,{
                                'transform':'translateY(50px)',
                                'transition-delay':(i/28)+'s',
                            });
                            list.appendChild(li);
                        }
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
            }
        });
};

exports.actionCourseDetial = function(args){
    var weekDay = ['一','二','三','四','五','六','日'];
    var weekly = ['','单','双'];

    this.Page.load({
        method:'get',
        url:this.Router.url(),
        arg:{
            id:args.id
        },
        func:function(rep){
            //显示课程数据
            var result = JSON.parse(rep);
            //首行
            var table=strToDom('\
            <div class="display_result">\
            <table border="1">\
                <tbody>\
                </tbody>\
            </table>\
            <a href="#back"><div class="btnOneLine">返回</div></a>\
            </div>\
            ');
            var trs = '\
            <tr>\
                <td>课程</td>\
                <td>老师</td>\
                <td>周次</td>\
                <td>节次</td>\
                <td>课室</td>\
            </tr>\
            ';
            for(var i = 0 ; i < result.length; i++){
                var section = '星期'+weekDay[result[i]['weekDay']]+'<br>['+result[i]['sectionStart']+'-'+result[i]['sectionEnd']+']<br>'+weekly[result[i]['weekly']];
                var teacher = result[i]['teacher'].split(' ');
                    teacher = teacher.join('<br>');
                    teacher = teacher.replace(/（(.+)）/g,'<br>$1');
                var week_have_class = shorten_week_has_class(result[i]['weekHaveClass']);
                var name = result[i]['name'];
                trs += '<tr style="transform:translateY(50px);transition-delay:'+(i/26)+'s!important;">';
                if(name.length > 7){
                    var fornt_major_name = name.slice(0,name.length/2);
                    var back_major_name = name.slice(name.length/2,name.length);
                    name = fornt_major_name+'<br>'+back_major_name;
                }
                var place_name_full = result[i]['room'].replace(/（(.+)）/g,'<br>$1');
                // 山根祥子（ShokoYamane）
                    week_have_class = week_have_class.join('<br>');
                    trs += '<td>'+name+'</td>';
                    trs += '<td>'+teacher+'</td>';
                    trs += '<td>'+week_have_class+'</td>';
                    trs += '<td>'+section+'</td>';
                    trs += '<td>'+place_name_full+'</td>';
                trs += '</tr>';
            }
            table.getElementsByTagName('tbody')[0].innerHTML = trs;

            setTimeout(function(){
                //tr animation
                var tr = document.querySelectorAll('.display_result tr');
                for(var i=0; i < tr.length; i++){
                    tr[i].style.transform = 'translateY(0px)';
                }
            },400);
            if(result.length != 0)
                return table.outerHTML;
            else{
                return strToDom('\
                <div><div style="height:1px;"></div>\
                <div class="messageEmpty">没有数据~</div>\
                <a href="#back"><div class="btnOneLine">返回</div></a>\
                <div>').outerHTML;
            }
        }
    });
};

function shorten_week_has_class(str){
    var arr = str.split(',');
    var first = parseInt(arr[0]);
    var next = first+1;
    var now = null;
    var result = [];
    for(var i = 1 ; i < arr.length ;i++){
        now = parseInt(arr[i]);
        if(now == next){
            next++;
        }else{
            result.push(first+'-'+(next-1));
            first = now;
            next  = now+1;
        }
    }
    if(first != --next)
        result.push(first+'-'+next);
    else
        result.push(first.toString());
    return result;
}