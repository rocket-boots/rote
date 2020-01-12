var g = new rote.Game({
	id: 'display',
	consoleId: 'console',
	keyboard: 'multi-move',
	fontFamilies: ['Fix15MonoBold'],
	data: {
		"monsters": {
			"pedro": {
				"name": "Pedro",
				"character": "P",
				"color": "#f44",
				"aggro": 100,
				"sightRange": Infinity
			}
		},
		"items": {
			"amulet": {
				"name": "Amulet of Winning",
				"character": "=",
				"color": "#ff0"
			}
		},
		"props": {
			"crate": {
				"name": "crate",
				"character": "*",
				"inventorySize": 1,
				"actions": {
					"open": {
						"message": "You open the crate and find nothing."
					}
				}
			}
		},
		"dungeon": ["PedroDungeon"], // Just one level in the dungeon
		"levels": {
			"PedroDungeon": {
				"map": {
					"type": "digger",
					"walls": true
				},
				"monsterSpawn": 1, // number of total monsters in this level
				"monsters": [
					{ "type": "pedro", "weight": 1 }
				],
				"props": [
					{ "type": "crate", "quantity": 9 },
					{
						"type": "crate",
						"quantity": 1,
						// overrides of the normal crate type
						// TODO: create items and add to prop when there is 'contains'
						"contains": [{ "type": "amulet" }],
						"actions": {
							"open": {
								"message": "You open the crate and find the Amulet of winning!"
							}
						}
					}
				]
			},
		}
	}
});

const displayOptions = {
	width: 60,
	height: 30,
	fontSize: 20,
	fontFamily: "Fix15MonoBold" // alternatives: "AppleII" or "White Rabbit"
};

function createPlayerCharacter(level) {
	const { x, y } = level.findRandomFreeCell();
	g.createHero({ x, y, name: 'hero', faction: 'hero' });
}

g.ready(() => { // Runs after the DOM is loaded and the game loads all the data and fonts it needs
	// Connect to browser DOM for display
	g.createDisplay(displayOptions);
	// Build the game world (automatically creating monsters, props, items based on data)
	const levels = g.createLevels(g.data.dungeon);
	const oneLevel = levels[0];
	// Create custom pcs, npcs, items, and then start
	createPlayerCharacter(oneLevel);
	g.start();
	g.print('Move with your favorite movement keys, open crates with Enter, and avoid Pedro.')
});
