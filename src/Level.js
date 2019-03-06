const Map = require('./Map');
const Actor = require('./Actor');
const Item = require('./Item');
const Prop = require('./Prop');
const geometer = require('./geometer');

class Level {
	constructor(options = {}, refData = {}) {
		this.seed = options.seed || 1;
		this.name = options.name || '';
		this.levelIndex = options.levelIndex || 0;
		this.background = '#222';
		const mapOptions = { ...options.map, seed: this.seed };
		this.map = new Map(mapOptions);
		this.actors = this.generateActors(options, refData.actors);
		this.items = this.generateItems(options, refData.items);
		this.props = this.generateProps(options, refData.props);
		this.eye = { x: 0, y: 0, viewRange: 7 };
		
	}

	draw(display) {
		display.clear();
		this.drawMap(display);
		this.drawProps(display);
		this.drawItems(display);
		this.drawActors(display);
	}

	drawMap(display) {
		this.map.forEachCell((cell, x, y) => {
			const inView = this.isInView(x, y);
			// TODO: improve this
			const fg = cell.getForegroundColor(inView);
			const bg = cell.getBackgroundColor(inView);
			display.draw(x, y, cell.character, fg, bg);
		});
	}

	drawProps(display) {
		this.props.forEach((prop) => {
			const lighting = this.map.getLightingAt(this.eye.x, this.eye.y);
			const inView = this.isInView(prop.x, prop.y);
			prop.draw(display, lighting, inView);
		});
	}

	drawItems(display) {
		this.items.forEach((item) => {
			const lighting = this.map.getLightingAt(this.eye.x, this.eye.y);
			const inView = this.isInView(item.x, item.y);
			item.draw(display, lighting, inView);
		});
	}

	drawActors(display) {
		this.actors.forEach((actor) => {
			const lighting = this.map.getLightingAt(this.eye.x, this.eye.y);
			const inView = this.isInView(actor.x, actor.y);
			actor.draw(display, lighting, inView);
		});
	}

	isInView(x, y) { // TODO: optimize
		const r = geometer.getDistance(this.eye.x, this.eye.y, x, y); // TODO: allow more complicated POV
		return (r <= this.eye.viewRange);		
	}

	addItem(item) {
		this.items.push(item);
	}

	addActor(actor) {
		this.actors.push(actor);
	}

	removeActor(actor) {
		const i = this.actors.findIndex((a) => { return a === actor; });
		if (i <= -1) {
			console.warn('no actor found');
			return;
		}
		const arr = this.actors.splice(i, 1);
		return arr[0];

	}

	findItem(x, y) {
		const foundItems = this.findItems(x, y);
		return (foundItems.length) ? foundItems[0] : null;
		// let i = this.items.length - 1;
		// while (i >= 0) {
		// 	const item = this.items[i];
		// 	if (!item.containedIn && item.x === x && item.y === y) {
		// 		return item;
		// 	}
		// 	i--;
		// }
		// return null;
	}

	findItems(x, y) {
		return this.items.filter((item) => {
			return item.x === x && item.y === y && !item.containedIn;
		});
	}

	findProps(x, y) {
		return this.props.filter((prop) => {
			return prop.x === x && prop.y === y;
		});
	}

	findRandomFreeCell() {
		return this.map.getRandomFreeCell();
	}

	discoverCircle(x, y, radius) {
		return this.map.discoverCircle(x, y, radius);
	}

	// Generation

	generateItems(options = {}, itemTypes = {}) {
		const items = [];
		return items;
	}

	generateProps(options = {}, propTypes = {}) {
		// const STAIRS_UP_PROP_TYPE_KEY = 'stairsUp';
		// const STAIRS_DOWN_PROP_TYPE_KEY = 'stairsDown';
		let { stairs, stairsUp = 0, stairsDown = 0, props = [] } = options;
		const background = this.background;
		
		// if (stairs === 'both') {
		// 	stairsUp += 1;
		// 	stairsDown += 1;
		// }
		const arr = [];
		// let i;
		// for (i = 0; i < stairsUp; i++) {
		// 	const { x, y } = this.findRandomFreeCell();
		// 	const propOptions = { x, y, ...propTypes[STAIRS_UP_PROP_TYPE_KEY] };
		// 	const prop = new Prop(propOptions);
		// 	arr.push(prop);
		// }
		// for (i = 0; i < stairsDown; i++) {
		// 	const { x, y } = this.findRandomFreeCell();
		// 	const propOptions = { x, y, ...propTypes[STAIRS_DOWN_PROP_TYPE_KEY] };
		// 	const prop = new Prop(propOptions);
		// 	arr.push(prop);
		// }

		props.forEach((propOptions) => {
			const quantity = propOptions.quantity || 1;
			// console.log(propOptions);
			// TODO: handle weight, etc.
			for (let i = 0; i < quantity; i++) {
				const { x, y } = this.findRandomFreeCell();
				const propTypeOptions = (propOptions.type && propTypes[propOptions.type]) ? propTypes[propOptions.type] : {};
				const propOptionsParam = {
					x, y, background,
					...propTypeOptions,
					...propOptions
				};
				const prop = new Prop(propOptionsParam);
				arr.push(prop);
			}
		});

		// console.log('generateProps', arr);
		
		this.props = arr;
		return this.props;
	}

	generateActors(options = {}, actorTypes = {}) {
		const actors = [];
		return actors;
	}

	// Gets

	getMap() {
		return this.map;
	}

	// Sets

	setEye(actorThing) {
		this.eye.x = actorThing.x;
		this.eye.y = actorThing.y;
		this.eye.viewRange = actorThing.viewRange;
	}
}

module.exports = Level;
