/*
 * Snake constructor
 *****************************************************************************
 * name	: snake name
 * x	: position x on map
 * y	: position y on map
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
 * Map constructor
 *****************************************************************************
 * context	: canvas context object
 */
 function Map(context){
	/*************************************************************************/
	//private properties
	/*************************************************************************/
	var _context = context;
	var _width = 3;
	var _height = 3;
	
	var _snakes = [];
	var _mapState = [
		[0,0,0],
		[0,0,0],
		[0,0,0]
	];

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
		refresh: function(){
			_generateSnack();
		},
		addSnake: function(snake){
			_snakes.push(snake);
		},
		removeSnake: function(snake){
			_snakes.pop();
		}
	};
 }//Map constructor end
 
 /*
 * Engine constructor
 *****************************************************************************
 * context	: canvas context object
 */
 function Engine(context){
	/*************************************************************************/
	//private properties
	/*************************************************************************/
	var _context = context;
	var _map = {};
	var _snakes = [];

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
		setMap: function(map){
			_map = map;
		},
		start: function(){
		
		}
	};
 }//Engine constructor end