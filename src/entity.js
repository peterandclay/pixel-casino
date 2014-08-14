var $h = require("../lib/headOn.js");
var util = require("./utils");
var engine = require("./engine.js").getInstance();
var astar = require("../lib/astar");
function Entity(name, x, y){
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
		canvas.drawImage(this.image, this.pos.x, this.pos.y)
	},
	isActive: function(){
		return true;
	}, 
	at: function(vec){
		return Math.abs(vec.x - this.pos.x) <= 20 && Math.abs(vec.y - this.pos.y) <= 20;
	},
	path: function(position){
	},
	think: function(){}
});

module.exports = Entity