var utils = {};

//(function(){
  if(!window.requestAnimationFrame){
    window.requestAnimationFrame = (
	  window.webkitRequestAnimationFrame ||
	  window.mozRequestAnimationFrame ||
	  window.oRequestAnimationFrame ||
	  window.msRequestAnimationFrame ||
	  function(callback){
	    return window.setTimeout(callback,1000/60);
	  }
	);
  }
//})();

utils.getElementsByClassName = function(className,context){
	//如果有指定从某个元素里寻找
	context = context || document;

	//如果浏览器支持原生的方法，则直接用原生的方法
	if(context.getElementsByClassName){                               
		return context.getElementsByClassName(className);
	}

	//遍历
	var nodes = context.getElementsByTagName("*"); 

	//存放匹配到的节点
	var rets = [];                                                     
	for(var i = 0; i < nodes.length; i++){
		//hasClass派上用场了
		if(hasClass(className,nodes[i])){                      
			rets.push(nodes[i]);
		}
	}
	return rets;
}

/* captureKeyboard
 * return the keycode which 'keydown' occured
 */
utils.captureKeyboard = function(element){
  var keyboard = {
	code: 0,
	altKey: false,
	ctrlKey: false,
	shiftKey: false
	};
	
  element.addEventListener('keydown',function(event){
	console.log(event.keyCode);
    keyboard.code = event.keyCode;
	keyboard.altKey = event.altKey;
	keyboard.ctrlKey = event.ctrlKey;
	keyboard.shiftKey = event.shiftKey;
  },false);
  
  element.addEventListener('keyup',function(event){
    switch(event.keyCode){
		case 18:
			keyboard.altKey = event.altKey;
			break;
		case 17:
			keyboard.ctrlKey = event.ctrlKey;
			break;
		case 16:
			keyboard.shiftKey = event.shiftKey;
			break;
	}
  },false);
  
  return keyboard;
};

/*	captureMouse
 *	return the position object of mouse
 */
utils.captureMouse = function(element){
  var mouse = {x: 0,y: 0};
  element.addEventListener('mousemove',function(event){
    var x,y;
	if(event.pageX || event.pageY){
	  x = event.pageX;
	  y = event.pageY;
	} else {
	  x = event.clientX + document.body.scrollLeft +
	    document.documentElement.scrollLeft;
	  y = event.clientX + document.body.scrollLeft +
	    document.documentElement.scrollTop;
	}
	x -= element.offsetLeft;
	y -= element.offsetTop;
	
	mouse.x = x;
	mouse.y = y;
  },false);
  
  return mouse;
};

/*	captureTouch
 *	return the position object of touch
 */
utils.captureTouch = function(element){
  var touch = {x: null, y: null, isPressed: false};
  
  element.addEventListener('touchstart',function(event){
    touch.isPressed = true;
  },false);
  
  element.addEventListener('touchend',function(event){
    touch.isPressed = false;
	touch.x = null;
	touch.y = null;
  },false);
  
  element.addEventlistener('touchmove',function(event){
    var x,y,
	touch_event = event.touches[0];//first touch spot
	
	if(touch_event.pageX || touch_event.pageY){
	  x = touch_event.pageX;
	  y = touch_event.pageY;
	} else {
	  x = touch_event.clientX + document.body.scrollLeft +
	    document.documentElement.scrollLeft;
	  y = touch_event.clientY + document.body.scrollTop +
	    document.documentElement.scrollTop;
	}
	x -= offsetLeft;
	y -= offsetTop;
	
	touch.x = x;
	touch.y = y;
  },false);
  
  return touch;
};

/*	colorToRGB : extract color to rgb or rgba
 *	->color : #RRGGBB or 0xRRGGBB
 *	->alpha : range from 0 to 1,default 1
 *	<-string : "rgb(r,g,b)" or "rgba(r,g,b,a)"
 */
utils.colorToRGB = function(color,alpha){
  //if string format,convert to number
  if(typeof color == 'string' && color[0] === '#'){
    color = window.parseInt(color.slice(1),16);
  }
  alpha = (alpha === undefined) ? 1 : alpha;
  
  //extract component values
  var r = color >> 16 & 0xff;
  var g = color >> 8 & 0xff;
  var b = color & 0xff;
  var a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);//check range
  
  //use 'rgba' if needed
  if(a === 1){
    return "rgb(" +r+ "," +g+ "," +b+ ")";
  } else {
    return "rgba(" +r+ "," +g+ "," +b+ "," +a+ ")";
  }
};

utils.parseColor = function(color,toNumber){
  if(toNumber === true){
    if(typeof color === 'number'){
	  return (color | 0);//chop off decimal
	}
	if(typeof color === 'string' && color[0] === '#'){
	  color = color.slice(1);
	}
	return window.parseInt(color,16);
  } else {
    if(typeof color === 'number'){
	  //make sure our hexadecimal number is padded out
	  color = '#' + ('0000' + (color | 0).toString(16)).substr(-6);
	}
	return color;
  }
};

utils.addPrivateProperty = function(o,name,predicate){
	var value;
	o["get"+name] = function(){ return value;};
	o["set"+name] = function(v){
	  if(predicate && !predicate(v)){
		throw Error(v+"->Parameter type error of set"+name+"(String)");
	  } else {
		value = v;
	  }
	}
};

utils.Counter = function(i){
  var _value = 0;
  
  //如果初始值为null则，初始值设置为0
  //如果初始值不为数字则报参数错误
  if(i == null || i == undefined){
    _value = 0;
  } else if(typeof i == "number"){
    _value = i;
  } else {
    throw Error(i+"->Parameter type error");
  }
  
  //Counter对象的接口
  return {
    //每次访问value值后，自增1
    get value(){ return _value++; },
	
	//value赋值时只能是number类型，否则报错
	set value(v){ 
	  if(typeof v =="number"){
	    _value = v; 
	  } else {
	    throw Error(v+"->Parameter type error");
	  }
	}
	
  }
};
