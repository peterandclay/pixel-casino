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
		this.NPCS = {};
		this.groups = {};
		this.states = {};
		return this;
	}

	engine.getInstance = function(){
		return engine.prototype._singletonInstance;
	}
	engine.prototype.gameState = {
  		init: function(){
  			console.log(engine.getInstance().states)
    		this.state = engine.getInstance().states.loading;
    		this.state.enter();
    		this.engine = engine.getInstance();
  		},
  		changeState: function(state){
    		if(this.state){
      			this.state.exit();
     			this.pState = this.state;
    		}
	    	this.state = state;
	    	this.state.enter();
  		},
	  	update: function(delta){
	    	this.state.update(this, delta);
	  	},
	  	render: function(canvas){
	    	this.state.render(this, canvas);
	  	}
	};
	engine.prototype.addState = function(name, state){
		this.states[name] = state;
	}
	engine.prototype.init = function(width, height){
		var that = this;
		this.gameState.init();
		this.gameWidth = width;
		this.gameHeight = height;
		this.camera = new $h.Camera(width, height);
		this.mainCanvas = $h.canvas.create("main", width, height, this.camera);
		this.mainCanvas.append("body");

		this.loadEverything().then(function(){
			this.loading = false;
			this.loaded = true;
			$h.events.trigger("assestsLoaded");
		});
		$h.update(function(delta){
			that.gameState.update(that.gameState, delta);
		});
		$h.render(function(){
			that.gameState.render(that.mainCanvas);
		})
		$h.run();
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
		var p;
		var total = this.loadQueue.length;
		var done = 0;
		for(var i =0; i<total; i++){
			item = this.loadQueue[i];
			if(item.image){
				p = this.doImage(item);
			}else{
				p = this.doOther(item);
			}
			p.then(function(){
				done++;
				$h.events.trigger("percentLoaded", done/total);
			});
			promises.push(p);
		}
		return Q.all(promises);
	}
	engine.prototype.startGameLoop = function(){
		
	};
	engine.prototype.group = function(name, entity){
		var group = this.groups[name] || [];
		if(entity){
			group.push(entity);
		}
		return group;
	};
	engine.prototype.registerNPC = function(npc){
		var id = utils.UUID();
		this.everything[id] = npc;
		this.NPCS[id] = npc;
		return id;
	};
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
	engine.prototype.getImage = function(name){
		return this.images[name] || this.everything[name] || new Image();
	}
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
		return q.promise;
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
}());