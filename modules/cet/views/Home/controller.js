exports.deps = {
  css:['/frame/views/Home/Error.css']
}

exports.actionIndex = function() {
    
}

exports.actionQuery = function() {
    var $id = document.querySelector('#studentID'),
        $name = document.querySelector('#studentName');

    this.Page.load({
        method: 'post',
        url: this.Router.url(),
        data: JSON.stringify({
            id: $id.value,
            name: $name.value
        }),
        func: function(rep) {
            return rep;
        }
    });
}

exports.actionBackup = function() {
    var $id = document.querySelector('#studentID'),
        $name = document.querySelector('#studentName');

    Ajax({
        method: 'post',
        url: this.Router.url(),
        data: JSON.stringify({
            id: $id.value,
            name: $name.value
        }),
        func: function(rep) {
            console.log(rep);
        }
    });
}