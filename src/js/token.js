import URL from './url.js';
import Base64 from './base.js';
function refreshToken(){
	var token = sessionStorage.getItem('token');
	var exp = sessionStorage.getItem('exp');
	var now = new Date().getTime();
	var time = parseInt(((exp - now) / 1000 - 600) * 1000);
	setTimeout(function() {
		token = sessionStorage.getItem('token');
		$.ajax({
			type: "post",
			url: URL+"console/logon/refreshToken",
			data: token,
			contentType: "text/plain",
			dataType: "json",
			success: function(data) {
				var newToken = data.data;
				var base64Str = newToken.split('.')[1];
				var base = new Base64();
				var result2 = base.decode(base64Str);
				result2 = result2.substring(result2.indexOf("{"));
				result2 = result2.substring(0, result2.lastIndexOf("}") + 1);
				var result2 = JSON.parse(result2);
				var newexp = new Date(result2.exp * 1000).getTime();
				sessionStorage.setItem('exp', newexp);
				sessionStorage.setItem('token', newToken);
				/*token = newToken;
				exp = newexp;*/
			}
		});
	}, time);
	if(!token) {
		//location.href = 'login.html';
	}
}
module.exports =  refreshToken;
    