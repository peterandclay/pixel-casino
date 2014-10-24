var util = require("./utils");
var engine = require("./engine.js").getInstance();
var Entity = require("./entity.js");

function Player(name, x, y){
	Entity.call(this, "player", 5, 10, 32, 32);
	this.ticks = 0;
	this.lerpSpeed =16;
	this.old = this.pos.copy();
	this.old.x = Math.floor(0);
	this.old.y = Math.floor(0);
	this.lerpamount = 0;
}

util.Class(Player, Entity, {
	update: function(delta){



		var delta = delta/1000;

	  this.lerpamount += delta;
		var t = this.lerpamount/.5;
		this.dx = this.dy = 0;
		this.pos.x = $h.lerp(this.old.x *96, this.tile.x *96, t);
		this.pos.y = $h.lerp(this.old.y*96, this.tile.y*96, t);
		engine.camera.moveTo(this.pos);
		if(this.lerpamount <= .5 && this.moved){
			return;
		}else{
			this.moved = false;
		}



		this.old = this.tile.copy();
		if(engine.controls.up){
			this.tile.y --;
			this.moved = true;
		}
		if(engine.controls.down){
			this.tile.y++;
			this.moved = true;
		}

		if(engine.controls.left){
			this.tile.x--;
			this.moved = true;
		}
		if(engine.controls.right){
			this.tile.x++;
			this.moved = true;
		}








		//this.pos.x = this.tile.x *96;
		//this.pos.y = this.tile.y *96;
		//this.pos.x += this.dx * delta * 300;
		//this.pos.y += this.dy * delta * 300;
		//Make this smarter by putting player right on edge of tile they are hitting
		//but not right now. cause its late
		//this.checkCollision();

		this.lerpamount = 0;


	},
	render: function(canvas){
		Entity.prototype.render.call(this, canvas);
	}
});

module.exports = Player
