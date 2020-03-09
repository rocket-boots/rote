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
	if (typeof n === 'number') {
		return Math.floor(ROT.RNG.getUniform() * n);
	}
	if (typeof n === 'string') {
		return rollDice(n, seed);
	}
}

function rollDice(str, seed) { // str like "1d4", "2d6", "3d8", "1d100"
	// TODO: handle "+", "-", other?
	const d = str.split('d');
	if (d.length !== 2) {
		const n = Number(str);
		// console.warn('Unexpected value:', str, '. Not valid dice notation. Using:', n);
		return roll(n, seed);
	}
	const numberOfDice = d[0];
	const numberOfSides = d[1];
	let sum = 0;
	for(let i = 0; i < numberOfDice; i++) {
		sum += roll(numberOfSides, seed);
	}
	return sum;
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
