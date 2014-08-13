var Class = require("./utils").Class;
var engine = require("./engine").getInstance();
var $h = require("../lib/headOn")
function Level(name){
	this.name = name;
	this.maps = {};
}

Class(Level, {
	addMap: function(src){
		var that = this;
		this.maps[src] = {
			loaded:false,
			src:src
		};
		engine.load(src, "text/json").then(function(data){
			console.log("loaded")
			console.log(JSON.parse(data.data));
			that.maps[src].data = JSON.parse(data.data);
			that.maps[src].loaded = true;
			that.maps[src].id = data.id;
			console.log(that.maps[src])
		});

	},
	setMap: function(src){
		var map = this.maps[src];
		if(!map){
			throw "Map does not exist";
		}
		console.log(map)
		this.currentMap = map;
		this.tileSet = map.data.tilesets[0];
		this.mapdata = map.data.layers[0].data;
	},
	render: function(canvas){
		var jumpx = (this.currentMap.data.canvas.width/this.tileSet.tilewidth);
		for(var i = 0; i< this.mapdata.length; i++){
			var y = Math.floor(i/jumpx);
			var x = i%jumpx;
			if(engine.camera.inView(x*96, y*96) || engine.camera.inView(x*96 +96, y*96 +96)){
				var coords = engine.camera.unproject(headOn.Vector(x*96,y*96));
				canvas.canvas.ctx.drawImage(engine.getImage("level_1_map"), this.mapdata[i]*16, 0, 16,16,coords.x, coords.y, 96,96 );
			}
			
		}
	}
});

module.exports = Level;