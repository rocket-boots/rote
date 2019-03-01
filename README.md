# rote.js

_**RO**guelike **T**ools, **E**xtended_ -- a library containing tools to help make a Rogue-like game; built off of [rot.js](https://github.com/ondras/rot.js).

Current codebase is in an alpha stage. See development plan below. The plan and the code will change
without warning at this stage.

## Demos

* "Pedro" - A demo containing all of the Rot.js tutorial functionality
   * https://rocket-boots.github.io/rote/demos/pedro/
   * Uses rote v0.1.0
   * Only 50 lines of javascript, 25 lines of html, and less than 40 lines of css
   * [View the code](demos/pedro/)
* "Crypt" - _work in progress_
   * https://rocket-boots.github.io/rote/demos/crypt/
   * Uses latest version

## Definitions (WIP)

In the code you'll see these words:

- Actor - a "character" in the game, e.g. Player Character, NPC
- Block
- Cell - a node/space/coordinate on the map's grid; located by a unique x,y
- Character - the letter or punctuation used to represent an item, actor, etc.
- Item
- Level
- Map
- Prop - a permanent/semi-permanent fixture in the map, such as a door, podium, etc.

## Development Plan

### Demo

- [x] Rot.js tutorial, part 1
- [x] Rot.js tutorial, part 2
- [x] Level work
- [x] Basic Scheduler
- [x] Rot.js tutorial, part 3

Other improvements:

- [x] Screen-centering
- [x] Alternate movement (8-directional vi: hjkl+yubn, 8-directional wasd+qezc)
- [x] Cell data structure
- [x] Fog of war / exploration
- [x] Basic circular FOV
- [x] Basic State system tied to keyboard controls

[Further improvements](http://www.roguebasin.com/index.php?title=Rot.js_tutorial,_part_3):

- [x] "Player can crash the game by moving onto Pedro's cell. Not only this is currently allowed, but it also disrupts Pedro's pathfinding (which expects the path to be at least two cells long)." _(doesn't seem to be happening in this implementation)_
- [x] "The Game.map structure should probably store positions of beings (player, Pedro) as well."
- [x] "It would be comfortable for users to increase the set of allowed navigation keys (number keys, vi keys)."
- [ ] "When a box is inspected, its appearance may change (to make it easier for player to distinguish between visited and unvisited boxes)."

### Actual game

- [x] Console improvements
- [ ] Props (extend Items)
- [ ] Blocks
- [ ] Options menu
- [ ] Engine work
- [ ] Action-duration scheduler
- [ ] Hero Inventory UI
- [ ] Data-based level generation
- [ ] Data-based monster generation
- [ ] Data-based item generation
- [ ] Data-based props generation
- [ ] Status effects
- [ ] Basic bump combat
- [ ] Basic 8-dir ranged combat
- [ ] Hero health, death
- [ ] Different AI behaviors
- [ ] Level travel
- [ ] Level/map seeds
- [ ] Doors (props), logical door placement
- [ ] States for items, with different colors or characters
- [ ] Character sheet
- [ ] Save/Loading
- [ ] Animation loop
- [ ] Animation for combat
- [ ] FOV based on environment
- [ ] Mouse capabilities
- [ ] Key re-mapping
- [ ] Lighting system (allows hiding, stealth)
- [ ] Smooth screen centering
- [ ] Zoom map
- [ ] Chunking levels, Zones
- [ ] Moddable Combat system
- [ ] Moddable Magic system
- [ ] Item identification
- [ ] Optimize webpack build size
- [ ] Sound effects
- [ ] Music
- [ ] Hero AI mode (auto-exploring)
- [ ] Advanced state system with moddable enter/leave methods
- [ ] Allow text input via input text field in Console
