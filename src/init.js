"use strict";
var states = require("./states");
var engine = require("./engine").getInstance();
var Level  = require("./level.js");
var Player = require("./player");
var $h     = require("../lib/headOn.js");
module.exports = function(){
	var level = new Level("main");
	level.addMap("assets/maps/map_1.json");

	engine.registerLevel(level);
	engine.loadLevel("main");
	engine.addState("loading", states.loading);
	engine.addState("gameplay", states.gameplay);
	engine.loadImage("assets/images/guard.png", "guard");
	engine.loadImage("assets/images/player.png", "player");
	engine.loadImage("assets/images/tile.png", "level_1_map");
	engine.load("assets/maps/map_1.json", "json").then(function(img, id){
		JSON.parse(img.data);
	});
	engine.init(window.innerWidth, window.innerHeight).then(function(){

		var player = new Player();
		var l;
		engine.setPlayer(player);
		level.setMap("assets/maps/map_1.json");
		l = engine.getCurrentLevel();
		//console.log("latch")
		engine.camera.latchTo($h.Vector(0,0), $h.Vector(l.getWidth(),0), $h.Vector(l.getWidth(), l.getHeight()), $h.Vector(0, l.getHeight()));
	});

}
