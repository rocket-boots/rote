const ROT = require('rot-js');
// See: http://ondras.github.io/rot.js/manual/#rng

function setSeed(seed) {
	if (typeof seed !== 'number') {
		seed = makeSeed();
	}
	ROT.RNG.setSeed(seed);
}

function makeSeed() {
	return Math.round(Math.random() * 10000);
}

function roll(n, seed) {
	if (typeof seed === 'number') {
		setSeed(seed);
	}
	return Math.floor(ROT.RNG.getUniform() * n);
}

function getWeightedValue(obj, seed) {
	if (typeof seed === 'number') {
		setSeed(seed);
	}
	return ROT.RNG.getWeightedValue(obj);
}

function shuffle(arr) {
	return ROT.RNG.shuffle(arr);
}

function pickOne(arr) {
	return ROT.RNG.getItem(arr);
}

module.exports = {
	setSeed,
	makeSeed,
	roll,
	getWeightedValue,
	shuffle,
	pickOne
};
