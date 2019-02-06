
var g = new rote.Game({
	id: 'display',
	keyboard: 'multi-move',
});

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
	// g.setupEngine();

	// Build the game world
	const level = g.createLevel({
		map: {
			type: 'digger',
			walls: true,
			// seed: 123,
		}
	});
	// Player character
	{
		const { x, y } = level.findRandomFreeCell();
		g.createHero({ x, y });
	}
	// Enemy
	{
		const { x, y } = level.findRandomFreeCell();
		const boss = g.createActor({ x, y, name: 'Pedro', color: '#f44', character: 'P' }, level);
		boss.act = function () {
			this.setPathTo(level.getMap(), g.hero.x, g.hero.y);
			this.moveAlongPath();
			// g.moveActor(boss, 4);
		};
	}
	// Crates
	generateCrates(level, 10);
	

	// Connect to browser DOM for display
	g.createDisplay({ width: 60, height: 30, fontSize: 20,
		// fontFamily: "AppleII"
		fontFamily: "Fix15MonoBold"
		// fontFamily: "White Rabbit"
	});
	g.draw();

	g.setupEngine();
	g.setupKeyboard();
});
