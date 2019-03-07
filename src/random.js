const ROT = require('rot-js');
// See: http://ondras.github.io/rot.js/manual/#rng

function setSeed(seed) {
	if (typeof seed === 'number') {
		ROT.RNG.setSeed(seed);
	}
}

function roll(n, seed) {
	setSeed(seed);
	return Math.floor(ROT.RNG.getUniform() * n);
}

function getWeightedValue(obj, seed) {
	setSeed(seed);
	return ROT.RNG.getWeightedValue(obj);
}

module.exports = {
	setSeed,
	roll,
	getWeightedValue
};
