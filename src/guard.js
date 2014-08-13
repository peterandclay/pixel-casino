var Entity = require("./entity.js");

function Guard(){
	Entity.call(this, "guard", 5, 10);
}

util.Class(Guard, Entity, {
	isActive: function(){
		return this.active;
	}
	setActive: function(active){
		this.active = active;
	}

});

module.exports = Guard