import './setFont.js';
import Base64 from './base.js';
import GetQueryString from './get.js';
import refreshToken from './token.js';
import URL from './url.js';
import msg from './msg.js';
import loading from './loading.js';
import '../css/reset.css';
import '../css/index.less';

var token = sessionStorage.getItem('token');
var isPageHide = false;
window.addEventListener('pageshow', function () { 
	console.log(isPageHide);
　　if (isPageHide) { 
　　　　window.location.reload(); 
　　} 
}); 
window.addEventListener('pagehide', function () { 
　　isPageHide = true; 
}); 
if(!token){
	var indexObj = {};
	indexObj.userId = GetQueryString('userId');
	indexObj.carId = GetQueryString('carId');
	indexObj.accessChannelId = GetQueryString('accessChannelId');
	indexObj.code = GetQueryString('code');
	indexObj = JSON.stringify(indexObj);
	sessionStorage.setItem('userId',GetQueryString('userId'));
	
	$.ajax({
		type:"post",
		url:URL+"wxmp/logon/guidanceRedirectBack",
		/*headers: {
			'Authorization':'Bearer '+ token
		},*/
		contentType:'application/json',
		data:indexObj,
		dataType:"json",
		success:function(data){
			if(data.result == 'Succeeded'){
				token = data.data;
				var base64Str=token.split('.')[1];
				var base = new Base64();  
				var result2 = base.decode(base64Str);
				result2 = result2.substring(result2.indexOf("{"));
				result2 = result2.substring(0, result2.lastIndexOf("}") + 1);
				var result2 = JSON.parse(result2);
				var exp = new Date(result2.exp*1000).getTime();
				sessionStorage.setItem('exp',exp);
				sessionStorage.setItem('token',token);
				//验证成功后保存token并跳转到首页
				//console.log(exp,token);
				refreshToken();
				load();
				load1();
			}
		},
		error:function(data){
			console.log(data);
		}
	});
}else{
	load();
	load1();
	refreshToken();
}
function load(){
	token = sessionStorage.getItem('token');
	//获取用户选定的车辆信息
	loading.load();
	$.ajax({
		type:"post",
		url:URL+"wxmp/car/getCurrentSelectedCar",
		headers: {
			'Authorization':'Bearer '+ token
		},
		dataType:"json",
		success:function(data){
			if(data.result == 'Succeeded'){
				var carId = data.data.id;
				var logoPath = data.data.carModel.series.carBrand.logoPath;
				var seriesName = data.data.carModel.series.name;
				var carModelName = data.data.carModel.name;
				$('.car-info-title').text(seriesName);
				$('.car-info-text').text(carModelName);
				$('.car-info-pic').attr('src',logoPath);
			}else if(data.result == 'NotExists'){
				msg(data.description);
				$('.car-info').hide();
				$('.car-info.error').show();
			}else{
				msg(data.description);
			}
			
		},
		error:function(data){
			console.log(data);
		}
	});
	
}

function load1(){
	//获取订单数量
	$.ajax({
		type:"post",
		url:URL+"wxmp/order/myOrderStatusCount",
		headers: {
			'Authorization':'Bearer '+ token
		},
		dataType:"json",
		success:function(data){
			var data = data.data;
			var num = [0,0,0,0];
			console.log(data);
			$(data).each(function(index,data){
				if( data.status == 'UNPAYED'){
					num[0] = data.count;
				}
				if( data.status == 'PAYED'){
					num[1] = data.count;
				}
				if( data.status == 'SERVICED'){
					num[2] = data.count;
				}
				if( data.status == 'CONFIRMED'){
					num[3] = data.count;
				}
			})
			$(num).each(function(index,data){
				if( data > 0 ){
					$('.order-nav-list').eq(index).find('.badge').addClass('active').text(data);
				}
			})
			loading.removeLoad();
			//console.log(num);
		},
		error:function(data){
			console.log(data);
		}
	});
}











