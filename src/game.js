var $h = require("../lib/headOn.js");
var engine = require("./engine.js")();
var Class = require("./utils.js").Class;
var Light = require("./light");
var ray = require("./utils").ray;
var Entity = require("./entity");
engine.load("assests/maps/test_map.json", "json").then(function(img, id){
	console.log("hey", img)
	console.log(JSON.parse(img.data))
});
engine.init(window.innerWidth, window.innerHeight);
var mouse = new $h.Vector(0,0);
var mask = $h.canvas.create("mask", window.innerWidth, window.innerHeight, engine.camera).append("body");
var test = new Entity();
console.log(test.getX());
mask.canvas.canvas.style.position = "absolute";
mask.canvas.canvas.style.top = "0"
mask.canvas.canvas.style.left = "0"
var keys ={};
var player = {
	position: new $h.Vector(50,50),
	angle:0,
	speed: 200,
	render: function(canvas){
		canvas.drawRect(16,16, this.position.x, this.position.y, "blue");
	},
	update: function(delta){
		var a =this.position.sub(mouse);
		this.angle = Math.atan2(a.y, a.x) + Math.PI;
		if(keys[37]){
			
		}
		if(keys[38]){
			this.position.x += Math.cos(this.angle) * (delta/1000) * this.speed;
			this.position.y += Math.sin(this.angle) * (delta/1000) * this.speed;
		}
		if(keys[39]){
			
		}
		if(keys[40]){
			this.position.x -= Math.cos(this.angle) * (delta/1000) * this.speed;
			this.position.y -= Math.sin(this.angle) * (delta/1000) * this.speed;
		}
	}
}
var map = {
	get:function(x,y){
		x = Math.floor(x/this.size);
		y = Math.floor(y/this.size);
		//console.log(x,y);
		if(y>=this.data.length|| x>=this.data[0].length || x<0 || y<0) return -1;
		return this.data[y][x];
	},
	size:16,
	length:26,
	width:30,
	data:[
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
	[1,0,0,0,0,0,0,1,1,0,0,1,0,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
	[1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	]
}
engine.mainCanvas.drawRect(window.innerWidth, window.innerHeight, 0,0, "black");

var light = new Light(20,50, 300, Math.PI/4, -Math.PI, "rgba(255,255,255,1)");
var plight = new Light(20, 50, 40, Math.PI * 2);
var tileSize = 16;
var mul = 1;

window.addEventListener("mousemove", function(e){
	mouse = new $h.Vector(e.x, e.y);
});
window.addEventListener("keydown", function(e){
	keys[e.which] = true;
});
window.addEventListener("keyup", function(e){
	keys[e.which] = false;
});
$h.run();



