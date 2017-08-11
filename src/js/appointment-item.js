import './setFont.js';
import GetQueryString from './get.js';
import URL from './url.js';
import loading from './loading.js';
import refreshToken from './token.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/appointment-item.less';

refreshToken();
var token = sessionStorage.getItem('token');
loading.load();
$.ajax({
	type:"post",
	url:URL+"wxmp/order/queryOrderAppointmentsOfUser",
	headers: {
		'Authorization':'Bearer '+ token
	},
	contentType:'application/json',
	dataType:'json',
	data:JSON.stringify({
		pageIndex:0,
		pageSize:1000,
		startIndex:0,
		needOrderInfo:true
	}),
	success:function(data){
		loading.removeLoad();
		var list = data.data.list;
		console.log(list);
		var str='';
		if(list.length != 0){
			$(list).each(function(index,item){
				str+='<li class="appointment-list">';
				str+='<h3 class="title">'+item.shop.name+'</h3>';
				str+='<p class="name">联 系 人&nbsp;: '+item.ptc+'</p>';
				str+='<p class="phone">联系电话: '+item.phone+'</p>';
				str+='<p class="time">预约时间: '+new Date(item.appointedTime).getFullYear() + '-' + (new Date(item.appointedTime).getMonth()+1) + '-' + new Date(item.appointedTime).getDate() + ' ' + new Date(item.appointedTime).getHours()+':00</p>';
				str+='<div class="btn-grounp">';
				if(item.order.status == 'UNPAYED'){
					str+='<a class="btn" href="orderDetails.html?id='+item.orderId+'">查看订单</a>';
				}else if( item.order.status == 'PAYED'){
					str+='<a class="btn" href="code.html?id='+item.orderId+'">查看订单</a>';
				}else if(item.order.status == 'SERVICED'){
					str+='<a class="btn" href="orderDetails1.html?id='+item.orderId+'">查看订单</a>';
				}else if(item.order.status == 'CONFIRMED'){
					str+='<a class="btn" href="orderDetails2.html?id='+item.orderId+'">查看订单</a>';
				}else if(item.order.status == 'EVALUATED'){
					str+='<a class="btn" href="orderDetails3.html?id='+item.orderId+'">查看订单</a>';
				}else if(item.order.status == 'REFUNDED'){
					str+='<a class="btn" href="orderDetails3.html?id='+item.orderId+'">查看订单</a>';
				}
				str+='<a class="btn" href="storeDetails.html?id='+item.shopId+'&orderId='+item.orderId+'&chose=1">门店信息</a>';
				str+='</div>';
				str+='</li>';
			})
			$('.appointment-item').append(str);
		}else{
			$('.appointment-item').html('暂无数据');
		}
		
	},
	error:function(data){
		//console.log(data);
	}
});
