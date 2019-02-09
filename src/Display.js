const ROT = require('rot-js');

class Display {
	constructor(options = {}) {
		options = { width: 60, height: 30, ...options };
		this.width = null;
		this.height = null;
		this.center = {};
		this.setDimensions(options.width, options.height);

		this.id = options.id || 'display';
		this.rotDisplay = new ROT.Display(options); // , layout:"term"});
		this.displayContainer = null;
		this.elt = null
		this.cameraTarget = null;
		this.setupElements();
	}

	setDimensions(x, y) {
		this.width = x;
		this.height = y;
		this.center.x = Math.round(x/2);
		this.center.y = Math.round(y/2);
	}

	setupElements() {
		this.displayContainer = document.getElementById(this.id);
		this.elt = this.rotDisplay.getContainer(); // canvas
		this.appendToElement(this.elt);
	}

	appendToElement(elt) {
		this.displayContainer.appendChild(elt);
	}

	setCameraTarget(cameraTarget) {
		if (!cameraTarget) {
			console.warn("No target", cameraTarget);
			return false;
		}
		if (typeof cameraTarget.x !== 'number' || typeof cameraTarget.y !== 'number') {
			console.warn("Couldn't target", cameraTarget);
			return false;
		}
		this.cameraTarget = cameraTarget;
		return true;
	}

	clear() {
		this.rotDisplay.clear();
	}

	draw(x, y, character, fgColor, bgColor) {
		if (this.cameraTarget) {
			x += (this.center.x - this.cameraTarget.x);
			y += (this.center.y - this.cameraTarget.y);
		}
		return this.rotDisplay.draw(x, y, character, fgColor, bgColor);
	}
}

module.exports = Display;