var $h = require("../lib/headOn");
var Class = require("./utils").Class;
var engine = require("./engine").getInstance();
var Entity = require("./entity");
var loading = exports.loading = {
	enter: function(){
		var that = this;
		this.percent = 0;
		$h.events.listen("assestsLoaded", function(){
			that.loaded = true;
		});
		$h.events.listen("percentLoaded", function(p){
			that.percentChange = true;
			that.percent = p;
		});
		this.percentChange = true;
	},
	exit: function(){
	},
	render: function(gameState, canvas){
		if(this.percentChange){
			canvas.drawRect(canvas.width, canvas.height, 0,0, "black");
			canvas.drawText("loading: "+this.percent*100 + "%", canvas.width/2, canvas.height/2, "50px", "white", "center");
			this.percentChange = false;
		}
		
	},
	update: function(gameState, delta){
		if(this.loaded){
			gameState.changeState(gameplay);
		}
	}
};

var gameplay = exports.gameplay = {
	enter: function(){
		this.d = new Entity("guard", 500, 500);
		engine.clearBuffers();
	},
	exit: function(){
	},
	render: function(gameState, canvas){
		engine.renderLevel();
		//canvas.drawRect(canvas.width, canvas.height, 0,0, "purple")
		canvas.canvas.ctx.clearRect(0,0, canvas.width, canvas.height);
		var len = engine.entities.length;
		var en;
		for(var i=0; i<len; i++){
			en = engine.entities[i];
			if(en.isActive()){
				en.render(canvas);
			}
		}
		
	},
	update: function(gamestate, delta){
		var len = engine.entities.length;
		var en;
		for(var i=0; i<len; i++){
			en = engine.entities[i];
			if(en.isActive()){
				en.update(delta);
			}
		}
	}
};
