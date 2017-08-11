import './setFont.js';
import URL from './url.js';
import loading from './loading.js';
import Base64 from './base.js';
import refreshToken from './token.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/myCar.less';

var token = sessionStorage.getItem('token');
refreshToken();
loading.load();
var tokenMsg = getTokenMsg(token);
function getTokenMsg(token){
	var base = new Base64();
	var base64Str = token.split('.')[1];
	var result2 = base.decode(base64Str);
	result2 = result2.substring(result2.indexOf("{"));
	result2 = result2.substring(0, result2.lastIndexOf("}") + 1);
	var result2 = JSON.parse(result2);
	return result2;
}

$.ajax({
	type:"post",
	url:URL+"wxmp/car/myCar",
	headers: {
		'Authorization':'Bearer '+ token
	},
	dataType:"json",
	success:function(data){
		console.log(data);
		if(data.result == 'Succeeded'){
			var data = data.data;
			var list = "";
			$(data).each(function(index,item){
				if(item.car.id == tokenMsg.carId){
					list+='<li data-id='+item.car.id+' class="car-list active">';
				}else{
					list+='<li data-id='+item.car.id+' class="car-list">';
				}
				list+='<img class="car-pic" src="'+item.car.carModel.series.carBrand.logoPath+'" />';
				list+='<div class="car-content">';
				list+='<h3 class="title">'+item.car.carModel.series.name+'</h3>';
				list+='<p class="info">'+item.car.carModel.name+'</p>';
				list+='</div>';	
				list+='</li>';
			})
			$('.car-container').append(list);
			loading.removeLoad();
		}else{
			msg(data.description);
		}
	},
	error:function(data){
		console.log(data);
	}
});

$(document).on('click','.car-list',function(){
	var token = sessionStorage.getItem('token');
	loading.load();
	var carId = $(this).attr('data-id');
	$(this).addClass('active').siblings().removeClass('active');
	$.ajax({
		type:"post",
		url:URL+"wxmp/car/chooseCar",
		headers: {
			'Authorization':'Bearer '+ token
		},
		data:{
			carId:carId
		},
		dataType:"json",
		success:function(data){
			loading.removeLoad();
			if(data.result =='Succeeded'){
				var token = data.data;
				var base64Str=token.split('.')[1];
				var base = new Base64();  
				var result2 = base.decode(base64Str);
				result2 = result2.substring(result2.indexOf("{"));
				result2 = result2.substring(0, result2.lastIndexOf("}") + 1);
				var result2 = JSON.parse(result2);
				var exp = new Date(result2.exp*1000).getTime();
				sessionStorage.setItem('exp',exp);
				sessionStorage.setItem('token',token);
				self.location=document.referrer;
			}else{
				msg(data.description);
			}
		},
		error:function(data){
			console.log(data);
		}
	});
})


