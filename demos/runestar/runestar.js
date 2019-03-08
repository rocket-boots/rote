var g = new rote.Game({
	id: 'display',
	keyboard: 'multi-move',
	data: {
		monsters: 'data/monsters.json',
		items: 'data/items.json',
		props: 'data/props.json',
		levels: 'data/levels.json'
	},
});

function createPlayerCharacter(level) {
	const { x, y } = level.findRandomFreeCell();
	g.createHero({ x, y, name: 'Hero', sightRange: 6, hp: 100000, faction: 'kith' });
	g.hero.inventory.add( new rote.Item({ name: 'Beard comb', character: "⋹" }) );
	g.hero.inventory.add( new rote.Item({ name: 'Toga', character: "⌓" }) );
}

function openCrate(item) {
	// const hasWin = item.contains('Amulet of Winning');
	const what = (item.hasContents()) ? item.getContents(0).name : 'nothing';
	g.print(`The hero opens the ${item.name}, and finds ${what}.`);
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
			const amulet = g.createItem({ x, y, character: '"', name: 'Amulet of Stars' }, level);
			crate.addItem(amulet);
		}
		n--;
	}
}

function setupMachinery(level) {
	// level.findPropsByType('extractor');
	// level.findPropsByType('extractorSwitch');
}

function runGame () {
	const seed = 1002;
	// Connect to browser DOM for display
	g.createDisplay({
		width: 60,
		height: 30,
		fontSize: 20,
		fontFamily: "Fix15MonoBold" // alternatives: "AppleII" or "White Rabbit"
	});
	// Build the game world
	// const level = g.createLevel({ map: { type: 'digger', walls: true } });
	g.createLevels([
		'town',
		{ levelTypeKey: 'dungeon', repeat: 7 },
		'docks',
		'gizmo',
	], seed);
	const bottomLevel = g.levels[g.levels.length - 1];
	setupMachinery(bottomLevel);
	const topLevel = g.levels[0];
	// Create pcs, npcs, items
	createPlayerCharacter(topLevel);
	generateCrates(topLevel, 3);

	// "highlight" some parts of the town
	const sunstone = topLevel.items.find((item) => { return item.type === 'sunstone'; });
	topLevel.discoverCircle(sunstone.x, sunstone.y, 5);
	const stairs = topLevel.props.find((prop) => { return prop.type === 'stairsDown'; });
	topLevel.discoverCircle(stairs.x, stairs.y, 3);
	// Start the game
	g.print('A mysterious, pale dwarf tells you there is a powerful sunstone on this floor that is damaged and needs to be taken to the bottom floor for safety.', 'plot');
	g.print('He offers to pay you a large sum of gold when your quest is complete.', 'plot', 100);
	g.print('> Move with your favorite movement keys, and use things with Enter. <', 'tip', 200);
	g.start();
	console.log('The Game:', g);

}

g.ready(runGame);
