# Runestar: Origins

Based on the _Dwarves-in-Space_ setting from the [Runestar micro-RPG](http://deathraygames.com/tabletop-roleplaying/runestar/RuneStar_v1.pdf) ([pdf](http://deathraygames.com/tabletop-roleplaying/runestar/RuneStar_v1.pdf), [rpggeek](https://rpggeek.com/rpgitem/190198/runestar)), this game is meant to tell the tale of the origins of the space-faring society through a dungeon-delving Rougelike.

This game is beginning as a 7DRL game, starting from the rote-js "Pedro" demo, and will include many modifications to the rote-js libraries along the way.

* Play it: https://rocket-boots.github.io/rote/demos/runestar/

## Planned Features for 7DRL

### Minimal Features for a "Game" (Essentials)

#### Dungeon

- [x] Data-based level configuration
- [x] Stairs
- [x] Ability to go down
- [x] Game seed that is used to make multiple levels with different layouts
- [x] 10 Levels

#### Monsters

- [x] monster data
- [x] Random monster generation based on data
- [x] Enemy move-to based on sight range / path range
- [x] Stop actors from occupying the same space

#### Basic Combat

- [x] Hit points
- [x] Death check for actors
- [x] Simple Bump combat (-1 HP per bump)
- [x] Wait with space or \`/~
- [x] Passable corpses

#### Sunstone

- [x] Sunstone item (data)
- [x] Pedestal prop/item
- [x] Item generation for level
- [x] Ability to pick up items
- [x] Ability to drop item
- [x] Intro text to explain plot
- [x] Ability to pick item off of a prop
- [ ] End-game trigger when placing item onto extractor

- [ ] Spreading fire/explosion (⍦⛆⋀∭※) once the end-game is triggered

### Desired Wishlist (Things that will make the game more complete)

#### UI

- [ ] Display hitpoints
- [ ] Show level number / progress on the UI
- [ ] Display inventory on right
- [ ] Display maneuvers on right
- [ ] Allow for multi-key commands (e.g. (t)hrow -> number for selection)

#### Combat System

- [ ] Melee points (positioning, strike)
- [ ] Balance points (footwork)
- [ ] Endurance points
- [ ] To-Hit, Crit, Dodge, Soak percentages
- [ ] Actions:
    - [ ] Move
    - [ ] Attack ("bump" / move onto enemy)
	- [ ] Wait (Space)
        - [ ] Recovery - gain +1 points in all catagories if waiting and not attacked
	    - [ ] Survey - gain info on enemies if waiting and not attacked
- [ ] Active choice:
    - [ ] Lunge/Strike - costs melee, does extra damage
	- [ ] Spin - costs balance, switches positions with enemy
    - [ ] Feint - costs: melee and no damage, if you "hit" than you gain 1 melee point, enemy loses 1 melee or balance point
	- [ ] Push - costs endurance but attacks push (extra damage if nowhere to push to?)
	- [ ] Reprise - costs melee, but does an extra attack on enemies that retreat (if no retreat, melee is still lost)
	- [ ] Insistence - costs endurance, but bypasses parries (if no parry, end is still lost)
	- [ ] Sweep - cost: no damage and endurance, but knocks back all enemies around
- [ ] Reflex (passive) choice:
    - [ ] Parry\* -- costs Melee to avoid attack (requires a weapon)
	- [ ] Dodge\* -- costs Balance to avoid attack (requires one free space)
	- [ ] Endure\* -- costs Endurance to absorb the hit
	- [ ] Retreat -- moves backwards to avoid attack
	- [ ] Counter-Strike -- attack, costs Melee
	- [ ] Clear -- moves back attacker, costs endurance
	- [ ] Stonefeet -- costs Endurance to avoid movement effects
- [ ] "Reshuffle"?

#### Leveling

- [x] Ability to go up stairs
- [ ] "Level up" - gain +1 point and a new action for each level that is explored
- [ ] Show description of level when going up/down

#### Replayability

- [x] Lighting / visibility range based on sunstone
- [ ] When player dies, the sunstone is dropped and they can play a new character to pick it up
- [ ] Use sunstone to heal HP at cost of energy, decreasing it's brightness

#### Extra Combat

- [x] Handle pushing past if on same faction moving past
- [x] Monster wandering
- [x] Fleeing AI (just random for now)
- [ ] Random order for actions

#### Dungeon & Assorted Fun

- [ ] Fragility for the sunstone, damaged when dropped, when broken, spawn fire
- [ ] Bottle - Healing potion container
- [ ] Refill bottle at alembic
- [ ] Weights for item and prop generation
- [ ] New items for each level (even if they don't do anything yet)
- [ ] Escape ship - fixed map element added onto level 9 or 10
- [x] Starting level ("Town") - partially explored
- [ ] Make machinery not passable but destructable

#### States

- [ ] Title screen
- [ ] Win / End of game screen
- [ ] Death screen
- [ ] Menu button and options, including links

### Far-fetched Wishlist

Unlikely to get to these, but they would be great:

#### Assorted

- [ ] Character sheet
- [ ] Magic points
- [ ] Spells
- [ ] Scrolls
- [ ] Mining ability and pickax
- [ ] Animations for actions
- [ ] Multiple classes at the start: Legionnaire, Etcher, Sunstorm, Metallurgeon, Pirate, Navigator
- [ ] Skills
- Other things from the [rote readme list](../../README.md)

#### Extra Combat

- [ ] Fix pushing past; allow pushes based on relative size and relative authority if in the same faction
- [ ] Wound effects for when out of HP
- [ ] Ranged weaponry
- [ ] Higher miss chance attacking diagnol?

#### Dungeon

- [ ] Different level map generation for more uniqueness
- [ ] Tutorital / practice area of starting level
- [ ] Wall decoration (weird characters replacing "#" for some walls)
- [ ] "clearing" property for finding open spaces when placing props, items

#### Story

- [ ] NPC that acts as your quest-giver
- [ ] NPCs on various levels that give story/lore info
- [ ] Books and notes that give story/lore info