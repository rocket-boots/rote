const ROT = require('rot-js');
const Level = require('./Level');
const Actor = require('./Actor');
const Item = require('./Item');
const Keyboard = require('./KeyboardListener');

class Game {
	constructor({ id, consoleId }) {
		this.id = id;
		this.displayContainer = document.getElementById(id || 'display');
		this.consoleContainer = document.getElementById(consoleId || 'console');
		this.display = null;
		this.activeLevelIndex = 0;
		this.levels = [];
		this.hero = null; // player character / player actor
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = null;
		this.keyboard = null;
		// this.setupEngine();
	}

	setupEngine() {
		this.engine = new ROT.Engine(this.scheduler);
		this.engine.start();
		return this.engine;
	}

	setupKeyboard() {
		this.keyboard = new Keyboard({ state: 'GAME', autoStart: true });
		this.keyboard.on('GAME', 'DIRECTION', (keyName, keyCode, direction) => {
			// TODO: Lock and unlock the game? or do something else to determine if it's OK to move
			this.moveActor(this.hero, direction);
		});
		this.keyboard.on('GAME', 'ENTER', () => {
			this.actorOpenItem(this.hero);
		});
		// this.keyboard.start();
		console.log(this.keyboard);
	}

	createDisplay(options = {}) {
		options = { width: 60, height: 30, ...options };
		this.display = new ROT.Display(options); // , layout:"term"});
		const elt = this.display.getContainer();
		// console.log(elt, this.displayContainer);
		this.displayContainer.appendChild(elt);
	}

	print(str) {
		if (!str) {
			return;
		}
		console.log('%c' + str, 'color: #559955');
		this.consoleContainer.innerHTML += '<br/>' + str.replace('<', '&lt;');
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

	createLevel(options = {}) {
		const level = new Level(options);
		this.levels.push(level);
		return level;
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
		this.hero = this.createActor(options);

		const g = this;
		// Setup action stuff ... this needs to be refactored
		this.hero.act = function () {
			g.engine.lock();
			window.addEventListener('keydown', this); // pass the hero; the `handleEvent` will be used
		};
		this.hero.handleEvent = function (e) {
			// console.log('handleEvent', e.keyCode);
			// var keyMap = {};
			// keyMap[38] = 0; // up
			// keyMap[33] = 1;
			// keyMap[39] = 2; // right
			// keyMap[34] = 3;
			// keyMap[40] = 4; // down
			// keyMap[35] = 5;
			// keyMap[37] = 6; // left
			// keyMap[36] = 7;
		 
			// var code = e.keyCode;
		 
			// if (!(code in keyMap)) {
			// 	return;
			// }

			// g.moveActor(this, keyMap[code]);

			window.removeEventListener('keydown', this);
			g.engine.unlock();
		};
		return this.hero;
	}

	moveActor(actor, direction) {
		var diff = ROT.DIRS[8][direction];
			
		var newX = actor.x + diff[0];
		var newY = actor.y + diff[1];
	 
		const canMoveToCell = this.getActiveLevel().map.getCellPassability(newX, newY);
		// console.log('considering moving', diff[0], diff[1], 'to', newX, newY, '... free?', canMoveToCell);
		if (!canMoveToCell) {
			return;
		}

		// Do the move
		actor.move(diff[0], diff[1]);
		// TODO: just redraw the space that was under the hero and the hero in his new spot?
		this.draw();		
	}

	actorOpenItem(actor) {
		const itemOnCell = this.getActiveLevel().findItem(actor.x, actor.y);
		console.log(itemOnCell, actor.x, actor.y);
		if (!itemOnCell) {
			return;
		}
		// TODO: Remove
		const hasWin = itemOnCell.contains('Amulet of Winning');
		const what = (itemOnCell.hasContents()) ? itemOnCell.getContents(0).name : 'nothing';
		this.print(`The hero opens the ${itemOnCell.name}, and finds ${what}.`);
		if (hasWin) {
			alert('You win!');
		}
	}
}

module.exports = Game;
