var g = new rote.Game({ id: 'display', keyboard: 'multi-move' });

function createPlayerCharacter(level) {
	const { x, y } = level.findRandomFreeCell();
	g.createHero({ x, y });
}

function generateEnemy(level) {
	const { x, y } = level.findRandomFreeCell();
	const boss = g.createActor({ x, y, name: 'Pedro', color: '#f44', character: 'P' }, level);
	boss.act = function () {
		this.setPathTo(level.getMap(), g.hero.x, g.hero.y);
		this.moveAlongPath();
	};
}

function generateCrates(level, n = 10) {
	while (n > 0) {
		const { x, y } = level.findRandomFreeCell();
		const crate = g.createItem({ x, y, name: 'crate', inventorySize: 1, character: '*' }, level);
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
});
