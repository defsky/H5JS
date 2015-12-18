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
 function SnakeItem(x,y){
	this.X = x || 0;
	this.Y = y || 0;
 }
 
 function Snake(name,x,y){
	/*************************************************************************/
	//private properties
	/*************************************************************************/
	var _uid = _getUserId();
	var _name = name;
	
	//var _posX = x || 70;//according to map size
	//var _posY = y || 40;//according to map size 
	var _head = new SnakeItem(70,40);
	var _body = [_head];
	var _direction = DIRECTION.RIGHT;
	var _nextDirection = [];
	var _length = 3;//3-1000
	var _speed = 400;//0-100
	var _speedMode = 1;//1:Normal,2:Speed up
	
	var _lastMoveTime = (new Date()).getTime();
	
	for(var i=0;i<_length-1;i++){
		_body.push(new SnakeItem(_body[i].X - 1,_body[i].Y));
	}
	/*************************************************************************/
	//private functions
	/*************************************************************************/
	function _getUserId(){
		return 1000;
	};
	
	function _stepForward(body,seqno,newPos){
		if(typeof(body[seqno+1]) !== "undefined"){
			_stepForward(body,seqno+1,body[seqno]);
		}
		body[seqno].X = newPos.X;
		body[seqno].Y = newPos.Y;
	}
	
	function _getNextPos(){
		var nextPos={};
		nextPos.X = _body[0].X;
		nextPos.Y = _body[0].Y;
		
		switch(_direction){
			case DIRECTION.LEFT:
				nextPos.X -= 1;
				break;
			case DIRECTION.UP:
				nextPos.Y -= 1;
				break;
			case DIRECTION.RIGHT:
				nextPos.X += 1;
				break;
			case DIRECTION.DOWN:
				nextPos.Y += 1;
				break;
		}
		
		return nextPos;
	}
	
	function _hasSnack(pos,map){
		if(map.snack.X == pos.X && map.snack.Y == pos.Y){
			return true;
		}
		return false;
	}
	
	function _eatSnack(snack){
		_length = _body.unshift(new SnakeItem(snack.X,snack.Y));
		//_length += 1;
	}
	/*************************************************************************/
	// public interfaces
	/*************************************************************************/
	return {
		get name(){ return _name; },
		set name(name){ _name = name; },
		getX:function(i){ return _body[i].X; },
		getY:function(i){ return _body[i].Y; },
		get length(){ return _length; },
		move: function(map){
			var curTime = (new Date()).getTime();
			
			if( curTime - _lastMoveTime > _speed ){
				//console.log("snake moved:"+"_lastMoveTime("+_lastMoveTime+")-curTime("+curTime+")="+(curTime - _lastMoveTime));
				/*if(_nextDirection.length > 0){
					var newDirection = _nextDirection.shift();
					if(newDirection + _direction != 0){
						_direction = newDirection;
					}
				}*/
				if(_nextDirection.length > 0){
					do{
						var newDirection = _nextDirection.shift();
						
						if(Math.abs(_direction) != Math.abs(newDirection)){
							_direction = newDirection;
							break;
						}
					}while(_nextDirection.length > 0);
				}
					
				_lastMoveTime = curTime;
				
				var nextPos = _getNextPos();
				
				if(_hasSnack(nextPos,map)){
					_eatSnack(map.getSnack());
				}else{	
					_stepForward(_body,0,nextPos);
				}
			}
		},
		turn: function(direction){
			if( _nextDirection.length < 2){
				_nextDirection.push(direction);
			}
		},
		speedUp: function(){
			if( _speedMode != 2 ){
				_speedMode = 2;
				_speed /= 2;
			}
		},
		speedDown: function(){
			if( _speedMode != 1 ){
				_speedMode = 1;
				_speed *= 2;
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
		snakeHead:"#444",
		snakeTail:"#eee",
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
		//_context.strokeStyle = "#000";
		//_context.rect(x,y,_BLOCK_SIZE,_BLOCK_SIZE);
		//_context.stroke();
	}
	
	function _drawSnack(snack){
		if( _snack.fine != 0){
			_context.fillStyle=_COLOR.snack;
			_drawBlock(snack.X,snack.Y);
		}
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
		get snack(){
			return _snack;
		},
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
			_context.clearRect(0,0,_mapWidth * _BLOCK_SIZE
									,_mapHeight * _BLOCK_SIZE);
			_context.save();
			
			_generateSnack();
			_drawSnack(_snack);
			
			_snake.move(this);
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
		},
		getSnack: function(){
			_snack.fine = 0;
			return _snack;
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
	var _isPaused = false;

	/*************************************************************************/
	//private functions
	/*************************************************************************/
	
	function _setMap(map){
		_map = map;
	}
	
	function _drawFrame(){
		window.requestAnimationFrame(_drawFrame,_context);
		//_processKeyboard();
		//_render();
		//_updateSnakeStatus(_snakes);
		
		
		//_snake.move();
		//_map.addSnake(_snake);
		if(!_isPaused){
			_map.refresh();
		}
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
				_snake.speedUp();
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
				_isPaused = _isPaused ? false:true;
				break;
			case 13://Enter
				console.log("speed down");
				_snake.speedDown();
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