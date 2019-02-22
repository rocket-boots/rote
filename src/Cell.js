class Cell {
	constructor(options = {}) {
		this.character = options.character || ' ';
		this.discovered = false;
		this.color = '#777';
		this.background = '#222';
		this.passability = false; // TODO: handle this different?
	}

	// Gets

	getPassability() { // TODO: update this
		return (this.character === '.');
	}

	getCharacter() {
		return this.character;
	}

	getForegroundColor() {
		return (this.discovered) ? this.color : '#000';
	}

	getBackgroundColor() {
		return (this.discovered) ? this.background : '#000';
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
