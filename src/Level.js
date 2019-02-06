const Map = require('./Map');

class Level {
	constructor(options = {}) {
		this.name = options.name || '';
		this.map = new Map(options.map);
		this.actors = [];
		this.items = [];
	}

	draw(display) {
		this.drawMap(display);
		this.drawItems(display);
		this.drawActors(display);
	}

	drawMap(display) {
		this.map.forEachCharacter((char, x, y) => {
			display.draw(x, y, char, '#777', '#222');
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
}

module.exports = Level;
