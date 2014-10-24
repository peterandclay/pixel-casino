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
	this.tile = $h.Vector(0,0);
	this.tile.x = Math.floor(x/96);
	this.tile.y = Math.floor(y/96);
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
		var hits = [];
		var t;
		//$h.getPoints might should optionally return vectors instead of nested arrays
		verts.some(function(f, i){
			var tile = engine.getCurrentLevel().getMap(new $h.Vector(f[0], f[1]))
			var ent;
			var overlap;
			var normal;
			//console.log($h.collides(ent, that));
			if(tile.weight === 0){
				ent = {position:$h.Vector(tile.y*96,tile.x*96), angle:0, width:96, height:96};
				if(overlap = $h.collides(ent, that)){
					normal = $h.Vector(overlap.normal)
					that.pos = that.pos.add(normal.mul(overlap.overlap));
					//that.pos = that.old;
					return
				}
				//console.log("heyo")


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
