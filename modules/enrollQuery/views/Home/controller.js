
exports.deps = {
  css:['/frame/views/Home/Error.css']
}

exports.actionIndex = function() {}

exports.actionQuery = function() {
  var $studentId = document.querySelector('#studentId'),
      $cardId = document.querySelector('#cardId'),
      $type = document.querySelector('#type'),
      url = ($type.value == 1) ? 
        this.Router.url('Home','QueryEnroll'):
        this.Router.url('Home','QueryYiKao');
  
  this.Page.load({
    method:'post',
    url:url,
    data:JSON.stringify({
      studentId:$studentId.value,
      cardId:$cardId.value
    }),
    func:function(rep){
      return rep;
    }
  });
}