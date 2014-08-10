var $h = require("../lib/headOn.js");
var utils = require("./utils.js");
var Q = require("q");
(function(){
	function engine(){
		if ( engine.prototype._singletonInstance ) {
		    return engine.prototype._singletonInstance;
		}
		engine.prototype._singletonInstance = this;
		this.levels = {};
		this.images = {};
		this.everything = {};
		this.loadQueue = [];
		return this;
	}

	engine.getInstance = function(){
		return engine.prototype._singletonInstance;
	}
	engine.prototype.init = function(width, height){
		this.loaded = false;
		this.gameWidth = width;
		this.gameHeight = height;
		this.camera = new $h.Camera(width, height);
		this.mainCanvas = $h.canvas.create("main", width, height, this.camera);
		this.mainCanvas.append("body");

		this.loadEverything().then(function(){
			this.loading = false;
			this.loaded = true;
		});
	}
	engine.prototype.registerLevel = function(level) {
		// body...
		var id = utils.UUID();
		level.ID = id;
		this.levels[name] = leveldata;
		this.everything[id] = this.levels[level.name];
	};
	engine.prototype.loadEverything = function(){
		this.loading = true;
		var item;
		var promises = [];
		for(var i =0, l=this.loadQueue.length; i<l; i++){
			item = this.loadQueue[i];
			if(item.image){
				promises.push(this.doImage(item));
			}else{
				promises.push(this.doOther(item));
			}
		}
		return Q.all(promises);
	}
	engine.prototype.startGameLoop = function(){
		
	}
	engine.prototype.doOther = function(item){
		var q = Q.defer();
		var that = this;
		var xhr = new XMLHttpRequest();
		var id = utils.UUID();
		xhr.open("get", item.src, true);
		xhr.onload = function(e){
			that.everything[id] = this.response;
			item.promise.resolve({data:this.response, id:id});
			q.resolve();
		}
		xhr.send();
		return q.promise;
	};
	engine.prototype.doImage = function(item){
		var id = utils.UUID();
		var q = Q.defer();
		var i = new Image();
		i.src = item.src;
		this.everything[id] = i;
		this.images[item.name] = i;
		i.onload = function(){
			q.resolve();
			item.promise.resolve({image:i, id:id});
		}
		return q;
	}
	engine.prototype.load = function(src, content_type){
		var q = Q.defer();
		this.loadQueue.push({src:src, content_type:content_type, promise:q})
		return q.promise;
	};
	engine.prototype.loadImage = function(src, name){
		var q = Q.defer();
		this.loadQueue.push({src:src, image:true, promise:q, name:name});
		return q.promise;
	};
	engine.prototype.loadLevel = function(levelname) {
		var level = this.everything[levelname] || this.levels[levelname];
		this.currentLevel = level;
	};
	var instance = new engine();
	module.exports = engine;
}())