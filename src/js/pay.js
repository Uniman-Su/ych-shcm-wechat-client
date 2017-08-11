import './setFont.js';
import GetQueryString from './get.js';
import URL from './url.js';
import loading from './loading.js';
import refreshToken from './token.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/pay.less';

refreshToken();
var token = sessionStorage.getItem('token');
var orderNo = GetQueryString('orderNo');
var orderId = GetQueryString('orderId');
var status;
loading.load();
$.ajax({
	type:"post",
	url:URL+"wxmp/logon/getJsApiInitInfo",
	headers: {
		'Authorization':'Bearer '+ token
	},
	dataType:"json",
	data:{
		url:location.href
	},
	success:function(data){
		console.log(data);
		var appId = data.appId;
		var nonceStr = data.nonceStr;
		var signature = data.signature;
		var timestamp = data.timestamp;
		wx.config({
		    debug: false, 
		    appId: appId, 
		    timestamp: timestamp, 
		    nonceStr: nonceStr, 
		    signature: signature,
		    jsApiList: ['chooseWXPay'] 
		});
		loading.removeLoad();
	},
	error:function(data){
		console.log(data);
	}
});

wx.ready(function () {
	$('#submit').click(function(){
		loading.load();
		var token = sessionStorage.getItem('token');
		$.ajax({
			type:"post",
			url:URL+"pay/payOrder",
			headers: {
				'Authorization':'Bearer '+ token
			},
			dataType:"json",
			data:{
				orderNo:orderNo,
				payChannel:"WXPAY"
			},
			success:function(data){
				loading.removeLoad();
				if(data.result == 'Succeeded'){
					var data = data.data;
					data.success = function(res){
						setTimeout(selectStatus,2000);
						//$('#dialog1').fadeIn();
					}
					wx.chooseWXPay(data);
				}else{
					msg(data.description);
				}
				
			},
			error:function(data){
				console.log(data);
			}
		});
	})
})	

function selectStatus(){
	loading.load();
	var token = sessionStorage.getItem('token');
	$.ajax({
		type:"post",
		url:URL+"wxmp/order/orderDetail",
		headers: {
			'Authorization':'Bearer '+ token
		},
		dataType:"json",
		data:{
			orderId:orderId
		},
		success:function(data){
			loading.removeLoad();
			status = data.data.status;
			if( status == 'PAYED'){
				location.href="../o2o/dist/code.html?id="+orderId;
			}else{
				$('#dialog1').fadeIn();
			}
			
		},
		error:function(data){
			console.log(data);
		}
	});
}

$('.icon-close').click(function(){
	$(this).parents('.dialog').fadeOut();
})
$('#pay-btn').click(function(){
	location.href="../o2o/dist/record.html";
})
$('#pay-btn1').click(function(){
	$('#dialog2').fadeIn();
	$('#dialog1').fadeOut();
})
$('#pay-btn2').click(function(){
	location.href="../o2o/dist/record.html";
})


