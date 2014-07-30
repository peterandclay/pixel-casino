var $h = require("../lib/headOn.js");

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
		this.gameWidth = width;
		this.gameHeight = height;
		this.camera = new $h.Camera(width, height);
		this.mainCanvas = $h.canvas.create("main", width, height, this.camera);
		this.mainCanvas.append("body")
	}
	var instance = new engine();
	module.exports = engine;
}())