var Class = require("./utils").Class;
var engine = require("./engine").getInstance();
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
			canvas.canvas.ctx.drawImage(engine.getImage("level_1_map"), this.mapdata[i]*16, 0, 16,16,x*16, y*16, 16,16 );
		}
	}
});

module.exports = Level;