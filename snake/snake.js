/*
 * Snake constructor
 *****************************************************************************
 * name	: snake name
 * x	: head position x on map
 * y	: head position y on map
 */
 function Snake(name,x,y){
	/*************************************************************************/
	//private properties
	/*************************************************************************/
	var _uid = _getUserId();
	var _name = name;
	
	var _posX = x;//according to map size
	var _posY = y;//according to map size
	var _direction = "right";//left,up,right,down
	var _length = 3;//3-1000;
	var _speed = 10;//0-100
	
	/*************************************************************************/
	//private functions
	/*************************************************************************/
	function _getUserId(){
		return 1000;
	};
	
	/*************************************************************************/
	// public interfaces
	/*************************************************************************/
	return {
		get name(){ return _name; },
		set name(name){ _name = name; },
		move: function(){
			
		}
	};
 }//Snake constructor end

/*
 * SnakeMap constructor
 *****************************************************************************
 * context	: canvas context object
 * width	: map width
 * height	: map height
 */
 function SnakeMap(context,width,height){
	/*************************************************************************/
	//private properties
	/*************************************************************************/
	var _context = context;
	var _mapWidth = (width==undefined) ? 0 : (width / 5);
	var _mapHeight = (height==undefined) ? 0 : (height / 5);
	
	var _snakes = [];
	var _mapState = [];

	/*************************************************************************/
	//private functions
	/*************************************************************************/
	function _generateSnack(){
		return ;
	};
	
	/*************************************************************************/
	// public interfaces
	/*************************************************************************/
	return {
		init: function(){
			if(_context == undefined){
				throw Error("canvas context undefined");
			}
			if(_mapWidth == 0 || _mapHeight == 0){
				throw Error("map Width or Height not specified");
			}
			_context.fillRect(10,10,100,100);
		},
		refresh: function(){
			//_generateSnack();
			_context.fillRect(110,110,5,5);
		},
		addSnake: function(snake){
			_snakes.push(snake);
		},
		removeSnake: function(snake){
			_snakes.pop();
		}
	};
 }//SnakeMap constructor end
 
 /*
  * SnakeGame constructor
  ****************************************************************************
  * canvasId	: string, representation canvas id 
  */
 function SnakeGame(canvasId){
	/*************************************************************************/
	//private properties
	/*************************************************************************/
	var _context = {};
	var _contextWidth = 0;
	var _contextHeight = 0;
	var _map = {};
	var _snakes = [];
	var _keyboard = {};
	var _bStarted = false;

	/*************************************************************************/
	//private functions
	/*************************************************************************/
	function _generateSnack(){
		return ;
	};
	
	function _setMap(map){
		_map = map;
	}
	
	function _drawFrame(){
		window.requestAnimationFrame(_drawFrame,_context);
		//_processKeyboard();
		//_render();
		_updateSnakeStatus(_snakes);
		_map.refresh();
	}
	
	function _updateSnakeStatus(snakes){
	
	}
	
	function _render(){
		_map.refresh();
	}
	
	function _callbackProcessKeyboard(event){
		switch(event.keyCode){
			case 87://w
				console.log("turn up");
				break;
			case 83://s
				console.log("turn down");
				break;
			case 65://a
				console.log("turn left");
				break;
			case 68://d
				console.log("turn right");
				break;
			case 13://Enter
				console.log("new snake");
				break;
			case 32://Space
				console.log("pause/continue");
				break;
		}
	}
	
	function _init(id){
		var canvas = document.getElementById(id);
		_contextWidth = canvas.width;
		_contextHeight = canvas.height;
		
		//_keyboard = utils.captureKeyboard(window);
		window.addEventListener('keydown',_callbackProcessKeyboard,false);
		
		if (canvas == undefined){
			throw Error("element id "+id+" is not defined");
		}
		_context = canvas.getContext('2d');
		
		_map = SnakeMap(_context,_contextWidth,_contextHeight);
		_map.init();
		
		_drawFrame();
	}
	
	/*************************************************************************/
	// public interfaces
	/*************************************************************************/
	return {
		start: function(){
			_init(canvasId);
		}
	};
 }//SnakeGame constructor end