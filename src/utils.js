$h = require("../lib/headOn.js");
exports.UUID = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

exports.ray = function(x0, y0, x1, y1, map){
	var dx = Math.abs(x1-x0);
	var dy = Math.abs(y1-y0);
	var xo = x0;
	var yo = y0;
	var sx = (x0 < x1) ? 1 : -1;
	var sy = (y0 < y1) ? 1 : -1;
	var err = ~~dx-dy;
	x1 = ~~x1;
	y1 = ~~y1;
	 var m
	//console.log(x0,x1,y0,y1)
	 //var count = 0;
	while(true){
	   m = map.get(x0, y0);
	   if(m === 1 || m === -1) break;
	   if (Math.abs(x0-x1) <= 2 && Math.abs(y0-y1) <=2) break;
	   var e2 = 2*err;
	   if (e2 >-dy){ err -= dy; x0  += sx; }
	   if (e2 < dx){ err += dx; y0  += sy;}
	   //count++;
	   //console.log(count);
	   //if(count > 50) break;
	}
	return {x:x0, y:y0};
}

exports.Class = function(constructor, parent, members){
	if(!members){
		members = parent;
		parent = false;
	}

	if(parent){
		$h.inherit(parent, constructor);
	}

	$h.extend(constructor.prototype, members);

}

if (!Object.is) {
  Object.is = function(v1, v2) {
    if (v1 === 0 && v2 === 0) {
      return 1 / v1 === 1 / v2;
    }
    if (v1 !== v1) {
      return v2 !== v2;
    }
    return v1 === v2;
  };
}