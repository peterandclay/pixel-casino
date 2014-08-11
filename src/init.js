var states = require("./states");
var engine = require("./engine").getInstance();
module.exports = function(){
	engine.addState("loading", states.loading);
	engine.addState("gameplay", states.gameplay);
	engine.loadImage("assets/images/guard.png", "guard");
	engine.load("assets/maps/test_map.json", "json").then(function(img, id){
		console.log(JSON.parse(img.data))
	});
	engine.init(window.innerWidth, window.innerHeight);
}