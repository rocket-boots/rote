const Map = require('./Map');
const Actor = require('./Actor');
const Item = require('./Item');
const Prop = require('./Prop');
const geometer = require('./geometer');
const random = require('./random');
const { DIRS_4, DIRS_8_DIAGNOLS } = require('./constants');

class Level {
	constructor(options = {}, refData = {}) {
		this.seed = options.seed || 1;
		this.name = options.name || 'Unknown level';
		this.description = options.description || null;
		this.levelIndex = options.levelIndex || 0;
		this.color = options.color || '#777';
		this.background = options.background || '#222';
		const mapOptions = {
			color: this.color,
			background: this.background,
			...options.map,
			seed: this.seed,
			generators: options.generators || {}
		};
		this.map = new Map(mapOptions);
		this.actors = [];
		this.items = [];
		this.props = [];
		this.actors = this.generateActors(options, refData);
		this.items = this.generateItems(options, refData.items);
		this.props = this.generateProps(options, refData.props);
		this.eye = { x: 0, y: 0, sightRange: 7 };
		this.customEffects = { ...options.customEffects };
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
		// Draw dead first, then non-dead
		this.actors.forEach((actor) => {
			if (actor.dead()) {
				this.drawActor(display, actor);
			}
		});
		this.actors.forEach((actor) => {
			if (!actor.dead()) {
				this.drawActor(display, actor);
			}
		});
	}

	drawActor(display, actor) {
		const lighting = this.map.getLightingAt(this.eye.x, this.eye.y);
		const inView = this.isInView(actor.x, actor.y);
		actor.draw(display, lighting, inView);
	}

	isInView(x, y) { // TODO: optimize
		const r = geometer.getDistance(this.eye.x, this.eye.y, x, y); // TODO: allow more complicated POV
		return (r <= this.eye.sightRange);		
	}

	addItem(item) {
		this.items.push(item);
	}

	removeItem(item) {
		return this.removeThing('items', item);
	}

	addActor(actor) {
		this.actors.push(actor);
	}

	removeActor(actor) {
		return this.removeThing('actors', actor);
	}

	removeThing(property, thing) {
		const i = this[property].findIndex((a) => { return a === thing; });
		if (i <= -1) {
			console.warn('nothing found in', property);
			return;
		}
		const arr = this[property].splice(i, 1);
		return arr[0];		
	}

	findItem(x, y) {
		const foundThings = this.findItems(x, y);
		return (foundThings.length) ? foundThings[0] : null;
	}
	findItems(x, y) {
		return this.items.filter((item) => {
			return item.x === x && item.y === y && !item.containedIn;
		});
	}

	findProp(x, y) {
		const foundThings = this.findProps(x, y);
		return (foundThings.length) ? foundThings[0] : null;
	}
	findProps(x, y) {
		return this.props.filter((prop) => { return prop.x === x && prop.y === y; });
	}
	findPropsByType(type) {
		return this.props.filter((prop) => { return prop.type === type; });
	}

	findActor(x, y) {
		const foundThings = this.findActors(x, y);
		return (foundThings.length) ? foundThings[0] : null;
	}
	findActors(x, y) {
		return this.actors.filter((actor) => {
			return actor.x === x && actor.y === y && !actor.dead();
		});
	}

	findThingInView(what) { // 'actors', 'items', 'props'
		return this[what].filter((a) => this.isInView(a.x, a.y));
	}

	findActorsInView(excludeHero) {
		return this.actors.filter((a) => {
			const inView = this.isInView(a.x, a.y);
			if (excludeHero) {
				return inView && !a.isHero;
			}
			return inView;
		});
	}

	findEverythingInView(options = {}) {
		return this.findActorsInView(options.excludeHero)
			.concat(this.findThingInView('items'))
			.concat(this.findThingInView('props'));
	}

	findThings(x, y) {
		const props = this.findProps(x, y);
		const items = this.findItems(x, y);
		const allThings = props.concat(items);
		return allThings;
	}

	findThingsCardinal(x, y) {
		const props = this.findThingsByDirections('props', DIRS_4, x, y);
		const items = this.findThingsByDirections('items', DIRS_4, x, y);
		const allThings = props.concat(items);
		return allThings;
	}

	findThingsDiagnol(x, y) {
		const props = this.findThingsByDirections('props', DIRS_8_DIAGNOLS, x, y);
		const items = this.findThingsByDirections('items', DIRS_8_DIAGNOLS, x, y);
		const allThings = props.concat(items);
		return allThings;
	}

	findThingsByDirections(thingName, dirs, x, y) {
		const coords = [];
		dirs.forEach((dir) => { coords.push({ x: x + dir.x, y: y + dir.y }); });
		return this[thingName].filter((thing) => {
			const matches = coords.filter((xy) => {
				return xy.x === thing.x && xy.y === thing.y && !thing.containedIn
			});
			return matches.length > 0;
		});		
	}

	findThingSmart(x, y, perferredProperty) {
		let things = this.findThings(x, y);
		// console.log('find smart - on spot', things);
		if (!things.length) {
			things = this.findThingsCardinal(x, y);
			// console.log('find smart - cardinal', things);
			if (!things.length) {
				things = this.findThingsDiagnol(x, y);
				// console.log('find smart - diagnols', things);
			}
		}
		if (perferredProperty) {
			things.sort((a, b) => {
				// console.log(a, b, a[perferredProperty]);
				return b[perferredProperty];
			});
			// console.log("sorted", things);
		}
		return things[0];
	}

	findRandomFreeCell(seed, clearing, retries = 50) {
		let cell = this.map.getRandomFreeCell();
		if (!retries) {
			return cell;
		}
		const tryAgain = () => {
			return this.findRandomFreeCell(seed, clearing, (retries - 1));
		};
		if (this.findActors(cell.x, cell.y).length > 0) {
			return tryAgain();
		}
		if (this.findThings(cell.x, cell.y).length > 0) {
			return tryAgain();
		}
		if (this.findMapClearing(cell.x, cell.y) >= clearing) {
			return tryAgain();
		}
		return cell;
	}

	findMapClearing(x, y) {
		// TODO: loop
		return 0;
	}

	discoverCircle(x, y, radius) {
		return this.map.discoverCircle(x, y, radius);
	}

	// Actions

	useThing(actor, actionName, thing) {
		const outcome = thing.action(actionName, actor);
		if (typeof outcome !== 'object') {
			console.warn('action returns outcome that is not object', actionName, thing, outcome);
		}
		this.doEffects(outcome.effects, actor, actor);
		return outcome;
	}

	throw(actor, what, x, y) {
		const item = actor.inventory.remove(what);
		if (!item) { return false; }
		item.x = (typeof x === 'number') ? x : actor.x;
		item.y = (typeof y === 'number') ? y : actor.y;
		const containers = this.findThings(x, y).filter((thing) => {
			console.log(thing);
			return thing.hasSpace();
		});
		if (containers.length) {
			const container = containers[0];
			container.addToInventory(item);
			return `${actor.name} puts ${what.name} into the ${container.name}.`;
		}
		this.addItem(item);
		return `${actor.name} throws down a ${what.name}.`;
	}

	doInitiative() {
		const livingActors = this.actors.filter((actor) => !actor.dead());
		let orderedActors = random.shuffle(livingActors);
		// TODO: Look for initiative boost, put at top of list
	}

	static removeEffects(effects, key) {
		let i = effects.indexOf(key);
		while (i > -1) {
			effects.splice(i, 1);
			i = effects.indexOf(key);
		}
	}

	resolveRoundEffects() {
		this.actors.forEach((actor) => {
			const roundEffects = actor.activateAbilities('round');
			this.doEffects(roundEffects, actor, actor);
		});
	}

	resolveCombatEffects(attacker, defender) {
		let attackEffects = attacker.activateAbilities('attack');
		let defendEffects = defender.activateAbilities('attacked');
		let damageEffects;
		let damagedEffects;

		attackEffects.push('attack');

		console.log(attacker.name, JSON.stringify(attackEffects), 'vs', defender.name, JSON.stringify(defendEffects), defender);

		if (defendEffects.includes('cancelAttack')) {
			Level.removeEffects(attackEffects, 'attack');
		}

		if (attackEffects.includes('attack')) {
			attackEffects.push('weaponDamage');
		}
		if (attackEffects.includes('damage') || attackEffects.includes('weaponDamage')) {
			damageEffects = defender.activateAbilities('damage');
			attackEffects = attackEffects.concat(damageEffects);
			damagedEffects = defender.activateAbilities('damaged');
			defendEffects = defendEffects.concat(damagedEffects);
		}
		if (defendEffects.includes('cancelDamage') || attackEffects.includes('cancelDamage')) {
			Level.removeEffects(attackEffects, 'damage');
			Level.removeEffects(attackEffects, 'weaponDamage');
		}

		console.log(attacker.name, JSON.stringify(attackEffects), 'vs', JSON.stringify(defendEffects));

		const outcomeAttack = this.doEffects(attackEffects, attacker, defender);
		const outcomeDefend = this.doEffects(defendEffects, defender, attacker);

		// TODO: generate messages

		return { outcomeAttack, outcomeDefend, attackEffects, defendEffects };
	}

	doEffects(effects, actor, opponent) {
		let damage = 0;
		if (!effects) { return { damage }; }
		effects.forEach((effect) => {
			damage += this.doEffect(effect, actor, opponent);
		});
		return { damage };
	}

	doEffect(effect, actor, opponent) {
		console.log('doEffect', effect);
		let damage = 0;
		switch(effect) {
			case 'damage':
				damage += 1;
				opponent.wound(1);
			break;
			case 'weaponDamage':
				damage += actor.getWeaponDamage();
				opponent.wound(damage);
			break;
			case 'heal':
			case 'hp':
				actor.heal(1);
			break;
			case 'ap':
				actor.healPool('ap', 1);
			break;
			case 'bp':
				actor.healPool('bp', 1);
			break;
			case 'ep':
				actor.healPool('ep', 1);
			break;
			case 'moveSwitch': {
				const { x, y } = actor;
				actor.setCoordinates(opponent.x, opponent.y);
				opponent.setCoordinates(x, y);
			}
			break;
			case 'apDamage':
				actor.damagePool('ap', 1);
			break;
			case 'bpDamage':
				actor.damagePool('bp', 1);
			break;
			case 'epDamage':
				actor.damagePool('ep', 1);
			break;
			case 'push':
				this.pushActor(actor, opponent);
			break;
			case 'pushAoe':
				this.pushActor(actor, opponent);
				// TODO: Handle aoe --> everyone (accept opponent) around hitX, hitY gets knocked back
			break;
			case 'moveBack':
				this.pushActor(opponent, actor);
			break;
			case 'initiative':
				actor.initiativeBoost = 1;
			break;
			case "fire":
				// TODO:
			break;
			case "endGame":
				// TODO
			break;
			case "score1000":
				actor.score += 1000;
			break;
			default:
				this.doCustomEffect(effect, actor, opponent);
			break;
		}
		return damage;
	}

	doCustomEffect(effect, actor, opponent) {
		if (typeof this.customEffects[effect] === 'function') {
			this.customEffects[effect](effect, actor, opponent);
		}
	}

	pushActor(pusher, pushee) {
		const { x, y } = pusher;
		let moveX = pushee.x - x;
		let moveY = pushee.y - y;
		moveX = moveX / (moveX === 0 ? 1 : Math.abs(moveX));
		moveY = moveY / (moveY === 0 ? 1 : Math.abs(moveY));
		// console.log('pushing', pushee.name, moveX, moveY);
		pushee.move(moveX, moveY);
	}

	getActorsInitiativeOrdered() {
		const randomActors = random.shuffle(this.actors);
		const firstActors = [];
		let i = randomActors.length - 1;
		while (i--) {
			const actor = randomActors[i];
			if (actor.initiativeBoost > 0) {
				firstActors.push(actor);
				randomActors.splice(i, 1);
			}
		}
		return firstActors.concat(randomActors);
	}

	coolOffInitiativeBoosts() {
		this.actors.forEach((actor) => {
			actor.initiativeBoost = 0;
		});
	}

	// Generation

	generateItem(levelItem = {}, Class, seed = 0, types = [], background = undefined) {
		const { x, y } = this.findRandomFreeCell(seed, levelItem.clearing);
		const itemTypeOptions = (levelItem.type && types[levelItem.type]) ? types[levelItem.type] : {};
		const itemOptions = {
			x, y,
			...itemTypeOptions,
			...levelItem
		};
		if (background) { itemOptions.background = background; }
		const item = new Class(itemOptions);
		return item;
	}

	generateItems(options = {}, itemTypes = {}) {
		let seed = this.seed + 200;
		let { items = [] } = options;

		const arr = [];
		items.forEach((levelItem) => {
			const quantity = (typeof levelItem.quantity === 'number') ? levelItem.quantity : 1;
			// TODO: handle weight, etc.
			for (let i = 0; i < quantity; i++) {
				const item = this.generateItem(levelItem, Item, ++seed, itemTypes);
				arr.push(item);
			}
		});
		return arr;
	}

	generateProps(options = {}, propTypes = {}) {
		let seed = this.seed + 100;
		let { props = [] } = options;
		const background = this.background;

		const arr = [];
		props.forEach((levelProp) => {
			const quantity = (typeof levelProp.quantity === 'number') ? levelProp.quantity : 1;
			// TODO: handle weight, etc.
			for (let i = 0; i < quantity; i++) {
				const prop = this.generateItem(levelProp, Prop, ++seed, propTypes, background);
				arr.push(prop);
			}
		});
		return arr;
	}

	generateActors(options = {}, refData = {}) {
		console.log('generateActors', options);
		let seed = this.seed + 999; // ?
		const { monsterSpawn, monsters = [] } = options;
		const monsterTypes = refData.monsters;
		const depth = options.levelIndex;
		const availableMonsters = monsters.filter((levelMonster) => {
			return (!levelMonster.minDepth) || levelMonster.minDepth <= depth;
		});
		const availableMonsterWeights = {};
		availableMonsters.forEach((levelMonster) => {
			if (levelMonster.weight) {
				availableMonsterWeights[levelMonster.type] = levelMonster.weight;
			}
		});
		const hasMonstersWithWeights = Object.keys(availableMonsterWeights).length > 0;
		const monsterSpawnNumber = (monsterSpawn === undefined) ? 10 : random.roll(monsterSpawn);
		const totalMonsterSpawnQuantity = monsterSpawnNumber;
		const actors = [];
		// Create monsters with fixed quantities
		// Note: this could exceed the total quantity
		const availableMonstersFixedQuantities = availableMonsters.filter((levelMonster) => {
			return levelMonster.quantity;
		});
		availableMonstersFixedQuantities.forEach((levelMonster) => {
			const monsterTypeKey = levelMonster.type;
			for (let i = 0; i < levelMonster.quantity; i++) {
				const monster = this.createActor(monsterTypes, monsterTypeKey, ++seed);
				actors.push(monster);
			}
		});
		// Create weighted monsters
		if (hasMonstersWithWeights) {
			let stopper = 0;
			while (actors.length < totalMonsterSpawnQuantity && stopper < 9000) {
				stopper++;
				(() => {
					const monsterTypeKey = random.getWeightedValue(availableMonsterWeights);
					if (!monsterTypeKey) { return; }
					const monster = this.createActor(monsterTypes, monsterTypeKey, ++seed);
					actors.push(monster);
				})();
			}
		}
		// console.log('Actors at depth', depth, actors);
		return actors;
	}

	createActor(monsterTypes, monsterTypeKey, seed) {
		if (!monsterTypeKey) { return; }
		const { x, y } = this.findRandomFreeCell(seed);
		let monsterOptions = monsterTypes[monsterTypeKey];
		monsterOptions = { type: monsterTypeKey, aggro: 100, ...monsterOptions, x, y };
		// console.log(monsterTypes, monsterTypeKey, monsterOptions);
		return new Actor(monsterOptions);		
	}

	// Gets

	getMap() {
		return this.map;
	}

	getCellPassability(x, y) {
		const isMapPassable = this.map.getCellPassability(x, y);
		if (!isMapPassable) { return false; }
		const actorsHere = this.actors.filter((actor) => {
			return actor.x === x && actor.y === y && !actor.passable;
		});
		return (actorsHere.length === 0);
	}

	// Sets

	setEye(actorThing) {
		this.eye.x = actorThing.x;
		this.eye.y = actorThing.y;
		this.eye.sightRange = actorThing.sightRange;
	}
}

module.exports = Level;
