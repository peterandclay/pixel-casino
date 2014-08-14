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
	this.patrolPath = [this.pos.copy(), new $h.Vector(1500, 200)];
	this.patrolIndex = 0;
	this.target = this.patrolPath[0];
	this.fov = Math.PI/4;
	this.FSM.init(this);
	this.viewDistance = 400;
	
}

util.Class(Guard, Entity, {
	isActive: function(){
		return this.active;
	},
	setActive: function(active){
		this.active = active;
	},
	think: function(delta){
		this.FSM.update(delta);
	},
	FSM:{
		init: function(instance){
			this.instance = instance;
			this.state = instance.patrol;
			this.state.enter();
		},
		setState: function(state){
			this.state = state;
		},
  		changeState: function(state){
    		if(this.state){
      			this.state.exit(this.instance);
     			this.pState = this.state;
    		}
	    	this.state = state;
	    	this.state.enter(this.instance);
  		},
	  	update: function(delta){
	    	this.state.update(this, delta);
	  	}
	},
	canSeePlayer: function(){
		var player = engine.getPlayer();
		var dist = player.pos.sub(this.pos).length();
		var facing = new $h.Vector(Math.cos(this.angle), Math.sin(this.angle)).normalize();
		var toPlayer = player.pos.sub(this.pos).normalize();
		var angle = Math.acos(facing.dot(toPlayer))
		if(dist <=this.viewDistance && angle <= this.fov/2){
			return true;
		}
	},
	chasePlayer:{
		enter: function(guard){
			var path = guard.path(engine.getPlayer().pos);
			var temp = $h.Vector(path[0].x*96, path[0].y*96)
			temp = temp.sub(guard.pos);
			this.currentPath = path;
			this.pathIndex = 0;
			guard.angle = Math.atan2(temp.y, temp.x);
		},
		exit: function(){},
		update: function(FSM){
			var temp;
			var guard = FSM.instance;
			if(this.pathIndex + 1 === this.currentPath.length){
				if(guard.canSeePlayer()){
					this.enter(guard);
				}else{
					FSM.changeState(FSM.instance.patrol)
				}
			}else{
				temp = $h.Vector(this.currentPath[this.pathIndex].x*96, this.currentPath[this.pathIndex].y*96);
				if(FSM.instance.at(temp)){
					this.pathIndex++;
				}
				temp = temp.sub(guard.pos);
				guard.angle = Math.atan2(temp.y, temp.x);
			}
		}
	},
	update: function(delta){
		
		this.pos.x += Math.cos(this.angle) * 200 * (delta/1000);
		this.pos.y += Math.sin(this.angle) * 200 * (delta/1000);
	},
	render: function(canvas){
		//Entity.prototype.render.call(this, canvas);
		canvas.drawImageRotated(this.image, this.angle, this.pos.x, this.pos.y);
		var points = [
			$h.Vector(Math.cos(this.angle - this.fov/2) * this.viewDistance +this.pos.x, Math.sin(this.angle - this.fov/2) *this.viewDistance+ this.pos.y),
			$h.Vector(Math.cos(this.angle) * this.viewDistance +this.pos.x, Math.sin(this.angle)*this.viewDistance + this.pos.y),
			$h.Vector(Math.cos(this.angle + this.fov/2) * this.viewDistance +this.pos.x,Math.sin(this.angle + this.fov/2)*this.viewDistance + this.pos.y)
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
	patrol: {
		enter:function(){
			this.patrolIndex = 0;
		},
		exit: function(){},
		update: function(FSM, delta){
			if(FSM.instance.at(FSM.instance.patrolPath[this.patrolIndex])){
				this.patrolIndex += 1;
				this.patrolIndex %= FSM.instance.patrolPath.length;
			}
			this.target = FSM.instance.patrolPath[this.patrolIndex];
			this.angle = this.target.sub(FSM.instance.pos);
			FSM.instance.angle = Math.atan2(this.angle.y, this.angle.x);
			if(FSM.instance.canSeePlayer()){
				console.log("saw")
				this.target = engine.getPlayer();
				FSM.changeState(FSM.instance.chasePlayer);
			}
		}
	}

});

module.exports = Guard