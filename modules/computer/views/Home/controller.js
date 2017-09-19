
exports.deps = {
  css:['/frame/views/Home/Error.css']
}

exports.actionIndex = function() {
  var $examTime = document.querySelector('#examTime'),
      $examLevel = document.querySelector('#examLevel');

  $examTime.addEventListener('change',function(){
    Ajax({
      method:'get',
      url:this.Router.url('Home','GetProvince'),
      arg:{
        id:$examTime.value
      },
      func:function(rep){
        var result = JSON.parse(rep);
        var domStr = '';
        result.bkjbList.forEach(function(option) {
          domStr += '<option value="'+option.value+'">'+option.text+'</option>';
        }, this);
        $examLevel.innerHTML = domStr;
      }
    });
  }.bind(this));
}

exports.viewUpdateIndex = function(){
  var $inputHidden = document.querySelector('#inputHidden'),
      $captchaImg = document.querySelector('#captchaImg');
  
  Ajax({
    method:'post',
    url:this.Router.url('Home','GetCaptcha'),
    data:JSON.stringify({
      pool:$inputHidden.getAttribute('pool'),
      session:$inputHidden.getAttribute('session'),
    }),
    func:function(rep){
      var result = JSON.parse(rep);
      $captchaImg.setAttribute('src',result.src);
      $inputHidden.setAttribute('verify',result.verify);
    }
  });
};

exports.actionQuery = function() {
  var $inputHidden = document.querySelector('#inputHidden'),
      $examTime = document.querySelector('#examTime'),
      $examLevel = document.querySelector('#examLevel'),
      $studentName = document.querySelector('#studentName'),
      $studentIDCard = document.querySelector('#studentIDCard'),
      $captcha = document.querySelector('#captcha');
  
  this.Page.load({
    method:'post',
    url:this.Router.url(),
    data:JSON.stringify({
      verify:$inputHidden.getAttribute('verify'),
      pool:$inputHidden.getAttribute('pool'),
      session:$inputHidden.getAttribute('session'),
      examTime:$examTime.value,
      examLevel:$examLevel.value,
      name:$studentName.value,
      cardId:$studentIDCard.value,
      captcha:$captcha.value
    }),
    func:function(rep){
      return rep;
    }
  });
}
