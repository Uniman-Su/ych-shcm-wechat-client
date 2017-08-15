import './setFont.js';
import URL from './url.js';
import loading from './loading.js';
import refreshToken from './token.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/service.less';

$('.service-nav-list').click(function(){
	$(this).addClass('active').siblings().removeClass('active');
})

var carId;
var token = sessionStorage.getItem('token');
refreshToken();
loading.load();
//获取用户第一个车辆信息
$.ajax({
	type:"post",
	url:URL+"wxmp/car/getCurrentSelectedCar",
	headers: {
		'Authorization':'Bearer '+ token
	},
	dataType:"json",
	success:function(data){
		if(data.result == 'Succeeded'){
			var data = data.data;
			carId = data.id;
			var logoPath = data.carModel.series.carBrand.logoPath;
			var seriesName = data.carModel.series.name;
			var carModelName = data.carModel.name;
			//sessionStorage.setItem('carId',carId);
			$('.car-info-title').text(seriesName);
			$('.car-info-text').text(carModelName);
			$('.car-info-pic').attr('src',logoPath);
			load(carId);
		}else{
			msg(data.description);
		}
	},
	error:function(data){
		console.log(data);
	}
});


var serviceData;
function load(carId){
	//查询车辆可用服务包
	$.ajax({
		type:"post",
		url:URL+"wxmp/service/queryCanChooseServicePacks",
		headers: {
			'Authorization':'Bearer '+ token
		},
		data:{
			carId:carId
		},
		dataType:"json",
		success:function(data){
			serviceData = data.data;
			var canChooseArr = [];
			var list='';
			$(serviceData).each(function(index,item){
				if( item.canChoose == true){
					canChooseArr.push(index);
					list+='<li data-id='+item.id+' class="service-nav-list">'+item.alias+'</li>';
				}else{
					list+='<li data-id='+item.id+' class="service-nav-list disable">'+item.alias+'</li>';
				}
				
			})	
			var packId = serviceData[canChooseArr[0]].id;
			var firstdesc = serviceData[canChooseArr[0]].desc;
			var comment = serviceData[canChooseArr[0]].comment;
			serviceLoad(packId);
			$('.service-nav-container ul').append(list);
			$('.service-nav-list').not('.disable').eq(canChooseArr[0]).addClass('active');
			//$('.service-cycle .text').text(firstdesc);
			$('#desc').html(firstdesc);
			$('#comment').html(comment);
			
		//console.log(data);
		},
		error:function(data){
			console.log(data);
		}
	});
}

function serviceLoad(packId){
	$.ajax({
		type:"post",
		url:URL+"wxmp/service/queryServicePacksItems",
		headers: {
			'Authorization':'Bearer '+ token
		},
		data:{
			packId:packId
		},
		dataType:"json",
		success:function(data){
			var data = data.data;
			var items = data.items;
			var list='';
			var price=data.price;
			$(items).each(function(index,item){
				list+='<li class="price-details-list"><img class="price-icon" src="'+item.iconPath+'" />'+item.name+'</li>';
			})
			$('.price-details').html('');
			$('.price-details').append(list);
			$('#price').text(price);
			loading.removeLoad();
			//console.log(data);
		}
	});
	
}

//服务切换
$(document).on('click','.service-nav-list',function(){
	token = sessionStorage.getItem('token');
	if( !$(this).hasClass('disable') ){
		$('.next-foot').removeClass('active');
	}else{
		$('.next-foot').addClass('active');
	}
	loading.load();
	var _index = $(this).index();
	$(this).addClass('active').siblings().removeClass('active');
	var packId = serviceData[_index].id;
	var firstdesc = serviceData[_index].desc;
	var comment = serviceData[_index].comment;
	$('.service-cycle .text').text(firstdesc);
	$('#comment').html(comment);
	serviceLoad(packId);
})


//创建订单
$('.next-foot a').click(function(){
	if($('.next-foot').hasClass('active')){
		return;
	}
	loading.load();
	token = sessionStorage.getItem('token');
	var packs = $('.service-nav-list.active');
	var createOrderRequest={};
	var packsArr=[];
	$(packs).each(function(index,item){
		var id = $(item).attr("data-id");
		var obj = {};
		obj.id = Number(id);
		packsArr.push(obj);
		console.log(obj.id);
	})
	createOrderRequest.carId = carId;
	createOrderRequest.packs = packsArr;
	createOrderRequest=JSON.stringify(createOrderRequest);
	
	$.ajax({
		type:"post",
		url:URL+"wxmp/order/createOrder",
		headers: {
			'Authorization':'Bearer '+ token
		},
		contentType:'application/json',
		dataType:"json",
		data:createOrderRequest,
		success:function(data){
			loading.removeLoad();
			if(data.result == "Succeeded"){
				//创建订单成功
				var orderNo = data.data.orderNo;
				var orderId = data.data.orderId;
				location.href='../../pay/pay.html?orderNo='+orderNo+'&orderId='+orderId+'';
			}else{
				msg(data.description);
			}
		}
	});
})
	

