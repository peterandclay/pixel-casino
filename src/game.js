var $h = require("../lib/headOn.js");
var engine = require("./engine.js")();


engine.init(window.innerWidth, window.innerHeight);

engine.mainCanvas.drawRect(window.innerWidth, window.innerHeight, 0,0, "black")
