exports.deps = {
    'js': [
        // {name:'custom1', url:'emptyClass/views/Home/custom1.js'}
    ]
};

exports.actionIndex = function() {
    //一般首页是没有东西需要执行的,但是也可以干点其他事情滴~~
    //如果是action一般是不会去设置什么东西但是是需要有默认的切换事件的
    this.Loader.cssSwitch();
    setTimeout(function() {
        document.querySelector('.module_body').classList.remove('noneAnimation');
        document.querySelector('.module_body').style.opacity = 1;
    }, 30);
    console.log('首页加载成功~~send from 小小框架~~');
    oldInit();
}

exports.actionInfo = function() {

}

var date = new Date();
var wd = date.getDay();
if (wd == 0) wd = 7;

var weekDay = ['一', '二', '三', '四', '五', '六', '日'];
var weekly = ['', '单', '双'];

function oldInit() {

    var _orginal_text = $('searchCourse').value;
    $('searchCourse').onfocus = function() {
        if (this.value == _orginal_text) {
            this.value = '';
            css(this, {
                color: 'black'
            });
        }
    }
    $('searchCourse').onblur = function() {
        if (this.value == '') {
            this.value = _orginal_text;
            css(this, {
                color: 'lightgray'
            });
        }
    }

    $$('buttom_submit')[0].addEventListener('click', function() {
        if ($('searchCourse').value == _orginal_text) {
            return 0;
        }
        css($$('display_result')[0], {
            'opacity': 0,
            'transform': 'translateY(-10px)'
        });
        Ajax({
            method: 'get',
            url: 'auditor/Home/searchCourse',
            arg: {
                'keyWord': $('searchCourse').value
            },
            func: function(rep) {
                var result = JSON.parse(rep);
                var display_result = $$('display_result')[0];
                if (result) {
                    if (result.length > 0) {
                        var list = strToDom('\
                    <ul class="possible_options"></ul>\
                    ');
                        for (var i = 0; i < result.length; i++) {
                            var li = strToDom('\
                        <li style="display: block;"><a href="#" onclick="return F.controller.get_course_detial(this)">' + result[i].name + '</a></li>\
                        ');
                            css(li, {
                                'transform': 'translateY(50px)',
                                'transition-delay': (i / 28) + 's',
                            });
                            list.appendChild(li);
                        }
                        // console.log(result);
                    } else {
                        var list = strToDom('\
                    <div style="text-align:center;margin-top:30px;">找不到~</div>\
                    ');
                    }
                    setTimeout(function() {
                        display_result.innerHTML = '';
                        display_result.appendChild(list);
                        css(display_result, {
                            'opacity': 1,
                            'transform': 'translateY(0px)'
                        });
                        setTimeout(function() {
                            //list animation
                            var li = list.getElementsByTagName('li');
                            for (var i = 0; i < li.length; i++) {
                                css(li[i], {
                                    'transform': 'translateY(0px)'
                                });
                            }! function() {
                                var li_ = li
                                setTimeout(function() {
                                    for (var i = 0; i < li_.length; i++) {
                                        css(li_[i], {
                                            // 'transform':'translateY(50px)',
                                            'transition-delay': '0s'
                                        });
                                    }
                                }, 360);
                            }();
                        }, 17);
                    }, 350);
                }
            }
        });
    });

    //当输入框变化的时候,自动模糊搜索
    $('searchCourse').onkeypress = function() {

    }
}

exports.get_course_detial = function(a) {
    var display_result = $$('display_result')[0];
    css(display_result, {
        'opacity': 0,
        'transform': 'translateY(-5px)'
    });
    Ajax({
        method: 'get',
        url: 'auditor/Home/getCourseDetial',
        arg: {
            'courseInfo': a.innerHTML.trim()
        },
        func: function(rep) {
            //显示课程数据
            var result = JSON.parse(rep);
            // console.log(result);
            //首行
            var table = strToDom('\
            <table border="1">\
                <tbody>\
                </tbody>\
            </table>\
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
            for (var i = 0; i < result.length; i++) {
                var section = '星期' + weekDay[result[i]['weekDay']] + '<br>[' + result[i]['sectionStart'] + '-' + result[i]['sectionEnd'] + ']<br>' + weekly[result[i]['weekly']];
                var teacher = result[i]['teacher'].split(' ');
                teacher = teacher.join('<br>');
                teacher = teacher.replace(/（(.+)）/g, '<br>$1');
                var weekHaveClass = shorten_week_has_class(result[i]['weekHaveClass']);
                var name = result[i]['name'];
                trs += '<tr style="transform:translateY(50px);transition-delay:' + (i / 26) + 's">';
                if (name.length > 7) {
                    var fornt_name = name.slice(0, name.length / 2);
                    var back_name = name.slice(name.length / 2, name.length);
                    name = fornt_name + '<br>' + back_name;
                }
                var room = result[i]['room'].replace(/（(.+)）/g, '<br>$1');
                // 山根祥子（ShokoYamane）
                weekHaveClass = weekHaveClass.join('<br>');
                trs += '<td>' + name + '</td>';
                trs += '<td>' + teacher + '</td>';
                trs += '<td>' + weekHaveClass + '</td>';
                trs += '<td>' + section + '</td>';
                trs += '<td>' + room + '</td>';
                trs += '</tr>';
            }
            table.getElementsByTagName('tbody')[0].innerHTML = trs;

            setTimeout(function() {
                $$('display_result')[0].innerHTML = '';
                $$('display_result')[0].appendChild(table);
                if (result.length == 0) {
                    $$('display_result')[0].innerHTML = 'empty~'
                }
                css($$('display_result')[0], {
                    'opacity': 1,
                    'transform': 'translateY(5px)'
                });
                setTimeout(function() {
                    //tr animation
                    var tr = table.getElementsByTagName('tr');
                    for (var i = 0; i < tr.length; i++) {
                        css(tr[i], {
                            'transform': 'translateY(0px)'
                        });
                    }
                }, 20);
            }, 350);
        }
    });
}

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