import './setFont.js';
import GetQueryString from './get.js';
import URL from './url.js';
import loading from './loading.js';
import refreshToken from './token.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/getPosition.less';

refreshToken();
var token = sessionStorage.getItem('token');
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
		    jsApiList: ['openLocation','getLocation'] 
		});
		loading.removeLoad();
	},
	error:function(data){
		console.log(data);
	}
});
var position={};
wx.ready(function () {
	wx.getLocation({
	    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
	    success: function (res) {
	    	loading.removeLoad();
	        postion.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
	        postion.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
	    }
	});
	$('#mapBtn').click(function(){
		loading.load();
		var token = sessionStorage.getItem('token');
		wx.openLocation({
		    latitude: postion.latitude, // 纬度，浮点数，范围为90 ~ -90
		    longitude: postion.longitude, // 经度，浮点数，范围为180 ~ -180。
		    name: '', // 位置名
		    address: '', // 地址详情说明
		    scale: 10, // 地图缩放级别,整形值,范围从1~28。默认为最大
		    infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
		});
	})
	$('#submit').click(function(){
		loading.load();
		var name = $('#name').val();
		if( name == ''){
			msg('请输入门店名称');
			return;
		}
		var token = sessionStorage.getItem('admintoken');
		$.ajax({
			type:"post",
			url:URL+"shop/modifyLocation",
			headers: {
				'Authorization':'Bearer '+ token
			},
			dataType:"json",
			data:{
				name:name,
				longitude:position.longitude,
				latitude:position.latitude
			},
			success:function(data){
				removeLoad();
				if(data.result =='Succeeded'){
					//console.log(data);
					location.href='index.html';
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

