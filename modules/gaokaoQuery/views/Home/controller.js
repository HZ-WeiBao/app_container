
exports.deps = {
  css:['/frame/views/Home/Error.css']
}

exports.actionIndex = function() {
  
}

exports.viewUpdateIndex = function(){
  var $inputHidden = document.querySelector('#inputHidden'),
      $captchaImg = document.querySelector('#captchaImg');
  
  Ajax({
    method:'post',
    url:this.Router.url('Home','GetCaptcha'),
    data:JSON.stringify({
      serverId:$inputHidden.getAttribute('serverId'),
      session:$inputHidden.getAttribute('session'),
    }),
    func:function(rep){
      var result = JSON.parse(rep);
      $captchaImg.setAttribute('src',result.src);
      $inputHidden.setAttribute('serverId',result.serverId);
    }
  });
};

exports.actionQuery = function() {
  var $inputHidden = document.querySelector('#inputHidden'),
      $studentId = document.querySelector('#studentId'),
      $studentBrithday = document.querySelector('#studentBrithday'),
      $captcha = document.querySelector('#captcha');
  
  this.Page.load({
    method:'post',
    url:this.Router.url(),
    data:JSON.stringify({
      serverId:$inputHidden.getAttribute('serverId'),
      session:$inputHidden.getAttribute('session'),
      aliyungf_tc:$inputHidden.getAttribute('aliyungftc'),
      studentId:$studentId.value,
      studentBrithday:$studentBrithday.value,
      captcha:$captcha.value
    }),
    func:function(rep){
      return rep;
    }
  });
}