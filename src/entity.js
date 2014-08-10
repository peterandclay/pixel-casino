var $h = require("../lib/headOn.js");
var util = require("./utils");

function Entity(){
	this.pos = new $h.Vector(5, 10);
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
	}
});

module.exports = Entity