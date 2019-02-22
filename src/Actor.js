const ROT = require('rot-js');
const Inventory = require('./Inventory');

class Actor {
	constructor(options = {}) {
		this.name = options.name || null;
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.character = options.character || '@';
		this.color = options.color || '#ff0';
		// this.game = options.game || console.error('must tie actor to game');
		this.inventory = new Inventory({
			size: options.inventorySize || 10
		});
		this.path = [];
		this.viewRange = 7;
	}

	setPath(path) {
		this.path = path;
	}

	draw(display, lighting = {}, inView = false) {
		if (!inView) {
			return false;
		}
		// TODO: adjust colors based on lighting and inView
		display.draw(this.x, this.y, this.character, this.color);
		return true;
	}

	act() {

	}

	move(x, y) {
		this.x += parseInt(x, 10);
		this.y += parseInt(y, 10);
		// console.log('moved', x, y, 'to', this.x, this.y);
	}

	moveAlongPath() {
		this.path.shift();
		if (this.path.length <= 1) {
			alert("Reached target");
			return;
		}
		const { x, y } = this.path[0];
		this.x = x;
		this.y = y;
	}

	setPathTo(map, x = 0, y = 0) {
		const passableCallback = function(x, y) {
			return map.getCellPassability(x, y);
		};
		const astar = new ROT.Path.AStar(x, y, passableCallback, { topology: 4 });
		const path = [];
		const pathCallback = function(x, y) {
			path.push({ x, y });
		};
		astar.compute(this.x, this.y, pathCallback);
		this.setPath(path);
		return true;
	}
}

module.exports = Actor;
