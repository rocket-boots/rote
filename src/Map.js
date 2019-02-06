const ROT = require('rot-js');
const Cell = require('./Cell');

class Map {
	constructor(options = {}) {
		this.type = options.type || 'digger';
		this.rotMap = options.rotMap;
		// this.cells = {}; // TODO: implement this
		this.characterMap = {};
		this.freeCells = [];
		this.generate(options);
	}

	generate(options) {
		options = { type: 'digger', ...options };
		this.characterMap = {};
		// TODO: allow different types
		this.rotMap = new ROT.Map.Digger();
		this.freeCells.length = 0;
		
		this.rotMap.create((x, y, value) => {
			if (value) {
				return;
			}
			const key = this.setCharacterAt('.', x, y);
			this.freeCells.push(key);
		});

		if (options.walls) {
			this.addWalls();
		}
		
		console.log(this);
	}

	addWalls() {
		this.forEachCharacter((char, x, y) => {
			Map.forEachDirection((dir, dirX, dirY) => {
				const newX = x + dirX;
				const newY = y + dirY;
				const char = this.getCharacterAt(newX, newY);
				if (char === undefined || char === '') {
					this.setCharacterAt('#', newX, newY);
				}
			});
		});
	}

	static parseKeyCoordinates(key) {
		const parts = key.split(",");
		const x = parseInt(parts[0]);
		const y = parseInt(parts[1]);
		return { x, y };
	}

	static makeKey(x, y) {
		return x + ',' + y;
	}

	static forEachDirection(callback) {
		const dirCoords = [
			{x: 0, y: -1}, // top
			{x: 1, y: -1},
			{x: 1, y: 0}, // right
			{x: 1, y: 1},
			{x: 0, y: 1}, // bottom
			{x: -1, y: 1},
			{x: -1, y: 0}, // left
			{x: -1, y: -1},
		];
		for (let i = 0; i < 8; i++) {
			callback(i, dirCoords[i].x, dirCoords[i].y);
		}
	}

	forEachCharacter(callback) {
		for (let key in this.characterMap) {
			const { x, y } = Map.parseKeyCoordinates(key);
			callback(this.characterMap[key], x, y, key);
		}
	}

	getRandomFreeCell() {
		const i = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
		// TODO: TBD- Is it still a free cell?
		// var key = freeCells.splice(index, 1)[0];
		// this.map[key] = "*";
		const key = this.freeCells[i];
		const character = this.characterMap[key];
		const { x, y } = Map.parseKeyCoordinates(key);
		return { x, y, character };
	}

	getCharacterAt(x, y) {
		const key = Map.makeKey(x, y);
		return this.characterMap[key];
	}

	setCharacterAt(char, x, y) {
		const key = Map.makeKey(x, y);
		this.characterMap[key] = char;
		return key;
	}

	getCellPassability(x, y) {
		const char = this.getCharacterAt(x, y);
		if (char === '.') {
			return true;
		}
		return false;
	}

	// _generateBoxes(freeCells) {
	// 	for (var i=0;i<10;i++) {
	// 		var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
	// 		var key = freeCells.splice(index, 1)[0];
	// 		this.map[key] = "*";
	// 	}
	// }
}

module.exports = Map;
