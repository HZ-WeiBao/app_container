
exports.actionIndex = function() {

};

exports.action2017 = function() {
  this.Page.load({
    method:'get',
    url:this.Router.url(),
    func:function(rep){
      return rep;
    }
  });
};