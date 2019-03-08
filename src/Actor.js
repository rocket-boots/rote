const ROT = require('rot-js');
const Inventory = require('./Inventory');
const geometer = require('./geometer');

const MOVE = 'move';
const WAIT = 'wait';
const MONSTER_FACTION = 'monsters';

class Actor {
	constructor(options = {}) {
		this.type = options.type;
		this.name = options.name || null;
		this.faction = options.faction || MONSTER_FACTION;
		this.isHero = Boolean(options.isHero);
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.character = options.character || 'M';
		this.originalCharacter = this.character;
		this.color = options.color || '#ff0';
		this.originalColor = this.color;
		this.bloodColor = '#611';
		// this.game = options.game || console.error('must tie actor to game');
		this.inventory = new Inventory({
			size: options.inventorySize || 10
		});
		this.passable = false;
		this.actionQueue = [];
		this.maxMovement = this.isHero ? 1.42 : 1;
		this.sightRange = (typeof options.sightRange === 'number') ? options.sightRange : 6;
		this.target = null;
		this.aggro = options.aggro || 0;
		// stats
		this.hp = (options.hp || typeof options.hp === 'number') ? parseInt(options.hp, 10) : 2;
		this.armsPoints = options.armsPoints || 0;		// ap
		this.balancePoints = options.balancePoints || 0;		// bp
		this.endurancePoints = options.endurancePoints || 0;	// ep
		this.focusPoints = options.focusPoints || 0;		// fp
		this.willPoints = options.willPoints || 0;		// wp
	}

	draw(display, lighting = {}, inView = false) {
		if (!inView) {
			return false;
		}
		// TODO: adjust colors based on lighting and inView
		display.draw(this.x, this.y, this.character, this.color);
		return true;
	}

	queueAction(verb, params = {}) {
		const actionParams = { ...params, verb };
		this.actionQueue.push(actionParams);
	}

	clearQueue() {
		this.actionQueue.length = 0;
	}

	planAction(level, hero) {
		if (this.isHero) { return; }
		if (this.dead()) {
			this.clearQueue();
			return;
		}
		const distanceToHero = geometer.getDistance(this.x, this.y, hero.x, hero.y);
		const dangerouslyHurt = (this.hp <= 1);
		this.act = function () {
			console.log(`${this.name} acts`);
			// if (g.getActiveLevel() !== level) { return; }
		};
		if (this.aggro && distanceToHero <= this.getMaxSenseRange() && !hero.dead() && !dangerouslyHurt) {
			const map = level.getMap();
			this.clearQueue();
			this.setTarget(hero);
			this.setPathToTarget(map);
			if (this.atEndOfPath()) {
				this.queueAction('attack', { target: hero });
			} else if (this.actionQueue.length === 1) {
				this.clearQueue();
				this.queueAction('attack', { target: hero });
			}
		} else {
			if (this.atEndOfPath()) {
				this.setWanderPath(level);
			}
		}
		// console.log(`${this.name} plans`, this.actionQueue);
	}

	doAction() {
		if (this.dead()) { return { verb: 'rot' }; }
		const waitAction = { verb: WAIT };
		if (this.actionQueue.length === 0) { return waitAction; }
		let action = this.actionQueue.shift();
		const moveAlreadyThere = (action.verb === MOVE && action.x === this.x && action.y === this.y);
		const moveTooFar = (action.verb === MOVE && this.getDistanceToNextMove(action) > this.maxMovement);
		// console.log(this.name, this.x, this.y, action.verb, action.x, action.y, this.getDistanceToNextMove(), this.maxMovement, moveTooFar, 'q', this.actionQueue.length);
		if (moveAlreadyThere) {
			return this.doAction();
		}
		if (moveTooFar) {
			action = this.doAction();
		}
		if (!action) {
			return waitAction;
		}
		return action;
	}

	attack(who) {
		console.log(`${this.name} attacks`, who);
		// TODO
	}

	setWanderPath(level) {
		const map = level.getMap();
		const { x, y } = level.findRandomFreeCell();
		this.setPathTo(map, x, y);
	}

	atEndOfPath() {
		const nextAction = this.getNextAction();
		if (!nextAction) { return true; }
		return (nextAction.verb === MOVE) ? false : true;
	}

	//---- Movement

	move(x, y) {
		this.x += parseInt(x, 10);
		this.y += parseInt(y, 10);
	}

	moveTo(x, y) {
		this.setCoordinates(x, y);
	}

	//---- Combat

	attackDamage(opponent) {
		return 1;
	}

	wound(n) {
		this.hp -= parseInt(n, 10);
		this.checkDeath();
	}

	dead() {
		return (this.hp <= 0);
	}

	checkDeath() {
		if (this.dead()) {
			this.character = 'X';
			this.color = this.bloodColor;
			this.passable = true;
		}
	}

	//---- Gets

	getMaxSenseRange() {
		return this.sightRange;
	}

	getNextAction() {
		return this.actionQueue[0];
	}

	getDistanceToNextMove(nextAction) {
		if (!nextAction) { nextAction = this.getNextAction(); }
		if (!nextAction) { return 0; }
		const { x, y } = nextAction;
		if (x !== undefined && y !== undefined) {
			return geometer.getDistance(x, y, this.x, this.y);
		}
		return null; // ?
	}

	setCoordinates(x, y) {
		this.x = parseInt(x, 10);
		this.y = parseInt(y, 10);
	}

	setPathTo(map, x = 0, y = 0) {
		const passableCallback = function(x, y) {
			return map.getCellPassability(x, y);
		};
		const astar = new ROT.Path.AStar(x, y, passableCallback, { topology: 4 });
		const path = this.actionQueue;
		const pathCallback = function(x, y) {
			path.push({ x, y, verb: MOVE });
		};
		if (path[0] && path[0].x === this.x && path[0].y === this.y) {
			console.alert('removing first');
			path.shift();
		}
		astar.compute(this.x, this.y, pathCallback);
		return true;
	}

	setPathToTarget(map) {
		return this.setPathTo(map, this.target.x, this.target.y);
	}

	setTarget(target) {
		if (typeof target.x !== 'number' || typeof target.y !== 'number') {
			console.warn('Cannot set target to something without x,y');
			return;
		}
		this.target = target;
	}
}

module.exports = Actor;
