var states = require("./states");
var engine = require("./engine").getInstance();
var Level = require("./level.js");
var Player = require("./player");
module.exports = function(){
	var level = new Level("main");
	level.addMap("/assets/maps/map_1.json");
	
	engine.registerLevel(level);
	engine.loadLevel("main");
	engine.addState("loading", states.loading);
	engine.addState("gameplay", states.gameplay);
	engine.loadImage("assets/images/guard.png", "guard");
	engine.loadImage("assets/images/tile.png", "level_1_map");
	engine.load("assets/maps/map_1.json", "json").then(function(img, id){
		JSON.parse(img.data);
	});
	engine.init(window.innerWidth, window.innerHeight).then(function(){
		level.setMap("/assets/maps/map_1.json");
		window.addEventListener("keydown", function(e){
			engine.controls[engine.keyMap[e.which]] = true;
			engine.keys[e.which] = true;
			console.log(engine.controls, engine.keys);
		});
		window.addEventListener("keyup", function(e){
			engine.controls[engine.keyMap[e.which]] = false;
			engine.keys[e.which] = false;
		});
		var player = new Player();
	});

}