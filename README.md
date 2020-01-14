# rote.js

_**RO**guelike **T**oolkit, **E**xtended_ -- a library containing tools to help make a [traditional Rogue-like](http://www.roguebasin.com/index.php?title=Berlin_Interpretation) game; built off of the wondeful [rot.js toolkit](https://github.com/ondras/rot.js) by ondras.

Current codebase is in an alpha stage, so the code and the [development plan](/docs/development-plan.md) could change without warning. Everything should be usable right now, but don't expect the formats and methods to remain the same between versions.

## How to Use

### (1) Get rote's Javascript

Simply download [one of the distribution builds (a single `js` file) from the `dist` folder](tree/master/dist).

*OR* if you want to roll your own, you should be able to do `npm install rocket-boots/rote#master` if you're using node. If you just want to get all the code and do whatever you want with it, just clone or download the latest code, or [download the released versions](releases).

### (2) Include in your project

For HTML/webpage-based games, just include the rote code before your game code, and a `rote` global object (a.k.a., `window.rote`) will be created.

Example HTML:
```html
<script src="rote-0.3.0.js"></script>
<script src="my-awesome-roguelike.js"></script>
...
<section id="display"></section>
<section id="console"></section>
```

Take a look at what `rote` contains in your browser's F12 console with `console.log(rote);`. You'll notice that `ROT` is entirely contained in it, so you can take advantage of all the great features it offers.

### (3) Create your game

The global `rote` object contains a `Game` class, among others. To make your game, just do this inside you `my-awesome-roguelike.js` file:

```js
const game = new rote.Game({
   id: 'display', // which element should be used for the display
   consoleId: 'console', // which element should be used for the game's log
   fontFamilies: ['Fix15MonoBold'], // which optional fonts from the css need to be loaded
   data: { // all the data - either as objects right in the js, or strings to their json files
      monsters: 'data/monsters.json',
      items: 'data/items.json',
      props: 'data/props.json',
      levels: 'data/levels.json',
      dungeon: 'data/dungeon.json',
      abilities: 'data/abilities.json',
      playlist: 'data/playlist.json'
   }
});

console.log(game); // In your console you drill down and can check that all your data is there
```

### (4) Make the data

A basic game can largely be defined entirely by `json` data.

* `monsters.json` defines your monster types
* `items.json` defines all item types
* `props.json` defines all props (items that aren't picked up)
* `levels.json` defines all the levels, and which monsters, items, and props that will be found on each
* `dungeon.json` contains an array of levels, allowing repeating level types
* `abilities.json` determines that types of special abilities a hero can use
* `playlist.json` is an array of URLs to songs

Each `json` file should contain an object containing one property, named the same as the file, e.g., `monsters.json` contains `{ "monsters": { } }`. Dungeon and playlist are arrays, but all others should be an object with unique keys for each _type_ of thing that's being defined. At a minimum you should have one level defined, and have that be in the dungeon's array.

Examples of this data (for v0.2.0) can be seen in https://github.com/deathraygames/runestar-origins/tree/master/data. These formats are likely to change between versions.


### (5) Start it up

```js
function createPlayerCharacter(level) {
	const { x, y } = level.findRandomFreeCell();
	game.createHero({ x, y, name: 'hero', faction: 'hero' });
}

rote.ready(() => { // Runs when everything is loaded: DOM content, json data, fonts
   // Make a random seed number if your dungeon should be random
   const seed = rote.random.makeSeed();
   // Connect to browser DOM for display
   game.createDisplay({
      width: 60,
      height: 30,
      fontSize: 20,
      fontFamily: 'Fix15MonoBold' 
   });
   // Build the game world
   const levels = game.createLevels(game.data.dungeon, seed);
   // Create player character on the first level
   createPlayerCharacter(levels[0]);
   // Create any extra npcs, items, or make modifications
   // ...
   // Start the game
   game.start();
});
```

## Definitions

In the code you'll see these words:

- Actor - a "character" in the game, e.g. Player Character, NPC
- Block
- Cell - a node/space/coordinate on the map's grid; located by a unique x,y
- Character - the letter or punctuation used to represent an item, actor, etc.
- Item - an object of some sort that can be picked up and dropped
- Level - one "floor" of a dungeon
- Map
- Prop - a permanent/semi-permanent fixture in the map, such as a door, podium, etc.

## Demos

### Pedro

Pedro is a simple demo containing all of the functionality from the [Rot.js tutorial](http://www.roguebasin.roguelikedevelopment.org/index.php?title=Rot.js_tutorial). Less than 100 lines of javascript (most of it json data), ~27 lines of html, and ~75 lines of css.

   * Playable: https://rocket-boots.github.io/rote/demos/pedro/
   * Uses rote v0.3.0
   * [View the code in the demos folder](demos/pedro/)

### Runestar: Origins

Runestar is the first fully playable game made with rote (v0.2.0). It was created as part of [7DRL 2019](https://itch.io/jam/7drl-challenge-2019).

   * Repo: https://github.com/deathraygames/runestar-origins
   * Uses rote v0.2.0

## Future Development

Development will likely be slow and tied to 7DRL competitions, but there is still a [rough development plan](/docs/development-plan.md). 

Source code is in the `src` folder, and it organized by individual classes (capitalized filenames), and utilities (e.g. `random`, `geometer`). Webpack is used to put it all together into single `js` files named by version (see `dist` folder).

### Dependencies

A design goal is to keep the

* **rot.js** is the primary dependency and is used throughout the library
* **fontfaceobserver** is used to monitor when a webfont is loaded
* **webpack** and webpack-cli are used only for development to combine all the `js` files into a single file

### Want to contribute?

Just create issues and submit pull requests.

## Other Resources for Web Roguelike Development

* A few great free-to-use fonts: https://github.com/deathraygames/runestar-origins/tree/master/fonts
   * Fix15Mono-Bold from Allure (SIL Open Font License) and LambdaHack - nicely square-shaped, so is great for ASCII tiles
   * Apple II - retro pixelated 8x8 style
   * White Rabbit by Matthew Welch
