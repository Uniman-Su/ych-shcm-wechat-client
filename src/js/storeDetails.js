import './setFont.js';
import GetQueryString from './get.js';
import URL from './url.js';
import loading from './loading.js';
import refreshToken from './token.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/swiper-3.4.2.min.css';
import '../css/storeDetails.less';
import './swiper-3.4.2.min.js';

var token = sessionStorage.getItem('token');
var id = GetQueryString('id');
var orderId = GetQueryString('orderId');
var chose = GetQueryString('chose');
if(chose){
	$('#appointment').hide();
}
var navigation={};//获取微信导航信息
var shopObj={};
shopObj.pageIndex = 0;
shopObj.pageSize = 1000;
shopObj.startIndex = 0;
shopObj.shopId = id;
shopObj = JSON.stringify(shopObj);
loading.load();
refreshToken();

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
		    jsApiList: ['openLocation'] 
		});
	},
	error:function(data){
		console.log(data);
	}
});

wx.ready(function(){
	$('.navigation').click(function(){
		wx.openLocation({
		    latitude: parseFloat(navigation.latitude), // 纬度，浮点数，范围为90 ~ -90
		    longitude: parseFloat(navigation.longitude), // 经度，浮点数，范围为180 ~ -180。
		    name: navigation.name, // 位置名
		    address: navigation.address, // 地址详情说明
		    scale: 10, // 地图缩放级别,整形值,范围从1~28。默认为最大
		    //infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
		});
	})
})

$.ajax({
	type:"post",
	url:URL+"shop/queryShop",
	headers: {
		'Authorization':'Bearer '+ token
	},
	data:{
		id:id
	},
	dataType:"json",
	success:function(data){
		//console.log(data);
		var data = data.data;
		var shopImage = data.images;
		var desc = data.desc == null?"":data.desc;
		navigation.name = data.name;
		navigation.address = data.address;
		navigation.latitude = data.latitude;
		navigation.longitude = data.longitude;

		var list='';
		$(shopImage).each(function(index,item){
			list+='<div class="swiper-slide">';
	        list+='<img src='+item.imagePath+' />';
	        list+='</div>';
		})
		$('#shopImage').append(list);
		if(shopImage.length < 2){
			var mySwiper = new Swiper ('.swiper-container', {
			    loop: true
			  })   
		}else{
			var mySwiper = new Swiper ('.swiper-container', {
			    loop: true,
			    // 如果需要分页器
			    pagination: '.swiper-pagination'
			  })  
		}
		$('#name').text(data.name);
		$('#address').text(data.address);
		$('#phone').text(data.phone);
		$('#desc').text(desc);
	},
	error:function(data){
		console.log(data);
	}
});

$.ajax({
	type:"post",
	url:URL+"wxmp/shop/queryEvaluationsOfShop",
	headers: {
		'Authorization':'Bearer '+ token
	},
	data:shopObj,
	contentType:'application/json',
	dataType:"json",
	success:function(data){
		loading.removeLoad();
		var list = data.data.list;
		var str='';
		console.log(list);
		if(list.length != 0){
			$(list).each(function(index,item){
				str+='<li class="user-comments-list clear">';
				str+='<img class="user-comments-pic" src="images/user.png" />';
				str+='<div class="user-comments-info">';
				str+='<h3 class="title">'+item.order.car.carModel.series.name+'</h3>';
				str+='<dl class="dl">';
				str+='<dt>态度:</dt>';
				str+='<dd>'+item.attitude+'.00</dd>';
				str+='<dt>能力:</dt>';
				str+='<dd>'+item.skill+'.00</dd>';
				str+='<dt>环境:</dt>';
				str+='<dd>'+item.environment+'.00</dd>';
				str+='<dt>效率:</dt>';
				str+='<dd>'+item.efficiency+'.00</dd>';
				str+='</dl>';
				str+='<p class="text">'+item.content+'</p>';
				str+='</div>';
				str+='</li>';
			})
			$('.user-comments').append(str);
		}else{
			$('.user-comments').html('');
		}
	},
	error:function(data){
		console.log(data);
	}
});


//tab
function recordTab(num){
	var _index = num;
	var navList = $('.details-nav-list');
	var contentList = $('.detials-container-list');
	navList.eq(_index).addClass('active').siblings().removeClass('active');
	contentList.eq(_index).addClass('active').siblings().removeClass('active');
}

var navList = $('.details-nav-list');
navList.on('click',function(){
	var _index = $(this).index();
	recordTab(_index);
})

$('#appointment').click(function(){
	location.href='appointment.html?id='+id+'&orderId='+orderId+'';
})
 