# Development Plan rote.js

## TO DO

### Tutorials

- [ ] Create more guides, tutorials, etc.

### Gameplay

- [x] Look around action: show nearby things
- [ ] Basic FOV http://ondras.github.io/rot.js/manual/#fov
- [ ] Basic lighting http://ondras.github.io/rot.js/manual/#lighting
- [ ] Auto-Time-Advance
- [ ] States for items, with different colors or characters
- [ ] Inventory open/close (e.g., chests)
- [x] Basic bump combat
- [x] Hero health, death
- [ ] Basic 8-dir ranged combat
- [ ] FOV based on environment
- [ ] Lighting system (allows hiding, stealth)
- [ ] Blocks (`#`, `%`) as entities
- [ ] Background (blocks? void?)
- [ ] Action-duration scheduler - http://ondras.github.io/rot.js/manual/#timing
- [ ] Status effects: give (monsters, abilities)
- [ ] Status effects: get (they do things)
- [ ] Different AI behaviors
- [ ] Item identification
- [ ] Level state
- [ ] Mining action on blocks
- [ ] XP
- [ ] Hero AI mode (auto-exploring)

### UI

- [ ] Hero Inventory UI
- [ ] Character sheet
- [ ] Options menu
- [ ] Mouse capabilities
- [ ] Zoom map
- [ ] Allow text input via input text field in Console

### QoL

- [ ] Save/Loading
- [ ] Key re-mapping

### Level Generation

- [ ] Base seed
- [ ] Level/map seeds (added to base seed)
- [ ] Static map seeds
- [ ] Maze http://ondras.github.io/rot.js/manual/#map/maze
- [ ] Cellular http://ondras.github.io/rot.js/manual/#map/cellular
- [ ] Chance-based (%) generation for items, props
- [ ] Chance-based (%) monsters
- [ ] Weighted generation for items, props
- [ ] Moddable level (map) generation
- [ ] Doors (props), logical door placement

### Moddable

- [ ] Moddable actor/hero/monster stats
- [ ] Moddable Combat system
- [ ] Moddable Magic system
- [ ] Advanced state system with moddable enter/leave methods
- [ ] Chunking levels, Zones

### Beauty

- [ ] Graphics - http://ondras.github.io/rot.js/manual/#tiles
- [ ] Animation loop
- [ ] Animation for combat
- [ ] Smooth screen centering
- [ ] Sound effects
- [ ] Music

### Tech

- [ ] Remove runestar demo from repo
- [ ] Engine work
- [ ] Option for using as an ES module
- [ ] Optimize webpack build size

## DONE

### Pedro Demo

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

### Assorted

- [x] Screen-centering
- [x] Alternate movement (8-directional vi: hjkl+yubn, 8-directional wasd+qezc)
- [x] Cell data structure
- [x] Fog of war / exploration
- [x] Basic circular FOV
- [x] Basic State system tied to keyboard controls
- [x] Console improvements
- [x] Props (extend Items)
- [x] Data-based level generation
- [x] Data-based monster generation
- [x] Data-based item generation
- [x] Data-based props generation
- [x] Upgrade Pedro to 0.3.0
