const ROT = require('rot-js');
const ready = require('./ready');
const Display = require('./Display');
const Level = require('./Level');
const Actor = require('./Actor');
const Item = require('./Item');
const Keyboard = require('./KeyboardListener');
const MusicBox = require('./MusicBox');
const Console = require('./Console');

const INIT_STATE = 'INIT';
const MAIN_GAME_STATE = 'GAME';
const SPLASH_STATE = 'SPLASH';
const OFF_STATE = 'OFF';

class Game {
	constructor(options) {
		const { id, consoleId, data, customEffects,	haveSplash,	fontFamilies } = options;
		this.id = id;
		this.displayContainer = document.getElementById(id || 'display');
		this.console = new Console({ id: consoleId });
		this.display = null;
		this.haveSplash = Boolean(haveSplash);
		this.fontFamilies = fontFamilies || [];
		this.activeLevelIndex = 0;
		// The generated levels
		this.levels = [];
		// Custom funcitons for generating things
		this.generators = options.generators || {};
		// Reference data on prototypical "things" (monsters, items)
		this.data = {
			monsters: {},
			items: {},
			props: {},
			playlist: [],
		};
		// The main actor
		this.hero = null; // player character / player actor
		// Guts
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = null;
		this.keyboard = null;
		this.state = INIT_STATE;
		this.states = new Set([INIT_STATE, SPLASH_STATE, MAIN_GAME_STATE, OFF_STATE]);
		// this.setupEngine();
		this.loadingPromise = null;
		this.console.setup();
		this.loadData(data);
		this.hooks = {};
		this.customEffects = { ...customEffects };
	}

	setupEngine() {
		this.engine = new ROT.Engine(this.scheduler);
		this.engine.start();
		return this.engine;
	}

	setupKeyboard() {
		this.keyboard = new Keyboard({ state: MAIN_GAME_STATE, autoStart: true });
		// Splash state
		this.keyboard.on(SPLASH_STATE, 'ENTER', () => {
			this.setState(MAIN_GAME_STATE);
		});
		// Main state
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
		this.keyboard.on(MAIN_GAME_STATE, 'p', () => {
			this.hero.queueAction('pickup');
			this.advance();
		});
		this.keyboard.on(MAIN_GAME_STATE, 'o', () => {
			this.hero.queueAction('look');
			this.advance();
		});
		for (let i = 0; i < 9; i++) {
			const key = String(i + 1);
			this.keyboard.on(MAIN_GAME_STATE, key, () => {
				this.hero.readyAbilityByIndex(i);
				this.draw();
			});
		}
		// this.keyboard.start();
	}

	setupMusic() {
		this.music = new MusicBox(this.data.playlist);
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
		this.display.drawLevel(this, this.getActiveLevel(), this.hero);
	}


	//---- Generation

	createLevel(options = {}, seed) {
		options.seed = seed || options.seed;
		const levelOptions = {
			customEffects: this.customEffects,
			...options,
			levelIndex: this.levels.length,
			generators: this.generators,
		};
		// console.warn(this.customEffects, levelOptions);
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
			// TODO: allow pushes based on authority/size
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
		const originalLevelIndex = this.activeLevelIndex;
		// console.warn('teleporting', actor, teleportParams);
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
		if (originalLevelIndex !== levelIndex) {
			this.hook('afterTeleportLevel', { levelIndex, x, y });
		}
		// this.draw();
	}

	resolveCombat(actor, opponent, x, y) {
		const level = this.getActiveLevel();
		if (!actor || !opponent || actor.faction === opponent.faction) {
			return false;
		}
		const { outcomeAttack } = level.resolveCombatEffects(actor, opponent);
		// TODO: get messages from resolve and effects methods
		g.print(`${actor.name} attacks ${opponent.name} and does ${outcomeAttack.damage} damage!`);
		if (opponent.dead()) {
			g.print(`${opponent.name} has been killed.`);
			actor.score += (this.activeLevelIndex + 1) * 10;
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
		} else if (thing.hasAction('open')) {
			actor.queueAction('open', { target: thing });
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
		level.resolveRoundEffects();
		const actors = level.getActorsInitiativeOrdered();
		level.coolOffInitiativeBoosts();
		actors.forEach((actor) => {
			actor.planAction(level, this.hero);
			this.advanceActor(actor);
		});
		// this.advanceActor(this.hero);
		const isDamaged = (startHp > this.hero.hp);
		this.display.drawDamage(isDamaged);
		if (this.hero.dead()) {
			this.hook('afterHeroDeath', {});
		}
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
		let outcome = {};
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
				outcome = level.useThing(actor, 'use', target);
				message = outcome.message;
			break;
			case 'open':
				outcome = level.useThing(actor, 'open', target);
				message = outcome.message;
			break;
			case 'teleport':
				message = `${actor.name} now entering: `;
				this.teleportActor(actor, action.teleport);
				{
					const newLevel = this.getActiveLevel();
					message += newLevel.name;
					if (newLevel.description) {
						message += ' - ' + newLevel.description;
					}
				}
			break;
			case 'pickup':
				const pickedUp = this.pickupItem(actor, target);
				if (pickedUp) {
					message = `${actor.name} picks up the ${target.name}.`;
				} else if (target) {
					message = `${actor.name} could not pick up the ${target.name}.`;
				} else {
					message = `Nothing to pick up.`;
				}
			break;
			case 'throw':
				message = level.throw(actor, what, x, y);
			break;
			case 'look':
				const things = this.getActiveLevel().findEverythingInView({ excludeHero: true });
				const names = things.map((thing) => thing.name || '?').join(', ');
				message = `${actor.name} looks around and sees: ${names}`;
			break;
			case 'wait':
				actor.wait();
				if (actor.isHero) {
					message = `${actor.name} waits (random recovery of AP, BP, or EP points).`;
				}
			break;
		}
		if (typeof message !== 'string') {
			console.error('Unknown message from doing action', verb);
			message = 'ERROR';
		}
		this.print(message);
	}

	pickupItem(actor, thing) {
		if (!thing) { return false; }
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

	ready(callback, fonts = []) { // TODO: remove fonts param?
		const fontFamiliesToLoad = [ ...fonts ].concat(this.fontFamilies);
		console.log(fontFamiliesToLoad);
		ready(() => {
			if (this.loadingPromise instanceof Promise) {
				this.loadingPromise
					.then(() => { callback(); });
					// .catch((err) => { console.error('Error loading something', err) });
			} else {
				callback();
			}
		}, fontFamiliesToLoad);
		// TODO: return a promise so can be used async
	}

	start() {
		this.setupEngine();
		this.setupKeyboard();
		this.setupMusic();
		const startState = (this.haveSplash) ? SPLASH_STATE : MAIN_GAME_STATE;
		this.setStateDetect(startState);
		// TODO: start graphics loop
		this.draw();
	}

	stop() {
		this.setState(OFF_STATE);
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
			if (typeof data[key] === 'string') {
				const p = fetch(data[key])
					.then(parseJson)
					.then((obj) => fixInnerObject(obj, key))
					.then((obj) => { this.setData(key, obj); });
					//.catch((err) => { console.error(data, key, err); });
				promises.push(p);
			} else {
				this.setData(key, data[key]);
			}
		}
		this.loadingPromise = Promise.all(promises); // .then((resp) => { console.log(resp); });
		return this.loadingPromise;
	}

	//---- Hooks

	addHook(hookName, fn) {
		if (!this.hooks[hookName]) {
			this.hooks[hookName] = [];
		}
		this.hooks[hookName].push(fn);
	}

	removeHook(hookName, fn) {
		if (!this.hooks[hookName]) { return; }
		const i = this.hooks[hookName].indexOf(fn);
		this.hooks[hookName].splice(i, 1);
	}

	hook(hookName, data = {}) {
		const hook = this.hooks[hookName];
		if (!hook) { return; }
		hook.forEach((fn) => {
			fn(data, this, hookName);
		});
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

	setStateDetect(stateFallback) {
		// TODO: improve... not sure i like how this works
		// const hash = location.hash.substring(1).toUpperCase();
		// if (this.states.includes(hash)) {
		// 	return this.setState(hash);
		// }
		return this.setState(stateFallback);
	}

	setState(state) {
		const isLegitState = this.states.has(state);
		const consoleMethod = (isLegitState) ? 'log' : 'warn';
		console[consoleMethod]('Setting state:', state);
		const prefix = 'rote-state-';
		this.state = state;
		// const body = document.getElementsByClassName('rote-state')[0];
		const body = document.getElementsByTagName('body')[0];
		// body.className = 'rote-state'; // TODO: make this smarter so it only removes rote states
		// body.classList.add(prefix + this.state.toLowerCase());
		body.className = 'rote-state ' + prefix + state.toLowerCase();
		location.hash = state.toLowerCase();
		this.keyboard.setState(state);
	}

	setMainGameState() {
		this.setState(MAIN_GAME_STATE);
	}

}

module.exports = Game;
