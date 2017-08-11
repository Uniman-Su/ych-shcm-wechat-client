function setFont(){
	var html = document.documentElement;
	var width = html.getBoundingClientRect().width;
	var num = 16;
	html.style.fontSize = width/16 + 'px';
}
setFont();
window.onresize = function(){
	setFont();
}

