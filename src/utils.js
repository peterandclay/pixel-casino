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

exports.line = function(x0, y0, x1, y1, map){
	var dx = Math.abs(x1-x0);
	var dy = Math.abs(y1-y0);
	var xo = x0;
	var yo = y0;
	var sx = (x0 < x1) ? 2 : -2;
	var sy = (y0 < y1) ? 2 : -2;
	var err = ~~dx-dy;
	x1 = ~~x1;
	y1 = ~~y1;
	 var m
	while(true){
	   m = getMap(map, x0,y0);
	   if(m === 1) break;
	   if (Math.abs(x0-x1) <= 4 && Math.abs(y0-y1) <=4) break;
	   var e2 = 2*err;
	   if (e2 >-dy){ err -= dy; x0  += sx; }
	   if (e2 < dx){ err += dx; y0  += sy; }
	}
	return {x:x0, y:y0};
}