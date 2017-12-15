exports.deps = {
	css:['/frame/views/Home/Error.css']
}

exports.actionIndex = function() {
	var $captchaImg = document.querySelector('#captchaImg'),
		$captcha = document.querySelector('#captcha');
	
	var updateCaptcha = function () {
		exports.viewUpdateIndex();
		$captcha.removeEventListener('focus', updateCaptcha);
	}.bind(this);

	$captcha.addEventListener('focus', updateCaptcha);

	$captchaImg.addEventListener('click',function(){
		updateCaptcha();
	});
}

exports.viewUpdateIndex = function () {
	var $studentID = document.querySelector('#studentID'),
		$captchaImg = document.querySelector('#captchaImg');

	Ajax({
		method: 'post',
		url: this.Router.url('Home', 'GetCaptcha'),
		data: JSON.stringify({
			id: $studentID.value
		}),
		func: function (rep) {
			var result = JSON.parse(rep);
			if(result.src == 'data:image/*;base64,'){
				$captchaImg.style.display = 'none';
			}else{
				$captchaImg.setAttribute('src', result.src);
				$studentID.setAttribute('pool',result.pool);
				$captchaImg.style.display = '';
			}
		}
	});
};

exports.actionQuery = function() {
		var $id = document.querySelector('#studentID'),
				$name = document.querySelector('#studentName'),
				$captcha = document.querySelector('#captcha');

		this.Page.load({
				method: 'post',
				url: this.Router.url(),
				data: JSON.stringify({
						id: $id.value,
						name: $name.value,
						captcha: $captcha.value,
						pool: $id.getAttribute('pool')
				}),
				func: function(rep) {
						return rep;
				}
		});
}

exports.actionBackup = function() {
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
