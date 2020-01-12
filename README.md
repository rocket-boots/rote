# rote.js

_**RO**guelike **T**oolkit, **E**xtended_ -- a library containing tools to help make a [traditional Rogue-like](http://www.roguebasin.com/index.php?title=Berlin_Interpretation) game; built off of the wondeful [rot.js toolkit](https://github.com/ondras/rot.js) by ondras.

Current codebase is in an alpha stage, so the development plan and the code could change
without warning, but it should be usable.

## How to Use

### (1) Get rote's Javascript

* Download [one of the distribution builds](tree/master/dist) (a single `js` file)
* or `npm install rocket-boots/rote#master`
* or get all the code and do whatever you want with it
   * Clone or downlad the latest code
   * [Download the released versions](releases)

### (2) Include in your project

For HTML/webpage-based games, just include the rote code before your game code...

Example HTML:
```html
<script src="rote-0.3.0.js"></script>
<script src="my-awesome-roguelike.js"></script>
...
<section id="display"></section>
```

### (3) Create your game

In the browser the `rote` object will be a global object (i.e., `window.rote`) which contains a `Game` class, among others. To make your game, just do...

```js
const game = new rote.Game({
   id: 'display', // which element should be used for the display
   consoleId: 'console', // which element should be used for the game's log
   data: {
      monsters: 'data/monsters.json',
      items: 'data/items.json',
      props: 'data/props.json',
      levels: 'data/levels.json',
      abilities: 'data/abilities.json',
      playlist: 'data/playlist.json',
      dungeon: 'data/dungeon.json'
   } 
});
```
### (4) Start it up

```js
const fontFamily = 'Fix15MonoBold'; // good alternatives: "AppleII" or "White Rabbit"

rote.ready(() => { // Runs when everything is loaded: DOM content, json data, fonts
   // Make a random seed number if your dungeon should be random
   const seed = rote.random.makeSeed();
   // Connect to browser DOM for display
   game.createDisplay({
      width: 60,
      height: 30,
      fontSize: 20,
      fontFamily: fontFamily 
   });
   // Build the game world
   game.createLevels(game.data.dungeon, seed);
   ...
   // Create player character
   ...
   // Create npcs, items
   ...
	// Start the game
	g.start();
}, [fontFamily]);
```

## Definitions

In the code you'll see these words:

- Actor - a "character" in the game, e.g. Player Character, NPC
- Block
- Cell - a node/space/coordinate on the map's grid; located by a unique x,y
- Character - the letter or punctuation used to represent an item, actor, etc.
- Item
- Level
- Map
- Prop - a permanent/semi-permanent fixture in the map, such as a door, podium, etc.

## Demos

### Pedro

Pedro is a simple demo containing all of the functionality from the [Rot.js tutorial](http://www.roguebasin.roguelikedevelopment.org/index.php?title=Rot.js_tutorial). Only ~50 lines of javascript, ~25 lines of html, and ~40 lines of css.

   * Playable: https://rocket-boots.github.io/rote/demos/pedro/
   * Uses rote v0.3.0
   * [View the code in the demos folder](demos/pedro/)

### Runestar: Origins

Runestar is the first fully playable game made with rote (v0.2.0). It was created as part of [7DRL 2019](https://itch.io/jam/7drl-challenge-2019).

   * Repo: https://github.com/deathraygames/runestar-origins
   * Uses rote v0.2.0

## Development

Development will likely be slow and tied to 7DRL competitions, but there is still a [rough development plan](/docs/development-plan.md). 

Source code is in the `src` folder, and it organized by individual classes (capitalized filenames), and utilities (e.g. `random`, `geometer`). Webpack is used to put it all together into single `js` files named by version (see `dist` folder).

### Dependencies

* rot.js is the primary dependency and is used throughout the library
* fontfaceobserver is used to monitor when a webfont is loaded
* webpack and webpack-cli are used only for development to combine all the `js` files into a single file

### Want to contribute?

Just create issues and submit pull requests.

## Other Resources for Web Roguelike Development

* A few great free-to-use fonts: https://github.com/deathraygames/runestar-origins/tree/master/fonts
   * Fix15Mono-Bold from Allure (SIL Open Font License) and LambdaHack - nicely square-shaped, so is great for ASCII tiles
   * Apple II - retro pixelated 8x8 style
   * White Rabbit by Matthew Welch
