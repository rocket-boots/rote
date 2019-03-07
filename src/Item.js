const Inventory = require('./Inventory');

class Item {
	constructor(options = {}) {
		this.type = options.type || null;
		this.name = options.name || 'nothing';
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.character = options.character || '^';
		this.color = options.color || '#05f';
		this.background = options.background || null;
		this.inventory = new Inventory({
			size: options.inventorySize || 0
		});
		this.portable = (typeof options.portable === 'boolean') ? options.portable : true;
		this.containedIn = null;
		this.actions = { ...options.on };
		this.states = options.states || {};
		this.teleport = null; // can this item move the character to another level, cell
	}

	action(actionName, who) {
		if (typeof this.actions[actionName] !== 'function') {
			console.warn('No action', actionName, 'for item', this);
			return;
		}
		this.actions[actionName](this, who);
	}

	draw(display, lighting = {}, inView = false) {
		if (this.containedIn || !inView) { // Not visible if in a container
			return false;
		}
		display.draw(this.x, this.y, this.character, this.color, this.background);
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

	hasAction(verb) {
		return Boolean(this.actions[verb]);
	}

	setTeleport(options = {}) {
		const { levelIndex, x, y, verb } = options;
		this.teleport = { levelIndex, x, y };
		this.actions[verb] = 'teleport';
	}
}

module.exports = Item;
