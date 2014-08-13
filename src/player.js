var Entity = require("./entity.js");

function Player(name, x, y){
	Entity.call(this, "player", 5, 10);
}

util.Class(Player, {
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
		canvas.drawImage(this.image, x, y)
	}
});

module.exports = Player