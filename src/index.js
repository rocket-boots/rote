const ROT = require('rot-js');
const Game = require('./Game');
const Item = require('./Item');
const Map = require('./Map');
const Actor = require('./Actor');
const Prop = require('./Prop');
const Level = require('./Level');
const Display = require('./Display');
const random = require('./random');
const ready = require('./ready');

const rote = {
    ROT,
    Game, Level, Map, Item, Prop, Actor, Display,
    random,
    ready
};

if (window) {
    window.rote = rote;
}

module.exports = rote;
