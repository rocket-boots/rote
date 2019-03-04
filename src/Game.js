const ROT = require('rot-js');
const domReady = require('./ready');
const Display = require('./Display');
const Level = require('./Level');
const Actor = require('./Actor');
const Item = require('./Item');
const Keyboard = require('./KeyboardListener');
const Console = require('./Console');

const MAIN_GAME_STATE = 'GAME';

class Game {
	constructor({ rote, id, consoleId, data }) {
		this.rote = rote;
		this.id = id;
		this.displayContainer = document.getElementById(id || 'display');
		this.console = new Console({ id: consoleId });
		this.display = null;
		this.activeLevelIndex = 0;
		// The generated levels
		this.levels = [];
		// Reference data on prototypical "things" (monsters, items)
		this.data = { monsters: {}, items: {}, props: {} };
		// The main actor
		this.hero = null; // player character / player actor
		// Guts
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = null;
		this.keyboard = null;
		this.state = 'INIT';
		// this.setupEngine();
		this.loadingPromise = null;
		this.console.setup();
		this.loadData(data);
	}

	setupEngine() {
		this.engine = new ROT.Engine(this.scheduler);
		this.engine.start();
		return this.engine;
	}

	setupKeyboard() {
		this.keyboard = new Keyboard({ state: MAIN_GAME_STATE, autoStart: true });
		this.keyboard.on(MAIN_GAME_STATE, 'DIRECTION', (keyName, keyCode, direction) => {
			// TODO: Lock and unlock the game? or do something else to determine if it's OK to move
			this.moveHero(direction);
		});
		this.keyboard.on(MAIN_GAME_STATE, 'ENTER', () => {
			this.actorOpenItem(this.hero);
		});
		// this.keyboard.start();
		console.log(this.keyboard);
	}

	removeKeyboard() {
		// TODO: this.keyboard.off() on all listeners
	}

	createDisplay(options = {}) {
		this.display = new Display(options);
		this.display.setupElements();
	}

	print(str) {
		this.console.print(str);
	}

	draw() {
		this.getActiveLevel().draw(this.display);
		if (this.hero) {
			this.hero.draw(this.display);
		}
	}

	getActiveLevel() {
		return this.levels[this.activeLevelIndex];
	}

	getLevelType(key) {
		const lt = this.data.levels[key];
		if (typeof lt !== 'object' || lt === null) {
			console.error('Cannot find level type ', key);
		}
		return lt;
	}

	createLevel(options = {}) {
		const level = new Level(options);
		this.levels.push(level);
		return level;
	}

	createLevels(arr = []) {
		arr.forEach((item) => {
			if (typeof item === 'string') { // level type key
				this.createLevel(this.getLevelType(item));
			} else if (typeof item === 'object' && item !== null) {
				const n = (typeof item.repeat === 'number') ? item.repeat : 1;
				for (let i = 0; i < n; i++) {
					this.createLevel(this.getLevelType(item.levelTypeKey));
				}
			}
		});
		return this.levels;
	}

	createActor(options = {}, level) {
		const actor = new Actor(options);
		this.scheduler.add(actor, true);
		level = (level === true) ? this.getActiveLevel() : level;
		if (level) {
			level.addActor(actor);
		}
		return actor;
	}

	createItem(options = {}, level) {
		const item = new Item(options);
		level = (level === true) ? this.getActiveLevel() : level;
		if (level) {
			level.addItem(item);
		}
		return item;
	}

	createHero(options = {}) {
		this.hero = this.createActor(options, true);

		const g = this;
		// Setup action stuff ... this needs to be refactored
		this.hero.act = function () {
			g.engine.lock();
			window.addEventListener('keydown', this); // pass the hero; the `handleEvent` will be used
		};
		this.hero.handleEvent = function (e) { // Leftover from tutorial, part 2
			window.removeEventListener('keydown', this);
			g.engine.unlock();
		};
		if (this.display) {
			this.display.setCameraTarget(this.hero);
		}
		this.discoverAroundHero();
		return this.hero;
	}

	moveHero(direction) {
		const {x, y, moved} = this.moveActor(this.hero, direction);
		if (!moved) {
			return;
		}
		this.discoverAroundHero();
		this.draw(); // TODO: make more efficient than drawing twice
	}

	moveActor(actor, direction) {
		const diff = ROT.DIRS[8][direction];
		var newX = actor.x + diff[0];
		var newY = actor.y + diff[1];
	 
		const canMoveToCell = this.getActiveLevel().map.getCellPassability(newX, newY);
		// console.log('considering moving', diff[0], diff[1], 'to', newX, newY, '... free?', canMoveToCell);
		if (!canMoveToCell) {
			return { x: newX, y: newY, moved: false };
		}

		// Do the move
		actor.move(diff[0], diff[1]);
		// TODO: just redraw the space that was under the hero and the hero in his new spot?
		this.draw();
		return { x: newX, y: newY, moved: true };
	}

	actorOpenItem(actor) {
		const itemOnCell = this.getActiveLevel().findItem(actor.x, actor.y);
		console.log(itemOnCell, actor.x, actor.y);
		if (!itemOnCell) {
			return;
		}
		itemOnCell.action('open', actor);
	}

	discoverAroundHero() {
		const level = this.getActiveLevel();
		level.discoverCircle(this.hero.x, this.hero.y, this.hero.viewRange); // TODO: allow different POV
		level.setEye(this.hero);
	}

	ready(callback) {
		domReady(() => {
			if (this.loadingPromise instanceof Promise) {
				this.loadingPromise
					.then(() => { callback(); })
					.catch((err) => { console.error('Error loading something', err) });
			} else {
				callback();
			}
		});
		// TODO: return a promise so can be used async
	}

	start() {
		this.setupEngine();
		this.setupKeyboard();
		this.setState(MAIN_GAME_STATE);
		// TODO: start graphics loop
		this.draw();
	}

	stop() {
		this.setState('OFF');
		this.removeKeyboard();
		// TODO: stop graphics loop
	}

	loadData(data) {
		const promises = [];
		function parseJson (response) { return response.json(); }
		function fixInnerObject(obj, key) {
			return (typeof obj[key] === 'object') ? obj[key] : obj;
		}
		for (let key in data) {
			const p = fetch(data[key])
				.then(parseJson)
				.then((obj) => fixInnerObject(obj, key))
				.then((obj) => { this.data[key] = obj; });
			promises.push(p);
		}
		this.loadingPromise = Promise.all(promises).then((resp) => { console.log(resp); });
		return this.loadingPromise;
	}

	setState(state) {
		this.state = state;
		this.keyboard.setState(state);
	}
}

module.exports = Game;
