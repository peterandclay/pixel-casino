var $h = require("../lib/headOn.js");
var utls = require("./utils.js")
(function(){
	function engine(){
		if ( engine.prototype._singletonInstance ) {
		    return engine.prototype._singletonInstance;
		}
		engine.prototype._singletonInstance = this;
		return this;
	}

	engine.prototype.getInstance = function(){
		return this.instance;
	}
	engine.prototype.init = function(width, height){
		this.levels = {};
		this.everything = {};
		this.gameWidth = width;
		this.gameHeight = height;
		this.camera = new $h.Camera(width, height);
		this.mainCanvas = $h.canvas.create("main", width, height, this.camera);
		this.mainCanvas.append("body");
	}
	engine.prototype.registerLevel = function(name, leveldata) {
		// body...
		var id = utils.UUID();
		leveldata.ID = id;
		this.levels[name] = leveldata;
		this.everything[id] = this.levels[name];
	};
	engine.prototype.loadLevel = function(levelname) {
		var level = this.everything[levelname] || this.levels[levelname];
		this.currentLevel = level;
	};
	var instance = new engine();
	module.exports = engine;
}())