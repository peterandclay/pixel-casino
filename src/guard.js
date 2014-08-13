var Entity = require("./entity.js");
var util = require("./utils");
var engine = require("./engine").getInstance();
var $h = require("../lib/headOn");
var Light = require("./light");
function Guard(x,y){
	Entity.call(this, "guard", x,y);
	this.active = true;
	this.angle = 0;
	this.state = this.patrol;
	this.patrolPath = [this.pos.copy(), new $h.Vector(1500, 500)];
	this.patrolIndex = 0;
	this.target = this.patrolPath[0];
	this.fov = Math.PI/2;
}

util.Class(Guard, Entity, {
	isActive: function(){
		return this.active;
	},
	setActive: function(active){
		this.active = active;
	},
	think: function(){
		this.state();
	},
	canSeePlayer: function(){
		var player = engine.getPlayer();
		var dist = player.pos.sub(this.pos).length();
		var facing = new $h.Vector(Math.cos(this.angle), Math.sin(this.angle)).normalize();
		var toPlayer = player.pos.sub(this.pos).normalize();
		var angle = Math.acos(facing.dot(toPlayer))
		if(dist <=200 && angle <= this.fov/2){
			return true;
		}
	},
	chasePlayer: function(){
		var temp = engine.getPlayer().pos.sub(this.pos);
		this.angle = Math.atan2(temp.y, temp.x);
	},
	update: function(delta){
		this.pos.x += Math.cos(this.angle) * 200 * (delta/1000);
		this.pos.y += Math.sin(this.angle) * 200 * (delta/1000);
	},
	render: function(canvas){
		//Entity.prototype.render.call(this, canvas);
		canvas.drawImageRotated(this.image, this.angle, this.pos.x, this.pos.y);
		var points = [
			$h.Vector(Math.cos(this.angle - this.fov/2) * 200 +this.pos.x, Math.sin(this.angle - this.fov/2) *200+ this.pos.y),
			$h.Vector(Math.cos(this.angle) * 200 +this.pos.x, Math.sin(this.angle)*200 + this.pos.y),
			$h.Vector(Math.cos(this.angle + this.fov/2) * 200 +this.pos.x,Math.sin(this.angle + this.fov/2)*200 + this.pos.y)
		]
		var pos = engine.camera.unproject(this.pos);
		canvas.canvas.ctx.beginPath();
		canvas.canvas.ctx.moveTo(pos.x, pos.y);
		points.forEach(function(p){
			var coords = engine.camera.unproject(p);
			canvas.canvas.ctx.lineTo(coords.x, coords.y);

		});
		canvas.canvas.ctx.moveTo(pos.x, pos.y);
		canvas.canvas.ctx.fillStyle = "rgba(0,0,255,.5)";
		canvas.canvas.ctx.fill();
		
		

	},
	patrol: function(){

		if(this.at(this.patrolPath[this.patrolIndex])){
			console.log("hey2")
			this.patrolIndex += 1;
			this.patrolIndex %= this.patrolPath.length;
			console.log(this.patrolIndex);
		}
		this.target = this.patrolPath[this.patrolIndex];
		this.angle = this.target.sub(this.pos);
		this.angle = Math.atan2(this.angle.y, this.angle.x);
		if(this.canSeePlayer()){
			console.log("saw")
			this.target = engine.getPlayer();
			this.state = this.chasePlayer;
		}
	}

});

module.exports = Guard