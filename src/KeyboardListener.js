const DIRECTION8 = {
	'UP': 0, 'UP-RIGHT': 1,
	'RIGHT': 2, 'DOWN-RIGHT': 3,
	'DOWN': 4, 'DOWN-LEFT': 5,
	'LEFT': 6, 'UP-LEFT': 7
};
const DIRECTION4 = { 'UP': 0, 'RIGHT': 1, 'DOWN': 2, 'LEFT': 3 };
const DIRECTION4_ARRAY = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

const USED_KEYS = ['i', 't', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const KEY_MAP = {
	"9":	"TAB",
	"13":	"ENTER",
	"27":	"ESC",
	"32":	"SPACE",
};
KEY_MAP[38] = 'UP'; // up
KEY_MAP[33] = 'UP-RIGHT';
KEY_MAP[39] = 'RIGHT'; // right
KEY_MAP[34] = 'DOWN-RIGHT';
KEY_MAP[40] = 'DOWN'; // down
KEY_MAP[35] = 'DOWN-LEFT';
KEY_MAP[37] = 'LEFT'; // left
KEY_MAP[36] = 'UP-LEFT';

const WASD_KEYMAP = {
	87: 'UP', // w
	65: 'LEFT', // a
	83: 'DOWN', // s
	68: 'RIGHT', // d
};
const WASD_DIAGONAL = {
	...WASD_KEYMAP,
	81: 'UP-LEFT', // q
	69: 'UP-RIGHT', // e
	90: 'DOWN-LEFT', // z
	67: 'DOWN-RIGHT', // c
};
const VI_KEYMAP = {
	72: 'LEFT', // h
	74: 'DOWN', // j
	75: 'UP', // k
	76: 'RIGHT', // l

};
const VI_DIAGONAL = {
	...VI_KEYMAP,
	89: 'UP-LEFT', // y
	85: 'UP-RIGHT', // u
	66: 'DOWN-LEFT', // b
	78: 'DOWN-RIGHT', // n
};


const UNSPECIFIED_STATE = 'UNSPECIFIED';

class KeyboardListener {
	constructor(options = {}) {
		this.callbacks = {};
		this.isListening = false;
		this.state = options.state || UNSPECIFIED_STATE;
		this.autoStart = (options.autoStart === undefined) ? false : Boolean(options.autoStart);
	}

	setState(state = UNSPECIFIED_STATE) {
		this.state = state.toString();
	}

	on(state, key, callback) {
		// key can be a keyCode or a keyType like 'DIRECTION'
		this.callbacks[state + '_' + key] = callback;
		if (this.autoStart) {
			this.start();
		}
	}
	
	off(state, key, callback) {
		// TODO: remove callback
		// TODO: if no more callbacks then stop
	}

	getKeyMap() {
		let keyMap = { ...KEY_MAP };
		// TODO: variations based on options selected
		keyMap = { ...keyMap, ...WASD_DIAGONAL, ...VI_DIAGONAL };
		return keyMap;
	}

	handleEvent(e) {
		const keyMap = this.getKeyMap();
		const { keyCode, key } = e;
		const isKeyUsed = USED_KEYS.includes(key) || (keyCode in keyMap);

		if (!isKeyUsed) {
			console.log('Keyboard handleEvent - unaccounted for key:', key, keyCode);
			return;
		}
		e.preventDefault();

		// Lookup key name and direction
		const keyName = keyMap[keyCode] || key;
		const direction = DIRECTION8[keyName];
		// console.log('handleEvent', e, keyName, keyCode, direction);

		// Callbacks
		if (direction !== undefined) {
			const typeCallback = this.callbacks[this.state + '_DIRECTION'];
			if (typeCallback) {
				typeCallback(keyName, keyCode, direction);
			}
		}
		const callback = this.callbacks[this.state + '_' + keyName];
		// console.log(this.state + '_' + keyName, callback);
		if (callback) {
			callback(keyName, keyCode, direction);
		}
	}

	start() {
		if (this.isListening) {
			return;
		}
		window.addEventListener('keydown', this);  // pass this; the `handleEvent` will be used
		this.isListening = true;
	}

	stop() {
		// TODO: remove event listener
	}
}

module.exports = KeyboardListener;
