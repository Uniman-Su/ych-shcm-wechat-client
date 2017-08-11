import './setFont.js';
import GetQueryString from './get.js';
import URL from './url.js';
import loading from './loading.js';
import refreshToken from './token.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/code.less';

var token = sessionStorage.getItem('token');
var userId = sessionStorage.getItem('userId');
var orderId = GetQueryString('id');
var orderNo;
refreshToken();
//订单状态
var orderStatus = {
	"UNPAYED": "未支付",
	"PAYED": "已支付",
	"SERVICED": "待确认",
	"CONFIRMED": "待评价",
	"EVALUATED": "已完成",
	"REFUNDED": "已退款",
	"CANCELED": "已取消",
	"REFUNDED_OFF_LINE": "线下退款"
};


	loading.load();
function getCarDetails(carId){
	$.ajax({
		type:"post",
		url:URL+"car/queryCar",
		headers: {
			'Authorization':'Bearer '+ token
		},
		data:{
			id:carId,
			isComplete:true
		},
		dataType:"json",
		success:function(data){
			if(data.result == 'Succeeded'){
				var logoPath = data.data.carModel.series.carBrand.logoPath;
				var seriesName = data.data.carModel.series.name;
				var carModelName = data.data.carModel.name;
				//sessionStorage.setItem('carId',carId);
				$('.car-info-title').text(seriesName);
				$('.car-info-text').text(carModelName);
				$('.car-info-pic').attr('src',logoPath);
				//console.log(carId);
			}else{
				msg(data.description);
			}
		},
		error:function(data){
			console.log(data);
		}
	});
}

//获取订单时间
$.ajax({
	type:"post",
	url:URL+"wxmp/order/orderDetail",
	headers: {
		'Authorization':'Bearer '+ token
	},
	dataType:'json',
	data:{
		orderId:orderId
	},
	success:function(data){
		var data = data.data;
		console.log(data);
		var createTime = data.createTime;
		var modifyTime = data.modifyTime;
		var money = data.money;
		var status = data.status;
		var carId = data.carId;
		orderNo = data.orderNo;
		status = orderStatus[status];
		getCarDetails(carId);
		createTime = new Date(data.createTime).getFullYear() + '-' + (new Date(data.createTime).getMonth()+1) + '-' + new Date(data.createTime).getDate();
		modifyTime = new Date(data.modifyTime).getFullYear() + '-' + (new Date(data.modifyTime).getMonth()+1) + '-' + new Date(data.modifyTime).getDate();
		$('#createTime .fr').text(createTime);
		$('#modifyTime .fr').text(modifyTime);
		$('#money').text(money);
		$('#status').text(status);
		//console.log(data);
	}
});

//获取订单详情
$.ajax({
	type:"post",
	url:URL+"order/queryServicePack",
	headers: {
		'Authorization':'Bearer '+ token
	},
	dataType:'json',
	data:{
		orderId:orderId,
		needItems:true
	},
	success:function(data){
		loading.removeLoad();
		var data = data.data;
		console.log(data);
		var orderServicePackItems = data[0].orderServicePackItems;
		//console.log(data);
		var list='';
		$(orderServicePackItems).each(function(index,item){
			list+='<li class="price-details-list"><img class="price-icon" src="'+item.iconPath+'" />'+item.name+'</li>';
		})
		$('.price-details').html('');
		$('.price-details').append(list);
		
	}
});




$('.price-pay-btn.btn1').click(function(){
	$('.dialog').show();
})
$('.icon-close,.pay-dialog-btn.btn1').on('click',function(){
	$(this).parents('.dialog').fadeOut();
})
$('.code-btn').click(function(){
	location.href='store.html?id='+orderId;
})
$('#cancel').click(function(){
	loading.load();
	token = sessionStorage.getItem('token');
	$.ajax({
		type:"post",
		url:URL+"pay/refund",
		headers: {
			'Authorization':'Bearer '+ token
		},
		dataType:'json',
		data:{
			orderNo:orderNo
		},
		success:function(data){
			loading.removeLoad();
			if(data.result =='Succeeded'){
				location.href='index.html';
			}else{
				if(data.description == '状态错误'){
					location.href='record.html';
				}else{
					msg(data.description);
				}
			}
		}
	});
})
