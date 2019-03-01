var g = new rote.Game({ id: 'display', keyboard: 'multi-move' });

function createPlayerCharacter(level) {
	const { x, y } = level.findRandomFreeCell();
	g.createHero({ x, y });
}

function generateEnemy(level) {
	const { x, y } = level.findRandomFreeCell();
	const boss = g.createActor({ x, y, name: 'Pedro', color: '#f44', character: 'P' }, level);
	boss.setTarget(g.hero);
	boss.act = function () {
		this.setPathToTarget(level.getMap());
		if (this.atEndOfPath(1)) {
			this.attack();
			g.print(`${this.name} attacks!`);
		} else {
			this.moveAlongPath();
		}
	};
}

function openCrate(item) {
	const hasWin = item.contains('Amulet of Winning');
	const what = (item.hasContents()) ? item.getContents(0).name : 'nothing';
	g.print(`The hero opens the ${item.name}, and finds ${what}.`);
	if (hasWin) {
		g.print('You win!');
	}
}

function generateCrates(level, n = 10) {
	while (n > 0) {
		const { x, y } = level.findRandomFreeCell();
		const on = {
			open: openCrate
		};
		const crateOptions = { x, y, on, name: 'crate', inventorySize: 1, character: '*' };
		const crate = g.createItem(crateOptions, level);
		if (n === 1) {
			const amulet = g.createItem({ x, y, character: '"', name: 'Amulet of Winning' }, level);
			crate.addItem(amulet);
		}
		n--;
	}
}

rote.ready(() => {
	// Connect to browser DOM for display
	g.createDisplay({
		width: 60,
		height: 30,
		fontSize: 20,
		fontFamily: "Fix15MonoBold" // alternatives: "AppleII" or "White Rabbit"
	});
	// Build the game world
	const level = g.createLevel({ map: { type: 'digger', walls: true } });
	// Create pcs, npcs, items
	createPlayerCharacter(level);
	generateEnemy(level);
	generateCrates(level, 10);
	// Start the game
	g.start();
	g.print('Move with your favorite movement keys, open crates with Enter, and avoid Pedro.')
});
