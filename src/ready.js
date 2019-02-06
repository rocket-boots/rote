function ready(fn) {
    document.addEventListener("DOMContentLoaded", () => {
		fn();
	});
}

module.exports = ready;
