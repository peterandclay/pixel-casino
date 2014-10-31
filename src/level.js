"use strict";
var Class = require("./utils").Class;
var engine = require("./engine").getInstance();
var $h = require("../lib/headOn.js");
var astar = require("../lib/astar");
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
			that.maps[src].data = JSON.parse(data.data);
			that.maps[src].loaded = true;
			that.maps[src].id = data.id;




			console.log(that.maps[src].data.tilesets[0], "color:rgba(0,0,255,.8)")
			that.maps[src].collisions = new astar.Graph(that.convertTo2D(that.maps[src].data.layers[0].data, that.maps[src].data.tilesets[0], that.maps[src].data.canvas.width));
		}).fail(function(err){
			console.log(err.stack)
		});

	},
	getMapGrid: function(){
		return this.currentMapGrid;
	},
	getMap: function(x , y){
		var pos;
		if(arguments.length === 1){
			pos = this.toTileCoords(x);
		}else{
			pos = $h.Vector(x, y);
		}

		return this.currentMap.collisions.grid[pos.y][pos.x];
	},
	tileToWorld: function(tile){
		return $h.Vector(tile.x * 96, tile.y *  96);
	},
	convertTo2D: function(map, tileSizes, width){
		console.log("converting!!!")
		var finalMap = [];
		var intermediate = [];
		var jumpx = (width/engine.baseTileSize);
		var spread = 96/ engine.baseTileSize;

		for(var i = 0; i< map.length; i++){
			var y = Math.floor(i/jumpx);
			var x = i%jumpx;
			finalMap[y] = finalMap[y] || [];
			finalMap[y][x] = map[i];

		}
		this.map2D = finalMap;
		return finalMap

	},
	getHeight: function(){
		console.log(this.map2D.length*96);
		return this.map2D.length*96;
	},
	getWidth: function(){
		console.log(this.currentMap.data.canvas.width*4);
		return this.currentMap.data.canvas.width*4;
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
	toTileCoords: function(vec){
		return $h.Vector(Math.floor(vec.x/96), Math.floor(vec.y/96))
	},
	collides: function(x, y){
		var tile = this.getMap(x, y);
		return tile.weight === 0;
	},
	render: function(canvas){
		var jumpx = (this.currentMap.data.canvas.width/this.tileSet.tilewidth);
		var vec = headOn.Vector(0,0);
		var coords = headOn.Vector(0,0);
		for(var i = 0; i< this.mapdata.length; i++){
			var y = Math.floor(i/jumpx);
			var x = i%jumpx;
			if(engine.camera.inView(x*96, y*96) || engine.camera.inView(x*96 +96, y*96 +96)){
				vec.x = x*96;
				vec.y = y*96;
				engine.camera.unproject(vec, coords);
				var pix = this.mapdata[i] === 0 ? 16 : 0;
				canvas.canvas.ctx.drawImage(engine.getImage("level_1_map"), pix, 0, 16, 16, ~~coords.x, ~~coords.y, 96,96);
			}

		}
		// for(var y=0; y<this.currentMap.collisions.grid.length; y++){
		// 	for(var x =0; x< this.currentMap.collisions.grid[0].length; x++){
		// 		if(this.currentMap.collisions.grid[y][x].weight === 1){
		// 			canvas.drawRect(16,16, x*16, y*16, "rgba(0,255,0,.5)");
		// 		}
		// 		else{
		// 			canvas.drawRect(16,16, x*16, y*16, "rgba(255,0,0,.5)");
		// 		}
		// 	}
		// }
	}
});

module.exports = Level;
