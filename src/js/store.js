import './setFont.js';
import GetQueryString from './get.js';
import URL from './url.js';
import loading from './loading.js';
import refreshToken from './token.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/store.less';

var token = sessionStorage.getItem('token');
var orderId = GetQueryString('id');
loading.load();
refreshToken();

var store={};
	store.pageIndex = 0;
	store.pageSize = 1000;
	store.startIndex = 0;
	store.orderId = Number(orderId);
	store.position = {};
	//console.log(store);
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
	wx.getLocation({
	    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
	    success: function (res) {
	        store.position.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
	        store.position.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
	        //var speed = res.speed; // 速度，以米/每秒计
	        //var accuracy = res.accuracy; // 位置精度
	        //alert(store.obj)
	        store = JSON.stringify(store)
	        getDetails();
	    }
	});
	
});	

function getDetails(){
	token = sessionStorage.getItem('token');
	$.ajax({
	type:"post",
	url:URL+"wxmp/shop/queryCanServiceShopList",
	headers: {
		'Authorization':'Bearer '+ token
	},
	contentType:'application/json',
	data:store,
	dataType:"json",
	success:function(data){
		console.log(data);
	    loading.removeLoad();
		var data = data.data.list;
		var list='';
		if(data.length!=0){
			$(data).each(function(index,item){
				list+='<li class="store-list">';
				list+='<a href="storeDetails.html?id='+item.id+'&orderId='+orderId+'">';
				list+='<h3 class="title">';
				list+='<em class="caption">'+item.name+'</em>';
				list+='<span class="distance">'+(item.distance/1000).toFixed(2)+'KM</span>';
				list+='</h3>';
				list+='<div class="store-content clear">';
				list+='<img class="store-list-pic" src='+item.imagePath+' />';
				list+='<div class="store-list-info">';
				list+='<p class="store-list-text">'+item.address+'</p>';
				list+='<span class="star-component">';
				for( var i=1; i<6; i++){
					if( i <= Math.round(item.averageScore) ){
						list+='<span class="star active"></span>';
					}else{
						list+='<span class="star"></span>';
					}
				};
				list+='</span>';
				list+='<span class="score">'+item.averageScore.toFixed(1)+'分</span>';
				list+='<em class="comments">'+item.evaluationCount+'条评论</em>';
				list+='</div>';
				list+='</div>';
				list+='</a>';
				list+='</li>';
			})
			$('.store-container').append(list);
		}else{
			$('.store-container').html('暂无门店');
		}
		
	},
	error:function(data){
		console.log(data);
	}
});
}

