var util = require("./utils");
var engine = require("./engine.js").getInstance();
var Entity = require("./entity.js");

function Player(name, x, y){
	Entity.call(this, "player", 5, 10);
}

util.Class(Player, Entity, {
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
	},
	render: function(canvas){
		Entity.prototype.render.call(this, canvas);
	}
});

module.exports = Player