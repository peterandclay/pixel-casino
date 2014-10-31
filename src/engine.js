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
		this.entities = [];
		this.groups = {};
		this.states = {};
		this.keyMap = {};
		this.controls = {};
		this.keys = {};
		this.baseTileSize = 16;
		return this;
	}
	engine.getInstance = function(){
		return engine.prototype._singletonInstance;
	}
	engine.prototype.gameState = {
  		init: function(){
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
		var q = Q.defer();
		this.cameraMoved = false;
		this.gameState.init();
		this.gameWidth = width;
		this.gameHeight = height;
		this.camera = new $h.Camera(width, height);
		this.mainCanvas = $h.canvas.create("main", width, height, this.camera);
		this.mainCanvas.append("body");
		this.buffer = $h.canvas.create("buffer", width, height, this.camera);
		this.mapBuffer = $h.canvas.create("mapBuffer", width, height, this.camera);

		 //ctxNS.imageSmoothingEnabled = false;
		this.cameraMove = true;
		this.load("keymap_default.json").then(function(data){
			that.keyMap = JSON.parse(data.data);
		});
		this.loadEverything().then(function(){
			this.loading = false;
			this.loaded = true;
		//	setTimeout(function(){
			q.resolve();
			$h.events.trigger("assestsLoaded");
		//	},500)


		});

		$h.update(function(delta){
			that.gameState.update(delta);
		});
		$h.render(function(){
			that.gameState.render(that.buffer);
			that.mainCanvas.canvas.ctx.drawImage(that.mapBuffer.canvas.canvas,0,0);
			that.mainCanvas.canvas.ctx.drawImage(that.buffer.canvas.canvas,0,0);
		});
		this.setupIO(window);
		$h.run();
		$h.events.listen("cameraMoved", function(){
			that.cameraMoved = true;
		});
		return q.promise;
	};
	engine.prototype.clearBuffers = function(){
		console.log("hi")
		//this.mainCanvas.canvas.canvas.width = this.mainCanvas.width;;
		///this.buffer.canvas.canvas.width = this.buffer.width;;
		//this.mapBuffer.canvas.canvas.width = this.mapBuffer.width;
	};
	engine.prototype.getPlayer = function(){
		return this.player;
	}
	engine.prototype.setPlayer = function(player){
		this.player = player;
	}
	engine.prototype.registerLevel = function(level) {
		// body...
		var id = utils.UUID();
		level.ID = id;
		this.levels[level.name] = level;
		this.everything[id] = this.levels[level.name];
		console.log(this.levels);
	};
	engine.prototype.getLevel = function(name){
		return this.levels[name] || this.everything[id];
	};
	engine.prototype.getCurrentLevel = function(){
		return this.currentLevel;
	}
	engine.prototype.renderLevel = function(){
		if(this.cameraMoved){
			this.mapBuffer.canvas.ctx.fillStyle="black";
			this.mapBuffer.canvas.ctx.fillRect(0,0,this.mainCanvas.width,this.mainCanvas.height);
			this.currentLevel.render(this.mapBuffer);
			this.cameraMoved = false;
		}

	}
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
	engine.prototype.registerEntity = function(npc){
		var id = utils.UUID();
		this.everything[id] = npc;
		this.entities.push(npc);
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
		var level = this.levels[levelname] || this.everything[levelname];
		console.log( this.levels[levelname])
		this.currentLevel = level;
	};

	engine.prototype.setupIO = function(element){
		var that = this
		element.addEventListener("keydown", function(e){
			that.controls[that.keyMap[e.which]] = true;
			that.keys[e.which] = true;
		});
		element.addEventListener("keyup", function(e){
			that.controls[that.keyMap[e.which]] = false;
			that.keys[e.which] = false;
		});
		element.addEventListener("mousemove", function(e){
			that.mouse = that.mouse || new $h.Vector(0,0);
			that.mouse.x = e.x;
			that.mouse.y = e.y;
		});
	}
	var instance = new engine();
	module.exports = engine;
}());
