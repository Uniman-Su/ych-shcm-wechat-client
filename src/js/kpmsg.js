import './setFont.js';
import GetQueryString from './get.js';
import URL from './url.js';
import loading from './loading.js';
import refreshToken from './token.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/kpmsg.less';


var token = sessionStorage.getItem('token');
var orderId = GetQueryString('id');
refreshToken();
loading.load();

//查询是否开票
var checkBill = false;
$.ajax({
	type:"post",
	url:URL+"order/queryOrderBill",
	headers: {
		'Authorization':'Bearer '+ token
	},
	data:{
		orderId:orderId
	},
	dataType:"json",
	success:function(data){
		loading.removeLoad();
		if(data.result == 'Succeeded'){
			var data = data.data;
			console.log(data);
			checkBill = true;
			$('#company').val(data.company);
	        $('#taxNo').val(data.taxNo);
	        $('#companyAddr').val(data.companyAddr);
	        /*$('#companyPhone').val(data.companyPhone);*/
	        $('#bank').val(data.bank);
	        $('#bankAccount').val(data.bankAccount);
	        $('#deliverAddr').val(data.deliverAddr);
	        $('#ptc').val(data.ptc);
	        $('#phone').val(data.phone);
			$('.kpmsg-btn-grounp').hide();
			$('input').attr({
				"readonly":"readonly"
			})
		}
	},
	error:function(data){
		console.log(data);
	}
});

$('#submit').click(function(){
	token = sessionStorage.getItem('token');
	loading.load();
    var orderBill ={};
        orderBill.company = $('#company').val();
        orderBill.taxNo = $('#taxNo').val();
        orderBill.companyAddr = $('#companyAddr').val();
        /*orderBill.companyPhone = $('#companyPhone').val();*/
        orderBill.bank = $('#bank').val();
        orderBill.bankAccount = $('#bankAccount').val();
        orderBill.deliverAddr = $('#deliverAddr').val();
        orderBill.ptc = $('#ptc').val();
        orderBill.phone = $('#phone').val();
        orderBill.orderId = Number(orderId);
        orderBill = JSON.stringify(orderBill);
        console.log(orderBill);
        $.ajax({
			type:"post",
			url:URL+"wxmp/order/applyBill",
			headers: {
				'Authorization':'Bearer '+ token
			},
			contentType:'application/json',
			dataType:'json',
			data:orderBill,
			success:function(data){
				loading.removeLoad();
				if(data.result =='Succeeded'){
					console.log(data);
					location.href='record.html';
				}else{
					$('.dialog').hide();
					msg(data.description);
				}
			}
		});
	
})


$('.kpmsg-btn.btn2').on('click',function(){
	$('.dialog').fadeIn('fast');
})

$('.icon-close,.pay-dialog-btn.btn1').on('click',function(){
	$(this).parents('.dialog').fadeOut();
})


