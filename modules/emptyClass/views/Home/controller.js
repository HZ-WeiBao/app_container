//这里存放所有controller相互调用的操作
//比如一个Home调用Person里面的一个操作,然而这个数据发送前,发送后的行为将会定义在这里

//其实还是不太需要action.js,不然每次请求的速度都会减慢很多的

//还有dom的一些event也是可以在这里布局的,不过返回结构页面的event就要写在action了,这还是感觉责任不清晰,也不单一

exports.deps = {
    'css': [
        // 'emptyClass/views/Home/custom.css'
    ],
    'js': [
        // {name:'custom',  url:'emptyClass/views/Home/custom.js'},
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
    }, 35);
    console.log('首页加载成功~~send from 小小框架~~');
    week_selection.init();
    building_selection.init();
    courseStartEndSelector.init();
}

exports.actionQuery = function() {
    //将会需要手动从dom里面提取数据
    //这一部分其实可以自动化一些
    var $display_result = document.querySelector('.display_result');
    css($display_result, {
        'opacity': 0,
        'transform': 'translateY(-10px)'
    });

    //验证

    //发送后台服务地址拿数据
    Ajax({
        method: 'get',
        url: this.Router.url(),
        arg: {
            ls: courseStartEndSelector.value().ls,
            le: courseStartEndSelector.value().le,
            wd: week_selection.value(),
            bd: building_selection.value()
        },
        func: function(rep) {
            var result = JSON.parse(rep);
            var $display_result = document.querySelector('.display_result');
            var floor = [];
            //因为没有提取出floor所以需要在这里提取出来
            for (var i = 0; i < result.length; i++) {
                var match = result[i]['room'].match(/\d-\w+/);
                if (!match || match[0] !== result[i]['room']) {
                    result.splice(i, 1);
                    i--;
                } else {
                    result[i]['floor'] = result[i]['room'].match(/-\w*?(\d)/i)[1];
                }
            }
            // console.log(result);
            for (var i = 0; i < result.length; i++) {
                if (!checkIn(result[i]['floor'], floor)) {
                    floor.push(result[i]['floor']);
                }
            }
            var floor_group = {};
            //填充数据
            for (i = 0; i < floor.length; i++) {
                floor_group[floor[i]] = Array();
                for (var j = 0; j < result.length; j++) {
                    if (result[j]['floor'] == floor[i]) {
                        floor_group[floor[i]].push(result[j]['room']);
                    }
                }
            }
            //用恶心的拼接大法
            var result_dom = '<div class="chunk">';
            for (i = 0; i < floor.length; i++) {
                result_dom += '<div class="column animation_list" style="transform:translateY(50px);transition-delay:' + (i / 26) + 's">';
                for (j = 0; j < floor_group[floor[i]].length; j++) {
                    result_dom += '<div>' + floor_group[floor[i]][j] + '</div>';
                }
                result_dom += '</div>';
                if ((i + 1) % 3 == 0) {
                    result_dom += '</div><div class="chunk">';
                }
            }

            result_dom += '</div>';
            setTimeout(function() {
                $display_result.innerHTML = result_dom;
                css($display_result, {
                    'opacity': 1,
                    'transform': 'translateY(0px)'
                });
                setTimeout(function() {
                    //tr animation
                    var div = $display_result.getElementsByClassName('animation_list');
                    for (var i = 0; i < div.length; i++) {
                        css(div[i], {
                            'transform': 'translateY(0px)'
                        });
                    }
                }, 20);
            }, 400);
        }
    });

    //处理返回的数据包这里也是可以弄一个自动parse,xhr应该是可以会去返回的状态码之类的

    //最后动画处理

    //控件事件绑定

}


//控件的添加定义并且声明
widget.add('singleSelect', function(getDom, initialStatus) {
    //widget的api说明,
    //通用是使用init来初始化事件绑定的
    //还有一个状态的接口其实可以模仿一下现在以后的widget的有哪些接口,比如一些自带的控件就是拉

    //关于这个widget的有关dom格式约定
    //ul>li*n

    //真的如果是这样去写基本上全部都是需要改造...终于开始厌烦重复制造轮子啦,因为发现已经没有什么激情了,这还是感觉责任不清晰

    var _status = initialStatus || 0; //其实这个和的顺序相绑定还是可以的
    var _lastItem = initialStatus || 0;
    var _eventList = [];
    var dom;

    this.init = function() {
        dom = getDom();
        dom.querySelectorAll('div[value]').forEach(function(item, key) {
            //状态的切换这是一定需要的了
            item.addEventListener('mousedown', function() {
                if (_status != key) {
                    _status = key;
                    //css切换
                    item.classList.add('selected');
                    dom.querySelectorAll('div[value]')[_lastItem].classList.remove('selected');
                    _lastItem = key;
                }
            });
            //自定义的event,不过是批量的
            _eventList.forEach(function(func, event) {
                item.addEventListener(event, func);
            });
        });

        //初始化
        dom.querySelectorAll('div[value]')[_status].classList.add('selected');
    }
    this.value = function() {
        return dom.querySelectorAll('div[value]')[_status].getAttribute('value');
    };

    ///事件拓展~~~,不过不支持多个,但是基本上也是够用的的,如果还是添加更多就是直接添加就行咯不走这个widget
    this.onclick = function(func) {
        _eventList.click = func;
    }

});

var weekDay = (new Date()).getDay() - 1;
weekDay = (weekDay == -1) ? 6 : weekDay;

var week_selection = new widget.singleSelect(
    function() { return document.querySelector('.select_wd') }, weekDay);

var building_selection = new widget.singleSelect(
    function() { return document.querySelector('.select_bd') });

widget.add('courseStartEndSelector', function(getDom) {

    var $select_ls, $select_le, $ls_time, $le_time, dom

    ls_time_arr = {
            '1': '8:00',
            '2': '8:50',
            '3': '9:50',
            '4': '10:45',
            '5': '14:30',
            '6': '15:20',
            '7': '16:15',
            '8': '17:05', //
            '9': '19:30',
            '10': '20:20',
            '11': '21:10'
        },
        le_time_arr = {
            '1': '8:45',
            '2': '9:35',
            '3': '10:40',
            '4': '11:30',
            '5': '15:15',
            '6': '16:05',
            '7': '17:00',
            '8': '17:50', //
            '9': '20:15',
            '10': '20:15',
            '11': '21:55'
        };

    this.init = function() {
        dom = getDom();
        $select_ls = dom.querySelector('#select_ls'),
            $select_le = dom.querySelector('#select_le'),
            $ls_time = dom.querySelector('#ls_time'),
            $le_time = dom.querySelector('#le_time');

        $select_ls.addEventListener('change', function() {
            if (parseInt($select_le.value, 10) < parseInt($select_ls.value, 10))
                $select_le.value = $select_ls.value;
            $ls_time.innerHTML = ls_time_arr[$select_ls.value];
            $le_time.innerHTML = le_time_arr[$select_le.value];
        });
        $select_le.addEventListener('change', function() {
            if (parseInt($select_le.value, 10) < parseInt($select_ls.value, 10))
                $select_ls.value = $select_le.value;
            $ls_time.innerHTML = ls_time_arr[$select_ls.value];
            $le_time.innerHTML = le_time_arr[$select_le.value];

        });
    };
    this.value = function() {
        return {
            'ls': $select_ls.value,
            'le': $select_le.value,
        }
    }
});

var courseStartEndSelector = new widget.courseStartEndSelector(
    function() { return document.querySelector('.select_l') });