# rote.js

_**RO**guelike **T**ools, **E**xtended_ -- a library containing tools to help make a Rogue-like game; built off of [rot.js](https://github.com/ondras/rot.js).

## Development Plan

### Demo
- [x] Rot.js tutorial, part 1
- [x] Rot.js tutorial, part 2
- [x] Level work
- [x] Basic Scheduler
- [x] Rot.js tutorial, part 3

[Further improvements](http://www.roguebasin.com/index.php?title=Rot.js_tutorial,_part_3):

- [x] "Player can crash the game by moving onto Pedro's cell. Not only this is currently allowed, but it also disrupts Pedro's pathfinding (which expects the path to be at least two cells long)." _(doesn't seem to be happening in this implementation)_
- [x] "The Game.map structure should probably store positions of beings (player, Pedro) as well."
- [x] "It would be comfortable for users to increase the set of allowed navigation keys (number keys, vi keys)."
- [ ] "When a box is inspected, its appearance may change (to make it easier for player to distinguish between visited and unvisited boxes)."

### Better Demo

- [x] Screen-centering
- [x] Alternate movement (8-directional vi: hjkl+yubn, 8-directional wasd+qezc)
- [x] Cell data structure
- [x] Fog of war / exploration
- [x] Basic circular FOV
- [ ] FOV based on environment
- [ ] Lighting

### Actual game

- [ ] Engine work
- [ ] Animation loop
- [ ] Smooth screen centering
- [ ] Animation for combat
- [ ] Console improvements
- [ ] Level travel
- [ ] Hero health, death
- [ ] Level/map seeds
- [ ] Doors
- [ ] Data-based level generation
- [ ] Data-based monster generation
- [ ] Data-based item generation
- [ ] Key re-mapping
- [ ] Hero Inventory UI
- [ ] Chunking levels
- [ ] Zone work
- [ ] Action-duration scheduler
- [ ] Combat system, moddable
- [ ] Magic system, moddable
- [ ] Item identification
- [ ] Hero AI mode
- [ ] Save/Loading
- [ ] Character sheet
- [ ] Optimize webpack build size
