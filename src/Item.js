const Inventory = require('./Inventory');

class Item {
	constructor(options = {}) {
		this.name = options.name || 'nothing';
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.character = options.character || '^';
		this.color = options.color || '#05f';
		this.inventory = new Inventory({
			size: options.inventorySize || 0
		});
		this.containedIn = null;
	}

	draw(display, lighting = {}, inView = false) {
		if (this.containedIn || !inView) { // Not visible if in a container
			return false;
		}
		display.draw(this.x, this.y, this.character, this.color);
		return true;
	}

	addItem(item) { // mutates the item if successful
		if (this.inventory.isFull()) {
			return false;
		}
		const isAdded = this.inventory.add(item);
		if (!isAdded) {
			return false;
		}
		item.containedIn = this;
		return true;
	}

	getContents(n) {
		return this.inventory.get(n);
	}

	hasContents() {
		return this.inventory.hasContents();
	}

	contains(itemName) {
		return this.inventory.contains(itemName);
	}
}

module.exports = Item;
