import './setFont.js';
import refreshToken from './token.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/error.less';

//获取url参数的函数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return r[2];
	return null;
}

refreshToken();
var errorInfo = GetQueryString('errorInfo');
errorInfo = decodeURIComponent(errorInfo);
$('.error-text').text(errorInfo);

