const ROT = require('rot-js');
const domReady = require('./ready');
const Display = require('./Display');
const Level = require('./Level');
const Actor = require('./Actor');
const Item = require('./Item');
const Keyboard = require('./KeyboardListener');
const Console = require('./Console');
const random = require('./random');

const MAIN_GAME_STATE = 'GAME';

class Game {
	constructor({ id, consoleId, data }) {
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
			this.hero.queueAction('move', { direction });
			this.advance();
		});
		this.keyboard.on(MAIN_GAME_STATE, 'ENTER', () => {
			// this.actorDefaultAction(this.hero); // TODO: Remove me
			this.actorAddDefaultAction(this.hero);
			this.advance();
		});
		this.keyboard.on(MAIN_GAME_STATE, 'SPACE', () => {
			this.hero.queueAction('wait');
			this.advance();
		});
		this.keyboard.on(MAIN_GAME_STATE, 't', () => {
			this.showInventory();
			this.print('> Throw which item?');
			let n = prompt('Throw which item? \n\n' + this.hero.inventory.getString());
			if (!n || n.length === 0) {
				this.print('None');
				return;
			}
			n = parseInt(n, 10);
			const i = (isNaN(n)) ? -1 : n - 1;
			const item = this.hero.inventory.get(i);
			if (item) {
				this.hero.queueAction('throw', { what: item, x: this.hero.x, y: this.hero.y });
				this.advance();
			} else {
				this.print(`Invalid item [${n}]`);
			}
		});
		this.keyboard.on(MAIN_GAME_STATE, 'i', () => { this.showInventory(); });
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

	//---- Draw / Render

	print(str, classes = '', wait = 0) {
		if (wait) {
			setTimeout(() => { this.print(str, classes); }, wait);
			return;
		}
		this.console.print(str, classes);
	}

	showInventory() {
		const items = this.hero.inventory.getString();
		this.print('Inventory: ' + items);		
	}

	draw() {
		this.getActiveLevel().draw(this.display);
		if (this.hero) {
			this.hero.draw(this.display);
		}
		this.drawInterface();
	}

	drawDisplayBorder(isDamaged) {
		const displayElt = document.getElementById('display');
		if (isDamaged) {
			displayElt.classList.add('damaged');
		} else {
			displayElt.classList.remove('damaged');
		}
	}

	drawInterface() {
		const intElt = document.getElementById('interface');
		intElt.innerHTML = `HP: ${this.hero.hp} / ${this.hero.hpMax}`;
	}

	//---- Generation

	createLevel(options = {}, seed) {
		options.seed = seed || options.seed;
		const levelOptions = { ...options, levelIndex: this.levels.length };
		const level = new Level(levelOptions, this.data);
		this.levels.push(level);
		return level;
	}

	createLevels(arr = [], baseSeed = 1) {
		let seed = baseSeed;
		arr.forEach((item, i) => {
			seed += i;
			if (typeof item === 'string') { // level type key
				this.createLevel(this.getLevelType(item), seed);
			} else if (typeof item === 'object' && item !== null) {
				const n = (typeof item.repeat === 'number') ? item.repeat : 1;
				for (let r = 0; r < n; r++) {
					seed += r;
					this.createLevel(this.getLevelType(item.levelTypeKey), seed);
				}
			}
		});
		this.connectStairs();
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
		const heroOptions = { ...options, character: '@', isHero: true };
		this.hero = this.createActor(heroOptions, true);

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

	connectStairs() {
		const STAIR_LINK = 'stairLink';
		const propTypes = this.getDataPropArray();
		console.log(propTypes);
		const stairsDownTypes = propTypes.filter((propType) => { return Boolean(propType[STAIR_LINK]); });
		this.levels.forEach((level, i) => {
			// Handle each type of stairs
			stairsDownTypes.forEach((stairsDownType) => {
				const stairDownTypeKey = stairsDownType.key;
				const stairUpTypeKey = stairsDownType[STAIR_LINK];
				const levelStairsDown = level.props.filter((prop) => {
					return prop.type === stairDownTypeKey;
				});
				levelStairsDown.forEach((stair) => {
					const levelBelow = this.levels[i + 1];
					if (!levelBelow) { return; }
					const possibleStairsUp = levelBelow.props.filter((prop) => {
						return prop.type === stairUpTypeKey && !Boolean(prop.teleport);
					});
					// TODO: Find stairs to connect to based on proximity
					const levelBelowStairsUp = possibleStairsUp[0]; // TODO: remove this
					this.connectTeleportProps(levelBelowStairsUp, stair, i, i + 1, 'ascend', 'descend');
				});
			});
		});
	}

	connectTeleportProps(prop1, prop2, levelIndex1, levelIndex2, verb1, verb2) {
		if (!prop1 || !prop2) { return; }
		prop1.setTeleport({
			levelIndex: levelIndex1, x: prop2.x, y: prop2.y, verb: verb1
		});
		prop2.setTeleport({
			levelIndex: levelIndex2, x: prop1.x, y: prop1.y, verb: verb2
		});
	}

	//---- Movement, Combat

	moveActor(actor, direction, bumpCombat = false) {
		const diff = ROT.DIRS[8][direction];
		var newX = actor.x + diff[0];
		var newY = actor.y + diff[1];
		return this.moveActorTo(actor, newX, newY, bumpCombat);
	}

	moveActorTo(actor, x, y, bumpCombat = false) {
		const level = this.getActiveLevel();
		const canMoveToCell = level.getCellPassability(x, y);
		// console.log('considering moving to', x, y, '... free?', canMoveToCell);
		if (!canMoveToCell) {
			const blocker = level.findActor(x, y);
			if (blocker) {
				return this.bump(actor, blocker, x, y, bumpCombat);
			}
			return { x: x, y: y, moved: false };
		}
		actor.moveTo(x, y);
		// TODO: just redraw the space that was under the actor and the actor in the new spot?
		if (actor.isHero) {
			this.discoverAroundHero();
			this.narrateAroundHero();
		}
		this.draw();
		return { x, y, moved: true };
	}

	bump(actor, blocker, x, y, bumpCombat) {
		if (bumpCombat && actor.faction !== blocker.faction) {
			this.resolveCombat(actor, blocker, x, y);
			return { x, y, moved: false };
		} else if (Game.canBumpSwitch(actor, blocker)) {
			actor.moveTo(x, y);
			return { x, y, moved: true };
			// TODO: allow pushes based on authority
		} else { // just blocked
			return { x, y, moved: false };
		}		
	}

	static canBumpSwitch(actor, blocker) {
		if (actor.aggro || blocker.aggro) { // TOOD: make this more nuanced
			return false;
		}
		const blockersNextAction = blocker.getNextAction();
		if (!blockersNextAction) { return true; }
		return (
			blockersNextAction.verb === 'move' &&
			blockersNextAction.x === actor.x &&
			blockersNextAction.y === actor.y
		);
	}

	teleportActor(actor, teleportParams = {}) {
		console.warn('teleporting', actor, teleportParams);
		const { levelIndex, x, y } = teleportParams;
		const currentLevel = this.getActiveLevel();
		currentLevel.removeActor(actor);
		this.setActiveLevel(levelIndex);
		const newLevel = this.getActiveLevel();
		newLevel.addActor(actor);
		actor.setCoordinates(x, y);
		console.log('New Level:', newLevel);
		if (actor.isHero) {
			this.discoverAroundHero();
			this.narrateAroundHero();
		}
		// this.draw();
	}

	resolveCombat(actor, opponent, x, y) {
		if (!actor || !opponent || actor.faction === opponent.faction) {
			return false;
		}
		const damage = 1;
		opponent.wound(damage);
		g.print(`${actor.name} attacks ${opponent.name} and does ${damage} damage!`);
		if (opponent.dead()) {
			g.print(`${opponent.name} has been killed.`);
		}
	}

	actorAddDefaultAction(actor) {
		const level = this.getActiveLevel();
		const thing = level.findThingSmart(actor.x, actor.y, 'portable');
		// TODO: Maybe get multiple things and check if they have actions?
		console.log(thing, actor.x, actor.y);
		if (!thing) {
			return;
		}
		if (thing.portable) {
			actor.queueAction('pickup', { target: thing });
		} else if (thing.hasAction('use')) {
			actor.queueAction('use', { target: thing });
		} else if (thing.hasAction('descend') || thing.hasAction('ascend')) {
			actor.queueAction('teleport', { teleport: thing.teleport });
			console.log('Planning to teleport...', actor.actionQueue);
		}
	}

	advance() {
		const startHp = this.hero.hp;
		// TODO: advance time
		// Do actions for all actors
		const level = this.getActiveLevel();
		// "Initiative" is random
		const actors = random.shuffle(level.actors);
		actors.forEach((actor) => {
			actor.planAction(level, this.hero);
			this.advanceActor(actor);
		});
		// this.advanceActor(this.hero);
		const isDamaged = (startHp > this.hero.hp);
		this.drawDisplayBorder(isDamaged);
		this.draw();
	}

	advanceActor(actor) {
		const level = this.getActiveLevel();
		const action = actor.doAction();
		if (!action) { return; }
		const { verb, target, what, x, y } = action;
		if (actor.isHero) {
			if (verb === 'move') { console.log(actor.name + ' ' + verb); }
			else { console.log(actor.name, verb, action); }
		}
		let message = '';
		switch (verb) {
			case 'move':
				const bumpCombat = (actor.isHero || actor.aggro > 0);
				if (action.direction === undefined) {
					this.moveActorTo(actor, action.x, action.y, bumpCombat);
				} else {
					this.moveActor(actor, action.direction, bumpCombat);
				}
			break;
			case 'use':
				const outcome = target.action('use', actor);
				message = outcome.message;
			break;
			case 'open':
				message = target.action('open', actor);
			break;
			case 'teleport':
				message = `${actor.name} travels to a new location...`;
				this.teleportActor(actor, action.teleport);
			break;
			case 'pickup':
				const pickedUp = this.pickupItem(actor, target);
				if (pickedUp) {
					message = `${actor.name} picks up the ${target.name}.`;
				}
			break;
			case 'throw':
				message = level.throw(actor, what, x, y);
			break;
			case 'wait':
			message = 'You wait.';
			break;
		}
		this.print(message);
	}

	pickupItem(actor, thing) {
		if (!thing.portable) { return false; }
		const level = this.getActiveLevel();
		const item = level.removeItem(thing);
		if (!item) { return false; }
		const added = actor.inventory.add(thing);
		if (!added) {
			level.addItem(item);
		}
		return added;
	}

	//---- Exploration

	discoverAroundHero() {
		const level = this.getActiveLevel();
		const illumination = this.hero.inventory.items.reduce((n, item) => {
			return n + item.illumination;
		}, 0);
		level.discoverCircle(this.hero.x, this.hero.y, this.hero.sightRange + illumination); // TODO: allow different POV
		level.setEye(this.hero);
	}

	narrateAroundHero() {
		const allThingsOnHero = this.getThingsOnActor(this.hero);
		if (allThingsOnHero.length === 0) { return; }
		const namesOnHero = allThingsOnHero.map((thing) => thing.name);
		const namesString = (namesOnHero.length > 1) ? namesOnHero.join(', ') : 'a ' + namesOnHero[0];
		this.console.print(`You are on ${namesString}.`);
	}

	//---- System

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
		function parseJson(response) { return response.json(); }
		function fixInnerObject(obj, key) {
			return (typeof obj[key] === 'object') ? obj[key] : obj;
		}
		for (let key in data) {
			const p = fetch(data[key])
				.then(parseJson)
				.then((obj) => fixInnerObject(obj, key))
				.then((obj) => { this.setData(key, obj); });
			promises.push(p);
		}
		this.loadingPromise = Promise.all(promises); // .then((resp) => { console.log(resp); });
		return this.loadingPromise;
	}

	//---- Gets

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

	getDataPropArray() {
		const propKeys = Object.keys(this.data.props);
		const arr = [];
		propKeys.forEach((key) => {
			const prop = { ...this.data.props[key], key };
			arr.push(prop);
		});
		return arr;
	}

	getThingsOnActor(actor) {
		const { x, y } = actor;
		return this.getActiveLevel().findThings(x, y);
	}

	//---- Sets

	setActiveLevel(i) {
		this.activeLevelIndex = i;
		return;
	}

	setData(key, obj) {
		this.data[key] = Object.freeze(obj);
	}

	setState(state) {
		this.state = state;
		this.keyboard.setState(state);
	}
}

module.exports = Game;
