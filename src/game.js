var $h = require("../lib/headOn.js");
var engine = require("./engine.js")();
var Class = require("./utils.js").Class;
var Light = require("./light");
var ray = require("./utils").ray;
engine.init(window.innerWidth, window.innerHeight);
var map = {
	get:function(x,y){
		x = Math.floor(x/this.size);
		y = Math.floor(y/this.size);
		//console.log(x,y);
		if(y>=this.data.length|| x>=this.data[0].length || x<0 || y<0) return -1;
		return this.data[y][x];
	},
	size:16,
	length:10,
	width:30,
	data:[
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	]
}
engine.mainCanvas.drawRect(window.innerWidth, window.innerHeight, 0,0, "black");

var light = new Light(20,20, 100);
var tileSize = 16;
var mul = 1;
$h.update(function(delta){
	//console.log(delta);
	light.position.x += 100 * (delta / 1000) * mul;
	if(light.position.x > 400){
		mul = -1;
	}
	if(light.position.x < 17){
		mul = 1;
	}
})
$h.render(function(){
	engine.mainCanvas.drawRect(window.innerWidth, window.innerHeight, 0,0, "black");
	for(var y=0; y<map.length; y++){
		for(var x = 0; x<map.width; x++){
			if(map.data[y][x]){
				engine.mainCanvas.drawRect(16,16, x*16, y*16, "red");
			}
		}
	}
	light.render(engine.mainCanvas, map);
	//console.log(ray(20,20, 50,50, map))

})

$h.run();



