const ROT = require('rot-js');
const Game = require('./Game');
const Item = require('./Item');
const Map = require('./Map');
const Actor = require('./Actor');
const Level = require('./Level');
const ready = require('./ready');

const rote = {
    ROT,
    Game, Level, Map, Item, Actor,
    ready
};

if (window) {
    window.rote = rote;
}

module.exports = rote;
