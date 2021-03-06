const ROT = require('rot-js');
const Cell = require('./Cell');
const geometer = require('./geometer');
const random = require('./random');

const DIGGER_TYPE = 'digger';

class Map {
	constructor(options = {}) {
		this.baseSeed = options.seed || 1;
		this.seed = this.baseSeed;
		this.color = options.color || '#777';
		this.background = options.background || '#222';
		this.type = options.type || DIGGER_TYPE;
		this.rotMap = options.rotMap;
		this.cells = {};
		this.freeCells = [];
		this.walls = Boolean(options.walls) || Boolean(options.wallsCharacter);
		this.wallsCharacter = options.wallsCharacter || '#'; // ▧
		this.floorCharacter = options.floorCharacter || '.';
		this.generate(options);
	}

	generate(options = {}) {
		const generators = options.generators || {};

		if (typeof generators[this.type] === 'function') {
			this.clearCells();
			generators[this.type](this.seed, this, options);
			return;
		}

		if (this.type === DIGGER_TYPE) {
			this.generateDigger();
			return;
		}
		if (this.type === ARENA_TYPE) {
			this.generateArena(options.x, options.y);
			return;
		}
		// TODO: handle other rot-js types

		console.warn('Undefined map type:', this.type, generators);
		this.generateArena(3, 3);
		// TODO: Have default be a big empty room instead?
	}

	generateArena(x, y) {
		ROT.RNG.setSeed(this.seed);
		this.rotMap = new ROT.Map.Arena(x, y);
		this.setupRotMap();	
	}

	generateDigger() {
		ROT.RNG.setSeed(this.seed);
		this.rotMap = new ROT.Map.Digger();
		this.setupRotMap();		
	}

	setupRotMap() {
		this.clearCells();
		this.rotMap.create((x, y, value) => {
			if (value) {
				return;
			}
			this.setFloorAt(x, y);
		});

		if (this.walls) {
			this.addWalls();
		}		
	}

	addWalls() {
		this.forEachCell((cell, x, y) => {
			Map.forEachDirection((dir, dirX, dirY) => {
				const newX = x + dirX;
				const newY = y + dirY;
				const wallCell = this.getCellAt(newX, newY);
				if (!wallCell) {
					this.setWallAt(newX, newY);
				}
			});
		});
	}

	discoverCircle(x, y, radius) {
		this.forEachCellInCircle(x, y, radius, (cell) => {
			cell.discover();
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

	clearCells() {
		this.cells = {};
		this.freeCells.length = 0;		
	}

	forEachCell(callback) {
		for (let key in this.cells) {
			const { x, y } = Map.parseKeyCoordinates(key);
			callback(this.cells[key], x, y, key);
		}
	}

	forEachCellInCircle(centerX, centerY, radius, callback, includeEmptyCells = false) {
		const maxX = centerX + radius;
		const maxY = centerY + radius;
		let x;
		for (x = centerX - radius; x <= maxX; x++) {
			let y;
			for (y = centerY - radius; y <= maxY; y++) {
				const r = Math.round(geometer.getDistance(centerX, centerY, x, y));
				if (r < radius) {
					const cell = this.getCellAt(x, y);
					if (cell || includeEmptyCells) {
						callback(cell, x, y)
					}
				}
			}
		}
	}

	getRandomFreeCell(seed) {		
		const i = random.roll(this.freeCells.length, seed);
		
		// TODO: TBD- Is it still a free cell?
		// var key = freeCells.splice(index, 1)[0];
		// this.map[key] = "*";
		const key = this.freeCells[i];
		const cell = this.cells[key];
		
		const { x, y } = Map.parseKeyCoordinates(key);
		// console.log(seed, key, i, x, y);
		return { x, y, cell };
	}

	getCellAt(x, y) {
		const key = Map.makeKey(x, y);
		return this.cells[key];		
	}

	getCharacterAt(x, y) {
		const cell = this.getCellAt(x, y);
		return (cell) ? cell.getCharacter() : null;
	}

	setFloorAt(x, y) {
		const key = this.setCharacterAt(this.floorCharacter, x, y);
		this.freeCells.push(key);
		return key;
	}

	setWallAt(x, y) {
		return this.setCharacterAt(this.wallsCharacter, x, y);
	}

	setCharacterAt(char, x, y) {
		const key = Map.makeKey(x, y);
		const cell = this.cells[key];
		if (cell) {
			cell.setCharacter(char);
		} else {
			const { color, background } = this;
			this.cells[key] = new Cell({ color, background, character: char });
		}
		return key;
	}

	getCellPassability(x, y) {
		const cell = this.getCellAt(x, y);
		return (cell) ? cell.getPassability() : false;
	}

	getLightingAt(x, y) {
		return {}; // TODO
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
