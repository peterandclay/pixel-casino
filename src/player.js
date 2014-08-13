var util = require("./utils");
var engine = require("./engine.js").getInstance();
var Entity = require("./entity.js");

function Player(name, x, y){
	Entity.call(this, "player", 5, 10);
}

util.Class(Player, Entity, {
	update: function(delta){

		var delta = delta/1000;
		this.dx = this.dy = 0;
		if(engine.controls.up){
			if(engine.controls.down)
				this.dy = 0;
			else
				this.dy = -1
		}
		else if(engine.controls.down)
			this.dy = 1;

		if(engine.controls.left){
			if(engine.controls.right)
				this.dx = 0;
			else
				this.dx = -1;
		}
		else if(engine.controls.right)
			this.dx = 1;
		


		this.pos.x += this.dx * delta * 300;
		this.pos.y += this.dy * delta * 300;

		engine.camera.moveTo(this.pos);
	},
	render: function(canvas){
		Entity.prototype.render.call(this, canvas);
	}
});

module.exports = Player