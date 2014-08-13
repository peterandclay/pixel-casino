var $h = require("../lib/headOn.js");
var util = require("./utils");
var engine = require("./engine.js").getInstance();

function Entity(name, x, y){
	this.image = engine.getImage(name);
	this.pos = new $h.Vector(x, y);
	this.id = engine.registerEntity(this);
}

util.Class(Entity, {
	update: function(delta){
		if(engine.controls.up)
			this.dy = 1;
		if(engine.controls.down)
			this.dy = -1;
		if(engine.controls.left)
			this.dx = -1;
		if(engine.controls.right)
			this.dx = 1;

		this.pos.x += this.dx * 10;
		this.pos.y += this.dy * 10;
	}
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

	}
});

module.exports = Entity