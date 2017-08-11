import './setFont.js';
import msg from './msg.js';
import msg1 from './msg1.js';
import  './lCalendar.js';
import GetQueryString from './get.js';
import URL from './url.js';
import loading from './loading.js';
import refreshToken from './token.js';
import '../css/reset.css';
import '../css/appointment.less';
import '../css/lCalendar.css';


var id = GetQueryString('id');
var orderId = GetQueryString('orderId');
refreshToken();

$('#submit').click(function(){
	var token = sessionStorage.getItem('token');
	var time = $('#time').val();
	var obj={};
    time = time.split(" ");
    var time1 = time[0];
    time1 = time1.split('-');
    time1 = time1.join('/');
    var time2 = time[1]+':00:00';
    obj.appointedTime = time1+' '+time2;
    obj.appointedTime = new Date(obj.appointedTime).getTime();
	obj.shopId = Number(id);
	obj.orderId = orderId;
	obj.ptc = $('#person').val();
	obj.phone = $('#phone').val();
	if(time == ""){
		msg('预约时间不能为空');
		return;
	}
	if(obj.ptc == ''){
		msg('联系人不能为空');
		return;
	}
	if(obj.phone ==''){
		msg('联系电话不能为空');
		return;
	}
	obj = JSON.stringify(obj);
	loading.load();
	console.log(obj);
	$.ajax({
		type:"post",
		url:URL+"wxmp/order/appointmentOrder",
		headers: {
			'Authorization':'Bearer '+ token
		},
		contentType:'application/json',
		dataType:"json",
		data:obj,
		success:function(data){
			loading.removeLoad();
			console.log(data);
			if(data.result == 'Succeeded'){
				msg1('预约提交成功，请按时到店享受服务');
				setTimeout(function(){
					location.href="index.html";
				},500)
			}else{
				msg(data.description);
			}
		},
		error:function(data){
			console.log(data);
		}
	});
	
})


var time=new Date();
var nowY=time.getFullYear();
var newY=nowY+50;
var gotY=nowY-50;
var gotDate=gotY+"-1-1";
var newDate=newY+"-12-31";
var _text=gotDate+","+newDate;

document.getElementById("time").setAttribute("data-lcalendar",_text);


var calendardatetime = new lCalendar();
calendardatetime.init({
	'trigger': '#time',
	'type': 'datetime'
});