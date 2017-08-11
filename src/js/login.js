import './setFont.js';
import URL from './url.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/login.less';



$(function(){
	$('.password').on('keyup',function(){
		var value = $(this).val();
		if(value == ""){
			$('.icon-close').hide();
		}else{
			$('.icon-close').show();
		}
	})
	
	$('.icon-close').on('click',function(){
		$('.password').val('');
		$(this).hide();
	})
	
})

$('.login-btn').click(function(){
	var datajson={};
	datajson.userName = $('.username').val();
	datajson.password = $('.password').val();
	$.ajax({
		type:"post",
		url:URL+"",
		data:datajson,
		dataType: "json",
		success:function(data){
			if(data.result == 'Succeeded'){
				var token = data.data;
				var base64Str=token.split('.')[1];
				var base = new Base64();  
				var result2 = base.decode(base64Str);
				result2 = result2.substring(result2.indexOf("{"));
				result2 = result2.substring(0, result2.lastIndexOf("}") + 1);
				var result2 = JSON.parse(result2);
				var exp = new Date(result2.exp*1000).getTime();
				sessionStorage.setItem('exp',exp);
				sessionStorage.setItem('user',datajson.userName);
				sessionStorage.setItem('token',token);
				//验证成功后保存token并跳转到首页
				//console.log(exp,token);
				location.href='index.html';
			}else{
				msg('登录失败');
			}
		},
		error:function(data){
			console.log(data);
			layer.msg('登录失败');
		}
	});
})
