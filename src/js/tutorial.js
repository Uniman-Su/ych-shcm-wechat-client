import '../css/animate.min.css';
document.addEventListener('touchmove',function(e){
	e.preventDefault();
},false);
window.onload = function(){
	var tutorial = document.querySelectorAll('.tutorial-container');
	var agin = document.getElementById('agin');
	var length = tutorial.length;
	var i = 1;
	var timer;
	
	function run(){
		timer = setInterval(function(){
			tutorial[i].style.display = 'block';
			setTimeout(function(){
				tutorial[i-1].style.display = 'none';
				i++;
				if(i >= length ){
					clearInterval(timer);
					return;
				}
			},1000)
		},3000);
	}
	
	run();
	
	agin.addEventListener('click',function(){
		i = 1;
		for( var j = 0; j < length; j++){
			tutorial[j].style.display = 'none';
		}
		tutorial[0].style.display = 'block';
		run();
	},false);
}	