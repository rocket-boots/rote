const Map = require('./Map');

class Level {
	constructor(options = {}) {
		this.name = options.name || '';
		this.map = new Map(options.map);
		this.actors = [];
		this.items = [];
	}

	getMap() {
		return this.map;
	}

	draw(display) {
		display.clear();
		this.drawMap(display);
		this.drawItems(display);
		this.drawActors(display);
	}

	drawMap(display) {
		this.map.forEachCell((cell, x, y) => {
			display.draw(x, y, cell.character, cell.getForegroundColor(), cell.getBackgroundColor());
		});
	}

	drawItems(display) {
		this.items.forEach((item) => {
			item.draw(display);
		});
	}

	drawActors(display) {
		this.actors.forEach((actor) => {
			actor.draw(display);
		});
	}

	addItem(item) {
		this.items.push(item);
	}

	addActor(actor) {
		this.actors.push(actor);
	}

	findItem(x, y) {
		let i = this.items.length - 1;
		while (i >= 0) {
			const item = this.items[i];
			// console.log(item);
			if (!item.containedIn && item.x === x && item.y === y) {
				return item;
			}
			i--;
		}
		return null;
	}

	findRandomFreeCell() {
		return this.map.getRandomFreeCell();
	}

	discoverCircle(x, y, radius) {
		return this.map.discoverCircle(x, y, radius);
	}
}

module.exports = Level;
