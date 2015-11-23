var Q = require('Q')


function Factory() {
		
};

Factory.prototype = {
	constructor: Factory,

	_init: function() {
		this._refreshQElements();
		return this;
	},

	_refreshQElements: function() {
		var qElements = this.qElements;
		for (var x in qElements) {
			this[x] = Q.get(qElements[x]);
		}
	},

	init: function() {
		
	}
}

Factory.extend = function(object) {
	var f = new Factory();

	for (var x in object) {
		f[x] = object[x];
	}

	return f;
}

module.exports = Factory;	