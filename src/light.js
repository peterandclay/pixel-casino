var $h = require("../lib/headOn");
var ray = require("./utils").ray;
var config = require("./config");
function Light(x, y, radius, sector, angle, color){
	this.position = new $h.Vector(x, y);
	this.radius = radius;
	if(!x || !y || !radius){
		this.render = false;
		console.warn("Lights need x y and radius specified");
	}
	this.sector = sector || Math.PI * 2;
	this.angle = angle || 0;
	this.color = color || "white"
}
module.exports = Light;
Light.prototype = {
	render: function(canvas, map){
		if(this.render === false) return;
		var NUM_OF_RAYS = config.NUM_OF_RAYS;
		var ctx = canvas.canvas.ctx;
		var i;
		var s;
		var a = this.angle;
		var amt = (this.sector)/NUM_OF_RAYS;
		var p;
		var end;
		var t;
		var p2x;
		var p2y;

		//Start a path
		ctx.beginPath();
		ctx.moveTo(this.position.x, this.position.y);
		//Loop through all the angles that the light needs
		//console.log(this, this.position.x, a, this.radius);
		for(i=0; i<NUM_OF_RAYS; i++, a+=amt){
			//find the end point of a line from that angle
			p2x = this.position.x + Math.cos(a) * this.radius;
			p2y = this.position.y + Math.sin(a) * this.radius;
			//go along path to find walls.
			p = ray(this.position.x,this.position.y, p2x, p2y, map);

			if(i===0) end = p;
			//make a line to where it found a wall or the end of the path
			ctx.lineTo(p.x, p.y);
		}
		//if its a full circle we need to end where we started or there will be a small peice missing
		//if it isnt a full circle we need to end where the lights position is so we get a nice cone shape
		if(this.sector === Math.PI * 2){
			ctx.lineTo(end.x,end.y);
		}else{
			ctx.lineTo(this.position.x, this.position.y);
		}
		ctx.fillStyle = this.color;
		ctx.fill();
	}

}