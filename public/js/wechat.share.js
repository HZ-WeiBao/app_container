
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    window.shareData = {
        "imgUrl": "http://deepkolos.cn/Demo/addRedHat/img/4.png",
        "sendFriendLink": "http://deepkolos.cn/Demo/addRedHat/",
        "weiboLink": "http://deepkolos.cn/Demo/addRedHat/",
        "timeLineLink": "http://deepkolos.cn/Demo/addRedHat/",
        "tTitle": "圣诞大装扮~惠大微报",
        "tContent": "由惠州学院最大微信公众号惠大微报提供支持",
        "fTitle": "圣诞大装扮~惠大微报",
        "fContent": "由惠州学院最大微信公众号惠大微报提供支持",
        "wContent": "由惠州学院最大微信公众号惠大微报提供支持",
    };
    // 发送给好友
    WeixinJSBridge.on('menu:share:appmessage', function (argv) {
        WeixinJSBridge.invoke('sendAppMessage', {
            "img_url": window.shareData.imgUrl,
            "img_width": "640",
            "img_height": "640",
            "link": window.shareData.sendFriendLink,
            "desc": window.shareData.fContent,
            "title": window.shareData.fTitle
        }, function (res) {
            _report('send_msg', res.err_msg);
        })
    });
    // 分享到朋友圈
    WeixinJSBridge.on('menu:share:timeline', function (argv) {
        WeixinJSBridge.invoke('shareTimeline', {
            "img_url": window.shareData.imgUrl,
            "img_width": "640",
            "img_height": "640",
            "link": window.shareData.timeLineLink,
            "desc": window.shareData.tContent,
            "title": window.shareData.tTitle
        }, function (res) {
            _report('timeline', res.err_msg);
        });
    });

    // 分享到微博
    WeixinJSBridge.on('menu:share:weibo', function (argv) {
        WeixinJSBridge.invoke('shareWeibo', {
            "content": window.shareData.wContent,
            "url": window.shareData.weiboLink,
        }, function (res) {
            _report('weibo', res.err_msg);
        });
    });
}, false)