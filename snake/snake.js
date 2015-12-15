const DIRECTION = {
	LEFT:1,
	UP:2,
	RIGHT:-1,
	DOWN:-2
};

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
	
	//var _posX = x || 70;//according to map size
	//var _posY = y || 40;//according to map size
	var _body = [{X:70,Y:40},{X:69,Y:40},{X:68,Y:40}];
	var _direction = DIRECTION.RIGHT;
	var _length = 3;//3-1000
	var _speed = 10;//0-100
	
	var _timer = new Date();
	var _lastMoveTime = _timer.getTime();
	
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
		getX:function(i){ return _body[i].X; },
		getY:function(i){ return _body[i].Y; },
		get length(){ return _length; },
		move: function(){
			var oldTime = _lastMoveTime;
			_lastMoveTime = (new Date()).getTime();
			
			if( _lastMoveTime - oldTime > 530){
				var prePos = _body[0];
				
				switch(_direction){
					case DIRECTION.LEFT:
						_body[0].X -= 1;
						break;
					case DIRECTION.UP:
						_body[0].Y -= 1;
						break;
					case DIRECTION.RIGHT:
						_body[0].X += 1;
						break;
					case DIRECTION.DOWN:
						_body[0].Y += 1;
						break;
				}
				
				var curPos = {};
				for(var i=1;i<_body.length;i++){
					curPos = _body[i];
					_body[i] = prePos;
					prePos = curPos;
				}
			}
		},
		turn: function(direction){
			if( Math.abs(_direction) != Math.abs(direction)){
				_direction = direction;
			}
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
	const _BLOCK_SIZE = 5;
	const _COLOR = {
		map:"#999",
		wall:"#333",
		snakeHead:"#000",
		snakeTail:"#fff",
		snack:"#f00"
	};
	
	var _context = context;
	var _mapWidth = (width==undefined) ? 0 : (width / 5);
	var _mapHeight = (height==undefined) ? 0 : (height / 5);
	
	var _snack = {X:0,Y:0,fine:0};
	var _snake = {};
	var _mapState = new Array(); //0:map,1:snake head,2:snake tail,3:snack,4:wall

	/*************************************************************************/
	//private functions
	/*************************************************************************/
	function _generateSnack(){
		if( _snack.fine == 0){
			_snack = {
				X: Math.floor(Math.random() * _mapWidth),
				Y: Math.floor(Math.random() * _mapHeight),
				fine: 1
			};
		}
	};
	
	function _drawBlock(mapX,mapY){
		if(mapX > _mapWidth || mapY > _mapHeight || mapX < 0 || mapY < 0){
			throw Error("Block coord exceed the map size");
		}
		var x = mapX * _BLOCK_SIZE;
		var y = mapY * _BLOCK_SIZE;
		
		_context.fillRect(x,y,_BLOCK_SIZE,_BLOCK_SIZE);
	}
	
	function _drawSnack(snack){
		_context.fillStyle=_COLOR.snack;
		_drawBlock(snack.X,snack.Y);
	}
	
	function _drawSnake(snake){
		_context.fillStyle=_COLOR.snakeHead;
		_drawBlock(snake.getX(0),snake.getY(0));
		_context.fillStyle=_COLOR.snakeTail;

		for(var i=1;i<snake.length;i++){
			_drawBlock(snake.getX(i),snake.getY(i));
		}
	}
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
			
			for(var i=0;i<_mapWidth;i++){
				_mapState[i] = new Array();
				for(var j=0;j<_mapHeight;j++){
					if(i==0 || i==(_mapWidth - 1) 
						|| j==0 || j==(_mapHeight - 1)){
						_mapState[i][j] = 4;
					} else {
						_mapState[i][j] = 0;
					}
				}
			}
		},
		refresh: function(){
			_generateSnack();
			_context.clearRect(0,0,_mapWidth * _BLOCK_SIZE
									,_mapHeight * _BLOCK_SIZE);
			
			_context.save();
			_context.fillStyle = _COLOR.map;
			_context.fillRect(0,0,_mapWidth * _BLOCK_SIZE
									,_mapHeight * _BLOCK_SIZE);
			
			/*for(var i=0;i<_mapWidth;i++){
				for(var j=0;j<_mapHeight;j++){
					if(_mapState[i][j] != 0){
						switch(_mapState[i][j]){
							case 1:
								_context.fillStyle = _COLOR.snakeHead;
								break;
							case 2:
								_context.fillStyle = _COLOR.snakeTail;
								break;
							case 3:
								_context.fillStyle=_COLOR.snack;
								break;
							case 4:
								_context.fillStyle = _COLOR.wall;
								break;
						}
						_drawBlock(i,j);
					}
				}
			}*/
			
			_drawSnack(_snack);
			_drawSnake(_snake);
			_context.restore();
			
			//_drawBlock(50,50);
		},
		addSnake: function(snake){
			//_snakes.push(snake);
			_snake = snake;
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
	var _snake = {};
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
		//_updateSnakeStatus(_snakes);
		
		
		_snake.move();
		_map.addSnake(_snake);
		_map.refresh();
	}
	
	function _updateSnakeStatus(snakes){
	
	}
	
	function _render(){
		_map.refresh();
	}
	
	function _callbackKeydown(event){
		switch(event.keyCode){
			case 69://e
				console.log("turn up");
				_snake.turn(DIRECTION.UP);
				break;
			case 68://d
				console.log("turn down");
				_snake.turn(DIRECTION.DOWN);
				break;
			case 83://s
				console.log("turn left");
				_snake.turn(DIRECTION.LEFT);
				break;
			case 70://f
				console.log("turn right");
				_snake.turn(DIRECTION.RIGHT);
				break;
			case 13://Enter
				console.log("speed up");
				break;
		}
	}
	
	function _callbackKeyup(event){
		console.log(event.keyCode);
		switch(event.keyCode){
			case 17://Ctrl
				console.log("get a snake");
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
		window.addEventListener('keydown',_callbackKeydown,false);
		window.addEventListener('keyup',_callbackKeyup,false);
		
		if (canvas == undefined){
			throw Error("element id '"+id+"' is not defined");
		}
		_context = canvas.getContext('2d');
		
		_map = SnakeMap(_context,_contextWidth,_contextHeight);
		_map.init();
		
		_snake = Snake("def");
		_map.addSnake(_snake);
		
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