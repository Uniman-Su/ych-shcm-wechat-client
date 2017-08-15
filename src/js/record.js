import './setFont.js';
import GetQueryString from './get.js';
import URL from './url.js';
import loading from './loading.js';
import refreshToken from './token.js';
import msg from './msg.js';
import '../css/reset.css';
import '../css/record.less';

var token = sessionStorage.getItem('token');
var userId = sessionStorage.getItem('userId');
refreshToken();

pushHistory();  
var bool;
window.addEventListener('pageshow',function(){
	bool=false;  
    setTimeout(function(){  
          bool=true;  
    },500);  
},false);
window.addEventListener("popstate", function(e) {  
    if(bool){  
            location.href='index.html';
        }  
        pushHistory();    
}, false);  

window.addEventListener('pagehide',function(){
	bool=false;  
},false);
function pushHistory() {  
	var state = {  
		title: "title",  
		url: "#"  
	};  
	window.history.pushState(state, "title", "#");  
}  

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
}


//tab
function recordTab(num){
	//console.log(num);
	var _index = num;
	var navList = $('.record-nav-list');
	var contentList = $('.record-nav-content-list');
	var status = navList.eq(_index).attr('data-status');
	navList.eq(_index).addClass('active').siblings().removeClass('active');
	contentList.eq(_index).addClass('active').siblings().removeClass('active');
	if(_index != 0){
		getStatus(status,_index);	
	}else{
		getAllOrders();
	}
	
}

var navList = $('.record-nav-list');
navList.on('click',function(){
	var _index = $(this).index();
	recordTab(_index);
})

var type = GetQueryString('type');
	if(type){
		recordTab(type);
	}else{
		getAllOrders();
	}
function getStatus(status,num){
	token = sessionStorage.getItem('token');
	var html = $('.record-nav-content-list').eq(num).find('ul').html();
	if(html !=""){
		return;
	}
	loading.load();
	var user={};
	user.pageIndex = 0;
	user.pageSize = 1000;
	user.startIndex = 0;
	user.userId = userId;
	user.status = [];
	user.status.push(status);
	user = JSON.stringify(user);
	$.ajax({
		type:"post",
		url:URL+"wxmp/order/queryList",
		headers: {
			'Authorization':'Bearer '+ token
		},
		contentType:'application/json',
		dataType:'json',
		data:user,
		success:function(data){
			loading.removeLoad();
			var list = data.data.list;
			var str='';
			if(list.length != 0){
				$(list).each(function(index,item){
					var link;
					var bg;
					if(item.status == 'UNPAYED'){
						link = 'orderDetails.html?id='+item.id+'"';
						bg='bg1';
					}else if( item.status == 'PAYED'){
						link = 'code.html?id='+item.id+'"';
						bg ='bg2';
					}else if( item.status == 'SERVICED'){
						link = 'orderDetails1.html?id='+item.id+'"';
						bg = 'bg3'
					}else if( item.status == 'CONFIRMED'){
						link = 'orderDetails2.html?id='+item.id+'"';
						bg = 'bg4';
					}
					
					
					str+='<li class="record-item">';
					str+='<a href="'+link+'">';
					str+='<h3 class="title">'+item.orderServicePacks[0].name+'<span class="badge1 '+bg+'">'+orderStatus[item.status]+'</span></h3>';
					str+='<p class="info"><span class="price-logo">&yen;</span>'+item.money+'<span class="fr">'+new Date(item.createTime).getFullYear() + '-' + (new Date(item.createTime).getMonth()+1) + '-' + new Date(item.createTime).getDate()+'</span></p>';
					str+='</a>';
					str+='</li>';
					
				})
				$('.record-nav-content-list').eq(num).find('ul').append(str);
			}else{
				$('.record-nav-content-list').eq(num).find('.empty-msg').show();
			}
		}
	})	
	
}


function getAllOrders(){
	//获取全部订单
	var user={};
	user.pageIndex = 0;
	user.pageSize = 1000;
	user.startIndex = 0;
	user.status = ['UNPAYED','PAYED','SERVICED','CONFIRMED','EVALUATED','REFUNDED'];
	user.userId = userId;
	user = JSON.stringify(user);
	var html = $('.record-nav-content-list').eq(0).find('ul').html();
	if(html !=""){
		return;
	}
	loading.load();
	$.ajax({
		type:"post",
		url:URL+"wxmp/order/queryList",
		headers: {
			'Authorization':'Bearer '+ token
		},
		contentType:'application/json',
		dataType:'json',
		data:user,
		success:function(data){
			loading.removeLoad();
			var list = data.data.list;
			var str='';
			if(list.length != 0){
				$(list).each(function(index,item){
					if(item.status == 'UNPAYED'){
						str+='<li class="record-item">';
						str+='<a href="orderDetails.html?id='+item.id+'">';
						str+='<h3 class="title">'+item.orderServicePacks[0].name+'<span class="badge1 bg1">待支付</span></h3>';
						str+='<p class="info"><span class="price-logo">&yen;</span>'+item.money+'<span class="fr">'+new Date(item.createTime).getFullYear() + '-' + (new Date(item.createTime).getMonth()+1) + '-' + new Date(item.createTime).getDate()+'</span></p>';
						str+='</a>';
						str+='</li>';
					}else if( item.status == 'PAYED'){
						str+='<li class="record-item">';
						str+='<a href="code.html?id='+item.id+'">';
						str+='<h3 class="title">'+item.orderServicePacks[0].name+'<span class="badge1 bg2">已支付</span></h3>';
						str+='<p class="info"><span class="price-logo">&yen;</span>'+item.money+'<span class="fr">'+new Date(item.createTime).getFullYear() + '-' + (new Date(item.createTime).getMonth()+1) + '-' + new Date(item.createTime).getDate()+'</span></p>';
						str+='</a>';
						str+='</li>';
					}else if(item.status == 'SERVICED'){
						str+='<li class="record-item">';
						str+='<a href="orderDetails1.html?id='+item.id+'">';
						str+='<h3 class="title">'+item.orderServicePacks[0].name+'<span class="badge1 bg3">待确认</span></h3>';
						str+='<p class="info"><span class="price-logo">&yen;</span>'+item.money+'<span class="fr">'+new Date(item.createTime).getFullYear() + '-' + (new Date(item.createTime).getMonth()+1) + '-' + new Date(item.createTime).getDate()+'</span></p>';
						str+='</a>';
						str+='</li>';
					}else if(item.status == 'CONFIRMED'){
						str+='<li class="record-item">';
						str+='<a href="orderDetails2.html?id='+item.id+'">';
						str+='<h3 class="title">'+item.orderServicePacks[0].name+'<span class="badge1 bg4">待评价</span></h3>';
						str+='<p class="info"><span class="price-logo">&yen;</span>'+item.money+'<span class="fr">'+new Date(item.createTime).getFullYear() + '-' + (new Date(item.createTime).getMonth()+1) + '-' + new Date(item.createTime).getDate()+'</span></p>';
						str+='</a>';
						str+='</li>';
					}else if(item.status == 'EVALUATED'){
						str+='<li class="record-item">';
						str+='<a href="orderDetails3.html?id='+item.id+'">';
						str+='<h3 class="title">'+item.orderServicePacks[0].name+'<span class="badge1 bg6">已完成</span></h3>';
						str+='<p class="info"><span class="price-logo">&yen;</span>'+item.money+'<span class="fr">'+new Date(item.createTime).getFullYear() + '-' + (new Date(item.createTime).getMonth()+1) + '-' + new Date(item.createTime).getDate()+'</span></p>';
						str+='</a>';
						str+='</li>';
					}else if(item.status == 'REFUNDED'){
						str+='<li class="record-item">';
						str+='<a href="orderDetails3.html?id='+item.id+'">';
						str+='<h3 class="title">'+item.orderServicePacks[0].name+'<span class="badge1 bg5">已退款</span></h3>';
						str+='<p class="info"><span class="price-logo">&yen;</span>'+item.money+'<span class="fr">'+new Date(item.createTime).getFullYear() + '-' + (new Date(item.createTime).getMonth()+1) + '-' + new Date(item.createTime).getDate()+'</span></p>';
						str+='</a>';
						str+='</li>';
					}
					
				})
				$('.record-nav-content-list').eq(0).find('ul').append(str);
			}else{
				$('.record-nav-content-list').eq(0).find('.empty-msg').show();
			}
			
		},
		error:function(data){
			//console.log(data);
		}
	});
}



