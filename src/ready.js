const FontFaceObserver = require('fontfaceobserver');

function domReady() {
	return new Promise((resolve, reject) => {
		if (document.readyState === "complete" || document.readyState === "loaded") {
			resolve();
		} else {
			document.addEventListener("DOMContentLoaded", () => {
				resolve();
			});
		}
	});
}

function ready(fn, fonts = []) {
	if (fonts.length > 0) {
		// TODO: allow multiple fonts ~ https://github.com/bramstein/fontfaceobserver
		const font = new FontFaceObserver(fonts[0]);
		font.load()
			.then(() => { domReady().then(fn); })
			.catch(() => { console.warn('error loading font'); domReady().then(fn); });
		return;
	}
	domReady().then(fn);
}

module.exports = ready;
