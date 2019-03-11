class Inventory {
	constructor(options = {}) {
		this.size = (typeof options.size === 'number') ? options.size : 10;
		this.items = [];
	}

	isFull() {
		return (this.items.length >= this.size);
	}

	hasSpace() {
		return !this.isFull();
	}

	add(item) {
		if (this.isFull()) {
			return false;
		}
		if (!item.portable) {
			return false;
		}
		this.items.push(item);
		return true;
	}

	remove(item) {
		const i = this.items.indexOf(item);
		if (i <= -1) {
			console.warn('nothing found in', this.items, item);
			return false;
		}
		const arr = this.items.splice(i, 1);
		return arr[0];
	}

	removeType(typeKey) {
		const itemsOfType = this.items.filter((item) => { return item.type === typeKey; });
		if (itemsOfType.length === 0) {
			return false;
		}
		return this.remove(itemsOfType[0]);
	}

	get(n) {
		if (typeof n === 'number') {
			return this.items[n];
		} else if (typeof n === 'string') {
			return this.items.find((item) => { return item.name === n; });
		}
		return this.items;
	}

	getString() {
		const arr = this.items.map((item, i) => { return `[${(i + 1)}] ${item.name}`; });
		return (arr.length) ? arr.join(', ') : 'nothing';
	}

	loopOverContents(fn) {
		this.items.forEach((item, i) => {
			fn(item, i);
		});
	}

	hasContents() {
		return (this.items.length > 0);
	}

	contains(itemName) {
		let foundItem = this.items.find((item) => { return (item.name === itemName); });
		return Boolean(foundItem);
	}

	containsType(typeName) {
		let foundItem = this.items.find((item) => { return (item.type === typeName); });
		return Boolean(foundItem);
	}
}

module.exports = Inventory;
