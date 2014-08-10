var $h = require("../lib/headOn");
var Class = require("./utils").Class;
var engine = require("./engine").getInstance();
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
			if(!this.once){
				this.once = true;
				setTimeout(function(){
					gameState.changeState(gameplay);
				},2000);
			}
			
		}
	}
};

var gameplay = exports.gameplay = {
	enter: function(){
		console.log("enter this one!")
	},
	exit: function(){
	},
	render: function(gameState, canvas){
		canvas.drawRect(canvas.width, canvas.height, 0,0, "purple")
	},
	update: function(gamestate, delta){
	}
};
