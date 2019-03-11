class Cell {
	constructor(options = {}) {
		this.character = options.character || ' ';
		this.discovered = false;
		this.color = options.color || '#777';
		this.background = options.background || '#222';
		this.passability = false; // TODO: handle this different?
	}

	// Gets

	getPassability() { // TODO: update this
		return (this.character === '.');
	}

	getCharacter() {
		return this.character;
	}

	getForegroundColor(inView = true) {
		if (!this.discovered) {
			return '#000';
		}
		return (inView) ? this.color : '#232120';
	}

	getBackgroundColor(inView = true) {
		if (!this.discovered) {
			return '#000';
		}
		return (inView) ? this.background : '#111010';
	}

	// Sets

	setCharacter(char) {
		this.character = char;
	}

	discover() {
		this.discovered = true;
	}
}

module.exports = Cell;
