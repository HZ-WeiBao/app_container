
exports.viewUpdateLike = function(){
    var $btnLike = document.querySelector('#btnLike');

    Ajax({
        method:'post',
        url:this.Router.url(),
        data:JSON.stringify({
            'id':$btnLike.getAttribute('sayingId')
        }),
        func:function(rep){
            $btnLike.querySelector('i').innerHTML = '&#xe615;';
            $btnLike.querySelector('i').style.color = '#d26896';
            $btnLike.querySelector('span').innerHTML = rep;
            $btnLike.setAttribute('href','#Home/Unlike?viewUpdate=true');
        }
    });
};

exports.viewUpdateUnlike = function(){
    var $btnLike = document.querySelector('#btnLike');

    Ajax({
        method:'post',
        url:this.Router.url(),
        data:JSON.stringify({
            'id':$btnLike.getAttribute('sayingId')
        }),
        func:function(rep){
            $btnLike.querySelector('i').innerHTML = '&#xe66c;';
            $btnLike.querySelector('i').style.color = 'black';
            $btnLike.querySelector('span').innerHTML = rep;
            $btnLike.setAttribute('href','#Home/Like?viewUpdate=true');
        }
    });
};