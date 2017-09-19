exports.deps = {
  css:['/frame/views/Home/Error.css']
}

exports.actionQuery = function() {
    var $id = document.querySelector('#studentID'),
        $name = document.querySelector('#studentName'),
        $cardId = document.querySelector('#studentIDCard');

    this.Page.load({
        method: 'post',
        url: this.Router.url(),
        data: JSON.stringify({
            id: $id.value,
            name: $name.value,
            cardId: $cardId.value
        }),
        func: function(rep) {
            return rep;
        },
        error: function(statusCode, statusText) {
            alert(statusText);
        }
    });
    // this.Page.config({
    //     inAnimation:'intest',
    //     outAnimation:'outtest',
    //     initial:'initialtest'
    // });
}

exports.actionSelfie = function(args) {
    this.Page.switchToDom('\
        <div style="height:1px;"></div>\
        <img class="selfie" src="'+unescape(args.url)+'">\
        <a href="#back"><div class="btnOneLine">返回</div><\a>\
    ');
}

exports.actionBackup = function() {
    var $id = document.querySelector('#studentID'),
        $name = document.querySelector('#studentName'),
        $cardId = document.querySelector('#studentIDCard');

    this.Page.load({
        method: 'post',
        url: this.Router.url(),
        data: JSON.stringify({
            id: $id.value,
            name: $name.value,
            cardId: $cardId.value
        }),
        func: function(rep) {
            return rep;
        }
    });
}