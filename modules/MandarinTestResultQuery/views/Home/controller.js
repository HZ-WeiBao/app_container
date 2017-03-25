
exports.actionIndex = function () {
    //一般首页是没有东西需要执行的,但是也可以干点其他事情滴~~
    //如果是action一般是不会去设置什么东西但是是需要有默认的切换事件的
    this.Loader.cssSwitch();
    setTimeout(function () {
        document.querySelector('.module_body').classList.remove('noneAnimation');
        document.querySelector('.module_body').style.opacity = 1;
    }, 0);
    console.log('首页加载成功~~send from 小小框架~~');
    oldInit();
}

function oldInit() {
    var isShowingIdentPhote = false;
    var selfieUrl = null;
    $$('buttom_submit')[0].addEventListener('click', function () {
        if (!isShowingIdentPhote) {
            isShowingIdentPhote = true;
            Ajax({
                method: 'post',
                url: 'MandarinTestResultQuery/home/query',
                data: JSON.stringify({
                    'studentID': $('studentID').value,
                    'studentName': $('studentName').value,
                    'studentIDCard': $('studentIDCard').value
                }),
                func: function (rep) {
                    var result = JSON.parse(rep);
                    if (result['selfieUrl'] != null) {//有自拍找表示查询成功
                        selfieUrl = result['selfieUrl'];
                        //设置按钮样式
                        $$('buttom_submit')[0].innerHTML = '可爱<img src=\'img/hitme_mini.gif\'>自拍';
                    }
                    $$('display_result')[0].innerHTML = result['dom'];
                }
            });
        } else {
            if (selfieUrl != null) {
                $$('display_result')[0].innerHTML = '<img class="selfie" src="' + selfieUrl + '" alt="你的可爱自拍">';
                $$('me')[0].style.opacity = 0;
            }
        }
    });
}