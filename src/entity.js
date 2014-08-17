var $h = require("../lib/headOn.js");
var util = require("./utils");
var engine = require("./engine.js").getInstance();
var astar = require("../lib/astar");
function Entity(name, x, y, width, height, angle){
	this.angle = angle || 0;
	this.width = width || 20;
	this.height = height || 20;
	this.image = engine.getImage(name);
	this.pos = new $h.Vector(x, y);
	this.id = engine.registerEntity(this);
}

util.Class(Entity, {
	setX: function(x){
		this.pos.x = x;
	},
	setY: function(y){
		this.pos.y = y;
	},
	getX: function(){
		return this.pos.x;
	},
	getY: function(){
		return this.pos.y;
	},
	getID: function(){
		return this.id;
	},
	getImage: function(){
		return this.image;
	},
	update: function(delta){
	},
	render: function(canvas){
		canvas.drawImage(this.image, ~~this.pos.x, ~~this.pos.y)
	},
	isActive: function(){
		return true;
	}, 
	at: function(vec){
		return Math.abs(vec.x - this.pos.x) <= 20 && Math.abs(vec.y - this.pos.y) <= 20;
	},
	checkCollision: function(){
		var verts = $h.getPoints(this);
		//god why cant this just stay constant
		var that = this;
		//$h.getPoints might should optionally return vectors instead of nested arrays
		verts.some(function(f){
			var tile = engine.getCurrentLevel().getMap(new $h.Vector(f[0], f[1]))
			if( tile.weight === 0){
				that.pos = that.old;
				return;
			}
		});
		
	},
	path: function(position){
		var currentLevel = engine.getCurrentLevel();
		var start = currentLevel.toTileCoords(this.pos);
		var end = currentLevel.toTileCoords(position)
		start = currentLevel.currentMap.collisions.grid[start.x][start.y];
		end = currentLevel.currentMap.collisions.grid[end.x][end.y];
		return astar.astar.search(currentLevel.currentMap.collisions, start, end );
	},
	think: function(){}
});

module.exports = Entity