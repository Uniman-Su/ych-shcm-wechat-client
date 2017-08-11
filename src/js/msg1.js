function msg(msg,delay){
	var deep = delay || 2000;
	var Dom = $('<div class="msg success"><p>'+msg+'</p></div>');
	$('body').append(Dom);
	setTimeout(function(){
		Dom.remove();
	},deep)
}
module.exports = msg;
