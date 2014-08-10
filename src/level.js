var Class = require("./utils").Class;
var Load = require("./engine").getInstance();
function Level(name){
	this.name = name;
}

Class(Level, {
	maps:{},
	addMap: function(src){
		var that = this;
		this.maps[src] = {
			loaded:false,
			src:src
		};
		engine.load(src, "text/json").then(function(err, data){
			this.maps[src].data = data.data;
			this.maps[src].loaded = true;
			this.maps[src].id = id;
		});

	},
	setMap: function(src){
		var map = this.maps[src];
		if(!map){
			throw "Map does not exist";
		}
		this.currentMap = map;
	}
});

module.exports = Level;