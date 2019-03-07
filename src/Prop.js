const Item = require('./Item');

class Prop extends Item {
	constructor(options = {}) {
		options = { portable: false, ...options };
		super(options);
	}
}

module.exports = Prop;
