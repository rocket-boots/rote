/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
 * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
 */
const FRAC = 2.3283064365386963e-10; /* 2^-32 */
class RNG {
    constructor() {
        this._seed = 0;
        this._s0 = 0;
        this._s1 = 0;
        this._s2 = 0;
        this._c = 0;
    }
    getSeed() { return this._seed; }
    /**
     * Seed the number generator
     */
    setSeed(seed) {
        seed = (seed < 1 ? 1 / seed : seed);
        this._seed = seed;
        this._s0 = (seed >>> 0) * FRAC;
        seed = (seed * 69069 + 1) >>> 0;
        this._s1 = seed * FRAC;
        seed = (seed * 69069 + 1) >>> 0;
        this._s2 = seed * FRAC;
        this._c = 1;
        return this;
    }
    /**
     * @returns Pseudorandom value [0,1), uniformly distributed
     */
    getUniform() {
        let t = 2091639 * this._s0 + this._c * FRAC;
        this._s0 = this._s1;
        this._s1 = this._s2;
        this._c = t | 0;
        this._s2 = t - this._c;
        return this._s2;
    }
    /**
     * @param lowerBound The lower end of the range to return a value from, inclusive
     * @param upperBound The upper end of the range to return a value from, inclusive
     * @returns Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
     */
    getUniformInt(lowerBound, upperBound) {
        let max = Math.max(lowerBound, upperBound);
        let min = Math.min(lowerBound, upperBound);
        return Math.floor(this.getUniform() * (max - min + 1)) + min;
    }
    /**
     * @param mean Mean value
     * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
     * @returns A normally distributed pseudorandom value
     */
    getNormal(mean = 0, stddev = 1) {
        let u, v, r;
        do {
            u = 2 * this.getUniform() - 1;
            v = 2 * this.getUniform() - 1;
            r = u * u + v * v;
        } while (r > 1 || r == 0);
        let gauss = u * Math.sqrt(-2 * Math.log(r) / r);
        return mean + gauss * stddev;
    }
    /**
     * @returns Pseudorandom value [1,100] inclusive, uniformly distributed
     */
    getPercentage() {
        return 1 + Math.floor(this.getUniform() * 100);
    }
    /**
     * @returns Randomly picked item, null when length=0
     */
    getItem(array) {
        if (!array.length) {
            return null;
        }
        return array[Math.floor(this.getUniform() * array.length)];
    }
    /**
     * @returns New array with randomized items
     */
    shuffle(array) {
        let result = [];
        let clone = array.slice();
        while (clone.length) {
            let index = clone.indexOf(this.getItem(clone));
            result.push(clone.splice(index, 1)[0]);
        }
        return result;
    }
    /**
     * @param data key=whatever, value=weight (relative probability)
     * @returns whatever
     */
    getWeightedValue(data) {
        let total = 0;
        for (let id in data) {
            total += data[id];
        }
        let random = this.getUniform() * total;
        let id, part = 0;
        for (id in data) {
            part += data[id];
            if (random < part) {
                return id;
            }
        }
        // If by some floating-point annoyance we have
        // random >= total, just return the last id.
        return id;
    }
    /**
     * Get RNG state. Useful for storing the state and re-setting it via setState.
     * @returns Internal state
     */
    getState() { return [this._s0, this._s1, this._s2, this._c]; }
    /**
     * Set a previously retrieved state.
     */
    setState(state) {
        this._s0 = state[0];
        this._s1 = state[1];
        this._s2 = state[2];
        this._c = state[3];
        return this;
    }
    /**
     * Returns a cloned RNG
     */
    clone() {
        let clone = new RNG();
        return clone.setState(this.getState());
    }
}
/* harmony default export */ __webpack_exports__["a"] = (new RNG().setSeed(Date.now()));


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mod", function() { return mod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clamp", function() { return clamp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "format", function() { return format; });
/**
 * Always positive modulus
 * @param x Operand
 * @param n Modulus
 * @returns x modulo n
 */
function mod(x, n) {
    return (x % n + n) % n;
}
function clamp(val, min = 0, max = 1) {
    if (val < min)
        return min;
    if (val > max)
        return max;
    return val;
}
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
}
/**
 * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
 * @param {string} template
 * @param {any} [argv]
 */
function format(template, ...args) {
    let map = format.map;
    let replacer = function (match, group1, group2, index) {
        if (template.charAt(index - 1) == "%") {
            return match.substring(1);
        }
        if (!args.length) {
            return match;
        }
        let obj = args[0];
        let group = group1 || group2;
        let parts = group.split(",");
        let name = parts.shift() || "";
        let method = map[name.toLowerCase()];
        if (!method) {
            return match;
        }
        obj = args.shift();
        let replaced = obj[method].apply(obj, parts);
        let first = name.charAt(0);
        if (first != first.toLowerCase()) {
            replaced = capitalize(replaced);
        }
        return replaced;
    };
    return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
}
format.map = {
    "s": "toString"
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromString", function() { return fromString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add_", function() { return add_; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiply", function() { return multiply; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiply_", function() { return multiply_; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interpolate", function() { return interpolate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lerp", function() { return lerp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interpolateHSL", function() { return interpolateHSL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lerpHSL", function() { return lerpHSL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomize", function() { return randomize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rgb2hsl", function() { return rgb2hsl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hsl2rgb", function() { return hsl2rgb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRGB", function() { return toRGB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toHex", function() { return toHex; });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);


function fromString(str) {
    let cached, r;
    if (str in CACHE) {
        cached = CACHE[str];
    }
    else {
        if (str.charAt(0) == "#") { // hex rgb
            let matched = str.match(/[0-9a-f]/gi) || [];
            let values = matched.map((x) => parseInt(x, 16));
            if (values.length == 3) {
                cached = values.map((x) => x * 17);
            }
            else {
                for (let i = 0; i < 3; i++) {
                    values[i + 1] += 16 * values[i];
                    values.splice(i, 1);
                }
                cached = values;
            }
        }
        else if ((r = str.match(/rgb\(([0-9, ]+)\)/i))) { // decimal rgb
            cached = r[1].split(/\s*,\s*/).map((x) => parseInt(x));
        }
        else { // html name
            cached = [0, 0, 0];
        }
        CACHE[str] = cached;
    }
    return cached.slice();
}
/**
 * Add two or more colors
 */
function add(color1, ...colors) {
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            result[i] += colors[j][i];
        }
    }
    return result;
}
/**
 * Add two or more colors, MODIFIES FIRST ARGUMENT
 */
function add_(color1, ...colors) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            color1[i] += colors[j][i];
        }
    }
    return color1;
}
/**
 * Multiply (mix) two or more colors
 */
function multiply(color1, ...colors) {
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            result[i] *= colors[j][i] / 255;
        }
        result[i] = Math.round(result[i]);
    }
    return result;
}
/**
 * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
 */
function multiply_(color1, ...colors) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            color1[i] *= colors[j][i] / 255;
        }
        color1[i] = Math.round(color1[i]);
    }
    return color1;
}
/**
 * Interpolate (blend) two colors with a given factor
 */
function interpolate(color1, color2, factor = 0.5) {
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
}
const lerp = interpolate;
/**
 * Interpolate (blend) two colors with a given factor in HSL mode
 */
function interpolateHSL(color1, color2, factor = 0.5) {
    let hsl1 = rgb2hsl(color1);
    let hsl2 = rgb2hsl(color2);
    for (let i = 0; i < 3; i++) {
        hsl1[i] += factor * (hsl2[i] - hsl1[i]);
    }
    return hsl2rgb(hsl1);
}
const lerpHSL = interpolateHSL;
/**
 * Create a new random color based on this one
 * @param color
 * @param diff Set of standard deviations
 */
function randomize(color, diff) {
    if (!(diff instanceof Array)) {
        diff = Math.round(_rng_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].getNormal(0, diff));
    }
    let result = color.slice();
    for (let i = 0; i < 3; i++) {
        result[i] += (diff instanceof Array ? Math.round(_rng_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].getNormal(0, diff[i])) : diff);
    }
    return result;
}
/**
 * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
 */
function rgb2hsl(color) {
    let r = color[0] / 255;
    let g = color[1] / 255;
    let b = color[2] / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max == min) {
        s = 0; // achromatic
    }
    else {
        let d = max - min;
        s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}
function hue2rgb(p, q, t) {
    if (t < 0)
        t += 1;
    if (t > 1)
        t -= 1;
    if (t < 1 / 6)
        return p + (q - p) * 6 * t;
    if (t < 1 / 2)
        return q;
    if (t < 2 / 3)
        return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
/**
 * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
 */
function hsl2rgb(color) {
    let l = color[2];
    if (color[1] == 0) {
        l = Math.round(l * 255);
        return [l, l, l];
    }
    else {
        let s = color[1];
        let q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
        let p = 2 * l - q;
        let r = hue2rgb(p, q, color[0] + 1 / 3);
        let g = hue2rgb(p, q, color[0]);
        let b = hue2rgb(p, q, color[0] - 1 / 3);
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
}
function toRGB(color) {
    let clamped = color.map(x => Object(_util_js__WEBPACK_IMPORTED_MODULE_0__["clamp"])(x, 0, 255));
    return `rgb(${clamped.join(",")})`;
}
function toHex(color) {
    let clamped = color.map(x => Object(_util_js__WEBPACK_IMPORTED_MODULE_0__["clamp"])(x, 0, 255).toString(16).padStart(2, "0"));
    return `#${clamped.join("")}`;
}
const CACHE = {
    "black": [0, 0, 0],
    "navy": [0, 0, 128],
    "darkblue": [0, 0, 139],
    "mediumblue": [0, 0, 205],
    "blue": [0, 0, 255],
    "darkgreen": [0, 100, 0],
    "green": [0, 128, 0],
    "teal": [0, 128, 128],
    "darkcyan": [0, 139, 139],
    "deepskyblue": [0, 191, 255],
    "darkturquoise": [0, 206, 209],
    "mediumspringgreen": [0, 250, 154],
    "lime": [0, 255, 0],
    "springgreen": [0, 255, 127],
    "aqua": [0, 255, 255],
    "cyan": [0, 255, 255],
    "midnightblue": [25, 25, 112],
    "dodgerblue": [30, 144, 255],
    "forestgreen": [34, 139, 34],
    "seagreen": [46, 139, 87],
    "darkslategray": [47, 79, 79],
    "darkslategrey": [47, 79, 79],
    "limegreen": [50, 205, 50],
    "mediumseagreen": [60, 179, 113],
    "turquoise": [64, 224, 208],
    "royalblue": [65, 105, 225],
    "steelblue": [70, 130, 180],
    "darkslateblue": [72, 61, 139],
    "mediumturquoise": [72, 209, 204],
    "indigo": [75, 0, 130],
    "darkolivegreen": [85, 107, 47],
    "cadetblue": [95, 158, 160],
    "cornflowerblue": [100, 149, 237],
    "mediumaquamarine": [102, 205, 170],
    "dimgray": [105, 105, 105],
    "dimgrey": [105, 105, 105],
    "slateblue": [106, 90, 205],
    "olivedrab": [107, 142, 35],
    "slategray": [112, 128, 144],
    "slategrey": [112, 128, 144],
    "lightslategray": [119, 136, 153],
    "lightslategrey": [119, 136, 153],
    "mediumslateblue": [123, 104, 238],
    "lawngreen": [124, 252, 0],
    "chartreuse": [127, 255, 0],
    "aquamarine": [127, 255, 212],
    "maroon": [128, 0, 0],
    "purple": [128, 0, 128],
    "olive": [128, 128, 0],
    "gray": [128, 128, 128],
    "grey": [128, 128, 128],
    "skyblue": [135, 206, 235],
    "lightskyblue": [135, 206, 250],
    "blueviolet": [138, 43, 226],
    "darkred": [139, 0, 0],
    "darkmagenta": [139, 0, 139],
    "saddlebrown": [139, 69, 19],
    "darkseagreen": [143, 188, 143],
    "lightgreen": [144, 238, 144],
    "mediumpurple": [147, 112, 216],
    "darkviolet": [148, 0, 211],
    "palegreen": [152, 251, 152],
    "darkorchid": [153, 50, 204],
    "yellowgreen": [154, 205, 50],
    "sienna": [160, 82, 45],
    "brown": [165, 42, 42],
    "darkgray": [169, 169, 169],
    "darkgrey": [169, 169, 169],
    "lightblue": [173, 216, 230],
    "greenyellow": [173, 255, 47],
    "paleturquoise": [175, 238, 238],
    "lightsteelblue": [176, 196, 222],
    "powderblue": [176, 224, 230],
    "firebrick": [178, 34, 34],
    "darkgoldenrod": [184, 134, 11],
    "mediumorchid": [186, 85, 211],
    "rosybrown": [188, 143, 143],
    "darkkhaki": [189, 183, 107],
    "silver": [192, 192, 192],
    "mediumvioletred": [199, 21, 133],
    "indianred": [205, 92, 92],
    "peru": [205, 133, 63],
    "chocolate": [210, 105, 30],
    "tan": [210, 180, 140],
    "lightgray": [211, 211, 211],
    "lightgrey": [211, 211, 211],
    "palevioletred": [216, 112, 147],
    "thistle": [216, 191, 216],
    "orchid": [218, 112, 214],
    "goldenrod": [218, 165, 32],
    "crimson": [220, 20, 60],
    "gainsboro": [220, 220, 220],
    "plum": [221, 160, 221],
    "burlywood": [222, 184, 135],
    "lightcyan": [224, 255, 255],
    "lavender": [230, 230, 250],
    "darksalmon": [233, 150, 122],
    "violet": [238, 130, 238],
    "palegoldenrod": [238, 232, 170],
    "lightcoral": [240, 128, 128],
    "khaki": [240, 230, 140],
    "aliceblue": [240, 248, 255],
    "honeydew": [240, 255, 240],
    "azure": [240, 255, 255],
    "sandybrown": [244, 164, 96],
    "wheat": [245, 222, 179],
    "beige": [245, 245, 220],
    "whitesmoke": [245, 245, 245],
    "mintcream": [245, 255, 250],
    "ghostwhite": [248, 248, 255],
    "salmon": [250, 128, 114],
    "antiquewhite": [250, 235, 215],
    "linen": [250, 240, 230],
    "lightgoldenrodyellow": [250, 250, 210],
    "oldlace": [253, 245, 230],
    "red": [255, 0, 0],
    "fuchsia": [255, 0, 255],
    "magenta": [255, 0, 255],
    "deeppink": [255, 20, 147],
    "orangered": [255, 69, 0],
    "tomato": [255, 99, 71],
    "hotpink": [255, 105, 180],
    "coral": [255, 127, 80],
    "darkorange": [255, 140, 0],
    "lightsalmon": [255, 160, 122],
    "orange": [255, 165, 0],
    "lightpink": [255, 182, 193],
    "pink": [255, 192, 203],
    "gold": [255, 215, 0],
    "peachpuff": [255, 218, 185],
    "navajowhite": [255, 222, 173],
    "moccasin": [255, 228, 181],
    "bisque": [255, 228, 196],
    "mistyrose": [255, 228, 225],
    "blanchedalmond": [255, 235, 205],
    "papayawhip": [255, 239, 213],
    "lavenderblush": [255, 240, 245],
    "seashell": [255, 245, 238],
    "cornsilk": [255, 248, 220],
    "lemonchiffon": [255, 250, 205],
    "floralwhite": [255, 250, 240],
    "snow": [255, 250, 250],
    "yellow": [255, 255, 0],
    "lightyellow": [255, 255, 224],
    "ivory": [255, 255, 240],
    "white": [255, 255, 255]
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var text_namespaceObject = {};
__webpack_require__.r(text_namespaceObject);
__webpack_require__.d(text_namespaceObject, "TYPE_TEXT", function() { return TYPE_TEXT; });
__webpack_require__.d(text_namespaceObject, "TYPE_NEWLINE", function() { return TYPE_NEWLINE; });
__webpack_require__.d(text_namespaceObject, "TYPE_FG", function() { return TYPE_FG; });
__webpack_require__.d(text_namespaceObject, "TYPE_BG", function() { return TYPE_BG; });
__webpack_require__.d(text_namespaceObject, "measure", function() { return measure; });
__webpack_require__.d(text_namespaceObject, "tokenize", function() { return tokenize; });

// EXTERNAL MODULE: ./node_modules/rot-js/lib/rng.js
var rng = __webpack_require__(0);

// EXTERNAL MODULE: ./node_modules/rot-js/lib/display/backend.js
var backend = __webpack_require__(4);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/canvas.js

class canvas_Canvas extends backend["a" /* default */] {
    constructor() {
        super();
        this._ctx = document.createElement("canvas").getContext("2d");
    }
    schedule(cb) { requestAnimationFrame(cb); }
    getContainer() { return this._ctx.canvas; }
    setOptions(opts) {
        super.setOptions(opts);
        const style = (opts.fontStyle ? `${opts.fontStyle} ` : ``);
        const font = `${style} ${opts.fontSize}px ${opts.fontFamily}`;
        this._ctx.font = font;
        this._updateSize();
        this._ctx.font = font;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
    }
    clear() {
        this._ctx.fillStyle = this._options.bg;
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    }
    eventToPosition(x, y) {
        let canvas = this._ctx.canvas;
        let rect = canvas.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
        x *= canvas.width / rect.width;
        y *= canvas.height / rect.height;
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
            return [-1, -1];
        }
        return this._normalizedEventToPosition(x, y);
    }
}

// EXTERNAL MODULE: ./node_modules/rot-js/lib/util.js
var util = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/hex.js


/**
 * @class Hexagonal backend
 * @private
 */
class hex_Hex extends canvas_Canvas {
    constructor() {
        super();
        this._spacingX = 0;
        this._spacingY = 0;
        this._hexSize = 0;
    }
    draw(data, clearBefore) {
        let [x, y, ch, fg, bg] = data;
        let px = [
            (x + 1) * this._spacingX,
            y * this._spacingY + this._hexSize
        ];
        if (this._options.transpose) {
            px.reverse();
        }
        if (clearBefore) {
            this._ctx.fillStyle = bg;
            this._fill(px[0], px[1]);
        }
        if (!ch) {
            return;
        }
        this._ctx.fillStyle = fg;
        let chars = [].concat(ch);
        for (let i = 0; i < chars.length; i++) {
            this._ctx.fillText(chars[i], px[0], Math.ceil(px[1]));
        }
    }
    computeSize(availWidth, availHeight) {
        if (this._options.transpose) {
            availWidth += availHeight;
            availHeight = availWidth - availHeight;
            availWidth -= availHeight;
        }
        let width = Math.floor(availWidth / this._spacingX) - 1;
        let height = Math.floor((availHeight - 2 * this._hexSize) / this._spacingY + 1);
        return [width, height];
    }
    computeFontSize(availWidth, availHeight) {
        if (this._options.transpose) {
            availWidth += availHeight;
            availHeight = availWidth - availHeight;
            availWidth -= availHeight;
        }
        let hexSizeWidth = 2 * availWidth / ((this._options.width + 1) * Math.sqrt(3)) - 1;
        let hexSizeHeight = availHeight / (2 + 1.5 * (this._options.height - 1));
        let hexSize = Math.min(hexSizeWidth, hexSizeHeight);
        // compute char ratio
        let oldFont = this._ctx.font;
        this._ctx.font = "100px " + this._options.fontFamily;
        let width = Math.ceil(this._ctx.measureText("W").width);
        this._ctx.font = oldFont;
        let ratio = width / 100;
        hexSize = Math.floor(hexSize) + 1; // closest larger hexSize
        // FIXME char size computation does not respect transposed hexes
        let fontSize = 2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));
        // closest smaller fontSize
        return Math.ceil(fontSize) - 1;
    }
    _normalizedEventToPosition(x, y) {
        let nodeSize;
        if (this._options.transpose) {
            x += y;
            y = x - y;
            x -= y;
            nodeSize = this._ctx.canvas.width;
        }
        else {
            nodeSize = this._ctx.canvas.height;
        }
        let size = nodeSize / this._options.height;
        y = Math.floor(y / size);
        if (Object(util["mod"])(y, 2)) { /* odd row */
            x -= this._spacingX;
            x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
        }
        else {
            x = 2 * Math.floor(x / (2 * this._spacingX));
        }
        return [x, y];
    }
    /**
     * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
     */
    _fill(cx, cy) {
        let a = this._hexSize;
        let b = this._options.border;
        const ctx = this._ctx;
        ctx.beginPath();
        if (this._options.transpose) {
            ctx.moveTo(cx - a + b, cy);
            ctx.lineTo(cx - a / 2 + b, cy + this._spacingX - b);
            ctx.lineTo(cx + a / 2 - b, cy + this._spacingX - b);
            ctx.lineTo(cx + a - b, cy);
            ctx.lineTo(cx + a / 2 - b, cy - this._spacingX + b);
            ctx.lineTo(cx - a / 2 + b, cy - this._spacingX + b);
            ctx.lineTo(cx - a + b, cy);
        }
        else {
            ctx.moveTo(cx, cy - a + b);
            ctx.lineTo(cx + this._spacingX - b, cy - a / 2 + b);
            ctx.lineTo(cx + this._spacingX - b, cy + a / 2 - b);
            ctx.lineTo(cx, cy + a - b);
            ctx.lineTo(cx - this._spacingX + b, cy + a / 2 - b);
            ctx.lineTo(cx - this._spacingX + b, cy - a / 2 + b);
            ctx.lineTo(cx, cy - a + b);
        }
        ctx.fill();
    }
    _updateSize() {
        const opts = this._options;
        const charWidth = Math.ceil(this._ctx.measureText("W").width);
        this._hexSize = Math.floor(opts.spacing * (opts.fontSize + charWidth / Math.sqrt(3)) / 2);
        this._spacingX = this._hexSize * Math.sqrt(3) / 2;
        this._spacingY = this._hexSize * 1.5;
        let xprop;
        let yprop;
        if (opts.transpose) {
            xprop = "height";
            yprop = "width";
        }
        else {
            xprop = "width";
            yprop = "height";
        }
        this._ctx.canvas[xprop] = Math.ceil((opts.width + 1) * this._spacingX);
        this._ctx.canvas[yprop] = Math.ceil((opts.height - 1) * this._spacingY + 2 * this._hexSize);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/rect.js

/**
 * @class Rectangular backend
 * @private
 */
class rect_Rect extends canvas_Canvas {
    constructor() {
        super();
        this._spacingX = 0;
        this._spacingY = 0;
        this._canvasCache = {};
    }
    setOptions(options) {
        super.setOptions(options);
        this._canvasCache = {};
    }
    draw(data, clearBefore) {
        if (rect_Rect.cache) {
            this._drawWithCache(data);
        }
        else {
            this._drawNoCache(data, clearBefore);
        }
    }
    _drawWithCache(data) {
        let [x, y, ch, fg, bg] = data;
        let hash = "" + ch + fg + bg;
        let canvas;
        if (hash in this._canvasCache) {
            canvas = this._canvasCache[hash];
        }
        else {
            let b = this._options.border;
            canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            canvas.width = this._spacingX;
            canvas.height = this._spacingY;
            ctx.fillStyle = bg;
            ctx.fillRect(b, b, canvas.width - b, canvas.height - b);
            if (ch) {
                ctx.fillStyle = fg;
                ctx.font = this._ctx.font;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                let chars = [].concat(ch);
                for (let i = 0; i < chars.length; i++) {
                    ctx.fillText(chars[i], this._spacingX / 2, Math.ceil(this._spacingY / 2));
                }
            }
            this._canvasCache[hash] = canvas;
        }
        this._ctx.drawImage(canvas, x * this._spacingX, y * this._spacingY);
    }
    _drawNoCache(data, clearBefore) {
        let [x, y, ch, fg, bg] = data;
        if (clearBefore) {
            let b = this._options.border;
            this._ctx.fillStyle = bg;
            this._ctx.fillRect(x * this._spacingX + b, y * this._spacingY + b, this._spacingX - b, this._spacingY - b);
        }
        if (!ch) {
            return;
        }
        this._ctx.fillStyle = fg;
        let chars = [].concat(ch);
        for (let i = 0; i < chars.length; i++) {
            this._ctx.fillText(chars[i], (x + 0.5) * this._spacingX, Math.ceil((y + 0.5) * this._spacingY));
        }
    }
    computeSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._spacingX);
        let height = Math.floor(availHeight / this._spacingY);
        return [width, height];
    }
    computeFontSize(availWidth, availHeight) {
        let boxWidth = Math.floor(availWidth / this._options.width);
        let boxHeight = Math.floor(availHeight / this._options.height);
        /* compute char ratio */
        let oldFont = this._ctx.font;
        this._ctx.font = "100px " + this._options.fontFamily;
        let width = Math.ceil(this._ctx.measureText("W").width);
        this._ctx.font = oldFont;
        let ratio = width / 100;
        let widthFraction = ratio * boxHeight / boxWidth;
        if (widthFraction > 1) { /* too wide with current aspect ratio */
            boxHeight = Math.floor(boxHeight / widthFraction);
        }
        return Math.floor(boxHeight / this._options.spacing);
    }
    _normalizedEventToPosition(x, y) {
        return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
    }
    _updateSize() {
        const opts = this._options;
        const charWidth = Math.ceil(this._ctx.measureText("W").width);
        this._spacingX = Math.ceil(opts.spacing * charWidth);
        this._spacingY = Math.ceil(opts.spacing * opts.fontSize);
        if (opts.forceSquareRatio) {
            this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
        }
        this._ctx.canvas.width = opts.width * this._spacingX;
        this._ctx.canvas.height = opts.height * this._spacingY;
    }
}
rect_Rect.cache = false;

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/tile.js

/**
 * @class Tile backend
 * @private
 */
class tile_Tile extends canvas_Canvas {
    constructor() {
        super();
        this._colorCanvas = document.createElement("canvas");
    }
    draw(data, clearBefore) {
        let [x, y, ch, fg, bg] = data;
        let tileWidth = this._options.tileWidth;
        let tileHeight = this._options.tileHeight;
        if (clearBefore) {
            if (this._options.tileColorize) {
                this._ctx.clearRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            else {
                this._ctx.fillStyle = bg;
                this._ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
        }
        if (!ch) {
            return;
        }
        let chars = [].concat(ch);
        let fgs = [].concat(fg);
        let bgs = [].concat(bg);
        for (let i = 0; i < chars.length; i++) {
            let tile = this._options.tileMap[chars[i]];
            if (!tile) {
                throw new Error(`Char "${chars[i]}" not found in tileMap`);
            }
            if (this._options.tileColorize) { // apply colorization
                let canvas = this._colorCanvas;
                let context = canvas.getContext("2d");
                context.globalCompositeOperation = "source-over";
                context.clearRect(0, 0, tileWidth, tileHeight);
                let fg = fgs[i];
                let bg = bgs[i];
                context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
                if (fg != "transparent") {
                    context.fillStyle = fg;
                    context.globalCompositeOperation = "source-atop";
                    context.fillRect(0, 0, tileWidth, tileHeight);
                }
                if (bg != "transparent") {
                    context.fillStyle = bg;
                    context.globalCompositeOperation = "destination-over";
                    context.fillRect(0, 0, tileWidth, tileHeight);
                }
                this._ctx.drawImage(canvas, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            else { // no colorizing, easy
                this._ctx.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
        }
    }
    computeSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._options.tileWidth);
        let height = Math.floor(availHeight / this._options.tileHeight);
        return [width, height];
    }
    computeFontSize() {
        throw new Error("Tile backend does not understand font size");
    }
    _normalizedEventToPosition(x, y) {
        return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
    }
    _updateSize() {
        const opts = this._options;
        this._ctx.canvas.width = opts.width * opts.tileWidth;
        this._ctx.canvas.height = opts.height * opts.tileHeight;
        this._colorCanvas.width = opts.tileWidth;
        this._colorCanvas.height = opts.tileHeight;
    }
}

// EXTERNAL MODULE: ./node_modules/rot-js/lib/color.js
var lib_color = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/tile-gl.js


/**
 * @class Tile backend
 * @private
 */
class tile_gl_TileGL extends backend["a" /* default */] {
    static isSupported() {
        return !!document.createElement("canvas").getContext("webgl2", { preserveDrawingBuffer: true });
    }
    constructor() {
        super();
        this._uniforms = {};
        try {
            this._gl = this._initWebGL();
        }
        catch (e) {
            alert(e.message);
        }
    }
    schedule(cb) { requestAnimationFrame(cb); }
    getContainer() { return this._gl.canvas; }
    setOptions(opts) {
        super.setOptions(opts);
        this._updateSize();
        let tileSet = this._options.tileSet;
        if (tileSet && "complete" in tileSet && !tileSet.complete) {
            tileSet.addEventListener("load", () => this._updateTexture(tileSet));
        }
        else {
            this._updateTexture(tileSet);
        }
    }
    draw(data, clearBefore) {
        const gl = this._gl;
        const opts = this._options;
        let [x, y, ch, fg, bg] = data;
        let scissorY = gl.canvas.height - (y + 1) * opts.tileHeight;
        gl.scissor(x * opts.tileWidth, scissorY, opts.tileWidth, opts.tileHeight);
        if (clearBefore) {
            if (opts.tileColorize) {
                gl.clearColor(0, 0, 0, 0);
            }
            else {
                gl.clearColor(...parseColor(bg));
            }
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        if (!ch) {
            return;
        }
        let chars = [].concat(ch);
        let bgs = [].concat(bg);
        let fgs = [].concat(fg);
        gl.uniform2fv(this._uniforms["targetPosRel"], [x, y]);
        for (let i = 0; i < chars.length; i++) {
            let tile = this._options.tileMap[chars[i]];
            if (!tile) {
                throw new Error(`Char "${chars[i]}" not found in tileMap`);
            }
            gl.uniform1f(this._uniforms["colorize"], opts.tileColorize ? 1 : 0);
            gl.uniform2fv(this._uniforms["tilesetPosAbs"], tile);
            if (opts.tileColorize) {
                gl.uniform4fv(this._uniforms["tint"], parseColor(fgs[i]));
                gl.uniform4fv(this._uniforms["bg"], parseColor(bgs[i]));
            }
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        /*
        
        
                for (let i=0;i<chars.length;i++) {
                    
                    if (this._options.tileColorize) { // apply colorization
                        let canvas = this._colorCanvas;
                        let context = canvas.getContext("2d") as CanvasRenderingContext2D;
                        context.globalCompositeOperation = "source-over";
                        context.clearRect(0, 0, tileWidth, tileHeight);
        
                        let fg = fgs[i];
                        let bg = bgs[i];
        
                        context.drawImage(
                            this._options.tileSet!,
                            tile[0], tile[1], tileWidth, tileHeight,
                            0, 0, tileWidth, tileHeight
                        );
        
                        if (fg != "transparent") {
                            context.fillStyle = fg;
                            context.globalCompositeOperation = "source-atop";
                            context.fillRect(0, 0, tileWidth, tileHeight);
                        }
        
                        if (bg != "transparent") {
                            context.fillStyle = bg;
                            context.globalCompositeOperation = "destination-over";
                            context.fillRect(0, 0, tileWidth, tileHeight);
                        }
        
                        this._ctx.drawImage(canvas, x*tileWidth, y*tileHeight, tileWidth, tileHeight);
                    } else { // no colorizing, easy
                        this._ctx.drawImage(
                            this._options.tileSet!,
                            tile[0], tile[1], tileWidth, tileHeight,
                            x*tileWidth, y*tileHeight, tileWidth, tileHeight
                        );
                    }
                }
        
        */
    }
    clear() {
        const gl = this._gl;
        gl.clearColor(...parseColor(this._options.bg));
        gl.scissor(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    computeSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._options.tileWidth);
        let height = Math.floor(availHeight / this._options.tileHeight);
        return [width, height];
    }
    computeFontSize() {
        throw new Error("Tile backend does not understand font size");
    }
    eventToPosition(x, y) {
        let canvas = this._gl.canvas;
        let rect = canvas.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
        x *= canvas.width / rect.width;
        y *= canvas.height / rect.height;
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
            return [-1, -1];
        }
        return this._normalizedEventToPosition(x, y);
    }
    _initWebGL() {
        let gl = document.createElement("canvas").getContext("webgl2", { preserveDrawingBuffer: true });
        window.gl = gl;
        let program = createProgram(gl, VS, FS);
        gl.useProgram(program);
        createQuad(gl);
        UNIFORMS.forEach(name => this._uniforms[name] = gl.getUniformLocation(program, name));
        this._program = program;
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.SCISSOR_TEST);
        return gl;
    }
    _normalizedEventToPosition(x, y) {
        return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
    }
    _updateSize() {
        const gl = this._gl;
        const opts = this._options;
        const canvasSize = [opts.width * opts.tileWidth, opts.height * opts.tileHeight];
        gl.canvas.width = canvasSize[0];
        gl.canvas.height = canvasSize[1];
        gl.viewport(0, 0, canvasSize[0], canvasSize[1]);
        gl.uniform2fv(this._uniforms["tileSize"], [opts.tileWidth, opts.tileHeight]);
        gl.uniform2fv(this._uniforms["targetSize"], canvasSize);
    }
    _updateTexture(tileSet) {
        createTexture(this._gl, tileSet);
    }
}
const UNIFORMS = ["targetPosRel", "tilesetPosAbs", "tileSize", "targetSize", "colorize", "bg", "tint"];
const VS = `
#version 300 es

in vec2 tilePosRel;
out vec2 tilesetPosPx;

uniform vec2 tilesetPosAbs;
uniform vec2 tileSize;
uniform vec2 targetSize;
uniform vec2 targetPosRel;

void main() {
	vec2 targetPosPx = (targetPosRel + tilePosRel) * tileSize;
	vec2 targetPosNdc = ((targetPosPx / targetSize)-0.5)*2.0;
	targetPosNdc.y *= -1.0;

	gl_Position = vec4(targetPosNdc, 0.0, 1.0);
	tilesetPosPx = tilesetPosAbs + tilePosRel * tileSize;
}`.trim();
const FS = `
#version 300 es
precision highp float;

in vec2 tilesetPosPx;
out vec4 fragColor;
uniform sampler2D image;
uniform bool colorize;
uniform vec4 bg;
uniform vec4 tint;

void main() {
	fragColor = vec4(0, 0, 0, 1);

	vec4 texel = texelFetch(image, ivec2(tilesetPosPx), 0);

	if (colorize) {
		texel.rgb = tint.a * tint.rgb + (1.0-tint.a) * texel.rgb;
		fragColor.rgb = texel.a*texel.rgb + (1.0-texel.a)*bg.rgb;
		fragColor.a = texel.a + (1.0-texel.a)*bg.a;
	} else {
		fragColor = texel;
	}
}`.trim();
function createProgram(gl, vss, fss) {
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vss);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(vs) || "");
    }
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fss);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(fs) || "");
    }
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(p) || "");
    }
    return p;
}
function createQuad(gl) {
    const pos = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
}
function createTexture(gl, data) {
    let t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
    return t;
}
let colorCache = {};
function parseColor(color) {
    if (!(color in colorCache)) {
        let parsed;
        if (color == "transparent") {
            parsed = [0, 0, 0, 0];
        }
        else if (color.indexOf("rgba") > -1) {
            parsed = (color.match(/[\d.]+/g) || []).map(Number);
            for (let i = 0; i < 3; i++) {
                parsed[i] = parsed[i] / 255;
            }
        }
        else {
            parsed = lib_color["fromString"](color).map($ => $ / 255);
            parsed.push(1);
        }
        colorCache[color] = parsed;
    }
    return colorCache[color];
}

// EXTERNAL MODULE: ./node_modules/rot-js/lib/display/term.js
var term = __webpack_require__(9);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/text.js
/**
 * @namespace
 * Contains text tokenization and breaking routines
 */
const RE_COLORS = /%([bc]){([^}]*)}/g;
// token types
const TYPE_TEXT = 0;
const TYPE_NEWLINE = 1;
const TYPE_FG = 2;
const TYPE_BG = 3;
/**
 * Measure size of a resulting text block
 */
function measure(str, maxWidth) {
    let result = { width: 0, height: 1 };
    let tokens = tokenize(str, maxWidth);
    let lineWidth = 0;
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        switch (token.type) {
            case TYPE_TEXT:
                lineWidth += token.value.length;
                break;
            case TYPE_NEWLINE:
                result.height++;
                result.width = Math.max(result.width, lineWidth);
                lineWidth = 0;
                break;
        }
    }
    result.width = Math.max(result.width, lineWidth);
    return result;
}
/**
 * Convert string to a series of a formatting commands
 */
function tokenize(str, maxWidth) {
    let result = [];
    /* first tokenization pass - split texts and color formatting commands */
    let offset = 0;
    str.replace(RE_COLORS, function (match, type, name, index) {
        /* string before */
        let part = str.substring(offset, index);
        if (part.length) {
            result.push({
                type: TYPE_TEXT,
                value: part
            });
        }
        /* color command */
        result.push({
            type: (type == "c" ? TYPE_FG : TYPE_BG),
            value: name.trim()
        });
        offset = index + match.length;
        return "";
    });
    /* last remaining part */
    let part = str.substring(offset);
    if (part.length) {
        result.push({
            type: TYPE_TEXT,
            value: part
        });
    }
    return breakLines(result, maxWidth);
}
/* insert line breaks into first-pass tokenized data */
function breakLines(tokens, maxWidth) {
    if (!maxWidth) {
        maxWidth = Infinity;
    }
    let i = 0;
    let lineLength = 0;
    let lastTokenWithSpace = -1;
    while (i < tokens.length) { /* take all text tokens, remove space, apply linebreaks */
        let token = tokens[i];
        if (token.type == TYPE_NEWLINE) { /* reset */
            lineLength = 0;
            lastTokenWithSpace = -1;
        }
        if (token.type != TYPE_TEXT) { /* skip non-text tokens */
            i++;
            continue;
        }
        /* remove spaces at the beginning of line */
        while (lineLength == 0 && token.value.charAt(0) == " ") {
            token.value = token.value.substring(1);
        }
        /* forced newline? insert two new tokens after this one */
        let index = token.value.indexOf("\n");
        if (index != -1) {
            token.value = breakInsideToken(tokens, i, index, true);
            /* if there are spaces at the end, we must remove them (we do not want the line too long) */
            let arr = token.value.split("");
            while (arr.length && arr[arr.length - 1] == " ") {
                arr.pop();
            }
            token.value = arr.join("");
        }
        /* token degenerated? */
        if (!token.value.length) {
            tokens.splice(i, 1);
            continue;
        }
        if (lineLength + token.value.length > maxWidth) { /* line too long, find a suitable breaking spot */
            /* is it possible to break within this token? */
            let index = -1;
            while (1) {
                let nextIndex = token.value.indexOf(" ", index + 1);
                if (nextIndex == -1) {
                    break;
                }
                if (lineLength + nextIndex > maxWidth) {
                    break;
                }
                index = nextIndex;
            }
            if (index != -1) { /* break at space within this one */
                token.value = breakInsideToken(tokens, i, index, true);
            }
            else if (lastTokenWithSpace != -1) { /* is there a previous token where a break can occur? */
                let token = tokens[lastTokenWithSpace];
                let breakIndex = token.value.lastIndexOf(" ");
                token.value = breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
                i = lastTokenWithSpace;
            }
            else { /* force break in this token */
                token.value = breakInsideToken(tokens, i, maxWidth - lineLength, false);
            }
        }
        else { /* line not long, continue */
            lineLength += token.value.length;
            if (token.value.indexOf(" ") != -1) {
                lastTokenWithSpace = i;
            }
        }
        i++; /* advance to next token */
    }
    tokens.push({ type: TYPE_NEWLINE }); /* insert fake newline to fix the last text line */
    /* remove trailing space from text tokens before newlines */
    let lastTextToken = null;
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        switch (token.type) {
            case TYPE_TEXT:
                lastTextToken = token;
                break;
            case TYPE_NEWLINE:
                if (lastTextToken) { /* remove trailing space */
                    let arr = lastTextToken.value.split("");
                    while (arr.length && arr[arr.length - 1] == " ") {
                        arr.pop();
                    }
                    lastTextToken.value = arr.join("");
                }
                lastTextToken = null;
                break;
        }
    }
    tokens.pop(); /* remove fake token */
    return tokens;
}
/**
 * Create new tokens and insert them into the stream
 * @param {object[]} tokens
 * @param {int} tokenIndex Token being processed
 * @param {int} breakIndex Index within current token's value
 * @param {bool} removeBreakChar Do we want to remove the breaking character?
 * @returns {string} remaining unbroken token value
 */
function breakInsideToken(tokens, tokenIndex, breakIndex, removeBreakChar) {
    let newBreakToken = {
        type: TYPE_NEWLINE
    };
    let newTextToken = {
        type: TYPE_TEXT,
        value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
    };
    tokens.splice(tokenIndex + 1, 0, newBreakToken, newTextToken);
    return tokens[tokenIndex].value.substring(0, breakIndex);
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/constants.js
/** Default with for display and map generators */
let DEFAULT_WIDTH = 80;
/** Default height for display and map generators */
let DEFAULT_HEIGHT = 25;
const DIRS = {
    4: [[0, -1], [1, 0], [0, 1], [-1, 0]],
    8: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
    6: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
};
const KEYS = {
    /** Cancel key. */
    VK_CANCEL: 3,
    /** Help key. */
    VK_HELP: 6,
    /** Backspace key. */
    VK_BACK_SPACE: 8,
    /** Tab key. */
    VK_TAB: 9,
    /** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
    VK_CLEAR: 12,
    /** Return/enter key on the main keyboard. */
    VK_RETURN: 13,
    /** Reserved, but not used. */
    VK_ENTER: 14,
    /** Shift key. */
    VK_SHIFT: 16,
    /** Control key. */
    VK_CONTROL: 17,
    /** Alt (Option on Mac) key. */
    VK_ALT: 18,
    /** Pause key. */
    VK_PAUSE: 19,
    /** Caps lock. */
    VK_CAPS_LOCK: 20,
    /** Escape key. */
    VK_ESCAPE: 27,
    /** Space bar. */
    VK_SPACE: 32,
    /** Page Up key. */
    VK_PAGE_UP: 33,
    /** Page Down key. */
    VK_PAGE_DOWN: 34,
    /** End key. */
    VK_END: 35,
    /** Home key. */
    VK_HOME: 36,
    /** Left arrow. */
    VK_LEFT: 37,
    /** Up arrow. */
    VK_UP: 38,
    /** Right arrow. */
    VK_RIGHT: 39,
    /** Down arrow. */
    VK_DOWN: 40,
    /** Print Screen key. */
    VK_PRINTSCREEN: 44,
    /** Ins(ert) key. */
    VK_INSERT: 45,
    /** Del(ete) key. */
    VK_DELETE: 46,
    /***/
    VK_0: 48,
    /***/
    VK_1: 49,
    /***/
    VK_2: 50,
    /***/
    VK_3: 51,
    /***/
    VK_4: 52,
    /***/
    VK_5: 53,
    /***/
    VK_6: 54,
    /***/
    VK_7: 55,
    /***/
    VK_8: 56,
    /***/
    VK_9: 57,
    /** Colon (:) key. Requires Gecko 15.0 */
    VK_COLON: 58,
    /** Semicolon (;) key. */
    VK_SEMICOLON: 59,
    /** Less-than (<) key. Requires Gecko 15.0 */
    VK_LESS_THAN: 60,
    /** Equals (=) key. */
    VK_EQUALS: 61,
    /** Greater-than (>) key. Requires Gecko 15.0 */
    VK_GREATER_THAN: 62,
    /** Question mark (?) key. Requires Gecko 15.0 */
    VK_QUESTION_MARK: 63,
    /** Atmark (@) key. Requires Gecko 15.0 */
    VK_AT: 64,
    /***/
    VK_A: 65,
    /***/
    VK_B: 66,
    /***/
    VK_C: 67,
    /***/
    VK_D: 68,
    /***/
    VK_E: 69,
    /***/
    VK_F: 70,
    /***/
    VK_G: 71,
    /***/
    VK_H: 72,
    /***/
    VK_I: 73,
    /***/
    VK_J: 74,
    /***/
    VK_K: 75,
    /***/
    VK_L: 76,
    /***/
    VK_M: 77,
    /***/
    VK_N: 78,
    /***/
    VK_O: 79,
    /***/
    VK_P: 80,
    /***/
    VK_Q: 81,
    /***/
    VK_R: 82,
    /***/
    VK_S: 83,
    /***/
    VK_T: 84,
    /***/
    VK_U: 85,
    /***/
    VK_V: 86,
    /***/
    VK_W: 87,
    /***/
    VK_X: 88,
    /***/
    VK_Y: 89,
    /***/
    VK_Z: 90,
    /***/
    VK_CONTEXT_MENU: 93,
    /** 0 on the numeric keypad. */
    VK_NUMPAD0: 96,
    /** 1 on the numeric keypad. */
    VK_NUMPAD1: 97,
    /** 2 on the numeric keypad. */
    VK_NUMPAD2: 98,
    /** 3 on the numeric keypad. */
    VK_NUMPAD3: 99,
    /** 4 on the numeric keypad. */
    VK_NUMPAD4: 100,
    /** 5 on the numeric keypad. */
    VK_NUMPAD5: 101,
    /** 6 on the numeric keypad. */
    VK_NUMPAD6: 102,
    /** 7 on the numeric keypad. */
    VK_NUMPAD7: 103,
    /** 8 on the numeric keypad. */
    VK_NUMPAD8: 104,
    /** 9 on the numeric keypad. */
    VK_NUMPAD9: 105,
    /** * on the numeric keypad. */
    VK_MULTIPLY: 106,
    /** + on the numeric keypad. */
    VK_ADD: 107,
    /***/
    VK_SEPARATOR: 108,
    /** - on the numeric keypad. */
    VK_SUBTRACT: 109,
    /** Decimal point on the numeric keypad. */
    VK_DECIMAL: 110,
    /** / on the numeric keypad. */
    VK_DIVIDE: 111,
    /** F1 key. */
    VK_F1: 112,
    /** F2 key. */
    VK_F2: 113,
    /** F3 key. */
    VK_F3: 114,
    /** F4 key. */
    VK_F4: 115,
    /** F5 key. */
    VK_F5: 116,
    /** F6 key. */
    VK_F6: 117,
    /** F7 key. */
    VK_F7: 118,
    /** F8 key. */
    VK_F8: 119,
    /** F9 key. */
    VK_F9: 120,
    /** F10 key. */
    VK_F10: 121,
    /** F11 key. */
    VK_F11: 122,
    /** F12 key. */
    VK_F12: 123,
    /** F13 key. */
    VK_F13: 124,
    /** F14 key. */
    VK_F14: 125,
    /** F15 key. */
    VK_F15: 126,
    /** F16 key. */
    VK_F16: 127,
    /** F17 key. */
    VK_F17: 128,
    /** F18 key. */
    VK_F18: 129,
    /** F19 key. */
    VK_F19: 130,
    /** F20 key. */
    VK_F20: 131,
    /** F21 key. */
    VK_F21: 132,
    /** F22 key. */
    VK_F22: 133,
    /** F23 key. */
    VK_F23: 134,
    /** F24 key. */
    VK_F24: 135,
    /** Num Lock key. */
    VK_NUM_LOCK: 144,
    /** Scroll Lock key. */
    VK_SCROLL_LOCK: 145,
    /** Circumflex (^) key. Requires Gecko 15.0 */
    VK_CIRCUMFLEX: 160,
    /** Exclamation (!) key. Requires Gecko 15.0 */
    VK_EXCLAMATION: 161,
    /** Double quote () key. Requires Gecko 15.0 */
    VK_DOUBLE_QUOTE: 162,
    /** Hash (#) key. Requires Gecko 15.0 */
    VK_HASH: 163,
    /** Dollar sign ($) key. Requires Gecko 15.0 */
    VK_DOLLAR: 164,
    /** Percent (%) key. Requires Gecko 15.0 */
    VK_PERCENT: 165,
    /** Ampersand (&) key. Requires Gecko 15.0 */
    VK_AMPERSAND: 166,
    /** Underscore (_) key. Requires Gecko 15.0 */
    VK_UNDERSCORE: 167,
    /** Open parenthesis (() key. Requires Gecko 15.0 */
    VK_OPEN_PAREN: 168,
    /** Close parenthesis ()) key. Requires Gecko 15.0 */
    VK_CLOSE_PAREN: 169,
    /* Asterisk (*) key. Requires Gecko 15.0 */
    VK_ASTERISK: 170,
    /** Plus (+) key. Requires Gecko 15.0 */
    VK_PLUS: 171,
    /** Pipe (|) key. Requires Gecko 15.0 */
    VK_PIPE: 172,
    /** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
    VK_HYPHEN_MINUS: 173,
    /** Open curly bracket ({) key. Requires Gecko 15.0 */
    VK_OPEN_CURLY_BRACKET: 174,
    /** Close curly bracket (}) key. Requires Gecko 15.0 */
    VK_CLOSE_CURLY_BRACKET: 175,
    /** Tilde (~) key. Requires Gecko 15.0 */
    VK_TILDE: 176,
    /** Comma (,) key. */
    VK_COMMA: 188,
    /** Period (.) key. */
    VK_PERIOD: 190,
    /** Slash (/) key. */
    VK_SLASH: 191,
    /** Back tick (`) key. */
    VK_BACK_QUOTE: 192,
    /** Open square bracket ([) key. */
    VK_OPEN_BRACKET: 219,
    /** Back slash (\) key. */
    VK_BACK_SLASH: 220,
    /** Close square bracket (]) key. */
    VK_CLOSE_BRACKET: 221,
    /** Quote (''') key. */
    VK_QUOTE: 222,
    /** Meta key on Linux, Command key on Mac. */
    VK_META: 224,
    /** AltGr key on Linux. Requires Gecko 15.0 */
    VK_ALTGR: 225,
    /** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
    VK_WIN: 91,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_KANA: 21,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_HANGUL: 21,
    /** 英数 key on Japanese Mac keyboard. Requires Gecko 15.0 */
    VK_EISU: 22,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_JUNJA: 23,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_FINAL: 24,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_HANJA: 25,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_KANJI: 25,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_CONVERT: 28,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_NONCONVERT: 29,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_ACCEPT: 30,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_MODECHANGE: 31,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_SELECT: 41,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_PRINT: 42,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_EXECUTE: 43,
    /** Linux support for this keycode was added in Gecko 4.0.	 */
    VK_SLEEP: 95
};

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/display.js







const BACKENDS = {
    "hex": hex_Hex,
    "rect": rect_Rect,
    "tile": tile_Tile,
    "tile-gl": tile_gl_TileGL,
    "term": term["a" /* default */]
};
const DEFAULT_OPTIONS = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    transpose: false,
    layout: "rect",
    fontSize: 15,
    spacing: 1,
    border: 0,
    forceSquareRatio: false,
    fontFamily: "monospace",
    fontStyle: "",
    fg: "#ccc",
    bg: "#000",
    tileWidth: 32,
    tileHeight: 32,
    tileMap: {},
    tileSet: null,
    tileColorize: false
};
/**
 * @class Visual map display
 */
class display_Display {
    constructor(options = {}) {
        this._data = {};
        this._dirty = false; // false = nothing, true = all, object = dirty cells
        this._options = {};
        options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.setOptions(options);
        this.DEBUG = this.DEBUG.bind(this);
        this._tick = this._tick.bind(this);
        this._backend.schedule(this._tick);
    }
    /**
     * Debug helper, ideal as a map generator callback. Always bound to this.
     * @param {int} x
     * @param {int} y
     * @param {int} what
     */
    DEBUG(x, y, what) {
        let colors = [this._options.bg, this._options.fg];
        this.draw(x, y, null, null, colors[what % colors.length]);
    }
    /**
     * Clear the whole display (cover it with background color)
     */
    clear() {
        this._data = {};
        this._dirty = true;
    }
    /**
     * @see ROT.Display
     */
    setOptions(options) {
        Object.assign(this._options, options);
        if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
            if (options.layout) {
                let ctor = BACKENDS[options.layout];
                this._backend = new ctor();
            }
            this._backend.setOptions(this._options);
            this._dirty = true;
        }
        return this;
    }
    /**
     * Returns currently set options
     */
    getOptions() { return this._options; }
    /**
     * Returns the DOM node of this display
     */
    getContainer() { return this._backend.getContainer(); }
    /**
     * Compute the maximum width/height to fit into a set of given constraints
     * @param {int} availWidth Maximum allowed pixel width
     * @param {int} availHeight Maximum allowed pixel height
     * @returns {int[2]} cellWidth,cellHeight
     */
    computeSize(availWidth, availHeight) {
        return this._backend.computeSize(availWidth, availHeight);
    }
    /**
     * Compute the maximum font size to fit into a set of given constraints
     * @param {int} availWidth Maximum allowed pixel width
     * @param {int} availHeight Maximum allowed pixel height
     * @returns {int} fontSize
     */
    computeFontSize(availWidth, availHeight) {
        return this._backend.computeFontSize(availWidth, availHeight);
    }
    computeTileSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._options.width);
        let height = Math.floor(availHeight / this._options.height);
        return [width, height];
    }
    /**
     * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
     * @param {Event} e event
     * @returns {int[2]} -1 for values outside of the canvas
     */
    eventToPosition(e) {
        let x, y;
        if ("touches" in e) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }
        return this._backend.eventToPosition(x, y);
    }
    /**
     * @param {int} x
     * @param {int} y
     * @param {string || string[]} ch One or more chars (will be overlapping themselves)
     * @param {string} [fg] foreground color
     * @param {string} [bg] background color
     */
    draw(x, y, ch, fg, bg) {
        if (!fg) {
            fg = this._options.fg;
        }
        if (!bg) {
            bg = this._options.bg;
        }
        let key = `${x},${y}`;
        this._data[key] = [x, y, ch, fg, bg];
        if (this._dirty === true) {
            return;
        } // will already redraw everything 
        if (!this._dirty) {
            this._dirty = {};
        } // first!
        this._dirty[key] = true;
    }
    /**
     * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
     * @param {int} x
     * @param {int} y
     * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
     * @param {int} [maxWidth] wrap at what width?
     * @returns {int} lines drawn
     */
    drawText(x, y, text, maxWidth) {
        let fg = null;
        let bg = null;
        let cx = x;
        let cy = y;
        let lines = 1;
        if (!maxWidth) {
            maxWidth = this._options.width - x;
        }
        let tokens = tokenize(text, maxWidth);
        while (tokens.length) { // interpret tokenized opcode stream
            let token = tokens.shift();
            switch (token.type) {
                case TYPE_TEXT:
                    let isSpace = false, isPrevSpace = false, isFullWidth = false, isPrevFullWidth = false;
                    for (let i = 0; i < token.value.length; i++) {
                        let cc = token.value.charCodeAt(i);
                        let c = token.value.charAt(i);
                        // Assign to `true` when the current char is full-width.
                        isFullWidth = (cc > 0xff00 && cc < 0xff61) || (cc > 0xffdc && cc < 0xffe8) || cc > 0xffee;
                        // Current char is space, whatever full-width or half-width both are OK.
                        isSpace = (c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000);
                        // The previous char is full-width and
                        // current char is nether half-width nor a space.
                        if (isPrevFullWidth && !isFullWidth && !isSpace) {
                            cx++;
                        } // add an extra position
                        // The current char is full-width and
                        // the previous char is not a space.
                        if (isFullWidth && !isPrevSpace) {
                            cx++;
                        } // add an extra position
                        this.draw(cx++, cy, c, fg, bg);
                        isPrevSpace = isSpace;
                        isPrevFullWidth = isFullWidth;
                    }
                    break;
                case TYPE_FG:
                    fg = token.value || null;
                    break;
                case TYPE_BG:
                    bg = token.value || null;
                    break;
                case TYPE_NEWLINE:
                    cx = x;
                    cy++;
                    lines++;
                    break;
            }
        }
        return lines;
    }
    /**
     * Timer tick: update dirty parts
     */
    _tick() {
        this._backend.schedule(this._tick);
        if (!this._dirty) {
            return;
        }
        if (this._dirty === true) { // draw all
            this._backend.clear();
            for (let id in this._data) {
                this._draw(id, false);
            } // redraw cached data 
        }
        else { // draw only dirty 
            for (let key in this._dirty) {
                this._draw(key, true);
            }
        }
        this._dirty = false;
    }
    /**
     * @param {string} key What to draw
     * @param {bool} clearBefore Is it necessary to clean before?
     */
    _draw(key, clearBefore) {
        let data = this._data[key];
        if (data[4] != this._options.bg) {
            clearBefore = true;
        }
        this._backend.draw(data, clearBefore);
    }
}
display_Display.Rect = rect_Rect;
display_Display.Hex = hex_Hex;
display_Display.Tile = tile_Tile;
display_Display.TileGL = tile_gl_TileGL;
display_Display.Term = term["a" /* default */];

// CONCATENATED MODULE: ./node_modules/rot-js/lib/stringgenerator.js

/**
 * @class (Markov process)-based string generator.
 * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>.
 * Offers configurable order and prior.
 */
class stringgenerator_StringGenerator {
    constructor(options) {
        this._options = {
            words: false,
            order: 3,
            prior: 0.001
        };
        Object.assign(this._options, options);
        this._boundary = String.fromCharCode(0);
        this._suffix = this._boundary;
        this._prefix = [];
        for (let i = 0; i < this._options.order; i++) {
            this._prefix.push(this._boundary);
        }
        this._priorValues = {};
        this._priorValues[this._boundary] = this._options.prior;
        this._data = {};
    }
    /**
     * Remove all learning data
     */
    clear() {
        this._data = {};
        this._priorValues = {};
    }
    /**
     * @returns {string} Generated string
     */
    generate() {
        let result = [this._sample(this._prefix)];
        while (result[result.length - 1] != this._boundary) {
            result.push(this._sample(result));
        }
        return this._join(result.slice(0, -1));
    }
    /**
     * Observe (learn) a string from a training set
     */
    observe(string) {
        let tokens = this._split(string);
        for (let i = 0; i < tokens.length; i++) {
            this._priorValues[tokens[i]] = this._options.prior;
        }
        tokens = this._prefix.concat(tokens).concat(this._suffix); /* add boundary symbols */
        for (let i = this._options.order; i < tokens.length; i++) {
            let context = tokens.slice(i - this._options.order, i);
            let event = tokens[i];
            for (let j = 0; j < context.length; j++) {
                let subcontext = context.slice(j);
                this._observeEvent(subcontext, event);
            }
        }
    }
    getStats() {
        let parts = [];
        let priorCount = Object.keys(this._priorValues).length;
        priorCount--; // boundary
        parts.push("distinct samples: " + priorCount);
        let dataCount = Object.keys(this._data).length;
        let eventCount = 0;
        for (let p in this._data) {
            eventCount += Object.keys(this._data[p]).length;
        }
        parts.push("dictionary size (contexts): " + dataCount);
        parts.push("dictionary size (events): " + eventCount);
        return parts.join(", ");
    }
    /**
     * @param {string}
     * @returns {string[]}
     */
    _split(str) {
        return str.split(this._options.words ? /\s+/ : "");
    }
    /**
     * @param {string[]}
     * @returns {string}
     */
    _join(arr) {
        return arr.join(this._options.words ? " " : "");
    }
    /**
     * @param {string[]} context
     * @param {string} event
     */
    _observeEvent(context, event) {
        let key = this._join(context);
        if (!(key in this._data)) {
            this._data[key] = {};
        }
        let data = this._data[key];
        if (!(event in data)) {
            data[event] = 0;
        }
        data[event]++;
    }
    /**
     * @param {string[]}
     * @returns {string}
     */
    _sample(context) {
        context = this._backoff(context);
        let key = this._join(context);
        let data = this._data[key];
        let available = {};
        if (this._options.prior) {
            for (let event in this._priorValues) {
                available[event] = this._priorValues[event];
            }
            for (let event in data) {
                available[event] += data[event];
            }
        }
        else {
            available = data;
        }
        return rng["a" /* default */].getWeightedValue(available);
    }
    /**
     * @param {string[]}
     * @returns {string[]}
     */
    _backoff(context) {
        if (context.length > this._options.order) {
            context = context.slice(-this._options.order);
        }
        else if (context.length < this._options.order) {
            context = this._prefix.slice(0, this._options.order - context.length).concat(context);
        }
        while (!(this._join(context) in this._data) && context.length > 0) {
            context = context.slice(1);
        }
        return context;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/eventqueue.js
class EventQueue {
    /**
     * @class Generic event queue: stores events and retrieves them based on their time
     */
    constructor() {
        this._time = 0;
        this._events = [];
        this._eventTimes = [];
    }
    /**
     * @returns {number} Elapsed time
     */
    getTime() { return this._time; }
    /**
     * Clear all scheduled events
     */
    clear() {
        this._events = [];
        this._eventTimes = [];
        return this;
    }
    /**
     * @param {?} event
     * @param {number} time
     */
    add(event, time) {
        let index = this._events.length;
        for (let i = 0; i < this._eventTimes.length; i++) {
            if (this._eventTimes[i] > time) {
                index = i;
                break;
            }
        }
        this._events.splice(index, 0, event);
        this._eventTimes.splice(index, 0, time);
    }
    /**
     * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
     * @returns {? || null} The event previously added by addEvent, null if no event available
     */
    get() {
        if (!this._events.length) {
            return null;
        }
        let time = this._eventTimes.splice(0, 1)[0];
        if (time > 0) { /* advance */
            this._time += time;
            for (let i = 0; i < this._eventTimes.length; i++) {
                this._eventTimes[i] -= time;
            }
        }
        return this._events.splice(0, 1)[0];
    }
    /**
     * Get the time associated with the given event
     * @param {?} event
     * @returns {number} time
     */
    getEventTime(event) {
        let index = this._events.indexOf(event);
        if (index == -1) {
            return undefined;
        }
        return this._eventTimes[index];
    }
    /**
     * Remove an event from the queue
     * @param {?} event
     * @returns {bool} success?
     */
    remove(event) {
        let index = this._events.indexOf(event);
        if (index == -1) {
            return false;
        }
        this._remove(index);
        return true;
    }
    ;
    /**
     * Remove an event from the queue
     * @param {int} index
     */
    _remove(index) {
        this._events.splice(index, 1);
        this._eventTimes.splice(index, 1);
    }
    ;
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/scheduler.js

class scheduler_Scheduler {
    /**
     * @class Abstract scheduler
     */
    constructor() {
        this._queue = new EventQueue();
        this._repeat = [];
        this._current = null;
    }
    /**
     * @see ROT.EventQueue#getTime
     */
    getTime() { return this._queue.getTime(); }
    /**
     * @param {?} item
     * @param {bool} repeat
     */
    add(item, repeat) {
        if (repeat) {
            this._repeat.push(item);
        }
        return this;
    }
    /**
     * Get the time the given item is scheduled for
     * @param {?} item
     * @returns {number} time
     */
    getTimeOf(item) {
        return this._queue.getEventTime(item);
    }
    /**
     * Clear all items
     */
    clear() {
        this._queue.clear();
        this._repeat = [];
        this._current = null;
        return this;
    }
    /**
     * Remove a previously added item
     * @param {?} item
     * @returns {bool} successful?
     */
    remove(item) {
        let result = this._queue.remove(item);
        let index = this._repeat.indexOf(item);
        if (index != -1) {
            this._repeat.splice(index, 1);
        }
        if (this._current == item) {
            this._current = null;
        }
        return result;
    }
    /**
     * Schedule next item
     * @returns {?}
     */
    next() {
        this._current = this._queue.get();
        return this._current;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/simple.js

/**
 * @class Simple fair scheduler (round-robin style)
 */
class simple_Simple extends scheduler_Scheduler {
    add(item, repeat) {
        this._queue.add(item, 0);
        return super.add(item, repeat);
    }
    next() {
        if (this._current !== null && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, 0);
        }
        return super.next();
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/speed.js

/**
 * @class Speed-based scheduler
 */
class speed_Speed extends scheduler_Scheduler {
    /**
     * @param {object} item anything with "getSpeed" method
     * @param {bool} repeat
     * @param {number} [time=1/item.getSpeed()]
     * @see ROT.Scheduler#add
     */
    add(item, repeat, time) {
        this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed());
        return super.add(item, repeat);
    }
    /**
     * @see ROT.Scheduler#next
     */
    next() {
        if (this._current && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, 1 / this._current.getSpeed());
        }
        return super.next();
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/action.js

/**
 * @class Action-based scheduler
 * @augments ROT.Scheduler
 */
class action_Action extends scheduler_Scheduler {
    constructor() {
        super();
        this._defaultDuration = 1; /* for newly added */
        this._duration = this._defaultDuration; /* for this._current */
    }
    /**
     * @param {object} item
     * @param {bool} repeat
     * @param {number} [time=1]
     * @see ROT.Scheduler#add
     */
    add(item, repeat, time) {
        this._queue.add(item, time || this._defaultDuration);
        return super.add(item, repeat);
    }
    clear() {
        this._duration = this._defaultDuration;
        return super.clear();
    }
    remove(item) {
        if (item == this._current) {
            this._duration = this._defaultDuration;
        }
        return super.remove(item);
    }
    /**
     * @see ROT.Scheduler#next
     */
    next() {
        if (this._current !== null && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, this._duration || this._defaultDuration);
            this._duration = this._defaultDuration;
        }
        return super.next();
    }
    /**
     * Set duration for the active item
     */
    setDuration(time) {
        if (this._current) {
            this._duration = time;
        }
        return this;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/index.js



/* harmony default export */ var scheduler = ({ Simple: simple_Simple, Speed: speed_Speed, Action: action_Action });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/fov.js

;
;
class fov_FOV {
    /**
     * @class Abstract FOV algorithm
     * @param {function} lightPassesCallback Does the light pass through x,y?
     * @param {object} [options]
     * @param {int} [options.topology=8] 4/6/8
     */
    constructor(lightPassesCallback, options = {}) {
        this._lightPasses = lightPassesCallback;
        this._options = Object.assign({ topology: 8 }, options);
    }
    /**
     * Return all neighbors in a concentric ring
     * @param {int} cx center-x
     * @param {int} cy center-y
     * @param {int} r range
     */
    _getCircle(cx, cy, r) {
        let result = [];
        let dirs, countFactor, startOffset;
        switch (this._options.topology) {
            case 4:
                countFactor = 1;
                startOffset = [0, 1];
                dirs = [
                    DIRS[8][7],
                    DIRS[8][1],
                    DIRS[8][3],
                    DIRS[8][5]
                ];
                break;
            case 6:
                dirs = DIRS[6];
                countFactor = 1;
                startOffset = [-1, 1];
                break;
            case 8:
                dirs = DIRS[4];
                countFactor = 2;
                startOffset = [-1, 1];
                break;
            default:
                throw new Error("Incorrect topology for FOV computation");
                break;
        }
        /* starting neighbor */
        let x = cx + startOffset[0] * r;
        let y = cy + startOffset[1] * r;
        /* circle */
        for (let i = 0; i < dirs.length; i++) {
            for (let j = 0; j < r * countFactor; j++) {
                result.push([x, y]);
                x += dirs[i][0];
                y += dirs[i][1];
            }
        }
        return result;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/discrete-shadowcasting.js

/**
 * @class Discrete shadowcasting algorithm. Obsoleted by Precise shadowcasting.
 * @augments ROT.FOV
 */
class discrete_shadowcasting_DiscreteShadowcasting extends fov_FOV {
    compute(x, y, R, callback) {
        /* this place is always visible */
        callback(x, y, 0, 1);
        /* standing in a dark place. FIXME is this a good idea?  */
        if (!this._lightPasses(x, y)) {
            return;
        }
        /* start and end angles */
        let DATA = [];
        let A, B, cx, cy, blocks;
        /* analyze surrounding cells in concentric rings, starting from the center */
        for (let r = 1; r <= R; r++) {
            let neighbors = this._getCircle(x, y, r);
            let angle = 360 / neighbors.length;
            for (let i = 0; i < neighbors.length; i++) {
                cx = neighbors[i][0];
                cy = neighbors[i][1];
                A = angle * (i - 0.5);
                B = A + angle;
                blocks = !this._lightPasses(cx, cy);
                if (this._visibleCoords(Math.floor(A), Math.ceil(B), blocks, DATA)) {
                    callback(cx, cy, r, 1);
                }
                if (DATA.length == 2 && DATA[0] == 0 && DATA[1] == 360) {
                    return;
                } /* cutoff? */
            } /* for all cells in this ring */
        } /* for all rings */
    }
    /**
     * @param {int} A start angle
     * @param {int} B end angle
     * @param {bool} blocks Does current cell block visibility?
     * @param {int[][]} DATA shadowed angle pairs
     */
    _visibleCoords(A, B, blocks, DATA) {
        if (A < 0) {
            let v1 = this._visibleCoords(0, B, blocks, DATA);
            let v2 = this._visibleCoords(360 + A, 360, blocks, DATA);
            return v1 || v2;
        }
        let index = 0;
        while (index < DATA.length && DATA[index] < A) {
            index++;
        }
        if (index == DATA.length) { /* completely new shadow */
            if (blocks) {
                DATA.push(A, B);
            }
            return true;
        }
        let count = 0;
        if (index % 2) { /* this shadow starts in an existing shadow, or within its ending boundary */
            while (index < DATA.length && DATA[index] < B) {
                index++;
                count++;
            }
            if (count == 0) {
                return false;
            }
            if (blocks) {
                if (count % 2) {
                    DATA.splice(index - count, count, B);
                }
                else {
                    DATA.splice(index - count, count);
                }
            }
            return true;
        }
        else { /* this shadow starts outside an existing shadow, or within a starting boundary */
            while (index < DATA.length && DATA[index] < B) {
                index++;
                count++;
            }
            /* visible when outside an existing shadow, or when overlapping */
            if (A == DATA[index - count] && count == 1) {
                return false;
            }
            if (blocks) {
                if (count % 2) {
                    DATA.splice(index - count, count, A);
                }
                else {
                    DATA.splice(index - count, count, A, B);
                }
            }
            return true;
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/precise-shadowcasting.js

/**
 * @class Precise shadowcasting algorithm
 * @augments ROT.FOV
 */
class precise_shadowcasting_PreciseShadowcasting extends fov_FOV {
    compute(x, y, R, callback) {
        /* this place is always visible */
        callback(x, y, 0, 1);
        /* standing in a dark place. FIXME is this a good idea?  */
        if (!this._lightPasses(x, y)) {
            return;
        }
        /* list of all shadows */
        let SHADOWS = [];
        let cx, cy, blocks, A1, A2, visibility;
        /* analyze surrounding cells in concentric rings, starting from the center */
        for (let r = 1; r <= R; r++) {
            let neighbors = this._getCircle(x, y, r);
            let neighborCount = neighbors.length;
            for (let i = 0; i < neighborCount; i++) {
                cx = neighbors[i][0];
                cy = neighbors[i][1];
                /* shift half-an-angle backwards to maintain consistency of 0-th cells */
                A1 = [i ? 2 * i - 1 : 2 * neighborCount - 1, 2 * neighborCount];
                A2 = [2 * i + 1, 2 * neighborCount];
                blocks = !this._lightPasses(cx, cy);
                visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);
                if (visibility) {
                    callback(cx, cy, r, visibility);
                }
                if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) {
                    return;
                } /* cutoff? */
            } /* for all cells in this ring */
        } /* for all rings */
    }
    /**
     * @param {int[2]} A1 arc start
     * @param {int[2]} A2 arc end
     * @param {bool} blocks Does current arc block visibility?
     * @param {int[][]} SHADOWS list of active shadows
     */
    _checkVisibility(A1, A2, blocks, SHADOWS) {
        if (A1[0] > A2[0]) { /* split into two sub-arcs */
            let v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);
            let v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);
            return (v1 + v2) / 2;
        }
        /* index1: first shadow >= A1 */
        let index1 = 0, edge1 = false;
        while (index1 < SHADOWS.length) {
            let old = SHADOWS[index1];
            let diff = old[0] * A1[1] - A1[0] * old[1];
            if (diff >= 0) { /* old >= A1 */
                if (diff == 0 && !(index1 % 2)) {
                    edge1 = true;
                }
                break;
            }
            index1++;
        }
        /* index2: last shadow <= A2 */
        let index2 = SHADOWS.length, edge2 = false;
        while (index2--) {
            let old = SHADOWS[index2];
            let diff = A2[0] * old[1] - old[0] * A2[1];
            if (diff >= 0) { /* old <= A2 */
                if (diff == 0 && (index2 % 2)) {
                    edge2 = true;
                }
                break;
            }
        }
        let visible = true;
        if (index1 == index2 && (edge1 || edge2)) { /* subset of existing shadow, one of the edges match */
            visible = false;
        }
        else if (edge1 && edge2 && index1 + 1 == index2 && (index2 % 2)) { /* completely equivalent with existing shadow */
            visible = false;
        }
        else if (index1 > index2 && (index1 % 2)) { /* subset of existing shadow, not touching */
            visible = false;
        }
        if (!visible) {
            return 0;
        } /* fast case: not visible */
        let visibleLength;
        /* compute the length of visible arc, adjust list of shadows (if blocking) */
        let remove = index2 - index1 + 1;
        if (remove % 2) {
            if (index1 % 2) { /* first edge within existing shadow, second outside */
                let P = SHADOWS[index1];
                visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);
                if (blocks) {
                    SHADOWS.splice(index1, remove, A2);
                }
            }
            else { /* second edge within existing shadow, first outside */
                let P = SHADOWS[index2];
                visibleLength = (P[0] * A1[1] - A1[0] * P[1]) / (A1[1] * P[1]);
                if (blocks) {
                    SHADOWS.splice(index1, remove, A1);
                }
            }
        }
        else {
            if (index1 % 2) { /* both edges within existing shadows */
                let P1 = SHADOWS[index1];
                let P2 = SHADOWS[index2];
                visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);
                if (blocks) {
                    SHADOWS.splice(index1, remove);
                }
            }
            else { /* both edges outside existing shadows */
                if (blocks) {
                    SHADOWS.splice(index1, remove, A1, A2);
                }
                return 1; /* whole arc visible! */
            }
        }
        let arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);
        return visibleLength / arcLength;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/recursive-shadowcasting.js

/** Octants used for translating recursive shadowcasting offsets */
const OCTANTS = [
    [-1, 0, 0, 1],
    [0, -1, 1, 0],
    [0, -1, -1, 0],
    [-1, 0, 0, -1],
    [1, 0, 0, -1],
    [0, 1, -1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1]
];
/**
 * @class Recursive shadowcasting algorithm
 * Currently only supports 4/8 topologies, not hexagonal.
 * Based on Peter Harkins' implementation of Björn Bergström's algorithm described here: http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
 * @augments ROT.FOV
 */
class recursive_shadowcasting_RecursiveShadowcasting extends fov_FOV {
    /**
     * Compute visibility for a 360-degree circle
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {function} callback
     */
    compute(x, y, R, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);
        for (let i = 0; i < OCTANTS.length; i++) {
            this._renderOctant(x, y, OCTANTS[i], R, callback);
        }
    }
    /**
     * Compute visibility for a 180-degree arc
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
     * @param {function} callback
     */
    compute180(x, y, R, dir, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);
        let previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 180 degrees
        let nextPreviousOctant = (dir - 2 + 8) % 8; //Need to retrieve the previous two octants to render a full 180 degrees
        let nextOctant = (dir + 1 + 8) % 8; //Need to grab to next octant to render a full 180 degrees
        this._renderOctant(x, y, OCTANTS[nextPreviousOctant], R, callback);
        this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
        this._renderOctant(x, y, OCTANTS[dir], R, callback);
        this._renderOctant(x, y, OCTANTS[nextOctant], R, callback);
    }
    ;
    /**
     * Compute visibility for a 90-degree arc
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
     * @param {function} callback
     */
    compute90(x, y, R, dir, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);
        let previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 90 degrees
        this._renderOctant(x, y, OCTANTS[dir], R, callback);
        this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
    }
    /**
     * Render one octant (45-degree arc) of the viewshed
     * @param {int} x
     * @param {int} y
     * @param {int} octant Octant to be rendered
     * @param {int} R Maximum visibility radius
     * @param {function} callback
     */
    _renderOctant(x, y, octant, R, callback) {
        //Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
        this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback);
    }
    /**
     * Actually calculates the visibility
     * @param {int} startX The starting X coordinate
     * @param {int} startY The starting Y coordinate
     * @param {int} row The row to render
     * @param {float} visSlopeStart The slope to start at
     * @param {float} visSlopeEnd The slope to end at
     * @param {int} radius The radius to reach out to
     * @param {int} xx
     * @param {int} xy
     * @param {int} yx
     * @param {int} yy
     * @param {function} callback The callback to use when we hit a block that is visible
     */
    _castVisibility(startX, startY, row, visSlopeStart, visSlopeEnd, radius, xx, xy, yx, yy, callback) {
        if (visSlopeStart < visSlopeEnd) {
            return;
        }
        for (let i = row; i <= radius; i++) {
            let dx = -i - 1;
            let dy = -i;
            let blocked = false;
            let newStart = 0;
            //'Row' could be column, names here assume octant 0 and would be flipped for half the octants
            while (dx <= 0) {
                dx += 1;
                //Translate from relative coordinates to map coordinates
                let mapX = startX + dx * xx + dy * xy;
                let mapY = startY + dx * yx + dy * yy;
                //Range of the row
                let slopeStart = (dx - 0.5) / (dy + 0.5);
                let slopeEnd = (dx + 0.5) / (dy - 0.5);
                //Ignore if not yet at left edge of Octant
                if (slopeEnd > visSlopeStart) {
                    continue;
                }
                //Done if past right edge
                if (slopeStart < visSlopeEnd) {
                    break;
                }
                //If it's in range, it's visible
                if ((dx * dx + dy * dy) < (radius * radius)) {
                    callback(mapX, mapY, i, 1);
                }
                if (!blocked) {
                    //If tile is a blocking tile, cast around it
                    if (!this._lightPasses(mapX, mapY) && i < radius) {
                        blocked = true;
                        this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback);
                        newStart = slopeEnd;
                    }
                }
                else {
                    //Keep narrowing if scanning across a block
                    if (!this._lightPasses(mapX, mapY)) {
                        newStart = slopeEnd;
                        continue;
                    }
                    //Block has ended
                    blocked = false;
                    visSlopeStart = newStart;
                }
            }
            if (blocked) {
                break;
            }
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/index.js



/* harmony default export */ var fov = ({ DiscreteShadowcasting: discrete_shadowcasting_DiscreteShadowcasting, PreciseShadowcasting: precise_shadowcasting_PreciseShadowcasting, RecursiveShadowcasting: recursive_shadowcasting_RecursiveShadowcasting });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/map.js

;
class map_Map {
    /**
     * @class Base map generator
     * @param {int} [width=ROT.DEFAULT_WIDTH]
     * @param {int} [height=ROT.DEFAULT_HEIGHT]
     */
    constructor(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
        this._width = width;
        this._height = height;
    }
    ;
    _fillMap(value) {
        let map = [];
        for (let i = 0; i < this._width; i++) {
            map.push([]);
            for (let j = 0; j < this._height; j++) {
                map[i].push(value);
            }
        }
        return map;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/arena.js

/**
 * @class Simple empty rectangular room
 * @augments ROT.Map
 */
class arena_Arena extends map_Map {
    create(callback) {
        let w = this._width - 1;
        let h = this._height - 1;
        for (let i = 0; i <= w; i++) {
            for (let j = 0; j <= h; j++) {
                let empty = (i && j && i < w && j < h);
                callback(i, j, empty ? 0 : 1);
            }
        }
        return this;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/dungeon.js

/**
 * @class Dungeon map: has rooms and corridors
 * @augments ROT.Map
 */
class dungeon_Dungeon extends map_Map {
    constructor(width, height) {
        super(width, height);
        this._rooms = [];
        this._corridors = [];
    }
    /**
     * Get all generated rooms
     * @returns {ROT.Map.Feature.Room[]}
     */
    getRooms() { return this._rooms; }
    /**
     * Get all generated corridors
     * @returns {ROT.Map.Feature.Corridor[]}
     */
    getCorridors() { return this._corridors; }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/features.js

;
/**
 * @class Dungeon feature; has own .create() method
 */
class Feature {
}
/**
 * @class Room
 * @augments ROT.Map.Feature
 * @param {int} x1
 * @param {int} y1
 * @param {int} x2
 * @param {int} y2
 * @param {int} [doorX]
 * @param {int} [doorY]
 */
class features_Room extends Feature {
    constructor(x1, y1, x2, y2, doorX, doorY) {
        super();
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
        this._doors = {};
        if (doorX !== undefined && doorY !== undefined) {
            this.addDoor(doorX, doorY);
        }
    }
    ;
    /**
     * Room of random size, with a given doors and direction
     */
    static createRandomAt(x, y, dx, dy, options) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = rng["a" /* default */].getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = rng["a" /* default */].getUniformInt(min, max);
        if (dx == 1) { /* to the right */
            let y2 = y - Math.floor(rng["a" /* default */].getUniform() * height);
            return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
        }
        if (dx == -1) { /* to the left */
            let y2 = y - Math.floor(rng["a" /* default */].getUniform() * height);
            return new this(x - width, y2, x - 1, y2 + height - 1, x, y);
        }
        if (dy == 1) { /* to the bottom */
            let x2 = x - Math.floor(rng["a" /* default */].getUniform() * width);
            return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
        }
        if (dy == -1) { /* to the top */
            let x2 = x - Math.floor(rng["a" /* default */].getUniform() * width);
            return new this(x2, y - height, x2 + width - 1, y - 1, x, y);
        }
        throw new Error("dx or dy must be 1 or -1");
    }
    /**
     * Room of random size, positioned around center coords
     */
    static createRandomCenter(cx, cy, options) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = rng["a" /* default */].getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = rng["a" /* default */].getUniformInt(min, max);
        let x1 = cx - Math.floor(rng["a" /* default */].getUniform() * width);
        let y1 = cy - Math.floor(rng["a" /* default */].getUniform() * height);
        let x2 = x1 + width - 1;
        let y2 = y1 + height - 1;
        return new this(x1, y1, x2, y2);
    }
    /**
     * Room of random size within a given dimensions
     */
    static createRandom(availWidth, availHeight, options) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = rng["a" /* default */].getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = rng["a" /* default */].getUniformInt(min, max);
        let left = availWidth - width - 1;
        let top = availHeight - height - 1;
        let x1 = 1 + Math.floor(rng["a" /* default */].getUniform() * left);
        let y1 = 1 + Math.floor(rng["a" /* default */].getUniform() * top);
        let x2 = x1 + width - 1;
        let y2 = y1 + height - 1;
        return new this(x1, y1, x2, y2);
    }
    addDoor(x, y) {
        this._doors[x + "," + y] = 1;
        return this;
    }
    /**
     * @param {function}
     */
    getDoors(cb) {
        for (let key in this._doors) {
            let parts = key.split(",");
            cb(parseInt(parts[0]), parseInt(parts[1]));
        }
        return this;
    }
    clearDoors() {
        this._doors = {};
        return this;
    }
    addDoors(isWallCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x != left && x != right && y != top && y != bottom) {
                    continue;
                }
                if (isWallCallback(x, y)) {
                    continue;
                }
                this.addDoor(x, y);
            }
        }
        return this;
    }
    debug() {
        console.log("room", this._x1, this._y1, this._x2, this._y2);
    }
    isValid(isWallCallback, canBeDugCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x == left || x == right || y == top || y == bottom) {
                    if (!isWallCallback(x, y)) {
                        return false;
                    }
                }
                else {
                    if (!canBeDugCallback(x, y)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
     */
    create(digCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;
        let value = 0;
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x + "," + y in this._doors) {
                    value = 2;
                }
                else if (x == left || x == right || y == top || y == bottom) {
                    value = 1;
                }
                else {
                    value = 0;
                }
                digCallback(x, y, value);
            }
        }
    }
    getCenter() {
        return [Math.round((this._x1 + this._x2) / 2), Math.round((this._y1 + this._y2) / 2)];
    }
    getLeft() { return this._x1; }
    getRight() { return this._x2; }
    getTop() { return this._y1; }
    getBottom() { return this._y2; }
}
/**
 * @class Corridor
 * @augments ROT.Map.Feature
 * @param {int} startX
 * @param {int} startY
 * @param {int} endX
 * @param {int} endY
 */
class features_Corridor extends Feature {
    constructor(startX, startY, endX, endY) {
        super();
        this._startX = startX;
        this._startY = startY;
        this._endX = endX;
        this._endY = endY;
        this._endsWithAWall = true;
    }
    static createRandomAt(x, y, dx, dy, options) {
        let min = options.corridorLength[0];
        let max = options.corridorLength[1];
        let length = rng["a" /* default */].getUniformInt(min, max);
        return new this(x, y, x + dx * length, y + dy * length);
    }
    debug() {
        console.log("corridor", this._startX, this._startY, this._endX, this._endY);
    }
    isValid(isWallCallback, canBeDugCallback) {
        let sx = this._startX;
        let sy = this._startY;
        let dx = this._endX - sx;
        let dy = this._endY - sy;
        let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        let nx = dy;
        let ny = -dx;
        let ok = true;
        for (let i = 0; i < length; i++) {
            let x = sx + i * dx;
            let y = sy + i * dy;
            if (!canBeDugCallback(x, y)) {
                ok = false;
            }
            if (!isWallCallback(x + nx, y + ny)) {
                ok = false;
            }
            if (!isWallCallback(x - nx, y - ny)) {
                ok = false;
            }
            if (!ok) {
                length = i;
                this._endX = x - dx;
                this._endY = y - dy;
                break;
            }
        }
        /**
         * If the length degenerated, this corridor might be invalid
         */
        /* not supported */
        if (length == 0) {
            return false;
        }
        /* length 1 allowed only if the next space is empty */
        if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
            return false;
        }
        /**
         * We do not want the corridor to crash into a corner of a room;
         * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
         *
         * Situation:
         * #######1
         * .......?
         * #######2
         *
         * The corridor was dug from left to right.
         * 1, 2 - problematic corners, ? = N+1th cell (not dug)
         */
        let firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
        let secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
        this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);
        if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) {
            return false;
        }
        return true;
    }
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
     */
    create(digCallback) {
        let sx = this._startX;
        let sy = this._startY;
        let dx = this._endX - sx;
        let dy = this._endY - sy;
        let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        for (let i = 0; i < length; i++) {
            let x = sx + i * dx;
            let y = sy + i * dy;
            digCallback(x, y, 0);
        }
        return true;
    }
    createPriorityWalls(priorityWallCallback) {
        if (!this._endsWithAWall) {
            return;
        }
        let sx = this._startX;
        let sy = this._startY;
        let dx = this._endX - sx;
        let dy = this._endY - sy;
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        let nx = dy;
        let ny = -dx;
        priorityWallCallback(this._endX + dx, this._endY + dy);
        priorityWallCallback(this._endX + nx, this._endY + ny);
        priorityWallCallback(this._endX - nx, this._endY - ny);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/uniform.js



;
/**
 * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
 * @augments ROT.Map.Dungeon
 */
class uniform_Uniform extends dungeon_Dungeon {
    constructor(width, height, options) {
        super(width, height);
        this._options = {
            roomWidth: [3, 9],
            roomHeight: [3, 5],
            roomDugPercentage: 0.1,
            timeLimit: 1000 /* we stop after this much time has passed (msec) */
        };
        Object.assign(this._options, options);
        this._map = [];
        this._dug = 0;
        this._roomAttempts = 20; /* new room is created N-times until is considered as impossible to generate */
        this._corridorAttempts = 20; /* corridors are tried N-times until the level is considered as impossible to connect */
        this._connected = []; /* list of already connected rooms */
        this._unconnected = []; /* list of remaining unconnected rooms */
        this._digCallback = this._digCallback.bind(this);
        this._canBeDugCallback = this._canBeDugCallback.bind(this);
        this._isWallCallback = this._isWallCallback.bind(this);
    }
    /**
     * Create a map. If the time limit has been hit, returns null.
     * @see ROT.Map#create
     */
    create(callback) {
        let t1 = Date.now();
        while (1) {
            let t2 = Date.now();
            if (t2 - t1 > this._options.timeLimit) {
                return null;
            } /* time limit! */
            this._map = this._fillMap(1);
            this._dug = 0;
            this._rooms = [];
            this._unconnected = [];
            this._generateRooms();
            if (this._rooms.length < 2) {
                continue;
            }
            if (this._generateCorridors()) {
                break;
            }
        }
        if (callback) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(i, j, this._map[i][j]);
                }
            }
        }
        return this;
    }
    /**
     * Generates a suitable amount of rooms
     */
    _generateRooms() {
        let w = this._width - 2;
        let h = this._height - 2;
        let room;
        do {
            room = this._generateRoom();
            if (this._dug / (w * h) > this._options.roomDugPercentage) {
                break;
            } /* achieved requested amount of free space */
        } while (room);
        /* either enough rooms, or not able to generate more of them :) */
    }
    /**
     * Try to generate one room
     */
    _generateRoom() {
        let count = 0;
        while (count < this._roomAttempts) {
            count++;
            let room = features_Room.createRandom(this._width, this._height, this._options);
            if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
                continue;
            }
            room.create(this._digCallback);
            this._rooms.push(room);
            return room;
        }
        /* no room was generated in a given number of attempts */
        return null;
    }
    /**
     * Generates connectors beween rooms
     * @returns {bool} success Was this attempt successfull?
     */
    _generateCorridors() {
        let cnt = 0;
        while (cnt < this._corridorAttempts) {
            cnt++;
            this._corridors = [];
            /* dig rooms into a clear map */
            this._map = this._fillMap(1);
            for (let i = 0; i < this._rooms.length; i++) {
                let room = this._rooms[i];
                room.clearDoors();
                room.create(this._digCallback);
            }
            this._unconnected = rng["a" /* default */].shuffle(this._rooms.slice());
            this._connected = [];
            if (this._unconnected.length) {
                this._connected.push(this._unconnected.pop());
            } /* first one is always connected */
            while (1) {
                /* 1. pick random connected room */
                let connected = rng["a" /* default */].getItem(this._connected);
                if (!connected) {
                    break;
                }
                /* 2. find closest unconnected */
                let room1 = this._closestRoom(this._unconnected, connected);
                if (!room1) {
                    break;
                }
                /* 3. connect it to closest connected */
                let room2 = this._closestRoom(this._connected, room1);
                if (!room2) {
                    break;
                }
                let ok = this._connectRooms(room1, room2);
                if (!ok) {
                    break;
                } /* stop connecting, re-shuffle */
                if (!this._unconnected.length) {
                    return true;
                } /* done; no rooms remain */
            }
        }
        return false;
    }
    ;
    /**
     * For a given room, find the closest one from the list
     */
    _closestRoom(rooms, room) {
        let dist = Infinity;
        let center = room.getCenter();
        let result = null;
        for (let i = 0; i < rooms.length; i++) {
            let r = rooms[i];
            let c = r.getCenter();
            let dx = c[0] - center[0];
            let dy = c[1] - center[1];
            let d = dx * dx + dy * dy;
            if (d < dist) {
                dist = d;
                result = r;
            }
        }
        return result;
    }
    _connectRooms(room1, room2) {
        /*
            room1.debug();
            room2.debug();
        */
        let center1 = room1.getCenter();
        let center2 = room2.getCenter();
        let diffX = center2[0] - center1[0];
        let diffY = center2[1] - center1[1];
        let start;
        let end;
        let dirIndex1, dirIndex2, min, max, index;
        if (Math.abs(diffX) < Math.abs(diffY)) { /* first try connecting north-south walls */
            dirIndex1 = (diffY > 0 ? 2 : 0);
            dirIndex2 = (dirIndex1 + 2) % 4;
            min = room2.getLeft();
            max = room2.getRight();
            index = 0;
        }
        else { /* first try connecting east-west walls */
            dirIndex1 = (diffX > 0 ? 1 : 3);
            dirIndex2 = (dirIndex1 + 2) % 4;
            min = room2.getTop();
            max = room2.getBottom();
            index = 1;
        }
        start = this._placeInWall(room1, dirIndex1); /* corridor will start here */
        if (!start) {
            return false;
        }
        if (start[index] >= min && start[index] <= max) { /* possible to connect with straight line (I-like) */
            end = start.slice();
            let value = 0;
            switch (dirIndex2) {
                case 0:
                    value = room2.getTop() - 1;
                    break;
                case 1:
                    value = room2.getRight() + 1;
                    break;
                case 2:
                    value = room2.getBottom() + 1;
                    break;
                case 3:
                    value = room2.getLeft() - 1;
                    break;
            }
            end[(index + 1) % 2] = value;
            this._digLine([start, end]);
        }
        else if (start[index] < min - 1 || start[index] > max + 1) { /* need to switch target wall (L-like) */
            let diff = start[index] - center2[index];
            let rotation = 0;
            switch (dirIndex2) {
                case 0:
                case 1:
                    rotation = (diff < 0 ? 3 : 1);
                    break;
                case 2:
                case 3:
                    rotation = (diff < 0 ? 1 : 3);
                    break;
            }
            dirIndex2 = (dirIndex2 + rotation) % 4;
            end = this._placeInWall(room2, dirIndex2);
            if (!end) {
                return false;
            }
            let mid = [0, 0];
            mid[index] = start[index];
            let index2 = (index + 1) % 2;
            mid[index2] = end[index2];
            this._digLine([start, mid, end]);
        }
        else { /* use current wall pair, but adjust the line in the middle (S-like) */
            let index2 = (index + 1) % 2;
            end = this._placeInWall(room2, dirIndex2);
            if (!end) {
                return false;
            }
            let mid = Math.round((end[index2] + start[index2]) / 2);
            let mid1 = [0, 0];
            let mid2 = [0, 0];
            mid1[index] = start[index];
            mid1[index2] = mid;
            mid2[index] = end[index];
            mid2[index2] = mid;
            this._digLine([start, mid1, mid2, end]);
        }
        room1.addDoor(start[0], start[1]);
        room2.addDoor(end[0], end[1]);
        index = this._unconnected.indexOf(room1);
        if (index != -1) {
            this._unconnected.splice(index, 1);
            this._connected.push(room1);
        }
        index = this._unconnected.indexOf(room2);
        if (index != -1) {
            this._unconnected.splice(index, 1);
            this._connected.push(room2);
        }
        return true;
    }
    _placeInWall(room, dirIndex) {
        let start = [0, 0];
        let dir = [0, 0];
        let length = 0;
        switch (dirIndex) {
            case 0:
                dir = [1, 0];
                start = [room.getLeft(), room.getTop() - 1];
                length = room.getRight() - room.getLeft() + 1;
                break;
            case 1:
                dir = [0, 1];
                start = [room.getRight() + 1, room.getTop()];
                length = room.getBottom() - room.getTop() + 1;
                break;
            case 2:
                dir = [1, 0];
                start = [room.getLeft(), room.getBottom() + 1];
                length = room.getRight() - room.getLeft() + 1;
                break;
            case 3:
                dir = [0, 1];
                start = [room.getLeft() - 1, room.getTop()];
                length = room.getBottom() - room.getTop() + 1;
                break;
        }
        let avail = [];
        let lastBadIndex = -2;
        for (let i = 0; i < length; i++) {
            let x = start[0] + i * dir[0];
            let y = start[1] + i * dir[1];
            avail.push(null);
            let isWall = (this._map[x][y] == 1);
            if (isWall) {
                if (lastBadIndex != i - 1) {
                    avail[i] = [x, y];
                }
            }
            else {
                lastBadIndex = i;
                if (i) {
                    avail[i - 1] = null;
                }
            }
        }
        for (let i = avail.length - 1; i >= 0; i--) {
            if (!avail[i]) {
                avail.splice(i, 1);
            }
        }
        return (avail.length ? rng["a" /* default */].getItem(avail) : null);
    }
    /**
     * Dig a polyline.
     */
    _digLine(points) {
        for (let i = 1; i < points.length; i++) {
            let start = points[i - 1];
            let end = points[i];
            let corridor = new features_Corridor(start[0], start[1], end[0], end[1]);
            corridor.create(this._digCallback);
            this._corridors.push(corridor);
        }
    }
    _digCallback(x, y, value) {
        this._map[x][y] = value;
        if (value == 0) {
            this._dug++;
        }
    }
    _isWallCallback(x, y) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
    _canBeDugCallback(x, y) {
        if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/cellular.js



;
/**
 * @class Cellular automaton map generator
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
 * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
 * @param {int} [options.topology] Topology 4 or 6 or 8
 */
class cellular_Cellular extends map_Map {
    constructor(width, height, options = {}) {
        super(width, height);
        this._options = {
            born: [5, 6, 7, 8],
            survive: [4, 5, 6, 7, 8],
            topology: 8
        };
        this.setOptions(options);
        this._dirs = DIRS[this._options.topology];
        this._map = this._fillMap(0);
    }
    /**
     * Fill the map with random values
     * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
     */
    randomize(probability) {
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                this._map[i][j] = (rng["a" /* default */].getUniform() < probability ? 1 : 0);
            }
        }
        return this;
    }
    /**
     * Change options.
     * @see ROT.Map.Cellular
     */
    setOptions(options) { Object.assign(this._options, options); }
    set(x, y, value) { this._map[x][y] = value; }
    create(callback) {
        let newMap = this._fillMap(0);
        let born = this._options.born;
        let survive = this._options.survive;
        for (let j = 0; j < this._height; j++) {
            let widthStep = 1;
            let widthStart = 0;
            if (this._options.topology == 6) {
                widthStep = 2;
                widthStart = j % 2;
            }
            for (let i = widthStart; i < this._width; i += widthStep) {
                let cur = this._map[i][j];
                let ncount = this._getNeighbors(i, j);
                if (cur && survive.indexOf(ncount) != -1) { /* survive */
                    newMap[i][j] = 1;
                }
                else if (!cur && born.indexOf(ncount) != -1) { /* born */
                    newMap[i][j] = 1;
                }
            }
        }
        this._map = newMap;
        callback && this._serviceCallback(callback);
    }
    _serviceCallback(callback) {
        for (let j = 0; j < this._height; j++) {
            let widthStep = 1;
            let widthStart = 0;
            if (this._options.topology == 6) {
                widthStep = 2;
                widthStart = j % 2;
            }
            for (let i = widthStart; i < this._width; i += widthStep) {
                callback(i, j, this._map[i][j]);
            }
        }
    }
    /**
     * Get neighbor count at [i,j] in this._map
     */
    _getNeighbors(cx, cy) {
        let result = 0;
        for (let i = 0; i < this._dirs.length; i++) {
            let dir = this._dirs[i];
            let x = cx + dir[0];
            let y = cy + dir[1];
            if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
                continue;
            }
            result += (this._map[x][y] == 1 ? 1 : 0);
        }
        return result;
    }
    /**
     * Make sure every non-wall space is accessible.
     * @param {function} callback to call to display map when do
     * @param {int} value to consider empty space - defaults to 0
     * @param {function} callback to call when a new connection is made
     */
    connect(callback, value, connectionCallback) {
        if (!value)
            value = 0;
        let allFreeSpace = [];
        let notConnected = {};
        // find all free space
        let widthStep = 1;
        let widthStarts = [0, 0];
        if (this._options.topology == 6) {
            widthStep = 2;
            widthStarts = [0, 1];
        }
        for (let y = 0; y < this._height; y++) {
            for (let x = widthStarts[y % 2]; x < this._width; x += widthStep) {
                if (this._freeSpace(x, y, value)) {
                    let p = [x, y];
                    notConnected[this._pointKey(p)] = p;
                    allFreeSpace.push([x, y]);
                }
            }
        }
        let start = allFreeSpace[rng["a" /* default */].getUniformInt(0, allFreeSpace.length - 1)];
        let key = this._pointKey(start);
        let connected = {};
        connected[key] = start;
        delete notConnected[key];
        // find what's connected to the starting point
        this._findConnected(connected, notConnected, [start], false, value);
        while (Object.keys(notConnected).length > 0) {
            // find two points from notConnected to connected
            let p = this._getFromTo(connected, notConnected);
            let from = p[0]; // notConnected
            let to = p[1]; // connected
            // find everything connected to the starting point
            let local = {};
            local[this._pointKey(from)] = from;
            this._findConnected(local, notConnected, [from], true, value);
            // connect to a connected cell
            let tunnelFn = (this._options.topology == 6 ? this._tunnelToConnected6 : this._tunnelToConnected);
            tunnelFn.call(this, to, from, connected, notConnected, value, connectionCallback);
            // now all of local is connected
            for (let k in local) {
                let pp = local[k];
                this._map[pp[0]][pp[1]] = value;
                connected[k] = pp;
                delete notConnected[k];
            }
        }
        callback && this._serviceCallback(callback);
    }
    /**
     * Find random points to connect. Search for the closest point in the larger space.
     * This is to minimize the length of the passage while maintaining good performance.
     */
    _getFromTo(connected, notConnected) {
        let from = [0, 0], to = [0, 0], d;
        let connectedKeys = Object.keys(connected);
        let notConnectedKeys = Object.keys(notConnected);
        for (let i = 0; i < 5; i++) {
            if (connectedKeys.length < notConnectedKeys.length) {
                let keys = connectedKeys;
                to = connected[keys[rng["a" /* default */].getUniformInt(0, keys.length - 1)]];
                from = this._getClosest(to, notConnected);
            }
            else {
                let keys = notConnectedKeys;
                from = notConnected[keys[rng["a" /* default */].getUniformInt(0, keys.length - 1)]];
                to = this._getClosest(from, connected);
            }
            d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);
            if (d < 64) {
                break;
            }
        }
        // console.log(">>> connected=" + to + " notConnected=" + from + " dist=" + d);
        return [from, to];
    }
    _getClosest(point, space) {
        let minPoint = null;
        let minDist = null;
        for (let k in space) {
            let p = space[k];
            let d = (p[0] - point[0]) * (p[0] - point[0]) + (p[1] - point[1]) * (p[1] - point[1]);
            if (minDist == null || d < minDist) {
                minDist = d;
                minPoint = p;
            }
        }
        return minPoint;
    }
    _findConnected(connected, notConnected, stack, keepNotConnected, value) {
        while (stack.length > 0) {
            let p = stack.splice(0, 1)[0];
            let tests;
            if (this._options.topology == 6) {
                tests = [
                    [p[0] + 2, p[1]],
                    [p[0] + 1, p[1] - 1],
                    [p[0] - 1, p[1] - 1],
                    [p[0] - 2, p[1]],
                    [p[0] - 1, p[1] + 1],
                    [p[0] + 1, p[1] + 1],
                ];
            }
            else {
                tests = [
                    [p[0] + 1, p[1]],
                    [p[0] - 1, p[1]],
                    [p[0], p[1] + 1],
                    [p[0], p[1] - 1]
                ];
            }
            for (let i = 0; i < tests.length; i++) {
                let key = this._pointKey(tests[i]);
                if (connected[key] == null && this._freeSpace(tests[i][0], tests[i][1], value)) {
                    connected[key] = tests[i];
                    if (!keepNotConnected) {
                        delete notConnected[key];
                    }
                    stack.push(tests[i]);
                }
            }
        }
    }
    _tunnelToConnected(to, from, connected, notConnected, value, connectionCallback) {
        let a, b;
        if (from[0] < to[0]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        for (let xx = a[0]; xx <= b[0]; xx++) {
            this._map[xx][a[1]] = value;
            let p = [xx, a[1]];
            let pkey = this._pointKey(p);
            connected[pkey] = p;
            delete notConnected[pkey];
        }
        if (connectionCallback && a[0] < b[0]) {
            connectionCallback(a, [b[0], a[1]]);
        }
        // x is now fixed
        let x = b[0];
        if (from[1] < to[1]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        for (let yy = a[1]; yy < b[1]; yy++) {
            this._map[x][yy] = value;
            let p = [x, yy];
            let pkey = this._pointKey(p);
            connected[pkey] = p;
            delete notConnected[pkey];
        }
        if (connectionCallback && a[1] < b[1]) {
            connectionCallback([b[0], a[1]], [b[0], b[1]]);
        }
    }
    _tunnelToConnected6(to, from, connected, notConnected, value, connectionCallback) {
        let a, b;
        if (from[0] < to[0]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        // tunnel diagonally until horizontally level
        let xx = a[0];
        let yy = a[1];
        while (!(xx == b[0] && yy == b[1])) {
            let stepWidth = 2;
            if (yy < b[1]) {
                yy++;
                stepWidth = 1;
            }
            else if (yy > b[1]) {
                yy--;
                stepWidth = 1;
            }
            if (xx < b[0]) {
                xx += stepWidth;
            }
            else if (xx > b[0]) {
                xx -= stepWidth;
            }
            else if (b[1] % 2) {
                // Won't step outside map if destination on is map's right edge
                xx -= stepWidth;
            }
            else {
                // ditto for left edge
                xx += stepWidth;
            }
            this._map[xx][yy] = value;
            let p = [xx, yy];
            let pkey = this._pointKey(p);
            connected[pkey] = p;
            delete notConnected[pkey];
        }
        if (connectionCallback) {
            connectionCallback(from, to);
        }
    }
    _freeSpace(x, y, value) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] == value;
    }
    _pointKey(p) { return p[0] + "." + p[1]; }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/digger.js




const FEATURES = {
    "room": features_Room,
    "corridor": features_Corridor
};
/**
 * Random dungeon generator using human-like digging patterns.
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at
 * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
 */
class digger_Digger extends dungeon_Dungeon {
    constructor(width, height, options = {}) {
        super(width, height);
        this._options = Object.assign({
            roomWidth: [3, 9],
            roomHeight: [3, 5],
            corridorLength: [3, 10],
            dugPercentage: 0.2,
            timeLimit: 1000 /* we stop after this much time has passed (msec) */
        }, options);
        this._features = {
            "room": 4,
            "corridor": 4
        };
        this._map = [];
        this._featureAttempts = 20; /* how many times do we try to create a feature on a suitable wall */
        this._walls = {}; /* these are available for digging */
        this._dug = 0;
        this._digCallback = this._digCallback.bind(this);
        this._canBeDugCallback = this._canBeDugCallback.bind(this);
        this._isWallCallback = this._isWallCallback.bind(this);
        this._priorityWallCallback = this._priorityWallCallback.bind(this);
    }
    create(callback) {
        this._rooms = [];
        this._corridors = [];
        this._map = this._fillMap(1);
        this._walls = {};
        this._dug = 0;
        let area = (this._width - 2) * (this._height - 2);
        this._firstRoom();
        let t1 = Date.now();
        let priorityWalls;
        do {
            priorityWalls = 0;
            let t2 = Date.now();
            if (t2 - t1 > this._options.timeLimit) {
                break;
            }
            /* find a good wall */
            let wall = this._findWall();
            if (!wall) {
                break;
            } /* no more walls */
            let parts = wall.split(",");
            let x = parseInt(parts[0]);
            let y = parseInt(parts[1]);
            let dir = this._getDiggingDirection(x, y);
            if (!dir) {
                continue;
            } /* this wall is not suitable */
            //		console.log("wall", x, y);
            /* try adding a feature */
            let featureAttempts = 0;
            do {
                featureAttempts++;
                if (this._tryFeature(x, y, dir[0], dir[1])) { /* feature added */
                    //if (this._rooms.length + this._corridors.length == 2) { this._rooms[0].addDoor(x, y); } /* first room oficially has doors */
                    this._removeSurroundingWalls(x, y);
                    this._removeSurroundingWalls(x - dir[0], y - dir[1]);
                    break;
                }
            } while (featureAttempts < this._featureAttempts);
            for (let id in this._walls) {
                if (this._walls[id] > 1) {
                    priorityWalls++;
                }
            }
        } while (this._dug / area < this._options.dugPercentage || priorityWalls); /* fixme number of priority walls */
        this._addDoors();
        if (callback) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(i, j, this._map[i][j]);
                }
            }
        }
        this._walls = {};
        this._map = [];
        return this;
    }
    _digCallback(x, y, value) {
        if (value == 0 || value == 2) { /* empty */
            this._map[x][y] = 0;
            this._dug++;
        }
        else { /* wall */
            this._walls[x + "," + y] = 1;
        }
    }
    _isWallCallback(x, y) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
    _canBeDugCallback(x, y) {
        if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
    _priorityWallCallback(x, y) { this._walls[x + "," + y] = 2; }
    ;
    _firstRoom() {
        let cx = Math.floor(this._width / 2);
        let cy = Math.floor(this._height / 2);
        let room = features_Room.createRandomCenter(cx, cy, this._options);
        this._rooms.push(room);
        room.create(this._digCallback);
    }
    /**
     * Get a suitable wall
     */
    _findWall() {
        let prio1 = [];
        let prio2 = [];
        for (let id in this._walls) {
            let prio = this._walls[id];
            if (prio == 2) {
                prio2.push(id);
            }
            else {
                prio1.push(id);
            }
        }
        let arr = (prio2.length ? prio2 : prio1);
        if (!arr.length) {
            return null;
        } /* no walls :/ */
        let id = rng["a" /* default */].getItem(arr.sort()); // sort to make the order deterministic
        delete this._walls[id];
        return id;
    }
    /**
     * Tries adding a feature
     * @returns {bool} was this a successful try?
     */
    _tryFeature(x, y, dx, dy) {
        let featureName = rng["a" /* default */].getWeightedValue(this._features);
        let ctor = FEATURES[featureName];
        let feature = ctor.createRandomAt(x, y, dx, dy, this._options);
        if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
            //		console.log("not valid");
            //		feature.debug();
            return false;
        }
        feature.create(this._digCallback);
        //	feature.debug();
        if (feature instanceof features_Room) {
            this._rooms.push(feature);
        }
        if (feature instanceof features_Corridor) {
            feature.createPriorityWalls(this._priorityWallCallback);
            this._corridors.push(feature);
        }
        return true;
    }
    _removeSurroundingWalls(cx, cy) {
        let deltas = DIRS[4];
        for (let i = 0; i < deltas.length; i++) {
            let delta = deltas[i];
            let x = cx + delta[0];
            let y = cy + delta[1];
            delete this._walls[x + "," + y];
            x = cx + 2 * delta[0];
            y = cy + 2 * delta[1];
            delete this._walls[x + "," + y];
        }
    }
    /**
     * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
     */
    _getDiggingDirection(cx, cy) {
        if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) {
            return null;
        }
        let result = null;
        let deltas = DIRS[4];
        for (let i = 0; i < deltas.length; i++) {
            let delta = deltas[i];
            let x = cx + delta[0];
            let y = cy + delta[1];
            if (!this._map[x][y]) { /* there already is another empty neighbor! */
                if (result) {
                    return null;
                }
                result = delta;
            }
        }
        /* no empty neighbor */
        if (!result) {
            return null;
        }
        return [-result[0], -result[1]];
    }
    /**
     * Find empty spaces surrounding rooms, and apply doors.
     */
    _addDoors() {
        let data = this._map;
        function isWallCallback(x, y) {
            return (data[x][y] == 1);
        }
        ;
        for (let i = 0; i < this._rooms.length; i++) {
            let room = this._rooms[i];
            room.clearDoors();
            room.addDoors(isWallCallback);
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/ellermaze.js


/**
 * Join lists with "i" and "i+1"
 */
function addToList(i, L, R) {
    R[L[i + 1]] = R[i];
    L[R[i]] = L[i + 1];
    R[i] = i + 1;
    L[i + 1] = i;
}
/**
 * Remove "i" from its list
 */
function removeFromList(i, L, R) {
    R[L[i]] = R[i];
    L[R[i]] = L[i];
    R[i] = i;
    L[i] = i;
}
/**
 * Maze generator - Eller's algorithm
 * See http://homepages.cwi.nl/~tromp/maze.html for explanation
 */
class ellermaze_EllerMaze extends map_Map {
    create(callback) {
        let map = this._fillMap(1);
        let w = Math.ceil((this._width - 2) / 2);
        let rand = 9 / 24;
        let L = [];
        let R = [];
        for (let i = 0; i < w; i++) {
            L.push(i);
            R.push(i);
        }
        L.push(w - 1); /* fake stop-block at the right side */
        let j;
        for (j = 1; j + 3 < this._height; j += 2) {
            /* one row */
            for (let i = 0; i < w; i++) {
                /* cell coords (will be always empty) */
                let x = 2 * i + 1;
                let y = j;
                map[x][y] = 0;
                /* right connection */
                if (i != L[i + 1] && rng["a" /* default */].getUniform() > rand) {
                    addToList(i, L, R);
                    map[x + 1][y] = 0;
                }
                /* bottom connection */
                if (i != L[i] && rng["a" /* default */].getUniform() > rand) {
                    /* remove connection */
                    removeFromList(i, L, R);
                }
                else {
                    /* create connection */
                    map[x][y + 1] = 0;
                }
            }
        }
        /* last row */
        for (let i = 0; i < w; i++) {
            /* cell coords (will be always empty) */
            let x = 2 * i + 1;
            let y = j;
            map[x][y] = 0;
            /* right connection */
            if (i != L[i + 1] && (i == L[i] || rng["a" /* default */].getUniform() > rand)) {
                /* dig right also if the cell is separated, so it gets connected to the rest of maze */
                addToList(i, L, R);
                map[x + 1][y] = 0;
            }
            removeFromList(i, L, R);
        }
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                callback(i, j, map[i][j]);
            }
        }
        return this;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/dividedmaze.js


/**
 * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
 * @augments ROT.Map
 */
class dividedmaze_DividedMaze extends map_Map {
    constructor() {
        super(...arguments);
        this._stack = [];
        this._map = [];
    }
    create(callback) {
        let w = this._width;
        let h = this._height;
        this._map = [];
        for (let i = 0; i < w; i++) {
            this._map.push([]);
            for (let j = 0; j < h; j++) {
                let border = (i == 0 || j == 0 || i + 1 == w || j + 1 == h);
                this._map[i].push(border ? 1 : 0);
            }
        }
        this._stack = [
            [1, 1, w - 2, h - 2]
        ];
        this._process();
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                callback(i, j, this._map[i][j]);
            }
        }
        this._map = [];
        return this;
    }
    _process() {
        while (this._stack.length) {
            let room = this._stack.shift(); /* [left, top, right, bottom] */
            this._partitionRoom(room);
        }
    }
    _partitionRoom(room) {
        let availX = [];
        let availY = [];
        for (let i = room[0] + 1; i < room[2]; i++) {
            let top = this._map[i][room[1] - 1];
            let bottom = this._map[i][room[3] + 1];
            if (top && bottom && !(i % 2)) {
                availX.push(i);
            }
        }
        for (let j = room[1] + 1; j < room[3]; j++) {
            let left = this._map[room[0] - 1][j];
            let right = this._map[room[2] + 1][j];
            if (left && right && !(j % 2)) {
                availY.push(j);
            }
        }
        if (!availX.length || !availY.length) {
            return;
        }
        let x = rng["a" /* default */].getItem(availX);
        let y = rng["a" /* default */].getItem(availY);
        this._map[x][y] = 1;
        let walls = [];
        let w = [];
        walls.push(w); /* left part */
        for (let i = room[0]; i < x; i++) {
            this._map[i][y] = 1;
            w.push([i, y]);
        }
        w = [];
        walls.push(w); /* right part */
        for (let i = x + 1; i <= room[2]; i++) {
            this._map[i][y] = 1;
            w.push([i, y]);
        }
        w = [];
        walls.push(w); /* top part */
        for (let j = room[1]; j < y; j++) {
            this._map[x][j] = 1;
            w.push([x, j]);
        }
        w = [];
        walls.push(w); /* bottom part */
        for (let j = y + 1; j <= room[3]; j++) {
            this._map[x][j] = 1;
            w.push([x, j]);
        }
        let solid = rng["a" /* default */].getItem(walls);
        for (let i = 0; i < walls.length; i++) {
            let w = walls[i];
            if (w == solid) {
                continue;
            }
            let hole = rng["a" /* default */].getItem(w);
            this._map[hole[0]][hole[1]] = 0;
        }
        this._stack.push([room[0], room[1], x - 1, y - 1]); /* left top */
        this._stack.push([x + 1, room[1], room[2], y - 1]); /* right top */
        this._stack.push([room[0], y + 1, x - 1, room[3]]); /* left bottom */
        this._stack.push([x + 1, y + 1, room[2], room[3]]); /* right bottom */
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/iceymaze.js


/**
 * Icey's Maze generator
 * See http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze for explanation
 */
class iceymaze_IceyMaze extends map_Map {
    constructor(width, height, regularity = 0) {
        super(width, height);
        this._regularity = regularity;
        this._map = [];
    }
    create(callback) {
        let width = this._width;
        let height = this._height;
        let map = this._fillMap(1);
        width -= (width % 2 ? 1 : 2);
        height -= (height % 2 ? 1 : 2);
        let cx = 0;
        let cy = 0;
        let nx = 0;
        let ny = 0;
        let done = 0;
        let blocked = false;
        let dirs = [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ];
        do {
            cx = 1 + 2 * Math.floor(rng["a" /* default */].getUniform() * (width - 1) / 2);
            cy = 1 + 2 * Math.floor(rng["a" /* default */].getUniform() * (height - 1) / 2);
            if (!done) {
                map[cx][cy] = 0;
            }
            if (!map[cx][cy]) {
                this._randomize(dirs);
                do {
                    if (Math.floor(rng["a" /* default */].getUniform() * (this._regularity + 1)) == 0) {
                        this._randomize(dirs);
                    }
                    blocked = true;
                    for (let i = 0; i < 4; i++) {
                        nx = cx + dirs[i][0] * 2;
                        ny = cy + dirs[i][1] * 2;
                        if (this._isFree(map, nx, ny, width, height)) {
                            map[nx][ny] = 0;
                            map[cx + dirs[i][0]][cy + dirs[i][1]] = 0;
                            cx = nx;
                            cy = ny;
                            blocked = false;
                            done++;
                            break;
                        }
                    }
                } while (!blocked);
            }
        } while (done + 1 < width * height / 4);
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                callback(i, j, map[i][j]);
            }
        }
        this._map = [];
        return this;
    }
    _randomize(dirs) {
        for (let i = 0; i < 4; i++) {
            dirs[i][0] = 0;
            dirs[i][1] = 0;
        }
        switch (Math.floor(rng["a" /* default */].getUniform() * 4)) {
            case 0:
                dirs[0][0] = -1;
                dirs[1][0] = 1;
                dirs[2][1] = -1;
                dirs[3][1] = 1;
                break;
            case 1:
                dirs[3][0] = -1;
                dirs[2][0] = 1;
                dirs[1][1] = -1;
                dirs[0][1] = 1;
                break;
            case 2:
                dirs[2][0] = -1;
                dirs[3][0] = 1;
                dirs[0][1] = -1;
                dirs[1][1] = 1;
                break;
            case 3:
                dirs[1][0] = -1;
                dirs[0][0] = 1;
                dirs[3][1] = -1;
                dirs[2][1] = 1;
                break;
        }
    }
    _isFree(map, x, y, width, height) {
        if (x < 1 || y < 1 || x >= width || y >= height) {
            return false;
        }
        return map[x][y];
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/rogue.js



/**
 * Dungeon generator which uses the "orginal" Rogue dungeon generation algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
 * @author hyakugei
 */
class rogue_Rogue extends map_Map {
    constructor(width, height, options) {
        super(width, height);
        this.map = [];
        this.rooms = [];
        this.connectedCells = [];
        options = Object.assign({
            cellWidth: 3,
            cellHeight: 3 //     ie. as an array with min-max values for each direction....
        }, options);
        /*
        Set the room sizes according to the over-all width of the map,
        and the cell sizes.
        */
        if (!options.hasOwnProperty("roomWidth")) {
            options["roomWidth"] = this._calculateRoomSize(this._width, options["cellWidth"]);
        }
        if (!options.hasOwnProperty("roomHeight")) {
            options["roomHeight"] = this._calculateRoomSize(this._height, options["cellHeight"]);
        }
        this._options = options;
    }
    create(callback) {
        this.map = this._fillMap(1);
        this.rooms = [];
        this.connectedCells = [];
        this._initRooms();
        this._connectRooms();
        this._connectUnconnectedRooms();
        this._createRandomRoomConnections();
        this._createRooms();
        this._createCorridors();
        if (callback) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(i, j, this.map[i][j]);
                }
            }
        }
        return this;
    }
    _calculateRoomSize(size, cell) {
        let max = Math.floor((size / cell) * 0.8);
        let min = Math.floor((size / cell) * 0.25);
        if (min < 2) {
            min = 2;
        }
        if (max < 2) {
            max = 2;
        }
        return [min, max];
    }
    _initRooms() {
        // create rooms array. This is the "grid" list from the algo.
        for (let i = 0; i < this._options.cellWidth; i++) {
            this.rooms.push([]);
            for (let j = 0; j < this._options.cellHeight; j++) {
                this.rooms[i].push({ "x": 0, "y": 0, "width": 0, "height": 0, "connections": [], "cellx": i, "celly": j });
            }
        }
    }
    _connectRooms() {
        //pick random starting grid
        let cgx = rng["a" /* default */].getUniformInt(0, this._options.cellWidth - 1);
        let cgy = rng["a" /* default */].getUniformInt(0, this._options.cellHeight - 1);
        let idx;
        let ncgx;
        let ncgy;
        let found = false;
        let room;
        let otherRoom;
        let dirToCheck;
        // find  unconnected neighbour cells
        do {
            //dirToCheck = [0, 1, 2, 3, 4, 5, 6, 7];
            dirToCheck = [0, 2, 4, 6];
            dirToCheck = rng["a" /* default */].shuffle(dirToCheck);
            do {
                found = false;
                idx = dirToCheck.pop();
                ncgx = cgx + DIRS[8][idx][0];
                ncgy = cgy + DIRS[8][idx][1];
                if (ncgx < 0 || ncgx >= this._options.cellWidth) {
                    continue;
                }
                if (ncgy < 0 || ncgy >= this._options.cellHeight) {
                    continue;
                }
                room = this.rooms[cgx][cgy];
                if (room["connections"].length > 0) {
                    // as long as this room doesn't already coonect to me, we are ok with it.
                    if (room["connections"][0][0] == ncgx && room["connections"][0][1] == ncgy) {
                        break;
                    }
                }
                otherRoom = this.rooms[ncgx][ncgy];
                if (otherRoom["connections"].length == 0) {
                    otherRoom["connections"].push([cgx, cgy]);
                    this.connectedCells.push([ncgx, ncgy]);
                    cgx = ncgx;
                    cgy = ncgy;
                    found = true;
                }
            } while (dirToCheck.length > 0 && found == false);
        } while (dirToCheck.length > 0);
    }
    _connectUnconnectedRooms() {
        //While there are unconnected rooms, try to connect them to a random connected neighbor
        //(if a room has no connected neighbors yet, just keep cycling, you'll fill out to it eventually).
        let cw = this._options.cellWidth;
        let ch = this._options.cellHeight;
        this.connectedCells = rng["a" /* default */].shuffle(this.connectedCells);
        let room;
        let otherRoom;
        let validRoom;
        for (let i = 0; i < this._options.cellWidth; i++) {
            for (let j = 0; j < this._options.cellHeight; j++) {
                room = this.rooms[i][j];
                if (room["connections"].length == 0) {
                    let directions = [0, 2, 4, 6];
                    directions = rng["a" /* default */].shuffle(directions);
                    validRoom = false;
                    do {
                        let dirIdx = directions.pop();
                        let newI = i + DIRS[8][dirIdx][0];
                        let newJ = j + DIRS[8][dirIdx][1];
                        if (newI < 0 || newI >= cw || newJ < 0 || newJ >= ch) {
                            continue;
                        }
                        otherRoom = this.rooms[newI][newJ];
                        validRoom = true;
                        if (otherRoom["connections"].length == 0) {
                            break;
                        }
                        for (let k = 0; k < otherRoom["connections"].length; k++) {
                            if (otherRoom["connections"][k][0] == i && otherRoom["connections"][k][1] == j) {
                                validRoom = false;
                                break;
                            }
                        }
                        if (validRoom) {
                            break;
                        }
                    } while (directions.length);
                    if (validRoom) {
                        room["connections"].push([otherRoom["cellx"], otherRoom["celly"]]);
                    }
                    else {
                        console.log("-- Unable to connect room.");
                    }
                }
            }
        }
    }
    _createRandomRoomConnections() {
        // Empty for now.
    }
    _createRooms() {
        let w = this._width;
        let h = this._height;
        let cw = this._options.cellWidth;
        let ch = this._options.cellHeight;
        let cwp = Math.floor(this._width / cw);
        let chp = Math.floor(this._height / ch);
        let roomw;
        let roomh;
        let roomWidth = this._options["roomWidth"];
        let roomHeight = this._options["roomHeight"];
        let sx;
        let sy;
        let otherRoom;
        for (let i = 0; i < cw; i++) {
            for (let j = 0; j < ch; j++) {
                sx = cwp * i;
                sy = chp * j;
                if (sx == 0) {
                    sx = 1;
                }
                if (sy == 0) {
                    sy = 1;
                }
                roomw = rng["a" /* default */].getUniformInt(roomWidth[0], roomWidth[1]);
                roomh = rng["a" /* default */].getUniformInt(roomHeight[0], roomHeight[1]);
                if (j > 0) {
                    otherRoom = this.rooms[i][j - 1];
                    while (sy - (otherRoom["y"] + otherRoom["height"]) < 3) {
                        sy++;
                    }
                }
                if (i > 0) {
                    otherRoom = this.rooms[i - 1][j];
                    while (sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
                        sx++;
                    }
                }
                let sxOffset = Math.round(rng["a" /* default */].getUniformInt(0, cwp - roomw) / 2);
                let syOffset = Math.round(rng["a" /* default */].getUniformInt(0, chp - roomh) / 2);
                while (sx + sxOffset + roomw >= w) {
                    if (sxOffset) {
                        sxOffset--;
                    }
                    else {
                        roomw--;
                    }
                }
                while (sy + syOffset + roomh >= h) {
                    if (syOffset) {
                        syOffset--;
                    }
                    else {
                        roomh--;
                    }
                }
                sx = sx + sxOffset;
                sy = sy + syOffset;
                this.rooms[i][j]["x"] = sx;
                this.rooms[i][j]["y"] = sy;
                this.rooms[i][j]["width"] = roomw;
                this.rooms[i][j]["height"] = roomh;
                for (let ii = sx; ii < sx + roomw; ii++) {
                    for (let jj = sy; jj < sy + roomh; jj++) {
                        this.map[ii][jj] = 0;
                    }
                }
            }
        }
    }
    _getWallPosition(aRoom, aDirection) {
        let rx;
        let ry;
        let door;
        if (aDirection == 1 || aDirection == 3) {
            rx = rng["a" /* default */].getUniformInt(aRoom["x"] + 1, aRoom["x"] + aRoom["width"] - 2);
            if (aDirection == 1) {
                ry = aRoom["y"] - 2;
                door = ry + 1;
            }
            else {
                ry = aRoom["y"] + aRoom["height"] + 1;
                door = ry - 1;
            }
            this.map[rx][door] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
        }
        else {
            ry = rng["a" /* default */].getUniformInt(aRoom["y"] + 1, aRoom["y"] + aRoom["height"] - 2);
            if (aDirection == 2) {
                rx = aRoom["x"] + aRoom["width"] + 1;
                door = rx - 1;
            }
            else {
                rx = aRoom["x"] - 2;
                door = rx + 1;
            }
            this.map[door][ry] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
        }
        return [rx, ry];
    }
    _drawCorridor(startPosition, endPosition) {
        let xOffset = endPosition[0] - startPosition[0];
        let yOffset = endPosition[1] - startPosition[1];
        let xpos = startPosition[0];
        let ypos = startPosition[1];
        let tempDist;
        let xDir;
        let yDir;
        let move; // 2 element array, element 0 is the direction, element 1 is the total value to move.
        let moves = []; // a list of 2 element arrays
        let xAbs = Math.abs(xOffset);
        let yAbs = Math.abs(yOffset);
        let percent = rng["a" /* default */].getUniform(); // used to split the move at different places along the long axis
        let firstHalf = percent;
        let secondHalf = 1 - percent;
        xDir = xOffset > 0 ? 2 : 6;
        yDir = yOffset > 0 ? 4 : 0;
        if (xAbs < yAbs) {
            // move firstHalf of the y offset
            tempDist = Math.ceil(yAbs * firstHalf);
            moves.push([yDir, tempDist]);
            // move all the x offset
            moves.push([xDir, xAbs]);
            // move sendHalf of the  y offset
            tempDist = Math.floor(yAbs * secondHalf);
            moves.push([yDir, tempDist]);
        }
        else {
            //  move firstHalf of the x offset
            tempDist = Math.ceil(xAbs * firstHalf);
            moves.push([xDir, tempDist]);
            // move all the y offset
            moves.push([yDir, yAbs]);
            // move secondHalf of the x offset.
            tempDist = Math.floor(xAbs * secondHalf);
            moves.push([xDir, tempDist]);
        }
        this.map[xpos][ypos] = 0;
        while (moves.length > 0) {
            move = moves.pop();
            while (move[1] > 0) {
                xpos += DIRS[8][move[0]][0];
                ypos += DIRS[8][move[0]][1];
                this.map[xpos][ypos] = 0;
                move[1] = move[1] - 1;
            }
        }
    }
    _createCorridors() {
        // Draw Corridors between connected rooms
        let cw = this._options.cellWidth;
        let ch = this._options.cellHeight;
        let room;
        let connection;
        let otherRoom;
        let wall;
        let otherWall;
        for (let i = 0; i < cw; i++) {
            for (let j = 0; j < ch; j++) {
                room = this.rooms[i][j];
                for (let k = 0; k < room["connections"].length; k++) {
                    connection = room["connections"][k];
                    otherRoom = this.rooms[connection[0]][connection[1]];
                    // figure out what wall our corridor will start one.
                    // figure out what wall our corridor will end on.
                    if (otherRoom["cellx"] > room["cellx"]) {
                        wall = 2;
                        otherWall = 4;
                    }
                    else if (otherRoom["cellx"] < room["cellx"]) {
                        wall = 4;
                        otherWall = 2;
                    }
                    else if (otherRoom["celly"] > room["celly"]) {
                        wall = 3;
                        otherWall = 1;
                    }
                    else {
                        wall = 1;
                        otherWall = 3;
                    }
                    this._drawCorridor(this._getWallPosition(room, wall), this._getWallPosition(otherRoom, otherWall));
                }
            }
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/index.js








/* harmony default export */ var lib_map = ({ Arena: arena_Arena, Uniform: uniform_Uniform, Cellular: cellular_Cellular, Digger: digger_Digger, EllerMaze: ellermaze_EllerMaze, DividedMaze: dividedmaze_DividedMaze, IceyMaze: iceymaze_IceyMaze, Rogue: rogue_Rogue });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/noise/noise.js
/**
 * Base noise generator
 */
class Noise {
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/noise/simplex.js



const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
/**
 * A simple 2d implementation of simplex noise by Ondrej Zara
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 */
class simplex_Simplex extends Noise {
    /**
     * @param gradients Random gradients
     */
    constructor(gradients = 256) {
        super();
        this._gradients = [
            [0, -1],
            [1, -1],
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1],
            [-1, 0],
            [-1, -1]
        ];
        let permutations = [];
        for (let i = 0; i < gradients; i++) {
            permutations.push(i);
        }
        permutations = rng["a" /* default */].shuffle(permutations);
        this._perms = [];
        this._indexes = [];
        for (let i = 0; i < 2 * gradients; i++) {
            this._perms.push(permutations[i % gradients]);
            this._indexes.push(this._perms[i] % this._gradients.length);
        }
    }
    get(xin, yin) {
        let perms = this._perms;
        let indexes = this._indexes;
        let count = perms.length / 2;
        let n0 = 0, n1 = 0, n2 = 0, gi; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        let s = (xin + yin) * F2; // Hairy factor for 2D
        let i = Math.floor(xin + s);
        let j = Math.floor(yin + s);
        let t = (i + j) * G2;
        let X0 = i - t; // Unskew the cell origin back to (x,y) space
        let Y0 = j - t;
        let x0 = xin - X0; // The x,y distances from the cell origin
        let y0 = yin - Y0;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        }
        else { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            i1 = 0;
            j1 = 1;
        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        let x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
        let y2 = y0 - 1 + 2 * G2;
        // Work out the hashed gradient indices of the three simplex corners
        let ii = Object(util["mod"])(i, count);
        let jj = Object(util["mod"])(j, count);
        // Calculate the contribution from the three corners
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            t0 *= t0;
            gi = indexes[ii + perms[jj]];
            let grad = this._gradients[gi];
            n0 = t0 * t0 * (grad[0] * x0 + grad[1] * y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            t1 *= t1;
            gi = indexes[ii + i1 + perms[jj + j1]];
            let grad = this._gradients[gi];
            n1 = t1 * t1 * (grad[0] * x1 + grad[1] * y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            t2 *= t2;
            gi = indexes[ii + 1 + perms[jj + 1]];
            let grad = this._gradients[gi];
            n2 = t2 * t2 * (grad[0] * x2 + grad[1] * y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70 * (n0 + n1 + n2);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/noise/index.js

/* harmony default export */ var noise = ({ Simplex: simplex_Simplex });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/path.js

/**
 * @class Abstract pathfinder
 * @param {int} toX Target X coord
 * @param {int} toY Target Y coord
 * @param {function} passableCallback Callback to determine map passability
 * @param {object} [options]
 * @param {int} [options.topology=8]
 */
class path_Path {
    constructor(toX, toY, passableCallback, options = {}) {
        this._toX = toX;
        this._toY = toY;
        this._passableCallback = passableCallback;
        this._options = Object.assign({
            topology: 8
        }, options);
        this._dirs = DIRS[this._options.topology];
        if (this._options.topology == 8) { /* reorder dirs for more aesthetic result (vertical/horizontal first) */
            this._dirs = [
                this._dirs[0],
                this._dirs[2],
                this._dirs[4],
                this._dirs[6],
                this._dirs[1],
                this._dirs[3],
                this._dirs[5],
                this._dirs[7]
            ];
        }
    }
    _getNeighbors(cx, cy) {
        let result = [];
        for (let i = 0; i < this._dirs.length; i++) {
            let dir = this._dirs[i];
            let x = cx + dir[0];
            let y = cy + dir[1];
            if (!this._passableCallback(x, y)) {
                continue;
            }
            result.push([x, y]);
        }
        return result;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/dijkstra.js

/**
 * @class Simplified Dijkstra's algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
class dijkstra_Dijkstra extends path_Path {
    constructor(toX, toY, passableCallback, options) {
        super(toX, toY, passableCallback, options);
        this._computed = {};
        this._todo = [];
        this._add(toX, toY, null);
    }
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */
    compute(fromX, fromY, callback) {
        let key = fromX + "," + fromY;
        if (!(key in this._computed)) {
            this._compute(fromX, fromY);
        }
        if (!(key in this._computed)) {
            return;
        }
        let item = this._computed[key];
        while (item) {
            callback(item.x, item.y);
            item = item.prev;
        }
    }
    /**
     * Compute a non-cached value
     */
    _compute(fromX, fromY) {
        while (this._todo.length) {
            let item = this._todo.shift();
            if (item.x == fromX && item.y == fromY) {
                return;
            }
            let neighbors = this._getNeighbors(item.x, item.y);
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
                let x = neighbor[0];
                let y = neighbor[1];
                let id = x + "," + y;
                if (id in this._computed) {
                    continue;
                } /* already done */
                this._add(x, y, item);
            }
        }
    }
    _add(x, y, prev) {
        let obj = {
            x: x,
            y: y,
            prev: prev
        };
        this._computed[x + "," + y] = obj;
        this._todo.push(obj);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/astar.js

/**
 * @class Simplified A* algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
class astar_AStar extends path_Path {
    constructor(toX, toY, passableCallback, options = {}) {
        super(toX, toY, passableCallback, options);
        this._todo = [];
        this._done = {};
    }
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */
    compute(fromX, fromY, callback) {
        this._todo = [];
        this._done = {};
        this._fromX = fromX;
        this._fromY = fromY;
        this._add(this._toX, this._toY, null);
        while (this._todo.length) {
            let item = this._todo.shift();
            let id = item.x + "," + item.y;
            if (id in this._done) {
                continue;
            }
            this._done[id] = item;
            if (item.x == fromX && item.y == fromY) {
                break;
            }
            let neighbors = this._getNeighbors(item.x, item.y);
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
                let x = neighbor[0];
                let y = neighbor[1];
                let id = x + "," + y;
                if (id in this._done) {
                    continue;
                }
                this._add(x, y, item);
            }
        }
        let item = this._done[fromX + "," + fromY];
        if (!item) {
            return;
        }
        while (item) {
            callback(item.x, item.y);
            item = item.prev;
        }
    }
    _add(x, y, prev) {
        let h = this._distance(x, y);
        let obj = {
            x: x,
            y: y,
            prev: prev,
            g: (prev ? prev.g + 1 : 0),
            h: h
        };
        /* insert into priority queue */
        let f = obj.g + obj.h;
        for (let i = 0; i < this._todo.length; i++) {
            let item = this._todo[i];
            let itemF = item.g + item.h;
            if (f < itemF || (f == itemF && h < item.h)) {
                this._todo.splice(i, 0, obj);
                return;
            }
        }
        this._todo.push(obj);
    }
    _distance(x, y) {
        switch (this._options.topology) {
            case 4:
                return (Math.abs(x - this._fromX) + Math.abs(y - this._fromY));
                break;
            case 6:
                let dx = Math.abs(x - this._fromX);
                let dy = Math.abs(y - this._fromY);
                return dy + Math.max(0, (dx - dy) / 2);
                break;
            case 8:
                return Math.max(Math.abs(x - this._fromX), Math.abs(y - this._fromY));
                break;
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/index.js


/* harmony default export */ var path = ({ Dijkstra: dijkstra_Dijkstra, AStar: astar_AStar });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/engine.js
/**
 * @class Asynchronous main loop
 * @param {ROT.Scheduler} scheduler
 */
class Engine {
    constructor(scheduler) {
        this._scheduler = scheduler;
        this._lock = 1;
    }
    /**
     * Start the main loop. When this call returns, the loop is locked.
     */
    start() { return this.unlock(); }
    /**
     * Interrupt the engine by an asynchronous action
     */
    lock() {
        this._lock++;
        return this;
    }
    /**
     * Resume execution (paused by a previous lock)
     */
    unlock() {
        if (!this._lock) {
            throw new Error("Cannot unlock unlocked engine");
        }
        this._lock--;
        while (!this._lock) {
            let actor = this._scheduler.next();
            if (!actor) {
                return this.lock();
            } /* no actors */
            let result = actor.act();
            if (result && result.then) { /* actor returned a "thenable", looks like a Promise */
                this.lock();
                result.then(this.unlock.bind(this));
            }
        }
        return this;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/lighting.js

;
;
;
;
/**
 * Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 */
class lighting_Lighting {
    constructor(reflectivityCallback, options = {}) {
        this._reflectivityCallback = reflectivityCallback;
        this._options = {};
        options = Object.assign({
            passes: 1,
            emissionThreshold: 100,
            range: 10
        }, options);
        this._lights = {};
        this._reflectivityCache = {};
        this._fovCache = {};
        this.setOptions(options);
    }
    /**
     * Adjust options at runtime
     */
    setOptions(options) {
        Object.assign(this._options, options);
        if (options && options.range) {
            this.reset();
        }
        return this;
    }
    /**
     * Set the used Field-Of-View algo
     */
    setFOV(fov) {
        this._fov = fov;
        this._fovCache = {};
        return this;
    }
    /**
     * Set (or remove) a light source
     */
    setLight(x, y, color) {
        let key = x + "," + y;
        if (color) {
            this._lights[key] = (typeof (color) == "string" ? lib_color["fromString"](color) : color);
        }
        else {
            delete this._lights[key];
        }
        return this;
    }
    /**
     * Remove all light sources
     */
    clearLights() { this._lights = {}; }
    /**
     * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
     */
    reset() {
        this._reflectivityCache = {};
        this._fovCache = {};
        return this;
    }
    /**
     * Compute the lighting
     */
    compute(lightingCallback) {
        let doneCells = {};
        let emittingCells = {};
        let litCells = {};
        for (let key in this._lights) { /* prepare emitters for first pass */
            let light = this._lights[key];
            emittingCells[key] = [0, 0, 0];
            lib_color["add_"](emittingCells[key], light);
        }
        for (let i = 0; i < this._options.passes; i++) { /* main loop */
            this._emitLight(emittingCells, litCells, doneCells);
            if (i + 1 == this._options.passes) {
                continue;
            } /* not for the last pass */
            emittingCells = this._computeEmitters(litCells, doneCells);
        }
        for (let litKey in litCells) { /* let the user know what and how is lit */
            let parts = litKey.split(",");
            let x = parseInt(parts[0]);
            let y = parseInt(parts[1]);
            lightingCallback(x, y, litCells[litKey]);
        }
        return this;
    }
    /**
     * Compute one iteration from all emitting cells
     * @param emittingCells These emit light
     * @param litCells Add projected light to these
     * @param doneCells These already emitted, forbid them from further calculations
     */
    _emitLight(emittingCells, litCells, doneCells) {
        for (let key in emittingCells) {
            let parts = key.split(",");
            let x = parseInt(parts[0]);
            let y = parseInt(parts[1]);
            this._emitLightFromCell(x, y, emittingCells[key], litCells);
            doneCells[key] = 1;
        }
        return this;
    }
    /**
     * Prepare a list of emitters for next pass
     */
    _computeEmitters(litCells, doneCells) {
        let result = {};
        for (let key in litCells) {
            if (key in doneCells) {
                continue;
            } /* already emitted */
            let color = litCells[key];
            let reflectivity;
            if (key in this._reflectivityCache) {
                reflectivity = this._reflectivityCache[key];
            }
            else {
                let parts = key.split(",");
                let x = parseInt(parts[0]);
                let y = parseInt(parts[1]);
                reflectivity = this._reflectivityCallback(x, y);
                this._reflectivityCache[key] = reflectivity;
            }
            if (reflectivity == 0) {
                continue;
            } /* will not reflect at all */
            /* compute emission color */
            let emission = [0, 0, 0];
            let intensity = 0;
            for (let i = 0; i < 3; i++) {
                let part = Math.round(color[i] * reflectivity);
                emission[i] = part;
                intensity += part;
            }
            if (intensity > this._options.emissionThreshold) {
                result[key] = emission;
            }
        }
        return result;
    }
    /**
     * Compute one iteration from one cell
     */
    _emitLightFromCell(x, y, color, litCells) {
        let key = x + "," + y;
        let fov;
        if (key in this._fovCache) {
            fov = this._fovCache[key];
        }
        else {
            fov = this._updateFOV(x, y);
        }
        for (let fovKey in fov) {
            let formFactor = fov[fovKey];
            let result;
            if (fovKey in litCells) { /* already lit */
                result = litCells[fovKey];
            }
            else { /* newly lit */
                result = [0, 0, 0];
                litCells[fovKey] = result;
            }
            for (let i = 0; i < 3; i++) {
                result[i] += Math.round(color[i] * formFactor);
            } /* add light color */
        }
        return this;
    }
    /**
     * Compute FOV ("form factor") for a potential light source at [x,y]
     */
    _updateFOV(x, y) {
        let key1 = x + "," + y;
        let cache = {};
        this._fovCache[key1] = cache;
        let range = this._options.range;
        function cb(x, y, r, vis) {
            let key2 = x + "," + y;
            let formFactor = vis * (1 - r / range);
            if (formFactor == 0) {
                return;
            }
            cache[key2] = formFactor;
        }
        ;
        this._fov.compute(x, y, range, cb.bind(this));
        return cache;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Util", function() { return Util; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Color", function() { return Color; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return Text; });
/* concated harmony reexport RNG */__webpack_require__.d(__webpack_exports__, "RNG", function() { return rng["a" /* default */]; });
/* concated harmony reexport Display */__webpack_require__.d(__webpack_exports__, "Display", function() { return display_Display; });
/* concated harmony reexport StringGenerator */__webpack_require__.d(__webpack_exports__, "StringGenerator", function() { return stringgenerator_StringGenerator; });
/* concated harmony reexport EventQueue */__webpack_require__.d(__webpack_exports__, "EventQueue", function() { return EventQueue; });
/* concated harmony reexport Scheduler */__webpack_require__.d(__webpack_exports__, "Scheduler", function() { return scheduler; });
/* concated harmony reexport FOV */__webpack_require__.d(__webpack_exports__, "FOV", function() { return fov; });
/* concated harmony reexport Map */__webpack_require__.d(__webpack_exports__, "Map", function() { return lib_map; });
/* concated harmony reexport Noise */__webpack_require__.d(__webpack_exports__, "Noise", function() { return noise; });
/* concated harmony reexport Path */__webpack_require__.d(__webpack_exports__, "Path", function() { return path; });
/* concated harmony reexport Engine */__webpack_require__.d(__webpack_exports__, "Engine", function() { return Engine; });
/* concated harmony reexport Lighting */__webpack_require__.d(__webpack_exports__, "Lighting", function() { return lighting_Lighting; });
/* concated harmony reexport DEFAULT_WIDTH */__webpack_require__.d(__webpack_exports__, "DEFAULT_WIDTH", function() { return DEFAULT_WIDTH; });
/* concated harmony reexport DEFAULT_HEIGHT */__webpack_require__.d(__webpack_exports__, "DEFAULT_HEIGHT", function() { return DEFAULT_HEIGHT; });
/* concated harmony reexport DIRS */__webpack_require__.d(__webpack_exports__, "DIRS", function() { return DIRS; });
/* concated harmony reexport KEYS */__webpack_require__.d(__webpack_exports__, "KEYS", function() { return KEYS; });













const Util = util;

const Color = lib_color;

const Text = text_namespaceObject;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Backend; });
/**
 * @class Abstract display backend module
 * @private
 */
class Backend {
    getContainer() { return null; }
    setOptions(options) { this._options = options; }
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);
// See: http://ondras.github.io/rot.js/manual/#rng

function setSeed(seed) {
	if (typeof seed !== 'number') {
		seed = makeSeed();
	}
	ROT.RNG.setSeed(seed);
}

function makeSeed() {
	return Math.round(Math.random() * 10000);
}

function roll(n, seed) {
	if (typeof seed === 'number') {
		setSeed(seed);
	}
	if (typeof n === 'number') {
		return Math.floor(ROT.RNG.getUniform() * n);
	}
	if (typeof n === 'string') {
		return rollDice(n, seed);
	}
}

function rollDice(str, seed) { // str like "1d4", "2d6", "3d8", "1d100"
	// TODO: handle "+", "-", other?
	const d = str.split('d');
	if (d.length !== 2) {
		const n = Number(str);
		// console.warn('Unexpected value:', str, '. Not valid dice notation. Using:', n);
		return roll(n, seed);
	}
	const numberOfDice = d[0];
	const numberOfSides = d[1];
	let sum = 0;
	for(let i = 0; i < numberOfDice; i++) {
		sum += roll(numberOfSides, seed);
	}
	return sum;
}

function getWeightedValue(obj, seed) {
	if (typeof seed === 'number') {
		setSeed(seed);
	}
	return ROT.RNG.getWeightedValue(obj);
}

function shuffle(arr) {
	return ROT.RNG.shuffle(arr);
}

function pickOne(arr) {
	return ROT.RNG.getItem(arr);
}

module.exports = {
	setSeed,
	makeSeed,
	roll,
	getWeightedValue,
	shuffle,
	pickOne
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Inventory = __webpack_require__(14);
const { DIRS_8 } = __webpack_require__(15);

class Item {
	constructor(options = {}) {
		this.type = options.type || null;
		this.name = options.name || 'nothing';
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.character = options.character || '^';
		this.surrounding = options.surrounding || [];
		this.color = options.color || '#05f';
		this.background = options.background || null;
		this.inventory = new Inventory({
			size: options.inventorySize || 0
		});
		this.isWeapon = Boolean(options.weapon);
		this.damage = parseInt(options.weapon, 10) || 0;
		this.isDefense = Boolean(options.defense);
		this.defense = parseInt(options.defense, 10) || 0;
		this.illumination = options.illumination || 0;
		this.portable = (typeof options.portable === 'boolean') ? options.portable : true;
		this.containedIn = null;
		this.actions = { ...options.on, ...options.actions }; // TODO: do we need the "on" alias?
		if (options.use) {
			this.actions.use = options.use;
		}
		this.states = options.states || {};
		this.teleport = null; // can this item move the character to another level, cell
	}

	hasAction(verb) {
		return Boolean(this.actions[verb]);
	}

	action(actionName, who) {
		const action = this.actions[actionName];
		let actionOutcome = {};
		if (typeof action === 'function') {
			actionOutcome = action(this, who);
		} else if (typeof action === 'object' && action !== null) {
			actionOutcome = this.runAction(action, who);
		} else {
			console.warn('No action', actionName, 'for item', this);
		}
		return actionOutcome;
	}

	runAction(action = {}, who) { // TODO: move to game/level?
		let message = '';
		if (!this.requirementMet(action, who)) {
			message = (action.missingMessage) ? action.missingMessage : `Some requirement is not met to use the ${this.name}`;
			return { message };
		}
		this.removeRequirements(action);
		message = message + ((action.message) ? action.message : '');
		const effects = action.effects;
		return { message, effects };
	}

	removeRequirements(action = {}) {
		if (!action.requires) { return; }
		action.requires.forEach((requirement) => {
			const typeKey = requirement.item;
			if (typeKey) {
				this.inventory.removeType(typeKey);
			}
		});
	}

	requirementMet(action = {}, who) {
		if (!action.requires) {
			return true;
		}
		let met = 0;
		action.requires.forEach((requirement) => {
			if (requirement.item && this.inventory.containsType(requirement.item)) {
				met += 1;
			}
		});
		return met === action.requires.length;
	}

	draw(display, lighting = {}, inView = false) {
		if (this.containedIn || !inView) { // Not visible if in a container
			return false;
		}
		display.draw(this.x, this.y, this.character, this.color, this.background);
		if (this.surrounding.length) {
			this.surrounding.forEach((char, i) => {
				let { x, y } = DIRS_8[i];
				display.draw(this.x + x, this.y + y, char, this.color, this.background);
			});
		}
		return true;
	}

	addItem(item) { // mutates the item if successful
		if (this.inventory.isFull()) {
			return false;
		}
		const isAdded = this.inventory.add(item);
		if (!isAdded) {
			return false;
		}
		item.containedIn = this;
		return true;
	}

	//---- Inventory

	getContents(n) {
		return this.inventory.get(n);
	}

	hasContents() {
		return this.inventory.hasContents();
	}

	contains(itemName) {
		return this.inventory.contains(itemName);
	}

	hasSpace() {
		return this.inventory.hasSpace();
	}

	addToInventory(item) {
		return this.inventory.add(item);
	}

	//---- Sets

	setTeleport(options = {}) {
		const { levelIndex, x, y, verb } = options;
		this.teleport = { levelIndex, x, y };
		this.actions[verb] = 'teleport';
	}
}

module.exports = Item;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt(
		Math.pow((x1 - x2), 2)
		+ Math.pow((y1 - y2), 2)
	);
}

module.exports = {
	getDistance
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);
const Inventory = __webpack_require__(14);
const geometer = __webpack_require__(7);
const random = __webpack_require__(5);

class ActionVerbType {
	static get MOVE () {
		return 'move';
	}

	static get WAIT () {
		return 'wait';
	}
}

class FactionType {

	static get HUMAN () {
		return 'human';
	}

	static get MONSTER () {
		return 'monster';
	}

	static get NEUTRAL () {
		return 'neutral';
	}
}


class Actor {
	constructor(options = {}) {
		this.type = options.type;
		this.name = options.name || null;
		this.faction = options.faction || FactionType.MONSTER;
		this.isHero = Boolean(options.isHero);
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.character = options.character || 'M';
		this.originalCharacter = this.character;
		this.color = options.color || '#df2';
		this.originalColor = this.color;
		this.bloodColor = '#611';
		// this.game = options.game || console.error('must tie actor to game');
		this.inventory = new Inventory({
			size: options.inventorySize || 10
		});
		this.passable = false;
		this.actionQueue = [];
		this.maxMovement = this.isHero ? 1.42 : 1;
		this.sightRange = (typeof options.sightRange === 'number') ? options.sightRange : 6;
		this.target = null;
		this.aggro = options.aggro || 0; // Level will set this to 100 for monsters
		// stats
		this.hp = (options.hp || typeof options.hp === 'number') ? parseInt(options.hp, 10) : 2;
		this.hpMax = this.hp;
		this.ap = options.ap || 0;	// Attack/Arms
		this.apMax = this.ap;
		this.bp = options.bp || 0;	// Balance
		this.bpMax = this.bp;
		this.ep = options.ep || 0;	// Endurance
		this.epMax = this.ep;
		this.fp = options.fp || 0;		// Focus
		this.fpMax = this.fp;
		this.wp = options.wp || 0;		// Will(power)
		this.wpMax = this.wp;
		this.mp = options.mp || 0;		// Mana
		this.mpMax = this.mp;
		// advancement
		this.xp = options.xp || 0;
		this.score = options.score || 0;
		// abilities
		this.maxAbilities = 9;
		this.abilities = {};
		this.abilityList = [];
		// temporary
		this.initiativeBoost = 0;

		// all actors can carry currency
		// everything is boiled down to copper pieces
		// 100 copper = 1 silver
		// 100 silver = 1 gold
		this.currency = options.currency || 0;
	}

	draw(display, lighting = {}, inView = false) {
		if (!inView) {
			return false;
		}
		// TODO: adjust colors based on lighting and inView
		display.draw(this.x, this.y, this.character, this.color);
		return true;
	}

	queueAction(verb, params = {}) {
		const actionParams = { ...params, verb };
		this.actionQueue.push(actionParams);
	}

	clearQueue() {
		this.actionQueue.length = 0;
	}

	planAction(level, hero) {
		if (this.isHero) { return; }
		if (this.dead()) {
			this.clearQueue();
			return;
		}
		const distanceToHero = geometer.getDistance(this.x, this.y, hero.x, hero.y);
		const dangerouslyHurt = (this.hp <= 1);
		this.act = function () {
			console.log(`${this.name} acts`);
			// if (g.getActiveLevel() !== level) { return; }
		};
		if (this.aggro && distanceToHero <= this.getMaxSenseRange() && !hero.dead() && !dangerouslyHurt) {
			const map = level.getMap();
			this.clearQueue();
			this.setTarget(hero);
			this.setPathToTarget(map);
			if (this.atEndOfPath()) {
				this.queueAction('attack', { target: hero });
			} else if (this.actionQueue.length === 1) {
				this.clearQueue();
				this.queueAction('attack', { target: hero });
			}
		} else {
			if (this.atEndOfPath()) {
				this.setWanderPath(level);
			}
		}
		// console.log(`${this.name} plans`, this.actionQueue);
	}

	doAction() {
		if (this.dead()) { return { verb: 'rot' }; }
		const waitAction = { verb: ActionVerbType.WAIT };
		if (this.actionQueue.length === 0) { return waitAction; }
		let action = this.actionQueue.shift();
		const moveAlreadyThere = (action.verb === ActionVerbType.MOVE && action.x === this.x && action.y === this.y);
		const moveTooFar = (action.verb === ActionVerbType.MOVE && this.getDistanceToNextMove(action) > this.maxMovement);
		// console.log(this.name, this.x, this.y, action.verb, action.x, action.y, this.getDistanceToNextMove(), this.maxMovement, moveTooFar, 'q', this.actionQueue.length);
		if (moveAlreadyThere) {
			return this.doAction();
		}
		if (moveTooFar) {
			action = this.doAction();
		}
		if (!action) {
			return waitAction;
		}
		return action;
	}

	attack(who) {
		console.log(`${this.name} attacks`, who);
		// TODO
	}

	setWanderPath(level) {
		const map = level.getMap();
		const { x, y } = level.findRandomFreeCell();
		this.setPathTo(map, x, y);
	}

	atEndOfPath() {
		const nextAction = this.getNextAction();
		if (!nextAction) { return true; }
		return (nextAction.verb === ActionVerbType.MOVE) ? false : true;
	}

	wait() {
		this.healPools();
	}

	//---- Movement

	move(x, y) {
		this.x += parseInt(x, 10);
		this.y += parseInt(y, 10);
	}

	moveTo(x, y) {
		this.setCoordinates(x, y);
	}

	//---- Combat

	attackDamage(opponent) {
		return 1;
	}

	wound(n) {
		return this.heal(n * -1);
	}

	heal(n) {
		const originalHp = this.hp;
		this.hp += parseInt(n, 10);
		this.hp = Math.min(this.hp, this.hpMax);
		this.checkDeath();
		return this.hp - originalHp;
	}

	dead() {
		return (this.hp <= 0);
	}

	checkDeath() {
		if (this.dead()) {
			this.character = 'X';
			this.color = this.bloodColor;
			this.passable = true;
		}
	}

	//---- Healing

	healPools() {
		this.healPool(this.getRandomPoolKey());
	}

	healPool(poolKey, amount = 1) {
		const a = this.getAbilityReadiedAmounts();
		const max = this[poolKey + 'Max'];
		if (a[poolKey] + this[poolKey] + amount <= max) {
			this[poolKey] += amount;
		} else {
			if (this.isHero) {
				console.log('No space to heal', poolKey, this);
			}
		}
	}

	damagePool(poolKey, amount = 1) {
		this[poolKey] -= amount;
		this[poolKey] = Math.max(0, this[poolKey]);
	}

	//---- Abilities

	hasAbility(abilityKey) {
		return Boolean(this.abilities[abilityKey]);
	}

	addAbility(abilityKey, abilityData) {
		if (this.abilityList.length >= this.maxAbilities) {
			return false;
		}
		if (this.hasAbility(abilityKey)) {
			console.warn('Cannot add ability twice - would override');
			return;
		}
		// TODO: move to Activity class?
		const ability = JSON.parse(JSON.stringify(abilityData));
		this.abilities[abilityKey] = ability;
		ability.isReadied = false;
		ability.key = abilityKey;
		this.abilityList.push(abilityKey);
		return ability;
	}

	getAbilityByIndex(i) {
		const key = this.abilityList[i];
		return this.abilities[key];
	}

	getAbilityReadiedAmounts() {
		const a = { hp: 0, ap: 0, bp: 0, ep: 0, fp: 0, wp: 0 };
		this.abilityList.forEach((abilityKey) => {
			const ability = this.abilities[abilityKey];
			Actor.loopOverAbilityCosts(ability, (costKey, val) => {
				if (ability.isReadied) {
					a[costKey] += val;
				}
			});
		});
		return a;
	}

	canReadyAbility(ability) {
		if (ability.isReadied) { return false; }
		let canReady = true;
		Actor.loopOverAbilityCosts(ability, (costKey, val) => {
			const poolAmount = this[costKey];
			if (val > poolAmount) {
				canReady = false;
			}
		});
		return canReady;
	}

	readyAbilityByIndex(i) {
		const ability = this.getAbilityByIndex(i);
		if (!ability) { return false; }
		if (!this.canReadyAbility(ability)) { return false; }
		Actor.loopOverAbilityCosts(ability, (costKey, val) => {
			this[costKey] -= val;
		});
		ability.isReadied = true;
		return ability;
	}

	activateAbilities(eventName) {
		const triggeredAbilities = this.getTriggeredAbilities(eventName);
		let effects = [];
		triggeredAbilities.forEach((ability) => {
			ability.isReadied = false;
			effects = effects.concat(ability.effects);
		});
		return effects;
	}

	getTriggeredAbilities(eventName) {
		const triggeredAbilities = [];
		this.abilityList.forEach((abilityKey) => {
			const ability = this.abilities[abilityKey];
			if (ability.isReadied && ability.activateOn === eventName) {
				triggeredAbilities.push(ability);
			}
		});
		return triggeredAbilities;
	}

	static loopOverAbilityCosts(ability, fn) {
		const costs = Object.keys(ability.readyCost);
		costs.forEach((key) => {
			fn(key, parseInt(ability.readyCost[key], 10));
		});
	}

	static getAbilityEffectsString(ability) {
		let arr = [];
		ability.effects.forEach((effect) => {
			const words = (typeof effect === 'string') ? [effect] : Object.keys(effect);
			arr = arr.concat(words);
		});
		return arr.join(', ');
	}

	static getAbilityDescriptionHtml(ability) {
		let ready = 'Ready with';
		Actor.loopOverAbilityCosts(ability, (costKey, val) => {
			ready += ' ' + val + ' ' + costKey.toUpperCase();
		});
		const effects = Actor.getAbilityEffectsString(ability);
		return `<div class="ability-description">${ability.description}</div>
		<div class="ability-ready-with">${ready}</div>
		<div class="ability-activates-on">Activates on: ${ability.activateOn}</div>
		<div class="ability-effects">Causes: ${effects}</div>`;
	}

	//---- Experience

	gainRandomPoolMax() {
		const key = this.getRandomPoolKey() + 'Max';
		this[key] += 1;
	}

	gainRandomAbility(abilitiesData) {
		const abilityKeys = Object.keys(abilitiesData);
		let abilityKey = random.pickOne(abilityKeys);
		let attempts = 100;
		while (this.hasAbility(abilityKey) && attempts--) {
			abilityKey = random.pickOne(abilityKeys);
		}
		this.addAbility(abilityKey, abilitiesData[abilityKey]);
	}

	//---- Gets

	getRandomPoolKey() {
		return random.pickOne(['ap', 'bp', 'ep', 'wp']);
	}

	getMaxSenseRange() {
		return this.sightRange;
	}

	getNextAction() {
		return this.actionQueue[0];
	}

	getDistanceToNextMove(nextAction) {
		if (!nextAction) { nextAction = this.getNextAction(); }
		if (!nextAction) { return 0; }
		const { x, y } = nextAction;
		if (x !== undefined && y !== undefined) {
			return geometer.getDistance(x, y, this.x, this.y);
		}
		return null; // ?
	}

	getArmorDefense() {
		if (!this.isHero) {
			return 1; // TODO: change this so there is some kind of natural defense for monsters
		}
		let highestDefense = 0;
		this.inventory.loopOverContents((item) => {
			if (item.defense > highestDefense) {
				highestDefense = item.defense;
			}
		});
		return highestDefense;
	}

	getWeaponDamage() {
		if (!this.isHero) {
			return 1; // TODO: change this so there is some kind of natural damage for monsters
		}
		let highestDamage = 0;
		this.inventory.loopOverContents((item) => {
			if (item.damage > highestDamage) {
				highestDamage = item.damage;
			}
		});
		return highestDamage;
	}

	//---- Sets

	setCoordinates(x, y) {
		this.x = parseInt(x, 10);
		this.y = parseInt(y, 10);
	}

	setPathTo(map, x = 0, y = 0) {
		const passableCallback = function(x, y) {
			return map.getCellPassability(x, y);
		};
		const astar = new ROT.Path.AStar(x, y, passableCallback, { topology: 4 });
		const path = this.actionQueue;
		const pathCallback = function(x, y) {
			path.push({ x, y, verb: ActionVerbType.MOVE });
		};
		if (path[0] && path[0].x === this.x && path[0].y === this.y) {
			console.alert('removing first');
			path.shift();
		}
		astar.compute(this.x, this.y, pathCallback);
		return true;
	}

	setPathToTarget(map) {
		return this.setPathTo(map, this.target.x, this.target.y);
	}

	setTarget(target) {
		if (typeof target.x !== 'number' || typeof target.y !== 'number') {
			console.warn('Cannot set target to something without x,y');
			return;
		}
		this.target = target;
	}
}

module.exports = Actor;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Term; });
/* harmony import */ var _backend_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _color_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


function clearToAnsi(bg) {
    return `\x1b[0;48;5;${termcolor(bg)}m\x1b[2J`;
}
function colorToAnsi(fg, bg) {
    return `\x1b[0;38;5;${termcolor(fg)};48;5;${termcolor(bg)}m`;
}
function positionToAnsi(x, y) {
    return `\x1b[${y + 1};${x + 1}H`;
}
function termcolor(color) {
    const SRC_COLORS = 256.0;
    const DST_COLORS = 6.0;
    const COLOR_RATIO = DST_COLORS / SRC_COLORS;
    let rgb = _color_js__WEBPACK_IMPORTED_MODULE_1__["fromString"](color);
    let r = Math.floor(rgb[0] * COLOR_RATIO);
    let g = Math.floor(rgb[1] * COLOR_RATIO);
    let b = Math.floor(rgb[2] * COLOR_RATIO);
    return r * 36 + g * 6 + b * 1 + 16;
}
class Term extends _backend_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"] {
    constructor() {
        super();
        this._offset = [0, 0];
        this._cursor = [-1, -1];
        this._lastColor = "";
    }
    schedule(cb) { setTimeout(cb, 1000 / 60); }
    setOptions(options) {
        super.setOptions(options);
        let size = [options.width, options.height];
        let avail = this.computeSize();
        this._offset = avail.map((val, index) => Math.floor((val - size[index]) / 2));
    }
    clear() {
        process.stdout.write(clearToAnsi(this._options.bg));
    }
    draw(data, clearBefore) {
        // determine where to draw what with what colors
        let [x, y, ch, fg, bg] = data;
        // determine if we need to move the terminal cursor
        let dx = this._offset[0] + x;
        let dy = this._offset[1] + y;
        let size = this.computeSize();
        if (dx < 0 || dx >= size[0]) {
            return;
        }
        if (dy < 0 || dy >= size[1]) {
            return;
        }
        if (dx !== this._cursor[0] || dy !== this._cursor[1]) {
            process.stdout.write(positionToAnsi(dx, dy));
            this._cursor[0] = dx;
            this._cursor[1] = dy;
        }
        // terminals automatically clear, but if we're clearing when we're
        // not otherwise provided with a character, just use a space instead
        if (clearBefore) {
            if (!ch) {
                ch = " ";
            }
        }
        // if we're not clearing and not provided with a character, do nothing
        if (!ch) {
            return;
        }
        // determine if we need to change colors
        let newColor = colorToAnsi(fg, bg);
        if (newColor !== this._lastColor) {
            process.stdout.write(newColor);
            this._lastColor = newColor;
        }
        // write the provided symbol to the display
        let chars = [].concat(ch);
        process.stdout.write(chars[0]);
        // update our position, given that we wrote a character
        this._cursor[0]++;
        if (this._cursor[0] >= size[0]) {
            this._cursor[0] = 0;
            this._cursor[1]++;
        }
    }
    computeFontSize() { throw new Error("Terminal backend has no notion of font size"); }
    eventToPosition(x, y) { return [x, y]; }
    computeSize() { return [process.stdout.columns, process.stdout.rows]; }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(18)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const FontFaceObserver = __webpack_require__(20);

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


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);

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

	drawLevel(game, level, hero) {
		level.draw(this);
		if (!hero) { return; }
		hero.draw(this);
		this.drawInterface(game, hero);
	}

	drawHero(hero) {
		if (!hero) { return; }
		hero.draw(this);
	}

	drawDamage(isDamaged = false, options = {}) {
		// Override this
	}

	drawInterface(game = {}, hero = {}, options = {}) {
		// Override this
	}

	static getPoolSquares(value, max, used) {
		const maxLeft = max - value - used;
		let str = '';
		let i;
		for(i = 0; i < value; i++) { str += '■'; }
		for(i = 0; i < used; i++) { str += '▣'; }
		for(i = 0; i < maxLeft; i++) { str += '▢'; }
		return str;
	}

}

module.exports = Display;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const Map = __webpack_require__(13);
const Actor = __webpack_require__(8);
const Item = __webpack_require__(6);
const Prop = __webpack_require__(16);
const geometer = __webpack_require__(7);
const random = __webpack_require__(5);
const { DIRS_4, DIRS_8_DIAGNOLS } = __webpack_require__(15);

class Level {
	constructor(options = {}, refData = {}) {
		this.seed = options.seed || 1;
		this.name = options.name || 'Unknown level';
		this.description = options.description || null;
		this.levelIndex = options.levelIndex || 0;
		this.color = options.color || '#777';
		this.background = options.background || '#222';
		const mapOptions = {
			color: this.color,
			background: this.background,
			...options.map,
			seed: this.seed,
			generators: options.generators || {}
		};
		this.map = new Map(mapOptions);
		this.actors = [];
		this.items = [];
		this.props = [];
		this.actors = this.generateActors(options, refData);
		this.items = this.generateItems(options, refData.items);
		this.props = this.generateProps(options, refData.props);
		this.eye = { x: 0, y: 0, sightRange: 7 };
		this.customEffects = { ...options.customEffects };
	}

	draw(display) {
		display.clear();
		this.drawMap(display);
		this.drawProps(display);
		this.drawItems(display);
		this.drawActors(display);
	}

	drawMap(display) {
		this.map.forEachCell((cell, x, y) => {
			const inView = this.isInView(x, y);
			// TODO: improve this
			const fg = cell.getForegroundColor(inView);
			const bg = cell.getBackgroundColor(inView);
			display.draw(x, y, cell.character, fg, bg);
		});
	}

	drawProps(display) {
		this.props.forEach((prop) => {
			const lighting = this.map.getLightingAt(this.eye.x, this.eye.y);
			const inView = this.isInView(prop.x, prop.y);
			prop.draw(display, lighting, inView);
		});
	}

	drawItems(display) {
		this.items.forEach((item) => {
			const lighting = this.map.getLightingAt(this.eye.x, this.eye.y);
			const inView = this.isInView(item.x, item.y);
			item.draw(display, lighting, inView);
		});
	}

	drawActors(display) {
		// Draw dead first, then non-dead
		this.actors.forEach((actor) => {
			if (actor.dead()) {
				this.drawActor(display, actor);
			}
		});
		this.actors.forEach((actor) => {
			if (!actor.dead()) {
				this.drawActor(display, actor);
			}
		});
	}

	drawActor(display, actor) {
		const lighting = this.map.getLightingAt(this.eye.x, this.eye.y);
		const inView = this.isInView(actor.x, actor.y);
		actor.draw(display, lighting, inView);
	}

	isInView(x, y) { // TODO: optimize
		const r = geometer.getDistance(this.eye.x, this.eye.y, x, y); // TODO: allow more complicated POV
		return (r <= this.eye.sightRange);		
	}

	addItem(item) {
		this.items.push(item);
	}

	removeItem(item) {
		return this.removeThing('items', item);
	}

	addActor(actor) {
		this.actors.push(actor);
	}

	removeActor(actor) {
		return this.removeThing('actors', actor);
	}

	removeThing(property, thing) {
		const i = this[property].findIndex((a) => { return a === thing; });
		if (i <= -1) {
			console.warn('nothing found in', property);
			return;
		}
		const arr = this[property].splice(i, 1);
		return arr[0];		
	}

	findItem(x, y) {
		const foundThings = this.findItems(x, y);
		return (foundThings.length) ? foundThings[0] : null;
	}
	findItems(x, y) {
		return this.items.filter((item) => {
			return item.x === x && item.y === y && !item.containedIn;
		});
	}

	findProp(x, y) {
		const foundThings = this.findProps(x, y);
		return (foundThings.length) ? foundThings[0] : null;
	}
	findProps(x, y) {
		return this.props.filter((prop) => { return prop.x === x && prop.y === y; });
	}
	findPropsByType(type) {
		return this.props.filter((prop) => { return prop.type === type; });
	}

	findActor(x, y) {
		const foundThings = this.findActors(x, y);
		return (foundThings.length) ? foundThings[0] : null;
	}
	findActors(x, y) {
		return this.actors.filter((actor) => {
			return actor.x === x && actor.y === y && !actor.dead();
		});
	}

	findThingInView(what) { // 'actors', 'items', 'props'
		return this[what].filter((a) => this.isInView(a.x, a.y));
	}

	findActorsInView(excludeHero) {
		return this.actors.filter((a) => {
			const inView = this.isInView(a.x, a.y);
			if (excludeHero) {
				return inView && !a.isHero;
			}
			return inView;
		});
	}

	findEverythingInView(options = {}) {
		return this.findActorsInView(options.excludeHero)
			.concat(this.findThingInView('items'))
			.concat(this.findThingInView('props'));
	}

	findThings(x, y) {
		const props = this.findProps(x, y);
		const items = this.findItems(x, y);
		const allThings = props.concat(items);
		return allThings;
	}

	findThingsCardinal(x, y) {
		const props = this.findThingsByDirections('props', DIRS_4, x, y);
		const items = this.findThingsByDirections('items', DIRS_4, x, y);
		const allThings = props.concat(items);
		return allThings;
	}

	findThingsDiagnol(x, y) {
		const props = this.findThingsByDirections('props', DIRS_8_DIAGNOLS, x, y);
		const items = this.findThingsByDirections('items', DIRS_8_DIAGNOLS, x, y);
		const allThings = props.concat(items);
		return allThings;
	}

	findThingsByDirections(thingName, dirs, x, y) {
		const coords = [];
		dirs.forEach((dir) => { coords.push({ x: x + dir.x, y: y + dir.y }); });
		return this[thingName].filter((thing) => {
			const matches = coords.filter((xy) => {
				return xy.x === thing.x && xy.y === thing.y && !thing.containedIn
			});
			return matches.length > 0;
		});		
	}

	findThingSmart(x, y, perferredProperty) {
		let things = this.findThings(x, y);
		// console.log('find smart - on spot', things);
		if (!things.length) {
			things = this.findThingsCardinal(x, y);
			// console.log('find smart - cardinal', things);
			if (!things.length) {
				things = this.findThingsDiagnol(x, y);
				// console.log('find smart - diagnols', things);
			}
		}
		if (perferredProperty) {
			things.sort((a, b) => {
				// console.log(a, b, a[perferredProperty]);
				return b[perferredProperty];
			});
			// console.log("sorted", things);
		}
		return things[0];
	}

	findRandomFreeCell(seed, clearing, retries = 50) {
		let cell = this.map.getRandomFreeCell();
		if (!retries) {
			return cell;
		}
		const tryAgain = () => {
			return this.findRandomFreeCell(seed, clearing, (retries - 1));
		};
		if (this.findActors(cell.x, cell.y).length > 0) {
			return tryAgain();
		}
		if (this.findThings(cell.x, cell.y).length > 0) {
			return tryAgain();
		}
		if (this.findMapClearing(cell.x, cell.y) >= clearing) {
			return tryAgain();
		}
		return cell;
	}

	findMapClearing(x, y) {
		// TODO: loop
		return 0;
	}

	discoverCircle(x, y, radius) {
		return this.map.discoverCircle(x, y, radius);
	}

	// Actions

	useThing(actor, actionName, thing) {
		const outcome = thing.action(actionName, actor);
		if (typeof outcome !== 'object') {
			console.warn('action returns outcome that is not object', actionName, thing, outcome);
		}
		this.doEffects(outcome.effects, actor, actor);
		return outcome;
	}

	throw(actor, what, x, y) {
		const item = actor.inventory.remove(what);
		if (!item) { return false; }
		item.x = (typeof x === 'number') ? x : actor.x;
		item.y = (typeof y === 'number') ? y : actor.y;
		const containers = this.findThings(x, y).filter((thing) => {
			console.log(thing);
			return thing.hasSpace();
		});
		if (containers.length) {
			const container = containers[0];
			container.addToInventory(item);
			return `${actor.name} puts ${what.name} into the ${container.name}.`;
		}
		this.addItem(item);
		return `${actor.name} throws down a ${what.name}.`;
	}

	doInitiative() {
		const livingActors = this.actors.filter((actor) => !actor.dead());
		let orderedActors = random.shuffle(livingActors);
		// TODO: Look for initiative boost, put at top of list
	}

	static removeEffects(effects, key) {
		let i = effects.indexOf(key);
		while (i > -1) {
			effects.splice(i, 1);
			i = effects.indexOf(key);
		}
	}

	resolveRoundEffects() {
		this.actors.forEach((actor) => {
			const roundEffects = actor.activateAbilities('round');
			this.doEffects(roundEffects, actor, actor);
		});
	}

	resolveCombatEffects(attacker, defender) {
		let attackEffects = attacker.activateAbilities('attack');
		let defendEffects = defender.activateAbilities('attacked');
		let damageEffects;
		let damagedEffects;

		attackEffects.push('attack');

		console.log(attacker.name, JSON.stringify(attackEffects), 'vs', defender.name, JSON.stringify(defendEffects), defender);

		if (defendEffects.includes('cancelAttack')) {
			Level.removeEffects(attackEffects, 'attack');
		}

		if (attackEffects.includes('attack')) {
			attackEffects.push('weaponDamage');
		}
		if (attackEffects.includes('damage') || attackEffects.includes('weaponDamage')) {
			damageEffects = defender.activateAbilities('damage');
			attackEffects = attackEffects.concat(damageEffects);
			damagedEffects = defender.activateAbilities('damaged');
			defendEffects = defendEffects.concat(damagedEffects);
		}
		if (defendEffects.includes('cancelDamage') || attackEffects.includes('cancelDamage')) {
			Level.removeEffects(attackEffects, 'damage');
			Level.removeEffects(attackEffects, 'weaponDamage');
		}

		console.log(attacker.name, JSON.stringify(attackEffects), 'vs', JSON.stringify(defendEffects));

		const outcomeAttack = this.doEffects(attackEffects, attacker, defender);
		const outcomeDefend = this.doEffects(defendEffects, defender, attacker);

		// TODO: generate messages

		return { outcomeAttack, outcomeDefend, attackEffects, defendEffects };
	}

	doEffects(effects, actor, opponent) {
		let damage = 0;
		if (!effects) { return { damage }; }
		effects.forEach((effect) => {
			damage += this.doEffect(effect, actor, opponent);
		});
		return { damage };
	}

	doEffect(effect, actor, opponent) {
		console.log('doEffect', effect);
		let damage = 0;
		switch(effect) {
			case 'damage':
				damage += 1;
				opponent.wound(1);
			break;
			case 'weaponDamage':
				damage += actor.getWeaponDamage();
				opponent.wound(damage);
			break;
			case 'heal':
			case 'hp':
				actor.heal(1);
			break;
			case 'ap':
				actor.healPool('ap', 1);
			break;
			case 'bp':
				actor.healPool('bp', 1);
			break;
			case 'ep':
				actor.healPool('ep', 1);
			break;
			case 'moveSwitch': {
				const { x, y } = actor;
				actor.setCoordinates(opponent.x, opponent.y);
				opponent.setCoordinates(x, y);
			}
			break;
			case 'apDamage':
				actor.damagePool('ap', 1);
			break;
			case 'bpDamage':
				actor.damagePool('bp', 1);
			break;
			case 'epDamage':
				actor.damagePool('ep', 1);
			break;
			case 'push':
				this.pushActor(actor, opponent);
			break;
			case 'pushAoe':
				this.pushActor(actor, opponent);
				// TODO: Handle aoe --> everyone (accept opponent) around hitX, hitY gets knocked back
			break;
			case 'moveBack':
				this.pushActor(opponent, actor);
			break;
			case 'initiative':
				actor.initiativeBoost = 1;
			break;
			case "fire":
				// TODO:
			break;
			case "endGame":
				// TODO
			break;
			case "score1000":
				actor.score += 1000;
			break;
			default:
				this.doCustomEffect(effect, actor, opponent);
			break;
		}
		return damage;
	}

	doCustomEffect(effect, actor, opponent) {
		if (typeof this.customEffects[effect] === 'function') {
			this.customEffects[effect](effect, actor, opponent);
		}
	}

	pushActor(pusher, pushee) {
		const { x, y } = pusher;
		let moveX = pushee.x - x;
		let moveY = pushee.y - y;
		moveX = moveX / (moveX === 0 ? 1 : Math.abs(moveX));
		moveY = moveY / (moveY === 0 ? 1 : Math.abs(moveY));
		// console.log('pushing', pushee.name, moveX, moveY);
		pushee.move(moveX, moveY);
	}

	getActorsInitiativeOrdered() {
		const randomActors = random.shuffle(this.actors);
		const firstActors = [];
		let i = randomActors.length - 1;
		while (i--) {
			const actor = randomActors[i];
			if (actor.initiativeBoost > 0) {
				firstActors.push(actor);
				randomActors.splice(i, 1);
			}
		}
		return firstActors.concat(randomActors);
	}

	coolOffInitiativeBoosts() {
		this.actors.forEach((actor) => {
			actor.initiativeBoost = 0;
		});
	}

	// Generation

	generateItem(levelItem = {}, Class, seed = 0, types = [], background = undefined) {
		const { x, y } = this.findRandomFreeCell(seed, levelItem.clearing);
		const itemTypeOptions = (levelItem.type && types[levelItem.type]) ? types[levelItem.type] : {};
		const itemOptions = {
			x, y,
			...itemTypeOptions,
			...levelItem
		};
		if (background) { itemOptions.background = background; }
		const item = new Class(itemOptions);
		return item;
	}

	generateItems(options = {}, itemTypes = {}) {
		let seed = this.seed + 200;
		let { items = [] } = options;

		const arr = [];
		items.forEach((levelItem) => {
			const quantity = (typeof levelItem.quantity === 'number') ? levelItem.quantity : 1;
			// TODO: handle weight, etc.
			for (let i = 0; i < quantity; i++) {
				const item = this.generateItem(levelItem, Item, ++seed, itemTypes);
				arr.push(item);
			}
		});
		return arr;
	}

	generateProps(options = {}, propTypes = {}) {
		let seed = this.seed + 100;
		let { props = [] } = options;
		const background = this.background;

		const arr = [];
		props.forEach((levelProp) => {
			const quantity = (typeof levelProp.quantity === 'number') ? levelProp.quantity : 1;
			// TODO: handle weight, etc.
			for (let i = 0; i < quantity; i++) {
				const prop = this.generateItem(levelProp, Prop, ++seed, propTypes, background);
				arr.push(prop);
			}
		});
		return arr;
	}

	generateActors(options = {}, refData = {}) {
		console.log('generateActors', options);
		let seed = this.seed + 999; // ?
		const { monsterSpawn, monsters = [] } = options;
		const monsterTypes = refData.monsters;
		const depth = options.levelIndex;
		const availableMonsters = monsters.filter((levelMonster) => {
			return (!levelMonster.minDepth) || levelMonster.minDepth <= depth;
		});
		const availableMonsterWeights = {};
		availableMonsters.forEach((levelMonster) => {
			if (levelMonster.weight) {
				availableMonsterWeights[levelMonster.type] = levelMonster.weight;
			}
		});
		const hasMonstersWithWeights = Object.keys(availableMonsterWeights).length > 0;
		const monsterSpawnNumber = (monsterSpawn === undefined) ? 10 : random.roll(monsterSpawn);
		const totalMonsterSpawnQuantity = monsterSpawnNumber;
		const actors = [];
		// Create monsters with fixed quantities
		// Note: this could exceed the total quantity
		const availableMonstersFixedQuantities = availableMonsters.filter((levelMonster) => {
			return levelMonster.quantity;
		});
		availableMonstersFixedQuantities.forEach((levelMonster) => {
			const monsterTypeKey = levelMonster.type;
			for (let i = 0; i < levelMonster.quantity; i++) {
				const monster = this.createActor(monsterTypes, monsterTypeKey, ++seed);
				actors.push(monster);
			}
		});
		// Create weighted monsters
		if (hasMonstersWithWeights) {
			let stopper = 0;
			while (actors.length < totalMonsterSpawnQuantity && stopper < 9000) {
				stopper++;
				(() => {
					const monsterTypeKey = random.getWeightedValue(availableMonsterWeights);
					if (!monsterTypeKey) { return; }
					const monster = this.createActor(monsterTypes, monsterTypeKey, ++seed);
					actors.push(monster);
				})();
			}
		}
		// console.log('Actors at depth', depth, actors);
		return actors;
	}

	createActor(monsterTypes, monsterTypeKey, seed) {
		if (!monsterTypeKey) { return; }
		const { x, y } = this.findRandomFreeCell(seed);
		let monsterOptions = monsterTypes[monsterTypeKey];
		monsterOptions = { type: monsterTypeKey, aggro: 100, ...monsterOptions, x, y };
		// console.log(monsterTypes, monsterTypeKey, monsterOptions);
		return new Actor(monsterOptions);		
	}

	// Gets

	getMap() {
		return this.map;
	}

	getCellPassability(x, y) {
		const isMapPassable = this.map.getCellPassability(x, y);
		if (!isMapPassable) { return false; }
		const actorsHere = this.actors.filter((actor) => {
			return actor.x === x && actor.y === y && !actor.passable;
		});
		return (actorsHere.length === 0);
	}

	// Sets

	setEye(actorThing) {
		this.eye.x = actorThing.x;
		this.eye.y = actorThing.y;
		this.eye.sightRange = actorThing.sightRange;
	}
}

module.exports = Level;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);
const Cell = __webpack_require__(21);
const geometer = __webpack_require__(7);
const random = __webpack_require__(5);

const DIGGER_TYPE = 'digger';

class Map {
	constructor(options = {}) {
		this.baseSeed = options.seed || 1;
		this.seed = this.baseSeed;
		this.color = options.color || '#777';
		this.background = options.background || '#222';
		this.type = options.type || DIGGER_TYPE;
		this.rotMap = options.rotMap;
		this.cells = {};
		this.freeCells = [];
		this.walls = Boolean(options.walls) || Boolean(options.wallsCharacter);
		this.wallsCharacter = options.wallsCharacter || '#'; // ▧
		this.floorCharacter = options.floorCharacter || '.';
		this.generate(options);
	}

	generate(options = {}) {
		const generators = options.generators || {};

		if (typeof generators[this.type] === 'function') {
			this.clearCells();
			generators[this.type](this.seed, this, options);
			return;
		}

		if (this.type === DIGGER_TYPE) {
			this.generateDigger();
			return;
		}
		if (this.type === ARENA_TYPE) {
			this.generateArena(options.x, options.y);
			return;
		}
		// TODO: handle other rot-js types

		console.warn('Undefined map type:', this.type, generators);
		this.generateArena(3, 3);
		// TODO: Have default be a big empty room instead?
	}

	generateArena(x, y) {
		ROT.RNG.setSeed(this.seed);
		this.rotMap = new ROT.Map.Arena(x, y);
		this.setupRotMap();	
	}

	generateDigger() {
		ROT.RNG.setSeed(this.seed);
		this.rotMap = new ROT.Map.Digger();
		this.setupRotMap();		
	}

	setupRotMap() {
		this.clearCells();
		this.rotMap.create((x, y, value) => {
			if (value) {
				return;
			}
			this.setFloorAt(x, y);
		});

		if (this.walls) {
			this.addWalls();
		}		
	}

	addWalls() {
		this.forEachCell((cell, x, y) => {
			Map.forEachDirection((dir, dirX, dirY) => {
				const newX = x + dirX;
				const newY = y + dirY;
				const wallCell = this.getCellAt(newX, newY);
				if (!wallCell) {
					this.setWallAt(newX, newY);
				}
			});
		});
	}

	discoverCircle(x, y, radius) {
		this.forEachCellInCircle(x, y, radius, (cell) => {
			cell.discover();
		});
	}

	static parseKeyCoordinates(key) {
		const parts = key.split(",");
		const x = parseInt(parts[0]);
		const y = parseInt(parts[1]);
		return { x, y };
	}

	static makeKey(x, y) {
		return x + ',' + y;
	}

	static forEachDirection(callback) {
		const dirCoords = [
			{x: 0, y: -1}, // top
			{x: 1, y: -1},
			{x: 1, y: 0}, // right
			{x: 1, y: 1},
			{x: 0, y: 1}, // bottom
			{x: -1, y: 1},
			{x: -1, y: 0}, // left
			{x: -1, y: -1},
		];
		for (let i = 0; i < 8; i++) {
			callback(i, dirCoords[i].x, dirCoords[i].y);
		}
	}

	clearCells() {
		this.cells = {};
		this.freeCells.length = 0;		
	}

	forEachCell(callback) {
		for (let key in this.cells) {
			const { x, y } = Map.parseKeyCoordinates(key);
			callback(this.cells[key], x, y, key);
		}
	}

	forEachCellInCircle(centerX, centerY, radius, callback, includeEmptyCells = false) {
		const maxX = centerX + radius;
		const maxY = centerY + radius;
		let x;
		for (x = centerX - radius; x <= maxX; x++) {
			let y;
			for (y = centerY - radius; y <= maxY; y++) {
				const r = Math.round(geometer.getDistance(centerX, centerY, x, y));
				if (r < radius) {
					const cell = this.getCellAt(x, y);
					if (cell || includeEmptyCells) {
						callback(cell, x, y)
					}
				}
			}
		}
	}

	getRandomFreeCell(seed) {		
		const i = random.roll(this.freeCells.length, seed);
		
		// TODO: TBD- Is it still a free cell?
		// var key = freeCells.splice(index, 1)[0];
		// this.map[key] = "*";
		const key = this.freeCells[i];
		const cell = this.cells[key];
		
		const { x, y } = Map.parseKeyCoordinates(key);
		// console.log(seed, key, i, x, y);
		return { x, y, cell };
	}

	getCellAt(x, y) {
		const key = Map.makeKey(x, y);
		return this.cells[key];		
	}

	getCharacterAt(x, y) {
		const cell = this.getCellAt(x, y);
		return (cell) ? cell.getCharacter() : null;
	}

	setFloorAt(x, y) {
		const key = this.setCharacterAt(this.floorCharacter, x, y);
		this.freeCells.push(key);
		return key;
	}

	setWallAt(x, y) {
		return this.setCharacterAt(this.wallsCharacter, x, y);
	}

	setCharacterAt(char, x, y) {
		const key = Map.makeKey(x, y);
		const cell = this.cells[key];
		if (cell) {
			cell.setCharacter(char);
		} else {
			const { color, background } = this;
			this.cells[key] = new Cell({ color, background, character: char });
		}
		return key;
	}

	getCellPassability(x, y) {
		const cell = this.getCellAt(x, y);
		return (cell) ? cell.getPassability() : false;
	}

	getLightingAt(x, y) {
		return {}; // TODO
	}

	// _generateBoxes(freeCells) {
	// 	for (var i=0;i<10;i++) {
	// 		var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
	// 		var key = freeCells.splice(index, 1)[0];
	// 		this.map[key] = "*";
	// 	}
	// }
}

module.exports = Map;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

class Inventory {
	constructor(options = {}) {
		this.size = (typeof options.size === 'number') ? options.size : 10;
		this.items = [];
	}

	isFull() {
		return (this.items.length >= this.size);
	}

	hasSpace() {
		return !this.isFull();
	}

	add(item) {
		if (this.isFull()) {
			return false;
		}
		if (!item.portable) {
			return false;
		}
		this.items.push(item);
		return true;
	}

	remove(item) {
		const i = this.items.indexOf(item);
		if (i <= -1) {
			console.warn('nothing found in', this.items, item);
			return false;
		}
		const arr = this.items.splice(i, 1);
		return arr[0];
	}

	removeType(typeKey) {
		const itemsOfType = this.items.filter((item) => { return item.type === typeKey; });
		if (itemsOfType.length === 0) {
			return false;
		}
		return this.remove(itemsOfType[0]);
	}

	get(n) {
		if (typeof n === 'number') {
			return this.items[n];
		} else if (typeof n === 'string') {
			return this.items.find((item) => { return item.name === n; });
		}
		return this.items;
	}

	getString() {
		const arr = this.items.map((item, i) => { return `[${(i + 1)}] ${item.name}`; });
		return (arr.length) ? arr.join(', ') : 'nothing';
	}

	loopOverContents(fn) {
		this.items.forEach((item, i) => {
			fn(item, i);
		});
	}

	hasContents() {
		return (this.items.length > 0);
	}

	contains(itemName) {
		let foundItem = this.items.find((item) => { return (item.name === itemName); });
		return Boolean(foundItem);
	}

	containsType(typeName) {
		let foundItem = this.items.find((item) => { return (item.type === typeName); });
		return Boolean(foundItem);
	}
}

module.exports = Inventory;


/***/ }),
/* 15 */
/***/ (function(module, exports) {


module.exports = {
	DIRS_4: Object.freeze([
		{ x: 0, y: -1 },
		{ x: 1, y: 0 },
		{ x: 0, y: 1 },
		{ x: -1, y: 0 },
	]),
	DIRS_8: Object.freeze([
		{ x: 0, y: -1 },
		{ x: 1, y: -1 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 },
		{ x: 0, y: 1 },
		{ x: -1, y: 1 },
		{ x: -1, y: 0 },
		{ x: -1, y: -1 },	
	]),
	DIRS_8_DIAGNOLS: Object.freeze([
		{ x: 1, y: -1 },
		{ x: 1, y: 1 },
		{ x: -1, y: 1 },
		{ x: -1, y: -1 },	
	]),
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const Item = __webpack_require__(6);

class Prop extends Item {
	constructor(options = {}) {
		options = { portable: false, ...options };
		super(options);
	}
}

module.exports = Prop;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);
const Game = __webpack_require__(19);
const Item = __webpack_require__(6);
const Map = __webpack_require__(13);
const Actor = __webpack_require__(8);
const Prop = __webpack_require__(16);
const Level = __webpack_require__(12);
const Display = __webpack_require__(11);
const random = __webpack_require__(5);
const ready = __webpack_require__(10);

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


/***/ }),
/* 18 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);
const ready = __webpack_require__(10);
const Display = __webpack_require__(11);
const Level = __webpack_require__(12);
const Actor = __webpack_require__(8);
const Item = __webpack_require__(6);
const Keyboard = __webpack_require__(22);
const MusicBox = __webpack_require__(23);
const Console = __webpack_require__(24);

const INIT_STATE = 'INIT';
const MAIN_GAME_STATE = 'GAME';
const SPLASH_STATE = 'SPLASH';
const OFF_STATE = 'OFF';

class Game {
	constructor(options) {
		const { id, consoleId, data, customEffects,	haveSplash,	fontFamilies } = options;
		this.id = id;
		this.displayContainer = document.getElementById(id || 'display');
		this.console = new Console({ id: consoleId });
		this.display = null;
		this.haveSplash = Boolean(haveSplash);
		this.fontFamilies = fontFamilies || [];
		this.activeLevelIndex = 0;
		// The generated levels
		this.levels = [];
		// Custom funcitons for generating things
		this.generators = options.generators || {};
		// Reference data on prototypical "things" (monsters, items)
		this.data = {
			monsters: {},
			items: {},
			props: {},
			playlist: [],
		};
		// The main actor
		this.hero = null; // player character / player actor
		// Guts
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = null;
		this.keyboard = null;
		this.state = INIT_STATE;
		this.states = new Set([INIT_STATE, SPLASH_STATE, MAIN_GAME_STATE, OFF_STATE]);
		// this.setupEngine();
		this.loadingPromise = null;
		this.console.setup();
		this.loadData(data);
		this.hooks = {};
		this.customEffects = { ...customEffects };
	}

	setupEngine() {
		this.engine = new ROT.Engine(this.scheduler);
		this.engine.start();
		return this.engine;
	}

	setupKeyboard() {
		this.keyboard = new Keyboard({ state: MAIN_GAME_STATE, autoStart: true });
		// Splash state
		this.keyboard.on(SPLASH_STATE, 'ENTER', () => {
			this.setState(MAIN_GAME_STATE);
		});
		// Main state
		this.keyboard.on(MAIN_GAME_STATE, 'DIRECTION', (keyName, keyCode, direction) => {
			// TODO: Lock and unlock the game? or do something else to determine if it's OK to move
			this.hero.queueAction('move', { direction });
			this.advance();
		});
		this.keyboard.on(MAIN_GAME_STATE, 'ENTER', () => {
			// this.actorDefaultAction(this.hero); // TODO: Remove me
			this.actorAddDefaultAction(this.hero);
			this.advance();
		});
		this.keyboard.on(MAIN_GAME_STATE, 'SPACE', () => {
			this.hero.queueAction('wait');
			this.advance();
		});
		this.keyboard.on(MAIN_GAME_STATE, 't', () => {
			this.showInventory();
			this.print('> Throw which item?');
			let n = prompt('Throw which item? \n\n' + this.hero.inventory.getString());
			if (!n || n.length === 0) {
				this.print('None');
				return;
			}
			n = parseInt(n, 10);
			const i = (isNaN(n)) ? -1 : n - 1;
			const item = this.hero.inventory.get(i);
			if (item) {
				this.hero.queueAction('throw', { what: item, x: this.hero.x, y: this.hero.y });
				this.advance();
			} else {
				this.print(`Invalid item [${n}]`);
			}
		});
		this.keyboard.on(MAIN_GAME_STATE, 'i', () => { this.showInventory(); });
		this.keyboard.on(MAIN_GAME_STATE, 'p', () => {
			this.hero.queueAction('pickup');
			this.advance();
		});
		this.keyboard.on(MAIN_GAME_STATE, 'o', () => {
			this.hero.queueAction('look');
			this.advance();
		});
		for (let i = 0; i < 9; i++) {
			const key = String(i + 1);
			this.keyboard.on(MAIN_GAME_STATE, key, () => {
				this.hero.readyAbilityByIndex(i);
				this.draw();
			});
		}
		// this.keyboard.start();
	}

	setupMusic() {
		this.music = new MusicBox(this.data.playlist);
	}

	removeKeyboard() {
		// TODO: this.keyboard.off() on all listeners
	}

	createDisplay(options = {}) {
		this.display = new Display(options);
		this.display.setupElements();
	}

	//---- Draw / Render

	print(str, classes = '', wait = 0) {
		if (wait) {
			setTimeout(() => { this.print(str, classes); }, wait);
			return;
		}
		this.console.print(str, classes);
	}

	showInventory() {
		const items = this.hero.inventory.getString();
		this.print('Inventory: ' + items);
	}

	draw() {
		this.display.drawLevel(this, this.getActiveLevel(), this.hero);
	}


	//---- Generation

	createLevel(options = {}, seed) {
		options.seed = seed || options.seed;
		const levelOptions = {
			customEffects: this.customEffects,
			...options,
			levelIndex: this.levels.length,
			generators: this.generators,
		};
		// console.warn(this.customEffects, levelOptions);
		const level = new Level(levelOptions, this.data);
		this.levels.push(level);
		return level;
	}

	createLevels(arr = [], baseSeed = 1) {
		let seed = baseSeed;
		arr.forEach((item, i) => {
			seed += i;
			if (typeof item === 'string') { // level type key
				this.createLevel(this.getLevelType(item), seed);
			} else if (typeof item === 'object' && item !== null) {
				const n = (typeof item.repeat === 'number') ? item.repeat : 1;
				for (let r = 0; r < n; r++) {
					seed += r;
					this.createLevel(this.getLevelType(item.levelTypeKey), seed);
				}
			}
		});
		this.connectStairs();
		return this.levels;
	}

	createActor(options = {}, level) {
		const actor = new Actor(options);
		this.scheduler.add(actor, true);
		level = (level === true) ? this.getActiveLevel() : level;
		if (level) {
			level.addActor(actor);
		}
		return actor;
	}

	createItem(options = {}, level) {
		const item = new Item(options);
		level = (level === true) ? this.getActiveLevel() : level;
		if (level) {
			level.addItem(item);
		}
		return item;
	}

	createHero(options = {}) {
		const heroOptions = { ...options, character: '@', isHero: true };
		this.hero = this.createActor(heroOptions, true);

		const g = this;
		// Setup action stuff ... this needs to be refactored
		this.hero.act = function () {
			g.engine.lock();
			window.addEventListener('keydown', this); // pass the hero; the `handleEvent` will be used
		};
		this.hero.handleEvent = function (e) { // Leftover from tutorial, part 2
			window.removeEventListener('keydown', this);
			g.engine.unlock();
		};
		if (this.display) {
			this.display.setCameraTarget(this.hero);
		}
		this.discoverAroundHero();
		return this.hero;
	}

	connectStairs() {
		const STAIR_LINK = 'stairLink';
		const propTypes = this.getDataPropArray();
		const stairsDownTypes = propTypes.filter((propType) => { return Boolean(propType[STAIR_LINK]); });
		this.levels.forEach((level, i) => {
			// Handle each type of stairs
			stairsDownTypes.forEach((stairsDownType) => {
				const stairDownTypeKey = stairsDownType.key;
				const stairUpTypeKey = stairsDownType[STAIR_LINK];
				const levelStairsDown = level.props.filter((prop) => {
					return prop.type === stairDownTypeKey;
				});
				levelStairsDown.forEach((stair) => {
					const levelBelow = this.levels[i + 1];
					if (!levelBelow) { return; }
					const possibleStairsUp = levelBelow.props.filter((prop) => {
						return prop.type === stairUpTypeKey && !Boolean(prop.teleport);
					});
					// TODO: Find stairs to connect to based on proximity
					const levelBelowStairsUp = possibleStairsUp[0]; // TODO: remove this
					this.connectTeleportProps(levelBelowStairsUp, stair, i, i + 1, 'ascend', 'descend');
				});
			});
		});
	}

	connectTeleportProps(prop1, prop2, levelIndex1, levelIndex2, verb1, verb2) {
		if (!prop1 || !prop2) { return; }
		prop1.setTeleport({
			levelIndex: levelIndex1, x: prop2.x, y: prop2.y, verb: verb1
		});
		prop2.setTeleport({
			levelIndex: levelIndex2, x: prop1.x, y: prop1.y, verb: verb2
		});
	}

	//---- Movement, Combat

	moveActor(actor, direction, bumpCombat = false) {
		const diff = ROT.DIRS[8][direction];
		var newX = actor.x + diff[0];
		var newY = actor.y + diff[1];
		return this.moveActorTo(actor, newX, newY, bumpCombat);
	}

	moveActorTo(actor, x, y, bumpCombat = false) {
		const level = this.getActiveLevel();
		const canMoveToCell = level.getCellPassability(x, y);
		// console.log('considering moving to', x, y, '... free?', canMoveToCell);
		if (!canMoveToCell) {
			const blocker = level.findActor(x, y);
			if (blocker) {
				return this.bump(actor, blocker, x, y, bumpCombat);
			}
			return { x: x, y: y, moved: false };
		}
		actor.moveTo(x, y);
		// TODO: just redraw the space that was under the actor and the actor in the new spot?
		if (actor.isHero) {
			this.discoverAroundHero();
			this.narrateAroundHero();
		}
		this.draw();
		return { x, y, moved: true };
	}

	bump(actor, blocker, x, y, bumpCombat) {
		if (bumpCombat && actor.faction !== blocker.faction) {
			this.resolveCombat(actor, blocker, x, y);
			return { x, y, moved: false };
		} else if (Game.canBumpSwitch(actor, blocker)) {
			actor.moveTo(x, y);
			return { x, y, moved: true };
			// TODO: allow pushes based on authority/size
		} else { // just blocked
			return { x, y, moved: false };
		}
	}

	static canBumpSwitch(actor, blocker) {
		if (actor.aggro || blocker.aggro) { // TOOD: make this more nuanced
			return false;
		}
		const blockersNextAction = blocker.getNextAction();
		if (!blockersNextAction) { return true; }
		return (
			blockersNextAction.verb === 'move' &&
			blockersNextAction.x === actor.x &&
			blockersNextAction.y === actor.y
		);
	}

	teleportActor(actor, teleportParams = {}) {
		const originalLevelIndex = this.activeLevelIndex;
		// console.warn('teleporting', actor, teleportParams);
		const { levelIndex, x, y } = teleportParams;
		const currentLevel = this.getActiveLevel();
		currentLevel.removeActor(actor);
		this.setActiveLevel(levelIndex);
		const newLevel = this.getActiveLevel();
		newLevel.addActor(actor);
		actor.setCoordinates(x, y);
		console.log('New Level:', newLevel);
		if (actor.isHero) {
			this.discoverAroundHero();
			this.narrateAroundHero();
		}
		if (originalLevelIndex !== levelIndex) {
			this.hook('afterTeleportLevel', { levelIndex, x, y });
		}
		// this.draw();
	}

	resolveCombat(actor, opponent, x, y) {
		const level = this.getActiveLevel();
		if (!actor || !opponent || actor.faction === opponent.faction) {
			return false;
		}
		const { outcomeAttack } = level.resolveCombatEffects(actor, opponent);
		// TODO: get messages from resolve and effects methods
		g.print(`${actor.name} attacks ${opponent.name} and does ${outcomeAttack.damage} damage!`);
		if (opponent.dead()) {
			g.print(`${opponent.name} has been killed.`);
			actor.score += (this.activeLevelIndex + 1) * 10;
		}
	}

	actorAddDefaultAction(actor) {
		const level = this.getActiveLevel();
		const thing = level.findThingSmart(actor.x, actor.y, 'portable');
		// TODO: Maybe get multiple things and check if they have actions?
		console.log(thing, actor.x, actor.y);
		if (!thing) {
			return;
		}
		if (thing.portable) {
			actor.queueAction('pickup', { target: thing });
		} else if (thing.hasAction('open')) {
			actor.queueAction('open', { target: thing });
		} else if (thing.hasAction('use')) {
			actor.queueAction('use', { target: thing });
		} else if (thing.hasAction('descend') || thing.hasAction('ascend')) {
			actor.queueAction('teleport', { teleport: thing.teleport });
			console.log('Planning to teleport...', actor.actionQueue);
		}
	}

	advance() {
		const startHp = this.hero.hp;
		// TODO: advance time
		// Do actions for all actors
		const level = this.getActiveLevel();
		level.resolveRoundEffects();
		const actors = level.getActorsInitiativeOrdered();
		level.coolOffInitiativeBoosts();
		actors.forEach((actor) => {
			actor.planAction(level, this.hero);
			this.advanceActor(actor);
		});
		// this.advanceActor(this.hero);
		const isDamaged = (startHp > this.hero.hp);
		this.display.drawDamage(isDamaged);
		if (this.hero.dead()) {
			this.hook('afterHeroDeath', {});
		}
		this.draw();
	}

	advanceActor(actor) {
		const level = this.getActiveLevel();
		const action = actor.doAction();
		if (!action) { return; }
		const { verb, target, what, x, y } = action;
		if (actor.isHero) {
			if (verb === 'move') { console.log(actor.name + ' ' + verb); }
			else { console.log(actor.name, verb, action); }
		}
		let outcome = {};
		let message = '';
		switch (verb) {
			case 'move':
				const bumpCombat = (actor.isHero || actor.aggro > 0);
				if (action.direction === undefined) {
					this.moveActorTo(actor, action.x, action.y, bumpCombat);
				} else {
					this.moveActor(actor, action.direction, bumpCombat);
				}
			break;
			case 'use':
				outcome = level.useThing(actor, 'use', target);
				message = outcome.message;
			break;
			case 'open':
				outcome = level.useThing(actor, 'open', target);
				message = outcome.message;
			break;
			case 'teleport':
				message = `${actor.name} now entering: `;
				this.teleportActor(actor, action.teleport);
				{
					const newLevel = this.getActiveLevel();
					message += newLevel.name;
					if (newLevel.description) {
						message += ' - ' + newLevel.description;
					}
				}
			break;
			case 'pickup':
				const pickedUp = this.pickupItem(actor, target);
				if (pickedUp) {
					message = `${actor.name} picks up the ${target.name}.`;
				} else if (target) {
					message = `${actor.name} could not pick up the ${target.name}.`;
				} else {
					message = `Nothing to pick up.`;
				}
			break;
			case 'throw':
				message = level.throw(actor, what, x, y);
			break;
			case 'look':
				const things = this.getActiveLevel().findEverythingInView({ excludeHero: true });
				const names = things.map((thing) => thing.name || '?').join(', ');
				message = `${actor.name} looks around and sees: ${names}`;
			break;
			case 'wait':
				actor.wait();
				if (actor.isHero) {
					message = `${actor.name} waits (random recovery of AP, BP, or EP points).`;
				}
			break;
		}
		if (typeof message !== 'string') {
			console.error('Unknown message from doing action', verb);
			message = 'ERROR';
		}
		this.print(message);
	}

	pickupItem(actor, thing) {
		if (!thing) { return false; }
		if (!thing.portable) { return false; }
		const level = this.getActiveLevel();
		const item = level.removeItem(thing);
		if (!item) { return false; }
		const added = actor.inventory.add(thing);
		if (!added) {
			level.addItem(item);
		}
		return added;
	}

	//---- Exploration

	discoverAroundHero() {
		const level = this.getActiveLevel();
		const illumination = this.hero.inventory.items.reduce((n, item) => {
			return n + item.illumination;
		}, 0);
		level.discoverCircle(this.hero.x, this.hero.y, this.hero.sightRange + illumination); // TODO: allow different POV
		level.setEye(this.hero);
	}

	narrateAroundHero() {
		const allThingsOnHero = this.getThingsOnActor(this.hero);
		if (allThingsOnHero.length === 0) { return; }
		const namesOnHero = allThingsOnHero.map((thing) => thing.name);
		const namesString = (namesOnHero.length > 1) ? namesOnHero.join(', ') : 'a ' + namesOnHero[0];
		this.console.print(`You are on ${namesString}.`);
	}

	//---- System

	ready(callback, fonts = []) { // TODO: remove fonts param?
		const fontFamiliesToLoad = [ ...fonts ].concat(this.fontFamilies);
		console.log(fontFamiliesToLoad);
		ready(() => {
			if (this.loadingPromise instanceof Promise) {
				this.loadingPromise
					.then(() => { callback(); });
					// .catch((err) => { console.error('Error loading something', err) });
			} else {
				callback();
			}
		}, fontFamiliesToLoad);
		// TODO: return a promise so can be used async
	}

	start() {
		this.setupEngine();
		this.setupKeyboard();
		this.setupMusic();
		const startState = (this.haveSplash) ? SPLASH_STATE : MAIN_GAME_STATE;
		this.setStateDetect(startState);
		// TODO: start graphics loop
		this.draw();
	}

	stop() {
		this.setState(OFF_STATE);
		this.removeKeyboard();
		// TODO: stop graphics loop
	}

	loadData(data) {
		const promises = [];
		function parseJson(response) { return response.json(); }
		function fixInnerObject(obj, key) {
			return (typeof obj[key] === 'object') ? obj[key] : obj;
		}
		for (let key in data) {
			if (typeof data[key] === 'string') {
				const p = fetch(data[key])
					.then(parseJson)
					.then((obj) => fixInnerObject(obj, key))
					.then((obj) => { this.setData(key, obj); });
					//.catch((err) => { console.error(data, key, err); });
				promises.push(p);
			} else {
				this.setData(key, data[key]);
			}
		}
		this.loadingPromise = Promise.all(promises); // .then((resp) => { console.log(resp); });
		return this.loadingPromise;
	}

	//---- Hooks

	addHook(hookName, fn) {
		if (!this.hooks[hookName]) {
			this.hooks[hookName] = [];
		}
		this.hooks[hookName].push(fn);
	}

	removeHook(hookName, fn) {
		if (!this.hooks[hookName]) { return; }
		const i = this.hooks[hookName].indexOf(fn);
		this.hooks[hookName].splice(i, 1);
	}

	hook(hookName, data = {}) {
		const hook = this.hooks[hookName];
		if (!hook) { return; }
		hook.forEach((fn) => {
			fn(data, this, hookName);
		});
	}

	//---- Gets

	getActiveLevel() {
		return this.levels[this.activeLevelIndex];
	}

	getLevelType(key) {
		const lt = this.data.levels[key];
		if (typeof lt !== 'object' || lt === null) {
			console.error('Cannot find level type ', key);
		}
		return lt;
	}

	getDataPropArray() {
		const propKeys = Object.keys(this.data.props);
		const arr = [];
		propKeys.forEach((key) => {
			const prop = { ...this.data.props[key], key };
			arr.push(prop);
		});
		return arr;
	}

	getThingsOnActor(actor) {
		const { x, y } = actor;
		return this.getActiveLevel().findThings(x, y);
	}

	//---- Sets

	setActiveLevel(i) {
		this.activeLevelIndex = i;
		return;
	}

	setData(key, obj) {
		this.data[key] = Object.freeze(obj);
	}

	setStateDetect(stateFallback) {
		// TODO: improve... not sure i like how this works
		// const hash = location.hash.substring(1).toUpperCase();
		// if (this.states.includes(hash)) {
		// 	return this.setState(hash);
		// }
		return this.setState(stateFallback);
	}

	setState(state) {
		const isLegitState = this.states.has(state);
		const consoleMethod = (isLegitState) ? 'log' : 'warn';
		console[consoleMethod]('Setting state:', state);
		const prefix = 'rote-state-';
		this.state = state;
		// const body = document.getElementsByClassName('rote-state')[0];
		const body = document.getElementsByTagName('body')[0];
		// body.className = 'rote-state'; // TODO: make this smarter so it only removes rote states
		// body.classList.add(prefix + this.state.toLowerCase());
		body.className = 'rote-state ' + prefix + state.toLowerCase();
		location.hash = state.toLowerCase();
		this.keyboard.setState(state);
	}

	setMainGameState() {
		this.setState(MAIN_GAME_STATE);
	}

}

module.exports = Game;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/* Font Face Observer v2.1.0 - © Bram Stein. License: BSD-3-Clause */(function(){function l(a,b){document.addEventListener?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function m(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):document.attachEvent("onreadystatechange",function k(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",k),a()})};function t(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
function u(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+b+";"}function z(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function A(a,b){function c(){var a=k;z(a)&&a.a.parentNode&&b(a.g)}var k=a;l(a.b,c);l(a.c,c);z(a)};function B(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var C=null,D=null,E=null,F=null;function G(){if(null===D)if(J()&&/Apple/.test(window.navigator.vendor)){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);D=!!a&&603>parseInt(a[1],10)}else D=!1;return D}function J(){null===F&&(F=!!document.fonts);return F}
function K(){if(null===E){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}E=""!==a.style.font}return E}function L(a,b){return[a.style,a.weight,K()?a.stretch:"","100px",b].join(" ")}
B.prototype.load=function(a,b){var c=this,k=a||"BESbswy",r=0,n=b||3E3,H=(new Date).getTime();return new Promise(function(a,b){if(J()&&!G()){var M=new Promise(function(a,b){function e(){(new Date).getTime()-H>=n?b(Error(""+n+"ms timeout exceeded")):document.fonts.load(L(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},b)}e()}),N=new Promise(function(a,c){r=setTimeout(function(){c(Error(""+n+"ms timeout exceeded"))},n)});Promise.race([N,M]).then(function(){clearTimeout(r);a(c)},
b)}else m(function(){function v(){var b;if(b=-1!=f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===C&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),C=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=C&&(f==w&&g==w&&h==w||f==x&&g==x&&h==x||f==y&&g==y&&h==y)),b=!b;b&&(d.parentNode&&d.parentNode.removeChild(d),clearTimeout(r),a(c))}function I(){if((new Date).getTime()-H>=n)d.parentNode&&d.parentNode.removeChild(d),b(Error(""+
n+"ms timeout exceeded"));else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,g=p.a.offsetWidth,h=q.a.offsetWidth,v();r=setTimeout(I,50)}}var e=new t(k),p=new t(k),q=new t(k),f=-1,g=-1,h=-1,w=-1,x=-1,y=-1,d=document.createElement("div");d.dir="ltr";u(e,L(c,"sans-serif"));u(p,L(c,"serif"));u(q,L(c,"monospace"));d.appendChild(e.a);d.appendChild(p.a);d.appendChild(q.a);document.body.appendChild(d);w=e.a.offsetWidth;x=p.a.offsetWidth;y=q.a.offsetWidth;I();A(e,function(a){f=a;v()});u(e,
L(c,'"'+c.family+'",sans-serif'));A(p,function(a){g=a;v()});u(p,L(c,'"'+c.family+'",serif'));A(q,function(a){h=a;v()});u(q,L(c,'"'+c.family+'",monospace'))})})}; true?module.exports=B:(undefined);}());


/***/ }),
/* 21 */
/***/ (function(module, exports) {

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


/***/ }),
/* 22 */
/***/ (function(module, exports) {

const DIRECTION8 = {
	'UP': 0, 'UP-RIGHT': 1,
	'RIGHT': 2, 'DOWN-RIGHT': 3,
	'DOWN': 4, 'DOWN-LEFT': 5,
	'LEFT': 6, 'UP-LEFT': 7
};
const DIRECTION4 = { 'UP': 0, 'RIGHT': 1, 'DOWN': 2, 'LEFT': 3 };
const DIRECTION4_ARRAY = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

const USED_KEYS = ['i', 't', 'o', 'p', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
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


/***/ }),
/* 23 */
/***/ (function(module, exports) {


class MusicBox {
	constructor(playlist) {
		this.audio = null;
		this.playlist = [ ...playlist ];
	}

	addToPlaylist(songPath) {
		this.playlist.push(songPath);
	}

	play(i = 0) {
		this.audio = new Audio(this.playlist[i]);
		this.audio.play();
	}
}

module.exports = MusicBox;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

class Console {
	constructor(options = {}) {
		this.id = options.id || 'console';
		this.container = null;
		this.list = null;
		this.messages = [];
		this.writeToConsoleLog = false;
	}

	setup() {
		this.container = document.getElementById(this.id);
		this.clear();
	}

	clear() {
		this.messages.length = 0;
		this.container.innerHTML = '<ul></ul>';
		this.list = this.container.firstChild;
	}

	print(str, classes = '') {
		if (!str) {
			return;
		}
		if (this.writeToConsoleLog) {
			console.log('%c' + str, 'color: #559955');
		}
		const safeStr = str.replace('<', '&lt;');
		this.list.innerHTML += `<li class="${classes}">${safeStr}</li>`;
		this.container.scrollTop = this.container.scrollHeight;
		this.trim();
	}

	// aliases
	log(str) { return this.print(str);	}
	add(str) { return this.print(str); }

	trim() {
		if (this.list.innerHTML.length > 5000) {
			this.list.removeChild(this.list.firstChild);
		}
	}
}

module.exports = Console;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvcm5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvY29sb3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZGlzcGxheS9jYW52YXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZGlzcGxheS9oZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZGlzcGxheS9yZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2Rpc3BsYXkvdGlsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9kaXNwbGF5L3RpbGUtZ2wuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZGlzcGxheS9kaXNwbGF5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL3N0cmluZ2dlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9ldmVudHF1ZXVlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL3NjaGVkdWxlci9zY2hlZHVsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvc2NoZWR1bGVyL3NpbXBsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9zY2hlZHVsZXIvc3BlZWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvc2NoZWR1bGVyL2FjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9zY2hlZHVsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZm92L2Zvdi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9mb3YvZGlzY3JldGUtc2hhZG93Y2FzdGluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9mb3YvcHJlY2lzZS1zaGFkb3djYXN0aW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2Zvdi9yZWN1cnNpdmUtc2hhZG93Y2FzdGluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9mb3YvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbWFwL21hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9tYXAvYXJlbmEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbWFwL2R1bmdlb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbWFwL2ZlYXR1cmVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL21hcC91bmlmb3JtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL21hcC9jZWxsdWxhci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9tYXAvZGlnZ2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL21hcC9lbGxlcm1hemUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbWFwL2RpdmlkZWRtYXplLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL21hcC9pY2V5bWF6ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9tYXAvcm9ndWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbWFwL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL25vaXNlL25vaXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL25vaXNlL3NpbXBsZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbm9pc2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvcGF0aC9wYXRoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL3BhdGgvZGlqa3N0cmEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvcGF0aC9hc3Rhci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9wYXRoL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2VuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9saWdodGluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9kaXNwbGF5L2JhY2tlbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JhbmRvbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvSXRlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2VvbWV0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FjdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2Rpc3BsYXkvdGVybS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhZHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Rpc3BsYXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xldmVsLmpzIiwid2VicGFjazovLy8uL3NyYy9NYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9wLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9HYW1lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9mb250ZmFjZW9ic2VydmVyL2ZvbnRmYWNlb2JzZXJ2ZXIuc3RhbmRhbG9uZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2VsbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS2V5Ym9hcmRMaXN0ZW5lci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvTXVzaWNCb3guanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnNvbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztR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QTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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OlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDE3KTtcbiIsIi8qKlxuICogVGhpcyBjb2RlIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIEFsZWEgYWxnb3JpdGhtOyAoQykgMjAxMCBKb2hhbm5lcyBCYWFnw7hlLlxuICogQWxlYSBpcyBsaWNlbnNlZCBhY2NvcmRpbmcgdG8gdGhlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UuXG4gKi9cbmNvbnN0IEZSQUMgPSAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvKiAyXi0zMiAqL1xuY2xhc3MgUk5HIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fc2VlZCA9IDA7XG4gICAgICAgIHRoaXMuX3MwID0gMDtcbiAgICAgICAgdGhpcy5fczEgPSAwO1xuICAgICAgICB0aGlzLl9zMiA9IDA7XG4gICAgICAgIHRoaXMuX2MgPSAwO1xuICAgIH1cbiAgICBnZXRTZWVkKCkgeyByZXR1cm4gdGhpcy5fc2VlZDsgfVxuICAgIC8qKlxuICAgICAqIFNlZWQgdGhlIG51bWJlciBnZW5lcmF0b3JcbiAgICAgKi9cbiAgICBzZXRTZWVkKHNlZWQpIHtcbiAgICAgICAgc2VlZCA9IChzZWVkIDwgMSA/IDEgLyBzZWVkIDogc2VlZCk7XG4gICAgICAgIHRoaXMuX3NlZWQgPSBzZWVkO1xuICAgICAgICB0aGlzLl9zMCA9IChzZWVkID4+PiAwKSAqIEZSQUM7XG4gICAgICAgIHNlZWQgPSAoc2VlZCAqIDY5MDY5ICsgMSkgPj4+IDA7XG4gICAgICAgIHRoaXMuX3MxID0gc2VlZCAqIEZSQUM7XG4gICAgICAgIHNlZWQgPSAoc2VlZCAqIDY5MDY5ICsgMSkgPj4+IDA7XG4gICAgICAgIHRoaXMuX3MyID0gc2VlZCAqIEZSQUM7XG4gICAgICAgIHRoaXMuX2MgPSAxO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybnMgUHNldWRvcmFuZG9tIHZhbHVlIFswLDEpLCB1bmlmb3JtbHkgZGlzdHJpYnV0ZWRcbiAgICAgKi9cbiAgICBnZXRVbmlmb3JtKCkge1xuICAgICAgICBsZXQgdCA9IDIwOTE2MzkgKiB0aGlzLl9zMCArIHRoaXMuX2MgKiBGUkFDO1xuICAgICAgICB0aGlzLl9zMCA9IHRoaXMuX3MxO1xuICAgICAgICB0aGlzLl9zMSA9IHRoaXMuX3MyO1xuICAgICAgICB0aGlzLl9jID0gdCB8IDA7XG4gICAgICAgIHRoaXMuX3MyID0gdCAtIHRoaXMuX2M7XG4gICAgICAgIHJldHVybiB0aGlzLl9zMjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGxvd2VyQm91bmQgVGhlIGxvd2VyIGVuZCBvZiB0aGUgcmFuZ2UgdG8gcmV0dXJuIGEgdmFsdWUgZnJvbSwgaW5jbHVzaXZlXG4gICAgICogQHBhcmFtIHVwcGVyQm91bmQgVGhlIHVwcGVyIGVuZCBvZiB0aGUgcmFuZ2UgdG8gcmV0dXJuIGEgdmFsdWUgZnJvbSwgaW5jbHVzaXZlXG4gICAgICogQHJldHVybnMgUHNldWRvcmFuZG9tIHZhbHVlIFtsb3dlckJvdW5kLCB1cHBlckJvdW5kXSwgdXNpbmcgUk9ULlJORy5nZXRVbmlmb3JtKCkgdG8gZGlzdHJpYnV0ZSB0aGUgdmFsdWVcbiAgICAgKi9cbiAgICBnZXRVbmlmb3JtSW50KGxvd2VyQm91bmQsIHVwcGVyQm91bmQpIHtcbiAgICAgICAgbGV0IG1heCA9IE1hdGgubWF4KGxvd2VyQm91bmQsIHVwcGVyQm91bmQpO1xuICAgICAgICBsZXQgbWluID0gTWF0aC5taW4obG93ZXJCb3VuZCwgdXBwZXJCb3VuZCk7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2V0VW5pZm9ybSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIG1lYW4gTWVhbiB2YWx1ZVxuICAgICAqIEBwYXJhbSBzdGRkZXYgU3RhbmRhcmQgZGV2aWF0aW9uLiB+OTUlIG9mIHRoZSBhYnNvbHV0ZSB2YWx1ZXMgd2lsbCBiZSBsb3dlciB0aGFuIDIqc3RkZGV2LlxuICAgICAqIEByZXR1cm5zIEEgbm9ybWFsbHkgZGlzdHJpYnV0ZWQgcHNldWRvcmFuZG9tIHZhbHVlXG4gICAgICovXG4gICAgZ2V0Tm9ybWFsKG1lYW4gPSAwLCBzdGRkZXYgPSAxKSB7XG4gICAgICAgIGxldCB1LCB2LCByO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICB1ID0gMiAqIHRoaXMuZ2V0VW5pZm9ybSgpIC0gMTtcbiAgICAgICAgICAgIHYgPSAyICogdGhpcy5nZXRVbmlmb3JtKCkgLSAxO1xuICAgICAgICAgICAgciA9IHUgKiB1ICsgdiAqIHY7XG4gICAgICAgIH0gd2hpbGUgKHIgPiAxIHx8IHIgPT0gMCk7XG4gICAgICAgIGxldCBnYXVzcyA9IHUgKiBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhyKSAvIHIpO1xuICAgICAgICByZXR1cm4gbWVhbiArIGdhdXNzICogc3RkZGV2O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyBQc2V1ZG9yYW5kb20gdmFsdWUgWzEsMTAwXSBpbmNsdXNpdmUsIHVuaWZvcm1seSBkaXN0cmlidXRlZFxuICAgICAqL1xuICAgIGdldFBlcmNlbnRhZ2UoKSB7XG4gICAgICAgIHJldHVybiAxICsgTWF0aC5mbG9vcih0aGlzLmdldFVuaWZvcm0oKSAqIDEwMCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIFJhbmRvbWx5IHBpY2tlZCBpdGVtLCBudWxsIHdoZW4gbGVuZ3RoPTBcbiAgICAgKi9cbiAgICBnZXRJdGVtKGFycmF5KSB7XG4gICAgICAgIGlmICghYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXlbTWF0aC5mbG9vcih0aGlzLmdldFVuaWZvcm0oKSAqIGFycmF5Lmxlbmd0aCldO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyBOZXcgYXJyYXkgd2l0aCByYW5kb21pemVkIGl0ZW1zXG4gICAgICovXG4gICAgc2h1ZmZsZShhcnJheSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGxldCBjbG9uZSA9IGFycmF5LnNsaWNlKCk7XG4gICAgICAgIHdoaWxlIChjbG9uZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGNsb25lLmluZGV4T2YodGhpcy5nZXRJdGVtKGNsb25lKSk7XG4gICAgICAgICAgICByZXN1bHQucHVzaChjbG9uZS5zcGxpY2UoaW5kZXgsIDEpWzBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZGF0YSBrZXk9d2hhdGV2ZXIsIHZhbHVlPXdlaWdodCAocmVsYXRpdmUgcHJvYmFiaWxpdHkpXG4gICAgICogQHJldHVybnMgd2hhdGV2ZXJcbiAgICAgKi9cbiAgICBnZXRXZWlnaHRlZFZhbHVlKGRhdGEpIHtcbiAgICAgICAgbGV0IHRvdGFsID0gMDtcbiAgICAgICAgZm9yIChsZXQgaWQgaW4gZGF0YSkge1xuICAgICAgICAgICAgdG90YWwgKz0gZGF0YVtpZF07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJhbmRvbSA9IHRoaXMuZ2V0VW5pZm9ybSgpICogdG90YWw7XG4gICAgICAgIGxldCBpZCwgcGFydCA9IDA7XG4gICAgICAgIGZvciAoaWQgaW4gZGF0YSkge1xuICAgICAgICAgICAgcGFydCArPSBkYXRhW2lkXTtcbiAgICAgICAgICAgIGlmIChyYW5kb20gPCBwYXJ0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIGJ5IHNvbWUgZmxvYXRpbmctcG9pbnQgYW5ub3lhbmNlIHdlIGhhdmVcbiAgICAgICAgLy8gcmFuZG9tID49IHRvdGFsLCBqdXN0IHJldHVybiB0aGUgbGFzdCBpZC5cbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgUk5HIHN0YXRlLiBVc2VmdWwgZm9yIHN0b3JpbmcgdGhlIHN0YXRlIGFuZCByZS1zZXR0aW5nIGl0IHZpYSBzZXRTdGF0ZS5cbiAgICAgKiBAcmV0dXJucyBJbnRlcm5hbCBzdGF0ZVxuICAgICAqL1xuICAgIGdldFN0YXRlKCkgeyByZXR1cm4gW3RoaXMuX3MwLCB0aGlzLl9zMSwgdGhpcy5fczIsIHRoaXMuX2NdOyB9XG4gICAgLyoqXG4gICAgICogU2V0IGEgcHJldmlvdXNseSByZXRyaWV2ZWQgc3RhdGUuXG4gICAgICovXG4gICAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgdGhpcy5fczAgPSBzdGF0ZVswXTtcbiAgICAgICAgdGhpcy5fczEgPSBzdGF0ZVsxXTtcbiAgICAgICAgdGhpcy5fczIgPSBzdGF0ZVsyXTtcbiAgICAgICAgdGhpcy5fYyA9IHN0YXRlWzNdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGNsb25lZCBSTkdcbiAgICAgKi9cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgbGV0IGNsb25lID0gbmV3IFJORygpO1xuICAgICAgICByZXR1cm4gY2xvbmUuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZSgpKTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBuZXcgUk5HKCkuc2V0U2VlZChEYXRlLm5vdygpKTtcbiIsIi8qKlxuICogQWx3YXlzIHBvc2l0aXZlIG1vZHVsdXNcbiAqIEBwYXJhbSB4IE9wZXJhbmRcbiAqIEBwYXJhbSBuIE1vZHVsdXNcbiAqIEByZXR1cm5zIHggbW9kdWxvIG5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vZCh4LCBuKSB7XG4gICAgcmV0dXJuICh4ICUgbiArIG4pICUgbjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjbGFtcCh2YWwsIG1pbiA9IDAsIG1heCA9IDEpIHtcbiAgICBpZiAodmFsIDwgbWluKVxuICAgICAgICByZXR1cm4gbWluO1xuICAgIGlmICh2YWwgPiBtYXgpXG4gICAgICAgIHJldHVybiBtYXg7XG4gICAgcmV0dXJuIHZhbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc3Vic3RyaW5nKDEpO1xufVxuLyoqXG4gKiBGb3JtYXQgYSBzdHJpbmcgaW4gYSBmbGV4aWJsZSB3YXkuIFNjYW5zIGZvciAlcyBzdHJpbmdzIGFuZCByZXBsYWNlcyB0aGVtIHdpdGggYXJndW1lbnRzLiBMaXN0IG9mIHBhdHRlcm5zIGlzIG1vZGlmaWFibGUgdmlhIFN0cmluZy5mb3JtYXQubWFwLlxuICogQHBhcmFtIHtzdHJpbmd9IHRlbXBsYXRlXG4gKiBAcGFyYW0ge2FueX0gW2FyZ3ZdXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXQodGVtcGxhdGUsIC4uLmFyZ3MpIHtcbiAgICBsZXQgbWFwID0gZm9ybWF0Lm1hcDtcbiAgICBsZXQgcmVwbGFjZXIgPSBmdW5jdGlvbiAobWF0Y2gsIGdyb3VwMSwgZ3JvdXAyLCBpbmRleCkge1xuICAgICAgICBpZiAodGVtcGxhdGUuY2hhckF0KGluZGV4IC0gMSkgPT0gXCIlXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaC5zdWJzdHJpbmcoMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhcmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvYmogPSBhcmdzWzBdO1xuICAgICAgICBsZXQgZ3JvdXAgPSBncm91cDEgfHwgZ3JvdXAyO1xuICAgICAgICBsZXQgcGFydHMgPSBncm91cC5zcGxpdChcIixcIik7XG4gICAgICAgIGxldCBuYW1lID0gcGFydHMuc2hpZnQoKSB8fCBcIlwiO1xuICAgICAgICBsZXQgbWV0aG9kID0gbWFwW25hbWUudG9Mb3dlckNhc2UoKV07XG4gICAgICAgIGlmICghbWV0aG9kKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cbiAgICAgICAgb2JqID0gYXJncy5zaGlmdCgpO1xuICAgICAgICBsZXQgcmVwbGFjZWQgPSBvYmpbbWV0aG9kXS5hcHBseShvYmosIHBhcnRzKTtcbiAgICAgICAgbGV0IGZpcnN0ID0gbmFtZS5jaGFyQXQoMCk7XG4gICAgICAgIGlmIChmaXJzdCAhPSBmaXJzdC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICByZXBsYWNlZCA9IGNhcGl0YWxpemUocmVwbGFjZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXBsYWNlZDtcbiAgICB9O1xuICAgIHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKC8lKD86KFthLXpdKyl8KD86eyhbXn1dKyl9KSkvZ2ksIHJlcGxhY2VyKTtcbn1cbmZvcm1hdC5tYXAgPSB7XG4gICAgXCJzXCI6IFwidG9TdHJpbmdcIlxufTtcbiIsImltcG9ydCB7IGNsYW1wIH0gZnJvbSBcIi4vdXRpbC5qc1wiO1xuaW1wb3J0IFJORyBmcm9tIFwiLi9ybmcuanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBmcm9tU3RyaW5nKHN0cikge1xuICAgIGxldCBjYWNoZWQsIHI7XG4gICAgaWYgKHN0ciBpbiBDQUNIRSkge1xuICAgICAgICBjYWNoZWQgPSBDQUNIRVtzdHJdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHN0ci5jaGFyQXQoMCkgPT0gXCIjXCIpIHsgLy8gaGV4IHJnYlxuICAgICAgICAgICAgbGV0IG1hdGNoZWQgPSBzdHIubWF0Y2goL1swLTlhLWZdL2dpKSB8fCBbXTtcbiAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBtYXRjaGVkLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCwgMTYpKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09IDMpIHtcbiAgICAgICAgICAgICAgICBjYWNoZWQgPSB2YWx1ZXMubWFwKCh4KSA9PiB4ICogMTcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzW2kgKyAxXSArPSAxNiAqIHZhbHVlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FjaGVkID0gdmFsdWVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKChyID0gc3RyLm1hdGNoKC9yZ2JcXCgoWzAtOSwgXSspXFwpL2kpKSkgeyAvLyBkZWNpbWFsIHJnYlxuICAgICAgICAgICAgY2FjaGVkID0gclsxXS5zcGxpdCgvXFxzKixcXHMqLykubWFwKCh4KSA9PiBwYXJzZUludCh4KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIGh0bWwgbmFtZVxuICAgICAgICAgICAgY2FjaGVkID0gWzAsIDAsIDBdO1xuICAgICAgICB9XG4gICAgICAgIENBQ0hFW3N0cl0gPSBjYWNoZWQ7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWQuc2xpY2UoKTtcbn1cbi8qKlxuICogQWRkIHR3byBvciBtb3JlIGNvbG9yc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkKGNvbG9yMSwgLi4uY29sb3JzKSB7XG4gICAgbGV0IHJlc3VsdCA9IGNvbG9yMS5zbGljZSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sb3JzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICByZXN1bHRbaV0gKz0gY29sb3JzW2pdW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIEFkZCB0d28gb3IgbW9yZSBjb2xvcnMsIE1PRElGSUVTIEZJUlNUIEFSR1VNRU5UXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRfKGNvbG9yMSwgLi4uY29sb3JzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xvcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbG9yMVtpXSArPSBjb2xvcnNbal1baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbG9yMTtcbn1cbi8qKlxuICogTXVsdGlwbHkgKG1peCkgdHdvIG9yIG1vcmUgY29sb3JzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtdWx0aXBseShjb2xvcjEsIC4uLmNvbG9ycykge1xuICAgIGxldCByZXN1bHQgPSBjb2xvcjEuc2xpY2UoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbG9ycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgcmVzdWx0W2ldICo9IGNvbG9yc1tqXVtpXSAvIDI1NTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRbaV0gPSBNYXRoLnJvdW5kKHJlc3VsdFtpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIE11bHRpcGx5IChtaXgpIHR3byBvciBtb3JlIGNvbG9ycywgTU9ESUZJRVMgRklSU1QgQVJHVU1FTlRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG11bHRpcGx5Xyhjb2xvcjEsIC4uLmNvbG9ycykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sb3JzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb2xvcjFbaV0gKj0gY29sb3JzW2pdW2ldIC8gMjU1O1xuICAgICAgICB9XG4gICAgICAgIGNvbG9yMVtpXSA9IE1hdGgucm91bmQoY29sb3IxW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbG9yMTtcbn1cbi8qKlxuICogSW50ZXJwb2xhdGUgKGJsZW5kKSB0d28gY29sb3JzIHdpdGggYSBnaXZlbiBmYWN0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVycG9sYXRlKGNvbG9yMSwgY29sb3IyLCBmYWN0b3IgPSAwLjUpIHtcbiAgICBsZXQgcmVzdWx0ID0gY29sb3IxLnNsaWNlKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgcmVzdWx0W2ldID0gTWF0aC5yb3VuZChyZXN1bHRbaV0gKyBmYWN0b3IgKiAoY29sb3IyW2ldIC0gY29sb3IxW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnQgY29uc3QgbGVycCA9IGludGVycG9sYXRlO1xuLyoqXG4gKiBJbnRlcnBvbGF0ZSAoYmxlbmQpIHR3byBjb2xvcnMgd2l0aCBhIGdpdmVuIGZhY3RvciBpbiBIU0wgbW9kZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJwb2xhdGVIU0woY29sb3IxLCBjb2xvcjIsIGZhY3RvciA9IDAuNSkge1xuICAgIGxldCBoc2wxID0gcmdiMmhzbChjb2xvcjEpO1xuICAgIGxldCBoc2wyID0gcmdiMmhzbChjb2xvcjIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGhzbDFbaV0gKz0gZmFjdG9yICogKGhzbDJbaV0gLSBoc2wxW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGhzbDJyZ2IoaHNsMSk7XG59XG5leHBvcnQgY29uc3QgbGVycEhTTCA9IGludGVycG9sYXRlSFNMO1xuLyoqXG4gKiBDcmVhdGUgYSBuZXcgcmFuZG9tIGNvbG9yIGJhc2VkIG9uIHRoaXMgb25lXG4gKiBAcGFyYW0gY29sb3JcbiAqIEBwYXJhbSBkaWZmIFNldCBvZiBzdGFuZGFyZCBkZXZpYXRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21pemUoY29sb3IsIGRpZmYpIHtcbiAgICBpZiAoIShkaWZmIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIGRpZmYgPSBNYXRoLnJvdW5kKFJORy5nZXROb3JtYWwoMCwgZGlmZikpO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0ID0gY29sb3Iuc2xpY2UoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICByZXN1bHRbaV0gKz0gKGRpZmYgaW5zdGFuY2VvZiBBcnJheSA/IE1hdGgucm91bmQoUk5HLmdldE5vcm1hbCgwLCBkaWZmW2ldKSkgOiBkaWZmKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogQ29udmVydHMgYW4gUkdCIGNvbG9yIHZhbHVlIHRvIEhTTC4gRXhwZWN0cyAwLi4yNTUgaW5wdXRzLCBwcm9kdWNlcyAwLi4xIG91dHB1dHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZ2IyaHNsKGNvbG9yKSB7XG4gICAgbGV0IHIgPSBjb2xvclswXSAvIDI1NTtcbiAgICBsZXQgZyA9IGNvbG9yWzFdIC8gMjU1O1xuICAgIGxldCBiID0gY29sb3JbMl0gLyAyNTU7XG4gICAgbGV0IG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLCBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcbiAgICBsZXQgaCA9IDAsIHMsIGwgPSAobWF4ICsgbWluKSAvIDI7XG4gICAgaWYgKG1heCA9PSBtaW4pIHtcbiAgICAgICAgcyA9IDA7IC8vIGFjaHJvbWF0aWNcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxldCBkID0gbWF4IC0gbWluO1xuICAgICAgICBzID0gKGwgPiAwLjUgPyBkIC8gKDIgLSBtYXggLSBtaW4pIDogZCAvIChtYXggKyBtaW4pKTtcbiAgICAgICAgc3dpdGNoIChtYXgpIHtcbiAgICAgICAgICAgIGNhc2UgcjpcbiAgICAgICAgICAgICAgICBoID0gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGc6XG4gICAgICAgICAgICAgICAgaCA9IChiIC0gcikgLyBkICsgMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgYjpcbiAgICAgICAgICAgICAgICBoID0gKHIgLSBnKSAvIGQgKyA0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGggLz0gNjtcbiAgICB9XG4gICAgcmV0dXJuIFtoLCBzLCBsXTtcbn1cbmZ1bmN0aW9uIGh1ZTJyZ2IocCwgcSwgdCkge1xuICAgIGlmICh0IDwgMClcbiAgICAgICAgdCArPSAxO1xuICAgIGlmICh0ID4gMSlcbiAgICAgICAgdCAtPSAxO1xuICAgIGlmICh0IDwgMSAvIDYpXG4gICAgICAgIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xuICAgIGlmICh0IDwgMSAvIDIpXG4gICAgICAgIHJldHVybiBxO1xuICAgIGlmICh0IDwgMiAvIDMpXG4gICAgICAgIHJldHVybiBwICsgKHEgLSBwKSAqICgyIC8gMyAtIHQpICogNjtcbiAgICByZXR1cm4gcDtcbn1cbi8qKlxuICogQ29udmVydHMgYW4gSFNMIGNvbG9yIHZhbHVlIHRvIFJHQi4gRXhwZWN0cyAwLi4xIGlucHV0cywgcHJvZHVjZXMgMC4uMjU1IG91dHB1dHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoc2wycmdiKGNvbG9yKSB7XG4gICAgbGV0IGwgPSBjb2xvclsyXTtcbiAgICBpZiAoY29sb3JbMV0gPT0gMCkge1xuICAgICAgICBsID0gTWF0aC5yb3VuZChsICogMjU1KTtcbiAgICAgICAgcmV0dXJuIFtsLCBsLCBsXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxldCBzID0gY29sb3JbMV07XG4gICAgICAgIGxldCBxID0gKGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHMpO1xuICAgICAgICBsZXQgcCA9IDIgKiBsIC0gcTtcbiAgICAgICAgbGV0IHIgPSBodWUycmdiKHAsIHEsIGNvbG9yWzBdICsgMSAvIDMpO1xuICAgICAgICBsZXQgZyA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0pO1xuICAgICAgICBsZXQgYiA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0gLSAxIC8gMyk7XG4gICAgICAgIHJldHVybiBbTWF0aC5yb3VuZChyICogMjU1KSwgTWF0aC5yb3VuZChnICogMjU1KSwgTWF0aC5yb3VuZChiICogMjU1KV07XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHRvUkdCKGNvbG9yKSB7XG4gICAgbGV0IGNsYW1wZWQgPSBjb2xvci5tYXAoeCA9PiBjbGFtcCh4LCAwLCAyNTUpKTtcbiAgICByZXR1cm4gYHJnYigke2NsYW1wZWQuam9pbihcIixcIil9KWA7XG59XG5leHBvcnQgZnVuY3Rpb24gdG9IZXgoY29sb3IpIHtcbiAgICBsZXQgY2xhbXBlZCA9IGNvbG9yLm1hcCh4ID0+IGNsYW1wKHgsIDAsIDI1NSkudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSk7XG4gICAgcmV0dXJuIGAjJHtjbGFtcGVkLmpvaW4oXCJcIil9YDtcbn1cbmNvbnN0IENBQ0hFID0ge1xuICAgIFwiYmxhY2tcIjogWzAsIDAsIDBdLFxuICAgIFwibmF2eVwiOiBbMCwgMCwgMTI4XSxcbiAgICBcImRhcmtibHVlXCI6IFswLCAwLCAxMzldLFxuICAgIFwibWVkaXVtYmx1ZVwiOiBbMCwgMCwgMjA1XSxcbiAgICBcImJsdWVcIjogWzAsIDAsIDI1NV0sXG4gICAgXCJkYXJrZ3JlZW5cIjogWzAsIDEwMCwgMF0sXG4gICAgXCJncmVlblwiOiBbMCwgMTI4LCAwXSxcbiAgICBcInRlYWxcIjogWzAsIDEyOCwgMTI4XSxcbiAgICBcImRhcmtjeWFuXCI6IFswLCAxMzksIDEzOV0sXG4gICAgXCJkZWVwc2t5Ymx1ZVwiOiBbMCwgMTkxLCAyNTVdLFxuICAgIFwiZGFya3R1cnF1b2lzZVwiOiBbMCwgMjA2LCAyMDldLFxuICAgIFwibWVkaXVtc3ByaW5nZ3JlZW5cIjogWzAsIDI1MCwgMTU0XSxcbiAgICBcImxpbWVcIjogWzAsIDI1NSwgMF0sXG4gICAgXCJzcHJpbmdncmVlblwiOiBbMCwgMjU1LCAxMjddLFxuICAgIFwiYXF1YVwiOiBbMCwgMjU1LCAyNTVdLFxuICAgIFwiY3lhblwiOiBbMCwgMjU1LCAyNTVdLFxuICAgIFwibWlkbmlnaHRibHVlXCI6IFsyNSwgMjUsIDExMl0sXG4gICAgXCJkb2RnZXJibHVlXCI6IFszMCwgMTQ0LCAyNTVdLFxuICAgIFwiZm9yZXN0Z3JlZW5cIjogWzM0LCAxMzksIDM0XSxcbiAgICBcInNlYWdyZWVuXCI6IFs0NiwgMTM5LCA4N10sXG4gICAgXCJkYXJrc2xhdGVncmF5XCI6IFs0NywgNzksIDc5XSxcbiAgICBcImRhcmtzbGF0ZWdyZXlcIjogWzQ3LCA3OSwgNzldLFxuICAgIFwibGltZWdyZWVuXCI6IFs1MCwgMjA1LCA1MF0sXG4gICAgXCJtZWRpdW1zZWFncmVlblwiOiBbNjAsIDE3OSwgMTEzXSxcbiAgICBcInR1cnF1b2lzZVwiOiBbNjQsIDIyNCwgMjA4XSxcbiAgICBcInJveWFsYmx1ZVwiOiBbNjUsIDEwNSwgMjI1XSxcbiAgICBcInN0ZWVsYmx1ZVwiOiBbNzAsIDEzMCwgMTgwXSxcbiAgICBcImRhcmtzbGF0ZWJsdWVcIjogWzcyLCA2MSwgMTM5XSxcbiAgICBcIm1lZGl1bXR1cnF1b2lzZVwiOiBbNzIsIDIwOSwgMjA0XSxcbiAgICBcImluZGlnb1wiOiBbNzUsIDAsIDEzMF0sXG4gICAgXCJkYXJrb2xpdmVncmVlblwiOiBbODUsIDEwNywgNDddLFxuICAgIFwiY2FkZXRibHVlXCI6IFs5NSwgMTU4LCAxNjBdLFxuICAgIFwiY29ybmZsb3dlcmJsdWVcIjogWzEwMCwgMTQ5LCAyMzddLFxuICAgIFwibWVkaXVtYXF1YW1hcmluZVwiOiBbMTAyLCAyMDUsIDE3MF0sXG4gICAgXCJkaW1ncmF5XCI6IFsxMDUsIDEwNSwgMTA1XSxcbiAgICBcImRpbWdyZXlcIjogWzEwNSwgMTA1LCAxMDVdLFxuICAgIFwic2xhdGVibHVlXCI6IFsxMDYsIDkwLCAyMDVdLFxuICAgIFwib2xpdmVkcmFiXCI6IFsxMDcsIDE0MiwgMzVdLFxuICAgIFwic2xhdGVncmF5XCI6IFsxMTIsIDEyOCwgMTQ0XSxcbiAgICBcInNsYXRlZ3JleVwiOiBbMTEyLCAxMjgsIDE0NF0sXG4gICAgXCJsaWdodHNsYXRlZ3JheVwiOiBbMTE5LCAxMzYsIDE1M10sXG4gICAgXCJsaWdodHNsYXRlZ3JleVwiOiBbMTE5LCAxMzYsIDE1M10sXG4gICAgXCJtZWRpdW1zbGF0ZWJsdWVcIjogWzEyMywgMTA0LCAyMzhdLFxuICAgIFwibGF3bmdyZWVuXCI6IFsxMjQsIDI1MiwgMF0sXG4gICAgXCJjaGFydHJldXNlXCI6IFsxMjcsIDI1NSwgMF0sXG4gICAgXCJhcXVhbWFyaW5lXCI6IFsxMjcsIDI1NSwgMjEyXSxcbiAgICBcIm1hcm9vblwiOiBbMTI4LCAwLCAwXSxcbiAgICBcInB1cnBsZVwiOiBbMTI4LCAwLCAxMjhdLFxuICAgIFwib2xpdmVcIjogWzEyOCwgMTI4LCAwXSxcbiAgICBcImdyYXlcIjogWzEyOCwgMTI4LCAxMjhdLFxuICAgIFwiZ3JleVwiOiBbMTI4LCAxMjgsIDEyOF0sXG4gICAgXCJza3libHVlXCI6IFsxMzUsIDIwNiwgMjM1XSxcbiAgICBcImxpZ2h0c2t5Ymx1ZVwiOiBbMTM1LCAyMDYsIDI1MF0sXG4gICAgXCJibHVldmlvbGV0XCI6IFsxMzgsIDQzLCAyMjZdLFxuICAgIFwiZGFya3JlZFwiOiBbMTM5LCAwLCAwXSxcbiAgICBcImRhcmttYWdlbnRhXCI6IFsxMzksIDAsIDEzOV0sXG4gICAgXCJzYWRkbGVicm93blwiOiBbMTM5LCA2OSwgMTldLFxuICAgIFwiZGFya3NlYWdyZWVuXCI6IFsxNDMsIDE4OCwgMTQzXSxcbiAgICBcImxpZ2h0Z3JlZW5cIjogWzE0NCwgMjM4LCAxNDRdLFxuICAgIFwibWVkaXVtcHVycGxlXCI6IFsxNDcsIDExMiwgMjE2XSxcbiAgICBcImRhcmt2aW9sZXRcIjogWzE0OCwgMCwgMjExXSxcbiAgICBcInBhbGVncmVlblwiOiBbMTUyLCAyNTEsIDE1Ml0sXG4gICAgXCJkYXJrb3JjaGlkXCI6IFsxNTMsIDUwLCAyMDRdLFxuICAgIFwieWVsbG93Z3JlZW5cIjogWzE1NCwgMjA1LCA1MF0sXG4gICAgXCJzaWVubmFcIjogWzE2MCwgODIsIDQ1XSxcbiAgICBcImJyb3duXCI6IFsxNjUsIDQyLCA0Ml0sXG4gICAgXCJkYXJrZ3JheVwiOiBbMTY5LCAxNjksIDE2OV0sXG4gICAgXCJkYXJrZ3JleVwiOiBbMTY5LCAxNjksIDE2OV0sXG4gICAgXCJsaWdodGJsdWVcIjogWzE3MywgMjE2LCAyMzBdLFxuICAgIFwiZ3JlZW55ZWxsb3dcIjogWzE3MywgMjU1LCA0N10sXG4gICAgXCJwYWxldHVycXVvaXNlXCI6IFsxNzUsIDIzOCwgMjM4XSxcbiAgICBcImxpZ2h0c3RlZWxibHVlXCI6IFsxNzYsIDE5NiwgMjIyXSxcbiAgICBcInBvd2RlcmJsdWVcIjogWzE3NiwgMjI0LCAyMzBdLFxuICAgIFwiZmlyZWJyaWNrXCI6IFsxNzgsIDM0LCAzNF0sXG4gICAgXCJkYXJrZ29sZGVucm9kXCI6IFsxODQsIDEzNCwgMTFdLFxuICAgIFwibWVkaXVtb3JjaGlkXCI6IFsxODYsIDg1LCAyMTFdLFxuICAgIFwicm9zeWJyb3duXCI6IFsxODgsIDE0MywgMTQzXSxcbiAgICBcImRhcmtraGFraVwiOiBbMTg5LCAxODMsIDEwN10sXG4gICAgXCJzaWx2ZXJcIjogWzE5MiwgMTkyLCAxOTJdLFxuICAgIFwibWVkaXVtdmlvbGV0cmVkXCI6IFsxOTksIDIxLCAxMzNdLFxuICAgIFwiaW5kaWFucmVkXCI6IFsyMDUsIDkyLCA5Ml0sXG4gICAgXCJwZXJ1XCI6IFsyMDUsIDEzMywgNjNdLFxuICAgIFwiY2hvY29sYXRlXCI6IFsyMTAsIDEwNSwgMzBdLFxuICAgIFwidGFuXCI6IFsyMTAsIDE4MCwgMTQwXSxcbiAgICBcImxpZ2h0Z3JheVwiOiBbMjExLCAyMTEsIDIxMV0sXG4gICAgXCJsaWdodGdyZXlcIjogWzIxMSwgMjExLCAyMTFdLFxuICAgIFwicGFsZXZpb2xldHJlZFwiOiBbMjE2LCAxMTIsIDE0N10sXG4gICAgXCJ0aGlzdGxlXCI6IFsyMTYsIDE5MSwgMjE2XSxcbiAgICBcIm9yY2hpZFwiOiBbMjE4LCAxMTIsIDIxNF0sXG4gICAgXCJnb2xkZW5yb2RcIjogWzIxOCwgMTY1LCAzMl0sXG4gICAgXCJjcmltc29uXCI6IFsyMjAsIDIwLCA2MF0sXG4gICAgXCJnYWluc2Jvcm9cIjogWzIyMCwgMjIwLCAyMjBdLFxuICAgIFwicGx1bVwiOiBbMjIxLCAxNjAsIDIyMV0sXG4gICAgXCJidXJseXdvb2RcIjogWzIyMiwgMTg0LCAxMzVdLFxuICAgIFwibGlnaHRjeWFuXCI6IFsyMjQsIDI1NSwgMjU1XSxcbiAgICBcImxhdmVuZGVyXCI6IFsyMzAsIDIzMCwgMjUwXSxcbiAgICBcImRhcmtzYWxtb25cIjogWzIzMywgMTUwLCAxMjJdLFxuICAgIFwidmlvbGV0XCI6IFsyMzgsIDEzMCwgMjM4XSxcbiAgICBcInBhbGVnb2xkZW5yb2RcIjogWzIzOCwgMjMyLCAxNzBdLFxuICAgIFwibGlnaHRjb3JhbFwiOiBbMjQwLCAxMjgsIDEyOF0sXG4gICAgXCJraGFraVwiOiBbMjQwLCAyMzAsIDE0MF0sXG4gICAgXCJhbGljZWJsdWVcIjogWzI0MCwgMjQ4LCAyNTVdLFxuICAgIFwiaG9uZXlkZXdcIjogWzI0MCwgMjU1LCAyNDBdLFxuICAgIFwiYXp1cmVcIjogWzI0MCwgMjU1LCAyNTVdLFxuICAgIFwic2FuZHlicm93blwiOiBbMjQ0LCAxNjQsIDk2XSxcbiAgICBcIndoZWF0XCI6IFsyNDUsIDIyMiwgMTc5XSxcbiAgICBcImJlaWdlXCI6IFsyNDUsIDI0NSwgMjIwXSxcbiAgICBcIndoaXRlc21va2VcIjogWzI0NSwgMjQ1LCAyNDVdLFxuICAgIFwibWludGNyZWFtXCI6IFsyNDUsIDI1NSwgMjUwXSxcbiAgICBcImdob3N0d2hpdGVcIjogWzI0OCwgMjQ4LCAyNTVdLFxuICAgIFwic2FsbW9uXCI6IFsyNTAsIDEyOCwgMTE0XSxcbiAgICBcImFudGlxdWV3aGl0ZVwiOiBbMjUwLCAyMzUsIDIxNV0sXG4gICAgXCJsaW5lblwiOiBbMjUwLCAyNDAsIDIzMF0sXG4gICAgXCJsaWdodGdvbGRlbnJvZHllbGxvd1wiOiBbMjUwLCAyNTAsIDIxMF0sXG4gICAgXCJvbGRsYWNlXCI6IFsyNTMsIDI0NSwgMjMwXSxcbiAgICBcInJlZFwiOiBbMjU1LCAwLCAwXSxcbiAgICBcImZ1Y2hzaWFcIjogWzI1NSwgMCwgMjU1XSxcbiAgICBcIm1hZ2VudGFcIjogWzI1NSwgMCwgMjU1XSxcbiAgICBcImRlZXBwaW5rXCI6IFsyNTUsIDIwLCAxNDddLFxuICAgIFwib3JhbmdlcmVkXCI6IFsyNTUsIDY5LCAwXSxcbiAgICBcInRvbWF0b1wiOiBbMjU1LCA5OSwgNzFdLFxuICAgIFwiaG90cGlua1wiOiBbMjU1LCAxMDUsIDE4MF0sXG4gICAgXCJjb3JhbFwiOiBbMjU1LCAxMjcsIDgwXSxcbiAgICBcImRhcmtvcmFuZ2VcIjogWzI1NSwgMTQwLCAwXSxcbiAgICBcImxpZ2h0c2FsbW9uXCI6IFsyNTUsIDE2MCwgMTIyXSxcbiAgICBcIm9yYW5nZVwiOiBbMjU1LCAxNjUsIDBdLFxuICAgIFwibGlnaHRwaW5rXCI6IFsyNTUsIDE4MiwgMTkzXSxcbiAgICBcInBpbmtcIjogWzI1NSwgMTkyLCAyMDNdLFxuICAgIFwiZ29sZFwiOiBbMjU1LCAyMTUsIDBdLFxuICAgIFwicGVhY2hwdWZmXCI6IFsyNTUsIDIxOCwgMTg1XSxcbiAgICBcIm5hdmFqb3doaXRlXCI6IFsyNTUsIDIyMiwgMTczXSxcbiAgICBcIm1vY2Nhc2luXCI6IFsyNTUsIDIyOCwgMTgxXSxcbiAgICBcImJpc3F1ZVwiOiBbMjU1LCAyMjgsIDE5Nl0sXG4gICAgXCJtaXN0eXJvc2VcIjogWzI1NSwgMjI4LCAyMjVdLFxuICAgIFwiYmxhbmNoZWRhbG1vbmRcIjogWzI1NSwgMjM1LCAyMDVdLFxuICAgIFwicGFwYXlhd2hpcFwiOiBbMjU1LCAyMzksIDIxM10sXG4gICAgXCJsYXZlbmRlcmJsdXNoXCI6IFsyNTUsIDI0MCwgMjQ1XSxcbiAgICBcInNlYXNoZWxsXCI6IFsyNTUsIDI0NSwgMjM4XSxcbiAgICBcImNvcm5zaWxrXCI6IFsyNTUsIDI0OCwgMjIwXSxcbiAgICBcImxlbW9uY2hpZmZvblwiOiBbMjU1LCAyNTAsIDIwNV0sXG4gICAgXCJmbG9yYWx3aGl0ZVwiOiBbMjU1LCAyNTAsIDI0MF0sXG4gICAgXCJzbm93XCI6IFsyNTUsIDI1MCwgMjUwXSxcbiAgICBcInllbGxvd1wiOiBbMjU1LCAyNTUsIDBdLFxuICAgIFwibGlnaHR5ZWxsb3dcIjogWzI1NSwgMjU1LCAyMjRdLFxuICAgIFwiaXZvcnlcIjogWzI1NSwgMjU1LCAyNDBdLFxuICAgIFwid2hpdGVcIjogWzI1NSwgMjU1LCAyNTVdXG59O1xuIiwiaW1wb3J0IEJhY2tlbmQgZnJvbSBcIi4vYmFja2VuZC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzIGV4dGVuZHMgQmFja2VuZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2N0eCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIH1cbiAgICBzY2hlZHVsZShjYikgeyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpOyB9XG4gICAgZ2V0Q29udGFpbmVyKCkgeyByZXR1cm4gdGhpcy5fY3R4LmNhbnZhczsgfVxuICAgIHNldE9wdGlvbnMob3B0cykge1xuICAgICAgICBzdXBlci5zZXRPcHRpb25zKG9wdHMpO1xuICAgICAgICBjb25zdCBzdHlsZSA9IChvcHRzLmZvbnRTdHlsZSA/IGAke29wdHMuZm9udFN0eWxlfSBgIDogYGApO1xuICAgICAgICBjb25zdCBmb250ID0gYCR7c3R5bGV9ICR7b3B0cy5mb250U2l6ZX1weCAke29wdHMuZm9udEZhbWlseX1gO1xuICAgICAgICB0aGlzLl9jdHguZm9udCA9IGZvbnQ7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVNpemUoKTtcbiAgICAgICAgdGhpcy5fY3R4LmZvbnQgPSBmb250O1xuICAgICAgICB0aGlzLl9jdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICAgICAgdGhpcy5fY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG4gICAgfVxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9jdHguZmlsbFN0eWxlID0gdGhpcy5fb3B0aW9ucy5iZztcbiAgICAgICAgdGhpcy5fY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuX2N0eC5jYW52YXMud2lkdGgsIHRoaXMuX2N0eC5jYW52YXMuaGVpZ2h0KTtcbiAgICB9XG4gICAgZXZlbnRUb1Bvc2l0aW9uKHgsIHkpIHtcbiAgICAgICAgbGV0IGNhbnZhcyA9IHRoaXMuX2N0eC5jYW52YXM7XG4gICAgICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB4IC09IHJlY3QubGVmdDtcbiAgICAgICAgeSAtPSByZWN0LnRvcDtcbiAgICAgICAgeCAqPSBjYW52YXMud2lkdGggLyByZWN0LndpZHRoO1xuICAgICAgICB5ICo9IGNhbnZhcy5oZWlnaHQgLyByZWN0LmhlaWdodDtcbiAgICAgICAgaWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPj0gY2FudmFzLndpZHRoIHx8IHkgPj0gY2FudmFzLmhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIFstMSwgLTFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9ub3JtYWxpemVkRXZlbnRUb1Bvc2l0aW9uKHgsIHkpO1xuICAgIH1cbn1cbiIsImltcG9ydCBDYW52YXMgZnJvbSBcIi4vY2FudmFzLmpzXCI7XG5pbXBvcnQgeyBtb2QgfSBmcm9tIFwiLi4vdXRpbC5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgSGV4YWdvbmFsIGJhY2tlbmRcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhleCBleHRlbmRzIENhbnZhcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3NwYWNpbmdYID0gMDtcbiAgICAgICAgdGhpcy5fc3BhY2luZ1kgPSAwO1xuICAgICAgICB0aGlzLl9oZXhTaXplID0gMDtcbiAgICB9XG4gICAgZHJhdyhkYXRhLCBjbGVhckJlZm9yZSkge1xuICAgICAgICBsZXQgW3gsIHksIGNoLCBmZywgYmddID0gZGF0YTtcbiAgICAgICAgbGV0IHB4ID0gW1xuICAgICAgICAgICAgKHggKyAxKSAqIHRoaXMuX3NwYWNpbmdYLFxuICAgICAgICAgICAgeSAqIHRoaXMuX3NwYWNpbmdZICsgdGhpcy5faGV4U2l6ZVxuICAgICAgICBdO1xuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcbiAgICAgICAgICAgIHB4LnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xlYXJCZWZvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsU3R5bGUgPSBiZztcbiAgICAgICAgICAgIHRoaXMuX2ZpbGwocHhbMF0sIHB4WzFdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3R4LmZpbGxTdHlsZSA9IGZnO1xuICAgICAgICBsZXQgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9jdHguZmlsbFRleHQoY2hhcnNbaV0sIHB4WzBdLCBNYXRoLmNlaWwocHhbMV0pKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wdXRlU2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcbiAgICAgICAgICAgIGF2YWlsV2lkdGggKz0gYXZhaWxIZWlnaHQ7XG4gICAgICAgICAgICBhdmFpbEhlaWdodCA9IGF2YWlsV2lkdGggLSBhdmFpbEhlaWdodDtcbiAgICAgICAgICAgIGF2YWlsV2lkdGggLT0gYXZhaWxIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fc3BhY2luZ1gpIC0gMTtcbiAgICAgICAgbGV0IGhlaWdodCA9IE1hdGguZmxvb3IoKGF2YWlsSGVpZ2h0IC0gMiAqIHRoaXMuX2hleFNpemUpIC8gdGhpcy5fc3BhY2luZ1kgKyAxKTtcbiAgICAgICAgcmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcbiAgICB9XG4gICAgY29tcHV0ZUZvbnRTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG4gICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkge1xuICAgICAgICAgICAgYXZhaWxXaWR0aCArPSBhdmFpbEhlaWdodDtcbiAgICAgICAgICAgIGF2YWlsSGVpZ2h0ID0gYXZhaWxXaWR0aCAtIGF2YWlsSGVpZ2h0O1xuICAgICAgICAgICAgYXZhaWxXaWR0aCAtPSBhdmFpbEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaGV4U2l6ZVdpZHRoID0gMiAqIGF2YWlsV2lkdGggLyAoKHRoaXMuX29wdGlvbnMud2lkdGggKyAxKSAqIE1hdGguc3FydCgzKSkgLSAxO1xuICAgICAgICBsZXQgaGV4U2l6ZUhlaWdodCA9IGF2YWlsSGVpZ2h0IC8gKDIgKyAxLjUgKiAodGhpcy5fb3B0aW9ucy5oZWlnaHQgLSAxKSk7XG4gICAgICAgIGxldCBoZXhTaXplID0gTWF0aC5taW4oaGV4U2l6ZVdpZHRoLCBoZXhTaXplSGVpZ2h0KTtcbiAgICAgICAgLy8gY29tcHV0ZSBjaGFyIHJhdGlvXG4gICAgICAgIGxldCBvbGRGb250ID0gdGhpcy5fY3R4LmZvbnQ7XG4gICAgICAgIHRoaXMuX2N0eC5mb250ID0gXCIxMDBweCBcIiArIHRoaXMuX29wdGlvbnMuZm9udEZhbWlseTtcbiAgICAgICAgbGV0IHdpZHRoID0gTWF0aC5jZWlsKHRoaXMuX2N0eC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xuICAgICAgICB0aGlzLl9jdHguZm9udCA9IG9sZEZvbnQ7XG4gICAgICAgIGxldCByYXRpbyA9IHdpZHRoIC8gMTAwO1xuICAgICAgICBoZXhTaXplID0gTWF0aC5mbG9vcihoZXhTaXplKSArIDE7IC8vIGNsb3Nlc3QgbGFyZ2VyIGhleFNpemVcbiAgICAgICAgLy8gRklYTUUgY2hhciBzaXplIGNvbXB1dGF0aW9uIGRvZXMgbm90IHJlc3BlY3QgdHJhbnNwb3NlZCBoZXhlc1xuICAgICAgICBsZXQgZm9udFNpemUgPSAyICogaGV4U2l6ZSAvICh0aGlzLl9vcHRpb25zLnNwYWNpbmcgKiAoMSArIHJhdGlvIC8gTWF0aC5zcXJ0KDMpKSk7XG4gICAgICAgIC8vIGNsb3Nlc3Qgc21hbGxlciBmb250U2l6ZVxuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKGZvbnRTaXplKSAtIDE7XG4gICAgfVxuICAgIF9ub3JtYWxpemVkRXZlbnRUb1Bvc2l0aW9uKHgsIHkpIHtcbiAgICAgICAgbGV0IG5vZGVTaXplO1xuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcbiAgICAgICAgICAgIHggKz0geTtcbiAgICAgICAgICAgIHkgPSB4IC0geTtcbiAgICAgICAgICAgIHggLT0geTtcbiAgICAgICAgICAgIG5vZGVTaXplID0gdGhpcy5fY3R4LmNhbnZhcy53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5vZGVTaXplID0gdGhpcy5fY3R4LmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNpemUgPSBub2RlU2l6ZSAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0O1xuICAgICAgICB5ID0gTWF0aC5mbG9vcih5IC8gc2l6ZSk7XG4gICAgICAgIGlmIChtb2QoeSwgMikpIHsgLyogb2RkIHJvdyAqL1xuICAgICAgICAgICAgeCAtPSB0aGlzLl9zcGFjaW5nWDtcbiAgICAgICAgICAgIHggPSAxICsgMiAqIE1hdGguZmxvb3IoeCAvICgyICogdGhpcy5fc3BhY2luZ1gpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHggPSAyICogTWF0aC5mbG9vcih4IC8gKDIgKiB0aGlzLl9zcGFjaW5nWCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFyZ3VtZW50cyBhcmUgcGl4ZWwgdmFsdWVzLiBJZiBcInRyYW5zcG9zZWRcIiBtb2RlIGlzIGVuYWJsZWQsIHRoZW4gdGhlc2UgdHdvIGFyZSBhbHJlYWR5IHN3YXBwZWQuXG4gICAgICovXG4gICAgX2ZpbGwoY3gsIGN5KSB7XG4gICAgICAgIGxldCBhID0gdGhpcy5faGV4U2l6ZTtcbiAgICAgICAgbGV0IGIgPSB0aGlzLl9vcHRpb25zLmJvcmRlcjtcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fY3R4O1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkge1xuICAgICAgICAgICAgY3R4Lm1vdmVUbyhjeCAtIGEgKyBiLCBjeSk7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4IC0gYSAvIDIgKyBiLCBjeSArIHRoaXMuX3NwYWNpbmdYIC0gYik7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4ICsgYSAvIDIgLSBiLCBjeSArIHRoaXMuX3NwYWNpbmdYIC0gYik7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4ICsgYSAtIGIsIGN5KTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8oY3ggKyBhIC8gMiAtIGIsIGN5IC0gdGhpcy5fc3BhY2luZ1ggKyBiKTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8oY3ggLSBhIC8gMiArIGIsIGN5IC0gdGhpcy5fc3BhY2luZ1ggKyBiKTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8oY3ggLSBhICsgYiwgY3kpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY3R4Lm1vdmVUbyhjeCwgY3kgLSBhICsgYik7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4ICsgdGhpcy5fc3BhY2luZ1ggLSBiLCBjeSAtIGEgLyAyICsgYik7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4ICsgdGhpcy5fc3BhY2luZ1ggLSBiLCBjeSArIGEgLyAyIC0gYik7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4LCBjeSArIGEgLSBiKTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8oY3ggLSB0aGlzLl9zcGFjaW5nWCArIGIsIGN5ICsgYSAvIDIgLSBiKTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8oY3ggLSB0aGlzLl9zcGFjaW5nWCArIGIsIGN5IC0gYSAvIDIgKyBiKTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8oY3gsIGN5IC0gYSArIGIpO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgfVxuICAgIF91cGRhdGVTaXplKCkge1xuICAgICAgICBjb25zdCBvcHRzID0gdGhpcy5fb3B0aW9ucztcbiAgICAgICAgY29uc3QgY2hhcldpZHRoID0gTWF0aC5jZWlsKHRoaXMuX2N0eC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xuICAgICAgICB0aGlzLl9oZXhTaXplID0gTWF0aC5mbG9vcihvcHRzLnNwYWNpbmcgKiAob3B0cy5mb250U2l6ZSArIGNoYXJXaWR0aCAvIE1hdGguc3FydCgzKSkgLyAyKTtcbiAgICAgICAgdGhpcy5fc3BhY2luZ1ggPSB0aGlzLl9oZXhTaXplICogTWF0aC5zcXJ0KDMpIC8gMjtcbiAgICAgICAgdGhpcy5fc3BhY2luZ1kgPSB0aGlzLl9oZXhTaXplICogMS41O1xuICAgICAgICBsZXQgeHByb3A7XG4gICAgICAgIGxldCB5cHJvcDtcbiAgICAgICAgaWYgKG9wdHMudHJhbnNwb3NlKSB7XG4gICAgICAgICAgICB4cHJvcCA9IFwiaGVpZ2h0XCI7XG4gICAgICAgICAgICB5cHJvcCA9IFwid2lkdGhcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHhwcm9wID0gXCJ3aWR0aFwiO1xuICAgICAgICAgICAgeXByb3AgPSBcImhlaWdodFwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N0eC5jYW52YXNbeHByb3BdID0gTWF0aC5jZWlsKChvcHRzLndpZHRoICsgMSkgKiB0aGlzLl9zcGFjaW5nWCk7XG4gICAgICAgIHRoaXMuX2N0eC5jYW52YXNbeXByb3BdID0gTWF0aC5jZWlsKChvcHRzLmhlaWdodCAtIDEpICogdGhpcy5fc3BhY2luZ1kgKyAyICogdGhpcy5faGV4U2l6ZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IENhbnZhcyBmcm9tIFwiLi9jYW52YXMuanNcIjtcbi8qKlxuICogQGNsYXNzIFJlY3Rhbmd1bGFyIGJhY2tlbmRcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3QgZXh0ZW5kcyBDYW52YXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9zcGFjaW5nWCA9IDA7XG4gICAgICAgIHRoaXMuX3NwYWNpbmdZID0gMDtcbiAgICAgICAgdGhpcy5fY2FudmFzQ2FjaGUgPSB7fTtcbiAgICB9XG4gICAgc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2NhbnZhc0NhY2hlID0ge307XG4gICAgfVxuICAgIGRyYXcoZGF0YSwgY2xlYXJCZWZvcmUpIHtcbiAgICAgICAgaWYgKFJlY3QuY2FjaGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2RyYXdXaXRoQ2FjaGUoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kcmF3Tm9DYWNoZShkYXRhLCBjbGVhckJlZm9yZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2RyYXdXaXRoQ2FjaGUoZGF0YSkge1xuICAgICAgICBsZXQgW3gsIHksIGNoLCBmZywgYmddID0gZGF0YTtcbiAgICAgICAgbGV0IGhhc2ggPSBcIlwiICsgY2ggKyBmZyArIGJnO1xuICAgICAgICBsZXQgY2FudmFzO1xuICAgICAgICBpZiAoaGFzaCBpbiB0aGlzLl9jYW52YXNDYWNoZSkge1xuICAgICAgICAgICAgY2FudmFzID0gdGhpcy5fY2FudmFzQ2FjaGVbaGFzaF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgYiA9IHRoaXMuX29wdGlvbnMuYm9yZGVyO1xuICAgICAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgICAgIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdGhpcy5fc3BhY2luZ1g7XG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5fc3BhY2luZ1k7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gYmc7XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoYiwgYiwgY2FudmFzLndpZHRoIC0gYiwgY2FudmFzLmhlaWdodCAtIGIpO1xuICAgICAgICAgICAgaWYgKGNoKSB7XG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZnO1xuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gdGhpcy5fY3R4LmZvbnQ7XG4gICAgICAgICAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgICAgICAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG4gICAgICAgICAgICAgICAgbGV0IGNoYXJzID0gW10uY29uY2F0KGNoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChjaGFyc1tpXSwgdGhpcy5fc3BhY2luZ1ggLyAyLCBNYXRoLmNlaWwodGhpcy5fc3BhY2luZ1kgLyAyKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY2FudmFzQ2FjaGVbaGFzaF0gPSBjYW52YXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3R4LmRyYXdJbWFnZShjYW52YXMsIHggKiB0aGlzLl9zcGFjaW5nWCwgeSAqIHRoaXMuX3NwYWNpbmdZKTtcbiAgICB9XG4gICAgX2RyYXdOb0NhY2hlKGRhdGEsIGNsZWFyQmVmb3JlKSB7XG4gICAgICAgIGxldCBbeCwgeSwgY2gsIGZnLCBiZ10gPSBkYXRhO1xuICAgICAgICBpZiAoY2xlYXJCZWZvcmUpIHtcbiAgICAgICAgICAgIGxldCBiID0gdGhpcy5fb3B0aW9ucy5ib3JkZXI7XG4gICAgICAgICAgICB0aGlzLl9jdHguZmlsbFN0eWxlID0gYmc7XG4gICAgICAgICAgICB0aGlzLl9jdHguZmlsbFJlY3QoeCAqIHRoaXMuX3NwYWNpbmdYICsgYiwgeSAqIHRoaXMuX3NwYWNpbmdZICsgYiwgdGhpcy5fc3BhY2luZ1ggLSBiLCB0aGlzLl9zcGFjaW5nWSAtIGIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY2gpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdHguZmlsbFN0eWxlID0gZmc7XG4gICAgICAgIGxldCBjaGFycyA9IFtdLmNvbmNhdChjaCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsVGV4dChjaGFyc1tpXSwgKHggKyAwLjUpICogdGhpcy5fc3BhY2luZ1gsIE1hdGguY2VpbCgoeSArIDAuNSkgKiB0aGlzLl9zcGFjaW5nWSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbXB1dGVTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG4gICAgICAgIGxldCB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX3NwYWNpbmdYKTtcbiAgICAgICAgbGV0IGhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9zcGFjaW5nWSk7XG4gICAgICAgIHJldHVybiBbd2lkdGgsIGhlaWdodF07XG4gICAgfVxuICAgIGNvbXB1dGVGb250U2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuICAgICAgICBsZXQgYm94V2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLndpZHRoKTtcbiAgICAgICAgbGV0IGJveEhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9vcHRpb25zLmhlaWdodCk7XG4gICAgICAgIC8qIGNvbXB1dGUgY2hhciByYXRpbyAqL1xuICAgICAgICBsZXQgb2xkRm9udCA9IHRoaXMuX2N0eC5mb250O1xuICAgICAgICB0aGlzLl9jdHguZm9udCA9IFwiMTAwcHggXCIgKyB0aGlzLl9vcHRpb25zLmZvbnRGYW1pbHk7XG4gICAgICAgIGxldCB3aWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jdHgubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcbiAgICAgICAgdGhpcy5fY3R4LmZvbnQgPSBvbGRGb250O1xuICAgICAgICBsZXQgcmF0aW8gPSB3aWR0aCAvIDEwMDtcbiAgICAgICAgbGV0IHdpZHRoRnJhY3Rpb24gPSByYXRpbyAqIGJveEhlaWdodCAvIGJveFdpZHRoO1xuICAgICAgICBpZiAod2lkdGhGcmFjdGlvbiA+IDEpIHsgLyogdG9vIHdpZGUgd2l0aCBjdXJyZW50IGFzcGVjdCByYXRpbyAqL1xuICAgICAgICAgICAgYm94SGVpZ2h0ID0gTWF0aC5mbG9vcihib3hIZWlnaHQgLyB3aWR0aEZyYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihib3hIZWlnaHQgLyB0aGlzLl9vcHRpb25zLnNwYWNpbmcpO1xuICAgIH1cbiAgICBfbm9ybWFsaXplZEV2ZW50VG9Qb3NpdGlvbih4LCB5KSB7XG4gICAgICAgIHJldHVybiBbTWF0aC5mbG9vcih4IC8gdGhpcy5fc3BhY2luZ1gpLCBNYXRoLmZsb29yKHkgLyB0aGlzLl9zcGFjaW5nWSldO1xuICAgIH1cbiAgICBfdXBkYXRlU2l6ZSgpIHtcbiAgICAgICAgY29uc3Qgb3B0cyA9IHRoaXMuX29wdGlvbnM7XG4gICAgICAgIGNvbnN0IGNoYXJXaWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jdHgubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcbiAgICAgICAgdGhpcy5fc3BhY2luZ1ggPSBNYXRoLmNlaWwob3B0cy5zcGFjaW5nICogY2hhcldpZHRoKTtcbiAgICAgICAgdGhpcy5fc3BhY2luZ1kgPSBNYXRoLmNlaWwob3B0cy5zcGFjaW5nICogb3B0cy5mb250U2l6ZSk7XG4gICAgICAgIGlmIChvcHRzLmZvcmNlU3F1YXJlUmF0aW8pIHtcbiAgICAgICAgICAgIHRoaXMuX3NwYWNpbmdYID0gdGhpcy5fc3BhY2luZ1kgPSBNYXRoLm1heCh0aGlzLl9zcGFjaW5nWCwgdGhpcy5fc3BhY2luZ1kpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N0eC5jYW52YXMud2lkdGggPSBvcHRzLndpZHRoICogdGhpcy5fc3BhY2luZ1g7XG4gICAgICAgIHRoaXMuX2N0eC5jYW52YXMuaGVpZ2h0ID0gb3B0cy5oZWlnaHQgKiB0aGlzLl9zcGFjaW5nWTtcbiAgICB9XG59XG5SZWN0LmNhY2hlID0gZmFsc2U7XG4iLCJpbXBvcnQgQ2FudmFzIGZyb20gXCIuL2NhbnZhcy5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgVGlsZSBiYWNrZW5kXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWxlIGV4dGVuZHMgQ2FudmFzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fY29sb3JDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIH1cbiAgICBkcmF3KGRhdGEsIGNsZWFyQmVmb3JlKSB7XG4gICAgICAgIGxldCBbeCwgeSwgY2gsIGZnLCBiZ10gPSBkYXRhO1xuICAgICAgICBsZXQgdGlsZVdpZHRoID0gdGhpcy5fb3B0aW9ucy50aWxlV2lkdGg7XG4gICAgICAgIGxldCB0aWxlSGVpZ2h0ID0gdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0O1xuICAgICAgICBpZiAoY2xlYXJCZWZvcmUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbGVDb2xvcml6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N0eC5jbGVhclJlY3QoeCAqIHRpbGVXaWR0aCwgeSAqIHRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdHguZmlsbFN0eWxlID0gYmc7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxSZWN0KHggKiB0aWxlV2lkdGgsIHkgKiB0aWxlSGVpZ2h0LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghY2gpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xuICAgICAgICBsZXQgZmdzID0gW10uY29uY2F0KGZnKTtcbiAgICAgICAgbGV0IGJncyA9IFtdLmNvbmNhdChiZyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB0aWxlID0gdGhpcy5fb3B0aW9ucy50aWxlTWFwW2NoYXJzW2ldXTtcbiAgICAgICAgICAgIGlmICghdGlsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2hhciBcIiR7Y2hhcnNbaV19XCIgbm90IGZvdW5kIGluIHRpbGVNYXBgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbGVDb2xvcml6ZSkgeyAvLyBhcHBseSBjb2xvcml6YXRpb25cbiAgICAgICAgICAgICAgICBsZXQgY2FudmFzID0gdGhpcy5fY29sb3JDYW52YXM7XG4gICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2Utb3ZlclwiO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XG4gICAgICAgICAgICAgICAgbGV0IGZnID0gZmdzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBiZyA9IGJnc1tpXTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLl9vcHRpb25zLnRpbGVTZXQsIHRpbGVbMF0sIHRpbGVbMV0sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCwgMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBpZiAoZmcgIT0gXCJ0cmFuc3BhcmVudFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZmc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2UtYXRvcFwiO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiZyAhPSBcInRyYW5zcGFyZW50XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBiZztcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcImRlc3RpbmF0aW9uLW92ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9jdHguZHJhd0ltYWdlKGNhbnZhcywgeCAqIHRpbGVXaWR0aCwgeSAqIHRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgLy8gbm8gY29sb3JpemluZywgZWFzeVxuICAgICAgICAgICAgICAgIHRoaXMuX2N0eC5kcmF3SW1hZ2UodGhpcy5fb3B0aW9ucy50aWxlU2V0LCB0aWxlWzBdLCB0aWxlWzFdLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsIHggKiB0aWxlV2lkdGgsIHkgKiB0aWxlSGVpZ2h0LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbXB1dGVTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG4gICAgICAgIGxldCB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX29wdGlvbnMudGlsZVdpZHRoKTtcbiAgICAgICAgbGV0IGhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9vcHRpb25zLnRpbGVIZWlnaHQpO1xuICAgICAgICByZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xuICAgIH1cbiAgICBjb21wdXRlRm9udFNpemUoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGUgYmFja2VuZCBkb2VzIG5vdCB1bmRlcnN0YW5kIGZvbnQgc2l6ZVwiKTtcbiAgICB9XG4gICAgX25vcm1hbGl6ZWRFdmVudFRvUG9zaXRpb24oeCwgeSkge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IoeCAvIHRoaXMuX29wdGlvbnMudGlsZVdpZHRoKSwgTWF0aC5mbG9vcih5IC8gdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0KV07XG4gICAgfVxuICAgIF91cGRhdGVTaXplKCkge1xuICAgICAgICBjb25zdCBvcHRzID0gdGhpcy5fb3B0aW9ucztcbiAgICAgICAgdGhpcy5fY3R4LmNhbnZhcy53aWR0aCA9IG9wdHMud2lkdGggKiBvcHRzLnRpbGVXaWR0aDtcbiAgICAgICAgdGhpcy5fY3R4LmNhbnZhcy5oZWlnaHQgPSBvcHRzLmhlaWdodCAqIG9wdHMudGlsZUhlaWdodDtcbiAgICAgICAgdGhpcy5fY29sb3JDYW52YXMud2lkdGggPSBvcHRzLnRpbGVXaWR0aDtcbiAgICAgICAgdGhpcy5fY29sb3JDYW52YXMuaGVpZ2h0ID0gb3B0cy50aWxlSGVpZ2h0O1xuICAgIH1cbn1cbiIsImltcG9ydCBCYWNrZW5kIGZyb20gXCIuL2JhY2tlbmQuanNcIjtcbmltcG9ydCAqIGFzIENvbG9yIGZyb20gXCIuLi9jb2xvci5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgVGlsZSBiYWNrZW5kXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWxlR0wgZXh0ZW5kcyBCYWNrZW5kIHtcbiAgICBzdGF0aWMgaXNTdXBwb3J0ZWQoKSB7XG4gICAgICAgIHJldHVybiAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikuZ2V0Q29udGV4dChcIndlYmdsMlwiLCB7IHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZSB9KTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3VuaWZvcm1zID0ge307XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9nbCA9IHRoaXMuX2luaXRXZWJHTCgpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBhbGVydChlLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNjaGVkdWxlKGNiKSB7IHJlcXVlc3RBbmltYXRpb25GcmFtZShjYik7IH1cbiAgICBnZXRDb250YWluZXIoKSB7IHJldHVybiB0aGlzLl9nbC5jYW52YXM7IH1cbiAgICBzZXRPcHRpb25zKG9wdHMpIHtcbiAgICAgICAgc3VwZXIuc2V0T3B0aW9ucyhvcHRzKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU2l6ZSgpO1xuICAgICAgICBsZXQgdGlsZVNldCA9IHRoaXMuX29wdGlvbnMudGlsZVNldDtcbiAgICAgICAgaWYgKHRpbGVTZXQgJiYgXCJjb21wbGV0ZVwiIGluIHRpbGVTZXQgJiYgIXRpbGVTZXQuY29tcGxldGUpIHtcbiAgICAgICAgICAgIHRpbGVTZXQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gdGhpcy5fdXBkYXRlVGV4dHVyZSh0aWxlU2V0KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVUZXh0dXJlKHRpbGVTZXQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRyYXcoZGF0YSwgY2xlYXJCZWZvcmUpIHtcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLl9nbDtcbiAgICAgICAgY29uc3Qgb3B0cyA9IHRoaXMuX29wdGlvbnM7XG4gICAgICAgIGxldCBbeCwgeSwgY2gsIGZnLCBiZ10gPSBkYXRhO1xuICAgICAgICBsZXQgc2Npc3NvclkgPSBnbC5jYW52YXMuaGVpZ2h0IC0gKHkgKyAxKSAqIG9wdHMudGlsZUhlaWdodDtcbiAgICAgICAgZ2wuc2Npc3Nvcih4ICogb3B0cy50aWxlV2lkdGgsIHNjaXNzb3JZLCBvcHRzLnRpbGVXaWR0aCwgb3B0cy50aWxlSGVpZ2h0KTtcbiAgICAgICAgaWYgKGNsZWFyQmVmb3JlKSB7XG4gICAgICAgICAgICBpZiAob3B0cy50aWxlQ29sb3JpemUpIHtcbiAgICAgICAgICAgICAgICBnbC5jbGVhckNvbG9yKDAsIDAsIDAsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ2wuY2xlYXJDb2xvciguLi5wYXJzZUNvbG9yKGJnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNoYXJzID0gW10uY29uY2F0KGNoKTtcbiAgICAgICAgbGV0IGJncyA9IFtdLmNvbmNhdChiZyk7XG4gICAgICAgIGxldCBmZ3MgPSBbXS5jb25jYXQoZmcpO1xuICAgICAgICBnbC51bmlmb3JtMmZ2KHRoaXMuX3VuaWZvcm1zW1widGFyZ2V0UG9zUmVsXCJdLCBbeCwgeV0pO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXMuX29wdGlvbnMudGlsZU1hcFtjaGFyc1tpXV07XG4gICAgICAgICAgICBpZiAoIXRpbGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENoYXIgXCIke2NoYXJzW2ldfVwiIG5vdCBmb3VuZCBpbiB0aWxlTWFwYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnbC51bmlmb3JtMWYodGhpcy5fdW5pZm9ybXNbXCJjb2xvcml6ZVwiXSwgb3B0cy50aWxlQ29sb3JpemUgPyAxIDogMCk7XG4gICAgICAgICAgICBnbC51bmlmb3JtMmZ2KHRoaXMuX3VuaWZvcm1zW1widGlsZXNldFBvc0Fic1wiXSwgdGlsZSk7XG4gICAgICAgICAgICBpZiAob3B0cy50aWxlQ29sb3JpemUpIHtcbiAgICAgICAgICAgICAgICBnbC51bmlmb3JtNGZ2KHRoaXMuX3VuaWZvcm1zW1widGludFwiXSwgcGFyc2VDb2xvcihmZ3NbaV0pKTtcbiAgICAgICAgICAgICAgICBnbC51bmlmb3JtNGZ2KHRoaXMuX3VuaWZvcm1zW1wiYmdcIl0sIHBhcnNlQ29sb3IoYmdzW2ldKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGlsZUNvbG9yaXplKSB7IC8vIGFwcGx5IGNvbG9yaXphdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNhbnZhcyA9IHRoaXMuX2NvbG9yQ2FudmFzO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2Utb3ZlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmcgPSBmZ3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYmcgPSBiZ3NbaV07XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3B0aW9ucy50aWxlU2V0ISxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWxlWzBdLCB0aWxlWzFdLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmZyAhPSBcInRyYW5zcGFyZW50XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGZnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2UtYXRvcFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmcgIT0gXCJ0cmFuc3BhcmVudFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBiZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGVzdGluYXRpb24tb3ZlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdHguZHJhd0ltYWdlKGNhbnZhcywgeCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gbm8gY29sb3JpemluZywgZWFzeVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3R4LmRyYXdJbWFnZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vcHRpb25zLnRpbGVTZXQhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVbMF0sIHRpbGVbMV0sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4KnRpbGVXaWR0aCwgeSp0aWxlSGVpZ2h0LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAqL1xuICAgIH1cbiAgICBjbGVhcigpIHtcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLl9nbDtcbiAgICAgICAgZ2wuY2xlYXJDb2xvciguLi5wYXJzZUNvbG9yKHRoaXMuX29wdGlvbnMuYmcpKTtcbiAgICAgICAgZ2wuc2Npc3NvcigwLCAwLCBnbC5jYW52YXMud2lkdGgsIGdsLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgICB9XG4gICAgY29tcHV0ZVNpemUoYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fb3B0aW9ucy50aWxlV2lkdGgpO1xuICAgICAgICBsZXQgaGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX29wdGlvbnMudGlsZUhlaWdodCk7XG4gICAgICAgIHJldHVybiBbd2lkdGgsIGhlaWdodF07XG4gICAgfVxuICAgIGNvbXB1dGVGb250U2l6ZSgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSBiYWNrZW5kIGRvZXMgbm90IHVuZGVyc3RhbmQgZm9udCBzaXplXCIpO1xuICAgIH1cbiAgICBldmVudFRvUG9zaXRpb24oeCwgeSkge1xuICAgICAgICBsZXQgY2FudmFzID0gdGhpcy5fZ2wuY2FudmFzO1xuICAgICAgICBsZXQgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgeCAtPSByZWN0LmxlZnQ7XG4gICAgICAgIHkgLT0gcmVjdC50b3A7XG4gICAgICAgIHggKj0gY2FudmFzLndpZHRoIC8gcmVjdC53aWR0aDtcbiAgICAgICAgeSAqPSBjYW52YXMuaGVpZ2h0IC8gcmVjdC5oZWlnaHQ7XG4gICAgICAgIGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IGNhbnZhcy53aWR0aCB8fCB5ID49IGNhbnZhcy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBbLTEsIC0xXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbm9ybWFsaXplZEV2ZW50VG9Qb3NpdGlvbih4LCB5KTtcbiAgICB9XG4gICAgX2luaXRXZWJHTCgpIHtcbiAgICAgICAgbGV0IGdsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKS5nZXRDb250ZXh0KFwid2ViZ2wyXCIsIHsgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlIH0pO1xuICAgICAgICB3aW5kb3cuZ2wgPSBnbDtcbiAgICAgICAgbGV0IHByb2dyYW0gPSBjcmVhdGVQcm9ncmFtKGdsLCBWUywgRlMpO1xuICAgICAgICBnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICBjcmVhdGVRdWFkKGdsKTtcbiAgICAgICAgVU5JRk9STVMuZm9yRWFjaChuYW1lID0+IHRoaXMuX3VuaWZvcm1zW25hbWVdID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIG5hbWUpKTtcbiAgICAgICAgdGhpcy5fcHJvZ3JhbSA9IHByb2dyYW07XG4gICAgICAgIGdsLmVuYWJsZShnbC5CTEVORCk7XG4gICAgICAgIGdsLmJsZW5kRnVuY1NlcGFyYXRlKGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSwgZ2wuT05FLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBKTtcbiAgICAgICAgZ2wuZW5hYmxlKGdsLlNDSVNTT1JfVEVTVCk7XG4gICAgICAgIHJldHVybiBnbDtcbiAgICB9XG4gICAgX25vcm1hbGl6ZWRFdmVudFRvUG9zaXRpb24oeCwgeSkge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IoeCAvIHRoaXMuX29wdGlvbnMudGlsZVdpZHRoKSwgTWF0aC5mbG9vcih5IC8gdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0KV07XG4gICAgfVxuICAgIF91cGRhdGVTaXplKCkge1xuICAgICAgICBjb25zdCBnbCA9IHRoaXMuX2dsO1xuICAgICAgICBjb25zdCBvcHRzID0gdGhpcy5fb3B0aW9ucztcbiAgICAgICAgY29uc3QgY2FudmFzU2l6ZSA9IFtvcHRzLndpZHRoICogb3B0cy50aWxlV2lkdGgsIG9wdHMuaGVpZ2h0ICogb3B0cy50aWxlSGVpZ2h0XTtcbiAgICAgICAgZ2wuY2FudmFzLndpZHRoID0gY2FudmFzU2l6ZVswXTtcbiAgICAgICAgZ2wuY2FudmFzLmhlaWdodCA9IGNhbnZhc1NpemVbMV07XG4gICAgICAgIGdsLnZpZXdwb3J0KDAsIDAsIGNhbnZhc1NpemVbMF0sIGNhbnZhc1NpemVbMV0pO1xuICAgICAgICBnbC51bmlmb3JtMmZ2KHRoaXMuX3VuaWZvcm1zW1widGlsZVNpemVcIl0sIFtvcHRzLnRpbGVXaWR0aCwgb3B0cy50aWxlSGVpZ2h0XSk7XG4gICAgICAgIGdsLnVuaWZvcm0yZnYodGhpcy5fdW5pZm9ybXNbXCJ0YXJnZXRTaXplXCJdLCBjYW52YXNTaXplKTtcbiAgICB9XG4gICAgX3VwZGF0ZVRleHR1cmUodGlsZVNldCkge1xuICAgICAgICBjcmVhdGVUZXh0dXJlKHRoaXMuX2dsLCB0aWxlU2V0KTtcbiAgICB9XG59XG5jb25zdCBVTklGT1JNUyA9IFtcInRhcmdldFBvc1JlbFwiLCBcInRpbGVzZXRQb3NBYnNcIiwgXCJ0aWxlU2l6ZVwiLCBcInRhcmdldFNpemVcIiwgXCJjb2xvcml6ZVwiLCBcImJnXCIsIFwidGludFwiXTtcbmNvbnN0IFZTID0gYFxuI3ZlcnNpb24gMzAwIGVzXG5cbmluIHZlYzIgdGlsZVBvc1JlbDtcbm91dCB2ZWMyIHRpbGVzZXRQb3NQeDtcblxudW5pZm9ybSB2ZWMyIHRpbGVzZXRQb3NBYnM7XG51bmlmb3JtIHZlYzIgdGlsZVNpemU7XG51bmlmb3JtIHZlYzIgdGFyZ2V0U2l6ZTtcbnVuaWZvcm0gdmVjMiB0YXJnZXRQb3NSZWw7XG5cbnZvaWQgbWFpbigpIHtcblx0dmVjMiB0YXJnZXRQb3NQeCA9ICh0YXJnZXRQb3NSZWwgKyB0aWxlUG9zUmVsKSAqIHRpbGVTaXplO1xuXHR2ZWMyIHRhcmdldFBvc05kYyA9ICgodGFyZ2V0UG9zUHggLyB0YXJnZXRTaXplKS0wLjUpKjIuMDtcblx0dGFyZ2V0UG9zTmRjLnkgKj0gLTEuMDtcblxuXHRnbF9Qb3NpdGlvbiA9IHZlYzQodGFyZ2V0UG9zTmRjLCAwLjAsIDEuMCk7XG5cdHRpbGVzZXRQb3NQeCA9IHRpbGVzZXRQb3NBYnMgKyB0aWxlUG9zUmVsICogdGlsZVNpemU7XG59YC50cmltKCk7XG5jb25zdCBGUyA9IGBcbiN2ZXJzaW9uIDMwMCBlc1xucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xuXG5pbiB2ZWMyIHRpbGVzZXRQb3NQeDtcbm91dCB2ZWM0IGZyYWdDb2xvcjtcbnVuaWZvcm0gc2FtcGxlcjJEIGltYWdlO1xudW5pZm9ybSBib29sIGNvbG9yaXplO1xudW5pZm9ybSB2ZWM0IGJnO1xudW5pZm9ybSB2ZWM0IHRpbnQ7XG5cbnZvaWQgbWFpbigpIHtcblx0ZnJhZ0NvbG9yID0gdmVjNCgwLCAwLCAwLCAxKTtcblxuXHR2ZWM0IHRleGVsID0gdGV4ZWxGZXRjaChpbWFnZSwgaXZlYzIodGlsZXNldFBvc1B4KSwgMCk7XG5cblx0aWYgKGNvbG9yaXplKSB7XG5cdFx0dGV4ZWwucmdiID0gdGludC5hICogdGludC5yZ2IgKyAoMS4wLXRpbnQuYSkgKiB0ZXhlbC5yZ2I7XG5cdFx0ZnJhZ0NvbG9yLnJnYiA9IHRleGVsLmEqdGV4ZWwucmdiICsgKDEuMC10ZXhlbC5hKSpiZy5yZ2I7XG5cdFx0ZnJhZ0NvbG9yLmEgPSB0ZXhlbC5hICsgKDEuMC10ZXhlbC5hKSpiZy5hO1xuXHR9IGVsc2Uge1xuXHRcdGZyYWdDb2xvciA9IHRleGVsO1xuXHR9XG59YC50cmltKCk7XG5mdW5jdGlvbiBjcmVhdGVQcm9ncmFtKGdsLCB2c3MsIGZzcykge1xuICAgIGNvbnN0IHZzID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xuICAgIGdsLnNoYWRlclNvdXJjZSh2cywgdnNzKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKHZzKTtcbiAgICBpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcih2cywgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihnbC5nZXRTaGFkZXJJbmZvTG9nKHZzKSB8fCBcIlwiKTtcbiAgICB9XG4gICAgY29uc3QgZnMgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcbiAgICBnbC5zaGFkZXJTb3VyY2UoZnMsIGZzcyk7XG4gICAgZ2wuY29tcGlsZVNoYWRlcihmcyk7XG4gICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoZnMsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2wuZ2V0U2hhZGVySW5mb0xvZyhmcykgfHwgXCJcIik7XG4gICAgfVxuICAgIGNvbnN0IHAgPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHAsIHZzKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocCwgZnMpO1xuICAgIGdsLmxpbmtQcm9ncmFtKHApO1xuICAgIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwLCBnbC5MSU5LX1NUQVRVUykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsLmdldFByb2dyYW1JbmZvTG9nKHApIHx8IFwiXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVF1YWQoZ2wpIHtcbiAgICBjb25zdCBwb3MgPSBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAxLCAwLCAwLCAxLCAxLCAxXSk7XG4gICAgY29uc3QgYnVmID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1Zik7XG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIHBvcywgZ2wuU1RBVElDX0RSQVcpO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KDApO1xuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoMCwgMiwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVRleHR1cmUoZ2wsIGRhdGEpIHtcbiAgICBsZXQgdCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0KTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTkVBUkVTVCk7XG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLk5FQVJFU1QpO1xuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLlJFUEVBVCk7XG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuUkVQRUFUKTtcbiAgICBnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCAwKTtcbiAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGRhdGEpO1xuICAgIHJldHVybiB0O1xufVxubGV0IGNvbG9yQ2FjaGUgPSB7fTtcbmZ1bmN0aW9uIHBhcnNlQ29sb3IoY29sb3IpIHtcbiAgICBpZiAoIShjb2xvciBpbiBjb2xvckNhY2hlKSkge1xuICAgICAgICBsZXQgcGFyc2VkO1xuICAgICAgICBpZiAoY29sb3IgPT0gXCJ0cmFuc3BhcmVudFwiKSB7XG4gICAgICAgICAgICBwYXJzZWQgPSBbMCwgMCwgMCwgMF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29sb3IuaW5kZXhPZihcInJnYmFcIikgPiAtMSkge1xuICAgICAgICAgICAgcGFyc2VkID0gKGNvbG9yLm1hdGNoKC9bXFxkLl0rL2cpIHx8IFtdKS5tYXAoTnVtYmVyKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VkW2ldID0gcGFyc2VkW2ldIC8gMjU1O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VkID0gQ29sb3IuZnJvbVN0cmluZyhjb2xvcikubWFwKCQgPT4gJCAvIDI1NSk7XG4gICAgICAgICAgICBwYXJzZWQucHVzaCgxKTtcbiAgICAgICAgfVxuICAgICAgICBjb2xvckNhY2hlW2NvbG9yXSA9IHBhcnNlZDtcbiAgICB9XG4gICAgcmV0dXJuIGNvbG9yQ2FjaGVbY29sb3JdO1xufVxuIiwiLyoqXG4gKiBAbmFtZXNwYWNlXG4gKiBDb250YWlucyB0ZXh0IHRva2VuaXphdGlvbiBhbmQgYnJlYWtpbmcgcm91dGluZXNcbiAqL1xuY29uc3QgUkVfQ09MT1JTID0gLyUoW2JjXSl7KFtefV0qKX0vZztcbi8vIHRva2VuIHR5cGVzXG5leHBvcnQgY29uc3QgVFlQRV9URVhUID0gMDtcbmV4cG9ydCBjb25zdCBUWVBFX05FV0xJTkUgPSAxO1xuZXhwb3J0IGNvbnN0IFRZUEVfRkcgPSAyO1xuZXhwb3J0IGNvbnN0IFRZUEVfQkcgPSAzO1xuLyoqXG4gKiBNZWFzdXJlIHNpemUgb2YgYSByZXN1bHRpbmcgdGV4dCBibG9ja1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWVhc3VyZShzdHIsIG1heFdpZHRoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHsgd2lkdGg6IDAsIGhlaWdodDogMSB9O1xuICAgIGxldCB0b2tlbnMgPSB0b2tlbml6ZShzdHIsIG1heFdpZHRoKTtcbiAgICBsZXQgbGluZVdpZHRoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICAgICAgY2FzZSBUWVBFX1RFWFQ6XG4gICAgICAgICAgICAgICAgbGluZVdpZHRoICs9IHRva2VuLnZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgVFlQRV9ORVdMSU5FOlxuICAgICAgICAgICAgICAgIHJlc3VsdC5oZWlnaHQrKztcbiAgICAgICAgICAgICAgICByZXN1bHQud2lkdGggPSBNYXRoLm1heChyZXN1bHQud2lkdGgsIGxpbmVXaWR0aCk7XG4gICAgICAgICAgICAgICAgbGluZVdpZHRoID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQud2lkdGggPSBNYXRoLm1heChyZXN1bHQud2lkdGgsIGxpbmVXaWR0aCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogQ29udmVydCBzdHJpbmcgdG8gYSBzZXJpZXMgb2YgYSBmb3JtYXR0aW5nIGNvbW1hbmRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b2tlbml6ZShzdHIsIG1heFdpZHRoKSB7XG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIC8qIGZpcnN0IHRva2VuaXphdGlvbiBwYXNzIC0gc3BsaXQgdGV4dHMgYW5kIGNvbG9yIGZvcm1hdHRpbmcgY29tbWFuZHMgKi9cbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICBzdHIucmVwbGFjZShSRV9DT0xPUlMsIGZ1bmN0aW9uIChtYXRjaCwgdHlwZSwgbmFtZSwgaW5kZXgpIHtcbiAgICAgICAgLyogc3RyaW5nIGJlZm9yZSAqL1xuICAgICAgICBsZXQgcGFydCA9IHN0ci5zdWJzdHJpbmcob2Zmc2V0LCBpbmRleCk7XG4gICAgICAgIGlmIChwYXJ0Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IFRZUEVfVEVYVCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcGFydFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLyogY29sb3IgY29tbWFuZCAqL1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAodHlwZSA9PSBcImNcIiA/IFRZUEVfRkcgOiBUWVBFX0JHKSxcbiAgICAgICAgICAgIHZhbHVlOiBuYW1lLnRyaW0oKVxuICAgICAgICB9KTtcbiAgICAgICAgb2Zmc2V0ID0gaW5kZXggKyBtYXRjaC5sZW5ndGg7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH0pO1xuICAgIC8qIGxhc3QgcmVtYWluaW5nIHBhcnQgKi9cbiAgICBsZXQgcGFydCA9IHN0ci5zdWJzdHJpbmcob2Zmc2V0KTtcbiAgICBpZiAocGFydC5sZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgdHlwZTogVFlQRV9URVhULFxuICAgICAgICAgICAgdmFsdWU6IHBhcnRcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBicmVha0xpbmVzKHJlc3VsdCwgbWF4V2lkdGgpO1xufVxuLyogaW5zZXJ0IGxpbmUgYnJlYWtzIGludG8gZmlyc3QtcGFzcyB0b2tlbml6ZWQgZGF0YSAqL1xuZnVuY3Rpb24gYnJlYWtMaW5lcyh0b2tlbnMsIG1heFdpZHRoKSB7XG4gICAgaWYgKCFtYXhXaWR0aCkge1xuICAgICAgICBtYXhXaWR0aCA9IEluZmluaXR5O1xuICAgIH1cbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IGxpbmVMZW5ndGggPSAwO1xuICAgIGxldCBsYXN0VG9rZW5XaXRoU3BhY2UgPSAtMTtcbiAgICB3aGlsZSAoaSA8IHRva2Vucy5sZW5ndGgpIHsgLyogdGFrZSBhbGwgdGV4dCB0b2tlbnMsIHJlbW92ZSBzcGFjZSwgYXBwbHkgbGluZWJyZWFrcyAqL1xuICAgICAgICBsZXQgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgIGlmICh0b2tlbi50eXBlID09IFRZUEVfTkVXTElORSkgeyAvKiByZXNldCAqL1xuICAgICAgICAgICAgbGluZUxlbmd0aCA9IDA7XG4gICAgICAgICAgICBsYXN0VG9rZW5XaXRoU3BhY2UgPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4udHlwZSAhPSBUWVBFX1RFWFQpIHsgLyogc2tpcCBub24tdGV4dCB0b2tlbnMgKi9cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8qIHJlbW92ZSBzcGFjZXMgYXQgdGhlIGJlZ2lubmluZyBvZiBsaW5lICovXG4gICAgICAgIHdoaWxlIChsaW5lTGVuZ3RoID09IDAgJiYgdG9rZW4udmFsdWUuY2hhckF0KDApID09IFwiIFwiKSB7XG4gICAgICAgICAgICB0b2tlbi52YWx1ZSA9IHRva2VuLnZhbHVlLnN1YnN0cmluZygxKTtcbiAgICAgICAgfVxuICAgICAgICAvKiBmb3JjZWQgbmV3bGluZT8gaW5zZXJ0IHR3byBuZXcgdG9rZW5zIGFmdGVyIHRoaXMgb25lICovXG4gICAgICAgIGxldCBpbmRleCA9IHRva2VuLnZhbHVlLmluZGV4T2YoXCJcXG5cIik7XG4gICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgdG9rZW4udmFsdWUgPSBicmVha0luc2lkZVRva2VuKHRva2VucywgaSwgaW5kZXgsIHRydWUpO1xuICAgICAgICAgICAgLyogaWYgdGhlcmUgYXJlIHNwYWNlcyBhdCB0aGUgZW5kLCB3ZSBtdXN0IHJlbW92ZSB0aGVtICh3ZSBkbyBub3Qgd2FudCB0aGUgbGluZSB0b28gbG9uZykgKi9cbiAgICAgICAgICAgIGxldCBhcnIgPSB0b2tlbi52YWx1ZS5zcGxpdChcIlwiKTtcbiAgICAgICAgICAgIHdoaWxlIChhcnIubGVuZ3RoICYmIGFyclthcnIubGVuZ3RoIC0gMV0gPT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICBhcnIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2tlbi52YWx1ZSA9IGFyci5qb2luKFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8qIHRva2VuIGRlZ2VuZXJhdGVkPyAqL1xuICAgICAgICBpZiAoIXRva2VuLnZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgdG9rZW5zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaW5lTGVuZ3RoICsgdG9rZW4udmFsdWUubGVuZ3RoID4gbWF4V2lkdGgpIHsgLyogbGluZSB0b28gbG9uZywgZmluZCBhIHN1aXRhYmxlIGJyZWFraW5nIHNwb3QgKi9cbiAgICAgICAgICAgIC8qIGlzIGl0IHBvc3NpYmxlIHRvIGJyZWFrIHdpdGhpbiB0aGlzIHRva2VuPyAqL1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XG4gICAgICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSB0b2tlbi52YWx1ZS5pbmRleE9mKFwiIFwiLCBpbmRleCArIDEpO1xuICAgICAgICAgICAgICAgIGlmIChuZXh0SW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChsaW5lTGVuZ3RoICsgbmV4dEluZGV4ID4gbWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluZGV4ID0gbmV4dEluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4ICE9IC0xKSB7IC8qIGJyZWFrIGF0IHNwYWNlIHdpdGhpbiB0aGlzIG9uZSAqL1xuICAgICAgICAgICAgICAgIHRva2VuLnZhbHVlID0gYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGksIGluZGV4LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxhc3RUb2tlbldpdGhTcGFjZSAhPSAtMSkgeyAvKiBpcyB0aGVyZSBhIHByZXZpb3VzIHRva2VuIHdoZXJlIGEgYnJlYWsgY2FuIG9jY3VyPyAqL1xuICAgICAgICAgICAgICAgIGxldCB0b2tlbiA9IHRva2Vuc1tsYXN0VG9rZW5XaXRoU3BhY2VdO1xuICAgICAgICAgICAgICAgIGxldCBicmVha0luZGV4ID0gdG9rZW4udmFsdWUubGFzdEluZGV4T2YoXCIgXCIpO1xuICAgICAgICAgICAgICAgIHRva2VuLnZhbHVlID0gYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGxhc3RUb2tlbldpdGhTcGFjZSwgYnJlYWtJbmRleCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaSA9IGxhc3RUb2tlbldpdGhTcGFjZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyAvKiBmb3JjZSBicmVhayBpbiB0aGlzIHRva2VuICovXG4gICAgICAgICAgICAgICAgdG9rZW4udmFsdWUgPSBicmVha0luc2lkZVRva2VuKHRva2VucywgaSwgbWF4V2lkdGggLSBsaW5lTGVuZ3RoLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8qIGxpbmUgbm90IGxvbmcsIGNvbnRpbnVlICovXG4gICAgICAgICAgICBsaW5lTGVuZ3RoICs9IHRva2VuLnZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZS5pbmRleE9mKFwiIFwiKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgIGxhc3RUb2tlbldpdGhTcGFjZSA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaSsrOyAvKiBhZHZhbmNlIHRvIG5leHQgdG9rZW4gKi9cbiAgICB9XG4gICAgdG9rZW5zLnB1c2goeyB0eXBlOiBUWVBFX05FV0xJTkUgfSk7IC8qIGluc2VydCBmYWtlIG5ld2xpbmUgdG8gZml4IHRoZSBsYXN0IHRleHQgbGluZSAqL1xuICAgIC8qIHJlbW92ZSB0cmFpbGluZyBzcGFjZSBmcm9tIHRleHQgdG9rZW5zIGJlZm9yZSBuZXdsaW5lcyAqL1xuICAgIGxldCBsYXN0VGV4dFRva2VuID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICAgICAgY2FzZSBUWVBFX1RFWFQ6XG4gICAgICAgICAgICAgICAgbGFzdFRleHRUb2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBUWVBFX05FV0xJTkU6XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RUZXh0VG9rZW4pIHsgLyogcmVtb3ZlIHRyYWlsaW5nIHNwYWNlICovXG4gICAgICAgICAgICAgICAgICAgIGxldCBhcnIgPSBsYXN0VGV4dFRva2VuLnZhbHVlLnNwbGl0KFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoYXJyLmxlbmd0aCAmJiBhcnJbYXJyLmxlbmd0aCAtIDFdID09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnIucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFzdFRleHRUb2tlbi52YWx1ZSA9IGFyci5qb2luKFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXN0VGV4dFRva2VuID0gbnVsbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2tlbnMucG9wKCk7IC8qIHJlbW92ZSBmYWtlIHRva2VuICovXG4gICAgcmV0dXJuIHRva2Vucztcbn1cbi8qKlxuICogQ3JlYXRlIG5ldyB0b2tlbnMgYW5kIGluc2VydCB0aGVtIGludG8gdGhlIHN0cmVhbVxuICogQHBhcmFtIHtvYmplY3RbXX0gdG9rZW5zXG4gKiBAcGFyYW0ge2ludH0gdG9rZW5JbmRleCBUb2tlbiBiZWluZyBwcm9jZXNzZWRcbiAqIEBwYXJhbSB7aW50fSBicmVha0luZGV4IEluZGV4IHdpdGhpbiBjdXJyZW50IHRva2VuJ3MgdmFsdWVcbiAqIEBwYXJhbSB7Ym9vbH0gcmVtb3ZlQnJlYWtDaGFyIERvIHdlIHdhbnQgdG8gcmVtb3ZlIHRoZSBicmVha2luZyBjaGFyYWN0ZXI/XG4gKiBAcmV0dXJucyB7c3RyaW5nfSByZW1haW5pbmcgdW5icm9rZW4gdG9rZW4gdmFsdWVcbiAqL1xuZnVuY3Rpb24gYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIHRva2VuSW5kZXgsIGJyZWFrSW5kZXgsIHJlbW92ZUJyZWFrQ2hhcikge1xuICAgIGxldCBuZXdCcmVha1Rva2VuID0ge1xuICAgICAgICB0eXBlOiBUWVBFX05FV0xJTkVcbiAgICB9O1xuICAgIGxldCBuZXdUZXh0VG9rZW4gPSB7XG4gICAgICAgIHR5cGU6IFRZUEVfVEVYVCxcbiAgICAgICAgdmFsdWU6IHRva2Vuc1t0b2tlbkluZGV4XS52YWx1ZS5zdWJzdHJpbmcoYnJlYWtJbmRleCArIChyZW1vdmVCcmVha0NoYXIgPyAxIDogMCkpXG4gICAgfTtcbiAgICB0b2tlbnMuc3BsaWNlKHRva2VuSW5kZXggKyAxLCAwLCBuZXdCcmVha1Rva2VuLCBuZXdUZXh0VG9rZW4pO1xuICAgIHJldHVybiB0b2tlbnNbdG9rZW5JbmRleF0udmFsdWUuc3Vic3RyaW5nKDAsIGJyZWFrSW5kZXgpO1xufVxuIiwiLyoqIERlZmF1bHQgd2l0aCBmb3IgZGlzcGxheSBhbmQgbWFwIGdlbmVyYXRvcnMgKi9cbmV4cG9ydCBsZXQgREVGQVVMVF9XSURUSCA9IDgwO1xuLyoqIERlZmF1bHQgaGVpZ2h0IGZvciBkaXNwbGF5IGFuZCBtYXAgZ2VuZXJhdG9ycyAqL1xuZXhwb3J0IGxldCBERUZBVUxUX0hFSUdIVCA9IDI1O1xuZXhwb3J0IGNvbnN0IERJUlMgPSB7XG4gICAgNDogW1swLCAtMV0sIFsxLCAwXSwgWzAsIDFdLCBbLTEsIDBdXSxcbiAgICA4OiBbWzAsIC0xXSwgWzEsIC0xXSwgWzEsIDBdLCBbMSwgMV0sIFswLCAxXSwgWy0xLCAxXSwgWy0xLCAwXSwgWy0xLCAtMV1dLFxuICAgIDY6IFtbLTEsIC0xXSwgWzEsIC0xXSwgWzIsIDBdLCBbMSwgMV0sIFstMSwgMV0sIFstMiwgMF1dXG59O1xuZXhwb3J0IGNvbnN0IEtFWVMgPSB7XG4gICAgLyoqIENhbmNlbCBrZXkuICovXG4gICAgVktfQ0FOQ0VMOiAzLFxuICAgIC8qKiBIZWxwIGtleS4gKi9cbiAgICBWS19IRUxQOiA2LFxuICAgIC8qKiBCYWNrc3BhY2Uga2V5LiAqL1xuICAgIFZLX0JBQ0tfU1BBQ0U6IDgsXG4gICAgLyoqIFRhYiBrZXkuICovXG4gICAgVktfVEFCOiA5LFxuICAgIC8qKiA1IGtleSBvbiBOdW1wYWQgd2hlbiBOdW1Mb2NrIGlzIHVubG9ja2VkLiBPciBvbiBNYWMsIGNsZWFyIGtleSB3aGljaCBpcyBwb3NpdGlvbmVkIGF0IE51bUxvY2sga2V5LiAqL1xuICAgIFZLX0NMRUFSOiAxMixcbiAgICAvKiogUmV0dXJuL2VudGVyIGtleSBvbiB0aGUgbWFpbiBrZXlib2FyZC4gKi9cbiAgICBWS19SRVRVUk46IDEzLFxuICAgIC8qKiBSZXNlcnZlZCwgYnV0IG5vdCB1c2VkLiAqL1xuICAgIFZLX0VOVEVSOiAxNCxcbiAgICAvKiogU2hpZnQga2V5LiAqL1xuICAgIFZLX1NISUZUOiAxNixcbiAgICAvKiogQ29udHJvbCBrZXkuICovXG4gICAgVktfQ09OVFJPTDogMTcsXG4gICAgLyoqIEFsdCAoT3B0aW9uIG9uIE1hYykga2V5LiAqL1xuICAgIFZLX0FMVDogMTgsXG4gICAgLyoqIFBhdXNlIGtleS4gKi9cbiAgICBWS19QQVVTRTogMTksXG4gICAgLyoqIENhcHMgbG9jay4gKi9cbiAgICBWS19DQVBTX0xPQ0s6IDIwLFxuICAgIC8qKiBFc2NhcGUga2V5LiAqL1xuICAgIFZLX0VTQ0FQRTogMjcsXG4gICAgLyoqIFNwYWNlIGJhci4gKi9cbiAgICBWS19TUEFDRTogMzIsXG4gICAgLyoqIFBhZ2UgVXAga2V5LiAqL1xuICAgIFZLX1BBR0VfVVA6IDMzLFxuICAgIC8qKiBQYWdlIERvd24ga2V5LiAqL1xuICAgIFZLX1BBR0VfRE9XTjogMzQsXG4gICAgLyoqIEVuZCBrZXkuICovXG4gICAgVktfRU5EOiAzNSxcbiAgICAvKiogSG9tZSBrZXkuICovXG4gICAgVktfSE9NRTogMzYsXG4gICAgLyoqIExlZnQgYXJyb3cuICovXG4gICAgVktfTEVGVDogMzcsXG4gICAgLyoqIFVwIGFycm93LiAqL1xuICAgIFZLX1VQOiAzOCxcbiAgICAvKiogUmlnaHQgYXJyb3cuICovXG4gICAgVktfUklHSFQ6IDM5LFxuICAgIC8qKiBEb3duIGFycm93LiAqL1xuICAgIFZLX0RPV046IDQwLFxuICAgIC8qKiBQcmludCBTY3JlZW4ga2V5LiAqL1xuICAgIFZLX1BSSU5UU0NSRUVOOiA0NCxcbiAgICAvKiogSW5zKGVydCkga2V5LiAqL1xuICAgIFZLX0lOU0VSVDogNDUsXG4gICAgLyoqIERlbChldGUpIGtleS4gKi9cbiAgICBWS19ERUxFVEU6IDQ2LFxuICAgIC8qKiovXG4gICAgVktfMDogNDgsXG4gICAgLyoqKi9cbiAgICBWS18xOiA0OSxcbiAgICAvKioqL1xuICAgIFZLXzI6IDUwLFxuICAgIC8qKiovXG4gICAgVktfMzogNTEsXG4gICAgLyoqKi9cbiAgICBWS180OiA1MixcbiAgICAvKioqL1xuICAgIFZLXzU6IDUzLFxuICAgIC8qKiovXG4gICAgVktfNjogNTQsXG4gICAgLyoqKi9cbiAgICBWS183OiA1NSxcbiAgICAvKioqL1xuICAgIFZLXzg6IDU2LFxuICAgIC8qKiovXG4gICAgVktfOTogNTcsXG4gICAgLyoqIENvbG9uICg6KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19DT0xPTjogNTgsXG4gICAgLyoqIFNlbWljb2xvbiAoOykga2V5LiAqL1xuICAgIFZLX1NFTUlDT0xPTjogNTksXG4gICAgLyoqIExlc3MtdGhhbiAoPCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfTEVTU19USEFOOiA2MCxcbiAgICAvKiogRXF1YWxzICg9KSBrZXkuICovXG4gICAgVktfRVFVQUxTOiA2MSxcbiAgICAvKiogR3JlYXRlci10aGFuICg+KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19HUkVBVEVSX1RIQU46IDYyLFxuICAgIC8qKiBRdWVzdGlvbiBtYXJrICg/KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19RVUVTVElPTl9NQVJLOiA2MyxcbiAgICAvKiogQXRtYXJrIChAKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19BVDogNjQsXG4gICAgLyoqKi9cbiAgICBWS19BOiA2NSxcbiAgICAvKioqL1xuICAgIFZLX0I6IDY2LFxuICAgIC8qKiovXG4gICAgVktfQzogNjcsXG4gICAgLyoqKi9cbiAgICBWS19EOiA2OCxcbiAgICAvKioqL1xuICAgIFZLX0U6IDY5LFxuICAgIC8qKiovXG4gICAgVktfRjogNzAsXG4gICAgLyoqKi9cbiAgICBWS19HOiA3MSxcbiAgICAvKioqL1xuICAgIFZLX0g6IDcyLFxuICAgIC8qKiovXG4gICAgVktfSTogNzMsXG4gICAgLyoqKi9cbiAgICBWS19KOiA3NCxcbiAgICAvKioqL1xuICAgIFZLX0s6IDc1LFxuICAgIC8qKiovXG4gICAgVktfTDogNzYsXG4gICAgLyoqKi9cbiAgICBWS19NOiA3NyxcbiAgICAvKioqL1xuICAgIFZLX046IDc4LFxuICAgIC8qKiovXG4gICAgVktfTzogNzksXG4gICAgLyoqKi9cbiAgICBWS19QOiA4MCxcbiAgICAvKioqL1xuICAgIFZLX1E6IDgxLFxuICAgIC8qKiovXG4gICAgVktfUjogODIsXG4gICAgLyoqKi9cbiAgICBWS19TOiA4MyxcbiAgICAvKioqL1xuICAgIFZLX1Q6IDg0LFxuICAgIC8qKiovXG4gICAgVktfVTogODUsXG4gICAgLyoqKi9cbiAgICBWS19WOiA4NixcbiAgICAvKioqL1xuICAgIFZLX1c6IDg3LFxuICAgIC8qKiovXG4gICAgVktfWDogODgsXG4gICAgLyoqKi9cbiAgICBWS19ZOiA4OSxcbiAgICAvKioqL1xuICAgIFZLX1o6IDkwLFxuICAgIC8qKiovXG4gICAgVktfQ09OVEVYVF9NRU5VOiA5MyxcbiAgICAvKiogMCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfTlVNUEFEMDogOTYsXG4gICAgLyoqIDEgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuICAgIFZLX05VTVBBRDE6IDk3LFxuICAgIC8qKiAyIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cbiAgICBWS19OVU1QQUQyOiA5OCxcbiAgICAvKiogMyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfTlVNUEFEMzogOTksXG4gICAgLyoqIDQgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuICAgIFZLX05VTVBBRDQ6IDEwMCxcbiAgICAvKiogNSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfTlVNUEFENTogMTAxLFxuICAgIC8qKiA2IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cbiAgICBWS19OVU1QQUQ2OiAxMDIsXG4gICAgLyoqIDcgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuICAgIFZLX05VTVBBRDc6IDEwMyxcbiAgICAvKiogOCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfTlVNUEFEODogMTA0LFxuICAgIC8qKiA5IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cbiAgICBWS19OVU1QQUQ5OiAxMDUsXG4gICAgLyoqICogb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuICAgIFZLX01VTFRJUExZOiAxMDYsXG4gICAgLyoqICsgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuICAgIFZLX0FERDogMTA3LFxuICAgIC8qKiovXG4gICAgVktfU0VQQVJBVE9SOiAxMDgsXG4gICAgLyoqIC0gb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuICAgIFZLX1NVQlRSQUNUOiAxMDksXG4gICAgLyoqIERlY2ltYWwgcG9pbnQgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuICAgIFZLX0RFQ0lNQUw6IDExMCxcbiAgICAvKiogLyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfRElWSURFOiAxMTEsXG4gICAgLyoqIEYxIGtleS4gKi9cbiAgICBWS19GMTogMTEyLFxuICAgIC8qKiBGMiBrZXkuICovXG4gICAgVktfRjI6IDExMyxcbiAgICAvKiogRjMga2V5LiAqL1xuICAgIFZLX0YzOiAxMTQsXG4gICAgLyoqIEY0IGtleS4gKi9cbiAgICBWS19GNDogMTE1LFxuICAgIC8qKiBGNSBrZXkuICovXG4gICAgVktfRjU6IDExNixcbiAgICAvKiogRjYga2V5LiAqL1xuICAgIFZLX0Y2OiAxMTcsXG4gICAgLyoqIEY3IGtleS4gKi9cbiAgICBWS19GNzogMTE4LFxuICAgIC8qKiBGOCBrZXkuICovXG4gICAgVktfRjg6IDExOSxcbiAgICAvKiogRjkga2V5LiAqL1xuICAgIFZLX0Y5OiAxMjAsXG4gICAgLyoqIEYxMCBrZXkuICovXG4gICAgVktfRjEwOiAxMjEsXG4gICAgLyoqIEYxMSBrZXkuICovXG4gICAgVktfRjExOiAxMjIsXG4gICAgLyoqIEYxMiBrZXkuICovXG4gICAgVktfRjEyOiAxMjMsXG4gICAgLyoqIEYxMyBrZXkuICovXG4gICAgVktfRjEzOiAxMjQsXG4gICAgLyoqIEYxNCBrZXkuICovXG4gICAgVktfRjE0OiAxMjUsXG4gICAgLyoqIEYxNSBrZXkuICovXG4gICAgVktfRjE1OiAxMjYsXG4gICAgLyoqIEYxNiBrZXkuICovXG4gICAgVktfRjE2OiAxMjcsXG4gICAgLyoqIEYxNyBrZXkuICovXG4gICAgVktfRjE3OiAxMjgsXG4gICAgLyoqIEYxOCBrZXkuICovXG4gICAgVktfRjE4OiAxMjksXG4gICAgLyoqIEYxOSBrZXkuICovXG4gICAgVktfRjE5OiAxMzAsXG4gICAgLyoqIEYyMCBrZXkuICovXG4gICAgVktfRjIwOiAxMzEsXG4gICAgLyoqIEYyMSBrZXkuICovXG4gICAgVktfRjIxOiAxMzIsXG4gICAgLyoqIEYyMiBrZXkuICovXG4gICAgVktfRjIyOiAxMzMsXG4gICAgLyoqIEYyMyBrZXkuICovXG4gICAgVktfRjIzOiAxMzQsXG4gICAgLyoqIEYyNCBrZXkuICovXG4gICAgVktfRjI0OiAxMzUsXG4gICAgLyoqIE51bSBMb2NrIGtleS4gKi9cbiAgICBWS19OVU1fTE9DSzogMTQ0LFxuICAgIC8qKiBTY3JvbGwgTG9jayBrZXkuICovXG4gICAgVktfU0NST0xMX0xPQ0s6IDE0NSxcbiAgICAvKiogQ2lyY3VtZmxleCAoXikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfQ0lSQ1VNRkxFWDogMTYwLFxuICAgIC8qKiBFeGNsYW1hdGlvbiAoISkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfRVhDTEFNQVRJT046IDE2MSxcbiAgICAvKiogRG91YmxlIHF1b3RlICgpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0RPVUJMRV9RVU9URTogMTYyLFxuICAgIC8qKiBIYXNoICgjKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19IQVNIOiAxNjMsXG4gICAgLyoqIERvbGxhciBzaWduICgkKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19ET0xMQVI6IDE2NCxcbiAgICAvKiogUGVyY2VudCAoJSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfUEVSQ0VOVDogMTY1LFxuICAgIC8qKiBBbXBlcnNhbmQgKCYpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0FNUEVSU0FORDogMTY2LFxuICAgIC8qKiBVbmRlcnNjb3JlIChfKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19VTkRFUlNDT1JFOiAxNjcsXG4gICAgLyoqIE9wZW4gcGFyZW50aGVzaXMgKCgpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX09QRU5fUEFSRU46IDE2OCxcbiAgICAvKiogQ2xvc2UgcGFyZW50aGVzaXMgKCkpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0NMT1NFX1BBUkVOOiAxNjksXG4gICAgLyogQXN0ZXJpc2sgKCopIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0FTVEVSSVNLOiAxNzAsXG4gICAgLyoqIFBsdXMgKCspIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX1BMVVM6IDE3MSxcbiAgICAvKiogUGlwZSAofCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfUElQRTogMTcyLFxuICAgIC8qKiBIeXBoZW4tVVMvZG9jcy9NaW51cyAoLSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfSFlQSEVOX01JTlVTOiAxNzMsXG4gICAgLyoqIE9wZW4gY3VybHkgYnJhY2tldCAoeykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfT1BFTl9DVVJMWV9CUkFDS0VUOiAxNzQsXG4gICAgLyoqIENsb3NlIGN1cmx5IGJyYWNrZXQgKH0pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0NMT1NFX0NVUkxZX0JSQUNLRVQ6IDE3NSxcbiAgICAvKiogVGlsZGUgKH4pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX1RJTERFOiAxNzYsXG4gICAgLyoqIENvbW1hICgsKSBrZXkuICovXG4gICAgVktfQ09NTUE6IDE4OCxcbiAgICAvKiogUGVyaW9kICguKSBrZXkuICovXG4gICAgVktfUEVSSU9EOiAxOTAsXG4gICAgLyoqIFNsYXNoICgvKSBrZXkuICovXG4gICAgVktfU0xBU0g6IDE5MSxcbiAgICAvKiogQmFjayB0aWNrIChgKSBrZXkuICovXG4gICAgVktfQkFDS19RVU9URTogMTkyLFxuICAgIC8qKiBPcGVuIHNxdWFyZSBicmFja2V0IChbKSBrZXkuICovXG4gICAgVktfT1BFTl9CUkFDS0VUOiAyMTksXG4gICAgLyoqIEJhY2sgc2xhc2ggKFxcKSBrZXkuICovXG4gICAgVktfQkFDS19TTEFTSDogMjIwLFxuICAgIC8qKiBDbG9zZSBzcXVhcmUgYnJhY2tldCAoXSkga2V5LiAqL1xuICAgIFZLX0NMT1NFX0JSQUNLRVQ6IDIyMSxcbiAgICAvKiogUXVvdGUgKCcnJykga2V5LiAqL1xuICAgIFZLX1FVT1RFOiAyMjIsXG4gICAgLyoqIE1ldGEga2V5IG9uIExpbnV4LCBDb21tYW5kIGtleSBvbiBNYWMuICovXG4gICAgVktfTUVUQTogMjI0LFxuICAgIC8qKiBBbHRHciBrZXkgb24gTGludXguIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19BTFRHUjogMjI1LFxuICAgIC8qKiBXaW5kb3dzIGxvZ28ga2V5IG9uIFdpbmRvd3MuIE9yIFN1cGVyIG9yIEh5cGVyIGtleSBvbiBMaW51eC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX1dJTjogOTEsXG4gICAgLyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuICAgIFZLX0tBTkE6IDIxLFxuICAgIC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cbiAgICBWS19IQU5HVUw6IDIxLFxuICAgIC8qKiDoi7HmlbAga2V5IG9uIEphcGFuZXNlIE1hYyBrZXlib2FyZC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0VJU1U6IDIyLFxuICAgIC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cbiAgICBWS19KVU5KQTogMjMsXG4gICAgLyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuICAgIFZLX0ZJTkFMOiAyNCxcbiAgICAvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG4gICAgVktfSEFOSkE6IDI1LFxuICAgIC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cbiAgICBWS19LQU5KSTogMjUsXG4gICAgLyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuICAgIFZLX0NPTlZFUlQ6IDI4LFxuICAgIC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cbiAgICBWS19OT05DT05WRVJUOiAyOSxcbiAgICAvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG4gICAgVktfQUNDRVBUOiAzMCxcbiAgICAvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG4gICAgVktfTU9ERUNIQU5HRTogMzEsXG4gICAgLyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuICAgIFZLX1NFTEVDVDogNDEsXG4gICAgLyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuICAgIFZLX1BSSU5UOiA0MixcbiAgICAvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG4gICAgVktfRVhFQ1VURTogNDMsXG4gICAgLyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLlx0ICovXG4gICAgVktfU0xFRVA6IDk1XG59O1xuIiwiaW1wb3J0IEhleCBmcm9tIFwiLi9oZXguanNcIjtcbmltcG9ydCBSZWN0IGZyb20gXCIuL3JlY3QuanNcIjtcbmltcG9ydCBUaWxlIGZyb20gXCIuL3RpbGUuanNcIjtcbmltcG9ydCBUaWxlR0wgZnJvbSBcIi4vdGlsZS1nbC5qc1wiO1xuaW1wb3J0IFRlcm0gZnJvbSBcIi4vdGVybS5qc1wiO1xuaW1wb3J0ICogYXMgVGV4dCBmcm9tIFwiLi4vdGV4dC5qc1wiO1xuaW1wb3J0IHsgREVGQVVMVF9XSURUSCwgREVGQVVMVF9IRUlHSFQgfSBmcm9tIFwiLi4vY29uc3RhbnRzLmpzXCI7XG5jb25zdCBCQUNLRU5EUyA9IHtcbiAgICBcImhleFwiOiBIZXgsXG4gICAgXCJyZWN0XCI6IFJlY3QsXG4gICAgXCJ0aWxlXCI6IFRpbGUsXG4gICAgXCJ0aWxlLWdsXCI6IFRpbGVHTCxcbiAgICBcInRlcm1cIjogVGVybVxufTtcbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICB3aWR0aDogREVGQVVMVF9XSURUSCxcbiAgICBoZWlnaHQ6IERFRkFVTFRfSEVJR0hULFxuICAgIHRyYW5zcG9zZTogZmFsc2UsXG4gICAgbGF5b3V0OiBcInJlY3RcIixcbiAgICBmb250U2l6ZTogMTUsXG4gICAgc3BhY2luZzogMSxcbiAgICBib3JkZXI6IDAsXG4gICAgZm9yY2VTcXVhcmVSYXRpbzogZmFsc2UsXG4gICAgZm9udEZhbWlseTogXCJtb25vc3BhY2VcIixcbiAgICBmb250U3R5bGU6IFwiXCIsXG4gICAgZmc6IFwiI2NjY1wiLFxuICAgIGJnOiBcIiMwMDBcIixcbiAgICB0aWxlV2lkdGg6IDMyLFxuICAgIHRpbGVIZWlnaHQ6IDMyLFxuICAgIHRpbGVNYXA6IHt9LFxuICAgIHRpbGVTZXQ6IG51bGwsXG4gICAgdGlsZUNvbG9yaXplOiBmYWxzZVxufTtcbi8qKlxuICogQGNsYXNzIFZpc3VhbCBtYXAgZGlzcGxheVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNwbGF5IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLl9kaXJ0eSA9IGZhbHNlOyAvLyBmYWxzZSA9IG5vdGhpbmcsIHRydWUgPSBhbGwsIG9iamVjdCA9IGRpcnR5IGNlbGxzXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB7fTtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgdGhpcy5ERUJVRyA9IHRoaXMuREVCVUcuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fdGljayA9IHRoaXMuX3RpY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fYmFja2VuZC5zY2hlZHVsZSh0aGlzLl90aWNrKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVidWcgaGVscGVyLCBpZGVhbCBhcyBhIG1hcCBnZW5lcmF0b3IgY2FsbGJhY2suIEFsd2F5cyBib3VuZCB0byB0aGlzLlxuICAgICAqIEBwYXJhbSB7aW50fSB4XG4gICAgICogQHBhcmFtIHtpbnR9IHlcbiAgICAgKiBAcGFyYW0ge2ludH0gd2hhdFxuICAgICAqL1xuICAgIERFQlVHKHgsIHksIHdoYXQpIHtcbiAgICAgICAgbGV0IGNvbG9ycyA9IFt0aGlzLl9vcHRpb25zLmJnLCB0aGlzLl9vcHRpb25zLmZnXTtcbiAgICAgICAgdGhpcy5kcmF3KHgsIHksIG51bGwsIG51bGwsIGNvbG9yc1t3aGF0ICUgY29sb3JzLmxlbmd0aF0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbGVhciB0aGUgd2hvbGUgZGlzcGxheSAoY292ZXIgaXQgd2l0aCBiYWNrZ3JvdW5kIGNvbG9yKVxuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHNlZSBST1QuRGlzcGxheVxuICAgICAqL1xuICAgIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgICBpZiAob3B0aW9ucy53aWR0aCB8fCBvcHRpb25zLmhlaWdodCB8fCBvcHRpb25zLmZvbnRTaXplIHx8IG9wdGlvbnMuZm9udEZhbWlseSB8fCBvcHRpb25zLnNwYWNpbmcgfHwgb3B0aW9ucy5sYXlvdXQpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmxheW91dCkge1xuICAgICAgICAgICAgICAgIGxldCBjdG9yID0gQkFDS0VORFNbb3B0aW9ucy5sYXlvdXRdO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tlbmQgPSBuZXcgY3RvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYmFja2VuZC5zZXRPcHRpb25zKHRoaXMuX29wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5fZGlydHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGN1cnJlbnRseSBzZXQgb3B0aW9uc1xuICAgICAqL1xuICAgIGdldE9wdGlvbnMoKSB7IHJldHVybiB0aGlzLl9vcHRpb25zOyB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgRE9NIG5vZGUgb2YgdGhpcyBkaXNwbGF5XG4gICAgICovXG4gICAgZ2V0Q29udGFpbmVyKCkgeyByZXR1cm4gdGhpcy5fYmFja2VuZC5nZXRDb250YWluZXIoKTsgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGUgdGhlIG1heGltdW0gd2lkdGgvaGVpZ2h0IHRvIGZpdCBpbnRvIGEgc2V0IG9mIGdpdmVuIGNvbnN0cmFpbnRzXG4gICAgICogQHBhcmFtIHtpbnR9IGF2YWlsV2lkdGggTWF4aW11bSBhbGxvd2VkIHBpeGVsIHdpZHRoXG4gICAgICogQHBhcmFtIHtpbnR9IGF2YWlsSGVpZ2h0IE1heGltdW0gYWxsb3dlZCBwaXhlbCBoZWlnaHRcbiAgICAgKiBAcmV0dXJucyB7aW50WzJdfSBjZWxsV2lkdGgsY2VsbEhlaWdodFxuICAgICAqL1xuICAgIGNvbXB1dGVTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9iYWNrZW5kLmNvbXB1dGVTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSB0aGUgbWF4aW11bSBmb250IHNpemUgdG8gZml0IGludG8gYSBzZXQgb2YgZ2l2ZW4gY29uc3RyYWludHNcbiAgICAgKiBAcGFyYW0ge2ludH0gYXZhaWxXaWR0aCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgd2lkdGhcbiAgICAgKiBAcGFyYW0ge2ludH0gYXZhaWxIZWlnaHQgTWF4aW11bSBhbGxvd2VkIHBpeGVsIGhlaWdodFxuICAgICAqIEByZXR1cm5zIHtpbnR9IGZvbnRTaXplXG4gICAgICovXG4gICAgY29tcHV0ZUZvbnRTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9iYWNrZW5kLmNvbXB1dGVGb250U2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCk7XG4gICAgfVxuICAgIGNvbXB1dGVUaWxlU2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuICAgICAgICBsZXQgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLndpZHRoKTtcbiAgICAgICAgbGV0IGhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9vcHRpb25zLmhlaWdodCk7XG4gICAgICAgIHJldHVybiBbd2lkdGgsIGhlaWdodF07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgYSBET00gZXZlbnQgKG1vdXNlIG9yIHRvdWNoKSB0byBtYXAgY29vcmRpbmF0ZXMuIFVzZXMgZmlyc3QgdG91Y2ggZm9yIG11bHRpLXRvdWNoLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgZXZlbnRcbiAgICAgKiBAcmV0dXJucyB7aW50WzJdfSAtMSBmb3IgdmFsdWVzIG91dHNpZGUgb2YgdGhlIGNhbnZhc1xuICAgICAqL1xuICAgIGV2ZW50VG9Qb3NpdGlvbihlKSB7XG4gICAgICAgIGxldCB4LCB5O1xuICAgICAgICBpZiAoXCJ0b3VjaGVzXCIgaW4gZSkge1xuICAgICAgICAgICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICAgICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgIHkgPSBlLmNsaWVudFk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tlbmQuZXZlbnRUb1Bvc2l0aW9uKHgsIHkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge2ludH0geFxuICAgICAqIEBwYXJhbSB7aW50fSB5XG4gICAgICogQHBhcmFtIHtzdHJpbmcgfHwgc3RyaW5nW119IGNoIE9uZSBvciBtb3JlIGNoYXJzICh3aWxsIGJlIG92ZXJsYXBwaW5nIHRoZW1zZWx2ZXMpXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtmZ10gZm9yZWdyb3VuZCBjb2xvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbYmddIGJhY2tncm91bmQgY29sb3JcbiAgICAgKi9cbiAgICBkcmF3KHgsIHksIGNoLCBmZywgYmcpIHtcbiAgICAgICAgaWYgKCFmZykge1xuICAgICAgICAgICAgZmcgPSB0aGlzLl9vcHRpb25zLmZnO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYmcpIHtcbiAgICAgICAgICAgIGJnID0gdGhpcy5fb3B0aW9ucy5iZztcbiAgICAgICAgfVxuICAgICAgICBsZXQga2V5ID0gYCR7eH0sJHt5fWA7XG4gICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IFt4LCB5LCBjaCwgZmcsIGJnXTtcbiAgICAgICAgaWYgKHRoaXMuX2RpcnR5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gLy8gd2lsbCBhbHJlYWR5IHJlZHJhdyBldmVyeXRoaW5nIFxuICAgICAgICBpZiAoIXRoaXMuX2RpcnR5KSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJ0eSA9IHt9O1xuICAgICAgICB9IC8vIGZpcnN0IVxuICAgICAgICB0aGlzLl9kaXJ0eVtrZXldID0gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRHJhd3MgYSB0ZXh0IGF0IGdpdmVuIHBvc2l0aW9uLiBPcHRpb25hbGx5IHdyYXBzIGF0IGEgbWF4aW11bSBsZW5ndGguIEN1cnJlbnRseSBkb2VzIG5vdCB3b3JrIHdpdGggaGV4IGxheW91dC5cbiAgICAgKiBAcGFyYW0ge2ludH0geFxuICAgICAqIEBwYXJhbSB7aW50fSB5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgTWF5IGNvbnRhaW4gY29sb3IvYmFja2dyb3VuZCBmb3JtYXQgc3BlY2lmaWVycywgJWN7bmFtZX0vJWJ7bmFtZX0sIGJvdGggb3B0aW9uYWwuICVje30vJWJ7fSByZXNldHMgdG8gZGVmYXVsdC5cbiAgICAgKiBAcGFyYW0ge2ludH0gW21heFdpZHRoXSB3cmFwIGF0IHdoYXQgd2lkdGg/XG4gICAgICogQHJldHVybnMge2ludH0gbGluZXMgZHJhd25cbiAgICAgKi9cbiAgICBkcmF3VGV4dCh4LCB5LCB0ZXh0LCBtYXhXaWR0aCkge1xuICAgICAgICBsZXQgZmcgPSBudWxsO1xuICAgICAgICBsZXQgYmcgPSBudWxsO1xuICAgICAgICBsZXQgY3ggPSB4O1xuICAgICAgICBsZXQgY3kgPSB5O1xuICAgICAgICBsZXQgbGluZXMgPSAxO1xuICAgICAgICBpZiAoIW1heFdpZHRoKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IHRoaXMuX29wdGlvbnMud2lkdGggLSB4O1xuICAgICAgICB9XG4gICAgICAgIGxldCB0b2tlbnMgPSBUZXh0LnRva2VuaXplKHRleHQsIG1heFdpZHRoKTtcbiAgICAgICAgd2hpbGUgKHRva2Vucy5sZW5ndGgpIHsgLy8gaW50ZXJwcmV0IHRva2VuaXplZCBvcGNvZGUgc3RyZWFtXG4gICAgICAgICAgICBsZXQgdG9rZW4gPSB0b2tlbnMuc2hpZnQoKTtcbiAgICAgICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgVGV4dC5UWVBFX1RFWFQ6XG4gICAgICAgICAgICAgICAgICAgIGxldCBpc1NwYWNlID0gZmFsc2UsIGlzUHJldlNwYWNlID0gZmFsc2UsIGlzRnVsbFdpZHRoID0gZmFsc2UsIGlzUHJldkZ1bGxXaWR0aCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2VuLnZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2MgPSB0b2tlbi52YWx1ZS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGMgPSB0b2tlbi52YWx1ZS5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBc3NpZ24gdG8gYHRydWVgIHdoZW4gdGhlIGN1cnJlbnQgY2hhciBpcyBmdWxsLXdpZHRoLlxuICAgICAgICAgICAgICAgICAgICAgICAgaXNGdWxsV2lkdGggPSAoY2MgPiAweGZmMDAgJiYgY2MgPCAweGZmNjEpIHx8IChjYyA+IDB4ZmZkYyAmJiBjYyA8IDB4ZmZlOCkgfHwgY2MgPiAweGZmZWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDdXJyZW50IGNoYXIgaXMgc3BhY2UsIHdoYXRldmVyIGZ1bGwtd2lkdGggb3IgaGFsZi13aWR0aCBib3RoIGFyZSBPSy5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU3BhY2UgPSAoYy5jaGFyQ29kZUF0KDApID09IDB4MjAgfHwgYy5jaGFyQ29kZUF0KDApID09IDB4MzAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcHJldmlvdXMgY2hhciBpcyBmdWxsLXdpZHRoIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3VycmVudCBjaGFyIGlzIG5ldGhlciBoYWxmLXdpZHRoIG5vciBhIHNwYWNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzUHJldkZ1bGxXaWR0aCAmJiAhaXNGdWxsV2lkdGggJiYgIWlzU3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjeCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBhZGQgYW4gZXh0cmEgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGNoYXIgaXMgZnVsbC13aWR0aCBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBwcmV2aW91cyBjaGFyIGlzIG5vdCBhIHNwYWNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRnVsbFdpZHRoICYmICFpc1ByZXZTcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGFkZCBhbiBleHRyYSBwb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3KGN4KyssIGN5LCBjLCBmZywgYmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNQcmV2U3BhY2UgPSBpc1NwYWNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNQcmV2RnVsbFdpZHRoID0gaXNGdWxsV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBUZXh0LlRZUEVfRkc6XG4gICAgICAgICAgICAgICAgICAgIGZnID0gdG9rZW4udmFsdWUgfHwgbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBUZXh0LlRZUEVfQkc6XG4gICAgICAgICAgICAgICAgICAgIGJnID0gdG9rZW4udmFsdWUgfHwgbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBUZXh0LlRZUEVfTkVXTElORTpcbiAgICAgICAgICAgICAgICAgICAgY3ggPSB4O1xuICAgICAgICAgICAgICAgICAgICBjeSsrO1xuICAgICAgICAgICAgICAgICAgICBsaW5lcysrO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGluZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRpbWVyIHRpY2s6IHVwZGF0ZSBkaXJ0eSBwYXJ0c1xuICAgICAqL1xuICAgIF90aWNrKCkge1xuICAgICAgICB0aGlzLl9iYWNrZW5kLnNjaGVkdWxlKHRoaXMuX3RpY2spO1xuICAgICAgICBpZiAoIXRoaXMuX2RpcnR5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2RpcnR5ID09PSB0cnVlKSB7IC8vIGRyYXcgYWxsXG4gICAgICAgICAgICB0aGlzLl9iYWNrZW5kLmNsZWFyKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl9kYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZHJhdyhpZCwgZmFsc2UpO1xuICAgICAgICAgICAgfSAvLyByZWRyYXcgY2FjaGVkIGRhdGEgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIGRyYXcgb25seSBkaXJ0eSBcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9kaXJ0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RyYXcoa2V5LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kaXJ0eSA9IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFdoYXQgdG8gZHJhd1xuICAgICAqIEBwYXJhbSB7Ym9vbH0gY2xlYXJCZWZvcmUgSXMgaXQgbmVjZXNzYXJ5IHRvIGNsZWFuIGJlZm9yZT9cbiAgICAgKi9cbiAgICBfZHJhdyhrZXksIGNsZWFyQmVmb3JlKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5fZGF0YVtrZXldO1xuICAgICAgICBpZiAoZGF0YVs0XSAhPSB0aGlzLl9vcHRpb25zLmJnKSB7XG4gICAgICAgICAgICBjbGVhckJlZm9yZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYmFja2VuZC5kcmF3KGRhdGEsIGNsZWFyQmVmb3JlKTtcbiAgICB9XG59XG5EaXNwbGF5LlJlY3QgPSBSZWN0O1xuRGlzcGxheS5IZXggPSBIZXg7XG5EaXNwbGF5LlRpbGUgPSBUaWxlO1xuRGlzcGxheS5UaWxlR0wgPSBUaWxlR0w7XG5EaXNwbGF5LlRlcm0gPSBUZXJtO1xuIiwiaW1wb3J0IFJORyBmcm9tIFwiLi9ybmcuanNcIjtcbi8qKlxuICogQGNsYXNzIChNYXJrb3YgcHJvY2VzcyktYmFzZWQgc3RyaW5nIGdlbmVyYXRvci5cbiAqIENvcGllZCBmcm9tIGEgPGEgaHJlZj1cImh0dHA6Ly93d3cucm9ndWViYXNpbi5yb2d1ZWxpa2VkZXZlbG9wbWVudC5vcmcvaW5kZXgucGhwP3RpdGxlPU5hbWVzX2Zyb21fYV9oaWdoX29yZGVyX01hcmtvdl9Qcm9jZXNzX2FuZF9hX3NpbXBsaWZpZWRfS2F0el9iYWNrLW9mZl9zY2hlbWVcIj5Sb2d1ZUJhc2luIGFydGljbGU8L2E+LlxuICogT2ZmZXJzIGNvbmZpZ3VyYWJsZSBvcmRlciBhbmQgcHJpb3IuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmluZ0dlbmVyYXRvciB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0ge1xuICAgICAgICAgICAgd29yZHM6IGZhbHNlLFxuICAgICAgICAgICAgb3JkZXI6IDMsXG4gICAgICAgICAgICBwcmlvcjogMC4wMDFcbiAgICAgICAgfTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLl9vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fYm91bmRhcnkgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDApO1xuICAgICAgICB0aGlzLl9zdWZmaXggPSB0aGlzLl9ib3VuZGFyeTtcbiAgICAgICAgdGhpcy5fcHJlZml4ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fb3B0aW9ucy5vcmRlcjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9wcmVmaXgucHVzaCh0aGlzLl9ib3VuZGFyeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcHJpb3JWYWx1ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5fcHJpb3JWYWx1ZXNbdGhpcy5fYm91bmRhcnldID0gdGhpcy5fb3B0aW9ucy5wcmlvcjtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIGxlYXJuaW5nIGRhdGFcbiAgICAgKi9cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLl9wcmlvclZhbHVlcyA9IHt9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBHZW5lcmF0ZWQgc3RyaW5nXG4gICAgICovXG4gICAgZ2VuZXJhdGUoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbdGhpcy5fc2FtcGxlKHRoaXMuX3ByZWZpeCldO1xuICAgICAgICB3aGlsZSAocmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSAhPSB0aGlzLl9ib3VuZGFyeSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5fc2FtcGxlKHJlc3VsdCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9qb2luKHJlc3VsdC5zbGljZSgwLCAtMSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBPYnNlcnZlIChsZWFybikgYSBzdHJpbmcgZnJvbSBhIHRyYWluaW5nIHNldFxuICAgICAqL1xuICAgIG9ic2VydmUoc3RyaW5nKSB7XG4gICAgICAgIGxldCB0b2tlbnMgPSB0aGlzLl9zcGxpdChzdHJpbmcpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fcHJpb3JWYWx1ZXNbdG9rZW5zW2ldXSA9IHRoaXMuX29wdGlvbnMucHJpb3I7XG4gICAgICAgIH1cbiAgICAgICAgdG9rZW5zID0gdGhpcy5fcHJlZml4LmNvbmNhdCh0b2tlbnMpLmNvbmNhdCh0aGlzLl9zdWZmaXgpOyAvKiBhZGQgYm91bmRhcnkgc3ltYm9scyAqL1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fb3B0aW9ucy5vcmRlcjsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNvbnRleHQgPSB0b2tlbnMuc2xpY2UoaSAtIHRoaXMuX29wdGlvbnMub3JkZXIsIGkpO1xuICAgICAgICAgICAgbGV0IGV2ZW50ID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb250ZXh0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN1YmNvbnRleHQgPSBjb250ZXh0LnNsaWNlKGopO1xuICAgICAgICAgICAgICAgIHRoaXMuX29ic2VydmVFdmVudChzdWJjb250ZXh0LCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0U3RhdHMoKSB7XG4gICAgICAgIGxldCBwYXJ0cyA9IFtdO1xuICAgICAgICBsZXQgcHJpb3JDb3VudCA9IE9iamVjdC5rZXlzKHRoaXMuX3ByaW9yVmFsdWVzKS5sZW5ndGg7XG4gICAgICAgIHByaW9yQ291bnQtLTsgLy8gYm91bmRhcnlcbiAgICAgICAgcGFydHMucHVzaChcImRpc3RpbmN0IHNhbXBsZXM6IFwiICsgcHJpb3JDb3VudCk7XG4gICAgICAgIGxldCBkYXRhQ291bnQgPSBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKS5sZW5ndGg7XG4gICAgICAgIGxldCBldmVudENvdW50ID0gMDtcbiAgICAgICAgZm9yIChsZXQgcCBpbiB0aGlzLl9kYXRhKSB7XG4gICAgICAgICAgICBldmVudENvdW50ICs9IE9iamVjdC5rZXlzKHRoaXMuX2RhdGFbcF0pLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKFwiZGljdGlvbmFyeSBzaXplIChjb250ZXh0cyk6IFwiICsgZGF0YUNvdW50KTtcbiAgICAgICAgcGFydHMucHVzaChcImRpY3Rpb25hcnkgc2l6ZSAoZXZlbnRzKTogXCIgKyBldmVudENvdW50KTtcbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oXCIsIFwiKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9XG4gICAgICogQHJldHVybnMge3N0cmluZ1tdfVxuICAgICAqL1xuICAgIF9zcGxpdChzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5zcGxpdCh0aGlzLl9vcHRpb25zLndvcmRzID8gL1xccysvIDogXCJcIik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119XG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBfam9pbihhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFyci5qb2luKHRoaXMuX29wdGlvbnMud29yZHMgPyBcIiBcIiA6IFwiXCIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBjb250ZXh0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICovXG4gICAgX29ic2VydmVFdmVudChjb250ZXh0LCBldmVudCkge1xuICAgICAgICBsZXQga2V5ID0gdGhpcy5fam9pbihjb250ZXh0KTtcbiAgICAgICAgaWYgKCEoa2V5IGluIHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhW2tleV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgaWYgKCEoZXZlbnQgaW4gZGF0YSkpIHtcbiAgICAgICAgICAgIGRhdGFbZXZlbnRdID0gMDtcbiAgICAgICAgfVxuICAgICAgICBkYXRhW2V2ZW50XSsrO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgX3NhbXBsZShjb250ZXh0KSB7XG4gICAgICAgIGNvbnRleHQgPSB0aGlzLl9iYWNrb2ZmKGNvbnRleHQpO1xuICAgICAgICBsZXQga2V5ID0gdGhpcy5fam9pbihjb250ZXh0KTtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgIGxldCBhdmFpbGFibGUgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMucHJpb3IpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50IGluIHRoaXMuX3ByaW9yVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlW2V2ZW50XSA9IHRoaXMuX3ByaW9yVmFsdWVzW2V2ZW50XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50IGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVbZXZlbnRdICs9IGRhdGFbZXZlbnRdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXZhaWxhYmxlID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUk5HLmdldFdlaWdodGVkVmFsdWUoYXZhaWxhYmxlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX1cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nW119XG4gICAgICovXG4gICAgX2JhY2tvZmYoY29udGV4dCkge1xuICAgICAgICBpZiAoY29udGV4dC5sZW5ndGggPiB0aGlzLl9vcHRpb25zLm9yZGVyKSB7XG4gICAgICAgICAgICBjb250ZXh0ID0gY29udGV4dC5zbGljZSgtdGhpcy5fb3B0aW9ucy5vcmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29udGV4dC5sZW5ndGggPCB0aGlzLl9vcHRpb25zLm9yZGVyKSB7XG4gICAgICAgICAgICBjb250ZXh0ID0gdGhpcy5fcHJlZml4LnNsaWNlKDAsIHRoaXMuX29wdGlvbnMub3JkZXIgLSBjb250ZXh0Lmxlbmd0aCkuY29uY2F0KGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlICghKHRoaXMuX2pvaW4oY29udGV4dCkgaW4gdGhpcy5fZGF0YSkgJiYgY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb250ZXh0ID0gY29udGV4dC5zbGljZSgxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudFF1ZXVlIHtcbiAgICAvKipcbiAgICAgKiBAY2xhc3MgR2VuZXJpYyBldmVudCBxdWV1ZTogc3RvcmVzIGV2ZW50cyBhbmQgcmV0cmlldmVzIHRoZW0gYmFzZWQgb24gdGhlaXIgdGltZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl90aW1lID0gMDtcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gW107XG4gICAgICAgIHRoaXMuX2V2ZW50VGltZXMgPSBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybnMge251bWJlcn0gRWxhcHNlZCB0aW1lXG4gICAgICovXG4gICAgZ2V0VGltZSgpIHsgcmV0dXJuIHRoaXMuX3RpbWU7IH1cbiAgICAvKipcbiAgICAgKiBDbGVhciBhbGwgc2NoZWR1bGVkIGV2ZW50c1xuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9ldmVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5fZXZlbnRUaW1lcyA9IFtdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHs/fSBldmVudFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lXG4gICAgICovXG4gICAgYWRkKGV2ZW50LCB0aW1lKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuX2V2ZW50cy5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZXZlbnRUaW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50VGltZXNbaV0gPiB0aW1lKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2V2ZW50cy5zcGxpY2UoaW5kZXgsIDAsIGV2ZW50KTtcbiAgICAgICAgdGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoaW5kZXgsIDAsIHRpbWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMb2NhdGVzIHRoZSBuZWFyZXN0IGV2ZW50LCBhZHZhbmNlcyB0aW1lIGlmIG5lY2Vzc2FyeS4gUmV0dXJucyB0aGF0IGV2ZW50IGFuZCByZW1vdmVzIGl0IGZyb20gdGhlIHF1ZXVlLlxuICAgICAqIEByZXR1cm5zIHs/IHx8IG51bGx9IFRoZSBldmVudCBwcmV2aW91c2x5IGFkZGVkIGJ5IGFkZEV2ZW50LCBudWxsIGlmIG5vIGV2ZW50IGF2YWlsYWJsZVxuICAgICAqL1xuICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9ldmVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdGltZSA9IHRoaXMuX2V2ZW50VGltZXMuc3BsaWNlKDAsIDEpWzBdO1xuICAgICAgICBpZiAodGltZSA+IDApIHsgLyogYWR2YW5jZSAqL1xuICAgICAgICAgICAgdGhpcy5fdGltZSArPSB0aW1lO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9ldmVudFRpbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRUaW1lc1tpXSAtPSB0aW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudHMuc3BsaWNlKDAsIDEpWzBdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHRpbWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBldmVudFxuICAgICAqIEBwYXJhbSB7P30gZXZlbnRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aW1lXG4gICAgICovXG4gICAgZ2V0RXZlbnRUaW1lKGV2ZW50KSB7XG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuX2V2ZW50cy5pbmRleE9mKGV2ZW50KTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudFRpbWVzW2luZGV4XTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFuIGV2ZW50IGZyb20gdGhlIHF1ZXVlXG4gICAgICogQHBhcmFtIHs/fSBldmVudFxuICAgICAqIEByZXR1cm5zIHtib29sfSBzdWNjZXNzP1xuICAgICAqL1xuICAgIHJlbW92ZShldmVudCkge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9ldmVudHMuaW5kZXhPZihldmVudCk7XG4gICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JlbW92ZShpbmRleCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICA7XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFuIGV2ZW50IGZyb20gdGhlIHF1ZXVlXG4gICAgICogQHBhcmFtIHtpbnR9IGluZGV4XG4gICAgICovXG4gICAgX3JlbW92ZShpbmRleCkge1xuICAgICAgICB0aGlzLl9ldmVudHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgICA7XG59XG4iLCJpbXBvcnQgRXZlbnRRdWV1ZSBmcm9tIFwiLi4vZXZlbnRxdWV1ZS5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZWR1bGVyIHtcbiAgICAvKipcbiAgICAgKiBAY2xhc3MgQWJzdHJhY3Qgc2NoZWR1bGVyXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlID0gbmV3IEV2ZW50UXVldWUoKTtcbiAgICAgICAgdGhpcy5fcmVwZWF0ID0gW107XG4gICAgICAgIHRoaXMuX2N1cnJlbnQgPSBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc2VlIFJPVC5FdmVudFF1ZXVlI2dldFRpbWVcbiAgICAgKi9cbiAgICBnZXRUaW1lKCkgeyByZXR1cm4gdGhpcy5fcXVldWUuZ2V0VGltZSgpOyB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHs/fSBpdGVtXG4gICAgICogQHBhcmFtIHtib29sfSByZXBlYXRcbiAgICAgKi9cbiAgICBhZGQoaXRlbSwgcmVwZWF0KSB7XG4gICAgICAgIGlmIChyZXBlYXQpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlcGVhdC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHRpbWUgdGhlIGdpdmVuIGl0ZW0gaXMgc2NoZWR1bGVkIGZvclxuICAgICAqIEBwYXJhbSB7P30gaXRlbVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHRpbWVcbiAgICAgKi9cbiAgICBnZXRUaW1lT2YoaXRlbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcXVldWUuZ2V0RXZlbnRUaW1lKGl0ZW0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbGVhciBhbGwgaXRlbXNcbiAgICAgKi9cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5fcXVldWUuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fcmVwZWF0ID0gW107XG4gICAgICAgIHRoaXMuX2N1cnJlbnQgPSBudWxsO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgcHJldmlvdXNseSBhZGRlZCBpdGVtXG4gICAgICogQHBhcmFtIHs/fSBpdGVtXG4gICAgICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3NmdWw/XG4gICAgICovXG4gICAgcmVtb3ZlKGl0ZW0pIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuX3F1ZXVlLnJlbW92ZShpdGVtKTtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fcmVwZWF0LmluZGV4T2YoaXRlbSk7XG4gICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fcmVwZWF0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnQgPT0gaXRlbSkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2NoZWR1bGUgbmV4dCBpdGVtXG4gICAgICogQHJldHVybnMgez99XG4gICAgICovXG4gICAgbmV4dCgpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudCA9IHRoaXMuX3F1ZXVlLmdldCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudDtcbiAgICB9XG59XG4iLCJpbXBvcnQgU2NoZWR1bGVyIGZyb20gXCIuL3NjaGVkdWxlci5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgU2ltcGxlIGZhaXIgc2NoZWR1bGVyIChyb3VuZC1yb2JpbiBzdHlsZSlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2ltcGxlIGV4dGVuZHMgU2NoZWR1bGVyIHtcbiAgICBhZGQoaXRlbSwgcmVwZWF0KSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlLmFkZChpdGVtLCAwKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFkZChpdGVtLCByZXBlYXQpO1xuICAgIH1cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudCAhPT0gbnVsbCAmJiB0aGlzLl9yZXBlYXQuaW5kZXhPZih0aGlzLl9jdXJyZW50KSAhPSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fcXVldWUuYWRkKHRoaXMuX2N1cnJlbnQsIDApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5uZXh0KCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IFNjaGVkdWxlciBmcm9tIFwiLi9zY2hlZHVsZXIuanNcIjtcbi8qKlxuICogQGNsYXNzIFNwZWVkLWJhc2VkIHNjaGVkdWxlclxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGVlZCBleHRlbmRzIFNjaGVkdWxlciB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGl0ZW0gYW55dGhpbmcgd2l0aCBcImdldFNwZWVkXCIgbWV0aG9kXG4gICAgICogQHBhcmFtIHtib29sfSByZXBlYXRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWU9MS9pdGVtLmdldFNwZWVkKCldXG4gICAgICogQHNlZSBST1QuU2NoZWR1bGVyI2FkZFxuICAgICAqL1xuICAgIGFkZChpdGVtLCByZXBlYXQsIHRpbWUpIHtcbiAgICAgICAgdGhpcy5fcXVldWUuYWRkKGl0ZW0sIHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiAxIC8gaXRlbS5nZXRTcGVlZCgpKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFkZChpdGVtLCByZXBlYXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc2VlIFJPVC5TY2hlZHVsZXIjbmV4dFxuICAgICAqL1xuICAgIG5leHQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50ICYmIHRoaXMuX3JlcGVhdC5pbmRleE9mKHRoaXMuX2N1cnJlbnQpICE9IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9xdWV1ZS5hZGQodGhpcy5fY3VycmVudCwgMSAvIHRoaXMuX2N1cnJlbnQuZ2V0U3BlZWQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLm5leHQoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgU2NoZWR1bGVyIGZyb20gXCIuL3NjaGVkdWxlci5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgQWN0aW9uLWJhc2VkIHNjaGVkdWxlclxuICogQGF1Z21lbnRzIFJPVC5TY2hlZHVsZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0aW9uIGV4dGVuZHMgU2NoZWR1bGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fZGVmYXVsdER1cmF0aW9uID0gMTsgLyogZm9yIG5ld2x5IGFkZGVkICovXG4gICAgICAgIHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uOyAvKiBmb3IgdGhpcy5fY3VycmVudCAqL1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gaXRlbVxuICAgICAqIEBwYXJhbSB7Ym9vbH0gcmVwZWF0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lPTFdXG4gICAgICogQHNlZSBST1QuU2NoZWR1bGVyI2FkZFxuICAgICAqL1xuICAgIGFkZChpdGVtLCByZXBlYXQsIHRpbWUpIHtcbiAgICAgICAgdGhpcy5fcXVldWUuYWRkKGl0ZW0sIHRpbWUgfHwgdGhpcy5fZGVmYXVsdER1cmF0aW9uKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFkZChpdGVtLCByZXBlYXQpO1xuICAgIH1cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5fZHVyYXRpb24gPSB0aGlzLl9kZWZhdWx0RHVyYXRpb247XG4gICAgICAgIHJldHVybiBzdXBlci5jbGVhcigpO1xuICAgIH1cbiAgICByZW1vdmUoaXRlbSkge1xuICAgICAgICBpZiAoaXRlbSA9PSB0aGlzLl9jdXJyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIucmVtb3ZlKGl0ZW0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc2VlIFJPVC5TY2hlZHVsZXIjbmV4dFxuICAgICAqL1xuICAgIG5leHQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50ICE9PSBudWxsICYmIHRoaXMuX3JlcGVhdC5pbmRleE9mKHRoaXMuX2N1cnJlbnQpICE9IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9xdWV1ZS5hZGQodGhpcy5fY3VycmVudCwgdGhpcy5fZHVyYXRpb24gfHwgdGhpcy5fZGVmYXVsdER1cmF0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5uZXh0KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBkdXJhdGlvbiBmb3IgdGhlIGFjdGl2ZSBpdGVtXG4gICAgICovXG4gICAgc2V0RHVyYXRpb24odGltZSkge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudCkge1xuICAgICAgICAgICAgdGhpcy5fZHVyYXRpb24gPSB0aW1lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCBTaW1wbGUgZnJvbSBcIi4vc2ltcGxlLmpzXCI7XG5pbXBvcnQgU3BlZWQgZnJvbSBcIi4vc3BlZWQuanNcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vYWN0aW9uLmpzXCI7XG5leHBvcnQgZGVmYXVsdCB7IFNpbXBsZSwgU3BlZWQsIEFjdGlvbiB9O1xuIiwiaW1wb3J0IHsgRElSUyB9IGZyb20gXCIuLi9jb25zdGFudHMuanNcIjtcbjtcbjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZPViB7XG4gICAgLyoqXG4gICAgICogQGNsYXNzIEFic3RyYWN0IEZPViBhbGdvcml0aG1cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaWdodFBhc3Nlc0NhbGxiYWNrIERvZXMgdGhlIGxpZ2h0IHBhc3MgdGhyb3VnaCB4LHk/XG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICAgICAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50b3BvbG9neT04XSA0LzYvOFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9saWdodFBhc3NlcyA9IGxpZ2h0UGFzc2VzQ2FsbGJhY2s7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgdG9wb2xvZ3k6IDggfSwgb3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiBhbGwgbmVpZ2hib3JzIGluIGEgY29uY2VudHJpYyByaW5nXG4gICAgICogQHBhcmFtIHtpbnR9IGN4IGNlbnRlci14XG4gICAgICogQHBhcmFtIHtpbnR9IGN5IGNlbnRlci15XG4gICAgICogQHBhcmFtIHtpbnR9IHIgcmFuZ2VcbiAgICAgKi9cbiAgICBfZ2V0Q2lyY2xlKGN4LCBjeSwgcikge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGxldCBkaXJzLCBjb3VudEZhY3Rvciwgc3RhcnRPZmZzZXQ7XG4gICAgICAgIHN3aXRjaCAodGhpcy5fb3B0aW9ucy50b3BvbG9neSkge1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGNvdW50RmFjdG9yID0gMTtcbiAgICAgICAgICAgICAgICBzdGFydE9mZnNldCA9IFswLCAxXTtcbiAgICAgICAgICAgICAgICBkaXJzID0gW1xuICAgICAgICAgICAgICAgICAgICBESVJTWzhdWzddLFxuICAgICAgICAgICAgICAgICAgICBESVJTWzhdWzFdLFxuICAgICAgICAgICAgICAgICAgICBESVJTWzhdWzNdLFxuICAgICAgICAgICAgICAgICAgICBESVJTWzhdWzVdXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICBkaXJzID0gRElSU1s2XTtcbiAgICAgICAgICAgICAgICBjb3VudEZhY3RvciA9IDE7XG4gICAgICAgICAgICAgICAgc3RhcnRPZmZzZXQgPSBbLTEsIDFdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgIGRpcnMgPSBESVJTWzRdO1xuICAgICAgICAgICAgICAgIGNvdW50RmFjdG9yID0gMjtcbiAgICAgICAgICAgICAgICBzdGFydE9mZnNldCA9IFstMSwgMV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluY29ycmVjdCB0b3BvbG9neSBmb3IgRk9WIGNvbXB1dGF0aW9uXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8qIHN0YXJ0aW5nIG5laWdoYm9yICovXG4gICAgICAgIGxldCB4ID0gY3ggKyBzdGFydE9mZnNldFswXSAqIHI7XG4gICAgICAgIGxldCB5ID0gY3kgKyBzdGFydE9mZnNldFsxXSAqIHI7XG4gICAgICAgIC8qIGNpcmNsZSAqL1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgciAqIGNvdW50RmFjdG9yOyBqKyspIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChbeCwgeV0pO1xuICAgICAgICAgICAgICAgIHggKz0gZGlyc1tpXVswXTtcbiAgICAgICAgICAgICAgICB5ICs9IGRpcnNbaV1bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG4iLCJpbXBvcnQgRk9WIGZyb20gXCIuL2Zvdi5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgRGlzY3JldGUgc2hhZG93Y2FzdGluZyBhbGdvcml0aG0uIE9ic29sZXRlZCBieSBQcmVjaXNlIHNoYWRvd2Nhc3RpbmcuXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNjcmV0ZVNoYWRvd2Nhc3RpbmcgZXh0ZW5kcyBGT1Yge1xuICAgIGNvbXB1dGUoeCwgeSwgUiwgY2FsbGJhY2spIHtcbiAgICAgICAgLyogdGhpcyBwbGFjZSBpcyBhbHdheXMgdmlzaWJsZSAqL1xuICAgICAgICBjYWxsYmFjayh4LCB5LCAwLCAxKTtcbiAgICAgICAgLyogc3RhbmRpbmcgaW4gYSBkYXJrIHBsYWNlLiBGSVhNRSBpcyB0aGlzIGEgZ29vZCBpZGVhPyAgKi9cbiAgICAgICAgaWYgKCF0aGlzLl9saWdodFBhc3Nlcyh4LCB5KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8qIHN0YXJ0IGFuZCBlbmQgYW5nbGVzICovXG4gICAgICAgIGxldCBEQVRBID0gW107XG4gICAgICAgIGxldCBBLCBCLCBjeCwgY3ksIGJsb2NrcztcbiAgICAgICAgLyogYW5hbHl6ZSBzdXJyb3VuZGluZyBjZWxscyBpbiBjb25jZW50cmljIHJpbmdzLCBzdGFydGluZyBmcm9tIHRoZSBjZW50ZXIgKi9cbiAgICAgICAgZm9yIChsZXQgciA9IDE7IHIgPD0gUjsgcisrKSB7XG4gICAgICAgICAgICBsZXQgbmVpZ2hib3JzID0gdGhpcy5fZ2V0Q2lyY2xlKHgsIHksIHIpO1xuICAgICAgICAgICAgbGV0IGFuZ2xlID0gMzYwIC8gbmVpZ2hib3JzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3ggPSBuZWlnaGJvcnNbaV1bMF07XG4gICAgICAgICAgICAgICAgY3kgPSBuZWlnaGJvcnNbaV1bMV07XG4gICAgICAgICAgICAgICAgQSA9IGFuZ2xlICogKGkgLSAwLjUpO1xuICAgICAgICAgICAgICAgIEIgPSBBICsgYW5nbGU7XG4gICAgICAgICAgICAgICAgYmxvY2tzID0gIXRoaXMuX2xpZ2h0UGFzc2VzKGN4LCBjeSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3Zpc2libGVDb29yZHMoTWF0aC5mbG9vcihBKSwgTWF0aC5jZWlsKEIpLCBibG9ja3MsIERBVEEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGN4LCBjeSwgciwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChEQVRBLmxlbmd0aCA9PSAyICYmIERBVEFbMF0gPT0gMCAmJiBEQVRBWzFdID09IDM2MCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSAvKiBjdXRvZmY/ICovXG4gICAgICAgICAgICB9IC8qIGZvciBhbGwgY2VsbHMgaW4gdGhpcyByaW5nICovXG4gICAgICAgIH0gLyogZm9yIGFsbCByaW5ncyAqL1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge2ludH0gQSBzdGFydCBhbmdsZVxuICAgICAqIEBwYXJhbSB7aW50fSBCIGVuZCBhbmdsZVxuICAgICAqIEBwYXJhbSB7Ym9vbH0gYmxvY2tzIERvZXMgY3VycmVudCBjZWxsIGJsb2NrIHZpc2liaWxpdHk/XG4gICAgICogQHBhcmFtIHtpbnRbXVtdfSBEQVRBIHNoYWRvd2VkIGFuZ2xlIHBhaXJzXG4gICAgICovXG4gICAgX3Zpc2libGVDb29yZHMoQSwgQiwgYmxvY2tzLCBEQVRBKSB7XG4gICAgICAgIGlmIChBIDwgMCkge1xuICAgICAgICAgICAgbGV0IHYxID0gdGhpcy5fdmlzaWJsZUNvb3JkcygwLCBCLCBibG9ja3MsIERBVEEpO1xuICAgICAgICAgICAgbGV0IHYyID0gdGhpcy5fdmlzaWJsZUNvb3JkcygzNjAgKyBBLCAzNjAsIGJsb2NrcywgREFUQSk7XG4gICAgICAgICAgICByZXR1cm4gdjEgfHwgdjI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUgKGluZGV4IDwgREFUQS5sZW5ndGggJiYgREFUQVtpbmRleF0gPCBBKSB7XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleCA9PSBEQVRBLmxlbmd0aCkgeyAvKiBjb21wbGV0ZWx5IG5ldyBzaGFkb3cgKi9cbiAgICAgICAgICAgIGlmIChibG9ja3MpIHtcbiAgICAgICAgICAgICAgICBEQVRBLnB1c2goQSwgQik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBpZiAoaW5kZXggJSAyKSB7IC8qIHRoaXMgc2hhZG93IHN0YXJ0cyBpbiBhbiBleGlzdGluZyBzaGFkb3csIG9yIHdpdGhpbiBpdHMgZW5kaW5nIGJvdW5kYXJ5ICovXG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggPCBEQVRBLmxlbmd0aCAmJiBEQVRBW2luZGV4XSA8IEIpIHtcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY291bnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChibG9ja3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgJSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIERBVEEuc3BsaWNlKGluZGV4IC0gY291bnQsIGNvdW50LCBCKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIERBVEEuc3BsaWNlKGluZGV4IC0gY291bnQsIGNvdW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLyogdGhpcyBzaGFkb3cgc3RhcnRzIG91dHNpZGUgYW4gZXhpc3Rpbmcgc2hhZG93LCBvciB3aXRoaW4gYSBzdGFydGluZyBib3VuZGFyeSAqL1xuICAgICAgICAgICAgd2hpbGUgKGluZGV4IDwgREFUQS5sZW5ndGggJiYgREFUQVtpbmRleF0gPCBCKSB7XG4gICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogdmlzaWJsZSB3aGVuIG91dHNpZGUgYW4gZXhpc3Rpbmcgc2hhZG93LCBvciB3aGVuIG92ZXJsYXBwaW5nICovXG4gICAgICAgICAgICBpZiAoQSA9PSBEQVRBW2luZGV4IC0gY291bnRdICYmIGNvdW50ID09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ICUgMikge1xuICAgICAgICAgICAgICAgICAgICBEQVRBLnNwbGljZShpbmRleCAtIGNvdW50LCBjb3VudCwgQSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBEQVRBLnNwbGljZShpbmRleCAtIGNvdW50LCBjb3VudCwgQSwgQik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgRk9WIGZyb20gXCIuL2Zvdi5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgUHJlY2lzZSBzaGFkb3djYXN0aW5nIGFsZ29yaXRobVxuICogQGF1Z21lbnRzIFJPVC5GT1ZcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlY2lzZVNoYWRvd2Nhc3RpbmcgZXh0ZW5kcyBGT1Yge1xuICAgIGNvbXB1dGUoeCwgeSwgUiwgY2FsbGJhY2spIHtcbiAgICAgICAgLyogdGhpcyBwbGFjZSBpcyBhbHdheXMgdmlzaWJsZSAqL1xuICAgICAgICBjYWxsYmFjayh4LCB5LCAwLCAxKTtcbiAgICAgICAgLyogc3RhbmRpbmcgaW4gYSBkYXJrIHBsYWNlLiBGSVhNRSBpcyB0aGlzIGEgZ29vZCBpZGVhPyAgKi9cbiAgICAgICAgaWYgKCF0aGlzLl9saWdodFBhc3Nlcyh4LCB5KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8qIGxpc3Qgb2YgYWxsIHNoYWRvd3MgKi9cbiAgICAgICAgbGV0IFNIQURPV1MgPSBbXTtcbiAgICAgICAgbGV0IGN4LCBjeSwgYmxvY2tzLCBBMSwgQTIsIHZpc2liaWxpdHk7XG4gICAgICAgIC8qIGFuYWx5emUgc3Vycm91bmRpbmcgY2VsbHMgaW4gY29uY2VudHJpYyByaW5ncywgc3RhcnRpbmcgZnJvbSB0aGUgY2VudGVyICovXG4gICAgICAgIGZvciAobGV0IHIgPSAxOyByIDw9IFI7IHIrKykge1xuICAgICAgICAgICAgbGV0IG5laWdoYm9ycyA9IHRoaXMuX2dldENpcmNsZSh4LCB5LCByKTtcbiAgICAgICAgICAgIGxldCBuZWlnaGJvckNvdW50ID0gbmVpZ2hib3JzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmVpZ2hib3JDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3ggPSBuZWlnaGJvcnNbaV1bMF07XG4gICAgICAgICAgICAgICAgY3kgPSBuZWlnaGJvcnNbaV1bMV07XG4gICAgICAgICAgICAgICAgLyogc2hpZnQgaGFsZi1hbi1hbmdsZSBiYWNrd2FyZHMgdG8gbWFpbnRhaW4gY29uc2lzdGVuY3kgb2YgMC10aCBjZWxscyAqL1xuICAgICAgICAgICAgICAgIEExID0gW2kgPyAyICogaSAtIDEgOiAyICogbmVpZ2hib3JDb3VudCAtIDEsIDIgKiBuZWlnaGJvckNvdW50XTtcbiAgICAgICAgICAgICAgICBBMiA9IFsyICogaSArIDEsIDIgKiBuZWlnaGJvckNvdW50XTtcbiAgICAgICAgICAgICAgICBibG9ja3MgPSAhdGhpcy5fbGlnaHRQYXNzZXMoY3gsIGN5KTtcbiAgICAgICAgICAgICAgICB2aXNpYmlsaXR5ID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KEExLCBBMiwgYmxvY2tzLCBTSEFET1dTKTtcbiAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhjeCwgY3ksIHIsIHZpc2liaWxpdHkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoU0hBRE9XUy5sZW5ndGggPT0gMiAmJiBTSEFET1dTWzBdWzBdID09IDAgJiYgU0hBRE9XU1sxXVswXSA9PSBTSEFET1dTWzFdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IC8qIGN1dG9mZj8gKi9cbiAgICAgICAgICAgIH0gLyogZm9yIGFsbCBjZWxscyBpbiB0aGlzIHJpbmcgKi9cbiAgICAgICAgfSAvKiBmb3IgYWxsIHJpbmdzICovXG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7aW50WzJdfSBBMSBhcmMgc3RhcnRcbiAgICAgKiBAcGFyYW0ge2ludFsyXX0gQTIgYXJjIGVuZFxuICAgICAqIEBwYXJhbSB7Ym9vbH0gYmxvY2tzIERvZXMgY3VycmVudCBhcmMgYmxvY2sgdmlzaWJpbGl0eT9cbiAgICAgKiBAcGFyYW0ge2ludFtdW119IFNIQURPV1MgbGlzdCBvZiBhY3RpdmUgc2hhZG93c1xuICAgICAqL1xuICAgIF9jaGVja1Zpc2liaWxpdHkoQTEsIEEyLCBibG9ja3MsIFNIQURPV1MpIHtcbiAgICAgICAgaWYgKEExWzBdID4gQTJbMF0pIHsgLyogc3BsaXQgaW50byB0d28gc3ViLWFyY3MgKi9cbiAgICAgICAgICAgIGxldCB2MSA9IHRoaXMuX2NoZWNrVmlzaWJpbGl0eShBMSwgW0ExWzFdLCBBMVsxXV0sIGJsb2NrcywgU0hBRE9XUyk7XG4gICAgICAgICAgICBsZXQgdjIgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoWzAsIDFdLCBBMiwgYmxvY2tzLCBTSEFET1dTKTtcbiAgICAgICAgICAgIHJldHVybiAodjEgKyB2MikgLyAyO1xuICAgICAgICB9XG4gICAgICAgIC8qIGluZGV4MTogZmlyc3Qgc2hhZG93ID49IEExICovXG4gICAgICAgIGxldCBpbmRleDEgPSAwLCBlZGdlMSA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAoaW5kZXgxIDwgU0hBRE9XUy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBvbGQgPSBTSEFET1dTW2luZGV4MV07XG4gICAgICAgICAgICBsZXQgZGlmZiA9IG9sZFswXSAqIEExWzFdIC0gQTFbMF0gKiBvbGRbMV07XG4gICAgICAgICAgICBpZiAoZGlmZiA+PSAwKSB7IC8qIG9sZCA+PSBBMSAqL1xuICAgICAgICAgICAgICAgIGlmIChkaWZmID09IDAgJiYgIShpbmRleDEgJSAyKSkge1xuICAgICAgICAgICAgICAgICAgICBlZGdlMSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5kZXgxKys7XG4gICAgICAgIH1cbiAgICAgICAgLyogaW5kZXgyOiBsYXN0IHNoYWRvdyA8PSBBMiAqL1xuICAgICAgICBsZXQgaW5kZXgyID0gU0hBRE9XUy5sZW5ndGgsIGVkZ2UyID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChpbmRleDItLSkge1xuICAgICAgICAgICAgbGV0IG9sZCA9IFNIQURPV1NbaW5kZXgyXTtcbiAgICAgICAgICAgIGxldCBkaWZmID0gQTJbMF0gKiBvbGRbMV0gLSBvbGRbMF0gKiBBMlsxXTtcbiAgICAgICAgICAgIGlmIChkaWZmID49IDApIHsgLyogb2xkIDw9IEEyICovXG4gICAgICAgICAgICAgICAgaWYgKGRpZmYgPT0gMCAmJiAoaW5kZXgyICUgMikpIHtcbiAgICAgICAgICAgICAgICAgICAgZWRnZTIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgdmlzaWJsZSA9IHRydWU7XG4gICAgICAgIGlmIChpbmRleDEgPT0gaW5kZXgyICYmIChlZGdlMSB8fCBlZGdlMikpIHsgLyogc3Vic2V0IG9mIGV4aXN0aW5nIHNoYWRvdywgb25lIG9mIHRoZSBlZGdlcyBtYXRjaCAqL1xuICAgICAgICAgICAgdmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGVkZ2UxICYmIGVkZ2UyICYmIGluZGV4MSArIDEgPT0gaW5kZXgyICYmIChpbmRleDIgJSAyKSkgeyAvKiBjb21wbGV0ZWx5IGVxdWl2YWxlbnQgd2l0aCBleGlzdGluZyBzaGFkb3cgKi9cbiAgICAgICAgICAgIHZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbmRleDEgPiBpbmRleDIgJiYgKGluZGV4MSAlIDIpKSB7IC8qIHN1YnNldCBvZiBleGlzdGluZyBzaGFkb3csIG5vdCB0b3VjaGluZyAqL1xuICAgICAgICAgICAgdmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmlzaWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gLyogZmFzdCBjYXNlOiBub3QgdmlzaWJsZSAqL1xuICAgICAgICBsZXQgdmlzaWJsZUxlbmd0aDtcbiAgICAgICAgLyogY29tcHV0ZSB0aGUgbGVuZ3RoIG9mIHZpc2libGUgYXJjLCBhZGp1c3QgbGlzdCBvZiBzaGFkb3dzIChpZiBibG9ja2luZykgKi9cbiAgICAgICAgbGV0IHJlbW92ZSA9IGluZGV4MiAtIGluZGV4MSArIDE7XG4gICAgICAgIGlmIChyZW1vdmUgJSAyKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXgxICUgMikgeyAvKiBmaXJzdCBlZGdlIHdpdGhpbiBleGlzdGluZyBzaGFkb3csIHNlY29uZCBvdXRzaWRlICovXG4gICAgICAgICAgICAgICAgbGV0IFAgPSBTSEFET1dTW2luZGV4MV07XG4gICAgICAgICAgICAgICAgdmlzaWJsZUxlbmd0aCA9IChBMlswXSAqIFBbMV0gLSBQWzBdICogQTJbMV0pIC8gKFBbMV0gKiBBMlsxXSk7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2Nrcykge1xuICAgICAgICAgICAgICAgICAgICBTSEFET1dTLnNwbGljZShpbmRleDEsIHJlbW92ZSwgQTIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyAvKiBzZWNvbmQgZWRnZSB3aXRoaW4gZXhpc3Rpbmcgc2hhZG93LCBmaXJzdCBvdXRzaWRlICovXG4gICAgICAgICAgICAgICAgbGV0IFAgPSBTSEFET1dTW2luZGV4Ml07XG4gICAgICAgICAgICAgICAgdmlzaWJsZUxlbmd0aCA9IChQWzBdICogQTFbMV0gLSBBMVswXSAqIFBbMV0pIC8gKEExWzFdICogUFsxXSk7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2Nrcykge1xuICAgICAgICAgICAgICAgICAgICBTSEFET1dTLnNwbGljZShpbmRleDEsIHJlbW92ZSwgQTEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpbmRleDEgJSAyKSB7IC8qIGJvdGggZWRnZXMgd2l0aGluIGV4aXN0aW5nIHNoYWRvd3MgKi9cbiAgICAgICAgICAgICAgICBsZXQgUDEgPSBTSEFET1dTW2luZGV4MV07XG4gICAgICAgICAgICAgICAgbGV0IFAyID0gU0hBRE9XU1tpbmRleDJdO1xuICAgICAgICAgICAgICAgIHZpc2libGVMZW5ndGggPSAoUDJbMF0gKiBQMVsxXSAtIFAxWzBdICogUDJbMV0pIC8gKFAxWzFdICogUDJbMV0pO1xuICAgICAgICAgICAgICAgIGlmIChibG9ja3MpIHtcbiAgICAgICAgICAgICAgICAgICAgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyAvKiBib3RoIGVkZ2VzIG91dHNpZGUgZXhpc3Rpbmcgc2hhZG93cyAqL1xuICAgICAgICAgICAgICAgIGlmIChibG9ja3MpIHtcbiAgICAgICAgICAgICAgICAgICAgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUsIEExLCBBMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAxOyAvKiB3aG9sZSBhcmMgdmlzaWJsZSEgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgYXJjTGVuZ3RoID0gKEEyWzBdICogQTFbMV0gLSBBMVswXSAqIEEyWzFdKSAvIChBMVsxXSAqIEEyWzFdKTtcbiAgICAgICAgcmV0dXJuIHZpc2libGVMZW5ndGggLyBhcmNMZW5ndGg7XG4gICAgfVxufVxuIiwiaW1wb3J0IEZPViBmcm9tIFwiLi9mb3YuanNcIjtcbi8qKiBPY3RhbnRzIHVzZWQgZm9yIHRyYW5zbGF0aW5nIHJlY3Vyc2l2ZSBzaGFkb3djYXN0aW5nIG9mZnNldHMgKi9cbmNvbnN0IE9DVEFOVFMgPSBbXG4gICAgWy0xLCAwLCAwLCAxXSxcbiAgICBbMCwgLTEsIDEsIDBdLFxuICAgIFswLCAtMSwgLTEsIDBdLFxuICAgIFstMSwgMCwgMCwgLTFdLFxuICAgIFsxLCAwLCAwLCAtMV0sXG4gICAgWzAsIDEsIC0xLCAwXSxcbiAgICBbMCwgMSwgMSwgMF0sXG4gICAgWzEsIDAsIDAsIDFdXG5dO1xuLyoqXG4gKiBAY2xhc3MgUmVjdXJzaXZlIHNoYWRvd2Nhc3RpbmcgYWxnb3JpdGhtXG4gKiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyA0LzggdG9wb2xvZ2llcywgbm90IGhleGFnb25hbC5cbiAqIEJhc2VkIG9uIFBldGVyIEhhcmtpbnMnIGltcGxlbWVudGF0aW9uIG9mIEJqw7ZybiBCZXJnc3Ryw7ZtJ3MgYWxnb3JpdGhtIGRlc2NyaWJlZCBoZXJlOiBodHRwOi8vd3d3LnJvZ3VlYmFzaW4uY29tL2luZGV4LnBocD90aXRsZT1GT1ZfdXNpbmdfcmVjdXJzaXZlX3NoYWRvd2Nhc3RpbmdcbiAqIEBhdWdtZW50cyBST1QuRk9WXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcgZXh0ZW5kcyBGT1Yge1xuICAgIC8qKlxuICAgICAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSAzNjAtZGVncmVlIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7aW50fSB4XG4gICAgICogQHBhcmFtIHtpbnR9IHlcbiAgICAgKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBjb21wdXRlKHgsIHksIFIsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcbiAgICAgICAgY2FsbGJhY2soeCwgeSwgMCwgMSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgT0NUQU5UUy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIE9DVEFOVFNbaV0sIFIsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgMTgwLWRlZ3JlZSBhcmNcbiAgICAgKiBAcGFyYW0ge2ludH0geFxuICAgICAqIEBwYXJhbSB7aW50fSB5XG4gICAgICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7aW50fSBkaXIgRGlyZWN0aW9uIHRvIGxvb2sgaW4gKGV4cHJlc3NlZCBpbiBhIFJPVC5ESVJTIHZhbHVlKTtcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqL1xuICAgIGNvbXB1dGUxODAoeCwgeSwgUiwgZGlyLCBjYWxsYmFjaykge1xuICAgICAgICAvL1lvdSBjYW4gYWx3YXlzIHNlZSB5b3VyIG93biB0aWxlXG4gICAgICAgIGNhbGxiYWNrKHgsIHksIDAsIDEpO1xuICAgICAgICBsZXQgcHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMSArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyBvY3RhbnQgdG8gcmVuZGVyIGEgZnVsbCAxODAgZGVncmVlc1xuICAgICAgICBsZXQgbmV4dFByZXZpb3VzT2N0YW50ID0gKGRpciAtIDIgKyA4KSAlIDg7IC8vTmVlZCB0byByZXRyaWV2ZSB0aGUgcHJldmlvdXMgdHdvIG9jdGFudHMgdG8gcmVuZGVyIGEgZnVsbCAxODAgZGVncmVlc1xuICAgICAgICBsZXQgbmV4dE9jdGFudCA9IChkaXIgKyAxICsgOCkgJSA4OyAvL05lZWQgdG8gZ3JhYiB0byBuZXh0IG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXG4gICAgICAgIHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBPQ1RBTlRTW25leHRQcmV2aW91c09jdGFudF0sIFIsIGNhbGxiYWNrKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIE9DVEFOVFNbcHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XG4gICAgICAgIHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBPQ1RBTlRTW2Rpcl0sIFIsIGNhbGxiYWNrKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIE9DVEFOVFNbbmV4dE9jdGFudF0sIFIsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgO1xuICAgIC8qKlxuICAgICAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSA5MC1kZWdyZWUgYXJjXG4gICAgICogQHBhcmFtIHtpbnR9IHhcbiAgICAgKiBAcGFyYW0ge2ludH0geVxuICAgICAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcbiAgICAgKiBAcGFyYW0ge2ludH0gZGlyIERpcmVjdGlvbiB0byBsb29rIGluIChleHByZXNzZWQgaW4gYSBST1QuRElSUyB2YWx1ZSk7XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBjb21wdXRlOTAoeCwgeSwgUiwgZGlyLCBjYWxsYmFjaykge1xuICAgICAgICAvL1lvdSBjYW4gYWx3YXlzIHNlZSB5b3VyIG93biB0aWxlXG4gICAgICAgIGNhbGxiYWNrKHgsIHksIDAsIDEpO1xuICAgICAgICBsZXQgcHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMSArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyBvY3RhbnQgdG8gcmVuZGVyIGEgZnVsbCA5MCBkZWdyZWVzXG4gICAgICAgIHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBPQ1RBTlRTW2Rpcl0sIFIsIGNhbGxiYWNrKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIE9DVEFOVFNbcHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbmRlciBvbmUgb2N0YW50ICg0NS1kZWdyZWUgYXJjKSBvZiB0aGUgdmlld3NoZWRcbiAgICAgKiBAcGFyYW0ge2ludH0geFxuICAgICAqIEBwYXJhbSB7aW50fSB5XG4gICAgICogQHBhcmFtIHtpbnR9IG9jdGFudCBPY3RhbnQgdG8gYmUgcmVuZGVyZWRcbiAgICAgKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBfcmVuZGVyT2N0YW50KHgsIHksIG9jdGFudCwgUiwgY2FsbGJhY2spIHtcbiAgICAgICAgLy9SYWRpdXMgaW5jcmVtZW50ZWQgYnkgMSB0byBwcm92aWRlIHNhbWUgY292ZXJhZ2UgYXJlYSBhcyBvdGhlciBzaGFkb3djYXN0aW5nIHJhZGl1c2VzXG4gICAgICAgIHRoaXMuX2Nhc3RWaXNpYmlsaXR5KHgsIHksIDEsIDEuMCwgMC4wLCBSICsgMSwgb2N0YW50WzBdLCBvY3RhbnRbMV0sIG9jdGFudFsyXSwgb2N0YW50WzNdLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFjdHVhbGx5IGNhbGN1bGF0ZXMgdGhlIHZpc2liaWxpdHlcbiAgICAgKiBAcGFyYW0ge2ludH0gc3RhcnRYIFRoZSBzdGFydGluZyBYIGNvb3JkaW5hdGVcbiAgICAgKiBAcGFyYW0ge2ludH0gc3RhcnRZIFRoZSBzdGFydGluZyBZIGNvb3JkaW5hdGVcbiAgICAgKiBAcGFyYW0ge2ludH0gcm93IFRoZSByb3cgdG8gcmVuZGVyXG4gICAgICogQHBhcmFtIHtmbG9hdH0gdmlzU2xvcGVTdGFydCBUaGUgc2xvcGUgdG8gc3RhcnQgYXRcbiAgICAgKiBAcGFyYW0ge2Zsb2F0fSB2aXNTbG9wZUVuZCBUaGUgc2xvcGUgdG8gZW5kIGF0XG4gICAgICogQHBhcmFtIHtpbnR9IHJhZGl1cyBUaGUgcmFkaXVzIHRvIHJlYWNoIG91dCB0b1xuICAgICAqIEBwYXJhbSB7aW50fSB4eFxuICAgICAqIEBwYXJhbSB7aW50fSB4eVxuICAgICAqIEBwYXJhbSB7aW50fSB5eFxuICAgICAqIEBwYXJhbSB7aW50fSB5eVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byB1c2Ugd2hlbiB3ZSBoaXQgYSBibG9jayB0aGF0IGlzIHZpc2libGVcbiAgICAgKi9cbiAgICBfY2FzdFZpc2liaWxpdHkoc3RhcnRYLCBzdGFydFksIHJvdywgdmlzU2xvcGVTdGFydCwgdmlzU2xvcGVFbmQsIHJhZGl1cywgeHgsIHh5LCB5eCwgeXksIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh2aXNTbG9wZVN0YXJ0IDwgdmlzU2xvcGVFbmQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gcm93OyBpIDw9IHJhZGl1czsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZHggPSAtaSAtIDE7XG4gICAgICAgICAgICBsZXQgZHkgPSAtaTtcbiAgICAgICAgICAgIGxldCBibG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgbmV3U3RhcnQgPSAwO1xuICAgICAgICAgICAgLy8nUm93JyBjb3VsZCBiZSBjb2x1bW4sIG5hbWVzIGhlcmUgYXNzdW1lIG9jdGFudCAwIGFuZCB3b3VsZCBiZSBmbGlwcGVkIGZvciBoYWxmIHRoZSBvY3RhbnRzXG4gICAgICAgICAgICB3aGlsZSAoZHggPD0gMCkge1xuICAgICAgICAgICAgICAgIGR4ICs9IDE7XG4gICAgICAgICAgICAgICAgLy9UcmFuc2xhdGUgZnJvbSByZWxhdGl2ZSBjb29yZGluYXRlcyB0byBtYXAgY29vcmRpbmF0ZXNcbiAgICAgICAgICAgICAgICBsZXQgbWFwWCA9IHN0YXJ0WCArIGR4ICogeHggKyBkeSAqIHh5O1xuICAgICAgICAgICAgICAgIGxldCBtYXBZID0gc3RhcnRZICsgZHggKiB5eCArIGR5ICogeXk7XG4gICAgICAgICAgICAgICAgLy9SYW5nZSBvZiB0aGUgcm93XG4gICAgICAgICAgICAgICAgbGV0IHNsb3BlU3RhcnQgPSAoZHggLSAwLjUpIC8gKGR5ICsgMC41KTtcbiAgICAgICAgICAgICAgICBsZXQgc2xvcGVFbmQgPSAoZHggKyAwLjUpIC8gKGR5IC0gMC41KTtcbiAgICAgICAgICAgICAgICAvL0lnbm9yZSBpZiBub3QgeWV0IGF0IGxlZnQgZWRnZSBvZiBPY3RhbnRcbiAgICAgICAgICAgICAgICBpZiAoc2xvcGVFbmQgPiB2aXNTbG9wZVN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL0RvbmUgaWYgcGFzdCByaWdodCBlZGdlXG4gICAgICAgICAgICAgICAgaWYgKHNsb3BlU3RhcnQgPCB2aXNTbG9wZUVuZCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9JZiBpdCdzIGluIHJhbmdlLCBpdCdzIHZpc2libGVcbiAgICAgICAgICAgICAgICBpZiAoKGR4ICogZHggKyBkeSAqIGR5KSA8IChyYWRpdXMgKiByYWRpdXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG1hcFgsIG1hcFksIGksIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWJsb2NrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9JZiB0aWxlIGlzIGEgYmxvY2tpbmcgdGlsZSwgY2FzdCBhcm91bmQgaXRcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9saWdodFBhc3NlcyhtYXBYLCBtYXBZKSAmJiBpIDwgcmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nhc3RWaXNpYmlsaXR5KHN0YXJ0WCwgc3RhcnRZLCBpICsgMSwgdmlzU2xvcGVTdGFydCwgc2xvcGVTdGFydCwgcmFkaXVzLCB4eCwgeHksIHl4LCB5eSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RhcnQgPSBzbG9wZUVuZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9LZWVwIG5hcnJvd2luZyBpZiBzY2FubmluZyBhY3Jvc3MgYSBibG9ja1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2xpZ2h0UGFzc2VzKG1hcFgsIG1hcFkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHNsb3BlRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy9CbG9jayBoYXMgZW5kZWRcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB2aXNTbG9wZVN0YXJ0ID0gbmV3U3RhcnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJsb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCBEaXNjcmV0ZVNoYWRvd2Nhc3RpbmcgZnJvbSBcIi4vZGlzY3JldGUtc2hhZG93Y2FzdGluZy5qc1wiO1xuaW1wb3J0IFByZWNpc2VTaGFkb3djYXN0aW5nIGZyb20gXCIuL3ByZWNpc2Utc2hhZG93Y2FzdGluZy5qc1wiO1xuaW1wb3J0IFJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcgZnJvbSBcIi4vcmVjdXJzaXZlLXNoYWRvd2Nhc3RpbmcuanNcIjtcbmV4cG9ydCBkZWZhdWx0IHsgRGlzY3JldGVTaGFkb3djYXN0aW5nLCBQcmVjaXNlU2hhZG93Y2FzdGluZywgUmVjdXJzaXZlU2hhZG93Y2FzdGluZyB9O1xuIiwiaW1wb3J0IHsgREVGQVVMVF9XSURUSCwgREVGQVVMVF9IRUlHSFQgfSBmcm9tIFwiLi4vY29uc3RhbnRzLmpzXCI7XG47XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXAge1xuICAgIC8qKlxuICAgICAqIEBjbGFzcyBCYXNlIG1hcCBnZW5lcmF0b3JcbiAgICAgKiBAcGFyYW0ge2ludH0gW3dpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxuICAgICAqIEBwYXJhbSB7aW50fSBbaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih3aWR0aCA9IERFRkFVTFRfV0lEVEgsIGhlaWdodCA9IERFRkFVTFRfSEVJR0hUKSB7XG4gICAgICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcbiAgICB9XG4gICAgO1xuICAgIF9maWxsTWFwKHZhbHVlKSB7XG4gICAgICAgIGxldCBtYXAgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl93aWR0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYXAucHVzaChbXSk7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbWFwW2ldLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfVxufVxuIiwiaW1wb3J0IE1hcCBmcm9tIFwiLi9tYXAuanNcIjtcbi8qKlxuICogQGNsYXNzIFNpbXBsZSBlbXB0eSByZWN0YW5ndWxhciByb29tXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcmVuYSBleHRlbmRzIE1hcCB7XG4gICAgY3JlYXRlKGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCB3ID0gdGhpcy5fd2lkdGggLSAxO1xuICAgICAgICBsZXQgaCA9IHRoaXMuX2hlaWdodCAtIDE7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHc7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPD0gaDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVtcHR5ID0gKGkgJiYgaiAmJiBpIDwgdyAmJiBqIDwgaCk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soaSwgaiwgZW1wdHkgPyAwIDogMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IE1hcCBmcm9tIFwiLi9tYXAuanNcIjtcbi8qKlxuICogQGNsYXNzIER1bmdlb24gbWFwOiBoYXMgcm9vbXMgYW5kIGNvcnJpZG9yc1xuICogQGF1Z21lbnRzIFJPVC5NYXBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHVuZ2VvbiBleHRlbmRzIE1hcCB7XG4gICAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuICAgICAgICBzdXBlcih3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fcm9vbXMgPSBbXTtcbiAgICAgICAgdGhpcy5fY29ycmlkb3JzID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBhbGwgZ2VuZXJhdGVkIHJvb21zXG4gICAgICogQHJldHVybnMge1JPVC5NYXAuRmVhdHVyZS5Sb29tW119XG4gICAgICovXG4gICAgZ2V0Um9vbXMoKSB7IHJldHVybiB0aGlzLl9yb29tczsgfVxuICAgIC8qKlxuICAgICAqIEdldCBhbGwgZ2VuZXJhdGVkIGNvcnJpZG9yc1xuICAgICAqIEByZXR1cm5zIHtST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3JbXX1cbiAgICAgKi9cbiAgICBnZXRDb3JyaWRvcnMoKSB7IHJldHVybiB0aGlzLl9jb3JyaWRvcnM7IH1cbn1cbiIsImltcG9ydCBSTkcgZnJvbSBcIi4uL3JuZy5qc1wiO1xuO1xuLyoqXG4gKiBAY2xhc3MgRHVuZ2VvbiBmZWF0dXJlOyBoYXMgb3duIC5jcmVhdGUoKSBtZXRob2RcbiAqL1xuY2xhc3MgRmVhdHVyZSB7XG59XG4vKipcbiAqIEBjbGFzcyBSb29tXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5GZWF0dXJlXG4gKiBAcGFyYW0ge2ludH0geDFcbiAqIEBwYXJhbSB7aW50fSB5MVxuICogQHBhcmFtIHtpbnR9IHgyXG4gKiBAcGFyYW0ge2ludH0geTJcbiAqIEBwYXJhbSB7aW50fSBbZG9vclhdXG4gKiBAcGFyYW0ge2ludH0gW2Rvb3JZXVxuICovXG5leHBvcnQgY2xhc3MgUm9vbSBleHRlbmRzIEZlYXR1cmUge1xuICAgIGNvbnN0cnVjdG9yKHgxLCB5MSwgeDIsIHkyLCBkb29yWCwgZG9vclkpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5feDEgPSB4MTtcbiAgICAgICAgdGhpcy5feTEgPSB5MTtcbiAgICAgICAgdGhpcy5feDIgPSB4MjtcbiAgICAgICAgdGhpcy5feTIgPSB5MjtcbiAgICAgICAgdGhpcy5fZG9vcnMgPSB7fTtcbiAgICAgICAgaWYgKGRvb3JYICE9PSB1bmRlZmluZWQgJiYgZG9vclkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hZGREb29yKGRvb3JYLCBkb29yWSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgO1xuICAgIC8qKlxuICAgICAqIFJvb20gb2YgcmFuZG9tIHNpemUsIHdpdGggYSBnaXZlbiBkb29ycyBhbmQgZGlyZWN0aW9uXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZVJhbmRvbUF0KHgsIHksIGR4LCBkeSwgb3B0aW9ucykge1xuICAgICAgICBsZXQgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XG4gICAgICAgIGxldCBtYXggPSBvcHRpb25zLnJvb21XaWR0aFsxXTtcbiAgICAgICAgbGV0IHdpZHRoID0gUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xuICAgICAgICBtaW4gPSBvcHRpb25zLnJvb21IZWlnaHRbMF07XG4gICAgICAgIG1heCA9IG9wdGlvbnMucm9vbUhlaWdodFsxXTtcbiAgICAgICAgbGV0IGhlaWdodCA9IFJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcbiAgICAgICAgaWYgKGR4ID09IDEpIHsgLyogdG8gdGhlIHJpZ2h0ICovXG4gICAgICAgICAgICBsZXQgeTIgPSB5IC0gTWF0aC5mbG9vcihSTkcuZ2V0VW5pZm9ybSgpICogaGVpZ2h0KTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyh4ICsgMSwgeTIsIHggKyB3aWR0aCwgeTIgKyBoZWlnaHQgLSAxLCB4LCB5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHggPT0gLTEpIHsgLyogdG8gdGhlIGxlZnQgKi9cbiAgICAgICAgICAgIGxldCB5MiA9IHkgLSBNYXRoLmZsb29yKFJORy5nZXRVbmlmb3JtKCkgKiBoZWlnaHQpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKHggLSB3aWR0aCwgeTIsIHggLSAxLCB5MiArIGhlaWdodCAtIDEsIHgsIHkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSA9PSAxKSB7IC8qIHRvIHRoZSBib3R0b20gKi9cbiAgICAgICAgICAgIGxldCB4MiA9IHggLSBNYXRoLmZsb29yKFJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoeDIsIHkgKyAxLCB4MiArIHdpZHRoIC0gMSwgeSArIGhlaWdodCwgeCwgeSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR5ID09IC0xKSB7IC8qIHRvIHRoZSB0b3AgKi9cbiAgICAgICAgICAgIGxldCB4MiA9IHggLSBNYXRoLmZsb29yKFJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoeDIsIHkgLSBoZWlnaHQsIHgyICsgd2lkdGggLSAxLCB5IC0gMSwgeCwgeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZHggb3IgZHkgbXVzdCBiZSAxIG9yIC0xXCIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb29tIG9mIHJhbmRvbSBzaXplLCBwb3NpdGlvbmVkIGFyb3VuZCBjZW50ZXIgY29vcmRzXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZVJhbmRvbUNlbnRlcihjeCwgY3ksIG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IG1pbiA9IG9wdGlvbnMucm9vbVdpZHRoWzBdO1xuICAgICAgICBsZXQgbWF4ID0gb3B0aW9ucy5yb29tV2lkdGhbMV07XG4gICAgICAgIGxldCB3aWR0aCA9IFJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcbiAgICAgICAgbWluID0gb3B0aW9ucy5yb29tSGVpZ2h0WzBdO1xuICAgICAgICBtYXggPSBvcHRpb25zLnJvb21IZWlnaHRbMV07XG4gICAgICAgIGxldCBoZWlnaHQgPSBSTkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XG4gICAgICAgIGxldCB4MSA9IGN4IC0gTWF0aC5mbG9vcihSTkcuZ2V0VW5pZm9ybSgpICogd2lkdGgpO1xuICAgICAgICBsZXQgeTEgPSBjeSAtIE1hdGguZmxvb3IoUk5HLmdldFVuaWZvcm0oKSAqIGhlaWdodCk7XG4gICAgICAgIGxldCB4MiA9IHgxICsgd2lkdGggLSAxO1xuICAgICAgICBsZXQgeTIgPSB5MSArIGhlaWdodCAtIDE7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcyh4MSwgeTEsIHgyLCB5Mik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJvb20gb2YgcmFuZG9tIHNpemUgd2l0aGluIGEgZ2l2ZW4gZGltZW5zaW9uc1xuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVSYW5kb20oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQsIG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IG1pbiA9IG9wdGlvbnMucm9vbVdpZHRoWzBdO1xuICAgICAgICBsZXQgbWF4ID0gb3B0aW9ucy5yb29tV2lkdGhbMV07XG4gICAgICAgIGxldCB3aWR0aCA9IFJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcbiAgICAgICAgbWluID0gb3B0aW9ucy5yb29tSGVpZ2h0WzBdO1xuICAgICAgICBtYXggPSBvcHRpb25zLnJvb21IZWlnaHRbMV07XG4gICAgICAgIGxldCBoZWlnaHQgPSBSTkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XG4gICAgICAgIGxldCBsZWZ0ID0gYXZhaWxXaWR0aCAtIHdpZHRoIC0gMTtcbiAgICAgICAgbGV0IHRvcCA9IGF2YWlsSGVpZ2h0IC0gaGVpZ2h0IC0gMTtcbiAgICAgICAgbGV0IHgxID0gMSArIE1hdGguZmxvb3IoUk5HLmdldFVuaWZvcm0oKSAqIGxlZnQpO1xuICAgICAgICBsZXQgeTEgPSAxICsgTWF0aC5mbG9vcihSTkcuZ2V0VW5pZm9ybSgpICogdG9wKTtcbiAgICAgICAgbGV0IHgyID0geDEgKyB3aWR0aCAtIDE7XG4gICAgICAgIGxldCB5MiA9IHkxICsgaGVpZ2h0IC0gMTtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzKHgxLCB5MSwgeDIsIHkyKTtcbiAgICB9XG4gICAgYWRkRG9vcih4LCB5KSB7XG4gICAgICAgIHRoaXMuX2Rvb3JzW3ggKyBcIixcIiArIHldID0gMTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259XG4gICAgICovXG4gICAgZ2V0RG9vcnMoY2IpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2Rvb3JzKSB7XG4gICAgICAgICAgICBsZXQgcGFydHMgPSBrZXkuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgY2IocGFyc2VJbnQocGFydHNbMF0pLCBwYXJzZUludChwYXJ0c1sxXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBjbGVhckRvb3JzKCkge1xuICAgICAgICB0aGlzLl9kb29ycyA9IHt9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgYWRkRG9vcnMoaXNXYWxsQ2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGxlZnQgPSB0aGlzLl94MSAtIDE7XG4gICAgICAgIGxldCByaWdodCA9IHRoaXMuX3gyICsgMTtcbiAgICAgICAgbGV0IHRvcCA9IHRoaXMuX3kxIC0gMTtcbiAgICAgICAgbGV0IGJvdHRvbSA9IHRoaXMuX3kyICsgMTtcbiAgICAgICAgZm9yIChsZXQgeCA9IGxlZnQ7IHggPD0gcmlnaHQ7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHRvcDsgeSA8PSBib3R0b207IHkrKykge1xuICAgICAgICAgICAgICAgIGlmICh4ICE9IGxlZnQgJiYgeCAhPSByaWdodCAmJiB5ICE9IHRvcCAmJiB5ICE9IGJvdHRvbSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlzV2FsbENhbGxiYWNrKHgsIHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmFkZERvb3IoeCwgeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRlYnVnKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInJvb21cIiwgdGhpcy5feDEsIHRoaXMuX3kxLCB0aGlzLl94MiwgdGhpcy5feTIpO1xuICAgIH1cbiAgICBpc1ZhbGlkKGlzV2FsbENhbGxiYWNrLCBjYW5CZUR1Z0NhbGxiYWNrKSB7XG4gICAgICAgIGxldCBsZWZ0ID0gdGhpcy5feDEgLSAxO1xuICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLl94MiArIDE7XG4gICAgICAgIGxldCB0b3AgPSB0aGlzLl95MSAtIDE7XG4gICAgICAgIGxldCBib3R0b20gPSB0aGlzLl95MiArIDE7XG4gICAgICAgIGZvciAobGV0IHggPSBsZWZ0OyB4IDw9IHJpZ2h0OyB4KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSB0b3A7IHkgPD0gYm90dG9tOyB5KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoeCA9PSBsZWZ0IHx8IHggPT0gcmlnaHQgfHwgeSA9PSB0b3AgfHwgeSA9PSBib3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1dhbGxDYWxsYmFjayh4LCB5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNhbkJlRHVnQ2FsbGJhY2soeCwgeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZGlnQ2FsbGJhY2sgRGlnIGNhbGxiYWNrIHdpdGggYSBzaWduYXR1cmUgKHgsIHksIHZhbHVlKS4gVmFsdWVzOiAwID0gZW1wdHksIDEgPSB3YWxsLCAyID0gZG9vci4gTXVsdGlwbGUgZG9vcnMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgY3JlYXRlKGRpZ0NhbGxiYWNrKSB7XG4gICAgICAgIGxldCBsZWZ0ID0gdGhpcy5feDEgLSAxO1xuICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLl94MiArIDE7XG4gICAgICAgIGxldCB0b3AgPSB0aGlzLl95MSAtIDE7XG4gICAgICAgIGxldCBib3R0b20gPSB0aGlzLl95MiArIDE7XG4gICAgICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgICAgIGZvciAobGV0IHggPSBsZWZ0OyB4IDw9IHJpZ2h0OyB4KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSB0b3A7IHkgPD0gYm90dG9tOyB5KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoeCArIFwiLFwiICsgeSBpbiB0aGlzLl9kb29ycykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHggPT0gbGVmdCB8fCB4ID09IHJpZ2h0IHx8IHkgPT0gdG9wIHx8IHkgPT0gYm90dG9tKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGlnQ2FsbGJhY2soeCwgeSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGdldENlbnRlcigpIHtcbiAgICAgICAgcmV0dXJuIFtNYXRoLnJvdW5kKCh0aGlzLl94MSArIHRoaXMuX3gyKSAvIDIpLCBNYXRoLnJvdW5kKCh0aGlzLl95MSArIHRoaXMuX3kyKSAvIDIpXTtcbiAgICB9XG4gICAgZ2V0TGVmdCgpIHsgcmV0dXJuIHRoaXMuX3gxOyB9XG4gICAgZ2V0UmlnaHQoKSB7IHJldHVybiB0aGlzLl94MjsgfVxuICAgIGdldFRvcCgpIHsgcmV0dXJuIHRoaXMuX3kxOyB9XG4gICAgZ2V0Qm90dG9tKCkgeyByZXR1cm4gdGhpcy5feTI7IH1cbn1cbi8qKlxuICogQGNsYXNzIENvcnJpZG9yXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5GZWF0dXJlXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRYXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRZXG4gKiBAcGFyYW0ge2ludH0gZW5kWFxuICogQHBhcmFtIHtpbnR9IGVuZFlcbiAqL1xuZXhwb3J0IGNsYXNzIENvcnJpZG9yIGV4dGVuZHMgRmVhdHVyZSB7XG4gICAgY29uc3RydWN0b3Ioc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFkpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fc3RhcnRYID0gc3RhcnRYO1xuICAgICAgICB0aGlzLl9zdGFydFkgPSBzdGFydFk7XG4gICAgICAgIHRoaXMuX2VuZFggPSBlbmRYO1xuICAgICAgICB0aGlzLl9lbmRZID0gZW5kWTtcbiAgICAgICAgdGhpcy5fZW5kc1dpdGhBV2FsbCA9IHRydWU7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGVSYW5kb21BdCh4LCB5LCBkeCwgZHksIG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IG1pbiA9IG9wdGlvbnMuY29ycmlkb3JMZW5ndGhbMF07XG4gICAgICAgIGxldCBtYXggPSBvcHRpb25zLmNvcnJpZG9yTGVuZ3RoWzFdO1xuICAgICAgICBsZXQgbGVuZ3RoID0gUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMoeCwgeSwgeCArIGR4ICogbGVuZ3RoLCB5ICsgZHkgKiBsZW5ndGgpO1xuICAgIH1cbiAgICBkZWJ1ZygpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJjb3JyaWRvclwiLCB0aGlzLl9zdGFydFgsIHRoaXMuX3N0YXJ0WSwgdGhpcy5fZW5kWCwgdGhpcy5fZW5kWSk7XG4gICAgfVxuICAgIGlzVmFsaWQoaXNXYWxsQ2FsbGJhY2ssIGNhbkJlRHVnQ2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHN4ID0gdGhpcy5fc3RhcnRYO1xuICAgICAgICBsZXQgc3kgPSB0aGlzLl9zdGFydFk7XG4gICAgICAgIGxldCBkeCA9IHRoaXMuX2VuZFggLSBzeDtcbiAgICAgICAgbGV0IGR5ID0gdGhpcy5fZW5kWSAtIHN5O1xuICAgICAgICBsZXQgbGVuZ3RoID0gMSArIE1hdGgubWF4KE1hdGguYWJzKGR4KSwgTWF0aC5hYnMoZHkpKTtcbiAgICAgICAgaWYgKGR4KSB7XG4gICAgICAgICAgICBkeCA9IGR4IC8gTWF0aC5hYnMoZHgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSkge1xuICAgICAgICAgICAgZHkgPSBkeSAvIE1hdGguYWJzKGR5KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbnggPSBkeTtcbiAgICAgICAgbGV0IG55ID0gLWR4O1xuICAgICAgICBsZXQgb2sgPSB0cnVlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgeCA9IHN4ICsgaSAqIGR4O1xuICAgICAgICAgICAgbGV0IHkgPSBzeSArIGkgKiBkeTtcbiAgICAgICAgICAgIGlmICghY2FuQmVEdWdDYWxsYmFjayh4LCB5KSkge1xuICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzV2FsbENhbGxiYWNrKHggKyBueCwgeSArIG55KSkge1xuICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzV2FsbENhbGxiYWNrKHggLSBueCwgeSAtIG55KSkge1xuICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gaTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmRYID0geCAtIGR4O1xuICAgICAgICAgICAgICAgIHRoaXMuX2VuZFkgPSB5IC0gZHk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoZSBsZW5ndGggZGVnZW5lcmF0ZWQsIHRoaXMgY29ycmlkb3IgbWlnaHQgYmUgaW52YWxpZFxuICAgICAgICAgKi9cbiAgICAgICAgLyogbm90IHN1cHBvcnRlZCAqL1xuICAgICAgICBpZiAobGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvKiBsZW5ndGggMSBhbGxvd2VkIG9ubHkgaWYgdGhlIG5leHQgc3BhY2UgaXMgZW1wdHkgKi9cbiAgICAgICAgaWYgKGxlbmd0aCA9PSAxICYmIGlzV2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCwgdGhpcy5fZW5kWSArIGR5KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXZSBkbyBub3Qgd2FudCB0aGUgY29ycmlkb3IgdG8gY3Jhc2ggaW50byBhIGNvcm5lciBvZiBhIHJvb207XG4gICAgICAgICAqIGlmIGFueSBvZiB0aGUgZW5kaW5nIGNvcm5lcnMgaXMgZW1wdHksIHRoZSBOKzF0aCBjZWxsIG9mIHRoaXMgY29ycmlkb3IgbXVzdCBiZSBlbXB0eSB0b28uXG4gICAgICAgICAqXG4gICAgICAgICAqIFNpdHVhdGlvbjpcbiAgICAgICAgICogIyMjIyMjIzFcbiAgICAgICAgICogLi4uLi4uLj9cbiAgICAgICAgICogIyMjIyMjIzJcbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIGNvcnJpZG9yIHdhcyBkdWcgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuICAgICAgICAgKiAxLCAyIC0gcHJvYmxlbWF0aWMgY29ybmVycywgPyA9IE4rMXRoIGNlbGwgKG5vdCBkdWcpXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgZmlyc3RDb3JuZXJCYWQgPSAhaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4ICsgbngsIHRoaXMuX2VuZFkgKyBkeSArIG55KTtcbiAgICAgICAgbGV0IHNlY29uZENvcm5lckJhZCA9ICFpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHggLSBueCwgdGhpcy5fZW5kWSArIGR5IC0gbnkpO1xuICAgICAgICB0aGlzLl9lbmRzV2l0aEFXYWxsID0gaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpO1xuICAgICAgICBpZiAoKGZpcnN0Q29ybmVyQmFkIHx8IHNlY29uZENvcm5lckJhZCkgJiYgdGhpcy5fZW5kc1dpdGhBV2FsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaWdDYWxsYmFjayBEaWcgY2FsbGJhY2sgd2l0aCBhIHNpZ25hdHVyZSAoeCwgeSwgdmFsdWUpLiBWYWx1ZXM6IDAgPSBlbXB0eS5cbiAgICAgKi9cbiAgICBjcmVhdGUoZGlnQ2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHN4ID0gdGhpcy5fc3RhcnRYO1xuICAgICAgICBsZXQgc3kgPSB0aGlzLl9zdGFydFk7XG4gICAgICAgIGxldCBkeCA9IHRoaXMuX2VuZFggLSBzeDtcbiAgICAgICAgbGV0IGR5ID0gdGhpcy5fZW5kWSAtIHN5O1xuICAgICAgICBsZXQgbGVuZ3RoID0gMSArIE1hdGgubWF4KE1hdGguYWJzKGR4KSwgTWF0aC5hYnMoZHkpKTtcbiAgICAgICAgaWYgKGR4KSB7XG4gICAgICAgICAgICBkeCA9IGR4IC8gTWF0aC5hYnMoZHgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSkge1xuICAgICAgICAgICAgZHkgPSBkeSAvIE1hdGguYWJzKGR5KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgeCA9IHN4ICsgaSAqIGR4O1xuICAgICAgICAgICAgbGV0IHkgPSBzeSArIGkgKiBkeTtcbiAgICAgICAgICAgIGRpZ0NhbGxiYWNrKHgsIHksIDApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjcmVhdGVQcmlvcml0eVdhbGxzKHByaW9yaXR5V2FsbENhbGxiYWNrKSB7XG4gICAgICAgIGlmICghdGhpcy5fZW5kc1dpdGhBV2FsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzeCA9IHRoaXMuX3N0YXJ0WDtcbiAgICAgICAgbGV0IHN5ID0gdGhpcy5fc3RhcnRZO1xuICAgICAgICBsZXQgZHggPSB0aGlzLl9lbmRYIC0gc3g7XG4gICAgICAgIGxldCBkeSA9IHRoaXMuX2VuZFkgLSBzeTtcbiAgICAgICAgaWYgKGR4KSB7XG4gICAgICAgICAgICBkeCA9IGR4IC8gTWF0aC5hYnMoZHgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSkge1xuICAgICAgICAgICAgZHkgPSBkeSAvIE1hdGguYWJzKGR5KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbnggPSBkeTtcbiAgICAgICAgbGV0IG55ID0gLWR4O1xuICAgICAgICBwcmlvcml0eVdhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHgsIHRoaXMuX2VuZFkgKyBkeSk7XG4gICAgICAgIHByaW9yaXR5V2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBueCwgdGhpcy5fZW5kWSArIG55KTtcbiAgICAgICAgcHJpb3JpdHlXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCAtIG54LCB0aGlzLl9lbmRZIC0gbnkpO1xuICAgIH1cbn1cbiIsImltcG9ydCBEdW5nZW9uIGZyb20gXCIuL2R1bmdlb24uanNcIjtcbmltcG9ydCB7IFJvb20sIENvcnJpZG9yIH0gZnJvbSBcIi4vZmVhdHVyZXMuanNcIjtcbmltcG9ydCBSTkcgZnJvbSBcIi4uL3JuZy5qc1wiO1xuO1xuLyoqXG4gKiBAY2xhc3MgRHVuZ2VvbiBnZW5lcmF0b3Igd2hpY2ggdHJpZXMgdG8gZmlsbCB0aGUgc3BhY2UgZXZlbmx5LiBHZW5lcmF0ZXMgaW5kZXBlbmRlbnQgcm9vbXMgYW5kIHRyaWVzIHRvIGNvbm5lY3QgdGhlbS5cbiAqIEBhdWdtZW50cyBST1QuTWFwLkR1bmdlb25cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5pZm9ybSBleHRlbmRzIER1bmdlb24ge1xuICAgIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB7XG4gICAgICAgICAgICByb29tV2lkdGg6IFszLCA5XSxcbiAgICAgICAgICAgIHJvb21IZWlnaHQ6IFszLCA1XSxcbiAgICAgICAgICAgIHJvb21EdWdQZXJjZW50YWdlOiAwLjEsXG4gICAgICAgICAgICB0aW1lTGltaXQ6IDEwMDAgLyogd2Ugc3RvcCBhZnRlciB0aGlzIG11Y2ggdGltZSBoYXMgcGFzc2VkIChtc2VjKSAqL1xuICAgICAgICB9O1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9tYXAgPSBbXTtcbiAgICAgICAgdGhpcy5fZHVnID0gMDtcbiAgICAgICAgdGhpcy5fcm9vbUF0dGVtcHRzID0gMjA7IC8qIG5ldyByb29tIGlzIGNyZWF0ZWQgTi10aW1lcyB1bnRpbCBpcyBjb25zaWRlcmVkIGFzIGltcG9zc2libGUgdG8gZ2VuZXJhdGUgKi9cbiAgICAgICAgdGhpcy5fY29ycmlkb3JBdHRlbXB0cyA9IDIwOyAvKiBjb3JyaWRvcnMgYXJlIHRyaWVkIE4tdGltZXMgdW50aWwgdGhlIGxldmVsIGlzIGNvbnNpZGVyZWQgYXMgaW1wb3NzaWJsZSB0byBjb25uZWN0ICovXG4gICAgICAgIHRoaXMuX2Nvbm5lY3RlZCA9IFtdOyAvKiBsaXN0IG9mIGFscmVhZHkgY29ubmVjdGVkIHJvb21zICovXG4gICAgICAgIHRoaXMuX3VuY29ubmVjdGVkID0gW107IC8qIGxpc3Qgb2YgcmVtYWluaW5nIHVuY29ubmVjdGVkIHJvb21zICovXG4gICAgICAgIHRoaXMuX2RpZ0NhbGxiYWNrID0gdGhpcy5fZGlnQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fY2FuQmVEdWdDYWxsYmFjayA9IHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faXNXYWxsQ2FsbGJhY2sgPSB0aGlzLl9pc1dhbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBtYXAuIElmIHRoZSB0aW1lIGxpbWl0IGhhcyBiZWVuIGhpdCwgcmV0dXJucyBudWxsLlxuICAgICAqIEBzZWUgUk9ULk1hcCNjcmVhdGVcbiAgICAgKi9cbiAgICBjcmVhdGUoY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHQxID0gRGF0ZS5ub3coKTtcbiAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgIGxldCB0MiA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBpZiAodDIgLSB0MSA+IHRoaXMuX29wdGlvbnMudGltZUxpbWl0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9IC8qIHRpbWUgbGltaXQhICovXG4gICAgICAgICAgICB0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xuICAgICAgICAgICAgdGhpcy5fZHVnID0gMDtcbiAgICAgICAgICAgIHRoaXMuX3Jvb21zID0gW107XG4gICAgICAgICAgICB0aGlzLl91bmNvbm5lY3RlZCA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdGVSb29tcygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Jvb21zLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9nZW5lcmF0ZUNvcnJpZG9ycygpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3dpZHRoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgYSBzdWl0YWJsZSBhbW91bnQgb2Ygcm9vbXNcbiAgICAgKi9cbiAgICBfZ2VuZXJhdGVSb29tcygpIHtcbiAgICAgICAgbGV0IHcgPSB0aGlzLl93aWR0aCAtIDI7XG4gICAgICAgIGxldCBoID0gdGhpcy5faGVpZ2h0IC0gMjtcbiAgICAgICAgbGV0IHJvb207XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIHJvb20gPSB0aGlzLl9nZW5lcmF0ZVJvb20oKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kdWcgLyAodyAqIGgpID4gdGhpcy5fb3B0aW9ucy5yb29tRHVnUGVyY2VudGFnZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSAvKiBhY2hpZXZlZCByZXF1ZXN0ZWQgYW1vdW50IG9mIGZyZWUgc3BhY2UgKi9cbiAgICAgICAgfSB3aGlsZSAocm9vbSk7XG4gICAgICAgIC8qIGVpdGhlciBlbm91Z2ggcm9vbXMsIG9yIG5vdCBhYmxlIHRvIGdlbmVyYXRlIG1vcmUgb2YgdGhlbSA6KSAqL1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcnkgdG8gZ2VuZXJhdGUgb25lIHJvb21cbiAgICAgKi9cbiAgICBfZ2VuZXJhdGVSb29tKCkge1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICB3aGlsZSAoY291bnQgPCB0aGlzLl9yb29tQXR0ZW1wdHMpIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICBsZXQgcm9vbSA9IFJvb20uY3JlYXRlUmFuZG9tKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIHRoaXMuX29wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKCFyb29tLmlzVmFsaWQodGhpcy5faXNXYWxsQ2FsbGJhY2ssIHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb29tLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XG4gICAgICAgICAgICB0aGlzLl9yb29tcy5wdXNoKHJvb20pO1xuICAgICAgICAgICAgcmV0dXJuIHJvb207XG4gICAgICAgIH1cbiAgICAgICAgLyogbm8gcm9vbSB3YXMgZ2VuZXJhdGVkIGluIGEgZ2l2ZW4gbnVtYmVyIG9mIGF0dGVtcHRzICovXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgY29ubmVjdG9ycyBiZXdlZW4gcm9vbXNcbiAgICAgKiBAcmV0dXJucyB7Ym9vbH0gc3VjY2VzcyBXYXMgdGhpcyBhdHRlbXB0IHN1Y2Nlc3NmdWxsP1xuICAgICAqL1xuICAgIF9nZW5lcmF0ZUNvcnJpZG9ycygpIHtcbiAgICAgICAgbGV0IGNudCA9IDA7XG4gICAgICAgIHdoaWxlIChjbnQgPCB0aGlzLl9jb3JyaWRvckF0dGVtcHRzKSB7XG4gICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIHRoaXMuX2NvcnJpZG9ycyA9IFtdO1xuICAgICAgICAgICAgLyogZGlnIHJvb21zIGludG8gYSBjbGVhciBtYXAgKi9cbiAgICAgICAgICAgIHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3Jvb21zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvb20gPSB0aGlzLl9yb29tc1tpXTtcbiAgICAgICAgICAgICAgICByb29tLmNsZWFyRG9vcnMoKTtcbiAgICAgICAgICAgICAgICByb29tLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91bmNvbm5lY3RlZCA9IFJORy5zaHVmZmxlKHRoaXMuX3Jvb21zLnNsaWNlKCkpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGVkID0gW107XG4gICAgICAgICAgICBpZiAodGhpcy5fdW5jb25uZWN0ZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29ubmVjdGVkLnB1c2godGhpcy5fdW5jb25uZWN0ZWQucG9wKCkpO1xuICAgICAgICAgICAgfSAvKiBmaXJzdCBvbmUgaXMgYWx3YXlzIGNvbm5lY3RlZCAqL1xuICAgICAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgICAgICAvKiAxLiBwaWNrIHJhbmRvbSBjb25uZWN0ZWQgcm9vbSAqL1xuICAgICAgICAgICAgICAgIGxldCBjb25uZWN0ZWQgPSBSTkcuZ2V0SXRlbSh0aGlzLl9jb25uZWN0ZWQpO1xuICAgICAgICAgICAgICAgIGlmICghY29ubmVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKiAyLiBmaW5kIGNsb3Nlc3QgdW5jb25uZWN0ZWQgKi9cbiAgICAgICAgICAgICAgICBsZXQgcm9vbTEgPSB0aGlzLl9jbG9zZXN0Um9vbSh0aGlzLl91bmNvbm5lY3RlZCwgY29ubmVjdGVkKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJvb20xKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKiAzLiBjb25uZWN0IGl0IHRvIGNsb3Nlc3QgY29ubmVjdGVkICovXG4gICAgICAgICAgICAgICAgbGV0IHJvb20yID0gdGhpcy5fY2xvc2VzdFJvb20odGhpcy5fY29ubmVjdGVkLCByb29tMSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyb29tMikge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IG9rID0gdGhpcy5fY29ubmVjdFJvb21zKHJvb20xLCByb29tMik7XG4gICAgICAgICAgICAgICAgaWYgKCFvaykge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IC8qIHN0b3AgY29ubmVjdGluZywgcmUtc2h1ZmZsZSAqL1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fdW5jb25uZWN0ZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gLyogZG9uZTsgbm8gcm9vbXMgcmVtYWluICovXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICA7XG4gICAgLyoqXG4gICAgICogRm9yIGEgZ2l2ZW4gcm9vbSwgZmluZCB0aGUgY2xvc2VzdCBvbmUgZnJvbSB0aGUgbGlzdFxuICAgICAqL1xuICAgIF9jbG9zZXN0Um9vbShyb29tcywgcm9vbSkge1xuICAgICAgICBsZXQgZGlzdCA9IEluZmluaXR5O1xuICAgICAgICBsZXQgY2VudGVyID0gcm9vbS5nZXRDZW50ZXIoKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IG51bGw7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm9vbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByID0gcm9vbXNbaV07XG4gICAgICAgICAgICBsZXQgYyA9IHIuZ2V0Q2VudGVyKCk7XG4gICAgICAgICAgICBsZXQgZHggPSBjWzBdIC0gY2VudGVyWzBdO1xuICAgICAgICAgICAgbGV0IGR5ID0gY1sxXSAtIGNlbnRlclsxXTtcbiAgICAgICAgICAgIGxldCBkID0gZHggKiBkeCArIGR5ICogZHk7XG4gICAgICAgICAgICBpZiAoZCA8IGRpc3QpIHtcbiAgICAgICAgICAgICAgICBkaXN0ID0gZDtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIF9jb25uZWN0Um9vbXMocm9vbTEsIHJvb20yKSB7XG4gICAgICAgIC8qXG4gICAgICAgICAgICByb29tMS5kZWJ1ZygpO1xuICAgICAgICAgICAgcm9vbTIuZGVidWcoKTtcbiAgICAgICAgKi9cbiAgICAgICAgbGV0IGNlbnRlcjEgPSByb29tMS5nZXRDZW50ZXIoKTtcbiAgICAgICAgbGV0IGNlbnRlcjIgPSByb29tMi5nZXRDZW50ZXIoKTtcbiAgICAgICAgbGV0IGRpZmZYID0gY2VudGVyMlswXSAtIGNlbnRlcjFbMF07XG4gICAgICAgIGxldCBkaWZmWSA9IGNlbnRlcjJbMV0gLSBjZW50ZXIxWzFdO1xuICAgICAgICBsZXQgc3RhcnQ7XG4gICAgICAgIGxldCBlbmQ7XG4gICAgICAgIGxldCBkaXJJbmRleDEsIGRpckluZGV4MiwgbWluLCBtYXgsIGluZGV4O1xuICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlgpIDwgTWF0aC5hYnMoZGlmZlkpKSB7IC8qIGZpcnN0IHRyeSBjb25uZWN0aW5nIG5vcnRoLXNvdXRoIHdhbGxzICovXG4gICAgICAgICAgICBkaXJJbmRleDEgPSAoZGlmZlkgPiAwID8gMiA6IDApO1xuICAgICAgICAgICAgZGlySW5kZXgyID0gKGRpckluZGV4MSArIDIpICUgNDtcbiAgICAgICAgICAgIG1pbiA9IHJvb20yLmdldExlZnQoKTtcbiAgICAgICAgICAgIG1heCA9IHJvb20yLmdldFJpZ2h0KCk7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8qIGZpcnN0IHRyeSBjb25uZWN0aW5nIGVhc3Qtd2VzdCB3YWxscyAqL1xuICAgICAgICAgICAgZGlySW5kZXgxID0gKGRpZmZYID4gMCA/IDEgOiAzKTtcbiAgICAgICAgICAgIGRpckluZGV4MiA9IChkaXJJbmRleDEgKyAyKSAlIDQ7XG4gICAgICAgICAgICBtaW4gPSByb29tMi5nZXRUb3AoKTtcbiAgICAgICAgICAgIG1heCA9IHJvb20yLmdldEJvdHRvbSgpO1xuICAgICAgICAgICAgaW5kZXggPSAxO1xuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTEsIGRpckluZGV4MSk7IC8qIGNvcnJpZG9yIHdpbGwgc3RhcnQgaGVyZSAqL1xuICAgICAgICBpZiAoIXN0YXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0W2luZGV4XSA+PSBtaW4gJiYgc3RhcnRbaW5kZXhdIDw9IG1heCkgeyAvKiBwb3NzaWJsZSB0byBjb25uZWN0IHdpdGggc3RyYWlnaHQgbGluZSAoSS1saWtlKSAqL1xuICAgICAgICAgICAgZW5kID0gc3RhcnQuc2xpY2UoKTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgICAgICAgICBzd2l0Y2ggKGRpckluZGV4Mikge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByb29tMi5nZXRUb3AoKSAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByb29tMi5nZXRSaWdodCgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJvb20yLmdldEJvdHRvbSgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJvb20yLmdldExlZnQoKSAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW5kWyhpbmRleCArIDEpICUgMl0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX2RpZ0xpbmUoW3N0YXJ0LCBlbmRdKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdGFydFtpbmRleF0gPCBtaW4gLSAxIHx8IHN0YXJ0W2luZGV4XSA+IG1heCArIDEpIHsgLyogbmVlZCB0byBzd2l0Y2ggdGFyZ2V0IHdhbGwgKEwtbGlrZSkgKi9cbiAgICAgICAgICAgIGxldCBkaWZmID0gc3RhcnRbaW5kZXhdIC0gY2VudGVyMltpbmRleF07XG4gICAgICAgICAgICBsZXQgcm90YXRpb24gPSAwO1xuICAgICAgICAgICAgc3dpdGNoIChkaXJJbmRleDIpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICByb3RhdGlvbiA9IChkaWZmIDwgMCA/IDMgOiAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgcm90YXRpb24gPSAoZGlmZiA8IDAgPyAxIDogMyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGlySW5kZXgyID0gKGRpckluZGV4MiArIHJvdGF0aW9uKSAlIDQ7XG4gICAgICAgICAgICBlbmQgPSB0aGlzLl9wbGFjZUluV2FsbChyb29tMiwgZGlySW5kZXgyKTtcbiAgICAgICAgICAgIGlmICghZW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG1pZCA9IFswLCAwXTtcbiAgICAgICAgICAgIG1pZFtpbmRleF0gPSBzdGFydFtpbmRleF07XG4gICAgICAgICAgICBsZXQgaW5kZXgyID0gKGluZGV4ICsgMSkgJSAyO1xuICAgICAgICAgICAgbWlkW2luZGV4Ml0gPSBlbmRbaW5kZXgyXTtcbiAgICAgICAgICAgIHRoaXMuX2RpZ0xpbmUoW3N0YXJ0LCBtaWQsIGVuZF0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvKiB1c2UgY3VycmVudCB3YWxsIHBhaXIsIGJ1dCBhZGp1c3QgdGhlIGxpbmUgaW4gdGhlIG1pZGRsZSAoUy1saWtlKSAqL1xuICAgICAgICAgICAgbGV0IGluZGV4MiA9IChpbmRleCArIDEpICUgMjtcbiAgICAgICAgICAgIGVuZCA9IHRoaXMuX3BsYWNlSW5XYWxsKHJvb20yLCBkaXJJbmRleDIpO1xuICAgICAgICAgICAgaWYgKCFlbmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbWlkID0gTWF0aC5yb3VuZCgoZW5kW2luZGV4Ml0gKyBzdGFydFtpbmRleDJdKSAvIDIpO1xuICAgICAgICAgICAgbGV0IG1pZDEgPSBbMCwgMF07XG4gICAgICAgICAgICBsZXQgbWlkMiA9IFswLCAwXTtcbiAgICAgICAgICAgIG1pZDFbaW5kZXhdID0gc3RhcnRbaW5kZXhdO1xuICAgICAgICAgICAgbWlkMVtpbmRleDJdID0gbWlkO1xuICAgICAgICAgICAgbWlkMltpbmRleF0gPSBlbmRbaW5kZXhdO1xuICAgICAgICAgICAgbWlkMltpbmRleDJdID0gbWlkO1xuICAgICAgICAgICAgdGhpcy5fZGlnTGluZShbc3RhcnQsIG1pZDEsIG1pZDIsIGVuZF0pO1xuICAgICAgICB9XG4gICAgICAgIHJvb20xLmFkZERvb3Ioc3RhcnRbMF0sIHN0YXJ0WzFdKTtcbiAgICAgICAgcm9vbTIuYWRkRG9vcihlbmRbMF0sIGVuZFsxXSk7XG4gICAgICAgIGluZGV4ID0gdGhpcy5fdW5jb25uZWN0ZWQuaW5kZXhPZihyb29tMSk7XG4gICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fdW5jb25uZWN0ZWQuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RlZC5wdXNoKHJvb20xKTtcbiAgICAgICAgfVxuICAgICAgICBpbmRleCA9IHRoaXMuX3VuY29ubmVjdGVkLmluZGV4T2Yocm9vbTIpO1xuICAgICAgICBpZiAoaW5kZXggIT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3VuY29ubmVjdGVkLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0ZWQucHVzaChyb29tMik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIF9wbGFjZUluV2FsbChyb29tLCBkaXJJbmRleCkge1xuICAgICAgICBsZXQgc3RhcnQgPSBbMCwgMF07XG4gICAgICAgIGxldCBkaXIgPSBbMCwgMF07XG4gICAgICAgIGxldCBsZW5ndGggPSAwO1xuICAgICAgICBzd2l0Y2ggKGRpckluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgZGlyID0gWzEsIDBdO1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gW3Jvb20uZ2V0TGVmdCgpLCByb29tLmdldFRvcCgpIC0gMV07XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gcm9vbS5nZXRSaWdodCgpIC0gcm9vbS5nZXRMZWZ0KCkgKyAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGRpciA9IFswLCAxXTtcbiAgICAgICAgICAgICAgICBzdGFydCA9IFtyb29tLmdldFJpZ2h0KCkgKyAxLCByb29tLmdldFRvcCgpXTtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSByb29tLmdldEJvdHRvbSgpIC0gcm9vbS5nZXRUb3AoKSArIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZGlyID0gWzEsIDBdO1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gW3Jvb20uZ2V0TGVmdCgpLCByb29tLmdldEJvdHRvbSgpICsgMV07XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gcm9vbS5nZXRSaWdodCgpIC0gcm9vbS5nZXRMZWZ0KCkgKyAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGRpciA9IFswLCAxXTtcbiAgICAgICAgICAgICAgICBzdGFydCA9IFtyb29tLmdldExlZnQoKSAtIDEsIHJvb20uZ2V0VG9wKCldO1xuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHJvb20uZ2V0Qm90dG9tKCkgLSByb29tLmdldFRvcCgpICsgMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXZhaWwgPSBbXTtcbiAgICAgICAgbGV0IGxhc3RCYWRJbmRleCA9IC0yO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgeCA9IHN0YXJ0WzBdICsgaSAqIGRpclswXTtcbiAgICAgICAgICAgIGxldCB5ID0gc3RhcnRbMV0gKyBpICogZGlyWzFdO1xuICAgICAgICAgICAgYXZhaWwucHVzaChudWxsKTtcbiAgICAgICAgICAgIGxldCBpc1dhbGwgPSAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xuICAgICAgICAgICAgaWYgKGlzV2FsbCkge1xuICAgICAgICAgICAgICAgIGlmIChsYXN0QmFkSW5kZXggIT0gaSAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxbaV0gPSBbeCwgeV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGFzdEJhZEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgICAgICBhdmFpbFtpIC0gMV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gYXZhaWwubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICghYXZhaWxbaV0pIHtcbiAgICAgICAgICAgICAgICBhdmFpbC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChhdmFpbC5sZW5ndGggPyBSTkcuZ2V0SXRlbShhdmFpbCkgOiBudWxsKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGlnIGEgcG9seWxpbmUuXG4gICAgICovXG4gICAgX2RpZ0xpbmUocG9pbnRzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3RhcnQgPSBwb2ludHNbaSAtIDFdO1xuICAgICAgICAgICAgbGV0IGVuZCA9IHBvaW50c1tpXTtcbiAgICAgICAgICAgIGxldCBjb3JyaWRvciA9IG5ldyBDb3JyaWRvcihzdGFydFswXSwgc3RhcnRbMV0sIGVuZFswXSwgZW5kWzFdKTtcbiAgICAgICAgICAgIGNvcnJpZG9yLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XG4gICAgICAgICAgICB0aGlzLl9jb3JyaWRvcnMucHVzaChjb3JyaWRvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2RpZ0NhbGxiYWNrKHgsIHksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX21hcFt4XVt5XSA9IHZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fZHVnKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2lzV2FsbENhbGxiYWNrKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPj0gdGhpcy5fd2lkdGggfHwgeSA+PSB0aGlzLl9oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcbiAgICB9XG4gICAgX2NhbkJlRHVnQ2FsbGJhY2soeCwgeSkge1xuICAgICAgICBpZiAoeCA8IDEgfHwgeSA8IDEgfHwgeCArIDEgPj0gdGhpcy5fd2lkdGggfHwgeSArIDEgPj0gdGhpcy5faGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IE1hcCBmcm9tIFwiLi9tYXAuanNcIjtcbmltcG9ydCB7IERJUlMgfSBmcm9tIFwiLi4vY29uc3RhbnRzLmpzXCI7XG5pbXBvcnQgUk5HIGZyb20gXCIuLi9ybmcuanNcIjtcbjtcbi8qKlxuICogQGNsYXNzIENlbGx1bGFyIGF1dG9tYXRvbiBtYXAgZ2VuZXJhdG9yXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxuICogQHBhcmFtIHtpbnR9IFt3aWR0aD1ST1QuREVGQVVMVF9XSURUSF1cbiAqIEBwYXJhbSB7aW50fSBbaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gT3B0aW9uc1xuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuYm9ybl0gTGlzdCBvZiBuZWlnaGJvciBjb3VudHMgZm9yIGEgbmV3IGNlbGwgdG8gYmUgYm9ybiBpbiBlbXB0eSBzcGFjZVxuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuc3Vydml2ZV0gTGlzdCBvZiBuZWlnaGJvciBjb3VudHMgZm9yIGFuIGV4aXN0aW5nICBjZWxsIHRvIHN1cnZpdmVcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50b3BvbG9neV0gVG9wb2xvZ3kgNCBvciA2IG9yIDhcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2VsbHVsYXIgZXh0ZW5kcyBNYXAge1xuICAgIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBzdXBlcih3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGJvcm46IFs1LCA2LCA3LCA4XSxcbiAgICAgICAgICAgIHN1cnZpdmU6IFs0LCA1LCA2LCA3LCA4XSxcbiAgICAgICAgICAgIHRvcG9sb2d5OiA4XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZGlycyA9IERJUlNbdGhpcy5fb3B0aW9ucy50b3BvbG9neV07XG4gICAgICAgIHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpbGwgdGhlIG1hcCB3aXRoIHJhbmRvbSB2YWx1ZXNcbiAgICAgKiBAcGFyYW0ge2Zsb2F0fSBwcm9iYWJpbGl0eSBQcm9iYWJpbGl0eSBmb3IgYSBjZWxsIHRvIGJlY29tZSBhbGl2ZTsgMCA9IGFsbCBlbXB0eSwgMSA9IGFsbCBmdWxsXG4gICAgICovXG4gICAgcmFuZG9taXplKHByb2JhYmlsaXR5KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fd2lkdGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9oZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcFtpXVtqXSA9IChSTkcuZ2V0VW5pZm9ybSgpIDwgcHJvYmFiaWxpdHkgPyAxIDogMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoYW5nZSBvcHRpb25zLlxuICAgICAqIEBzZWUgUk9ULk1hcC5DZWxsdWxhclxuICAgICAqL1xuICAgIHNldE9wdGlvbnMob3B0aW9ucykgeyBPYmplY3QuYXNzaWduKHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpOyB9XG4gICAgc2V0KHgsIHksIHZhbHVlKSB7IHRoaXMuX21hcFt4XVt5XSA9IHZhbHVlOyB9XG4gICAgY3JlYXRlKGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBuZXdNYXAgPSB0aGlzLl9maWxsTWFwKDApO1xuICAgICAgICBsZXQgYm9ybiA9IHRoaXMuX29wdGlvbnMuYm9ybjtcbiAgICAgICAgbGV0IHN1cnZpdmUgPSB0aGlzLl9vcHRpb25zLnN1cnZpdmU7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5faGVpZ2h0OyBqKyspIHtcbiAgICAgICAgICAgIGxldCB3aWR0aFN0ZXAgPSAxO1xuICAgICAgICAgICAgbGV0IHdpZHRoU3RhcnQgPSAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gNikge1xuICAgICAgICAgICAgICAgIHdpZHRoU3RlcCA9IDI7XG4gICAgICAgICAgICAgICAgd2lkdGhTdGFydCA9IGogJSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHdpZHRoU3RhcnQ7IGkgPCB0aGlzLl93aWR0aDsgaSArPSB3aWR0aFN0ZXApIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VyID0gdGhpcy5fbWFwW2ldW2pdO1xuICAgICAgICAgICAgICAgIGxldCBuY291bnQgPSB0aGlzLl9nZXROZWlnaGJvcnMoaSwgaik7XG4gICAgICAgICAgICAgICAgaWYgKGN1ciAmJiBzdXJ2aXZlLmluZGV4T2YobmNvdW50KSAhPSAtMSkgeyAvKiBzdXJ2aXZlICovXG4gICAgICAgICAgICAgICAgICAgIG5ld01hcFtpXVtqXSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFjdXIgJiYgYm9ybi5pbmRleE9mKG5jb3VudCkgIT0gLTEpIHsgLyogYm9ybiAqL1xuICAgICAgICAgICAgICAgICAgICBuZXdNYXBbaV1bal0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXAgPSBuZXdNYXA7XG4gICAgICAgIGNhbGxiYWNrICYmIHRoaXMuX3NlcnZpY2VDYWxsYmFjayhjYWxsYmFjayk7XG4gICAgfVxuICAgIF9zZXJ2aWNlQ2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9oZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgbGV0IHdpZHRoU3RlcCA9IDE7XG4gICAgICAgICAgICBsZXQgd2lkdGhTdGFydCA9IDA7XG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50b3BvbG9neSA9PSA2KSB7XG4gICAgICAgICAgICAgICAgd2lkdGhTdGVwID0gMjtcbiAgICAgICAgICAgICAgICB3aWR0aFN0YXJ0ID0gaiAlIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gd2lkdGhTdGFydDsgaSA8IHRoaXMuX3dpZHRoOyBpICs9IHdpZHRoU3RlcCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IG5laWdoYm9yIGNvdW50IGF0IFtpLGpdIGluIHRoaXMuX21hcFxuICAgICAqL1xuICAgIF9nZXROZWlnaGJvcnMoY3gsIGN5KSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2RpcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkaXIgPSB0aGlzLl9kaXJzW2ldO1xuICAgICAgICAgICAgbGV0IHggPSBjeCArIGRpclswXTtcbiAgICAgICAgICAgIGxldCB5ID0gY3kgKyBkaXJbMV07XG4gICAgICAgICAgICBpZiAoeCA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5IDwgMCB8fCB5ID49IHRoaXMuX2hlaWdodCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0ICs9ICh0aGlzLl9tYXBbeF1beV0gPT0gMSA/IDEgOiAwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYWtlIHN1cmUgZXZlcnkgbm9uLXdhbGwgc3BhY2UgaXMgYWNjZXNzaWJsZS5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayB0byBjYWxsIHRvIGRpc3BsYXkgbWFwIHdoZW4gZG9cbiAgICAgKiBAcGFyYW0ge2ludH0gdmFsdWUgdG8gY29uc2lkZXIgZW1wdHkgc3BhY2UgLSBkZWZhdWx0cyB0byAwXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdG8gY2FsbCB3aGVuIGEgbmV3IGNvbm5lY3Rpb24gaXMgbWFkZVxuICAgICAqL1xuICAgIGNvbm5lY3QoY2FsbGJhY2ssIHZhbHVlLCBjb25uZWN0aW9uQ2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgbGV0IGFsbEZyZWVTcGFjZSA9IFtdO1xuICAgICAgICBsZXQgbm90Q29ubmVjdGVkID0ge307XG4gICAgICAgIC8vIGZpbmQgYWxsIGZyZWUgc3BhY2VcbiAgICAgICAgbGV0IHdpZHRoU3RlcCA9IDE7XG4gICAgICAgIGxldCB3aWR0aFN0YXJ0cyA9IFswLCAwXTtcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gNikge1xuICAgICAgICAgICAgd2lkdGhTdGVwID0gMjtcbiAgICAgICAgICAgIHdpZHRoU3RhcnRzID0gWzAsIDFdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5faGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB3aWR0aFN0YXJ0c1t5ICUgMl07IHggPCB0aGlzLl93aWR0aDsgeCArPSB3aWR0aFN0ZXApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZnJlZVNwYWNlKHgsIHksIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IFt4LCB5XTtcbiAgICAgICAgICAgICAgICAgICAgbm90Q29ubmVjdGVkW3RoaXMuX3BvaW50S2V5KHApXSA9IHA7XG4gICAgICAgICAgICAgICAgICAgIGFsbEZyZWVTcGFjZS5wdXNoKFt4LCB5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBzdGFydCA9IGFsbEZyZWVTcGFjZVtSTkcuZ2V0VW5pZm9ybUludCgwLCBhbGxGcmVlU3BhY2UubGVuZ3RoIC0gMSldO1xuICAgICAgICBsZXQga2V5ID0gdGhpcy5fcG9pbnRLZXkoc3RhcnQpO1xuICAgICAgICBsZXQgY29ubmVjdGVkID0ge307XG4gICAgICAgIGNvbm5lY3RlZFtrZXldID0gc3RhcnQ7XG4gICAgICAgIGRlbGV0ZSBub3RDb25uZWN0ZWRba2V5XTtcbiAgICAgICAgLy8gZmluZCB3aGF0J3MgY29ubmVjdGVkIHRvIHRoZSBzdGFydGluZyBwb2ludFxuICAgICAgICB0aGlzLl9maW5kQ29ubmVjdGVkKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCBbc3RhcnRdLCBmYWxzZSwgdmFsdWUpO1xuICAgICAgICB3aGlsZSAoT2JqZWN0LmtleXMobm90Q29ubmVjdGVkKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBmaW5kIHR3byBwb2ludHMgZnJvbSBub3RDb25uZWN0ZWQgdG8gY29ubmVjdGVkXG4gICAgICAgICAgICBsZXQgcCA9IHRoaXMuX2dldEZyb21Ubyhjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCk7XG4gICAgICAgICAgICBsZXQgZnJvbSA9IHBbMF07IC8vIG5vdENvbm5lY3RlZFxuICAgICAgICAgICAgbGV0IHRvID0gcFsxXTsgLy8gY29ubmVjdGVkXG4gICAgICAgICAgICAvLyBmaW5kIGV2ZXJ5dGhpbmcgY29ubmVjdGVkIHRvIHRoZSBzdGFydGluZyBwb2ludFxuICAgICAgICAgICAgbGV0IGxvY2FsID0ge307XG4gICAgICAgICAgICBsb2NhbFt0aGlzLl9wb2ludEtleShmcm9tKV0gPSBmcm9tO1xuICAgICAgICAgICAgdGhpcy5fZmluZENvbm5lY3RlZChsb2NhbCwgbm90Q29ubmVjdGVkLCBbZnJvbV0sIHRydWUsIHZhbHVlKTtcbiAgICAgICAgICAgIC8vIGNvbm5lY3QgdG8gYSBjb25uZWN0ZWQgY2VsbFxuICAgICAgICAgICAgbGV0IHR1bm5lbEZuID0gKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gNiA/IHRoaXMuX3R1bm5lbFRvQ29ubmVjdGVkNiA6IHRoaXMuX3R1bm5lbFRvQ29ubmVjdGVkKTtcbiAgICAgICAgICAgIHR1bm5lbEZuLmNhbGwodGhpcywgdG8sIGZyb20sIGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCB2YWx1ZSwgY29ubmVjdGlvbkNhbGxiYWNrKTtcbiAgICAgICAgICAgIC8vIG5vdyBhbGwgb2YgbG9jYWwgaXMgY29ubmVjdGVkXG4gICAgICAgICAgICBmb3IgKGxldCBrIGluIGxvY2FsKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBwID0gbG9jYWxba107XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwW3BwWzBdXVtwcFsxXV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBjb25uZWN0ZWRba10gPSBwcDtcbiAgICAgICAgICAgICAgICBkZWxldGUgbm90Q29ubmVjdGVkW2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrICYmIHRoaXMuX3NlcnZpY2VDYWxsYmFjayhjYWxsYmFjayk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpbmQgcmFuZG9tIHBvaW50cyB0byBjb25uZWN0LiBTZWFyY2ggZm9yIHRoZSBjbG9zZXN0IHBvaW50IGluIHRoZSBsYXJnZXIgc3BhY2UuXG4gICAgICogVGhpcyBpcyB0byBtaW5pbWl6ZSB0aGUgbGVuZ3RoIG9mIHRoZSBwYXNzYWdlIHdoaWxlIG1haW50YWluaW5nIGdvb2QgcGVyZm9ybWFuY2UuXG4gICAgICovXG4gICAgX2dldEZyb21Ubyhjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCkge1xuICAgICAgICBsZXQgZnJvbSA9IFswLCAwXSwgdG8gPSBbMCwgMF0sIGQ7XG4gICAgICAgIGxldCBjb25uZWN0ZWRLZXlzID0gT2JqZWN0LmtleXMoY29ubmVjdGVkKTtcbiAgICAgICAgbGV0IG5vdENvbm5lY3RlZEtleXMgPSBPYmplY3Qua2V5cyhub3RDb25uZWN0ZWQpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNvbm5lY3RlZEtleXMubGVuZ3RoIDwgbm90Q29ubmVjdGVkS2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGNvbm5lY3RlZEtleXM7XG4gICAgICAgICAgICAgICAgdG8gPSBjb25uZWN0ZWRba2V5c1tSTkcuZ2V0VW5pZm9ybUludCgwLCBrZXlzLmxlbmd0aCAtIDEpXV07XG4gICAgICAgICAgICAgICAgZnJvbSA9IHRoaXMuX2dldENsb3Nlc3QodG8sIG5vdENvbm5lY3RlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IG5vdENvbm5lY3RlZEtleXM7XG4gICAgICAgICAgICAgICAgZnJvbSA9IG5vdENvbm5lY3RlZFtrZXlzW1JORy5nZXRVbmlmb3JtSW50KDAsIGtleXMubGVuZ3RoIC0gMSldXTtcbiAgICAgICAgICAgICAgICB0byA9IHRoaXMuX2dldENsb3Nlc3QoZnJvbSwgY29ubmVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGQgPSAoZnJvbVswXSAtIHRvWzBdKSAqIChmcm9tWzBdIC0gdG9bMF0pICsgKGZyb21bMV0gLSB0b1sxXSkgKiAoZnJvbVsxXSAtIHRvWzFdKTtcbiAgICAgICAgICAgIGlmIChkIDwgNjQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIj4+PiBjb25uZWN0ZWQ9XCIgKyB0byArIFwiIG5vdENvbm5lY3RlZD1cIiArIGZyb20gKyBcIiBkaXN0PVwiICsgZCk7XG4gICAgICAgIHJldHVybiBbZnJvbSwgdG9dO1xuICAgIH1cbiAgICBfZ2V0Q2xvc2VzdChwb2ludCwgc3BhY2UpIHtcbiAgICAgICAgbGV0IG1pblBvaW50ID0gbnVsbDtcbiAgICAgICAgbGV0IG1pbkRpc3QgPSBudWxsO1xuICAgICAgICBmb3IgKGxldCBrIGluIHNwYWNlKSB7XG4gICAgICAgICAgICBsZXQgcCA9IHNwYWNlW2tdO1xuICAgICAgICAgICAgbGV0IGQgPSAocFswXSAtIHBvaW50WzBdKSAqIChwWzBdIC0gcG9pbnRbMF0pICsgKHBbMV0gLSBwb2ludFsxXSkgKiAocFsxXSAtIHBvaW50WzFdKTtcbiAgICAgICAgICAgIGlmIChtaW5EaXN0ID09IG51bGwgfHwgZCA8IG1pbkRpc3QpIHtcbiAgICAgICAgICAgICAgICBtaW5EaXN0ID0gZDtcbiAgICAgICAgICAgICAgICBtaW5Qb2ludCA9IHA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pblBvaW50O1xuICAgIH1cbiAgICBfZmluZENvbm5lY3RlZChjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCwgc3RhY2ssIGtlZXBOb3RDb25uZWN0ZWQsIHZhbHVlKSB7XG4gICAgICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgcCA9IHN0YWNrLnNwbGljZSgwLCAxKVswXTtcbiAgICAgICAgICAgIGxldCB0ZXN0cztcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDYpIHtcbiAgICAgICAgICAgICAgICB0ZXN0cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgW3BbMF0gKyAyLCBwWzFdXSxcbiAgICAgICAgICAgICAgICAgICAgW3BbMF0gKyAxLCBwWzFdIC0gMV0sXG4gICAgICAgICAgICAgICAgICAgIFtwWzBdIC0gMSwgcFsxXSAtIDFdLFxuICAgICAgICAgICAgICAgICAgICBbcFswXSAtIDIsIHBbMV1dLFxuICAgICAgICAgICAgICAgICAgICBbcFswXSAtIDEsIHBbMV0gKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgW3BbMF0gKyAxLCBwWzFdICsgMV0sXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlc3RzID0gW1xuICAgICAgICAgICAgICAgICAgICBbcFswXSArIDEsIHBbMV1dLFxuICAgICAgICAgICAgICAgICAgICBbcFswXSAtIDEsIHBbMV1dLFxuICAgICAgICAgICAgICAgICAgICBbcFswXSwgcFsxXSArIDFdLFxuICAgICAgICAgICAgICAgICAgICBbcFswXSwgcFsxXSAtIDFdXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGVzdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5fcG9pbnRLZXkodGVzdHNbaV0pO1xuICAgICAgICAgICAgICAgIGlmIChjb25uZWN0ZWRba2V5XSA9PSBudWxsICYmIHRoaXMuX2ZyZWVTcGFjZSh0ZXN0c1tpXVswXSwgdGVzdHNbaV1bMV0sIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25uZWN0ZWRba2V5XSA9IHRlc3RzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWtlZXBOb3RDb25uZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub3RDb25uZWN0ZWRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRlc3RzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3R1bm5lbFRvQ29ubmVjdGVkKHRvLCBmcm9tLCBjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCwgdmFsdWUsIGNvbm5lY3Rpb25DYWxsYmFjaykge1xuICAgICAgICBsZXQgYSwgYjtcbiAgICAgICAgaWYgKGZyb21bMF0gPCB0b1swXSkge1xuICAgICAgICAgICAgYSA9IGZyb207XG4gICAgICAgICAgICBiID0gdG87XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhID0gdG87XG4gICAgICAgICAgICBiID0gZnJvbTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCB4eCA9IGFbMF07IHh4IDw9IGJbMF07IHh4KyspIHtcbiAgICAgICAgICAgIHRoaXMuX21hcFt4eF1bYVsxXV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIGxldCBwID0gW3h4LCBhWzFdXTtcbiAgICAgICAgICAgIGxldCBwa2V5ID0gdGhpcy5fcG9pbnRLZXkocCk7XG4gICAgICAgICAgICBjb25uZWN0ZWRbcGtleV0gPSBwO1xuICAgICAgICAgICAgZGVsZXRlIG5vdENvbm5lY3RlZFtwa2V5XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29ubmVjdGlvbkNhbGxiYWNrICYmIGFbMF0gPCBiWzBdKSB7XG4gICAgICAgICAgICBjb25uZWN0aW9uQ2FsbGJhY2soYSwgW2JbMF0sIGFbMV1dKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB4IGlzIG5vdyBmaXhlZFxuICAgICAgICBsZXQgeCA9IGJbMF07XG4gICAgICAgIGlmIChmcm9tWzFdIDwgdG9bMV0pIHtcbiAgICAgICAgICAgIGEgPSBmcm9tO1xuICAgICAgICAgICAgYiA9IHRvO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYSA9IHRvO1xuICAgICAgICAgICAgYiA9IGZyb207XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgeXkgPSBhWzFdOyB5eSA8IGJbMV07IHl5KyspIHtcbiAgICAgICAgICAgIHRoaXMuX21hcFt4XVt5eV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIGxldCBwID0gW3gsIHl5XTtcbiAgICAgICAgICAgIGxldCBwa2V5ID0gdGhpcy5fcG9pbnRLZXkocCk7XG4gICAgICAgICAgICBjb25uZWN0ZWRbcGtleV0gPSBwO1xuICAgICAgICAgICAgZGVsZXRlIG5vdENvbm5lY3RlZFtwa2V5XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29ubmVjdGlvbkNhbGxiYWNrICYmIGFbMV0gPCBiWzFdKSB7XG4gICAgICAgICAgICBjb25uZWN0aW9uQ2FsbGJhY2soW2JbMF0sIGFbMV1dLCBbYlswXSwgYlsxXV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIF90dW5uZWxUb0Nvbm5lY3RlZDYodG8sIGZyb20sIGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCB2YWx1ZSwgY29ubmVjdGlvbkNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBhLCBiO1xuICAgICAgICBpZiAoZnJvbVswXSA8IHRvWzBdKSB7XG4gICAgICAgICAgICBhID0gZnJvbTtcbiAgICAgICAgICAgIGIgPSB0bztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGEgPSB0bztcbiAgICAgICAgICAgIGIgPSBmcm9tO1xuICAgICAgICB9XG4gICAgICAgIC8vIHR1bm5lbCBkaWFnb25hbGx5IHVudGlsIGhvcml6b250YWxseSBsZXZlbFxuICAgICAgICBsZXQgeHggPSBhWzBdO1xuICAgICAgICBsZXQgeXkgPSBhWzFdO1xuICAgICAgICB3aGlsZSAoISh4eCA9PSBiWzBdICYmIHl5ID09IGJbMV0pKSB7XG4gICAgICAgICAgICBsZXQgc3RlcFdpZHRoID0gMjtcbiAgICAgICAgICAgIGlmICh5eSA8IGJbMV0pIHtcbiAgICAgICAgICAgICAgICB5eSsrO1xuICAgICAgICAgICAgICAgIHN0ZXBXaWR0aCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh5eSA+IGJbMV0pIHtcbiAgICAgICAgICAgICAgICB5eS0tO1xuICAgICAgICAgICAgICAgIHN0ZXBXaWR0aCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeHggPCBiWzBdKSB7XG4gICAgICAgICAgICAgICAgeHggKz0gc3RlcFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoeHggPiBiWzBdKSB7XG4gICAgICAgICAgICAgICAgeHggLT0gc3RlcFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYlsxXSAlIDIpIHtcbiAgICAgICAgICAgICAgICAvLyBXb24ndCBzdGVwIG91dHNpZGUgbWFwIGlmIGRlc3RpbmF0aW9uIG9uIGlzIG1hcCdzIHJpZ2h0IGVkZ2VcbiAgICAgICAgICAgICAgICB4eCAtPSBzdGVwV2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkaXR0byBmb3IgbGVmdCBlZGdlXG4gICAgICAgICAgICAgICAgeHggKz0gc3RlcFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fbWFwW3h4XVt5eV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIGxldCBwID0gW3h4LCB5eV07XG4gICAgICAgICAgICBsZXQgcGtleSA9IHRoaXMuX3BvaW50S2V5KHApO1xuICAgICAgICAgICAgY29ubmVjdGVkW3BrZXldID0gcDtcbiAgICAgICAgICAgIGRlbGV0ZSBub3RDb25uZWN0ZWRbcGtleV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbm5lY3Rpb25DYWxsYmFjaykge1xuICAgICAgICAgICAgY29ubmVjdGlvbkNhbGxiYWNrKGZyb20sIHRvKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfZnJlZVNwYWNlKHgsIHksIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB4ID49IDAgJiYgeCA8IHRoaXMuX3dpZHRoICYmIHkgPj0gMCAmJiB5IDwgdGhpcy5faGVpZ2h0ICYmIHRoaXMuX21hcFt4XVt5XSA9PSB2YWx1ZTtcbiAgICB9XG4gICAgX3BvaW50S2V5KHApIHsgcmV0dXJuIHBbMF0gKyBcIi5cIiArIHBbMV07IH1cbn1cbiIsImltcG9ydCBEdW5nZW9uIGZyb20gXCIuL2R1bmdlb24uanNcIjtcbmltcG9ydCB7IFJvb20sIENvcnJpZG9yIH0gZnJvbSBcIi4vZmVhdHVyZXMuanNcIjtcbmltcG9ydCBSTkcgZnJvbSBcIi4uL3JuZy5qc1wiO1xuaW1wb3J0IHsgRElSUyB9IGZyb20gXCIuLi9jb25zdGFudHMuanNcIjtcbmNvbnN0IEZFQVRVUkVTID0ge1xuICAgIFwicm9vbVwiOiBSb29tLFxuICAgIFwiY29ycmlkb3JcIjogQ29ycmlkb3Jcbn07XG4vKipcbiAqIFJhbmRvbSBkdW5nZW9uIGdlbmVyYXRvciB1c2luZyBodW1hbi1saWtlIGRpZ2dpbmcgcGF0dGVybnMuXG4gKiBIZWF2aWx5IGJhc2VkIG9uIE1pa2UgQW5kZXJzb24ncyBpZGVhcyBmcm9tIHRoZSBcIlR5cmFudFwiIGFsZ28sIG1lbnRpb25lZCBhdFxuICogaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9RHVuZ2Vvbi1CdWlsZGluZ19BbGdvcml0aG0uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpZ2dlciBleHRlbmRzIER1bmdlb24ge1xuICAgIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBzdXBlcih3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgcm9vbVdpZHRoOiBbMywgOV0sXG4gICAgICAgICAgICByb29tSGVpZ2h0OiBbMywgNV0sXG4gICAgICAgICAgICBjb3JyaWRvckxlbmd0aDogWzMsIDEwXSxcbiAgICAgICAgICAgIGR1Z1BlcmNlbnRhZ2U6IDAuMixcbiAgICAgICAgICAgIHRpbWVMaW1pdDogMTAwMCAvKiB3ZSBzdG9wIGFmdGVyIHRoaXMgbXVjaCB0aW1lIGhhcyBwYXNzZWQgKG1zZWMpICovXG4gICAgICAgIH0sIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9mZWF0dXJlcyA9IHtcbiAgICAgICAgICAgIFwicm9vbVwiOiA0LFxuICAgICAgICAgICAgXCJjb3JyaWRvclwiOiA0XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX21hcCA9IFtdO1xuICAgICAgICB0aGlzLl9mZWF0dXJlQXR0ZW1wdHMgPSAyMDsgLyogaG93IG1hbnkgdGltZXMgZG8gd2UgdHJ5IHRvIGNyZWF0ZSBhIGZlYXR1cmUgb24gYSBzdWl0YWJsZSB3YWxsICovXG4gICAgICAgIHRoaXMuX3dhbGxzID0ge307IC8qIHRoZXNlIGFyZSBhdmFpbGFibGUgZm9yIGRpZ2dpbmcgKi9cbiAgICAgICAgdGhpcy5fZHVnID0gMDtcbiAgICAgICAgdGhpcy5fZGlnQ2FsbGJhY2sgPSB0aGlzLl9kaWdDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrID0gdGhpcy5fY2FuQmVEdWdDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9pc1dhbGxDYWxsYmFjayA9IHRoaXMuX2lzV2FsbENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX3ByaW9yaXR5V2FsbENhbGxiYWNrID0gdGhpcy5fcHJpb3JpdHlXYWxsQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICB9XG4gICAgY3JlYXRlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX3Jvb21zID0gW107XG4gICAgICAgIHRoaXMuX2NvcnJpZG9ycyA9IFtdO1xuICAgICAgICB0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xuICAgICAgICB0aGlzLl93YWxscyA9IHt9O1xuICAgICAgICB0aGlzLl9kdWcgPSAwO1xuICAgICAgICBsZXQgYXJlYSA9ICh0aGlzLl93aWR0aCAtIDIpICogKHRoaXMuX2hlaWdodCAtIDIpO1xuICAgICAgICB0aGlzLl9maXJzdFJvb20oKTtcbiAgICAgICAgbGV0IHQxID0gRGF0ZS5ub3coKTtcbiAgICAgICAgbGV0IHByaW9yaXR5V2FsbHM7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIHByaW9yaXR5V2FsbHMgPSAwO1xuICAgICAgICAgICAgbGV0IHQyID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGlmICh0MiAtIHQxID4gdGhpcy5fb3B0aW9ucy50aW1lTGltaXQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIGZpbmQgYSBnb29kIHdhbGwgKi9cbiAgICAgICAgICAgIGxldCB3YWxsID0gdGhpcy5fZmluZFdhbGwoKTtcbiAgICAgICAgICAgIGlmICghd2FsbCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSAvKiBubyBtb3JlIHdhbGxzICovXG4gICAgICAgICAgICBsZXQgcGFydHMgPSB3YWxsLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIGxldCB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xuICAgICAgICAgICAgbGV0IHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XG4gICAgICAgICAgICBsZXQgZGlyID0gdGhpcy5fZ2V0RGlnZ2luZ0RpcmVjdGlvbih4LCB5KTtcbiAgICAgICAgICAgIGlmICghZGlyKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IC8qIHRoaXMgd2FsbCBpcyBub3Qgc3VpdGFibGUgKi9cbiAgICAgICAgICAgIC8vXHRcdGNvbnNvbGUubG9nKFwid2FsbFwiLCB4LCB5KTtcbiAgICAgICAgICAgIC8qIHRyeSBhZGRpbmcgYSBmZWF0dXJlICovXG4gICAgICAgICAgICBsZXQgZmVhdHVyZUF0dGVtcHRzID0gMDtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBmZWF0dXJlQXR0ZW1wdHMrKztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHJ5RmVhdHVyZSh4LCB5LCBkaXJbMF0sIGRpclsxXSkpIHsgLyogZmVhdHVyZSBhZGRlZCAqL1xuICAgICAgICAgICAgICAgICAgICAvL2lmICh0aGlzLl9yb29tcy5sZW5ndGggKyB0aGlzLl9jb3JyaWRvcnMubGVuZ3RoID09IDIpIHsgdGhpcy5fcm9vbXNbMF0uYWRkRG9vcih4LCB5KTsgfSAvKiBmaXJzdCByb29tIG9maWNpYWxseSBoYXMgZG9vcnMgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlU3Vycm91bmRpbmdXYWxscyh4LCB5KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlU3Vycm91bmRpbmdXYWxscyh4IC0gZGlyWzBdLCB5IC0gZGlyWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSAoZmVhdHVyZUF0dGVtcHRzIDwgdGhpcy5fZmVhdHVyZUF0dGVtcHRzKTtcbiAgICAgICAgICAgIGZvciAobGV0IGlkIGluIHRoaXMuX3dhbGxzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3dhbGxzW2lkXSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHlXYWxscysrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAodGhpcy5fZHVnIC8gYXJlYSA8IHRoaXMuX29wdGlvbnMuZHVnUGVyY2VudGFnZSB8fCBwcmlvcml0eVdhbGxzKTsgLyogZml4bWUgbnVtYmVyIG9mIHByaW9yaXR5IHdhbGxzICovXG4gICAgICAgIHRoaXMuX2FkZERvb3JzKCk7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl93aWR0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9oZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl93YWxscyA9IHt9O1xuICAgICAgICB0aGlzLl9tYXAgPSBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIF9kaWdDYWxsYmFjayh4LCB5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT0gMCB8fCB2YWx1ZSA9PSAyKSB7IC8qIGVtcHR5ICovXG4gICAgICAgICAgICB0aGlzLl9tYXBbeF1beV0gPSAwO1xuICAgICAgICAgICAgdGhpcy5fZHVnKys7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8qIHdhbGwgKi9cbiAgICAgICAgICAgIHRoaXMuX3dhbGxzW3ggKyBcIixcIiArIHldID0gMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfaXNXYWxsQ2FsbGJhY2soeCwgeSkge1xuICAgICAgICBpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5ID49IHRoaXMuX2hlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xuICAgIH1cbiAgICBfY2FuQmVEdWdDYWxsYmFjayh4LCB5KSB7XG4gICAgICAgIGlmICh4IDwgMSB8fCB5IDwgMSB8fCB4ICsgMSA+PSB0aGlzLl93aWR0aCB8fCB5ICsgMSA+PSB0aGlzLl9oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcbiAgICB9XG4gICAgX3ByaW9yaXR5V2FsbENhbGxiYWNrKHgsIHkpIHsgdGhpcy5fd2FsbHNbeCArIFwiLFwiICsgeV0gPSAyOyB9XG4gICAgO1xuICAgIF9maXJzdFJvb20oKSB7XG4gICAgICAgIGxldCBjeCA9IE1hdGguZmxvb3IodGhpcy5fd2lkdGggLyAyKTtcbiAgICAgICAgbGV0IGN5ID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQgLyAyKTtcbiAgICAgICAgbGV0IHJvb20gPSBSb29tLmNyZWF0ZVJhbmRvbUNlbnRlcihjeCwgY3ksIHRoaXMuX29wdGlvbnMpO1xuICAgICAgICB0aGlzLl9yb29tcy5wdXNoKHJvb20pO1xuICAgICAgICByb29tLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBhIHN1aXRhYmxlIHdhbGxcbiAgICAgKi9cbiAgICBfZmluZFdhbGwoKSB7XG4gICAgICAgIGxldCBwcmlvMSA9IFtdO1xuICAgICAgICBsZXQgcHJpbzIgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5fd2FsbHMpIHtcbiAgICAgICAgICAgIGxldCBwcmlvID0gdGhpcy5fd2FsbHNbaWRdO1xuICAgICAgICAgICAgaWYgKHByaW8gPT0gMikge1xuICAgICAgICAgICAgICAgIHByaW8yLnB1c2goaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJpbzEucHVzaChpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFyciA9IChwcmlvMi5sZW5ndGggPyBwcmlvMiA6IHByaW8xKTtcbiAgICAgICAgaWYgKCFhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSAvKiBubyB3YWxscyA6LyAqL1xuICAgICAgICBsZXQgaWQgPSBSTkcuZ2V0SXRlbShhcnIuc29ydCgpKTsgLy8gc29ydCB0byBtYWtlIHRoZSBvcmRlciBkZXRlcm1pbmlzdGljXG4gICAgICAgIGRlbGV0ZSB0aGlzLl93YWxsc1tpZF07XG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJpZXMgYWRkaW5nIGEgZmVhdHVyZVxuICAgICAqIEByZXR1cm5zIHtib29sfSB3YXMgdGhpcyBhIHN1Y2Nlc3NmdWwgdHJ5P1xuICAgICAqL1xuICAgIF90cnlGZWF0dXJlKHgsIHksIGR4LCBkeSkge1xuICAgICAgICBsZXQgZmVhdHVyZU5hbWUgPSBSTkcuZ2V0V2VpZ2h0ZWRWYWx1ZSh0aGlzLl9mZWF0dXJlcyk7XG4gICAgICAgIGxldCBjdG9yID0gRkVBVFVSRVNbZmVhdHVyZU5hbWVdO1xuICAgICAgICBsZXQgZmVhdHVyZSA9IGN0b3IuY3JlYXRlUmFuZG9tQXQoeCwgeSwgZHgsIGR5LCB0aGlzLl9vcHRpb25zKTtcbiAgICAgICAgaWYgKCFmZWF0dXJlLmlzVmFsaWQodGhpcy5faXNXYWxsQ2FsbGJhY2ssIHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAvL1x0XHRjb25zb2xlLmxvZyhcIm5vdCB2YWxpZFwiKTtcbiAgICAgICAgICAgIC8vXHRcdGZlYXR1cmUuZGVidWcoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmZWF0dXJlLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XG4gICAgICAgIC8vXHRmZWF0dXJlLmRlYnVnKCk7XG4gICAgICAgIGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUm9vbSkge1xuICAgICAgICAgICAgdGhpcy5fcm9vbXMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIENvcnJpZG9yKSB7XG4gICAgICAgICAgICBmZWF0dXJlLmNyZWF0ZVByaW9yaXR5V2FsbHModGhpcy5fcHJpb3JpdHlXYWxsQ2FsbGJhY2spO1xuICAgICAgICAgICAgdGhpcy5fY29ycmlkb3JzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIF9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzKGN4LCBjeSkge1xuICAgICAgICBsZXQgZGVsdGFzID0gRElSU1s0XTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWx0YXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkZWx0YSA9IGRlbHRhc1tpXTtcbiAgICAgICAgICAgIGxldCB4ID0gY3ggKyBkZWx0YVswXTtcbiAgICAgICAgICAgIGxldCB5ID0gY3kgKyBkZWx0YVsxXTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl93YWxsc1t4ICsgXCIsXCIgKyB5XTtcbiAgICAgICAgICAgIHggPSBjeCArIDIgKiBkZWx0YVswXTtcbiAgICAgICAgICAgIHkgPSBjeSArIDIgKiBkZWx0YVsxXTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl93YWxsc1t4ICsgXCIsXCIgKyB5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHZlY3RvciBpbiBcImRpZ2dpbmdcIiBkaXJlY3Rpb24sIG9yIGZhbHNlLCBpZiB0aGlzIGRvZXMgbm90IGV4aXN0IChvciBpcyBub3QgdW5pcXVlKVxuICAgICAqL1xuICAgIF9nZXREaWdnaW5nRGlyZWN0aW9uKGN4LCBjeSkge1xuICAgICAgICBpZiAoY3ggPD0gMCB8fCBjeSA8PSAwIHx8IGN4ID49IHRoaXMuX3dpZHRoIC0gMSB8fCBjeSA+PSB0aGlzLl9oZWlnaHQgLSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgbGV0IGRlbHRhcyA9IERJUlNbNF07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVsdGFzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGVsdGEgPSBkZWx0YXNbaV07XG4gICAgICAgICAgICBsZXQgeCA9IGN4ICsgZGVsdGFbMF07XG4gICAgICAgICAgICBsZXQgeSA9IGN5ICsgZGVsdGFbMV07XG4gICAgICAgICAgICBpZiAoIXRoaXMuX21hcFt4XVt5XSkgeyAvKiB0aGVyZSBhbHJlYWR5IGlzIGFub3RoZXIgZW1wdHkgbmVpZ2hib3IhICovXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZGVsdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyogbm8gZW1wdHkgbmVpZ2hib3IgKi9cbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbLXJlc3VsdFswXSwgLXJlc3VsdFsxXV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpbmQgZW1wdHkgc3BhY2VzIHN1cnJvdW5kaW5nIHJvb21zLCBhbmQgYXBwbHkgZG9vcnMuXG4gICAgICovXG4gICAgX2FkZERvb3JzKCkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuX21hcDtcbiAgICAgICAgZnVuY3Rpb24gaXNXYWxsQ2FsbGJhY2soeCwgeSkge1xuICAgICAgICAgICAgcmV0dXJuIChkYXRhW3hdW3ldID09IDEpO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9yb29tcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvb20gPSB0aGlzLl9yb29tc1tpXTtcbiAgICAgICAgICAgIHJvb20uY2xlYXJEb29ycygpO1xuICAgICAgICAgICAgcm9vbS5hZGREb29ycyhpc1dhbGxDYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgTWFwIGZyb20gXCIuL21hcC5qc1wiO1xuaW1wb3J0IFJORyBmcm9tIFwiLi4vcm5nLmpzXCI7XG4vKipcbiAqIEpvaW4gbGlzdHMgd2l0aCBcImlcIiBhbmQgXCJpKzFcIlxuICovXG5mdW5jdGlvbiBhZGRUb0xpc3QoaSwgTCwgUikge1xuICAgIFJbTFtpICsgMV1dID0gUltpXTtcbiAgICBMW1JbaV1dID0gTFtpICsgMV07XG4gICAgUltpXSA9IGkgKyAxO1xuICAgIExbaSArIDFdID0gaTtcbn1cbi8qKlxuICogUmVtb3ZlIFwiaVwiIGZyb20gaXRzIGxpc3RcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRnJvbUxpc3QoaSwgTCwgUikge1xuICAgIFJbTFtpXV0gPSBSW2ldO1xuICAgIExbUltpXV0gPSBMW2ldO1xuICAgIFJbaV0gPSBpO1xuICAgIExbaV0gPSBpO1xufVxuLyoqXG4gKiBNYXplIGdlbmVyYXRvciAtIEVsbGVyJ3MgYWxnb3JpdGhtXG4gKiBTZWUgaHR0cDovL2hvbWVwYWdlcy5jd2kubmwvfnRyb21wL21hemUuaHRtbCBmb3IgZXhwbGFuYXRpb25cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxsZXJNYXplIGV4dGVuZHMgTWFwIHtcbiAgICBjcmVhdGUoY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IG1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG4gICAgICAgIGxldCB3ID0gTWF0aC5jZWlsKCh0aGlzLl93aWR0aCAtIDIpIC8gMik7XG4gICAgICAgIGxldCByYW5kID0gOSAvIDI0O1xuICAgICAgICBsZXQgTCA9IFtdO1xuICAgICAgICBsZXQgUiA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHc7IGkrKykge1xuICAgICAgICAgICAgTC5wdXNoKGkpO1xuICAgICAgICAgICAgUi5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIEwucHVzaCh3IC0gMSk7IC8qIGZha2Ugc3RvcC1ibG9jayBhdCB0aGUgcmlnaHQgc2lkZSAqL1xuICAgICAgICBsZXQgajtcbiAgICAgICAgZm9yIChqID0gMTsgaiArIDMgPCB0aGlzLl9oZWlnaHQ7IGogKz0gMikge1xuICAgICAgICAgICAgLyogb25lIHJvdyAqL1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3OyBpKyspIHtcbiAgICAgICAgICAgICAgICAvKiBjZWxsIGNvb3JkcyAod2lsbCBiZSBhbHdheXMgZW1wdHkpICovXG4gICAgICAgICAgICAgICAgbGV0IHggPSAyICogaSArIDE7XG4gICAgICAgICAgICAgICAgbGV0IHkgPSBqO1xuICAgICAgICAgICAgICAgIG1hcFt4XVt5XSA9IDA7XG4gICAgICAgICAgICAgICAgLyogcmlnaHQgY29ubmVjdGlvbiAqL1xuICAgICAgICAgICAgICAgIGlmIChpICE9IExbaSArIDFdICYmIFJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFRvTGlzdChpLCBMLCBSKTtcbiAgICAgICAgICAgICAgICAgICAgbWFwW3ggKyAxXVt5XSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qIGJvdHRvbSBjb25uZWN0aW9uICovXG4gICAgICAgICAgICAgICAgaWYgKGkgIT0gTFtpXSAmJiBSTkcuZ2V0VW5pZm9ybSgpID4gcmFuZCkge1xuICAgICAgICAgICAgICAgICAgICAvKiByZW1vdmUgY29ubmVjdGlvbiAqL1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVGcm9tTGlzdChpLCBMLCBSKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIGNyZWF0ZSBjb25uZWN0aW9uICovXG4gICAgICAgICAgICAgICAgICAgIG1hcFt4XVt5ICsgMV0gPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiBsYXN0IHJvdyAqL1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHc7IGkrKykge1xuICAgICAgICAgICAgLyogY2VsbCBjb29yZHMgKHdpbGwgYmUgYWx3YXlzIGVtcHR5KSAqL1xuICAgICAgICAgICAgbGV0IHggPSAyICogaSArIDE7XG4gICAgICAgICAgICBsZXQgeSA9IGo7XG4gICAgICAgICAgICBtYXBbeF1beV0gPSAwO1xuICAgICAgICAgICAgLyogcmlnaHQgY29ubmVjdGlvbiAqL1xuICAgICAgICAgICAgaWYgKGkgIT0gTFtpICsgMV0gJiYgKGkgPT0gTFtpXSB8fCBSTkcuZ2V0VW5pZm9ybSgpID4gcmFuZCkpIHtcbiAgICAgICAgICAgICAgICAvKiBkaWcgcmlnaHQgYWxzbyBpZiB0aGUgY2VsbCBpcyBzZXBhcmF0ZWQsIHNvIGl0IGdldHMgY29ubmVjdGVkIHRvIHRoZSByZXN0IG9mIG1hemUgKi9cbiAgICAgICAgICAgICAgICBhZGRUb0xpc3QoaSwgTCwgUik7XG4gICAgICAgICAgICAgICAgbWFwW3ggKyAxXVt5XSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZW1vdmVGcm9tTGlzdChpLCBMLCBSKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3dpZHRoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5faGVpZ2h0OyBqKyspIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhpLCBqLCBtYXBbaV1bal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCBNYXAgZnJvbSBcIi4vbWFwLmpzXCI7XG5pbXBvcnQgUk5HIGZyb20gXCIuLi9ybmcuanNcIjtcbi8qKlxuICogQGNsYXNzIFJlY3Vyc2l2ZWx5IGRpdmlkZWQgbWF6ZSwgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NYXplX2dlbmVyYXRpb25fYWxnb3JpdGhtI1JlY3Vyc2l2ZV9kaXZpc2lvbl9tZXRob2RcbiAqIEBhdWdtZW50cyBST1QuTWFwXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpdmlkZWRNYXplIGV4dGVuZHMgTWFwIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5fc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5fbWFwID0gW107XG4gICAgfVxuICAgIGNyZWF0ZShjYWxsYmFjaykge1xuICAgICAgICBsZXQgdyA9IHRoaXMuX3dpZHRoO1xuICAgICAgICBsZXQgaCA9IHRoaXMuX2hlaWdodDtcbiAgICAgICAgdGhpcy5fbWFwID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdzsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXAucHVzaChbXSk7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGg7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBib3JkZXIgPSAoaSA9PSAwIHx8IGogPT0gMCB8fCBpICsgMSA9PSB3IHx8IGogKyAxID09IGgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcFtpXS5wdXNoKGJvcmRlciA/IDEgOiAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdGFjayA9IFtcbiAgICAgICAgICAgIFsxLCAxLCB3IC0gMiwgaCAtIDJdXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMuX3Byb2Nlc3MoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3OyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaDsgaisrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soaSwgaiwgdGhpcy5fbWFwW2ldW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXAgPSBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIF9wcm9jZXNzKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5fc3RhY2subGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgcm9vbSA9IHRoaXMuX3N0YWNrLnNoaWZ0KCk7IC8qIFtsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b21dICovXG4gICAgICAgICAgICB0aGlzLl9wYXJ0aXRpb25Sb29tKHJvb20pO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9wYXJ0aXRpb25Sb29tKHJvb20pIHtcbiAgICAgICAgbGV0IGF2YWlsWCA9IFtdO1xuICAgICAgICBsZXQgYXZhaWxZID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSByb29tWzBdICsgMTsgaSA8IHJvb21bMl07IGkrKykge1xuICAgICAgICAgICAgbGV0IHRvcCA9IHRoaXMuX21hcFtpXVtyb29tWzFdIC0gMV07XG4gICAgICAgICAgICBsZXQgYm90dG9tID0gdGhpcy5fbWFwW2ldW3Jvb21bM10gKyAxXTtcbiAgICAgICAgICAgIGlmICh0b3AgJiYgYm90dG9tICYmICEoaSAlIDIpKSB7XG4gICAgICAgICAgICAgICAgYXZhaWxYLnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaiA9IHJvb21bMV0gKyAxOyBqIDwgcm9vbVszXTsgaisrKSB7XG4gICAgICAgICAgICBsZXQgbGVmdCA9IHRoaXMuX21hcFtyb29tWzBdIC0gMV1bal07XG4gICAgICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLl9tYXBbcm9vbVsyXSArIDFdW2pdO1xuICAgICAgICAgICAgaWYgKGxlZnQgJiYgcmlnaHQgJiYgIShqICUgMikpIHtcbiAgICAgICAgICAgICAgICBhdmFpbFkucHVzaChqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF2YWlsWC5sZW5ndGggfHwgIWF2YWlsWS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeCA9IFJORy5nZXRJdGVtKGF2YWlsWCk7XG4gICAgICAgIGxldCB5ID0gUk5HLmdldEl0ZW0oYXZhaWxZKTtcbiAgICAgICAgdGhpcy5fbWFwW3hdW3ldID0gMTtcbiAgICAgICAgbGV0IHdhbGxzID0gW107XG4gICAgICAgIGxldCB3ID0gW107XG4gICAgICAgIHdhbGxzLnB1c2godyk7IC8qIGxlZnQgcGFydCAqL1xuICAgICAgICBmb3IgKGxldCBpID0gcm9vbVswXTsgaSA8IHg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fbWFwW2ldW3ldID0gMTtcbiAgICAgICAgICAgIHcucHVzaChbaSwgeV0pO1xuICAgICAgICB9XG4gICAgICAgIHcgPSBbXTtcbiAgICAgICAgd2FsbHMucHVzaCh3KTsgLyogcmlnaHQgcGFydCAqL1xuICAgICAgICBmb3IgKGxldCBpID0geCArIDE7IGkgPD0gcm9vbVsyXTsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXBbaV1beV0gPSAxO1xuICAgICAgICAgICAgdy5wdXNoKFtpLCB5XSk7XG4gICAgICAgIH1cbiAgICAgICAgdyA9IFtdO1xuICAgICAgICB3YWxscy5wdXNoKHcpOyAvKiB0b3AgcGFydCAqL1xuICAgICAgICBmb3IgKGxldCBqID0gcm9vbVsxXTsgaiA8IHk7IGorKykge1xuICAgICAgICAgICAgdGhpcy5fbWFwW3hdW2pdID0gMTtcbiAgICAgICAgICAgIHcucHVzaChbeCwgal0pO1xuICAgICAgICB9XG4gICAgICAgIHcgPSBbXTtcbiAgICAgICAgd2FsbHMucHVzaCh3KTsgLyogYm90dG9tIHBhcnQgKi9cbiAgICAgICAgZm9yIChsZXQgaiA9IHkgKyAxOyBqIDw9IHJvb21bM107IGorKykge1xuICAgICAgICAgICAgdGhpcy5fbWFwW3hdW2pdID0gMTtcbiAgICAgICAgICAgIHcucHVzaChbeCwgal0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzb2xpZCA9IFJORy5nZXRJdGVtKHdhbGxzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3YWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHcgPSB3YWxsc1tpXTtcbiAgICAgICAgICAgIGlmICh3ID09IHNvbGlkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgaG9sZSA9IFJORy5nZXRJdGVtKHcpO1xuICAgICAgICAgICAgdGhpcy5fbWFwW2hvbGVbMF1dW2hvbGVbMV1dID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdGFjay5wdXNoKFtyb29tWzBdLCByb29tWzFdLCB4IC0gMSwgeSAtIDFdKTsgLyogbGVmdCB0b3AgKi9cbiAgICAgICAgdGhpcy5fc3RhY2sucHVzaChbeCArIDEsIHJvb21bMV0sIHJvb21bMl0sIHkgLSAxXSk7IC8qIHJpZ2h0IHRvcCAqL1xuICAgICAgICB0aGlzLl9zdGFjay5wdXNoKFtyb29tWzBdLCB5ICsgMSwgeCAtIDEsIHJvb21bM11dKTsgLyogbGVmdCBib3R0b20gKi9cbiAgICAgICAgdGhpcy5fc3RhY2sucHVzaChbeCArIDEsIHkgKyAxLCByb29tWzJdLCByb29tWzNdXSk7IC8qIHJpZ2h0IGJvdHRvbSAqL1xuICAgIH1cbn1cbiIsImltcG9ydCBNYXAgZnJvbSBcIi4vbWFwLmpzXCI7XG5pbXBvcnQgUk5HIGZyb20gXCIuLi9ybmcuanNcIjtcbi8qKlxuICogSWNleSdzIE1hemUgZ2VuZXJhdG9yXG4gKiBTZWUgaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9U2ltcGxlX21hemUgZm9yIGV4cGxhbmF0aW9uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEljZXlNYXplIGV4dGVuZHMgTWFwIHtcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0LCByZWd1bGFyaXR5ID0gMCkge1xuICAgICAgICBzdXBlcih3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fcmVndWxhcml0eSA9IHJlZ3VsYXJpdHk7XG4gICAgICAgIHRoaXMuX21hcCA9IFtdO1xuICAgIH1cbiAgICBjcmVhdGUoY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5fd2lkdGg7XG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XG4gICAgICAgIGxldCBtYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xuICAgICAgICB3aWR0aCAtPSAod2lkdGggJSAyID8gMSA6IDIpO1xuICAgICAgICBoZWlnaHQgLT0gKGhlaWdodCAlIDIgPyAxIDogMik7XG4gICAgICAgIGxldCBjeCA9IDA7XG4gICAgICAgIGxldCBjeSA9IDA7XG4gICAgICAgIGxldCBueCA9IDA7XG4gICAgICAgIGxldCBueSA9IDA7XG4gICAgICAgIGxldCBkb25lID0gMDtcbiAgICAgICAgbGV0IGJsb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IGRpcnMgPSBbXG4gICAgICAgICAgICBbMCwgMF0sXG4gICAgICAgICAgICBbMCwgMF0sXG4gICAgICAgICAgICBbMCwgMF0sXG4gICAgICAgICAgICBbMCwgMF1cbiAgICAgICAgXTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgY3ggPSAxICsgMiAqIE1hdGguZmxvb3IoUk5HLmdldFVuaWZvcm0oKSAqICh3aWR0aCAtIDEpIC8gMik7XG4gICAgICAgICAgICBjeSA9IDEgKyAyICogTWF0aC5mbG9vcihSTkcuZ2V0VW5pZm9ybSgpICogKGhlaWdodCAtIDEpIC8gMik7XG4gICAgICAgICAgICBpZiAoIWRvbmUpIHtcbiAgICAgICAgICAgICAgICBtYXBbY3hdW2N5XSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIW1hcFtjeF1bY3ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmFuZG9taXplKGRpcnMpO1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguZmxvb3IoUk5HLmdldFVuaWZvcm0oKSAqICh0aGlzLl9yZWd1bGFyaXR5ICsgMSkpID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JhbmRvbWl6ZShkaXJzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBibG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG54ID0gY3ggKyBkaXJzW2ldWzBdICogMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG55ID0gY3kgKyBkaXJzW2ldWzFdICogMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc0ZyZWUobWFwLCBueCwgbnksIHdpZHRoLCBoZWlnaHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwW254XVtueV0gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFtjeCArIGRpcnNbaV1bMF1dW2N5ICsgZGlyc1tpXVsxXV0gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN4ID0gbng7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3kgPSBueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoIWJsb2NrZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlIChkb25lICsgMSA8IHdpZHRoICogaGVpZ2h0IC8gNCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fd2lkdGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9oZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGksIGosIG1hcFtpXVtqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWFwID0gW107XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBfcmFuZG9taXplKGRpcnMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIGRpcnNbaV1bMF0gPSAwO1xuICAgICAgICAgICAgZGlyc1tpXVsxXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChNYXRoLmZsb29yKFJORy5nZXRVbmlmb3JtKCkgKiA0KSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGRpcnNbMF1bMF0gPSAtMTtcbiAgICAgICAgICAgICAgICBkaXJzWzFdWzBdID0gMTtcbiAgICAgICAgICAgICAgICBkaXJzWzJdWzFdID0gLTE7XG4gICAgICAgICAgICAgICAgZGlyc1szXVsxXSA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgZGlyc1szXVswXSA9IC0xO1xuICAgICAgICAgICAgICAgIGRpcnNbMl1bMF0gPSAxO1xuICAgICAgICAgICAgICAgIGRpcnNbMV1bMV0gPSAtMTtcbiAgICAgICAgICAgICAgICBkaXJzWzBdWzFdID0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkaXJzWzJdWzBdID0gLTE7XG4gICAgICAgICAgICAgICAgZGlyc1szXVswXSA9IDE7XG4gICAgICAgICAgICAgICAgZGlyc1swXVsxXSA9IC0xO1xuICAgICAgICAgICAgICAgIGRpcnNbMV1bMV0gPSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGRpcnNbMV1bMF0gPSAtMTtcbiAgICAgICAgICAgICAgICBkaXJzWzBdWzBdID0gMTtcbiAgICAgICAgICAgICAgICBkaXJzWzNdWzFdID0gLTE7XG4gICAgICAgICAgICAgICAgZGlyc1syXVsxXSA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2lzRnJlZShtYXAsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgaWYgKHggPCAxIHx8IHkgPCAxIHx8IHggPj0gd2lkdGggfHwgeSA+PSBoZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwW3hdW3ldO1xuICAgIH1cbn1cbiIsImltcG9ydCBNYXAgZnJvbSBcIi4vbWFwLmpzXCI7XG5pbXBvcnQgUk5HIGZyb20gXCIuLi9ybmcuanNcIjtcbmltcG9ydCB7IERJUlMgfSBmcm9tIFwiLi4vY29uc3RhbnRzLmpzXCI7XG4vKipcbiAqIER1bmdlb24gZ2VuZXJhdG9yIHdoaWNoIHVzZXMgdGhlIFwib3JnaW5hbFwiIFJvZ3VlIGR1bmdlb24gZ2VuZXJhdGlvbiBhbGdvcml0aG0uIFNlZSBodHRwOi8va3VvaS5jb20vfmthbWlrYXplL0dhbWVEZXNpZ24vYXJ0MDdfcm9ndWVfZHVuZ2Vvbi5waHBcbiAqIEBhdXRob3IgaHlha3VnZWlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ndWUgZXh0ZW5kcyBNYXAge1xuICAgIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHRoaXMubWFwID0gW107XG4gICAgICAgIHRoaXMucm9vbXMgPSBbXTtcbiAgICAgICAgdGhpcy5jb25uZWN0ZWRDZWxscyA9IFtdO1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICBjZWxsV2lkdGg6IDMsXG4gICAgICAgICAgICBjZWxsSGVpZ2h0OiAzIC8vICAgICBpZS4gYXMgYW4gYXJyYXkgd2l0aCBtaW4tbWF4IHZhbHVlcyBmb3IgZWFjaCBkaXJlY3Rpb24uLi4uXG4gICAgICAgIH0sIG9wdGlvbnMpO1xuICAgICAgICAvKlxuICAgICAgICBTZXQgdGhlIHJvb20gc2l6ZXMgYWNjb3JkaW5nIHRvIHRoZSBvdmVyLWFsbCB3aWR0aCBvZiB0aGUgbWFwLFxuICAgICAgICBhbmQgdGhlIGNlbGwgc2l6ZXMuXG4gICAgICAgICovXG4gICAgICAgIGlmICghb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcInJvb21XaWR0aFwiKSkge1xuICAgICAgICAgICAgb3B0aW9uc1tcInJvb21XaWR0aFwiXSA9IHRoaXMuX2NhbGN1bGF0ZVJvb21TaXplKHRoaXMuX3dpZHRoLCBvcHRpb25zW1wiY2VsbFdpZHRoXCJdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJyb29tSGVpZ2h0XCIpKSB7XG4gICAgICAgICAgICBvcHRpb25zW1wicm9vbUhlaWdodFwiXSA9IHRoaXMuX2NhbGN1bGF0ZVJvb21TaXplKHRoaXMuX2hlaWdodCwgb3B0aW9uc1tcImNlbGxIZWlnaHRcIl0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICBjcmVhdGUoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xuICAgICAgICB0aGlzLnJvb21zID0gW107XG4gICAgICAgIHRoaXMuY29ubmVjdGVkQ2VsbHMgPSBbXTtcbiAgICAgICAgdGhpcy5faW5pdFJvb21zKCk7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3RSb29tcygpO1xuICAgICAgICB0aGlzLl9jb25uZWN0VW5jb25uZWN0ZWRSb29tcygpO1xuICAgICAgICB0aGlzLl9jcmVhdGVSYW5kb21Sb29tQ29ubmVjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5fY3JlYXRlUm9vbXMoKTtcbiAgICAgICAgdGhpcy5fY3JlYXRlQ29ycmlkb3JzKCk7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl93aWR0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9oZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhpLCBqLCB0aGlzLm1hcFtpXVtqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBfY2FsY3VsYXRlUm9vbVNpemUoc2l6ZSwgY2VsbCkge1xuICAgICAgICBsZXQgbWF4ID0gTWF0aC5mbG9vcigoc2l6ZSAvIGNlbGwpICogMC44KTtcbiAgICAgICAgbGV0IG1pbiA9IE1hdGguZmxvb3IoKHNpemUgLyBjZWxsKSAqIDAuMjUpO1xuICAgICAgICBpZiAobWluIDwgMikge1xuICAgICAgICAgICAgbWluID0gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF4IDwgMikge1xuICAgICAgICAgICAgbWF4ID0gMjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW21pbiwgbWF4XTtcbiAgICB9XG4gICAgX2luaXRSb29tcygpIHtcbiAgICAgICAgLy8gY3JlYXRlIHJvb21zIGFycmF5LiBUaGlzIGlzIHRoZSBcImdyaWRcIiBsaXN0IGZyb20gdGhlIGFsZ28uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5yb29tcy5wdXNoKFtdKTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0OyBqKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb21zW2ldLnB1c2goeyBcInhcIjogMCwgXCJ5XCI6IDAsIFwid2lkdGhcIjogMCwgXCJoZWlnaHRcIjogMCwgXCJjb25uZWN0aW9uc1wiOiBbXSwgXCJjZWxseFwiOiBpLCBcImNlbGx5XCI6IGogfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2Nvbm5lY3RSb29tcygpIHtcbiAgICAgICAgLy9waWNrIHJhbmRvbSBzdGFydGluZyBncmlkXG4gICAgICAgIGxldCBjZ3ggPSBSTkcuZ2V0VW5pZm9ybUludCgwLCB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aCAtIDEpO1xuICAgICAgICBsZXQgY2d5ID0gUk5HLmdldFVuaWZvcm1JbnQoMCwgdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0IC0gMSk7XG4gICAgICAgIGxldCBpZHg7XG4gICAgICAgIGxldCBuY2d4O1xuICAgICAgICBsZXQgbmNneTtcbiAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgIGxldCByb29tO1xuICAgICAgICBsZXQgb3RoZXJSb29tO1xuICAgICAgICBsZXQgZGlyVG9DaGVjaztcbiAgICAgICAgLy8gZmluZCAgdW5jb25uZWN0ZWQgbmVpZ2hib3VyIGNlbGxzXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIC8vZGlyVG9DaGVjayA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3XTtcbiAgICAgICAgICAgIGRpclRvQ2hlY2sgPSBbMCwgMiwgNCwgNl07XG4gICAgICAgICAgICBkaXJUb0NoZWNrID0gUk5HLnNodWZmbGUoZGlyVG9DaGVjayk7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZHggPSBkaXJUb0NoZWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIG5jZ3ggPSBjZ3ggKyBESVJTWzhdW2lkeF1bMF07XG4gICAgICAgICAgICAgICAgbmNneSA9IGNneSArIERJUlNbOF1baWR4XVsxXTtcbiAgICAgICAgICAgICAgICBpZiAobmNneCA8IDAgfHwgbmNneCA+PSB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5jZ3kgPCAwIHx8IG5jZ3kgPj0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb29tID0gdGhpcy5yb29tc1tjZ3hdW2NneV07XG4gICAgICAgICAgICAgICAgaWYgKHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFzIGxvbmcgYXMgdGhpcyByb29tIGRvZXNuJ3QgYWxyZWFkeSBjb29uZWN0IHRvIG1lLCB3ZSBhcmUgb2sgd2l0aCBpdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvb21bXCJjb25uZWN0aW9uc1wiXVswXVswXSA9PSBuY2d4ICYmIHJvb21bXCJjb25uZWN0aW9uc1wiXVswXVsxXSA9PSBuY2d5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvdGhlclJvb20gPSB0aGlzLnJvb21zW25jZ3hdW25jZ3ldO1xuICAgICAgICAgICAgICAgIGlmIChvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5wdXNoKFtjZ3gsIGNneV0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RlZENlbGxzLnB1c2goW25jZ3gsIG5jZ3ldKTtcbiAgICAgICAgICAgICAgICAgICAgY2d4ID0gbmNneDtcbiAgICAgICAgICAgICAgICAgICAgY2d5ID0gbmNneTtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKGRpclRvQ2hlY2subGVuZ3RoID4gMCAmJiBmb3VuZCA9PSBmYWxzZSk7XG4gICAgICAgIH0gd2hpbGUgKGRpclRvQ2hlY2subGVuZ3RoID4gMCk7XG4gICAgfVxuICAgIF9jb25uZWN0VW5jb25uZWN0ZWRSb29tcygpIHtcbiAgICAgICAgLy9XaGlsZSB0aGVyZSBhcmUgdW5jb25uZWN0ZWQgcm9vbXMsIHRyeSB0byBjb25uZWN0IHRoZW0gdG8gYSByYW5kb20gY29ubmVjdGVkIG5laWdoYm9yXG4gICAgICAgIC8vKGlmIGEgcm9vbSBoYXMgbm8gY29ubmVjdGVkIG5laWdoYm9ycyB5ZXQsIGp1c3Qga2VlcCBjeWNsaW5nLCB5b3UnbGwgZmlsbCBvdXQgdG8gaXQgZXZlbnR1YWxseSkuXG4gICAgICAgIGxldCBjdyA9IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoO1xuICAgICAgICBsZXQgY2ggPSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7XG4gICAgICAgIHRoaXMuY29ubmVjdGVkQ2VsbHMgPSBSTkcuc2h1ZmZsZSh0aGlzLmNvbm5lY3RlZENlbGxzKTtcbiAgICAgICAgbGV0IHJvb207XG4gICAgICAgIGxldCBvdGhlclJvb207XG4gICAgICAgIGxldCB2YWxpZFJvb207XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgICAgIHJvb20gPSB0aGlzLnJvb21zW2ldW2pdO1xuICAgICAgICAgICAgICAgIGlmIChyb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpcmVjdGlvbnMgPSBbMCwgMiwgNCwgNl07XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMgPSBSTkcuc2h1ZmZsZShkaXJlY3Rpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRSb29tID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkaXJJZHggPSBkaXJlY3Rpb25zLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0kgPSBpICsgRElSU1s4XVtkaXJJZHhdWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0ogPSBqICsgRElSU1s4XVtkaXJJZHhdWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0kgPCAwIHx8IG5ld0kgPj0gY3cgfHwgbmV3SiA8IDAgfHwgbmV3SiA+PSBjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJSb29tID0gdGhpcy5yb29tc1tuZXdJXVtuZXdKXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkUm9vbSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgb3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl1ba11bMF0gPT0gaSAmJiBvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXVtrXVsxXSA9PSBqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkUm9vbSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRSb29tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gd2hpbGUgKGRpcmVjdGlvbnMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkUm9vbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9vbVtcImNvbm5lY3Rpb25zXCJdLnB1c2goW290aGVyUm9vbVtcImNlbGx4XCJdLCBvdGhlclJvb21bXCJjZWxseVwiXV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCItLSBVbmFibGUgdG8gY29ubmVjdCByb29tLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBfY3JlYXRlUmFuZG9tUm9vbUNvbm5lY3Rpb25zKCkge1xuICAgICAgICAvLyBFbXB0eSBmb3Igbm93LlxuICAgIH1cbiAgICBfY3JlYXRlUm9vbXMoKSB7XG4gICAgICAgIGxldCB3ID0gdGhpcy5fd2lkdGg7XG4gICAgICAgIGxldCBoID0gdGhpcy5faGVpZ2h0O1xuICAgICAgICBsZXQgY3cgPSB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDtcbiAgICAgICAgbGV0IGNoID0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0O1xuICAgICAgICBsZXQgY3dwID0gTWF0aC5mbG9vcih0aGlzLl93aWR0aCAvIGN3KTtcbiAgICAgICAgbGV0IGNocCA9IE1hdGguZmxvb3IodGhpcy5faGVpZ2h0IC8gY2gpO1xuICAgICAgICBsZXQgcm9vbXc7XG4gICAgICAgIGxldCByb29taDtcbiAgICAgICAgbGV0IHJvb21XaWR0aCA9IHRoaXMuX29wdGlvbnNbXCJyb29tV2lkdGhcIl07XG4gICAgICAgIGxldCByb29tSGVpZ2h0ID0gdGhpcy5fb3B0aW9uc1tcInJvb21IZWlnaHRcIl07XG4gICAgICAgIGxldCBzeDtcbiAgICAgICAgbGV0IHN5O1xuICAgICAgICBsZXQgb3RoZXJSb29tO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN3OyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2g7IGorKykge1xuICAgICAgICAgICAgICAgIHN4ID0gY3dwICogaTtcbiAgICAgICAgICAgICAgICBzeSA9IGNocCAqIGo7XG4gICAgICAgICAgICAgICAgaWYgKHN4ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc3ggPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc3kgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzeSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvb213ID0gUk5HLmdldFVuaWZvcm1JbnQocm9vbVdpZHRoWzBdLCByb29tV2lkdGhbMV0pO1xuICAgICAgICAgICAgICAgIHJvb21oID0gUk5HLmdldFVuaWZvcm1JbnQocm9vbUhlaWdodFswXSwgcm9vbUhlaWdodFsxXSk7XG4gICAgICAgICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG90aGVyUm9vbSA9IHRoaXMucm9vbXNbaV1baiAtIDFdO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc3kgLSAob3RoZXJSb29tW1wieVwiXSArIG90aGVyUm9vbVtcImhlaWdodFwiXSkgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzeSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBvdGhlclJvb20gPSB0aGlzLnJvb21zW2kgLSAxXVtqXTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHN4IC0gKG90aGVyUm9vbVtcInhcIl0gKyBvdGhlclJvb21bXCJ3aWR0aFwiXSkgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzeCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBzeE9mZnNldCA9IE1hdGgucm91bmQoUk5HLmdldFVuaWZvcm1JbnQoMCwgY3dwIC0gcm9vbXcpIC8gMik7XG4gICAgICAgICAgICAgICAgbGV0IHN5T2Zmc2V0ID0gTWF0aC5yb3VuZChSTkcuZ2V0VW5pZm9ybUludCgwLCBjaHAgLSByb29taCkgLyAyKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoc3ggKyBzeE9mZnNldCArIHJvb213ID49IHcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN4T2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzeE9mZnNldC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9vbXctLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aGlsZSAoc3kgKyBzeU9mZnNldCArIHJvb21oID49IGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN5T2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzeU9mZnNldC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9vbWgtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzeCA9IHN4ICsgc3hPZmZzZXQ7XG4gICAgICAgICAgICAgICAgc3kgPSBzeSArIHN5T2Zmc2V0O1xuICAgICAgICAgICAgICAgIHRoaXMucm9vbXNbaV1bal1bXCJ4XCJdID0gc3g7XG4gICAgICAgICAgICAgICAgdGhpcy5yb29tc1tpXVtqXVtcInlcIl0gPSBzeTtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb21zW2ldW2pdW1wid2lkdGhcIl0gPSByb29tdztcbiAgICAgICAgICAgICAgICB0aGlzLnJvb21zW2ldW2pdW1wiaGVpZ2h0XCJdID0gcm9vbWg7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBzeDsgaWkgPCBzeCArIHJvb213OyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGpqID0gc3k7IGpqIDwgc3kgKyByb29taDsgamorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXBbaWldW2pqXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2dldFdhbGxQb3NpdGlvbihhUm9vbSwgYURpcmVjdGlvbikge1xuICAgICAgICBsZXQgcng7XG4gICAgICAgIGxldCByeTtcbiAgICAgICAgbGV0IGRvb3I7XG4gICAgICAgIGlmIChhRGlyZWN0aW9uID09IDEgfHwgYURpcmVjdGlvbiA9PSAzKSB7XG4gICAgICAgICAgICByeCA9IFJORy5nZXRVbmlmb3JtSW50KGFSb29tW1wieFwiXSArIDEsIGFSb29tW1wieFwiXSArIGFSb29tW1wid2lkdGhcIl0gLSAyKTtcbiAgICAgICAgICAgIGlmIChhRGlyZWN0aW9uID09IDEpIHtcbiAgICAgICAgICAgICAgICByeSA9IGFSb29tW1wieVwiXSAtIDI7XG4gICAgICAgICAgICAgICAgZG9vciA9IHJ5ICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJ5ID0gYVJvb21bXCJ5XCJdICsgYVJvb21bXCJoZWlnaHRcIl0gKyAxO1xuICAgICAgICAgICAgICAgIGRvb3IgPSByeSAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1hcFtyeF1bZG9vcl0gPSAwOyAvLyBpJ20gbm90IHNldHRpbmcgYSBzcGVjaWZpYyAnZG9vcicgdGlsZSB2YWx1ZSByaWdodCBub3csIGp1c3QgZW1wdHkgc3BhY2UuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByeSA9IFJORy5nZXRVbmlmb3JtSW50KGFSb29tW1wieVwiXSArIDEsIGFSb29tW1wieVwiXSArIGFSb29tW1wiaGVpZ2h0XCJdIC0gMik7XG4gICAgICAgICAgICBpZiAoYURpcmVjdGlvbiA9PSAyKSB7XG4gICAgICAgICAgICAgICAgcnggPSBhUm9vbVtcInhcIl0gKyBhUm9vbVtcIndpZHRoXCJdICsgMTtcbiAgICAgICAgICAgICAgICBkb29yID0gcnggLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcnggPSBhUm9vbVtcInhcIl0gLSAyO1xuICAgICAgICAgICAgICAgIGRvb3IgPSByeCArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1hcFtkb29yXVtyeV0gPSAwOyAvLyBpJ20gbm90IHNldHRpbmcgYSBzcGVjaWZpYyAnZG9vcicgdGlsZSB2YWx1ZSByaWdodCBub3csIGp1c3QgZW1wdHkgc3BhY2UuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtyeCwgcnldO1xuICAgIH1cbiAgICBfZHJhd0NvcnJpZG9yKHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uKSB7XG4gICAgICAgIGxldCB4T2Zmc2V0ID0gZW5kUG9zaXRpb25bMF0gLSBzdGFydFBvc2l0aW9uWzBdO1xuICAgICAgICBsZXQgeU9mZnNldCA9IGVuZFBvc2l0aW9uWzFdIC0gc3RhcnRQb3NpdGlvblsxXTtcbiAgICAgICAgbGV0IHhwb3MgPSBzdGFydFBvc2l0aW9uWzBdO1xuICAgICAgICBsZXQgeXBvcyA9IHN0YXJ0UG9zaXRpb25bMV07XG4gICAgICAgIGxldCB0ZW1wRGlzdDtcbiAgICAgICAgbGV0IHhEaXI7XG4gICAgICAgIGxldCB5RGlyO1xuICAgICAgICBsZXQgbW92ZTsgLy8gMiBlbGVtZW50IGFycmF5LCBlbGVtZW50IDAgaXMgdGhlIGRpcmVjdGlvbiwgZWxlbWVudCAxIGlzIHRoZSB0b3RhbCB2YWx1ZSB0byBtb3ZlLlxuICAgICAgICBsZXQgbW92ZXMgPSBbXTsgLy8gYSBsaXN0IG9mIDIgZWxlbWVudCBhcnJheXNcbiAgICAgICAgbGV0IHhBYnMgPSBNYXRoLmFicyh4T2Zmc2V0KTtcbiAgICAgICAgbGV0IHlBYnMgPSBNYXRoLmFicyh5T2Zmc2V0KTtcbiAgICAgICAgbGV0IHBlcmNlbnQgPSBSTkcuZ2V0VW5pZm9ybSgpOyAvLyB1c2VkIHRvIHNwbGl0IHRoZSBtb3ZlIGF0IGRpZmZlcmVudCBwbGFjZXMgYWxvbmcgdGhlIGxvbmcgYXhpc1xuICAgICAgICBsZXQgZmlyc3RIYWxmID0gcGVyY2VudDtcbiAgICAgICAgbGV0IHNlY29uZEhhbGYgPSAxIC0gcGVyY2VudDtcbiAgICAgICAgeERpciA9IHhPZmZzZXQgPiAwID8gMiA6IDY7XG4gICAgICAgIHlEaXIgPSB5T2Zmc2V0ID4gMCA/IDQgOiAwO1xuICAgICAgICBpZiAoeEFicyA8IHlBYnMpIHtcbiAgICAgICAgICAgIC8vIG1vdmUgZmlyc3RIYWxmIG9mIHRoZSB5IG9mZnNldFxuICAgICAgICAgICAgdGVtcERpc3QgPSBNYXRoLmNlaWwoeUFicyAqIGZpcnN0SGFsZik7XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKFt5RGlyLCB0ZW1wRGlzdF0pO1xuICAgICAgICAgICAgLy8gbW92ZSBhbGwgdGhlIHggb2Zmc2V0XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKFt4RGlyLCB4QWJzXSk7XG4gICAgICAgICAgICAvLyBtb3ZlIHNlbmRIYWxmIG9mIHRoZSAgeSBvZmZzZXRcbiAgICAgICAgICAgIHRlbXBEaXN0ID0gTWF0aC5mbG9vcih5QWJzICogc2Vjb25kSGFsZik7XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKFt5RGlyLCB0ZW1wRGlzdF0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gIG1vdmUgZmlyc3RIYWxmIG9mIHRoZSB4IG9mZnNldFxuICAgICAgICAgICAgdGVtcERpc3QgPSBNYXRoLmNlaWwoeEFicyAqIGZpcnN0SGFsZik7XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKFt4RGlyLCB0ZW1wRGlzdF0pO1xuICAgICAgICAgICAgLy8gbW92ZSBhbGwgdGhlIHkgb2Zmc2V0XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKFt5RGlyLCB5QWJzXSk7XG4gICAgICAgICAgICAvLyBtb3ZlIHNlY29uZEhhbGYgb2YgdGhlIHggb2Zmc2V0LlxuICAgICAgICAgICAgdGVtcERpc3QgPSBNYXRoLmZsb29yKHhBYnMgKiBzZWNvbmRIYWxmKTtcbiAgICAgICAgICAgIG1vdmVzLnB1c2goW3hEaXIsIHRlbXBEaXN0XSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXBbeHBvc11beXBvc10gPSAwO1xuICAgICAgICB3aGlsZSAobW92ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbW92ZSA9IG1vdmVzLnBvcCgpO1xuICAgICAgICAgICAgd2hpbGUgKG1vdmVbMV0gPiAwKSB7XG4gICAgICAgICAgICAgICAgeHBvcyArPSBESVJTWzhdW21vdmVbMF1dWzBdO1xuICAgICAgICAgICAgICAgIHlwb3MgKz0gRElSU1s4XVttb3ZlWzBdXVsxXTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcFt4cG9zXVt5cG9zXSA9IDA7XG4gICAgICAgICAgICAgICAgbW92ZVsxXSA9IG1vdmVbMV0gLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIF9jcmVhdGVDb3JyaWRvcnMoKSB7XG4gICAgICAgIC8vIERyYXcgQ29ycmlkb3JzIGJldHdlZW4gY29ubmVjdGVkIHJvb21zXG4gICAgICAgIGxldCBjdyA9IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoO1xuICAgICAgICBsZXQgY2ggPSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7XG4gICAgICAgIGxldCByb29tO1xuICAgICAgICBsZXQgY29ubmVjdGlvbjtcbiAgICAgICAgbGV0IG90aGVyUm9vbTtcbiAgICAgICAgbGV0IHdhbGw7XG4gICAgICAgIGxldCBvdGhlcldhbGw7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3c7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjaDsgaisrKSB7XG4gICAgICAgICAgICAgICAgcm9vbSA9IHRoaXMucm9vbXNbaV1bal07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbiA9IHJvb21bXCJjb25uZWN0aW9uc1wiXVtrXTtcbiAgICAgICAgICAgICAgICAgICAgb3RoZXJSb29tID0gdGhpcy5yb29tc1tjb25uZWN0aW9uWzBdXVtjb25uZWN0aW9uWzFdXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmlndXJlIG91dCB3aGF0IHdhbGwgb3VyIGNvcnJpZG9yIHdpbGwgc3RhcnQgb25lLlxuICAgICAgICAgICAgICAgICAgICAvLyBmaWd1cmUgb3V0IHdoYXQgd2FsbCBvdXIgY29ycmlkb3Igd2lsbCBlbmQgb24uXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlclJvb21bXCJjZWxseFwiXSA+IHJvb21bXCJjZWxseFwiXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2FsbCA9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlcldhbGwgPSA0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG90aGVyUm9vbVtcImNlbGx4XCJdIDwgcm9vbVtcImNlbGx4XCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YWxsID0gNDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyV2FsbCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob3RoZXJSb29tW1wiY2VsbHlcIl0gPiByb29tW1wiY2VsbHlcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhbGwgPSAzO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJXYWxsID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhbGwgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJXYWxsID0gMztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcmF3Q29ycmlkb3IodGhpcy5fZ2V0V2FsbFBvc2l0aW9uKHJvb20sIHdhbGwpLCB0aGlzLl9nZXRXYWxsUG9zaXRpb24ob3RoZXJSb29tLCBvdGhlcldhbGwpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgQXJlbmEgZnJvbSBcIi4vYXJlbmEuanNcIjtcbmltcG9ydCBVbmlmb3JtIGZyb20gXCIuL3VuaWZvcm0uanNcIjtcbmltcG9ydCBDZWxsdWxhciBmcm9tIFwiLi9jZWxsdWxhci5qc1wiO1xuaW1wb3J0IERpZ2dlciBmcm9tIFwiLi9kaWdnZXIuanNcIjtcbmltcG9ydCBFbGxlck1hemUgZnJvbSBcIi4vZWxsZXJtYXplLmpzXCI7XG5pbXBvcnQgRGl2aWRlZE1hemUgZnJvbSBcIi4vZGl2aWRlZG1hemUuanNcIjtcbmltcG9ydCBJY2V5TWF6ZSBmcm9tIFwiLi9pY2V5bWF6ZS5qc1wiO1xuaW1wb3J0IFJvZ3VlIGZyb20gXCIuL3JvZ3VlLmpzXCI7XG5leHBvcnQgZGVmYXVsdCB7IEFyZW5hLCBVbmlmb3JtLCBDZWxsdWxhciwgRGlnZ2VyLCBFbGxlck1hemUsIERpdmlkZWRNYXplLCBJY2V5TWF6ZSwgUm9ndWUgfTtcbiIsIi8qKlxuICogQmFzZSBub2lzZSBnZW5lcmF0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9pc2Uge1xufVxuIiwiaW1wb3J0IE5vaXNlIGZyb20gXCIuL25vaXNlLmpzXCI7XG5pbXBvcnQgUk5HIGZyb20gXCIuLi9ybmcuanNcIjtcbmltcG9ydCB7IG1vZCB9IGZyb20gXCIuLi91dGlsLmpzXCI7XG5jb25zdCBGMiA9IDAuNSAqIChNYXRoLnNxcnQoMykgLSAxKTtcbmNvbnN0IEcyID0gKDMgLSBNYXRoLnNxcnQoMykpIC8gNjtcbi8qKlxuICogQSBzaW1wbGUgMmQgaW1wbGVtZW50YXRpb24gb2Ygc2ltcGxleCBub2lzZSBieSBPbmRyZWogWmFyYVxuICpcbiAqIEJhc2VkIG9uIGEgc3BlZWQtaW1wcm92ZWQgc2ltcGxleCBub2lzZSBhbGdvcml0aG0gZm9yIDJELCAzRCBhbmQgNEQgaW4gSmF2YS5cbiAqIFdoaWNoIGlzIGJhc2VkIG9uIGV4YW1wbGUgY29kZSBieSBTdGVmYW4gR3VzdGF2c29uIChzdGVndUBpdG4ubGl1LnNlKS5cbiAqIFdpdGggT3B0aW1pc2F0aW9ucyBieSBQZXRlciBFYXN0bWFuIChwZWFzdG1hbkBkcml6emxlLnN0YW5mb3JkLmVkdSkuXG4gKiBCZXR0ZXIgcmFuayBvcmRlcmluZyBtZXRob2QgYnkgU3RlZmFuIEd1c3RhdnNvbiBpbiAyMDEyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW1wbGV4IGV4dGVuZHMgTm9pc2Uge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBncmFkaWVudHMgUmFuZG9tIGdyYWRpZW50c1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGdyYWRpZW50cyA9IDI1Nikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9ncmFkaWVudHMgPSBbXG4gICAgICAgICAgICBbMCwgLTFdLFxuICAgICAgICAgICAgWzEsIC0xXSxcbiAgICAgICAgICAgIFsxLCAwXSxcbiAgICAgICAgICAgIFsxLCAxXSxcbiAgICAgICAgICAgIFswLCAxXSxcbiAgICAgICAgICAgIFstMSwgMV0sXG4gICAgICAgICAgICBbLTEsIDBdLFxuICAgICAgICAgICAgWy0xLCAtMV1cbiAgICAgICAgXTtcbiAgICAgICAgbGV0IHBlcm11dGF0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyYWRpZW50czsgaSsrKSB7XG4gICAgICAgICAgICBwZXJtdXRhdGlvbnMucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICBwZXJtdXRhdGlvbnMgPSBSTkcuc2h1ZmZsZShwZXJtdXRhdGlvbnMpO1xuICAgICAgICB0aGlzLl9wZXJtcyA9IFtdO1xuICAgICAgICB0aGlzLl9pbmRleGVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMiAqIGdyYWRpZW50czsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9wZXJtcy5wdXNoKHBlcm11dGF0aW9uc1tpICUgZ3JhZGllbnRzXSk7XG4gICAgICAgICAgICB0aGlzLl9pbmRleGVzLnB1c2godGhpcy5fcGVybXNbaV0gJSB0aGlzLl9ncmFkaWVudHMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQoeGluLCB5aW4pIHtcbiAgICAgICAgbGV0IHBlcm1zID0gdGhpcy5fcGVybXM7XG4gICAgICAgIGxldCBpbmRleGVzID0gdGhpcy5faW5kZXhlcztcbiAgICAgICAgbGV0IGNvdW50ID0gcGVybXMubGVuZ3RoIC8gMjtcbiAgICAgICAgbGV0IG4wID0gMCwgbjEgPSAwLCBuMiA9IDAsIGdpOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcbiAgICAgICAgLy8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxuICAgICAgICBsZXQgcyA9ICh4aW4gKyB5aW4pICogRjI7IC8vIEhhaXJ5IGZhY3RvciBmb3IgMkRcbiAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xuICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XG4gICAgICAgIGxldCB0ID0gKGkgKyBqKSAqIEcyO1xuICAgICAgICBsZXQgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkpIHNwYWNlXG4gICAgICAgIGxldCBZMCA9IGogLSB0O1xuICAgICAgICBsZXQgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cbiAgICAgICAgbGV0IHkwID0geWluIC0gWTA7XG4gICAgICAgIC8vIEZvciB0aGUgMkQgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYW4gZXF1aWxhdGVyYWwgdHJpYW5nbGUuXG4gICAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cbiAgICAgICAgbGV0IGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xuICAgICAgICBpZiAoeDAgPiB5MCkge1xuICAgICAgICAgICAgaTEgPSAxO1xuICAgICAgICAgICAgajEgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBsb3dlciB0cmlhbmdsZSwgWFkgb3JkZXI6ICgwLDApLT4oMSwwKS0+KDEsMSlcbiAgICAgICAgICAgIGkxID0gMDtcbiAgICAgICAgICAgIGoxID0gMTtcbiAgICAgICAgfSAvLyB1cHBlciB0cmlhbmdsZSwgWVggb3JkZXI6ICgwLDApLT4oMCwxKS0+KDEsMSlcbiAgICAgICAgLy8gQSBzdGVwIG9mICgxLDApIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jKSBpbiAoeCx5KSwgYW5kXG4gICAgICAgIC8vIGEgc3RlcCBvZiAoMCwxKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKC1jLDEtYykgaW4gKHgseSksIHdoZXJlXG4gICAgICAgIC8vIGMgPSAoMy1zcXJ0KDMpKS82XG4gICAgICAgIGxldCB4MSA9IHgwIC0gaTEgKyBHMjsgLy8gT2Zmc2V0cyBmb3IgbWlkZGxlIGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcbiAgICAgICAgbGV0IHkxID0geTAgLSBqMSArIEcyO1xuICAgICAgICBsZXQgeDIgPSB4MCAtIDEgKyAyICogRzI7IC8vIE9mZnNldHMgZm9yIGxhc3QgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xuICAgICAgICBsZXQgeTIgPSB5MCAtIDEgKyAyICogRzI7XG4gICAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgdGhyZWUgc2ltcGxleCBjb3JuZXJzXG4gICAgICAgIGxldCBpaSA9IG1vZChpLCBjb3VudCk7XG4gICAgICAgIGxldCBqaiA9IG1vZChqLCBjb3VudCk7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcbiAgICAgICAgbGV0IHQwID0gMC41IC0geDAgKiB4MCAtIHkwICogeTA7XG4gICAgICAgIGlmICh0MCA+PSAwKSB7XG4gICAgICAgICAgICB0MCAqPSB0MDtcbiAgICAgICAgICAgIGdpID0gaW5kZXhlc1tpaSArIHBlcm1zW2pqXV07XG4gICAgICAgICAgICBsZXQgZ3JhZCA9IHRoaXMuX2dyYWRpZW50c1tnaV07XG4gICAgICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZFswXSAqIHgwICsgZ3JhZFsxXSAqIHkwKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdDEgPSAwLjUgLSB4MSAqIHgxIC0geTEgKiB5MTtcbiAgICAgICAgaWYgKHQxID49IDApIHtcbiAgICAgICAgICAgIHQxICo9IHQxO1xuICAgICAgICAgICAgZ2kgPSBpbmRleGVzW2lpICsgaTEgKyBwZXJtc1tqaiArIGoxXV07XG4gICAgICAgICAgICBsZXQgZ3JhZCA9IHRoaXMuX2dyYWRpZW50c1tnaV07XG4gICAgICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZFswXSAqIHgxICsgZ3JhZFsxXSAqIHkxKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdDIgPSAwLjUgLSB4MiAqIHgyIC0geTIgKiB5MjtcbiAgICAgICAgaWYgKHQyID49IDApIHtcbiAgICAgICAgICAgIHQyICo9IHQyO1xuICAgICAgICAgICAgZ2kgPSBpbmRleGVzW2lpICsgMSArIHBlcm1zW2pqICsgMV1dO1xuICAgICAgICAgICAgbGV0IGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xuICAgICAgICAgICAgbjIgPSB0MiAqIHQyICogKGdyYWRbMF0gKiB4MiArIGdyYWRbMV0gKiB5Mik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxuICAgICAgICAvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXG4gICAgICAgIHJldHVybiA3MCAqIChuMCArIG4xICsgbjIpO1xuICAgIH1cbn1cbiIsImltcG9ydCBTaW1wbGV4IGZyb20gXCIuL3NpbXBsZXguanNcIjtcbmV4cG9ydCBkZWZhdWx0IHsgU2ltcGxleCB9O1xuIiwiaW1wb3J0IHsgRElSUyB9IGZyb20gXCIuLi9jb25zdGFudHMuanNcIjtcbi8qKlxuICogQGNsYXNzIEFic3RyYWN0IHBhdGhmaW5kZXJcbiAqIEBwYXJhbSB7aW50fSB0b1ggVGFyZ2V0IFggY29vcmRcbiAqIEBwYXJhbSB7aW50fSB0b1kgVGFyZ2V0IFkgY29vcmRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHBhc3NhYmxlQ2FsbGJhY2sgQ2FsbGJhY2sgdG8gZGV0ZXJtaW5lIG1hcCBwYXNzYWJpbGl0eVxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5PThdXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhdGgge1xuICAgIGNvbnN0cnVjdG9yKHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5fdG9YID0gdG9YO1xuICAgICAgICB0aGlzLl90b1kgPSB0b1k7XG4gICAgICAgIHRoaXMuX3Bhc3NhYmxlQ2FsbGJhY2sgPSBwYXNzYWJsZUNhbGxiYWNrO1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICB0b3BvbG9neTogOFxuICAgICAgICB9LCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZGlycyA9IERJUlNbdGhpcy5fb3B0aW9ucy50b3BvbG9neV07XG4gICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDgpIHsgLyogcmVvcmRlciBkaXJzIGZvciBtb3JlIGFlc3RoZXRpYyByZXN1bHQgKHZlcnRpY2FsL2hvcml6b250YWwgZmlyc3QpICovXG4gICAgICAgICAgICB0aGlzLl9kaXJzID0gW1xuICAgICAgICAgICAgICAgIHRoaXMuX2RpcnNbMF0sXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlyc1syXSxcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXJzWzRdLFxuICAgICAgICAgICAgICAgIHRoaXMuX2RpcnNbNl0sXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlyc1sxXSxcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXJzWzNdLFxuICAgICAgICAgICAgICAgIHRoaXMuX2RpcnNbNV0sXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlyc1s3XVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfZ2V0TmVpZ2hib3JzKGN4LCBjeSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZGlycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRpciA9IHRoaXMuX2RpcnNbaV07XG4gICAgICAgICAgICBsZXQgeCA9IGN4ICsgZGlyWzBdO1xuICAgICAgICAgICAgbGV0IHkgPSBjeSArIGRpclsxXTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fcGFzc2FibGVDYWxsYmFjayh4LCB5KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LnB1c2goW3gsIHldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbiIsImltcG9ydCBQYXRoIGZyb20gXCIuL3BhdGguanNcIjtcbi8qKlxuICogQGNsYXNzIFNpbXBsaWZpZWQgRGlqa3N0cmEncyBhbGdvcml0aG06IGFsbCBlZGdlcyBoYXZlIGEgdmFsdWUgb2YgMVxuICogQGF1Z21lbnRzIFJPVC5QYXRoXG4gKiBAc2VlIFJPVC5QYXRoXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpamtzdHJhIGV4dGVuZHMgUGF0aCB7XG4gICAgY29uc3RydWN0b3IodG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIodG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9jb21wdXRlZCA9IHt9O1xuICAgICAgICB0aGlzLl90b2RvID0gW107XG4gICAgICAgIHRoaXMuX2FkZCh0b1gsIHRvWSwgbnVsbCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGUgYSBwYXRoIGZyb20gYSBnaXZlbiBwb2ludFxuICAgICAqIEBzZWUgUk9ULlBhdGgjY29tcHV0ZVxuICAgICAqL1xuICAgIGNvbXB1dGUoZnJvbVgsIGZyb21ZLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQga2V5ID0gZnJvbVggKyBcIixcIiArIGZyb21ZO1xuICAgICAgICBpZiAoIShrZXkgaW4gdGhpcy5fY29tcHV0ZWQpKSB7XG4gICAgICAgICAgICB0aGlzLl9jb21wdXRlKGZyb21YLCBmcm9tWSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoa2V5IGluIHRoaXMuX2NvbXB1dGVkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fY29tcHV0ZWRba2V5XTtcbiAgICAgICAgd2hpbGUgKGl0ZW0pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGl0ZW0ueCwgaXRlbS55KTtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnByZXY7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSBhIG5vbi1jYWNoZWQgdmFsdWVcbiAgICAgKi9cbiAgICBfY29tcHV0ZShmcm9tWCwgZnJvbVkpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuX3RvZG8ubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RvZG8uc2hpZnQoKTtcbiAgICAgICAgICAgIGlmIChpdGVtLnggPT0gZnJvbVggJiYgaXRlbS55ID09IGZyb21ZKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG5laWdoYm9ycyA9IHRoaXMuX2dldE5laWdoYm9ycyhpdGVtLngsIGl0ZW0ueSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBuZWlnaGJvciA9IG5laWdoYm9yc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgeCA9IG5laWdoYm9yWzBdO1xuICAgICAgICAgICAgICAgIGxldCB5ID0gbmVpZ2hib3JbMV07XG4gICAgICAgICAgICAgICAgbGV0IGlkID0geCArIFwiLFwiICsgeTtcbiAgICAgICAgICAgICAgICBpZiAoaWQgaW4gdGhpcy5fY29tcHV0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfSAvKiBhbHJlYWR5IGRvbmUgKi9cbiAgICAgICAgICAgICAgICB0aGlzLl9hZGQoeCwgeSwgaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2FkZCh4LCB5LCBwcmV2KSB7XG4gICAgICAgIGxldCBvYmogPSB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgIHByZXY6IHByZXZcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fY29tcHV0ZWRbeCArIFwiLFwiICsgeV0gPSBvYmo7XG4gICAgICAgIHRoaXMuX3RvZG8ucHVzaChvYmopO1xuICAgIH1cbn1cbiIsImltcG9ydCBQYXRoIGZyb20gXCIuL3BhdGguanNcIjtcbi8qKlxuICogQGNsYXNzIFNpbXBsaWZpZWQgQSogYWxnb3JpdGhtOiBhbGwgZWRnZXMgaGF2ZSBhIHZhbHVlIG9mIDFcbiAqIEBhdWdtZW50cyBST1QuUGF0aFxuICogQHNlZSBST1QuUGF0aFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBU3RhciBleHRlbmRzIFBhdGgge1xuICAgIGNvbnN0cnVjdG9yKHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgc3VwZXIodG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl90b2RvID0gW107XG4gICAgICAgIHRoaXMuX2RvbmUgPSB7fTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSBhIHBhdGggZnJvbSBhIGdpdmVuIHBvaW50XG4gICAgICogQHNlZSBST1QuUGF0aCNjb21wdXRlXG4gICAgICovXG4gICAgY29tcHV0ZShmcm9tWCwgZnJvbVksIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX3RvZG8gPSBbXTtcbiAgICAgICAgdGhpcy5fZG9uZSA9IHt9O1xuICAgICAgICB0aGlzLl9mcm9tWCA9IGZyb21YO1xuICAgICAgICB0aGlzLl9mcm9tWSA9IGZyb21ZO1xuICAgICAgICB0aGlzLl9hZGQodGhpcy5fdG9YLCB0aGlzLl90b1ksIG51bGwpO1xuICAgICAgICB3aGlsZSAodGhpcy5fdG9kby5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdG9kby5zaGlmdCgpO1xuICAgICAgICAgICAgbGV0IGlkID0gaXRlbS54ICsgXCIsXCIgKyBpdGVtLnk7XG4gICAgICAgICAgICBpZiAoaWQgaW4gdGhpcy5fZG9uZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZG9uZVtpZF0gPSBpdGVtO1xuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PSBmcm9tWCAmJiBpdGVtLnkgPT0gZnJvbVkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBuZWlnaGJvcnMgPSB0aGlzLl9nZXROZWlnaGJvcnMoaXRlbS54LCBpdGVtLnkpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbmVpZ2hib3IgPSBuZWlnaGJvcnNbaV07XG4gICAgICAgICAgICAgICAgbGV0IHggPSBuZWlnaGJvclswXTtcbiAgICAgICAgICAgICAgICBsZXQgeSA9IG5laWdoYm9yWzFdO1xuICAgICAgICAgICAgICAgIGxldCBpZCA9IHggKyBcIixcIiArIHk7XG4gICAgICAgICAgICAgICAgaWYgKGlkIGluIHRoaXMuX2RvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2FkZCh4LCB5LCBpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2RvbmVbZnJvbVggKyBcIixcIiArIGZyb21ZXTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGl0ZW0pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGl0ZW0ueCwgaXRlbS55KTtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnByZXY7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2FkZCh4LCB5LCBwcmV2KSB7XG4gICAgICAgIGxldCBoID0gdGhpcy5fZGlzdGFuY2UoeCwgeSk7XG4gICAgICAgIGxldCBvYmogPSB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgIHByZXY6IHByZXYsXG4gICAgICAgICAgICBnOiAocHJldiA/IHByZXYuZyArIDEgOiAwKSxcbiAgICAgICAgICAgIGg6IGhcbiAgICAgICAgfTtcbiAgICAgICAgLyogaW5zZXJ0IGludG8gcHJpb3JpdHkgcXVldWUgKi9cbiAgICAgICAgbGV0IGYgPSBvYmouZyArIG9iai5oO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RvZG8ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdG9kb1tpXTtcbiAgICAgICAgICAgIGxldCBpdGVtRiA9IGl0ZW0uZyArIGl0ZW0uaDtcbiAgICAgICAgICAgIGlmIChmIDwgaXRlbUYgfHwgKGYgPT0gaXRlbUYgJiYgaCA8IGl0ZW0uaCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b2RvLnNwbGljZShpLCAwLCBvYmopO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90b2RvLnB1c2gob2JqKTtcbiAgICB9XG4gICAgX2Rpc3RhbmNlKHgsIHkpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5KSB7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIChNYXRoLmFicyh4IC0gdGhpcy5fZnJvbVgpICsgTWF0aC5hYnMoeSAtIHRoaXMuX2Zyb21ZKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgbGV0IGR4ID0gTWF0aC5hYnMoeCAtIHRoaXMuX2Zyb21YKTtcbiAgICAgICAgICAgICAgICBsZXQgZHkgPSBNYXRoLmFicyh5IC0gdGhpcy5fZnJvbVkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBkeSArIE1hdGgubWF4KDAsIChkeCAtIGR5KSAvIDIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLm1heChNYXRoLmFicyh4IC0gdGhpcy5fZnJvbVgpLCBNYXRoLmFicyh5IC0gdGhpcy5fZnJvbVkpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCBEaWprc3RyYSBmcm9tIFwiLi9kaWprc3RyYS5qc1wiO1xuaW1wb3J0IEFTdGFyIGZyb20gXCIuL2FzdGFyLmpzXCI7XG5leHBvcnQgZGVmYXVsdCB7IERpamtzdHJhLCBBU3RhciB9O1xuIiwiLyoqXG4gKiBAY2xhc3MgQXN5bmNocm9ub3VzIG1haW4gbG9vcFxuICogQHBhcmFtIHtST1QuU2NoZWR1bGVyfSBzY2hlZHVsZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihzY2hlZHVsZXIpIHtcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgICB0aGlzLl9sb2NrID0gMTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RhcnQgdGhlIG1haW4gbG9vcC4gV2hlbiB0aGlzIGNhbGwgcmV0dXJucywgdGhlIGxvb3AgaXMgbG9ja2VkLlxuICAgICAqL1xuICAgIHN0YXJ0KCkgeyByZXR1cm4gdGhpcy51bmxvY2soKTsgfVxuICAgIC8qKlxuICAgICAqIEludGVycnVwdCB0aGUgZW5naW5lIGJ5IGFuIGFzeW5jaHJvbm91cyBhY3Rpb25cbiAgICAgKi9cbiAgICBsb2NrKCkge1xuICAgICAgICB0aGlzLl9sb2NrKys7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXN1bWUgZXhlY3V0aW9uIChwYXVzZWQgYnkgYSBwcmV2aW91cyBsb2NrKVxuICAgICAqL1xuICAgIHVubG9jaygpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9sb2NrKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgdW5sb2NrIHVubG9ja2VkIGVuZ2luZVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sb2NrLS07XG4gICAgICAgIHdoaWxlICghdGhpcy5fbG9jaykge1xuICAgICAgICAgICAgbGV0IGFjdG9yID0gdGhpcy5fc2NoZWR1bGVyLm5leHQoKTtcbiAgICAgICAgICAgIGlmICghYWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NrKCk7XG4gICAgICAgICAgICB9IC8qIG5vIGFjdG9ycyAqL1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGFjdG9yLmFjdCgpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQudGhlbikgeyAvKiBhY3RvciByZXR1cm5lZCBhIFwidGhlbmFibGVcIiwgbG9va3MgbGlrZSBhIFByb21pc2UgKi9cbiAgICAgICAgICAgICAgICB0aGlzLmxvY2soKTtcbiAgICAgICAgICAgICAgICByZXN1bHQudGhlbih0aGlzLnVubG9jay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBDb2xvciBmcm9tIFwiLi9jb2xvci5qc1wiO1xuO1xuO1xuO1xuO1xuLyoqXG4gKiBMaWdodGluZyBjb21wdXRhdGlvbiwgYmFzZWQgb24gYSB0cmFkaXRpb25hbCBGT1YgZm9yIG11bHRpcGxlIGxpZ2h0IHNvdXJjZXMgYW5kIG11bHRpcGxlIHBhc3Nlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlnaHRpbmcge1xuICAgIGNvbnN0cnVjdG9yKHJlZmxlY3Rpdml0eUNhbGxiYWNrLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5fcmVmbGVjdGl2aXR5Q2FsbGJhY2sgPSByZWZsZWN0aXZpdHlDYWxsYmFjaztcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHt9O1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICBwYXNzZXM6IDEsXG4gICAgICAgICAgICBlbWlzc2lvblRocmVzaG9sZDogMTAwLFxuICAgICAgICAgICAgcmFuZ2U6IDEwXG4gICAgICAgIH0sIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9saWdodHMgPSB7fTtcbiAgICAgICAgdGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGUgPSB7fTtcbiAgICAgICAgdGhpcy5fZm92Q2FjaGUgPSB7fTtcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGp1c3Qgb3B0aW9ucyBhdCBydW50aW1lXG4gICAgICovXG4gICAgc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucmFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSB1c2VkIEZpZWxkLU9mLVZpZXcgYWxnb1xuICAgICAqL1xuICAgIHNldEZPVihmb3YpIHtcbiAgICAgICAgdGhpcy5fZm92ID0gZm92O1xuICAgICAgICB0aGlzLl9mb3ZDYWNoZSA9IHt9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IChvciByZW1vdmUpIGEgbGlnaHQgc291cmNlXG4gICAgICovXG4gICAgc2V0TGlnaHQoeCwgeSwgY29sb3IpIHtcbiAgICAgICAgbGV0IGtleSA9IHggKyBcIixcIiArIHk7XG4gICAgICAgIGlmIChjb2xvcikge1xuICAgICAgICAgICAgdGhpcy5fbGlnaHRzW2tleV0gPSAodHlwZW9mIChjb2xvcikgPT0gXCJzdHJpbmdcIiA/IENvbG9yLmZyb21TdHJpbmcoY29sb3IpIDogY29sb3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2xpZ2h0c1trZXldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIGxpZ2h0IHNvdXJjZXNcbiAgICAgKi9cbiAgICBjbGVhckxpZ2h0cygpIHsgdGhpcy5fbGlnaHRzID0ge307IH1cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgcHJlLWNvbXB1dGVkIHRvcG9sb2d5IHZhbHVlcy4gQ2FsbCB3aGVuZXZlciB0aGUgdW5kZXJseWluZyBtYXAgY2hhbmdlcyBpdHMgbGlnaHQtcGFzc2FiaWxpdHkuXG4gICAgICovXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlID0ge307XG4gICAgICAgIHRoaXMuX2ZvdkNhY2hlID0ge307XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIHRoZSBsaWdodGluZ1xuICAgICAqL1xuICAgIGNvbXB1dGUobGlnaHRpbmdDYWxsYmFjaykge1xuICAgICAgICBsZXQgZG9uZUNlbGxzID0ge307XG4gICAgICAgIGxldCBlbWl0dGluZ0NlbGxzID0ge307XG4gICAgICAgIGxldCBsaXRDZWxscyA9IHt9O1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fbGlnaHRzKSB7IC8qIHByZXBhcmUgZW1pdHRlcnMgZm9yIGZpcnN0IHBhc3MgKi9cbiAgICAgICAgICAgIGxldCBsaWdodCA9IHRoaXMuX2xpZ2h0c1trZXldO1xuICAgICAgICAgICAgZW1pdHRpbmdDZWxsc1trZXldID0gWzAsIDAsIDBdO1xuICAgICAgICAgICAgQ29sb3IuYWRkXyhlbWl0dGluZ0NlbGxzW2tleV0sIGxpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX29wdGlvbnMucGFzc2VzOyBpKyspIHsgLyogbWFpbiBsb29wICovXG4gICAgICAgICAgICB0aGlzLl9lbWl0TGlnaHQoZW1pdHRpbmdDZWxscywgbGl0Q2VsbHMsIGRvbmVDZWxscyk7XG4gICAgICAgICAgICBpZiAoaSArIDEgPT0gdGhpcy5fb3B0aW9ucy5wYXNzZXMpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gLyogbm90IGZvciB0aGUgbGFzdCBwYXNzICovXG4gICAgICAgICAgICBlbWl0dGluZ0NlbGxzID0gdGhpcy5fY29tcHV0ZUVtaXR0ZXJzKGxpdENlbGxzLCBkb25lQ2VsbHMpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGxpdEtleSBpbiBsaXRDZWxscykgeyAvKiBsZXQgdGhlIHVzZXIga25vdyB3aGF0IGFuZCBob3cgaXMgbGl0ICovXG4gICAgICAgICAgICBsZXQgcGFydHMgPSBsaXRLZXkuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgbGV0IHggPSBwYXJzZUludChwYXJ0c1swXSk7XG4gICAgICAgICAgICBsZXQgeSA9IHBhcnNlSW50KHBhcnRzWzFdKTtcbiAgICAgICAgICAgIGxpZ2h0aW5nQ2FsbGJhY2soeCwgeSwgbGl0Q2VsbHNbbGl0S2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGUgb25lIGl0ZXJhdGlvbiBmcm9tIGFsbCBlbWl0dGluZyBjZWxsc1xuICAgICAqIEBwYXJhbSBlbWl0dGluZ0NlbGxzIFRoZXNlIGVtaXQgbGlnaHRcbiAgICAgKiBAcGFyYW0gbGl0Q2VsbHMgQWRkIHByb2plY3RlZCBsaWdodCB0byB0aGVzZVxuICAgICAqIEBwYXJhbSBkb25lQ2VsbHMgVGhlc2UgYWxyZWFkeSBlbWl0dGVkLCBmb3JiaWQgdGhlbSBmcm9tIGZ1cnRoZXIgY2FsY3VsYXRpb25zXG4gICAgICovXG4gICAgX2VtaXRMaWdodChlbWl0dGluZ0NlbGxzLCBsaXRDZWxscywgZG9uZUNlbGxzKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBlbWl0dGluZ0NlbGxzKSB7XG4gICAgICAgICAgICBsZXQgcGFydHMgPSBrZXkuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgbGV0IHggPSBwYXJzZUludChwYXJ0c1swXSk7XG4gICAgICAgICAgICBsZXQgeSA9IHBhcnNlSW50KHBhcnRzWzFdKTtcbiAgICAgICAgICAgIHRoaXMuX2VtaXRMaWdodEZyb21DZWxsKHgsIHksIGVtaXR0aW5nQ2VsbHNba2V5XSwgbGl0Q2VsbHMpO1xuICAgICAgICAgICAgZG9uZUNlbGxzW2tleV0gPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcmVwYXJlIGEgbGlzdCBvZiBlbWl0dGVycyBmb3IgbmV4dCBwYXNzXG4gICAgICovXG4gICAgX2NvbXB1dGVFbWl0dGVycyhsaXRDZWxscywgZG9uZUNlbGxzKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGxpdENlbGxzKSB7XG4gICAgICAgICAgICBpZiAoa2V5IGluIGRvbmVDZWxscykge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSAvKiBhbHJlYWR5IGVtaXR0ZWQgKi9cbiAgICAgICAgICAgIGxldCBjb2xvciA9IGxpdENlbGxzW2tleV07XG4gICAgICAgICAgICBsZXQgcmVmbGVjdGl2aXR5O1xuICAgICAgICAgICAgaWYgKGtleSBpbiB0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZSkge1xuICAgICAgICAgICAgICAgIHJlZmxlY3Rpdml0eSA9IHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFydHMgPSBrZXkuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgICAgIGxldCB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xuICAgICAgICAgICAgICAgIGxldCB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xuICAgICAgICAgICAgICAgIHJlZmxlY3Rpdml0eSA9IHRoaXMuX3JlZmxlY3Rpdml0eUNhbGxiYWNrKHgsIHkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlW2tleV0gPSByZWZsZWN0aXZpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVmbGVjdGl2aXR5ID09IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gLyogd2lsbCBub3QgcmVmbGVjdCBhdCBhbGwgKi9cbiAgICAgICAgICAgIC8qIGNvbXB1dGUgZW1pc3Npb24gY29sb3IgKi9cbiAgICAgICAgICAgIGxldCBlbWlzc2lvbiA9IFswLCAwLCAwXTtcbiAgICAgICAgICAgIGxldCBpbnRlbnNpdHkgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFydCA9IE1hdGgucm91bmQoY29sb3JbaV0gKiByZWZsZWN0aXZpdHkpO1xuICAgICAgICAgICAgICAgIGVtaXNzaW9uW2ldID0gcGFydDtcbiAgICAgICAgICAgICAgICBpbnRlbnNpdHkgKz0gcGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnRlbnNpdHkgPiB0aGlzLl9vcHRpb25zLmVtaXNzaW9uVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBlbWlzc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIG9uZSBpdGVyYXRpb24gZnJvbSBvbmUgY2VsbFxuICAgICAqL1xuICAgIF9lbWl0TGlnaHRGcm9tQ2VsbCh4LCB5LCBjb2xvciwgbGl0Q2VsbHMpIHtcbiAgICAgICAgbGV0IGtleSA9IHggKyBcIixcIiArIHk7XG4gICAgICAgIGxldCBmb3Y7XG4gICAgICAgIGlmIChrZXkgaW4gdGhpcy5fZm92Q2FjaGUpIHtcbiAgICAgICAgICAgIGZvdiA9IHRoaXMuX2ZvdkNhY2hlW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3YgPSB0aGlzLl91cGRhdGVGT1YoeCwgeSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgZm92S2V5IGluIGZvdikge1xuICAgICAgICAgICAgbGV0IGZvcm1GYWN0b3IgPSBmb3ZbZm92S2V5XTtcbiAgICAgICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgICAgICBpZiAoZm92S2V5IGluIGxpdENlbGxzKSB7IC8qIGFscmVhZHkgbGl0ICovXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbGl0Q2VsbHNbZm92S2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyAvKiBuZXdseSBsaXQgKi9cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbMCwgMCwgMF07XG4gICAgICAgICAgICAgICAgbGl0Q2VsbHNbZm92S2V5XSA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldICs9IE1hdGgucm91bmQoY29sb3JbaV0gKiBmb3JtRmFjdG9yKTtcbiAgICAgICAgICAgIH0gLyogYWRkIGxpZ2h0IGNvbG9yICovXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGUgRk9WIChcImZvcm0gZmFjdG9yXCIpIGZvciBhIHBvdGVudGlhbCBsaWdodCBzb3VyY2UgYXQgW3gseV1cbiAgICAgKi9cbiAgICBfdXBkYXRlRk9WKHgsIHkpIHtcbiAgICAgICAgbGV0IGtleTEgPSB4ICsgXCIsXCIgKyB5O1xuICAgICAgICBsZXQgY2FjaGUgPSB7fTtcbiAgICAgICAgdGhpcy5fZm92Q2FjaGVba2V5MV0gPSBjYWNoZTtcbiAgICAgICAgbGV0IHJhbmdlID0gdGhpcy5fb3B0aW9ucy5yYW5nZTtcbiAgICAgICAgZnVuY3Rpb24gY2IoeCwgeSwgciwgdmlzKSB7XG4gICAgICAgICAgICBsZXQga2V5MiA9IHggKyBcIixcIiArIHk7XG4gICAgICAgICAgICBsZXQgZm9ybUZhY3RvciA9IHZpcyAqICgxIC0gciAvIHJhbmdlKTtcbiAgICAgICAgICAgIGlmIChmb3JtRmFjdG9yID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWNoZVtrZXkyXSA9IGZvcm1GYWN0b3I7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICB0aGlzLl9mb3YuY29tcHV0ZSh4LCB5LCByYW5nZSwgY2IuYmluZCh0aGlzKSk7XG4gICAgICAgIHJldHVybiBjYWNoZTtcbiAgICB9XG59XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIFJORyB9IGZyb20gXCIuL3JuZy5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBEaXNwbGF5IH0gZnJvbSBcIi4vZGlzcGxheS9kaXNwbGF5LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFN0cmluZ0dlbmVyYXRvciB9IGZyb20gXCIuL3N0cmluZ2dlbmVyYXRvci5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFdmVudFF1ZXVlIH0gZnJvbSBcIi4vZXZlbnRxdWV1ZS5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTY2hlZHVsZXIgfSBmcm9tIFwiLi9zY2hlZHVsZXIvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRk9WIH0gZnJvbSBcIi4vZm92L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1hcCB9IGZyb20gXCIuL21hcC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBOb2lzZSB9IGZyb20gXCIuL25vaXNlL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBhdGggfSBmcm9tIFwiLi9wYXRoL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVuZ2luZSB9IGZyb20gXCIuL2VuZ2luZS5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBMaWdodGluZyB9IGZyb20gXCIuL2xpZ2h0aW5nLmpzXCI7XG5leHBvcnQgeyBERUZBVUxUX1dJRFRILCBERUZBVUxUX0hFSUdIVCwgRElSUywgS0VZUyB9IGZyb20gXCIuL2NvbnN0YW50cy5qc1wiO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tIFwiLi91dGlsLmpzXCI7XG5leHBvcnQgY29uc3QgVXRpbCA9IHV0aWw7XG5pbXBvcnQgKiBhcyBjb2xvciBmcm9tIFwiLi9jb2xvci5qc1wiO1xuZXhwb3J0IGNvbnN0IENvbG9yID0gY29sb3I7XG5pbXBvcnQgKiBhcyB0ZXh0IGZyb20gXCIuL3RleHQuanNcIjtcbmV4cG9ydCBjb25zdCBUZXh0ID0gdGV4dDtcbiIsIi8qKlxuICogQGNsYXNzIEFic3RyYWN0IGRpc3BsYXkgYmFja2VuZCBtb2R1bGVcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhY2tlbmQge1xuICAgIGdldENvbnRhaW5lcigpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBzZXRPcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7IH1cbn1cbiIsImNvbnN0IFJPVCA9IHJlcXVpcmUoJ3JvdC1qcycpO1xyXG4vLyBTZWU6IGh0dHA6Ly9vbmRyYXMuZ2l0aHViLmlvL3JvdC5qcy9tYW51YWwvI3JuZ1xyXG5cclxuZnVuY3Rpb24gc2V0U2VlZChzZWVkKSB7XHJcblx0aWYgKHR5cGVvZiBzZWVkICE9PSAnbnVtYmVyJykge1xyXG5cdFx0c2VlZCA9IG1ha2VTZWVkKCk7XHJcblx0fVxyXG5cdFJPVC5STkcuc2V0U2VlZChzZWVkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFrZVNlZWQoKSB7XHJcblx0cmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcm9sbChuLCBzZWVkKSB7XHJcblx0aWYgKHR5cGVvZiBzZWVkID09PSAnbnVtYmVyJykge1xyXG5cdFx0c2V0U2VlZChzZWVkKTtcclxuXHR9XHJcblx0aWYgKHR5cGVvZiBuID09PSAnbnVtYmVyJykge1xyXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiBuKTtcclxuXHR9XHJcblx0aWYgKHR5cGVvZiBuID09PSAnc3RyaW5nJykge1xyXG5cdFx0cmV0dXJuIHJvbGxEaWNlKG4sIHNlZWQpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcm9sbERpY2Uoc3RyLCBzZWVkKSB7IC8vIHN0ciBsaWtlIFwiMWQ0XCIsIFwiMmQ2XCIsIFwiM2Q4XCIsIFwiMWQxMDBcIlxyXG5cdC8vIFRPRE86IGhhbmRsZSBcIitcIiwgXCItXCIsIG90aGVyP1xyXG5cdGNvbnN0IGQgPSBzdHIuc3BsaXQoJ2QnKTtcclxuXHRpZiAoZC5sZW5ndGggIT09IDIpIHtcclxuXHRcdGNvbnN0IG4gPSBOdW1iZXIoc3RyKTtcclxuXHRcdC8vIGNvbnNvbGUud2FybignVW5leHBlY3RlZCB2YWx1ZTonLCBzdHIsICcuIE5vdCB2YWxpZCBkaWNlIG5vdGF0aW9uLiBVc2luZzonLCBuKTtcclxuXHRcdHJldHVybiByb2xsKG4sIHNlZWQpO1xyXG5cdH1cclxuXHRjb25zdCBudW1iZXJPZkRpY2UgPSBkWzBdO1xyXG5cdGNvbnN0IG51bWJlck9mU2lkZXMgPSBkWzFdO1xyXG5cdGxldCBzdW0gPSAwO1xyXG5cdGZvcihsZXQgaSA9IDA7IGkgPCBudW1iZXJPZkRpY2U7IGkrKykge1xyXG5cdFx0c3VtICs9IHJvbGwobnVtYmVyT2ZTaWRlcywgc2VlZCk7XHJcblx0fVxyXG5cdHJldHVybiBzdW07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFdlaWdodGVkVmFsdWUob2JqLCBzZWVkKSB7XHJcblx0aWYgKHR5cGVvZiBzZWVkID09PSAnbnVtYmVyJykge1xyXG5cdFx0c2V0U2VlZChzZWVkKTtcclxuXHR9XHJcblx0cmV0dXJuIFJPVC5STkcuZ2V0V2VpZ2h0ZWRWYWx1ZShvYmopO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaHVmZmxlKGFycikge1xyXG5cdHJldHVybiBST1QuUk5HLnNodWZmbGUoYXJyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGlja09uZShhcnIpIHtcclxuXHRyZXR1cm4gUk9ULlJORy5nZXRJdGVtKGFycik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdHNldFNlZWQsXHJcblx0bWFrZVNlZWQsXHJcblx0cm9sbCxcclxuXHRnZXRXZWlnaHRlZFZhbHVlLFxyXG5cdHNodWZmbGUsXHJcblx0cGlja09uZVxyXG59O1xyXG4iLCJjb25zdCBJbnZlbnRvcnkgPSByZXF1aXJlKCcuL0ludmVudG9yeScpO1xyXG5jb25zdCB7IERJUlNfOCB9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIEl0ZW0ge1xyXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xyXG5cdFx0dGhpcy50eXBlID0gb3B0aW9ucy50eXBlIHx8IG51bGw7XHJcblx0XHR0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgJ25vdGhpbmcnO1xyXG5cdFx0dGhpcy54ID0gb3B0aW9ucy54IHx8IDA7XHJcblx0XHR0aGlzLnkgPSBvcHRpb25zLnkgfHwgMDtcclxuXHRcdHRoaXMuY2hhcmFjdGVyID0gb3B0aW9ucy5jaGFyYWN0ZXIgfHwgJ14nO1xyXG5cdFx0dGhpcy5zdXJyb3VuZGluZyA9IG9wdGlvbnMuc3Vycm91bmRpbmcgfHwgW107XHJcblx0XHR0aGlzLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCAnIzA1Zic7XHJcblx0XHR0aGlzLmJhY2tncm91bmQgPSBvcHRpb25zLmJhY2tncm91bmQgfHwgbnVsbDtcclxuXHRcdHRoaXMuaW52ZW50b3J5ID0gbmV3IEludmVudG9yeSh7XHJcblx0XHRcdHNpemU6IG9wdGlvbnMuaW52ZW50b3J5U2l6ZSB8fCAwXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuaXNXZWFwb24gPSBCb29sZWFuKG9wdGlvbnMud2VhcG9uKTtcclxuXHRcdHRoaXMuZGFtYWdlID0gcGFyc2VJbnQob3B0aW9ucy53ZWFwb24sIDEwKSB8fCAwO1xyXG5cdFx0dGhpcy5pc0RlZmVuc2UgPSBCb29sZWFuKG9wdGlvbnMuZGVmZW5zZSk7XHJcblx0XHR0aGlzLmRlZmVuc2UgPSBwYXJzZUludChvcHRpb25zLmRlZmVuc2UsIDEwKSB8fCAwO1xyXG5cdFx0dGhpcy5pbGx1bWluYXRpb24gPSBvcHRpb25zLmlsbHVtaW5hdGlvbiB8fCAwO1xyXG5cdFx0dGhpcy5wb3J0YWJsZSA9ICh0eXBlb2Ygb3B0aW9ucy5wb3J0YWJsZSA9PT0gJ2Jvb2xlYW4nKSA/IG9wdGlvbnMucG9ydGFibGUgOiB0cnVlO1xyXG5cdFx0dGhpcy5jb250YWluZWRJbiA9IG51bGw7XHJcblx0XHR0aGlzLmFjdGlvbnMgPSB7IC4uLm9wdGlvbnMub24sIC4uLm9wdGlvbnMuYWN0aW9ucyB9OyAvLyBUT0RPOiBkbyB3ZSBuZWVkIHRoZSBcIm9uXCIgYWxpYXM/XHJcblx0XHRpZiAob3B0aW9ucy51c2UpIHtcclxuXHRcdFx0dGhpcy5hY3Rpb25zLnVzZSA9IG9wdGlvbnMudXNlO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zdGF0ZXMgPSBvcHRpb25zLnN0YXRlcyB8fCB7fTtcclxuXHRcdHRoaXMudGVsZXBvcnQgPSBudWxsOyAvLyBjYW4gdGhpcyBpdGVtIG1vdmUgdGhlIGNoYXJhY3RlciB0byBhbm90aGVyIGxldmVsLCBjZWxsXHJcblx0fVxyXG5cclxuXHRoYXNBY3Rpb24odmVyYikge1xyXG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5hY3Rpb25zW3ZlcmJdKTtcclxuXHR9XHJcblxyXG5cdGFjdGlvbihhY3Rpb25OYW1lLCB3aG8pIHtcclxuXHRcdGNvbnN0IGFjdGlvbiA9IHRoaXMuYWN0aW9uc1thY3Rpb25OYW1lXTtcclxuXHRcdGxldCBhY3Rpb25PdXRjb21lID0ge307XHJcblx0XHRpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRhY3Rpb25PdXRjb21lID0gYWN0aW9uKHRoaXMsIHdobyk7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdvYmplY3QnICYmIGFjdGlvbiAhPT0gbnVsbCkge1xyXG5cdFx0XHRhY3Rpb25PdXRjb21lID0gdGhpcy5ydW5BY3Rpb24oYWN0aW9uLCB3aG8pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKCdObyBhY3Rpb24nLCBhY3Rpb25OYW1lLCAnZm9yIGl0ZW0nLCB0aGlzKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBhY3Rpb25PdXRjb21lO1xyXG5cdH1cclxuXHJcblx0cnVuQWN0aW9uKGFjdGlvbiA9IHt9LCB3aG8pIHsgLy8gVE9ETzogbW92ZSB0byBnYW1lL2xldmVsP1xyXG5cdFx0bGV0IG1lc3NhZ2UgPSAnJztcclxuXHRcdGlmICghdGhpcy5yZXF1aXJlbWVudE1ldChhY3Rpb24sIHdobykpIHtcclxuXHRcdFx0bWVzc2FnZSA9IChhY3Rpb24ubWlzc2luZ01lc3NhZ2UpID8gYWN0aW9uLm1pc3NpbmdNZXNzYWdlIDogYFNvbWUgcmVxdWlyZW1lbnQgaXMgbm90IG1ldCB0byB1c2UgdGhlICR7dGhpcy5uYW1lfWA7XHJcblx0XHRcdHJldHVybiB7IG1lc3NhZ2UgfTtcclxuXHRcdH1cclxuXHRcdHRoaXMucmVtb3ZlUmVxdWlyZW1lbnRzKGFjdGlvbik7XHJcblx0XHRtZXNzYWdlID0gbWVzc2FnZSArICgoYWN0aW9uLm1lc3NhZ2UpID8gYWN0aW9uLm1lc3NhZ2UgOiAnJyk7XHJcblx0XHRjb25zdCBlZmZlY3RzID0gYWN0aW9uLmVmZmVjdHM7XHJcblx0XHRyZXR1cm4geyBtZXNzYWdlLCBlZmZlY3RzIH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmVSZXF1aXJlbWVudHMoYWN0aW9uID0ge30pIHtcclxuXHRcdGlmICghYWN0aW9uLnJlcXVpcmVzKSB7IHJldHVybjsgfVxyXG5cdFx0YWN0aW9uLnJlcXVpcmVzLmZvckVhY2goKHJlcXVpcmVtZW50KSA9PiB7XHJcblx0XHRcdGNvbnN0IHR5cGVLZXkgPSByZXF1aXJlbWVudC5pdGVtO1xyXG5cdFx0XHRpZiAodHlwZUtleSkge1xyXG5cdFx0XHRcdHRoaXMuaW52ZW50b3J5LnJlbW92ZVR5cGUodHlwZUtleSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmVxdWlyZW1lbnRNZXQoYWN0aW9uID0ge30sIHdobykge1xyXG5cdFx0aWYgKCFhY3Rpb24ucmVxdWlyZXMpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRsZXQgbWV0ID0gMDtcclxuXHRcdGFjdGlvbi5yZXF1aXJlcy5mb3JFYWNoKChyZXF1aXJlbWVudCkgPT4ge1xyXG5cdFx0XHRpZiAocmVxdWlyZW1lbnQuaXRlbSAmJiB0aGlzLmludmVudG9yeS5jb250YWluc1R5cGUocmVxdWlyZW1lbnQuaXRlbSkpIHtcclxuXHRcdFx0XHRtZXQgKz0gMTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbWV0ID09PSBhY3Rpb24ucmVxdWlyZXMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0ZHJhdyhkaXNwbGF5LCBsaWdodGluZyA9IHt9LCBpblZpZXcgPSBmYWxzZSkge1xyXG5cdFx0aWYgKHRoaXMuY29udGFpbmVkSW4gfHwgIWluVmlldykgeyAvLyBOb3QgdmlzaWJsZSBpZiBpbiBhIGNvbnRhaW5lclxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRkaXNwbGF5LmRyYXcodGhpcy54LCB0aGlzLnksIHRoaXMuY2hhcmFjdGVyLCB0aGlzLmNvbG9yLCB0aGlzLmJhY2tncm91bmQpO1xyXG5cdFx0aWYgKHRoaXMuc3Vycm91bmRpbmcubGVuZ3RoKSB7XHJcblx0XHRcdHRoaXMuc3Vycm91bmRpbmcuZm9yRWFjaCgoY2hhciwgaSkgPT4ge1xyXG5cdFx0XHRcdGxldCB7IHgsIHkgfSA9IERJUlNfOFtpXTtcclxuXHRcdFx0XHRkaXNwbGF5LmRyYXcodGhpcy54ICsgeCwgdGhpcy55ICsgeSwgY2hhciwgdGhpcy5jb2xvciwgdGhpcy5iYWNrZ3JvdW5kKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdGFkZEl0ZW0oaXRlbSkgeyAvLyBtdXRhdGVzIHRoZSBpdGVtIGlmIHN1Y2Nlc3NmdWxcclxuXHRcdGlmICh0aGlzLmludmVudG9yeS5pc0Z1bGwoKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRjb25zdCBpc0FkZGVkID0gdGhpcy5pbnZlbnRvcnkuYWRkKGl0ZW0pO1xyXG5cdFx0aWYgKCFpc0FkZGVkKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGl0ZW0uY29udGFpbmVkSW4gPSB0aGlzO1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gSW52ZW50b3J5XHJcblxyXG5cdGdldENvbnRlbnRzKG4pIHtcclxuXHRcdHJldHVybiB0aGlzLmludmVudG9yeS5nZXQobik7XHJcblx0fVxyXG5cclxuXHRoYXNDb250ZW50cygpIHtcclxuXHRcdHJldHVybiB0aGlzLmludmVudG9yeS5oYXNDb250ZW50cygpO1xyXG5cdH1cclxuXHJcblx0Y29udGFpbnMoaXRlbU5hbWUpIHtcclxuXHRcdHJldHVybiB0aGlzLmludmVudG9yeS5jb250YWlucyhpdGVtTmFtZSk7XHJcblx0fVxyXG5cclxuXHRoYXNTcGFjZSgpIHtcclxuXHRcdHJldHVybiB0aGlzLmludmVudG9yeS5oYXNTcGFjZSgpO1xyXG5cdH1cclxuXHJcblx0YWRkVG9JbnZlbnRvcnkoaXRlbSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuaW52ZW50b3J5LmFkZChpdGVtKTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBTZXRzXHJcblxyXG5cdHNldFRlbGVwb3J0KG9wdGlvbnMgPSB7fSkge1xyXG5cdFx0Y29uc3QgeyBsZXZlbEluZGV4LCB4LCB5LCB2ZXJiIH0gPSBvcHRpb25zO1xyXG5cdFx0dGhpcy50ZWxlcG9ydCA9IHsgbGV2ZWxJbmRleCwgeCwgeSB9O1xyXG5cdFx0dGhpcy5hY3Rpb25zW3ZlcmJdID0gJ3RlbGVwb3J0JztcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSXRlbTtcclxuIiwiZnVuY3Rpb24gZ2V0RGlzdGFuY2UoeDEsIHkxLCB4MiwgeTIpIHtcclxuXHRyZXR1cm4gTWF0aC5zcXJ0KFxyXG5cdFx0TWF0aC5wb3coKHgxIC0geDIpLCAyKVxyXG5cdFx0KyBNYXRoLnBvdygoeTEgLSB5MiksIDIpXHJcblx0KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0RGlzdGFuY2VcclxufTtcclxuIiwiY29uc3QgUk9UID0gcmVxdWlyZSgncm90LWpzJyk7XHJcbmNvbnN0IEludmVudG9yeSA9IHJlcXVpcmUoJy4vSW52ZW50b3J5Jyk7XHJcbmNvbnN0IGdlb21ldGVyID0gcmVxdWlyZSgnLi9nZW9tZXRlcicpO1xyXG5jb25zdCByYW5kb20gPSByZXF1aXJlKCcuL3JhbmRvbScpO1xyXG5cclxuY2xhc3MgQWN0aW9uVmVyYlR5cGUge1xyXG5cdHN0YXRpYyBnZXQgTU9WRSAoKSB7XHJcblx0XHRyZXR1cm4gJ21vdmUnO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldCBXQUlUICgpIHtcclxuXHRcdHJldHVybiAnd2FpdCc7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBGYWN0aW9uVHlwZSB7XHJcblxyXG5cdHN0YXRpYyBnZXQgSFVNQU4gKCkge1xyXG5cdFx0cmV0dXJuICdodW1hbic7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0IE1PTlNURVIgKCkge1xyXG5cdFx0cmV0dXJuICdtb25zdGVyJztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXQgTkVVVFJBTCAoKSB7XHJcblx0XHRyZXR1cm4gJ25ldXRyYWwnO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbmNsYXNzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHRcdHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcclxuXHRcdHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCBudWxsO1xyXG5cdFx0dGhpcy5mYWN0aW9uID0gb3B0aW9ucy5mYWN0aW9uIHx8IEZhY3Rpb25UeXBlLk1PTlNURVI7XHJcblx0XHR0aGlzLmlzSGVybyA9IEJvb2xlYW4ob3B0aW9ucy5pc0hlcm8pO1xyXG5cdFx0dGhpcy54ID0gb3B0aW9ucy54IHx8IDA7XHJcblx0XHR0aGlzLnkgPSBvcHRpb25zLnkgfHwgMDtcclxuXHRcdHRoaXMuY2hhcmFjdGVyID0gb3B0aW9ucy5jaGFyYWN0ZXIgfHwgJ00nO1xyXG5cdFx0dGhpcy5vcmlnaW5hbENoYXJhY3RlciA9IHRoaXMuY2hhcmFjdGVyO1xyXG5cdFx0dGhpcy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgJyNkZjInO1xyXG5cdFx0dGhpcy5vcmlnaW5hbENvbG9yID0gdGhpcy5jb2xvcjtcclxuXHRcdHRoaXMuYmxvb2RDb2xvciA9ICcjNjExJztcclxuXHRcdC8vIHRoaXMuZ2FtZSA9IG9wdGlvbnMuZ2FtZSB8fCBjb25zb2xlLmVycm9yKCdtdXN0IHRpZSBhY3RvciB0byBnYW1lJyk7XHJcblx0XHR0aGlzLmludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoe1xyXG5cdFx0XHRzaXplOiBvcHRpb25zLmludmVudG9yeVNpemUgfHwgMTBcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5wYXNzYWJsZSA9IGZhbHNlO1xyXG5cdFx0dGhpcy5hY3Rpb25RdWV1ZSA9IFtdO1xyXG5cdFx0dGhpcy5tYXhNb3ZlbWVudCA9IHRoaXMuaXNIZXJvID8gMS40MiA6IDE7XHJcblx0XHR0aGlzLnNpZ2h0UmFuZ2UgPSAodHlwZW9mIG9wdGlvbnMuc2lnaHRSYW5nZSA9PT0gJ251bWJlcicpID8gb3B0aW9ucy5zaWdodFJhbmdlIDogNjtcclxuXHRcdHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMuYWdncm8gPSBvcHRpb25zLmFnZ3JvIHx8IDA7IC8vIExldmVsIHdpbGwgc2V0IHRoaXMgdG8gMTAwIGZvciBtb25zdGVyc1xyXG5cdFx0Ly8gc3RhdHNcclxuXHRcdHRoaXMuaHAgPSAob3B0aW9ucy5ocCB8fCB0eXBlb2Ygb3B0aW9ucy5ocCA9PT0gJ251bWJlcicpID8gcGFyc2VJbnQob3B0aW9ucy5ocCwgMTApIDogMjtcclxuXHRcdHRoaXMuaHBNYXggPSB0aGlzLmhwO1xyXG5cdFx0dGhpcy5hcCA9IG9wdGlvbnMuYXAgfHwgMDtcdC8vIEF0dGFjay9Bcm1zXHJcblx0XHR0aGlzLmFwTWF4ID0gdGhpcy5hcDtcclxuXHRcdHRoaXMuYnAgPSBvcHRpb25zLmJwIHx8IDA7XHQvLyBCYWxhbmNlXHJcblx0XHR0aGlzLmJwTWF4ID0gdGhpcy5icDtcclxuXHRcdHRoaXMuZXAgPSBvcHRpb25zLmVwIHx8IDA7XHQvLyBFbmR1cmFuY2VcclxuXHRcdHRoaXMuZXBNYXggPSB0aGlzLmVwO1xyXG5cdFx0dGhpcy5mcCA9IG9wdGlvbnMuZnAgfHwgMDtcdFx0Ly8gRm9jdXNcclxuXHRcdHRoaXMuZnBNYXggPSB0aGlzLmZwO1xyXG5cdFx0dGhpcy53cCA9IG9wdGlvbnMud3AgfHwgMDtcdFx0Ly8gV2lsbChwb3dlcilcclxuXHRcdHRoaXMud3BNYXggPSB0aGlzLndwO1xyXG5cdFx0dGhpcy5tcCA9IG9wdGlvbnMubXAgfHwgMDtcdFx0Ly8gTWFuYVxyXG5cdFx0dGhpcy5tcE1heCA9IHRoaXMubXA7XHJcblx0XHQvLyBhZHZhbmNlbWVudFxyXG5cdFx0dGhpcy54cCA9IG9wdGlvbnMueHAgfHwgMDtcclxuXHRcdHRoaXMuc2NvcmUgPSBvcHRpb25zLnNjb3JlIHx8IDA7XHJcblx0XHQvLyBhYmlsaXRpZXNcclxuXHRcdHRoaXMubWF4QWJpbGl0aWVzID0gOTtcclxuXHRcdHRoaXMuYWJpbGl0aWVzID0ge307XHJcblx0XHR0aGlzLmFiaWxpdHlMaXN0ID0gW107XHJcblx0XHQvLyB0ZW1wb3JhcnlcclxuXHRcdHRoaXMuaW5pdGlhdGl2ZUJvb3N0ID0gMDtcclxuXHJcblx0XHQvLyBhbGwgYWN0b3JzIGNhbiBjYXJyeSBjdXJyZW5jeVxyXG5cdFx0Ly8gZXZlcnl0aGluZyBpcyBib2lsZWQgZG93biB0byBjb3BwZXIgcGllY2VzXHJcblx0XHQvLyAxMDAgY29wcGVyID0gMSBzaWx2ZXJcclxuXHRcdC8vIDEwMCBzaWx2ZXIgPSAxIGdvbGRcclxuXHRcdHRoaXMuY3VycmVuY3kgPSBvcHRpb25zLmN1cnJlbmN5IHx8IDA7XHJcblx0fVxyXG5cclxuXHRkcmF3KGRpc3BsYXksIGxpZ2h0aW5nID0ge30sIGluVmlldyA9IGZhbHNlKSB7XHJcblx0XHRpZiAoIWluVmlldykge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHQvLyBUT0RPOiBhZGp1c3QgY29sb3JzIGJhc2VkIG9uIGxpZ2h0aW5nIGFuZCBpblZpZXdcclxuXHRcdGRpc3BsYXkuZHJhdyh0aGlzLngsIHRoaXMueSwgdGhpcy5jaGFyYWN0ZXIsIHRoaXMuY29sb3IpO1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRxdWV1ZUFjdGlvbih2ZXJiLCBwYXJhbXMgPSB7fSkge1xyXG5cdFx0Y29uc3QgYWN0aW9uUGFyYW1zID0geyAuLi5wYXJhbXMsIHZlcmIgfTtcclxuXHRcdHRoaXMuYWN0aW9uUXVldWUucHVzaChhY3Rpb25QYXJhbXMpO1xyXG5cdH1cclxuXHJcblx0Y2xlYXJRdWV1ZSgpIHtcclxuXHRcdHRoaXMuYWN0aW9uUXVldWUubGVuZ3RoID0gMDtcclxuXHR9XHJcblxyXG5cdHBsYW5BY3Rpb24obGV2ZWwsIGhlcm8pIHtcclxuXHRcdGlmICh0aGlzLmlzSGVybykgeyByZXR1cm47IH1cclxuXHRcdGlmICh0aGlzLmRlYWQoKSkge1xyXG5cdFx0XHR0aGlzLmNsZWFyUXVldWUoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgZGlzdGFuY2VUb0hlcm8gPSBnZW9tZXRlci5nZXREaXN0YW5jZSh0aGlzLngsIHRoaXMueSwgaGVyby54LCBoZXJvLnkpO1xyXG5cdFx0Y29uc3QgZGFuZ2Vyb3VzbHlIdXJ0ID0gKHRoaXMuaHAgPD0gMSk7XHJcblx0XHR0aGlzLmFjdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYCR7dGhpcy5uYW1lfSBhY3RzYCk7XHJcblx0XHRcdC8vIGlmIChnLmdldEFjdGl2ZUxldmVsKCkgIT09IGxldmVsKSB7IHJldHVybjsgfVxyXG5cdFx0fTtcclxuXHRcdGlmICh0aGlzLmFnZ3JvICYmIGRpc3RhbmNlVG9IZXJvIDw9IHRoaXMuZ2V0TWF4U2Vuc2VSYW5nZSgpICYmICFoZXJvLmRlYWQoKSAmJiAhZGFuZ2Vyb3VzbHlIdXJ0KSB7XHJcblx0XHRcdGNvbnN0IG1hcCA9IGxldmVsLmdldE1hcCgpO1xyXG5cdFx0XHR0aGlzLmNsZWFyUXVldWUoKTtcclxuXHRcdFx0dGhpcy5zZXRUYXJnZXQoaGVybyk7XHJcblx0XHRcdHRoaXMuc2V0UGF0aFRvVGFyZ2V0KG1hcCk7XHJcblx0XHRcdGlmICh0aGlzLmF0RW5kT2ZQYXRoKCkpIHtcclxuXHRcdFx0XHR0aGlzLnF1ZXVlQWN0aW9uKCdhdHRhY2snLCB7IHRhcmdldDogaGVybyB9KTtcclxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLmFjdGlvblF1ZXVlLmxlbmd0aCA9PT0gMSkge1xyXG5cdFx0XHRcdHRoaXMuY2xlYXJRdWV1ZSgpO1xyXG5cdFx0XHRcdHRoaXMucXVldWVBY3Rpb24oJ2F0dGFjaycsIHsgdGFyZ2V0OiBoZXJvIH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAodGhpcy5hdEVuZE9mUGF0aCgpKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRXYW5kZXJQYXRoKGxldmVsKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gY29uc29sZS5sb2coYCR7dGhpcy5uYW1lfSBwbGFuc2AsIHRoaXMuYWN0aW9uUXVldWUpO1xyXG5cdH1cclxuXHJcblx0ZG9BY3Rpb24oKSB7XHJcblx0XHRpZiAodGhpcy5kZWFkKCkpIHsgcmV0dXJuIHsgdmVyYjogJ3JvdCcgfTsgfVxyXG5cdFx0Y29uc3Qgd2FpdEFjdGlvbiA9IHsgdmVyYjogQWN0aW9uVmVyYlR5cGUuV0FJVCB9O1xyXG5cdFx0aWYgKHRoaXMuYWN0aW9uUXVldWUubGVuZ3RoID09PSAwKSB7IHJldHVybiB3YWl0QWN0aW9uOyB9XHJcblx0XHRsZXQgYWN0aW9uID0gdGhpcy5hY3Rpb25RdWV1ZS5zaGlmdCgpO1xyXG5cdFx0Y29uc3QgbW92ZUFscmVhZHlUaGVyZSA9IChhY3Rpb24udmVyYiA9PT0gQWN0aW9uVmVyYlR5cGUuTU9WRSAmJiBhY3Rpb24ueCA9PT0gdGhpcy54ICYmIGFjdGlvbi55ID09PSB0aGlzLnkpO1xyXG5cdFx0Y29uc3QgbW92ZVRvb0ZhciA9IChhY3Rpb24udmVyYiA9PT0gQWN0aW9uVmVyYlR5cGUuTU9WRSAmJiB0aGlzLmdldERpc3RhbmNlVG9OZXh0TW92ZShhY3Rpb24pID4gdGhpcy5tYXhNb3ZlbWVudCk7XHJcblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIHRoaXMueCwgdGhpcy55LCBhY3Rpb24udmVyYiwgYWN0aW9uLngsIGFjdGlvbi55LCB0aGlzLmdldERpc3RhbmNlVG9OZXh0TW92ZSgpLCB0aGlzLm1heE1vdmVtZW50LCBtb3ZlVG9vRmFyLCAncScsIHRoaXMuYWN0aW9uUXVldWUubGVuZ3RoKTtcclxuXHRcdGlmIChtb3ZlQWxyZWFkeVRoZXJlKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmRvQWN0aW9uKCk7XHJcblx0XHR9XHJcblx0XHRpZiAobW92ZVRvb0Zhcikge1xyXG5cdFx0XHRhY3Rpb24gPSB0aGlzLmRvQWN0aW9uKCk7XHJcblx0XHR9XHJcblx0XHRpZiAoIWFjdGlvbikge1xyXG5cdFx0XHRyZXR1cm4gd2FpdEFjdGlvbjtcclxuXHRcdH1cclxuXHRcdHJldHVybiBhY3Rpb247XHJcblx0fVxyXG5cclxuXHRhdHRhY2sod2hvKSB7XHJcblx0XHRjb25zb2xlLmxvZyhgJHt0aGlzLm5hbWV9IGF0dGFja3NgLCB3aG8pO1xyXG5cdFx0Ly8gVE9ET1xyXG5cdH1cclxuXHJcblx0c2V0V2FuZGVyUGF0aChsZXZlbCkge1xyXG5cdFx0Y29uc3QgbWFwID0gbGV2ZWwuZ2V0TWFwKCk7XHJcblx0XHRjb25zdCB7IHgsIHkgfSA9IGxldmVsLmZpbmRSYW5kb21GcmVlQ2VsbCgpO1xyXG5cdFx0dGhpcy5zZXRQYXRoVG8obWFwLCB4LCB5KTtcclxuXHR9XHJcblxyXG5cdGF0RW5kT2ZQYXRoKCkge1xyXG5cdFx0Y29uc3QgbmV4dEFjdGlvbiA9IHRoaXMuZ2V0TmV4dEFjdGlvbigpO1xyXG5cdFx0aWYgKCFuZXh0QWN0aW9uKSB7IHJldHVybiB0cnVlOyB9XHJcblx0XHRyZXR1cm4gKG5leHRBY3Rpb24udmVyYiA9PT0gQWN0aW9uVmVyYlR5cGUuTU9WRSkgPyBmYWxzZSA6IHRydWU7XHJcblx0fVxyXG5cclxuXHR3YWl0KCkge1xyXG5cdFx0dGhpcy5oZWFsUG9vbHMoKTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBNb3ZlbWVudFxyXG5cclxuXHRtb3ZlKHgsIHkpIHtcclxuXHRcdHRoaXMueCArPSBwYXJzZUludCh4LCAxMCk7XHJcblx0XHR0aGlzLnkgKz0gcGFyc2VJbnQoeSwgMTApO1xyXG5cdH1cclxuXHJcblx0bW92ZVRvKHgsIHkpIHtcclxuXHRcdHRoaXMuc2V0Q29vcmRpbmF0ZXMoeCwgeSk7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gQ29tYmF0XHJcblxyXG5cdGF0dGFja0RhbWFnZShvcHBvbmVudCkge1xyXG5cdFx0cmV0dXJuIDE7XHJcblx0fVxyXG5cclxuXHR3b3VuZChuKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5oZWFsKG4gKiAtMSk7XHJcblx0fVxyXG5cclxuXHRoZWFsKG4pIHtcclxuXHRcdGNvbnN0IG9yaWdpbmFsSHAgPSB0aGlzLmhwO1xyXG5cdFx0dGhpcy5ocCArPSBwYXJzZUludChuLCAxMCk7XHJcblx0XHR0aGlzLmhwID0gTWF0aC5taW4odGhpcy5ocCwgdGhpcy5ocE1heCk7XHJcblx0XHR0aGlzLmNoZWNrRGVhdGgoKTtcclxuXHRcdHJldHVybiB0aGlzLmhwIC0gb3JpZ2luYWxIcDtcclxuXHR9XHJcblxyXG5cdGRlYWQoKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuaHAgPD0gMCk7XHJcblx0fVxyXG5cclxuXHRjaGVja0RlYXRoKCkge1xyXG5cdFx0aWYgKHRoaXMuZGVhZCgpKSB7XHJcblx0XHRcdHRoaXMuY2hhcmFjdGVyID0gJ1gnO1xyXG5cdFx0XHR0aGlzLmNvbG9yID0gdGhpcy5ibG9vZENvbG9yO1xyXG5cdFx0XHR0aGlzLnBhc3NhYmxlID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vLS0tLSBIZWFsaW5nXHJcblxyXG5cdGhlYWxQb29scygpIHtcclxuXHRcdHRoaXMuaGVhbFBvb2wodGhpcy5nZXRSYW5kb21Qb29sS2V5KCkpO1xyXG5cdH1cclxuXHJcblx0aGVhbFBvb2wocG9vbEtleSwgYW1vdW50ID0gMSkge1xyXG5cdFx0Y29uc3QgYSA9IHRoaXMuZ2V0QWJpbGl0eVJlYWRpZWRBbW91bnRzKCk7XHJcblx0XHRjb25zdCBtYXggPSB0aGlzW3Bvb2xLZXkgKyAnTWF4J107XHJcblx0XHRpZiAoYVtwb29sS2V5XSArIHRoaXNbcG9vbEtleV0gKyBhbW91bnQgPD0gbWF4KSB7XHJcblx0XHRcdHRoaXNbcG9vbEtleV0gKz0gYW1vdW50O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRoaXMuaXNIZXJvKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ05vIHNwYWNlIHRvIGhlYWwnLCBwb29sS2V5LCB0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZGFtYWdlUG9vbChwb29sS2V5LCBhbW91bnQgPSAxKSB7XHJcblx0XHR0aGlzW3Bvb2xLZXldIC09IGFtb3VudDtcclxuXHRcdHRoaXNbcG9vbEtleV0gPSBNYXRoLm1heCgwLCB0aGlzW3Bvb2xLZXldKTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBBYmlsaXRpZXNcclxuXHJcblx0aGFzQWJpbGl0eShhYmlsaXR5S2V5KSB7XHJcblx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLmFiaWxpdGllc1thYmlsaXR5S2V5XSk7XHJcblx0fVxyXG5cclxuXHRhZGRBYmlsaXR5KGFiaWxpdHlLZXksIGFiaWxpdHlEYXRhKSB7XHJcblx0XHRpZiAodGhpcy5hYmlsaXR5TGlzdC5sZW5ndGggPj0gdGhpcy5tYXhBYmlsaXRpZXMpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuaGFzQWJpbGl0eShhYmlsaXR5S2V5KSkge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oJ0Nhbm5vdCBhZGQgYWJpbGl0eSB0d2ljZSAtIHdvdWxkIG92ZXJyaWRlJyk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdC8vIFRPRE86IG1vdmUgdG8gQWN0aXZpdHkgY2xhc3M/XHJcblx0XHRjb25zdCBhYmlsaXR5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhYmlsaXR5RGF0YSkpO1xyXG5cdFx0dGhpcy5hYmlsaXRpZXNbYWJpbGl0eUtleV0gPSBhYmlsaXR5O1xyXG5cdFx0YWJpbGl0eS5pc1JlYWRpZWQgPSBmYWxzZTtcclxuXHRcdGFiaWxpdHkua2V5ID0gYWJpbGl0eUtleTtcclxuXHRcdHRoaXMuYWJpbGl0eUxpc3QucHVzaChhYmlsaXR5S2V5KTtcclxuXHRcdHJldHVybiBhYmlsaXR5O1xyXG5cdH1cclxuXHJcblx0Z2V0QWJpbGl0eUJ5SW5kZXgoaSkge1xyXG5cdFx0Y29uc3Qga2V5ID0gdGhpcy5hYmlsaXR5TGlzdFtpXTtcclxuXHRcdHJldHVybiB0aGlzLmFiaWxpdGllc1trZXldO1xyXG5cdH1cclxuXHJcblx0Z2V0QWJpbGl0eVJlYWRpZWRBbW91bnRzKCkge1xyXG5cdFx0Y29uc3QgYSA9IHsgaHA6IDAsIGFwOiAwLCBicDogMCwgZXA6IDAsIGZwOiAwLCB3cDogMCB9O1xyXG5cdFx0dGhpcy5hYmlsaXR5TGlzdC5mb3JFYWNoKChhYmlsaXR5S2V5KSA9PiB7XHJcblx0XHRcdGNvbnN0IGFiaWxpdHkgPSB0aGlzLmFiaWxpdGllc1thYmlsaXR5S2V5XTtcclxuXHRcdFx0QWN0b3IubG9vcE92ZXJBYmlsaXR5Q29zdHMoYWJpbGl0eSwgKGNvc3RLZXksIHZhbCkgPT4ge1xyXG5cdFx0XHRcdGlmIChhYmlsaXR5LmlzUmVhZGllZCkge1xyXG5cdFx0XHRcdFx0YVtjb3N0S2V5XSArPSB2YWw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGE7XHJcblx0fVxyXG5cclxuXHRjYW5SZWFkeUFiaWxpdHkoYWJpbGl0eSkge1xyXG5cdFx0aWYgKGFiaWxpdHkuaXNSZWFkaWVkKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0bGV0IGNhblJlYWR5ID0gdHJ1ZTtcclxuXHRcdEFjdG9yLmxvb3BPdmVyQWJpbGl0eUNvc3RzKGFiaWxpdHksIChjb3N0S2V5LCB2YWwpID0+IHtcclxuXHRcdFx0Y29uc3QgcG9vbEFtb3VudCA9IHRoaXNbY29zdEtleV07XHJcblx0XHRcdGlmICh2YWwgPiBwb29sQW1vdW50KSB7XHJcblx0XHRcdFx0Y2FuUmVhZHkgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gY2FuUmVhZHk7XHJcblx0fVxyXG5cclxuXHRyZWFkeUFiaWxpdHlCeUluZGV4KGkpIHtcclxuXHRcdGNvbnN0IGFiaWxpdHkgPSB0aGlzLmdldEFiaWxpdHlCeUluZGV4KGkpO1xyXG5cdFx0aWYgKCFhYmlsaXR5KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0aWYgKCF0aGlzLmNhblJlYWR5QWJpbGl0eShhYmlsaXR5KSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdEFjdG9yLmxvb3BPdmVyQWJpbGl0eUNvc3RzKGFiaWxpdHksIChjb3N0S2V5LCB2YWwpID0+IHtcclxuXHRcdFx0dGhpc1tjb3N0S2V5XSAtPSB2YWw7XHJcblx0XHR9KTtcclxuXHRcdGFiaWxpdHkuaXNSZWFkaWVkID0gdHJ1ZTtcclxuXHRcdHJldHVybiBhYmlsaXR5O1xyXG5cdH1cclxuXHJcblx0YWN0aXZhdGVBYmlsaXRpZXMoZXZlbnROYW1lKSB7XHJcblx0XHRjb25zdCB0cmlnZ2VyZWRBYmlsaXRpZXMgPSB0aGlzLmdldFRyaWdnZXJlZEFiaWxpdGllcyhldmVudE5hbWUpO1xyXG5cdFx0bGV0IGVmZmVjdHMgPSBbXTtcclxuXHRcdHRyaWdnZXJlZEFiaWxpdGllcy5mb3JFYWNoKChhYmlsaXR5KSA9PiB7XHJcblx0XHRcdGFiaWxpdHkuaXNSZWFkaWVkID0gZmFsc2U7XHJcblx0XHRcdGVmZmVjdHMgPSBlZmZlY3RzLmNvbmNhdChhYmlsaXR5LmVmZmVjdHMpO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gZWZmZWN0cztcclxuXHR9XHJcblxyXG5cdGdldFRyaWdnZXJlZEFiaWxpdGllcyhldmVudE5hbWUpIHtcclxuXHRcdGNvbnN0IHRyaWdnZXJlZEFiaWxpdGllcyA9IFtdO1xyXG5cdFx0dGhpcy5hYmlsaXR5TGlzdC5mb3JFYWNoKChhYmlsaXR5S2V5KSA9PiB7XHJcblx0XHRcdGNvbnN0IGFiaWxpdHkgPSB0aGlzLmFiaWxpdGllc1thYmlsaXR5S2V5XTtcclxuXHRcdFx0aWYgKGFiaWxpdHkuaXNSZWFkaWVkICYmIGFiaWxpdHkuYWN0aXZhdGVPbiA9PT0gZXZlbnROYW1lKSB7XHJcblx0XHRcdFx0dHJpZ2dlcmVkQWJpbGl0aWVzLnB1c2goYWJpbGl0eSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHRyaWdnZXJlZEFiaWxpdGllcztcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBsb29wT3ZlckFiaWxpdHlDb3N0cyhhYmlsaXR5LCBmbikge1xyXG5cdFx0Y29uc3QgY29zdHMgPSBPYmplY3Qua2V5cyhhYmlsaXR5LnJlYWR5Q29zdCk7XHJcblx0XHRjb3N0cy5mb3JFYWNoKChrZXkpID0+IHtcclxuXHRcdFx0Zm4oa2V5LCBwYXJzZUludChhYmlsaXR5LnJlYWR5Q29zdFtrZXldLCAxMCkpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0QWJpbGl0eUVmZmVjdHNTdHJpbmcoYWJpbGl0eSkge1xyXG5cdFx0bGV0IGFyciA9IFtdO1xyXG5cdFx0YWJpbGl0eS5lZmZlY3RzLmZvckVhY2goKGVmZmVjdCkgPT4ge1xyXG5cdFx0XHRjb25zdCB3b3JkcyA9ICh0eXBlb2YgZWZmZWN0ID09PSAnc3RyaW5nJykgPyBbZWZmZWN0XSA6IE9iamVjdC5rZXlzKGVmZmVjdCk7XHJcblx0XHRcdGFyciA9IGFyci5jb25jYXQod29yZHMpO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gYXJyLmpvaW4oJywgJyk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0QWJpbGl0eURlc2NyaXB0aW9uSHRtbChhYmlsaXR5KSB7XHJcblx0XHRsZXQgcmVhZHkgPSAnUmVhZHkgd2l0aCc7XHJcblx0XHRBY3Rvci5sb29wT3ZlckFiaWxpdHlDb3N0cyhhYmlsaXR5LCAoY29zdEtleSwgdmFsKSA9PiB7XHJcblx0XHRcdHJlYWR5ICs9ICcgJyArIHZhbCArICcgJyArIGNvc3RLZXkudG9VcHBlckNhc2UoKTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc3QgZWZmZWN0cyA9IEFjdG9yLmdldEFiaWxpdHlFZmZlY3RzU3RyaW5nKGFiaWxpdHkpO1xyXG5cdFx0cmV0dXJuIGA8ZGl2IGNsYXNzPVwiYWJpbGl0eS1kZXNjcmlwdGlvblwiPiR7YWJpbGl0eS5kZXNjcmlwdGlvbn08L2Rpdj5cclxuXHRcdDxkaXYgY2xhc3M9XCJhYmlsaXR5LXJlYWR5LXdpdGhcIj4ke3JlYWR5fTwvZGl2PlxyXG5cdFx0PGRpdiBjbGFzcz1cImFiaWxpdHktYWN0aXZhdGVzLW9uXCI+QWN0aXZhdGVzIG9uOiAke2FiaWxpdHkuYWN0aXZhdGVPbn08L2Rpdj5cclxuXHRcdDxkaXYgY2xhc3M9XCJhYmlsaXR5LWVmZmVjdHNcIj5DYXVzZXM6ICR7ZWZmZWN0c308L2Rpdj5gO1xyXG5cdH1cclxuXHJcblx0Ly8tLS0tIEV4cGVyaWVuY2VcclxuXHJcblx0Z2FpblJhbmRvbVBvb2xNYXgoKSB7XHJcblx0XHRjb25zdCBrZXkgPSB0aGlzLmdldFJhbmRvbVBvb2xLZXkoKSArICdNYXgnO1xyXG5cdFx0dGhpc1trZXldICs9IDE7XHJcblx0fVxyXG5cclxuXHRnYWluUmFuZG9tQWJpbGl0eShhYmlsaXRpZXNEYXRhKSB7XHJcblx0XHRjb25zdCBhYmlsaXR5S2V5cyA9IE9iamVjdC5rZXlzKGFiaWxpdGllc0RhdGEpO1xyXG5cdFx0bGV0IGFiaWxpdHlLZXkgPSByYW5kb20ucGlja09uZShhYmlsaXR5S2V5cyk7XHJcblx0XHRsZXQgYXR0ZW1wdHMgPSAxMDA7XHJcblx0XHR3aGlsZSAodGhpcy5oYXNBYmlsaXR5KGFiaWxpdHlLZXkpICYmIGF0dGVtcHRzLS0pIHtcclxuXHRcdFx0YWJpbGl0eUtleSA9IHJhbmRvbS5waWNrT25lKGFiaWxpdHlLZXlzKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuYWRkQWJpbGl0eShhYmlsaXR5S2V5LCBhYmlsaXRpZXNEYXRhW2FiaWxpdHlLZXldKTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBHZXRzXHJcblxyXG5cdGdldFJhbmRvbVBvb2xLZXkoKSB7XHJcblx0XHRyZXR1cm4gcmFuZG9tLnBpY2tPbmUoWydhcCcsICdicCcsICdlcCcsICd3cCddKTtcclxuXHR9XHJcblxyXG5cdGdldE1heFNlbnNlUmFuZ2UoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5zaWdodFJhbmdlO1xyXG5cdH1cclxuXHJcblx0Z2V0TmV4dEFjdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLmFjdGlvblF1ZXVlWzBdO1xyXG5cdH1cclxuXHJcblx0Z2V0RGlzdGFuY2VUb05leHRNb3ZlKG5leHRBY3Rpb24pIHtcclxuXHRcdGlmICghbmV4dEFjdGlvbikgeyBuZXh0QWN0aW9uID0gdGhpcy5nZXROZXh0QWN0aW9uKCk7IH1cclxuXHRcdGlmICghbmV4dEFjdGlvbikgeyByZXR1cm4gMDsgfVxyXG5cdFx0Y29uc3QgeyB4LCB5IH0gPSBuZXh0QWN0aW9uO1xyXG5cdFx0aWYgKHggIT09IHVuZGVmaW5lZCAmJiB5ICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0cmV0dXJuIGdlb21ldGVyLmdldERpc3RhbmNlKHgsIHksIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsOyAvLyA/XHJcblx0fVxyXG5cclxuXHRnZXRBcm1vckRlZmVuc2UoKSB7XHJcblx0XHRpZiAoIXRoaXMuaXNIZXJvKSB7XHJcblx0XHRcdHJldHVybiAxOyAvLyBUT0RPOiBjaGFuZ2UgdGhpcyBzbyB0aGVyZSBpcyBzb21lIGtpbmQgb2YgbmF0dXJhbCBkZWZlbnNlIGZvciBtb25zdGVyc1xyXG5cdFx0fVxyXG5cdFx0bGV0IGhpZ2hlc3REZWZlbnNlID0gMDtcclxuXHRcdHRoaXMuaW52ZW50b3J5Lmxvb3BPdmVyQ29udGVudHMoKGl0ZW0pID0+IHtcclxuXHRcdFx0aWYgKGl0ZW0uZGVmZW5zZSA+IGhpZ2hlc3REZWZlbnNlKSB7XHJcblx0XHRcdFx0aGlnaGVzdERlZmVuc2UgPSBpdGVtLmRlZmVuc2U7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGhpZ2hlc3REZWZlbnNlO1xyXG5cdH1cclxuXHJcblx0Z2V0V2VhcG9uRGFtYWdlKCkge1xyXG5cdFx0aWYgKCF0aGlzLmlzSGVybykge1xyXG5cdFx0XHRyZXR1cm4gMTsgLy8gVE9ETzogY2hhbmdlIHRoaXMgc28gdGhlcmUgaXMgc29tZSBraW5kIG9mIG5hdHVyYWwgZGFtYWdlIGZvciBtb25zdGVyc1xyXG5cdFx0fVxyXG5cdFx0bGV0IGhpZ2hlc3REYW1hZ2UgPSAwO1xyXG5cdFx0dGhpcy5pbnZlbnRvcnkubG9vcE92ZXJDb250ZW50cygoaXRlbSkgPT4ge1xyXG5cdFx0XHRpZiAoaXRlbS5kYW1hZ2UgPiBoaWdoZXN0RGFtYWdlKSB7XHJcblx0XHRcdFx0aGlnaGVzdERhbWFnZSA9IGl0ZW0uZGFtYWdlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBoaWdoZXN0RGFtYWdlO1xyXG5cdH1cclxuXHJcblx0Ly8tLS0tIFNldHNcclxuXHJcblx0c2V0Q29vcmRpbmF0ZXMoeCwgeSkge1xyXG5cdFx0dGhpcy54ID0gcGFyc2VJbnQoeCwgMTApO1xyXG5cdFx0dGhpcy55ID0gcGFyc2VJbnQoeSwgMTApO1xyXG5cdH1cclxuXHJcblx0c2V0UGF0aFRvKG1hcCwgeCA9IDAsIHkgPSAwKSB7XHJcblx0XHRjb25zdCBwYXNzYWJsZUNhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdFx0XHRyZXR1cm4gbWFwLmdldENlbGxQYXNzYWJpbGl0eSh4LCB5KTtcclxuXHRcdH07XHJcblx0XHRjb25zdCBhc3RhciA9IG5ldyBST1QuUGF0aC5BU3Rhcih4LCB5LCBwYXNzYWJsZUNhbGxiYWNrLCB7IHRvcG9sb2d5OiA0IH0pO1xyXG5cdFx0Y29uc3QgcGF0aCA9IHRoaXMuYWN0aW9uUXVldWU7XHJcblx0XHRjb25zdCBwYXRoQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0XHRcdHBhdGgucHVzaCh7IHgsIHksIHZlcmI6IEFjdGlvblZlcmJUeXBlLk1PVkUgfSk7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBhdGhbMF0gJiYgcGF0aFswXS54ID09PSB0aGlzLnggJiYgcGF0aFswXS55ID09PSB0aGlzLnkpIHtcclxuXHRcdFx0Y29uc29sZS5hbGVydCgncmVtb3ZpbmcgZmlyc3QnKTtcclxuXHRcdFx0cGF0aC5zaGlmdCgpO1xyXG5cdFx0fVxyXG5cdFx0YXN0YXIuY29tcHV0ZSh0aGlzLngsIHRoaXMueSwgcGF0aENhbGxiYWNrKTtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0c2V0UGF0aFRvVGFyZ2V0KG1hcCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuc2V0UGF0aFRvKG1hcCwgdGhpcy50YXJnZXQueCwgdGhpcy50YXJnZXQueSk7XHJcblx0fVxyXG5cclxuXHRzZXRUYXJnZXQodGFyZ2V0KSB7XHJcblx0XHRpZiAodHlwZW9mIHRhcmdldC54ICE9PSAnbnVtYmVyJyB8fCB0eXBlb2YgdGFyZ2V0LnkgIT09ICdudW1iZXInKSB7XHJcblx0XHRcdGNvbnNvbGUud2FybignQ2Fubm90IHNldCB0YXJnZXQgdG8gc29tZXRoaW5nIHdpdGhvdXQgeCx5Jyk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY3RvcjtcclxuIiwiaW1wb3J0IEJhY2tlbmQgZnJvbSBcIi4vYmFja2VuZC5qc1wiO1xuaW1wb3J0ICogYXMgQ29sb3IgZnJvbSBcIi4uL2NvbG9yLmpzXCI7XG5mdW5jdGlvbiBjbGVhclRvQW5zaShiZykge1xuICAgIHJldHVybiBgXFx4MWJbMDs0ODs1OyR7dGVybWNvbG9yKGJnKX1tXFx4MWJbMkpgO1xufVxuZnVuY3Rpb24gY29sb3JUb0Fuc2koZmcsIGJnKSB7XG4gICAgcmV0dXJuIGBcXHgxYlswOzM4OzU7JHt0ZXJtY29sb3IoZmcpfTs0ODs1OyR7dGVybWNvbG9yKGJnKX1tYDtcbn1cbmZ1bmN0aW9uIHBvc2l0aW9uVG9BbnNpKHgsIHkpIHtcbiAgICByZXR1cm4gYFxceDFiWyR7eSArIDF9OyR7eCArIDF9SGA7XG59XG5mdW5jdGlvbiB0ZXJtY29sb3IoY29sb3IpIHtcbiAgICBjb25zdCBTUkNfQ09MT1JTID0gMjU2LjA7XG4gICAgY29uc3QgRFNUX0NPTE9SUyA9IDYuMDtcbiAgICBjb25zdCBDT0xPUl9SQVRJTyA9IERTVF9DT0xPUlMgLyBTUkNfQ09MT1JTO1xuICAgIGxldCByZ2IgPSBDb2xvci5mcm9tU3RyaW5nKGNvbG9yKTtcbiAgICBsZXQgciA9IE1hdGguZmxvb3IocmdiWzBdICogQ09MT1JfUkFUSU8pO1xuICAgIGxldCBnID0gTWF0aC5mbG9vcihyZ2JbMV0gKiBDT0xPUl9SQVRJTyk7XG4gICAgbGV0IGIgPSBNYXRoLmZsb29yKHJnYlsyXSAqIENPTE9SX1JBVElPKTtcbiAgICByZXR1cm4gciAqIDM2ICsgZyAqIDYgKyBiICogMSArIDE2O1xufVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVybSBleHRlbmRzIEJhY2tlbmQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9vZmZzZXQgPSBbMCwgMF07XG4gICAgICAgIHRoaXMuX2N1cnNvciA9IFstMSwgLTFdO1xuICAgICAgICB0aGlzLl9sYXN0Q29sb3IgPSBcIlwiO1xuICAgIH1cbiAgICBzY2hlZHVsZShjYikgeyBzZXRUaW1lb3V0KGNiLCAxMDAwIC8gNjApOyB9XG4gICAgc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIGxldCBzaXplID0gW29wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0XTtcbiAgICAgICAgbGV0IGF2YWlsID0gdGhpcy5jb21wdXRlU2l6ZSgpO1xuICAgICAgICB0aGlzLl9vZmZzZXQgPSBhdmFpbC5tYXAoKHZhbCwgaW5kZXgpID0+IE1hdGguZmxvb3IoKHZhbCAtIHNpemVbaW5kZXhdKSAvIDIpKTtcbiAgICB9XG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGNsZWFyVG9BbnNpKHRoaXMuX29wdGlvbnMuYmcpKTtcbiAgICB9XG4gICAgZHJhdyhkYXRhLCBjbGVhckJlZm9yZSkge1xuICAgICAgICAvLyBkZXRlcm1pbmUgd2hlcmUgdG8gZHJhdyB3aGF0IHdpdGggd2hhdCBjb2xvcnNcbiAgICAgICAgbGV0IFt4LCB5LCBjaCwgZmcsIGJnXSA9IGRhdGE7XG4gICAgICAgIC8vIGRldGVybWluZSBpZiB3ZSBuZWVkIHRvIG1vdmUgdGhlIHRlcm1pbmFsIGN1cnNvclxuICAgICAgICBsZXQgZHggPSB0aGlzLl9vZmZzZXRbMF0gKyB4O1xuICAgICAgICBsZXQgZHkgPSB0aGlzLl9vZmZzZXRbMV0gKyB5O1xuICAgICAgICBsZXQgc2l6ZSA9IHRoaXMuY29tcHV0ZVNpemUoKTtcbiAgICAgICAgaWYgKGR4IDwgMCB8fCBkeCA+PSBzaXplWzBdKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR5IDwgMCB8fCBkeSA+PSBzaXplWzFdKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR4ICE9PSB0aGlzLl9jdXJzb3JbMF0gfHwgZHkgIT09IHRoaXMuX2N1cnNvclsxXSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocG9zaXRpb25Ub0Fuc2koZHgsIGR5KSk7XG4gICAgICAgICAgICB0aGlzLl9jdXJzb3JbMF0gPSBkeDtcbiAgICAgICAgICAgIHRoaXMuX2N1cnNvclsxXSA9IGR5O1xuICAgICAgICB9XG4gICAgICAgIC8vIHRlcm1pbmFscyBhdXRvbWF0aWNhbGx5IGNsZWFyLCBidXQgaWYgd2UncmUgY2xlYXJpbmcgd2hlbiB3ZSdyZVxuICAgICAgICAvLyBub3Qgb3RoZXJ3aXNlIHByb3ZpZGVkIHdpdGggYSBjaGFyYWN0ZXIsIGp1c3QgdXNlIGEgc3BhY2UgaW5zdGVhZFxuICAgICAgICBpZiAoY2xlYXJCZWZvcmUpIHtcbiAgICAgICAgICAgIGlmICghY2gpIHtcbiAgICAgICAgICAgICAgICBjaCA9IFwiIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHdlJ3JlIG5vdCBjbGVhcmluZyBhbmQgbm90IHByb3ZpZGVkIHdpdGggYSBjaGFyYWN0ZXIsIGRvIG5vdGhpbmdcbiAgICAgICAgaWYgKCFjaCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRldGVybWluZSBpZiB3ZSBuZWVkIHRvIGNoYW5nZSBjb2xvcnNcbiAgICAgICAgbGV0IG5ld0NvbG9yID0gY29sb3JUb0Fuc2koZmcsIGJnKTtcbiAgICAgICAgaWYgKG5ld0NvbG9yICE9PSB0aGlzLl9sYXN0Q29sb3IpIHtcbiAgICAgICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKG5ld0NvbG9yKTtcbiAgICAgICAgICAgIHRoaXMuX2xhc3RDb2xvciA9IG5ld0NvbG9yO1xuICAgICAgICB9XG4gICAgICAgIC8vIHdyaXRlIHRoZSBwcm92aWRlZCBzeW1ib2wgdG8gdGhlIGRpc3BsYXlcbiAgICAgICAgbGV0IGNoYXJzID0gW10uY29uY2F0KGNoKTtcbiAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2hhcnNbMF0pO1xuICAgICAgICAvLyB1cGRhdGUgb3VyIHBvc2l0aW9uLCBnaXZlbiB0aGF0IHdlIHdyb3RlIGEgY2hhcmFjdGVyXG4gICAgICAgIHRoaXMuX2N1cnNvclswXSsrO1xuICAgICAgICBpZiAodGhpcy5fY3Vyc29yWzBdID49IHNpemVbMF0pIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnNvclswXSA9IDA7XG4gICAgICAgICAgICB0aGlzLl9jdXJzb3JbMV0rKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wdXRlRm9udFNpemUoKSB7IHRocm93IG5ldyBFcnJvcihcIlRlcm1pbmFsIGJhY2tlbmQgaGFzIG5vIG5vdGlvbiBvZiBmb250IHNpemVcIik7IH1cbiAgICBldmVudFRvUG9zaXRpb24oeCwgeSkgeyByZXR1cm4gW3gsIHldOyB9XG4gICAgY29tcHV0ZVNpemUoKSB7IHJldHVybiBbcHJvY2Vzcy5zdGRvdXQuY29sdW1ucywgcHJvY2Vzcy5zdGRvdXQucm93c107IH1cbn1cbiIsImNvbnN0IEZvbnRGYWNlT2JzZXJ2ZXIgPSByZXF1aXJlKCdmb250ZmFjZW9ic2VydmVyJyk7XHJcblxyXG5mdW5jdGlvbiBkb21SZWFkeSgpIHtcclxuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0aWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImxvYWRlZFwiKSB7XHJcblx0XHRcdHJlc29sdmUoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcclxuXHRcdFx0XHRyZXNvbHZlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWFkeShmbiwgZm9udHMgPSBbXSkge1xyXG5cdGlmIChmb250cy5sZW5ndGggPiAwKSB7XHJcblx0XHQvLyBUT0RPOiBhbGxvdyBtdWx0aXBsZSBmb250cyB+IGh0dHBzOi8vZ2l0aHViLmNvbS9icmFtc3RlaW4vZm9udGZhY2VvYnNlcnZlclxyXG5cdFx0Y29uc3QgZm9udCA9IG5ldyBGb250RmFjZU9ic2VydmVyKGZvbnRzWzBdKTtcclxuXHRcdGZvbnQubG9hZCgpXHJcblx0XHRcdC50aGVuKCgpID0+IHsgZG9tUmVhZHkoKS50aGVuKGZuKTsgfSlcclxuXHRcdFx0LmNhdGNoKCgpID0+IHsgY29uc29sZS53YXJuKCdlcnJvciBsb2FkaW5nIGZvbnQnKTsgZG9tUmVhZHkoKS50aGVuKGZuKTsgfSk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdGRvbVJlYWR5KCkudGhlbihmbik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVhZHk7XHJcbiIsImNvbnN0IFJPVCA9IHJlcXVpcmUoJ3JvdC1qcycpO1xyXG5cclxuY2xhc3MgRGlzcGxheSB7XHJcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XHJcblx0XHRvcHRpb25zID0geyB3aWR0aDogNjAsIGhlaWdodDogMzAsIC4uLm9wdGlvbnMgfTtcclxuXHRcdHRoaXMud2lkdGggPSBudWxsO1xyXG5cdFx0dGhpcy5oZWlnaHQgPSBudWxsO1xyXG5cdFx0dGhpcy5jZW50ZXIgPSB7fTtcclxuXHRcdHRoaXMuc2V0RGltZW5zaW9ucyhvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodCk7XHJcblxyXG5cdFx0dGhpcy5pZCA9IG9wdGlvbnMuaWQgfHwgJ2Rpc3BsYXknO1xyXG5cdFx0dGhpcy5yb3REaXNwbGF5ID0gbmV3IFJPVC5EaXNwbGF5KG9wdGlvbnMpOyAvLyAsIGxheW91dDpcInRlcm1cIn0pO1xyXG5cdFx0dGhpcy5kaXNwbGF5Q29udGFpbmVyID0gbnVsbDtcclxuXHRcdHRoaXMuZWx0ID0gbnVsbFxyXG5cdFx0dGhpcy5jYW1lcmFUYXJnZXQgPSBudWxsO1xyXG5cdFx0dGhpcy5zZXR1cEVsZW1lbnRzKCk7XHJcblx0fVxyXG5cclxuXHRzZXREaW1lbnNpb25zKHgsIHkpIHtcclxuXHRcdHRoaXMud2lkdGggPSB4O1xyXG5cdFx0dGhpcy5oZWlnaHQgPSB5O1xyXG5cdFx0dGhpcy5jZW50ZXIueCA9IE1hdGgucm91bmQoeC8yKTtcclxuXHRcdHRoaXMuY2VudGVyLnkgPSBNYXRoLnJvdW5kKHkvMik7XHJcblx0fVxyXG5cclxuXHRzZXR1cEVsZW1lbnRzKCkge1xyXG5cdFx0dGhpcy5kaXNwbGF5Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XHJcblx0XHR0aGlzLmVsdCA9IHRoaXMucm90RGlzcGxheS5nZXRDb250YWluZXIoKTsgLy8gY2FudmFzXHJcblx0XHR0aGlzLmFwcGVuZFRvRWxlbWVudCh0aGlzLmVsdCk7XHJcblx0fVxyXG5cclxuXHRhcHBlbmRUb0VsZW1lbnQoZWx0KSB7XHJcblx0XHR0aGlzLmRpc3BsYXlDb250YWluZXIuYXBwZW5kQ2hpbGQoZWx0KTtcclxuXHR9XHJcblxyXG5cdHNldENhbWVyYVRhcmdldChjYW1lcmFUYXJnZXQpIHtcclxuXHRcdGlmICghY2FtZXJhVGFyZ2V0KSB7XHJcblx0XHRcdGNvbnNvbGUud2FybihcIk5vIHRhcmdldFwiLCBjYW1lcmFUYXJnZXQpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRpZiAodHlwZW9mIGNhbWVyYVRhcmdldC54ICE9PSAnbnVtYmVyJyB8fCB0eXBlb2YgY2FtZXJhVGFyZ2V0LnkgIT09ICdudW1iZXInKSB7XHJcblx0XHRcdGNvbnNvbGUud2FybihcIkNvdWxkbid0IHRhcmdldFwiLCBjYW1lcmFUYXJnZXQpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHR0aGlzLmNhbWVyYVRhcmdldCA9IGNhbWVyYVRhcmdldDtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0Y2xlYXIoKSB7XHJcblx0XHR0aGlzLnJvdERpc3BsYXkuY2xlYXIoKTtcclxuXHR9XHJcblxyXG5cdGRyYXcoeCwgeSwgY2hhcmFjdGVyLCBmZ0NvbG9yLCBiZ0NvbG9yKSB7XHJcblx0XHRpZiAodGhpcy5jYW1lcmFUYXJnZXQpIHtcclxuXHRcdFx0eCArPSAodGhpcy5jZW50ZXIueCAtIHRoaXMuY2FtZXJhVGFyZ2V0LngpO1xyXG5cdFx0XHR5ICs9ICh0aGlzLmNlbnRlci55IC0gdGhpcy5jYW1lcmFUYXJnZXQueSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcy5yb3REaXNwbGF5LmRyYXcoeCwgeSwgY2hhcmFjdGVyLCBmZ0NvbG9yLCBiZ0NvbG9yKTtcclxuXHR9XHJcblxyXG5cdGRyYXdMZXZlbChnYW1lLCBsZXZlbCwgaGVybykge1xyXG5cdFx0bGV2ZWwuZHJhdyh0aGlzKTtcclxuXHRcdGlmICghaGVybykgeyByZXR1cm47IH1cclxuXHRcdGhlcm8uZHJhdyh0aGlzKTtcclxuXHRcdHRoaXMuZHJhd0ludGVyZmFjZShnYW1lLCBoZXJvKTtcclxuXHR9XHJcblxyXG5cdGRyYXdIZXJvKGhlcm8pIHtcclxuXHRcdGlmICghaGVybykgeyByZXR1cm47IH1cclxuXHRcdGhlcm8uZHJhdyh0aGlzKTtcclxuXHR9XHJcblxyXG5cdGRyYXdEYW1hZ2UoaXNEYW1hZ2VkID0gZmFsc2UsIG9wdGlvbnMgPSB7fSkge1xyXG5cdFx0Ly8gT3ZlcnJpZGUgdGhpc1xyXG5cdH1cclxuXHJcblx0ZHJhd0ludGVyZmFjZShnYW1lID0ge30sIGhlcm8gPSB7fSwgb3B0aW9ucyA9IHt9KSB7XHJcblx0XHQvLyBPdmVycmlkZSB0aGlzXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0UG9vbFNxdWFyZXModmFsdWUsIG1heCwgdXNlZCkge1xyXG5cdFx0Y29uc3QgbWF4TGVmdCA9IG1heCAtIHZhbHVlIC0gdXNlZDtcclxuXHRcdGxldCBzdHIgPSAnJztcclxuXHRcdGxldCBpO1xyXG5cdFx0Zm9yKGkgPSAwOyBpIDwgdmFsdWU7IGkrKykgeyBzdHIgKz0gJ+KWoCc7IH1cclxuXHRcdGZvcihpID0gMDsgaSA8IHVzZWQ7IGkrKykgeyBzdHIgKz0gJ+KWoyc7IH1cclxuXHRcdGZvcihpID0gMDsgaSA8IG1heExlZnQ7IGkrKykgeyBzdHIgKz0gJ+KWoic7IH1cclxuXHRcdHJldHVybiBzdHI7XHJcblx0fVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEaXNwbGF5OyIsImNvbnN0IE1hcCA9IHJlcXVpcmUoJy4vTWFwJyk7XHJcbmNvbnN0IEFjdG9yID0gcmVxdWlyZSgnLi9BY3RvcicpO1xyXG5jb25zdCBJdGVtID0gcmVxdWlyZSgnLi9JdGVtJyk7XHJcbmNvbnN0IFByb3AgPSByZXF1aXJlKCcuL1Byb3AnKTtcclxuY29uc3QgZ2VvbWV0ZXIgPSByZXF1aXJlKCcuL2dlb21ldGVyJyk7XHJcbmNvbnN0IHJhbmRvbSA9IHJlcXVpcmUoJy4vcmFuZG9tJyk7XHJcbmNvbnN0IHsgRElSU180LCBESVJTXzhfRElBR05PTFMgfSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XHJcblxyXG5jbGFzcyBMZXZlbCB7XHJcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9LCByZWZEYXRhID0ge30pIHtcclxuXHRcdHRoaXMuc2VlZCA9IG9wdGlvbnMuc2VlZCB8fCAxO1xyXG5cdFx0dGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8ICdVbmtub3duIGxldmVsJztcclxuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uIHx8IG51bGw7XHJcblx0XHR0aGlzLmxldmVsSW5kZXggPSBvcHRpb25zLmxldmVsSW5kZXggfHwgMDtcclxuXHRcdHRoaXMuY29sb3IgPSBvcHRpb25zLmNvbG9yIHx8ICcjNzc3JztcclxuXHRcdHRoaXMuYmFja2dyb3VuZCA9IG9wdGlvbnMuYmFja2dyb3VuZCB8fCAnIzIyMic7XHJcblx0XHRjb25zdCBtYXBPcHRpb25zID0ge1xyXG5cdFx0XHRjb2xvcjogdGhpcy5jb2xvcixcclxuXHRcdFx0YmFja2dyb3VuZDogdGhpcy5iYWNrZ3JvdW5kLFxyXG5cdFx0XHQuLi5vcHRpb25zLm1hcCxcclxuXHRcdFx0c2VlZDogdGhpcy5zZWVkLFxyXG5cdFx0XHRnZW5lcmF0b3JzOiBvcHRpb25zLmdlbmVyYXRvcnMgfHwge31cclxuXHRcdH07XHJcblx0XHR0aGlzLm1hcCA9IG5ldyBNYXAobWFwT3B0aW9ucyk7XHJcblx0XHR0aGlzLmFjdG9ycyA9IFtdO1xyXG5cdFx0dGhpcy5pdGVtcyA9IFtdO1xyXG5cdFx0dGhpcy5wcm9wcyA9IFtdO1xyXG5cdFx0dGhpcy5hY3RvcnMgPSB0aGlzLmdlbmVyYXRlQWN0b3JzKG9wdGlvbnMsIHJlZkRhdGEpO1xyXG5cdFx0dGhpcy5pdGVtcyA9IHRoaXMuZ2VuZXJhdGVJdGVtcyhvcHRpb25zLCByZWZEYXRhLml0ZW1zKTtcclxuXHRcdHRoaXMucHJvcHMgPSB0aGlzLmdlbmVyYXRlUHJvcHMob3B0aW9ucywgcmVmRGF0YS5wcm9wcyk7XHJcblx0XHR0aGlzLmV5ZSA9IHsgeDogMCwgeTogMCwgc2lnaHRSYW5nZTogNyB9O1xyXG5cdFx0dGhpcy5jdXN0b21FZmZlY3RzID0geyAuLi5vcHRpb25zLmN1c3RvbUVmZmVjdHMgfTtcclxuXHR9XHJcblxyXG5cdGRyYXcoZGlzcGxheSkge1xyXG5cdFx0ZGlzcGxheS5jbGVhcigpO1xyXG5cdFx0dGhpcy5kcmF3TWFwKGRpc3BsYXkpO1xyXG5cdFx0dGhpcy5kcmF3UHJvcHMoZGlzcGxheSk7XHJcblx0XHR0aGlzLmRyYXdJdGVtcyhkaXNwbGF5KTtcclxuXHRcdHRoaXMuZHJhd0FjdG9ycyhkaXNwbGF5KTtcclxuXHR9XHJcblxyXG5cdGRyYXdNYXAoZGlzcGxheSkge1xyXG5cdFx0dGhpcy5tYXAuZm9yRWFjaENlbGwoKGNlbGwsIHgsIHkpID0+IHtcclxuXHRcdFx0Y29uc3QgaW5WaWV3ID0gdGhpcy5pc0luVmlldyh4LCB5KTtcclxuXHRcdFx0Ly8gVE9ETzogaW1wcm92ZSB0aGlzXHJcblx0XHRcdGNvbnN0IGZnID0gY2VsbC5nZXRGb3JlZ3JvdW5kQ29sb3IoaW5WaWV3KTtcclxuXHRcdFx0Y29uc3QgYmcgPSBjZWxsLmdldEJhY2tncm91bmRDb2xvcihpblZpZXcpO1xyXG5cdFx0XHRkaXNwbGF5LmRyYXcoeCwgeSwgY2VsbC5jaGFyYWN0ZXIsIGZnLCBiZyk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGRyYXdQcm9wcyhkaXNwbGF5KSB7XHJcblx0XHR0aGlzLnByb3BzLmZvckVhY2goKHByb3ApID0+IHtcclxuXHRcdFx0Y29uc3QgbGlnaHRpbmcgPSB0aGlzLm1hcC5nZXRMaWdodGluZ0F0KHRoaXMuZXllLngsIHRoaXMuZXllLnkpO1xyXG5cdFx0XHRjb25zdCBpblZpZXcgPSB0aGlzLmlzSW5WaWV3KHByb3AueCwgcHJvcC55KTtcclxuXHRcdFx0cHJvcC5kcmF3KGRpc3BsYXksIGxpZ2h0aW5nLCBpblZpZXcpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkcmF3SXRlbXMoZGlzcGxheSkge1xyXG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdGNvbnN0IGxpZ2h0aW5nID0gdGhpcy5tYXAuZ2V0TGlnaHRpbmdBdCh0aGlzLmV5ZS54LCB0aGlzLmV5ZS55KTtcclxuXHRcdFx0Y29uc3QgaW5WaWV3ID0gdGhpcy5pc0luVmlldyhpdGVtLngsIGl0ZW0ueSk7XHJcblx0XHRcdGl0ZW0uZHJhdyhkaXNwbGF5LCBsaWdodGluZywgaW5WaWV3KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZHJhd0FjdG9ycyhkaXNwbGF5KSB7XHJcblx0XHQvLyBEcmF3IGRlYWQgZmlyc3QsIHRoZW4gbm9uLWRlYWRcclxuXHRcdHRoaXMuYWN0b3JzLmZvckVhY2goKGFjdG9yKSA9PiB7XHJcblx0XHRcdGlmIChhY3Rvci5kZWFkKCkpIHtcclxuXHRcdFx0XHR0aGlzLmRyYXdBY3RvcihkaXNwbGF5LCBhY3Rvcik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5hY3RvcnMuZm9yRWFjaCgoYWN0b3IpID0+IHtcclxuXHRcdFx0aWYgKCFhY3Rvci5kZWFkKCkpIHtcclxuXHRcdFx0XHR0aGlzLmRyYXdBY3RvcihkaXNwbGF5LCBhY3Rvcik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZHJhd0FjdG9yKGRpc3BsYXksIGFjdG9yKSB7XHJcblx0XHRjb25zdCBsaWdodGluZyA9IHRoaXMubWFwLmdldExpZ2h0aW5nQXQodGhpcy5leWUueCwgdGhpcy5leWUueSk7XHJcblx0XHRjb25zdCBpblZpZXcgPSB0aGlzLmlzSW5WaWV3KGFjdG9yLngsIGFjdG9yLnkpO1xyXG5cdFx0YWN0b3IuZHJhdyhkaXNwbGF5LCBsaWdodGluZywgaW5WaWV3KTtcclxuXHR9XHJcblxyXG5cdGlzSW5WaWV3KHgsIHkpIHsgLy8gVE9ETzogb3B0aW1pemVcclxuXHRcdGNvbnN0IHIgPSBnZW9tZXRlci5nZXREaXN0YW5jZSh0aGlzLmV5ZS54LCB0aGlzLmV5ZS55LCB4LCB5KTsgLy8gVE9ETzogYWxsb3cgbW9yZSBjb21wbGljYXRlZCBQT1ZcclxuXHRcdHJldHVybiAociA8PSB0aGlzLmV5ZS5zaWdodFJhbmdlKTtcdFx0XHJcblx0fVxyXG5cclxuXHRhZGRJdGVtKGl0ZW0pIHtcclxuXHRcdHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZUl0ZW0oaXRlbSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucmVtb3ZlVGhpbmcoJ2l0ZW1zJywgaXRlbSk7XHJcblx0fVxyXG5cclxuXHRhZGRBY3RvcihhY3Rvcikge1xyXG5cdFx0dGhpcy5hY3RvcnMucHVzaChhY3Rvcik7XHJcblx0fVxyXG5cclxuXHRyZW1vdmVBY3RvcihhY3Rvcikge1xyXG5cdFx0cmV0dXJuIHRoaXMucmVtb3ZlVGhpbmcoJ2FjdG9ycycsIGFjdG9yKTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZVRoaW5nKHByb3BlcnR5LCB0aGluZykge1xyXG5cdFx0Y29uc3QgaSA9IHRoaXNbcHJvcGVydHldLmZpbmRJbmRleCgoYSkgPT4geyByZXR1cm4gYSA9PT0gdGhpbmc7IH0pO1xyXG5cdFx0aWYgKGkgPD0gLTEpIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKCdub3RoaW5nIGZvdW5kIGluJywgcHJvcGVydHkpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRjb25zdCBhcnIgPSB0aGlzW3Byb3BlcnR5XS5zcGxpY2UoaSwgMSk7XHJcblx0XHRyZXR1cm4gYXJyWzBdO1x0XHRcclxuXHR9XHJcblxyXG5cdGZpbmRJdGVtKHgsIHkpIHtcclxuXHRcdGNvbnN0IGZvdW5kVGhpbmdzID0gdGhpcy5maW5kSXRlbXMoeCwgeSk7XHJcblx0XHRyZXR1cm4gKGZvdW5kVGhpbmdzLmxlbmd0aCkgPyBmb3VuZFRoaW5nc1swXSA6IG51bGw7XHJcblx0fVxyXG5cdGZpbmRJdGVtcyh4LCB5KSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0ueCA9PT0geCAmJiBpdGVtLnkgPT09IHkgJiYgIWl0ZW0uY29udGFpbmVkSW47XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZpbmRQcm9wKHgsIHkpIHtcclxuXHRcdGNvbnN0IGZvdW5kVGhpbmdzID0gdGhpcy5maW5kUHJvcHMoeCwgeSk7XHJcblx0XHRyZXR1cm4gKGZvdW5kVGhpbmdzLmxlbmd0aCkgPyBmb3VuZFRoaW5nc1swXSA6IG51bGw7XHJcblx0fVxyXG5cdGZpbmRQcm9wcyh4LCB5KSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy5maWx0ZXIoKHByb3ApID0+IHsgcmV0dXJuIHByb3AueCA9PT0geCAmJiBwcm9wLnkgPT09IHk7IH0pO1xyXG5cdH1cclxuXHRmaW5kUHJvcHNCeVR5cGUodHlwZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucHJvcHMuZmlsdGVyKChwcm9wKSA9PiB7IHJldHVybiBwcm9wLnR5cGUgPT09IHR5cGU7IH0pO1xyXG5cdH1cclxuXHJcblx0ZmluZEFjdG9yKHgsIHkpIHtcclxuXHRcdGNvbnN0IGZvdW5kVGhpbmdzID0gdGhpcy5maW5kQWN0b3JzKHgsIHkpO1xyXG5cdFx0cmV0dXJuIChmb3VuZFRoaW5ncy5sZW5ndGgpID8gZm91bmRUaGluZ3NbMF0gOiBudWxsO1xyXG5cdH1cclxuXHRmaW5kQWN0b3JzKHgsIHkpIHtcclxuXHRcdHJldHVybiB0aGlzLmFjdG9ycy5maWx0ZXIoKGFjdG9yKSA9PiB7XHJcblx0XHRcdHJldHVybiBhY3Rvci54ID09PSB4ICYmIGFjdG9yLnkgPT09IHkgJiYgIWFjdG9yLmRlYWQoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZmluZFRoaW5nSW5WaWV3KHdoYXQpIHsgLy8gJ2FjdG9ycycsICdpdGVtcycsICdwcm9wcydcclxuXHRcdHJldHVybiB0aGlzW3doYXRdLmZpbHRlcigoYSkgPT4gdGhpcy5pc0luVmlldyhhLngsIGEueSkpO1xyXG5cdH1cclxuXHJcblx0ZmluZEFjdG9yc0luVmlldyhleGNsdWRlSGVybykge1xyXG5cdFx0cmV0dXJuIHRoaXMuYWN0b3JzLmZpbHRlcigoYSkgPT4ge1xyXG5cdFx0XHRjb25zdCBpblZpZXcgPSB0aGlzLmlzSW5WaWV3KGEueCwgYS55KTtcclxuXHRcdFx0aWYgKGV4Y2x1ZGVIZXJvKSB7XHJcblx0XHRcdFx0cmV0dXJuIGluVmlldyAmJiAhYS5pc0hlcm87XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGluVmlldztcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZmluZEV2ZXJ5dGhpbmdJblZpZXcob3B0aW9ucyA9IHt9KSB7XHJcblx0XHRyZXR1cm4gdGhpcy5maW5kQWN0b3JzSW5WaWV3KG9wdGlvbnMuZXhjbHVkZUhlcm8pXHJcblx0XHRcdC5jb25jYXQodGhpcy5maW5kVGhpbmdJblZpZXcoJ2l0ZW1zJykpXHJcblx0XHRcdC5jb25jYXQodGhpcy5maW5kVGhpbmdJblZpZXcoJ3Byb3BzJykpO1xyXG5cdH1cclxuXHJcblx0ZmluZFRoaW5ncyh4LCB5KSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMuZmluZFByb3BzKHgsIHkpO1xyXG5cdFx0Y29uc3QgaXRlbXMgPSB0aGlzLmZpbmRJdGVtcyh4LCB5KTtcclxuXHRcdGNvbnN0IGFsbFRoaW5ncyA9IHByb3BzLmNvbmNhdChpdGVtcyk7XHJcblx0XHRyZXR1cm4gYWxsVGhpbmdzO1xyXG5cdH1cclxuXHJcblx0ZmluZFRoaW5nc0NhcmRpbmFsKHgsIHkpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5maW5kVGhpbmdzQnlEaXJlY3Rpb25zKCdwcm9wcycsIERJUlNfNCwgeCwgeSk7XHJcblx0XHRjb25zdCBpdGVtcyA9IHRoaXMuZmluZFRoaW5nc0J5RGlyZWN0aW9ucygnaXRlbXMnLCBESVJTXzQsIHgsIHkpO1xyXG5cdFx0Y29uc3QgYWxsVGhpbmdzID0gcHJvcHMuY29uY2F0KGl0ZW1zKTtcclxuXHRcdHJldHVybiBhbGxUaGluZ3M7XHJcblx0fVxyXG5cclxuXHRmaW5kVGhpbmdzRGlhZ25vbCh4LCB5KSB7XHJcblx0XHRjb25zdCBwcm9wcyA9IHRoaXMuZmluZFRoaW5nc0J5RGlyZWN0aW9ucygncHJvcHMnLCBESVJTXzhfRElBR05PTFMsIHgsIHkpO1xyXG5cdFx0Y29uc3QgaXRlbXMgPSB0aGlzLmZpbmRUaGluZ3NCeURpcmVjdGlvbnMoJ2l0ZW1zJywgRElSU184X0RJQUdOT0xTLCB4LCB5KTtcclxuXHRcdGNvbnN0IGFsbFRoaW5ncyA9IHByb3BzLmNvbmNhdChpdGVtcyk7XHJcblx0XHRyZXR1cm4gYWxsVGhpbmdzO1xyXG5cdH1cclxuXHJcblx0ZmluZFRoaW5nc0J5RGlyZWN0aW9ucyh0aGluZ05hbWUsIGRpcnMsIHgsIHkpIHtcclxuXHRcdGNvbnN0IGNvb3JkcyA9IFtdO1xyXG5cdFx0ZGlycy5mb3JFYWNoKChkaXIpID0+IHsgY29vcmRzLnB1c2goeyB4OiB4ICsgZGlyLngsIHk6IHkgKyBkaXIueSB9KTsgfSk7XHJcblx0XHRyZXR1cm4gdGhpc1t0aGluZ05hbWVdLmZpbHRlcigodGhpbmcpID0+IHtcclxuXHRcdFx0Y29uc3QgbWF0Y2hlcyA9IGNvb3Jkcy5maWx0ZXIoKHh5KSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIHh5LnggPT09IHRoaW5nLnggJiYgeHkueSA9PT0gdGhpbmcueSAmJiAhdGhpbmcuY29udGFpbmVkSW5cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBtYXRjaGVzLmxlbmd0aCA+IDA7XHJcblx0XHR9KTtcdFx0XHJcblx0fVxyXG5cclxuXHRmaW5kVGhpbmdTbWFydCh4LCB5LCBwZXJmZXJyZWRQcm9wZXJ0eSkge1xyXG5cdFx0bGV0IHRoaW5ncyA9IHRoaXMuZmluZFRoaW5ncyh4LCB5KTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdmaW5kIHNtYXJ0IC0gb24gc3BvdCcsIHRoaW5ncyk7XHJcblx0XHRpZiAoIXRoaW5ncy5sZW5ndGgpIHtcclxuXHRcdFx0dGhpbmdzID0gdGhpcy5maW5kVGhpbmdzQ2FyZGluYWwoeCwgeSk7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmaW5kIHNtYXJ0IC0gY2FyZGluYWwnLCB0aGluZ3MpO1xyXG5cdFx0XHRpZiAoIXRoaW5ncy5sZW5ndGgpIHtcclxuXHRcdFx0XHR0aGluZ3MgPSB0aGlzLmZpbmRUaGluZ3NEaWFnbm9sKHgsIHkpO1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdmaW5kIHNtYXJ0IC0gZGlhZ25vbHMnLCB0aGluZ3MpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAocGVyZmVycmVkUHJvcGVydHkpIHtcclxuXHRcdFx0dGhpbmdzLnNvcnQoKGEsIGIpID0+IHtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhhLCBiLCBhW3BlcmZlcnJlZFByb3BlcnR5XSk7XHJcblx0XHRcdFx0cmV0dXJuIGJbcGVyZmVycmVkUHJvcGVydHldO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJzb3J0ZWRcIiwgdGhpbmdzKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGluZ3NbMF07XHJcblx0fVxyXG5cclxuXHRmaW5kUmFuZG9tRnJlZUNlbGwoc2VlZCwgY2xlYXJpbmcsIHJldHJpZXMgPSA1MCkge1xyXG5cdFx0bGV0IGNlbGwgPSB0aGlzLm1hcC5nZXRSYW5kb21GcmVlQ2VsbCgpO1xyXG5cdFx0aWYgKCFyZXRyaWVzKSB7XHJcblx0XHRcdHJldHVybiBjZWxsO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgdHJ5QWdhaW4gPSAoKSA9PiB7XHJcblx0XHRcdHJldHVybiB0aGlzLmZpbmRSYW5kb21GcmVlQ2VsbChzZWVkLCBjbGVhcmluZywgKHJldHJpZXMgLSAxKSk7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHRoaXMuZmluZEFjdG9ycyhjZWxsLngsIGNlbGwueSkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ5QWdhaW4oKTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLmZpbmRUaGluZ3MoY2VsbC54LCBjZWxsLnkpLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIHRyeUFnYWluKCk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5maW5kTWFwQ2xlYXJpbmcoY2VsbC54LCBjZWxsLnkpID49IGNsZWFyaW5nKSB7XHJcblx0XHRcdHJldHVybiB0cnlBZ2FpbigpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNlbGw7XHJcblx0fVxyXG5cclxuXHRmaW5kTWFwQ2xlYXJpbmcoeCwgeSkge1xyXG5cdFx0Ly8gVE9ETzogbG9vcFxyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG5cclxuXHRkaXNjb3ZlckNpcmNsZSh4LCB5LCByYWRpdXMpIHtcclxuXHRcdHJldHVybiB0aGlzLm1hcC5kaXNjb3ZlckNpcmNsZSh4LCB5LCByYWRpdXMpO1xyXG5cdH1cclxuXHJcblx0Ly8gQWN0aW9uc1xyXG5cclxuXHR1c2VUaGluZyhhY3RvciwgYWN0aW9uTmFtZSwgdGhpbmcpIHtcclxuXHRcdGNvbnN0IG91dGNvbWUgPSB0aGluZy5hY3Rpb24oYWN0aW9uTmFtZSwgYWN0b3IpO1xyXG5cdFx0aWYgKHR5cGVvZiBvdXRjb21lICE9PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oJ2FjdGlvbiByZXR1cm5zIG91dGNvbWUgdGhhdCBpcyBub3Qgb2JqZWN0JywgYWN0aW9uTmFtZSwgdGhpbmcsIG91dGNvbWUpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5kb0VmZmVjdHMob3V0Y29tZS5lZmZlY3RzLCBhY3RvciwgYWN0b3IpO1xyXG5cdFx0cmV0dXJuIG91dGNvbWU7XHJcblx0fVxyXG5cclxuXHR0aHJvdyhhY3Rvciwgd2hhdCwgeCwgeSkge1xyXG5cdFx0Y29uc3QgaXRlbSA9IGFjdG9yLmludmVudG9yeS5yZW1vdmUod2hhdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRpdGVtLnggPSAodHlwZW9mIHggPT09ICdudW1iZXInKSA/IHggOiBhY3Rvci54O1xyXG5cdFx0aXRlbS55ID0gKHR5cGVvZiB5ID09PSAnbnVtYmVyJykgPyB5IDogYWN0b3IueTtcclxuXHRcdGNvbnN0IGNvbnRhaW5lcnMgPSB0aGlzLmZpbmRUaGluZ3MoeCwgeSkuZmlsdGVyKCh0aGluZykgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0aGluZyk7XHJcblx0XHRcdHJldHVybiB0aGluZy5oYXNTcGFjZSgpO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoY29udGFpbmVycy5sZW5ndGgpIHtcclxuXHRcdFx0Y29uc3QgY29udGFpbmVyID0gY29udGFpbmVyc1swXTtcclxuXHRcdFx0Y29udGFpbmVyLmFkZFRvSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHRyZXR1cm4gYCR7YWN0b3IubmFtZX0gcHV0cyAke3doYXQubmFtZX0gaW50byB0aGUgJHtjb250YWluZXIubmFtZX0uYDtcclxuXHRcdH1cclxuXHRcdHRoaXMuYWRkSXRlbShpdGVtKTtcclxuXHRcdHJldHVybiBgJHthY3Rvci5uYW1lfSB0aHJvd3MgZG93biBhICR7d2hhdC5uYW1lfS5gO1xyXG5cdH1cclxuXHJcblx0ZG9Jbml0aWF0aXZlKCkge1xyXG5cdFx0Y29uc3QgbGl2aW5nQWN0b3JzID0gdGhpcy5hY3RvcnMuZmlsdGVyKChhY3RvcikgPT4gIWFjdG9yLmRlYWQoKSk7XHJcblx0XHRsZXQgb3JkZXJlZEFjdG9ycyA9IHJhbmRvbS5zaHVmZmxlKGxpdmluZ0FjdG9ycyk7XHJcblx0XHQvLyBUT0RPOiBMb29rIGZvciBpbml0aWF0aXZlIGJvb3N0LCBwdXQgYXQgdG9wIG9mIGxpc3RcclxuXHR9XHJcblxyXG5cdHN0YXRpYyByZW1vdmVFZmZlY3RzKGVmZmVjdHMsIGtleSkge1xyXG5cdFx0bGV0IGkgPSBlZmZlY3RzLmluZGV4T2Yoa2V5KTtcclxuXHRcdHdoaWxlIChpID4gLTEpIHtcclxuXHRcdFx0ZWZmZWN0cy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdGkgPSBlZmZlY3RzLmluZGV4T2Yoa2V5KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJlc29sdmVSb3VuZEVmZmVjdHMoKSB7XHJcblx0XHR0aGlzLmFjdG9ycy5mb3JFYWNoKChhY3RvcikgPT4ge1xyXG5cdFx0XHRjb25zdCByb3VuZEVmZmVjdHMgPSBhY3Rvci5hY3RpdmF0ZUFiaWxpdGllcygncm91bmQnKTtcclxuXHRcdFx0dGhpcy5kb0VmZmVjdHMocm91bmRFZmZlY3RzLCBhY3RvciwgYWN0b3IpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXNvbHZlQ29tYmF0RWZmZWN0cyhhdHRhY2tlciwgZGVmZW5kZXIpIHtcclxuXHRcdGxldCBhdHRhY2tFZmZlY3RzID0gYXR0YWNrZXIuYWN0aXZhdGVBYmlsaXRpZXMoJ2F0dGFjaycpO1xyXG5cdFx0bGV0IGRlZmVuZEVmZmVjdHMgPSBkZWZlbmRlci5hY3RpdmF0ZUFiaWxpdGllcygnYXR0YWNrZWQnKTtcclxuXHRcdGxldCBkYW1hZ2VFZmZlY3RzO1xyXG5cdFx0bGV0IGRhbWFnZWRFZmZlY3RzO1xyXG5cclxuXHRcdGF0dGFja0VmZmVjdHMucHVzaCgnYXR0YWNrJyk7XHJcblxyXG5cdFx0Y29uc29sZS5sb2coYXR0YWNrZXIubmFtZSwgSlNPTi5zdHJpbmdpZnkoYXR0YWNrRWZmZWN0cyksICd2cycsIGRlZmVuZGVyLm5hbWUsIEpTT04uc3RyaW5naWZ5KGRlZmVuZEVmZmVjdHMpLCBkZWZlbmRlcik7XHJcblxyXG5cdFx0aWYgKGRlZmVuZEVmZmVjdHMuaW5jbHVkZXMoJ2NhbmNlbEF0dGFjaycpKSB7XHJcblx0XHRcdExldmVsLnJlbW92ZUVmZmVjdHMoYXR0YWNrRWZmZWN0cywgJ2F0dGFjaycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChhdHRhY2tFZmZlY3RzLmluY2x1ZGVzKCdhdHRhY2snKSkge1xyXG5cdFx0XHRhdHRhY2tFZmZlY3RzLnB1c2goJ3dlYXBvbkRhbWFnZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGF0dGFja0VmZmVjdHMuaW5jbHVkZXMoJ2RhbWFnZScpIHx8IGF0dGFja0VmZmVjdHMuaW5jbHVkZXMoJ3dlYXBvbkRhbWFnZScpKSB7XHJcblx0XHRcdGRhbWFnZUVmZmVjdHMgPSBkZWZlbmRlci5hY3RpdmF0ZUFiaWxpdGllcygnZGFtYWdlJyk7XHJcblx0XHRcdGF0dGFja0VmZmVjdHMgPSBhdHRhY2tFZmZlY3RzLmNvbmNhdChkYW1hZ2VFZmZlY3RzKTtcclxuXHRcdFx0ZGFtYWdlZEVmZmVjdHMgPSBkZWZlbmRlci5hY3RpdmF0ZUFiaWxpdGllcygnZGFtYWdlZCcpO1xyXG5cdFx0XHRkZWZlbmRFZmZlY3RzID0gZGVmZW5kRWZmZWN0cy5jb25jYXQoZGFtYWdlZEVmZmVjdHMpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGRlZmVuZEVmZmVjdHMuaW5jbHVkZXMoJ2NhbmNlbERhbWFnZScpIHx8IGF0dGFja0VmZmVjdHMuaW5jbHVkZXMoJ2NhbmNlbERhbWFnZScpKSB7XHJcblx0XHRcdExldmVsLnJlbW92ZUVmZmVjdHMoYXR0YWNrRWZmZWN0cywgJ2RhbWFnZScpO1xyXG5cdFx0XHRMZXZlbC5yZW1vdmVFZmZlY3RzKGF0dGFja0VmZmVjdHMsICd3ZWFwb25EYW1hZ2UnKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zb2xlLmxvZyhhdHRhY2tlci5uYW1lLCBKU09OLnN0cmluZ2lmeShhdHRhY2tFZmZlY3RzKSwgJ3ZzJywgSlNPTi5zdHJpbmdpZnkoZGVmZW5kRWZmZWN0cykpO1xyXG5cclxuXHRcdGNvbnN0IG91dGNvbWVBdHRhY2sgPSB0aGlzLmRvRWZmZWN0cyhhdHRhY2tFZmZlY3RzLCBhdHRhY2tlciwgZGVmZW5kZXIpO1xyXG5cdFx0Y29uc3Qgb3V0Y29tZURlZmVuZCA9IHRoaXMuZG9FZmZlY3RzKGRlZmVuZEVmZmVjdHMsIGRlZmVuZGVyLCBhdHRhY2tlcik7XHJcblxyXG5cdFx0Ly8gVE9ETzogZ2VuZXJhdGUgbWVzc2FnZXNcclxuXHJcblx0XHRyZXR1cm4geyBvdXRjb21lQXR0YWNrLCBvdXRjb21lRGVmZW5kLCBhdHRhY2tFZmZlY3RzLCBkZWZlbmRFZmZlY3RzIH07XHJcblx0fVxyXG5cclxuXHRkb0VmZmVjdHMoZWZmZWN0cywgYWN0b3IsIG9wcG9uZW50KSB7XHJcblx0XHRsZXQgZGFtYWdlID0gMDtcclxuXHRcdGlmICghZWZmZWN0cykgeyByZXR1cm4geyBkYW1hZ2UgfTsgfVxyXG5cdFx0ZWZmZWN0cy5mb3JFYWNoKChlZmZlY3QpID0+IHtcclxuXHRcdFx0ZGFtYWdlICs9IHRoaXMuZG9FZmZlY3QoZWZmZWN0LCBhY3Rvciwgb3Bwb25lbnQpO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4geyBkYW1hZ2UgfTtcclxuXHR9XHJcblxyXG5cdGRvRWZmZWN0KGVmZmVjdCwgYWN0b3IsIG9wcG9uZW50KSB7XHJcblx0XHRjb25zb2xlLmxvZygnZG9FZmZlY3QnLCBlZmZlY3QpO1xyXG5cdFx0bGV0IGRhbWFnZSA9IDA7XHJcblx0XHRzd2l0Y2goZWZmZWN0KSB7XHJcblx0XHRcdGNhc2UgJ2RhbWFnZSc6XHJcblx0XHRcdFx0ZGFtYWdlICs9IDE7XHJcblx0XHRcdFx0b3Bwb25lbnQud291bmQoMSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICd3ZWFwb25EYW1hZ2UnOlxyXG5cdFx0XHRcdGRhbWFnZSArPSBhY3Rvci5nZXRXZWFwb25EYW1hZ2UoKTtcclxuXHRcdFx0XHRvcHBvbmVudC53b3VuZChkYW1hZ2UpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnaGVhbCc6XHJcblx0XHRcdGNhc2UgJ2hwJzpcclxuXHRcdFx0XHRhY3Rvci5oZWFsKDEpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXAnOlxyXG5cdFx0XHRcdGFjdG9yLmhlYWxQb29sKCdhcCcsIDEpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYnAnOlxyXG5cdFx0XHRcdGFjdG9yLmhlYWxQb29sKCdicCcsIDEpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZXAnOlxyXG5cdFx0XHRcdGFjdG9yLmhlYWxQb29sKCdlcCcsIDEpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnbW92ZVN3aXRjaCc6IHtcclxuXHRcdFx0XHRjb25zdCB7IHgsIHkgfSA9IGFjdG9yO1xyXG5cdFx0XHRcdGFjdG9yLnNldENvb3JkaW5hdGVzKG9wcG9uZW50LngsIG9wcG9uZW50LnkpO1xyXG5cdFx0XHRcdG9wcG9uZW50LnNldENvb3JkaW5hdGVzKHgsIHkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhcERhbWFnZSc6XHJcblx0XHRcdFx0YWN0b3IuZGFtYWdlUG9vbCgnYXAnLCAxKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2JwRGFtYWdlJzpcclxuXHRcdFx0XHRhY3Rvci5kYW1hZ2VQb29sKCdicCcsIDEpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZXBEYW1hZ2UnOlxyXG5cdFx0XHRcdGFjdG9yLmRhbWFnZVBvb2woJ2VwJywgMSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdwdXNoJzpcclxuXHRcdFx0XHR0aGlzLnB1c2hBY3RvcihhY3Rvciwgb3Bwb25lbnQpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncHVzaEFvZSc6XHJcblx0XHRcdFx0dGhpcy5wdXNoQWN0b3IoYWN0b3IsIG9wcG9uZW50KTtcclxuXHRcdFx0XHQvLyBUT0RPOiBIYW5kbGUgYW9lIC0tPiBldmVyeW9uZSAoYWNjZXB0IG9wcG9uZW50KSBhcm91bmQgaGl0WCwgaGl0WSBnZXRzIGtub2NrZWQgYmFja1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnbW92ZUJhY2snOlxyXG5cdFx0XHRcdHRoaXMucHVzaEFjdG9yKG9wcG9uZW50LCBhY3Rvcik7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdpbml0aWF0aXZlJzpcclxuXHRcdFx0XHRhY3Rvci5pbml0aWF0aXZlQm9vc3QgPSAxO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBcImZpcmVcIjpcclxuXHRcdFx0XHQvLyBUT0RPOlxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBcImVuZEdhbWVcIjpcclxuXHRcdFx0XHQvLyBUT0RPXHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFwic2NvcmUxMDAwXCI6XHJcblx0XHRcdFx0YWN0b3Iuc2NvcmUgKz0gMTAwMDtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhpcy5kb0N1c3RvbUVmZmVjdChlZmZlY3QsIGFjdG9yLCBvcHBvbmVudCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGRhbWFnZTtcclxuXHR9XHJcblxyXG5cdGRvQ3VzdG9tRWZmZWN0KGVmZmVjdCwgYWN0b3IsIG9wcG9uZW50KSB7XHJcblx0XHRpZiAodHlwZW9mIHRoaXMuY3VzdG9tRWZmZWN0c1tlZmZlY3RdID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHRoaXMuY3VzdG9tRWZmZWN0c1tlZmZlY3RdKGVmZmVjdCwgYWN0b3IsIG9wcG9uZW50KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1c2hBY3RvcihwdXNoZXIsIHB1c2hlZSkge1xyXG5cdFx0Y29uc3QgeyB4LCB5IH0gPSBwdXNoZXI7XHJcblx0XHRsZXQgbW92ZVggPSBwdXNoZWUueCAtIHg7XHJcblx0XHRsZXQgbW92ZVkgPSBwdXNoZWUueSAtIHk7XHJcblx0XHRtb3ZlWCA9IG1vdmVYIC8gKG1vdmVYID09PSAwID8gMSA6IE1hdGguYWJzKG1vdmVYKSk7XHJcblx0XHRtb3ZlWSA9IG1vdmVZIC8gKG1vdmVZID09PSAwID8gMSA6IE1hdGguYWJzKG1vdmVZKSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygncHVzaGluZycsIHB1c2hlZS5uYW1lLCBtb3ZlWCwgbW92ZVkpO1xyXG5cdFx0cHVzaGVlLm1vdmUobW92ZVgsIG1vdmVZKTtcclxuXHR9XHJcblxyXG5cdGdldEFjdG9yc0luaXRpYXRpdmVPcmRlcmVkKCkge1xyXG5cdFx0Y29uc3QgcmFuZG9tQWN0b3JzID0gcmFuZG9tLnNodWZmbGUodGhpcy5hY3RvcnMpO1xyXG5cdFx0Y29uc3QgZmlyc3RBY3RvcnMgPSBbXTtcclxuXHRcdGxldCBpID0gcmFuZG9tQWN0b3JzLmxlbmd0aCAtIDE7XHJcblx0XHR3aGlsZSAoaS0tKSB7XHJcblx0XHRcdGNvbnN0IGFjdG9yID0gcmFuZG9tQWN0b3JzW2ldO1xyXG5cdFx0XHRpZiAoYWN0b3IuaW5pdGlhdGl2ZUJvb3N0ID4gMCkge1xyXG5cdFx0XHRcdGZpcnN0QWN0b3JzLnB1c2goYWN0b3IpO1xyXG5cdFx0XHRcdHJhbmRvbUFjdG9ycy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBmaXJzdEFjdG9ycy5jb25jYXQocmFuZG9tQWN0b3JzKTtcclxuXHR9XHJcblxyXG5cdGNvb2xPZmZJbml0aWF0aXZlQm9vc3RzKCkge1xyXG5cdFx0dGhpcy5hY3RvcnMuZm9yRWFjaCgoYWN0b3IpID0+IHtcclxuXHRcdFx0YWN0b3IuaW5pdGlhdGl2ZUJvb3N0ID0gMDtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gR2VuZXJhdGlvblxyXG5cclxuXHRnZW5lcmF0ZUl0ZW0obGV2ZWxJdGVtID0ge30sIENsYXNzLCBzZWVkID0gMCwgdHlwZXMgPSBbXSwgYmFja2dyb3VuZCA9IHVuZGVmaW5lZCkge1xyXG5cdFx0Y29uc3QgeyB4LCB5IH0gPSB0aGlzLmZpbmRSYW5kb21GcmVlQ2VsbChzZWVkLCBsZXZlbEl0ZW0uY2xlYXJpbmcpO1xyXG5cdFx0Y29uc3QgaXRlbVR5cGVPcHRpb25zID0gKGxldmVsSXRlbS50eXBlICYmIHR5cGVzW2xldmVsSXRlbS50eXBlXSkgPyB0eXBlc1tsZXZlbEl0ZW0udHlwZV0gOiB7fTtcclxuXHRcdGNvbnN0IGl0ZW1PcHRpb25zID0ge1xyXG5cdFx0XHR4LCB5LFxyXG5cdFx0XHQuLi5pdGVtVHlwZU9wdGlvbnMsXHJcblx0XHRcdC4uLmxldmVsSXRlbVxyXG5cdFx0fTtcclxuXHRcdGlmIChiYWNrZ3JvdW5kKSB7IGl0ZW1PcHRpb25zLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kOyB9XHJcblx0XHRjb25zdCBpdGVtID0gbmV3IENsYXNzKGl0ZW1PcHRpb25zKTtcclxuXHRcdHJldHVybiBpdGVtO1xyXG5cdH1cclxuXHJcblx0Z2VuZXJhdGVJdGVtcyhvcHRpb25zID0ge30sIGl0ZW1UeXBlcyA9IHt9KSB7XHJcblx0XHRsZXQgc2VlZCA9IHRoaXMuc2VlZCArIDIwMDtcclxuXHRcdGxldCB7IGl0ZW1zID0gW10gfSA9IG9wdGlvbnM7XHJcblxyXG5cdFx0Y29uc3QgYXJyID0gW107XHJcblx0XHRpdGVtcy5mb3JFYWNoKChsZXZlbEl0ZW0pID0+IHtcclxuXHRcdFx0Y29uc3QgcXVhbnRpdHkgPSAodHlwZW9mIGxldmVsSXRlbS5xdWFudGl0eSA9PT0gJ251bWJlcicpID8gbGV2ZWxJdGVtLnF1YW50aXR5IDogMTtcclxuXHRcdFx0Ly8gVE9ETzogaGFuZGxlIHdlaWdodCwgZXRjLlxyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHF1YW50aXR5OyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBpdGVtID0gdGhpcy5nZW5lcmF0ZUl0ZW0obGV2ZWxJdGVtLCBJdGVtLCArK3NlZWQsIGl0ZW1UeXBlcyk7XHJcblx0XHRcdFx0YXJyLnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGFycjtcclxuXHR9XHJcblxyXG5cdGdlbmVyYXRlUHJvcHMob3B0aW9ucyA9IHt9LCBwcm9wVHlwZXMgPSB7fSkge1xyXG5cdFx0bGV0IHNlZWQgPSB0aGlzLnNlZWQgKyAxMDA7XHJcblx0XHRsZXQgeyBwcm9wcyA9IFtdIH0gPSBvcHRpb25zO1xyXG5cdFx0Y29uc3QgYmFja2dyb3VuZCA9IHRoaXMuYmFja2dyb3VuZDtcclxuXHJcblx0XHRjb25zdCBhcnIgPSBbXTtcclxuXHRcdHByb3BzLmZvckVhY2goKGxldmVsUHJvcCkgPT4ge1xyXG5cdFx0XHRjb25zdCBxdWFudGl0eSA9ICh0eXBlb2YgbGV2ZWxQcm9wLnF1YW50aXR5ID09PSAnbnVtYmVyJykgPyBsZXZlbFByb3AucXVhbnRpdHkgOiAxO1xyXG5cdFx0XHQvLyBUT0RPOiBoYW5kbGUgd2VpZ2h0LCBldGMuXHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcXVhbnRpdHk7IGkrKykge1xyXG5cdFx0XHRcdGNvbnN0IHByb3AgPSB0aGlzLmdlbmVyYXRlSXRlbShsZXZlbFByb3AsIFByb3AsICsrc2VlZCwgcHJvcFR5cGVzLCBiYWNrZ3JvdW5kKTtcclxuXHRcdFx0XHRhcnIucHVzaChwcm9wKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gYXJyO1xyXG5cdH1cclxuXHJcblx0Z2VuZXJhdGVBY3RvcnMob3B0aW9ucyA9IHt9LCByZWZEYXRhID0ge30pIHtcclxuXHRcdGNvbnNvbGUubG9nKCdnZW5lcmF0ZUFjdG9ycycsIG9wdGlvbnMpO1xyXG5cdFx0bGV0IHNlZWQgPSB0aGlzLnNlZWQgKyA5OTk7IC8vID9cclxuXHRcdGNvbnN0IHsgbW9uc3RlclNwYXduLCBtb25zdGVycyA9IFtdIH0gPSBvcHRpb25zO1xyXG5cdFx0Y29uc3QgbW9uc3RlclR5cGVzID0gcmVmRGF0YS5tb25zdGVycztcclxuXHRcdGNvbnN0IGRlcHRoID0gb3B0aW9ucy5sZXZlbEluZGV4O1xyXG5cdFx0Y29uc3QgYXZhaWxhYmxlTW9uc3RlcnMgPSBtb25zdGVycy5maWx0ZXIoKGxldmVsTW9uc3RlcikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKCFsZXZlbE1vbnN0ZXIubWluRGVwdGgpIHx8IGxldmVsTW9uc3Rlci5taW5EZXB0aCA8PSBkZXB0aDtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc3QgYXZhaWxhYmxlTW9uc3RlcldlaWdodHMgPSB7fTtcclxuXHRcdGF2YWlsYWJsZU1vbnN0ZXJzLmZvckVhY2goKGxldmVsTW9uc3RlcikgPT4ge1xyXG5cdFx0XHRpZiAobGV2ZWxNb25zdGVyLndlaWdodCkge1xyXG5cdFx0XHRcdGF2YWlsYWJsZU1vbnN0ZXJXZWlnaHRzW2xldmVsTW9uc3Rlci50eXBlXSA9IGxldmVsTW9uc3Rlci53ZWlnaHQ7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0Y29uc3QgaGFzTW9uc3RlcnNXaXRoV2VpZ2h0cyA9IE9iamVjdC5rZXlzKGF2YWlsYWJsZU1vbnN0ZXJXZWlnaHRzKS5sZW5ndGggPiAwO1xyXG5cdFx0Y29uc3QgbW9uc3RlclNwYXduTnVtYmVyID0gKG1vbnN0ZXJTcGF3biA9PT0gdW5kZWZpbmVkKSA/IDEwIDogcmFuZG9tLnJvbGwobW9uc3RlclNwYXduKTtcclxuXHRcdGNvbnN0IHRvdGFsTW9uc3RlclNwYXduUXVhbnRpdHkgPSBtb25zdGVyU3Bhd25OdW1iZXI7XHJcblx0XHRjb25zdCBhY3RvcnMgPSBbXTtcclxuXHRcdC8vIENyZWF0ZSBtb25zdGVycyB3aXRoIGZpeGVkIHF1YW50aXRpZXNcclxuXHRcdC8vIE5vdGU6IHRoaXMgY291bGQgZXhjZWVkIHRoZSB0b3RhbCBxdWFudGl0eVxyXG5cdFx0Y29uc3QgYXZhaWxhYmxlTW9uc3RlcnNGaXhlZFF1YW50aXRpZXMgPSBhdmFpbGFibGVNb25zdGVycy5maWx0ZXIoKGxldmVsTW9uc3RlcikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gbGV2ZWxNb25zdGVyLnF1YW50aXR5O1xyXG5cdFx0fSk7XHJcblx0XHRhdmFpbGFibGVNb25zdGVyc0ZpeGVkUXVhbnRpdGllcy5mb3JFYWNoKChsZXZlbE1vbnN0ZXIpID0+IHtcclxuXHRcdFx0Y29uc3QgbW9uc3RlclR5cGVLZXkgPSBsZXZlbE1vbnN0ZXIudHlwZTtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZXZlbE1vbnN0ZXIucXVhbnRpdHk7IGkrKykge1xyXG5cdFx0XHRcdGNvbnN0IG1vbnN0ZXIgPSB0aGlzLmNyZWF0ZUFjdG9yKG1vbnN0ZXJUeXBlcywgbW9uc3RlclR5cGVLZXksICsrc2VlZCk7XHJcblx0XHRcdFx0YWN0b3JzLnB1c2gobW9uc3Rlcik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0Ly8gQ3JlYXRlIHdlaWdodGVkIG1vbnN0ZXJzXHJcblx0XHRpZiAoaGFzTW9uc3RlcnNXaXRoV2VpZ2h0cykge1xyXG5cdFx0XHRsZXQgc3RvcHBlciA9IDA7XHJcblx0XHRcdHdoaWxlIChhY3RvcnMubGVuZ3RoIDwgdG90YWxNb25zdGVyU3Bhd25RdWFudGl0eSAmJiBzdG9wcGVyIDwgOTAwMCkge1xyXG5cdFx0XHRcdHN0b3BwZXIrKztcclxuXHRcdFx0XHQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3QgbW9uc3RlclR5cGVLZXkgPSByYW5kb20uZ2V0V2VpZ2h0ZWRWYWx1ZShhdmFpbGFibGVNb25zdGVyV2VpZ2h0cyk7XHJcblx0XHRcdFx0XHRpZiAoIW1vbnN0ZXJUeXBlS2V5KSB7IHJldHVybjsgfVxyXG5cdFx0XHRcdFx0Y29uc3QgbW9uc3RlciA9IHRoaXMuY3JlYXRlQWN0b3IobW9uc3RlclR5cGVzLCBtb25zdGVyVHlwZUtleSwgKytzZWVkKTtcclxuXHRcdFx0XHRcdGFjdG9ycy5wdXNoKG1vbnN0ZXIpO1xyXG5cdFx0XHRcdH0pKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdBY3RvcnMgYXQgZGVwdGgnLCBkZXB0aCwgYWN0b3JzKTtcclxuXHRcdHJldHVybiBhY3RvcnM7XHJcblx0fVxyXG5cclxuXHRjcmVhdGVBY3Rvcihtb25zdGVyVHlwZXMsIG1vbnN0ZXJUeXBlS2V5LCBzZWVkKSB7XHJcblx0XHRpZiAoIW1vbnN0ZXJUeXBlS2V5KSB7IHJldHVybjsgfVxyXG5cdFx0Y29uc3QgeyB4LCB5IH0gPSB0aGlzLmZpbmRSYW5kb21GcmVlQ2VsbChzZWVkKTtcclxuXHRcdGxldCBtb25zdGVyT3B0aW9ucyA9IG1vbnN0ZXJUeXBlc1ttb25zdGVyVHlwZUtleV07XHJcblx0XHRtb25zdGVyT3B0aW9ucyA9IHsgdHlwZTogbW9uc3RlclR5cGVLZXksIGFnZ3JvOiAxMDAsIC4uLm1vbnN0ZXJPcHRpb25zLCB4LCB5IH07XHJcblx0XHQvLyBjb25zb2xlLmxvZyhtb25zdGVyVHlwZXMsIG1vbnN0ZXJUeXBlS2V5LCBtb25zdGVyT3B0aW9ucyk7XHJcblx0XHRyZXR1cm4gbmV3IEFjdG9yKG1vbnN0ZXJPcHRpb25zKTtcdFx0XHJcblx0fVxyXG5cclxuXHQvLyBHZXRzXHJcblxyXG5cdGdldE1hcCgpIHtcclxuXHRcdHJldHVybiB0aGlzLm1hcDtcclxuXHR9XHJcblxyXG5cdGdldENlbGxQYXNzYWJpbGl0eSh4LCB5KSB7XHJcblx0XHRjb25zdCBpc01hcFBhc3NhYmxlID0gdGhpcy5tYXAuZ2V0Q2VsbFBhc3NhYmlsaXR5KHgsIHkpO1xyXG5cdFx0aWYgKCFpc01hcFBhc3NhYmxlKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0Y29uc3QgYWN0b3JzSGVyZSA9IHRoaXMuYWN0b3JzLmZpbHRlcigoYWN0b3IpID0+IHtcclxuXHRcdFx0cmV0dXJuIGFjdG9yLnggPT09IHggJiYgYWN0b3IueSA9PT0geSAmJiAhYWN0b3IucGFzc2FibGU7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiAoYWN0b3JzSGVyZS5sZW5ndGggPT09IDApO1xyXG5cdH1cclxuXHJcblx0Ly8gU2V0c1xyXG5cclxuXHRzZXRFeWUoYWN0b3JUaGluZykge1xyXG5cdFx0dGhpcy5leWUueCA9IGFjdG9yVGhpbmcueDtcclxuXHRcdHRoaXMuZXllLnkgPSBhY3RvclRoaW5nLnk7XHJcblx0XHR0aGlzLmV5ZS5zaWdodFJhbmdlID0gYWN0b3JUaGluZy5zaWdodFJhbmdlO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMZXZlbDtcclxuIiwiY29uc3QgUk9UID0gcmVxdWlyZSgncm90LWpzJyk7XHJcbmNvbnN0IENlbGwgPSByZXF1aXJlKCcuL0NlbGwnKTtcclxuY29uc3QgZ2VvbWV0ZXIgPSByZXF1aXJlKCcuL2dlb21ldGVyJyk7XHJcbmNvbnN0IHJhbmRvbSA9IHJlcXVpcmUoJy4vcmFuZG9tJyk7XHJcblxyXG5jb25zdCBESUdHRVJfVFlQRSA9ICdkaWdnZXInO1xyXG5cclxuY2xhc3MgTWFwIHtcclxuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHRcdHRoaXMuYmFzZVNlZWQgPSBvcHRpb25zLnNlZWQgfHwgMTtcclxuXHRcdHRoaXMuc2VlZCA9IHRoaXMuYmFzZVNlZWQ7XHJcblx0XHR0aGlzLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCAnIzc3Nyc7XHJcblx0XHR0aGlzLmJhY2tncm91bmQgPSBvcHRpb25zLmJhY2tncm91bmQgfHwgJyMyMjInO1xyXG5cdFx0dGhpcy50eXBlID0gb3B0aW9ucy50eXBlIHx8IERJR0dFUl9UWVBFO1xyXG5cdFx0dGhpcy5yb3RNYXAgPSBvcHRpb25zLnJvdE1hcDtcclxuXHRcdHRoaXMuY2VsbHMgPSB7fTtcclxuXHRcdHRoaXMuZnJlZUNlbGxzID0gW107XHJcblx0XHR0aGlzLndhbGxzID0gQm9vbGVhbihvcHRpb25zLndhbGxzKSB8fCBCb29sZWFuKG9wdGlvbnMud2FsbHNDaGFyYWN0ZXIpO1xyXG5cdFx0dGhpcy53YWxsc0NoYXJhY3RlciA9IG9wdGlvbnMud2FsbHNDaGFyYWN0ZXIgfHwgJyMnOyAvLyDilqdcclxuXHRcdHRoaXMuZmxvb3JDaGFyYWN0ZXIgPSBvcHRpb25zLmZsb29yQ2hhcmFjdGVyIHx8ICcuJztcclxuXHRcdHRoaXMuZ2VuZXJhdGUob3B0aW9ucyk7XHJcblx0fVxyXG5cclxuXHRnZW5lcmF0ZShvcHRpb25zID0ge30pIHtcclxuXHRcdGNvbnN0IGdlbmVyYXRvcnMgPSBvcHRpb25zLmdlbmVyYXRvcnMgfHwge307XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBnZW5lcmF0b3JzW3RoaXMudHlwZV0gPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dGhpcy5jbGVhckNlbGxzKCk7XHJcblx0XHRcdGdlbmVyYXRvcnNbdGhpcy50eXBlXSh0aGlzLnNlZWQsIHRoaXMsIG9wdGlvbnMpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMudHlwZSA9PT0gRElHR0VSX1RZUEUpIHtcclxuXHRcdFx0dGhpcy5nZW5lcmF0ZURpZ2dlcigpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy50eXBlID09PSBBUkVOQV9UWVBFKSB7XHJcblx0XHRcdHRoaXMuZ2VuZXJhdGVBcmVuYShvcHRpb25zLngsIG9wdGlvbnMueSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdC8vIFRPRE86IGhhbmRsZSBvdGhlciByb3QtanMgdHlwZXNcclxuXHJcblx0XHRjb25zb2xlLndhcm4oJ1VuZGVmaW5lZCBtYXAgdHlwZTonLCB0aGlzLnR5cGUsIGdlbmVyYXRvcnMpO1xyXG5cdFx0dGhpcy5nZW5lcmF0ZUFyZW5hKDMsIDMpO1xyXG5cdFx0Ly8gVE9ETzogSGF2ZSBkZWZhdWx0IGJlIGEgYmlnIGVtcHR5IHJvb20gaW5zdGVhZD9cclxuXHR9XHJcblxyXG5cdGdlbmVyYXRlQXJlbmEoeCwgeSkge1xyXG5cdFx0Uk9ULlJORy5zZXRTZWVkKHRoaXMuc2VlZCk7XHJcblx0XHR0aGlzLnJvdE1hcCA9IG5ldyBST1QuTWFwLkFyZW5hKHgsIHkpO1xyXG5cdFx0dGhpcy5zZXR1cFJvdE1hcCgpO1x0XHJcblx0fVxyXG5cclxuXHRnZW5lcmF0ZURpZ2dlcigpIHtcclxuXHRcdFJPVC5STkcuc2V0U2VlZCh0aGlzLnNlZWQpO1xyXG5cdFx0dGhpcy5yb3RNYXAgPSBuZXcgUk9ULk1hcC5EaWdnZXIoKTtcclxuXHRcdHRoaXMuc2V0dXBSb3RNYXAoKTtcdFx0XHJcblx0fVxyXG5cclxuXHRzZXR1cFJvdE1hcCgpIHtcclxuXHRcdHRoaXMuY2xlYXJDZWxscygpO1xyXG5cdFx0dGhpcy5yb3RNYXAuY3JlYXRlKCh4LCB5LCB2YWx1ZSkgPT4ge1xyXG5cdFx0XHRpZiAodmFsdWUpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5zZXRGbG9vckF0KHgsIHkpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKHRoaXMud2FsbHMpIHtcclxuXHRcdFx0dGhpcy5hZGRXYWxscygpO1xyXG5cdFx0fVx0XHRcclxuXHR9XHJcblxyXG5cdGFkZFdhbGxzKCkge1xyXG5cdFx0dGhpcy5mb3JFYWNoQ2VsbCgoY2VsbCwgeCwgeSkgPT4ge1xyXG5cdFx0XHRNYXAuZm9yRWFjaERpcmVjdGlvbigoZGlyLCBkaXJYLCBkaXJZKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgbmV3WCA9IHggKyBkaXJYO1xyXG5cdFx0XHRcdGNvbnN0IG5ld1kgPSB5ICsgZGlyWTtcclxuXHRcdFx0XHRjb25zdCB3YWxsQ2VsbCA9IHRoaXMuZ2V0Q2VsbEF0KG5ld1gsIG5ld1kpO1xyXG5cdFx0XHRcdGlmICghd2FsbENlbGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0V2FsbEF0KG5ld1gsIG5ld1kpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGRpc2NvdmVyQ2lyY2xlKHgsIHksIHJhZGl1cykge1xyXG5cdFx0dGhpcy5mb3JFYWNoQ2VsbEluQ2lyY2xlKHgsIHksIHJhZGl1cywgKGNlbGwpID0+IHtcclxuXHRcdFx0Y2VsbC5kaXNjb3ZlcigpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgcGFyc2VLZXlDb29yZGluYXRlcyhrZXkpIHtcclxuXHRcdGNvbnN0IHBhcnRzID0ga2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdGNvbnN0IHggPSBwYXJzZUludChwYXJ0c1swXSk7XHJcblx0XHRjb25zdCB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0cmV0dXJuIHsgeCwgeSB9O1xyXG5cdH1cclxuXHJcblx0c3RhdGljIG1ha2VLZXkoeCwgeSkge1xyXG5cdFx0cmV0dXJuIHggKyAnLCcgKyB5O1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGZvckVhY2hEaXJlY3Rpb24oY2FsbGJhY2spIHtcclxuXHRcdGNvbnN0IGRpckNvb3JkcyA9IFtcclxuXHRcdFx0e3g6IDAsIHk6IC0xfSwgLy8gdG9wXHJcblx0XHRcdHt4OiAxLCB5OiAtMX0sXHJcblx0XHRcdHt4OiAxLCB5OiAwfSwgLy8gcmlnaHRcclxuXHRcdFx0e3g6IDEsIHk6IDF9LFxyXG5cdFx0XHR7eDogMCwgeTogMX0sIC8vIGJvdHRvbVxyXG5cdFx0XHR7eDogLTEsIHk6IDF9LFxyXG5cdFx0XHR7eDogLTEsIHk6IDB9LCAvLyBsZWZ0XHJcblx0XHRcdHt4OiAtMSwgeTogLTF9LFxyXG5cdFx0XTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XHJcblx0XHRcdGNhbGxiYWNrKGksIGRpckNvb3Jkc1tpXS54LCBkaXJDb29yZHNbaV0ueSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjbGVhckNlbGxzKCkge1xyXG5cdFx0dGhpcy5jZWxscyA9IHt9O1xyXG5cdFx0dGhpcy5mcmVlQ2VsbHMubGVuZ3RoID0gMDtcdFx0XHJcblx0fVxyXG5cclxuXHRmb3JFYWNoQ2VsbChjYWxsYmFjaykge1xyXG5cdFx0Zm9yIChsZXQga2V5IGluIHRoaXMuY2VsbHMpIHtcclxuXHRcdFx0Y29uc3QgeyB4LCB5IH0gPSBNYXAucGFyc2VLZXlDb29yZGluYXRlcyhrZXkpO1xyXG5cdFx0XHRjYWxsYmFjayh0aGlzLmNlbGxzW2tleV0sIHgsIHksIGtleSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmb3JFYWNoQ2VsbEluQ2lyY2xlKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgY2FsbGJhY2ssIGluY2x1ZGVFbXB0eUNlbGxzID0gZmFsc2UpIHtcclxuXHRcdGNvbnN0IG1heFggPSBjZW50ZXJYICsgcmFkaXVzO1xyXG5cdFx0Y29uc3QgbWF4WSA9IGNlbnRlclkgKyByYWRpdXM7XHJcblx0XHRsZXQgeDtcclxuXHRcdGZvciAoeCA9IGNlbnRlclggLSByYWRpdXM7IHggPD0gbWF4WDsgeCsrKSB7XHJcblx0XHRcdGxldCB5O1xyXG5cdFx0XHRmb3IgKHkgPSBjZW50ZXJZIC0gcmFkaXVzOyB5IDw9IG1heFk7IHkrKykge1xyXG5cdFx0XHRcdGNvbnN0IHIgPSBNYXRoLnJvdW5kKGdlb21ldGVyLmdldERpc3RhbmNlKGNlbnRlclgsIGNlbnRlclksIHgsIHkpKTtcclxuXHRcdFx0XHRpZiAociA8IHJhZGl1cykge1xyXG5cdFx0XHRcdFx0Y29uc3QgY2VsbCA9IHRoaXMuZ2V0Q2VsbEF0KHgsIHkpO1xyXG5cdFx0XHRcdFx0aWYgKGNlbGwgfHwgaW5jbHVkZUVtcHR5Q2VsbHMpIHtcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soY2VsbCwgeCwgeSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldFJhbmRvbUZyZWVDZWxsKHNlZWQpIHtcdFx0XHJcblx0XHRjb25zdCBpID0gcmFuZG9tLnJvbGwodGhpcy5mcmVlQ2VsbHMubGVuZ3RoLCBzZWVkKTtcclxuXHRcdFxyXG5cdFx0Ly8gVE9ETzogVEJELSBJcyBpdCBzdGlsbCBhIGZyZWUgY2VsbD9cclxuXHRcdC8vIHZhciBrZXkgPSBmcmVlQ2VsbHMuc3BsaWNlKGluZGV4LCAxKVswXTtcclxuXHRcdC8vIHRoaXMubWFwW2tleV0gPSBcIipcIjtcclxuXHRcdGNvbnN0IGtleSA9IHRoaXMuZnJlZUNlbGxzW2ldO1xyXG5cdFx0Y29uc3QgY2VsbCA9IHRoaXMuY2VsbHNba2V5XTtcclxuXHRcdFxyXG5cdFx0Y29uc3QgeyB4LCB5IH0gPSBNYXAucGFyc2VLZXlDb29yZGluYXRlcyhrZXkpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coc2VlZCwga2V5LCBpLCB4LCB5KTtcclxuXHRcdHJldHVybiB7IHgsIHksIGNlbGwgfTtcclxuXHR9XHJcblxyXG5cdGdldENlbGxBdCh4LCB5KSB7XHJcblx0XHRjb25zdCBrZXkgPSBNYXAubWFrZUtleSh4LCB5KTtcclxuXHRcdHJldHVybiB0aGlzLmNlbGxzW2tleV07XHRcdFxyXG5cdH1cclxuXHJcblx0Z2V0Q2hhcmFjdGVyQXQoeCwgeSkge1xyXG5cdFx0Y29uc3QgY2VsbCA9IHRoaXMuZ2V0Q2VsbEF0KHgsIHkpO1xyXG5cdFx0cmV0dXJuIChjZWxsKSA/IGNlbGwuZ2V0Q2hhcmFjdGVyKCkgOiBudWxsO1xyXG5cdH1cclxuXHJcblx0c2V0Rmxvb3JBdCh4LCB5KSB7XHJcblx0XHRjb25zdCBrZXkgPSB0aGlzLnNldENoYXJhY3RlckF0KHRoaXMuZmxvb3JDaGFyYWN0ZXIsIHgsIHkpO1xyXG5cdFx0dGhpcy5mcmVlQ2VsbHMucHVzaChrZXkpO1xyXG5cdFx0cmV0dXJuIGtleTtcclxuXHR9XHJcblxyXG5cdHNldFdhbGxBdCh4LCB5KSB7XHJcblx0XHRyZXR1cm4gdGhpcy5zZXRDaGFyYWN0ZXJBdCh0aGlzLndhbGxzQ2hhcmFjdGVyLCB4LCB5KTtcclxuXHR9XHJcblxyXG5cdHNldENoYXJhY3RlckF0KGNoYXIsIHgsIHkpIHtcclxuXHRcdGNvbnN0IGtleSA9IE1hcC5tYWtlS2V5KHgsIHkpO1xyXG5cdFx0Y29uc3QgY2VsbCA9IHRoaXMuY2VsbHNba2V5XTtcclxuXHRcdGlmIChjZWxsKSB7XHJcblx0XHRcdGNlbGwuc2V0Q2hhcmFjdGVyKGNoYXIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc3QgeyBjb2xvciwgYmFja2dyb3VuZCB9ID0gdGhpcztcclxuXHRcdFx0dGhpcy5jZWxsc1trZXldID0gbmV3IENlbGwoeyBjb2xvciwgYmFja2dyb3VuZCwgY2hhcmFjdGVyOiBjaGFyIH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGtleTtcclxuXHR9XHJcblxyXG5cdGdldENlbGxQYXNzYWJpbGl0eSh4LCB5KSB7XHJcblx0XHRjb25zdCBjZWxsID0gdGhpcy5nZXRDZWxsQXQoeCwgeSk7XHJcblx0XHRyZXR1cm4gKGNlbGwpID8gY2VsbC5nZXRQYXNzYWJpbGl0eSgpIDogZmFsc2U7XHJcblx0fVxyXG5cclxuXHRnZXRMaWdodGluZ0F0KHgsIHkpIHtcclxuXHRcdHJldHVybiB7fTsgLy8gVE9ET1xyXG5cdH1cclxuXHJcblx0Ly8gX2dlbmVyYXRlQm94ZXMoZnJlZUNlbGxzKSB7XHJcblx0Ly8gXHRmb3IgKHZhciBpPTA7aTwxMDtpKyspIHtcclxuXHQvLyBcdFx0dmFyIGluZGV4ID0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIGZyZWVDZWxscy5sZW5ndGgpO1xyXG5cdC8vIFx0XHR2YXIga2V5ID0gZnJlZUNlbGxzLnNwbGljZShpbmRleCwgMSlbMF07XHJcblx0Ly8gXHRcdHRoaXMubWFwW2tleV0gPSBcIipcIjtcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwO1xyXG4iLCJjbGFzcyBJbnZlbnRvcnkge1xyXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xyXG5cdFx0dGhpcy5zaXplID0gKHR5cGVvZiBvcHRpb25zLnNpemUgPT09ICdudW1iZXInKSA/IG9wdGlvbnMuc2l6ZSA6IDEwO1xyXG5cdFx0dGhpcy5pdGVtcyA9IFtdO1xyXG5cdH1cclxuXHJcblx0aXNGdWxsKCkge1xyXG5cdFx0cmV0dXJuICh0aGlzLml0ZW1zLmxlbmd0aCA+PSB0aGlzLnNpemUpO1xyXG5cdH1cclxuXHJcblx0aGFzU3BhY2UoKSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuaXNGdWxsKCk7XHJcblx0fVxyXG5cclxuXHRhZGQoaXRlbSkge1xyXG5cdFx0aWYgKHRoaXMuaXNGdWxsKCkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCFpdGVtLnBvcnRhYmxlKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKGl0ZW0pIHtcclxuXHRcdGNvbnN0IGkgPSB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSk7XHJcblx0XHRpZiAoaSA8PSAtMSkge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oJ25vdGhpbmcgZm91bmQgaW4nLCB0aGlzLml0ZW1zLCBpdGVtKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgYXJyID0gdGhpcy5pdGVtcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRyZXR1cm4gYXJyWzBdO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlVHlwZSh0eXBlS2V5KSB7XHJcblx0XHRjb25zdCBpdGVtc09mVHlwZSA9IHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7IHJldHVybiBpdGVtLnR5cGUgPT09IHR5cGVLZXk7IH0pO1xyXG5cdFx0aWYgKGl0ZW1zT2ZUeXBlLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcy5yZW1vdmUoaXRlbXNPZlR5cGVbMF0pO1xyXG5cdH1cclxuXHJcblx0Z2V0KG4pIHtcclxuXHRcdGlmICh0eXBlb2YgbiA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuaXRlbXNbbl07XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBuID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5pdGVtcy5maW5kKChpdGVtKSA9PiB7IHJldHVybiBpdGVtLm5hbWUgPT09IG47IH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXMuaXRlbXM7XHJcblx0fVxyXG5cclxuXHRnZXRTdHJpbmcoKSB7XHJcblx0XHRjb25zdCBhcnIgPSB0aGlzLml0ZW1zLm1hcCgoaXRlbSwgaSkgPT4geyByZXR1cm4gYFskeyhpICsgMSl9XSAke2l0ZW0ubmFtZX1gOyB9KTtcclxuXHRcdHJldHVybiAoYXJyLmxlbmd0aCkgPyBhcnIuam9pbignLCAnKSA6ICdub3RoaW5nJztcclxuXHR9XHJcblxyXG5cdGxvb3BPdmVyQ29udGVudHMoZm4pIHtcclxuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG5cdFx0XHRmbihpdGVtLCBpKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aGFzQ29udGVudHMoKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuaXRlbXMubGVuZ3RoID4gMCk7XHJcblx0fVxyXG5cclxuXHRjb250YWlucyhpdGVtTmFtZSkge1xyXG5cdFx0bGV0IGZvdW5kSXRlbSA9IHRoaXMuaXRlbXMuZmluZCgoaXRlbSkgPT4geyByZXR1cm4gKGl0ZW0ubmFtZSA9PT0gaXRlbU5hbWUpOyB9KTtcclxuXHRcdHJldHVybiBCb29sZWFuKGZvdW5kSXRlbSk7XHJcblx0fVxyXG5cclxuXHRjb250YWluc1R5cGUodHlwZU5hbWUpIHtcclxuXHRcdGxldCBmb3VuZEl0ZW0gPSB0aGlzLml0ZW1zLmZpbmQoKGl0ZW0pID0+IHsgcmV0dXJuIChpdGVtLnR5cGUgPT09IHR5cGVOYW1lKTsgfSk7XHJcblx0XHRyZXR1cm4gQm9vbGVhbihmb3VuZEl0ZW0pO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnk7XHJcbiIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRESVJTXzQ6IE9iamVjdC5mcmVlemUoW1xyXG5cdFx0eyB4OiAwLCB5OiAtMSB9LFxyXG5cdFx0eyB4OiAxLCB5OiAwIH0sXHJcblx0XHR7IHg6IDAsIHk6IDEgfSxcclxuXHRcdHsgeDogLTEsIHk6IDAgfSxcclxuXHRdKSxcclxuXHRESVJTXzg6IE9iamVjdC5mcmVlemUoW1xyXG5cdFx0eyB4OiAwLCB5OiAtMSB9LFxyXG5cdFx0eyB4OiAxLCB5OiAtMSB9LFxyXG5cdFx0eyB4OiAxLCB5OiAwIH0sXHJcblx0XHR7IHg6IDEsIHk6IDEgfSxcclxuXHRcdHsgeDogMCwgeTogMSB9LFxyXG5cdFx0eyB4OiAtMSwgeTogMSB9LFxyXG5cdFx0eyB4OiAtMSwgeTogMCB9LFxyXG5cdFx0eyB4OiAtMSwgeTogLTEgfSxcdFxyXG5cdF0pLFxyXG5cdERJUlNfOF9ESUFHTk9MUzogT2JqZWN0LmZyZWV6ZShbXHJcblx0XHR7IHg6IDEsIHk6IC0xIH0sXHJcblx0XHR7IHg6IDEsIHk6IDEgfSxcclxuXHRcdHsgeDogLTEsIHk6IDEgfSxcclxuXHRcdHsgeDogLTEsIHk6IC0xIH0sXHRcclxuXHRdKSxcclxufTtcclxuIiwiY29uc3QgSXRlbSA9IHJlcXVpcmUoJy4vSXRlbScpO1xyXG5cclxuY2xhc3MgUHJvcCBleHRlbmRzIEl0ZW0ge1xyXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xyXG5cdFx0b3B0aW9ucyA9IHsgcG9ydGFibGU6IGZhbHNlLCAuLi5vcHRpb25zIH07XHJcblx0XHRzdXBlcihvcHRpb25zKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJvcDtcclxuIiwiY29uc3QgUk9UID0gcmVxdWlyZSgncm90LWpzJyk7XHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL0dhbWUnKTtcclxuY29uc3QgSXRlbSA9IHJlcXVpcmUoJy4vSXRlbScpO1xyXG5jb25zdCBNYXAgPSByZXF1aXJlKCcuL01hcCcpO1xyXG5jb25zdCBBY3RvciA9IHJlcXVpcmUoJy4vQWN0b3InKTtcclxuY29uc3QgUHJvcCA9IHJlcXVpcmUoJy4vUHJvcCcpO1xyXG5jb25zdCBMZXZlbCA9IHJlcXVpcmUoJy4vTGV2ZWwnKTtcclxuY29uc3QgRGlzcGxheSA9IHJlcXVpcmUoJy4vRGlzcGxheScpO1xyXG5jb25zdCByYW5kb20gPSByZXF1aXJlKCcuL3JhbmRvbScpO1xyXG5jb25zdCByZWFkeSA9IHJlcXVpcmUoJy4vcmVhZHknKTtcclxuXHJcbmNvbnN0IHJvdGUgPSB7XHJcbiAgICBST1QsXHJcbiAgICBHYW1lLCBMZXZlbCwgTWFwLCBJdGVtLCBQcm9wLCBBY3RvciwgRGlzcGxheSxcclxuICAgIHJhbmRvbSxcclxuICAgIHJlYWR5XHJcbn07XHJcblxyXG5pZiAod2luZG93KSB7XHJcbiAgICB3aW5kb3cucm90ZSA9IHJvdGU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcm90ZTtcclxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImNvbnN0IFJPVCA9IHJlcXVpcmUoJ3JvdC1qcycpO1xyXG5jb25zdCByZWFkeSA9IHJlcXVpcmUoJy4vcmVhZHknKTtcclxuY29uc3QgRGlzcGxheSA9IHJlcXVpcmUoJy4vRGlzcGxheScpO1xyXG5jb25zdCBMZXZlbCA9IHJlcXVpcmUoJy4vTGV2ZWwnKTtcclxuY29uc3QgQWN0b3IgPSByZXF1aXJlKCcuL0FjdG9yJyk7XHJcbmNvbnN0IEl0ZW0gPSByZXF1aXJlKCcuL0l0ZW0nKTtcclxuY29uc3QgS2V5Ym9hcmQgPSByZXF1aXJlKCcuL0tleWJvYXJkTGlzdGVuZXInKTtcclxuY29uc3QgTXVzaWNCb3ggPSByZXF1aXJlKCcuL011c2ljQm94Jyk7XHJcbmNvbnN0IENvbnNvbGUgPSByZXF1aXJlKCcuL0NvbnNvbGUnKTtcclxuXHJcbmNvbnN0IElOSVRfU1RBVEUgPSAnSU5JVCc7XHJcbmNvbnN0IE1BSU5fR0FNRV9TVEFURSA9ICdHQU1FJztcclxuY29uc3QgU1BMQVNIX1NUQVRFID0gJ1NQTEFTSCc7XHJcbmNvbnN0IE9GRl9TVEFURSA9ICdPRkYnO1xyXG5cclxuY2xhc3MgR2FtZSB7XHJcblx0Y29uc3RydWN0b3Iob3B0aW9ucykge1xyXG5cdFx0Y29uc3QgeyBpZCwgY29uc29sZUlkLCBkYXRhLCBjdXN0b21FZmZlY3RzLFx0aGF2ZVNwbGFzaCxcdGZvbnRGYW1pbGllcyB9ID0gb3B0aW9ucztcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMuZGlzcGxheUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkIHx8ICdkaXNwbGF5Jyk7XHJcblx0XHR0aGlzLmNvbnNvbGUgPSBuZXcgQ29uc29sZSh7IGlkOiBjb25zb2xlSWQgfSk7XHJcblx0XHR0aGlzLmRpc3BsYXkgPSBudWxsO1xyXG5cdFx0dGhpcy5oYXZlU3BsYXNoID0gQm9vbGVhbihoYXZlU3BsYXNoKTtcclxuXHRcdHRoaXMuZm9udEZhbWlsaWVzID0gZm9udEZhbWlsaWVzIHx8IFtdO1xyXG5cdFx0dGhpcy5hY3RpdmVMZXZlbEluZGV4ID0gMDtcclxuXHRcdC8vIFRoZSBnZW5lcmF0ZWQgbGV2ZWxzXHJcblx0XHR0aGlzLmxldmVscyA9IFtdO1xyXG5cdFx0Ly8gQ3VzdG9tIGZ1bmNpdG9ucyBmb3IgZ2VuZXJhdGluZyB0aGluZ3NcclxuXHRcdHRoaXMuZ2VuZXJhdG9ycyA9IG9wdGlvbnMuZ2VuZXJhdG9ycyB8fCB7fTtcclxuXHRcdC8vIFJlZmVyZW5jZSBkYXRhIG9uIHByb3RvdHlwaWNhbCBcInRoaW5nc1wiIChtb25zdGVycywgaXRlbXMpXHJcblx0XHR0aGlzLmRhdGEgPSB7XHJcblx0XHRcdG1vbnN0ZXJzOiB7fSxcclxuXHRcdFx0aXRlbXM6IHt9LFxyXG5cdFx0XHRwcm9wczoge30sXHJcblx0XHRcdHBsYXlsaXN0OiBbXSxcclxuXHRcdH07XHJcblx0XHQvLyBUaGUgbWFpbiBhY3RvclxyXG5cdFx0dGhpcy5oZXJvID0gbnVsbDsgLy8gcGxheWVyIGNoYXJhY3RlciAvIHBsYXllciBhY3RvclxyXG5cdFx0Ly8gR3V0c1xyXG5cdFx0dGhpcy5zY2hlZHVsZXIgPSBuZXcgUk9ULlNjaGVkdWxlci5TaW1wbGUoKTtcclxuXHRcdHRoaXMuZW5naW5lID0gbnVsbDtcclxuXHRcdHRoaXMua2V5Ym9hcmQgPSBudWxsO1xyXG5cdFx0dGhpcy5zdGF0ZSA9IElOSVRfU1RBVEU7XHJcblx0XHR0aGlzLnN0YXRlcyA9IG5ldyBTZXQoW0lOSVRfU1RBVEUsIFNQTEFTSF9TVEFURSwgTUFJTl9HQU1FX1NUQVRFLCBPRkZfU1RBVEVdKTtcclxuXHRcdC8vIHRoaXMuc2V0dXBFbmdpbmUoKTtcclxuXHRcdHRoaXMubG9hZGluZ1Byb21pc2UgPSBudWxsO1xyXG5cdFx0dGhpcy5jb25zb2xlLnNldHVwKCk7XHJcblx0XHR0aGlzLmxvYWREYXRhKGRhdGEpO1xyXG5cdFx0dGhpcy5ob29rcyA9IHt9O1xyXG5cdFx0dGhpcy5jdXN0b21FZmZlY3RzID0geyAuLi5jdXN0b21FZmZlY3RzIH07XHJcblx0fVxyXG5cclxuXHRzZXR1cEVuZ2luZSgpIHtcclxuXHRcdHRoaXMuZW5naW5lID0gbmV3IFJPVC5FbmdpbmUodGhpcy5zY2hlZHVsZXIpO1xyXG5cdFx0dGhpcy5lbmdpbmUuc3RhcnQoKTtcclxuXHRcdHJldHVybiB0aGlzLmVuZ2luZTtcclxuXHR9XHJcblxyXG5cdHNldHVwS2V5Ym9hcmQoKSB7XHJcblx0XHR0aGlzLmtleWJvYXJkID0gbmV3IEtleWJvYXJkKHsgc3RhdGU6IE1BSU5fR0FNRV9TVEFURSwgYXV0b1N0YXJ0OiB0cnVlIH0pO1xyXG5cdFx0Ly8gU3BsYXNoIHN0YXRlXHJcblx0XHR0aGlzLmtleWJvYXJkLm9uKFNQTEFTSF9TVEFURSwgJ0VOVEVSJywgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKE1BSU5fR0FNRV9TVEFURSk7XHJcblx0XHR9KTtcclxuXHRcdC8vIE1haW4gc3RhdGVcclxuXHRcdHRoaXMua2V5Ym9hcmQub24oTUFJTl9HQU1FX1NUQVRFLCAnRElSRUNUSU9OJywgKGtleU5hbWUsIGtleUNvZGUsIGRpcmVjdGlvbikgPT4ge1xyXG5cdFx0XHQvLyBUT0RPOiBMb2NrIGFuZCB1bmxvY2sgdGhlIGdhbWU/IG9yIGRvIHNvbWV0aGluZyBlbHNlIHRvIGRldGVybWluZSBpZiBpdCdzIE9LIHRvIG1vdmVcclxuXHRcdFx0dGhpcy5oZXJvLnF1ZXVlQWN0aW9uKCdtb3ZlJywgeyBkaXJlY3Rpb24gfSk7XHJcblx0XHRcdHRoaXMuYWR2YW5jZSgpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmtleWJvYXJkLm9uKE1BSU5fR0FNRV9TVEFURSwgJ0VOVEVSJywgKCkgPT4ge1xyXG5cdFx0XHQvLyB0aGlzLmFjdG9yRGVmYXVsdEFjdGlvbih0aGlzLmhlcm8pOyAvLyBUT0RPOiBSZW1vdmUgbWVcclxuXHRcdFx0dGhpcy5hY3RvckFkZERlZmF1bHRBY3Rpb24odGhpcy5oZXJvKTtcclxuXHRcdFx0dGhpcy5hZHZhbmNlKCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMua2V5Ym9hcmQub24oTUFJTl9HQU1FX1NUQVRFLCAnU1BBQ0UnLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuaGVyby5xdWV1ZUFjdGlvbignd2FpdCcpO1xyXG5cdFx0XHR0aGlzLmFkdmFuY2UoKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5rZXlib2FyZC5vbihNQUlOX0dBTUVfU1RBVEUsICd0JywgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLnNob3dJbnZlbnRvcnkoKTtcclxuXHRcdFx0dGhpcy5wcmludCgnPiBUaHJvdyB3aGljaCBpdGVtPycpO1xyXG5cdFx0XHRsZXQgbiA9IHByb21wdCgnVGhyb3cgd2hpY2ggaXRlbT8gXFxuXFxuJyArIHRoaXMuaGVyby5pbnZlbnRvcnkuZ2V0U3RyaW5nKCkpO1xyXG5cdFx0XHRpZiAoIW4gfHwgbi5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHR0aGlzLnByaW50KCdOb25lJyk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdG4gPSBwYXJzZUludChuLCAxMCk7XHJcblx0XHRcdGNvbnN0IGkgPSAoaXNOYU4obikpID8gLTEgOiBuIC0gMTtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuaGVyby5pbnZlbnRvcnkuZ2V0KGkpO1xyXG5cdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdHRoaXMuaGVyby5xdWV1ZUFjdGlvbigndGhyb3cnLCB7IHdoYXQ6IGl0ZW0sIHg6IHRoaXMuaGVyby54LCB5OiB0aGlzLmhlcm8ueSB9KTtcclxuXHRcdFx0XHR0aGlzLmFkdmFuY2UoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnByaW50KGBJbnZhbGlkIGl0ZW0gWyR7bn1dYCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5rZXlib2FyZC5vbihNQUlOX0dBTUVfU1RBVEUsICdpJywgKCkgPT4geyB0aGlzLnNob3dJbnZlbnRvcnkoKTsgfSk7XHJcblx0XHR0aGlzLmtleWJvYXJkLm9uKE1BSU5fR0FNRV9TVEFURSwgJ3AnLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuaGVyby5xdWV1ZUFjdGlvbigncGlja3VwJyk7XHJcblx0XHRcdHRoaXMuYWR2YW5jZSgpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmtleWJvYXJkLm9uKE1BSU5fR0FNRV9TVEFURSwgJ28nLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuaGVyby5xdWV1ZUFjdGlvbignbG9vaycpO1xyXG5cdFx0XHR0aGlzLmFkdmFuY2UoKTtcclxuXHRcdH0pO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuXHRcdFx0Y29uc3Qga2V5ID0gU3RyaW5nKGkgKyAxKTtcclxuXHRcdFx0dGhpcy5rZXlib2FyZC5vbihNQUlOX0dBTUVfU1RBVEUsIGtleSwgKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuaGVyby5yZWFkeUFiaWxpdHlCeUluZGV4KGkpO1xyXG5cdFx0XHRcdHRoaXMuZHJhdygpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdC8vIHRoaXMua2V5Ym9hcmQuc3RhcnQoKTtcclxuXHR9XHJcblxyXG5cdHNldHVwTXVzaWMoKSB7XHJcblx0XHR0aGlzLm11c2ljID0gbmV3IE11c2ljQm94KHRoaXMuZGF0YS5wbGF5bGlzdCk7XHJcblx0fVxyXG5cclxuXHRyZW1vdmVLZXlib2FyZCgpIHtcclxuXHRcdC8vIFRPRE86IHRoaXMua2V5Ym9hcmQub2ZmKCkgb24gYWxsIGxpc3RlbmVyc1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlRGlzcGxheShvcHRpb25zID0ge30pIHtcclxuXHRcdHRoaXMuZGlzcGxheSA9IG5ldyBEaXNwbGF5KG9wdGlvbnMpO1xyXG5cdFx0dGhpcy5kaXNwbGF5LnNldHVwRWxlbWVudHMoKTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBEcmF3IC8gUmVuZGVyXHJcblxyXG5cdHByaW50KHN0ciwgY2xhc3NlcyA9ICcnLCB3YWl0ID0gMCkge1xyXG5cdFx0aWYgKHdhaXQpIHtcclxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7IHRoaXMucHJpbnQoc3RyLCBjbGFzc2VzKTsgfSwgd2FpdCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHRoaXMuY29uc29sZS5wcmludChzdHIsIGNsYXNzZXMpO1xyXG5cdH1cclxuXHJcblx0c2hvd0ludmVudG9yeSgpIHtcclxuXHRcdGNvbnN0IGl0ZW1zID0gdGhpcy5oZXJvLmludmVudG9yeS5nZXRTdHJpbmcoKTtcclxuXHRcdHRoaXMucHJpbnQoJ0ludmVudG9yeTogJyArIGl0ZW1zKTtcclxuXHR9XHJcblxyXG5cdGRyYXcoKSB7XHJcblx0XHR0aGlzLmRpc3BsYXkuZHJhd0xldmVsKHRoaXMsIHRoaXMuZ2V0QWN0aXZlTGV2ZWwoKSwgdGhpcy5oZXJvKTtcclxuXHR9XHJcblxyXG5cclxuXHQvLy0tLS0gR2VuZXJhdGlvblxyXG5cclxuXHRjcmVhdGVMZXZlbChvcHRpb25zID0ge30sIHNlZWQpIHtcclxuXHRcdG9wdGlvbnMuc2VlZCA9IHNlZWQgfHwgb3B0aW9ucy5zZWVkO1xyXG5cdFx0Y29uc3QgbGV2ZWxPcHRpb25zID0ge1xyXG5cdFx0XHRjdXN0b21FZmZlY3RzOiB0aGlzLmN1c3RvbUVmZmVjdHMsXHJcblx0XHRcdC4uLm9wdGlvbnMsXHJcblx0XHRcdGxldmVsSW5kZXg6IHRoaXMubGV2ZWxzLmxlbmd0aCxcclxuXHRcdFx0Z2VuZXJhdG9yczogdGhpcy5nZW5lcmF0b3JzLFxyXG5cdFx0fTtcclxuXHRcdC8vIGNvbnNvbGUud2Fybih0aGlzLmN1c3RvbUVmZmVjdHMsIGxldmVsT3B0aW9ucyk7XHJcblx0XHRjb25zdCBsZXZlbCA9IG5ldyBMZXZlbChsZXZlbE9wdGlvbnMsIHRoaXMuZGF0YSk7XHJcblx0XHR0aGlzLmxldmVscy5wdXNoKGxldmVsKTtcclxuXHRcdHJldHVybiBsZXZlbDtcclxuXHR9XHJcblxyXG5cdGNyZWF0ZUxldmVscyhhcnIgPSBbXSwgYmFzZVNlZWQgPSAxKSB7XHJcblx0XHRsZXQgc2VlZCA9IGJhc2VTZWVkO1xyXG5cdFx0YXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuXHRcdFx0c2VlZCArPSBpO1xyXG5cdFx0XHRpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7IC8vIGxldmVsIHR5cGUga2V5XHJcblx0XHRcdFx0dGhpcy5jcmVhdGVMZXZlbCh0aGlzLmdldExldmVsVHlwZShpdGVtKSwgc2VlZCk7XHJcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIGl0ZW0gIT09IG51bGwpIHtcclxuXHRcdFx0XHRjb25zdCBuID0gKHR5cGVvZiBpdGVtLnJlcGVhdCA9PT0gJ251bWJlcicpID8gaXRlbS5yZXBlYXQgOiAxO1xyXG5cdFx0XHRcdGZvciAobGV0IHIgPSAwOyByIDwgbjsgcisrKSB7XHJcblx0XHRcdFx0XHRzZWVkICs9IHI7XHJcblx0XHRcdFx0XHR0aGlzLmNyZWF0ZUxldmVsKHRoaXMuZ2V0TGV2ZWxUeXBlKGl0ZW0ubGV2ZWxUeXBlS2V5KSwgc2VlZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuY29ubmVjdFN0YWlycygpO1xyXG5cdFx0cmV0dXJuIHRoaXMubGV2ZWxzO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlQWN0b3Iob3B0aW9ucyA9IHt9LCBsZXZlbCkge1xyXG5cdFx0Y29uc3QgYWN0b3IgPSBuZXcgQWN0b3Iob3B0aW9ucyk7XHJcblx0XHR0aGlzLnNjaGVkdWxlci5hZGQoYWN0b3IsIHRydWUpO1xyXG5cdFx0bGV2ZWwgPSAobGV2ZWwgPT09IHRydWUpID8gdGhpcy5nZXRBY3RpdmVMZXZlbCgpIDogbGV2ZWw7XHJcblx0XHRpZiAobGV2ZWwpIHtcclxuXHRcdFx0bGV2ZWwuYWRkQWN0b3IoYWN0b3IpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGFjdG9yO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlSXRlbShvcHRpb25zID0ge30sIGxldmVsKSB7XHJcblx0XHRjb25zdCBpdGVtID0gbmV3IEl0ZW0ob3B0aW9ucyk7XHJcblx0XHRsZXZlbCA9IChsZXZlbCA9PT0gdHJ1ZSkgPyB0aGlzLmdldEFjdGl2ZUxldmVsKCkgOiBsZXZlbDtcclxuXHRcdGlmIChsZXZlbCkge1xyXG5cdFx0XHRsZXZlbC5hZGRJdGVtKGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGl0ZW07XHJcblx0fVxyXG5cclxuXHRjcmVhdGVIZXJvKG9wdGlvbnMgPSB7fSkge1xyXG5cdFx0Y29uc3QgaGVyb09wdGlvbnMgPSB7IC4uLm9wdGlvbnMsIGNoYXJhY3RlcjogJ0AnLCBpc0hlcm86IHRydWUgfTtcclxuXHRcdHRoaXMuaGVybyA9IHRoaXMuY3JlYXRlQWN0b3IoaGVyb09wdGlvbnMsIHRydWUpO1xyXG5cclxuXHRcdGNvbnN0IGcgPSB0aGlzO1xyXG5cdFx0Ly8gU2V0dXAgYWN0aW9uIHN0dWZmIC4uLiB0aGlzIG5lZWRzIHRvIGJlIHJlZmFjdG9yZWRcclxuXHRcdHRoaXMuaGVyby5hY3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGcuZW5naW5lLmxvY2soKTtcclxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzKTsgLy8gcGFzcyB0aGUgaGVybzsgdGhlIGBoYW5kbGVFdmVudGAgd2lsbCBiZSB1c2VkXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5oZXJvLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24gKGUpIHsgLy8gTGVmdG92ZXIgZnJvbSB0dXRvcmlhbCwgcGFydCAyXHJcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcyk7XHJcblx0XHRcdGcuZW5naW5lLnVubG9jaygpO1xyXG5cdFx0fTtcclxuXHRcdGlmICh0aGlzLmRpc3BsYXkpIHtcclxuXHRcdFx0dGhpcy5kaXNwbGF5LnNldENhbWVyYVRhcmdldCh0aGlzLmhlcm8pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5kaXNjb3ZlckFyb3VuZEhlcm8oKTtcclxuXHRcdHJldHVybiB0aGlzLmhlcm87XHJcblx0fVxyXG5cclxuXHRjb25uZWN0U3RhaXJzKCkge1xyXG5cdFx0Y29uc3QgU1RBSVJfTElOSyA9ICdzdGFpckxpbmsnO1xyXG5cdFx0Y29uc3QgcHJvcFR5cGVzID0gdGhpcy5nZXREYXRhUHJvcEFycmF5KCk7XHJcblx0XHRjb25zdCBzdGFpcnNEb3duVHlwZXMgPSBwcm9wVHlwZXMuZmlsdGVyKChwcm9wVHlwZSkgPT4geyByZXR1cm4gQm9vbGVhbihwcm9wVHlwZVtTVEFJUl9MSU5LXSk7IH0pO1xyXG5cdFx0dGhpcy5sZXZlbHMuZm9yRWFjaCgobGV2ZWwsIGkpID0+IHtcclxuXHRcdFx0Ly8gSGFuZGxlIGVhY2ggdHlwZSBvZiBzdGFpcnNcclxuXHRcdFx0c3RhaXJzRG93blR5cGVzLmZvckVhY2goKHN0YWlyc0Rvd25UeXBlKSA9PiB7XHJcblx0XHRcdFx0Y29uc3Qgc3RhaXJEb3duVHlwZUtleSA9IHN0YWlyc0Rvd25UeXBlLmtleTtcclxuXHRcdFx0XHRjb25zdCBzdGFpclVwVHlwZUtleSA9IHN0YWlyc0Rvd25UeXBlW1NUQUlSX0xJTktdO1xyXG5cdFx0XHRcdGNvbnN0IGxldmVsU3RhaXJzRG93biA9IGxldmVsLnByb3BzLmZpbHRlcigocHJvcCkgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHByb3AudHlwZSA9PT0gc3RhaXJEb3duVHlwZUtleTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRsZXZlbFN0YWlyc0Rvd24uZm9yRWFjaCgoc3RhaXIpID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IGxldmVsQmVsb3cgPSB0aGlzLmxldmVsc1tpICsgMV07XHJcblx0XHRcdFx0XHRpZiAoIWxldmVsQmVsb3cpIHsgcmV0dXJuOyB9XHJcblx0XHRcdFx0XHRjb25zdCBwb3NzaWJsZVN0YWlyc1VwID0gbGV2ZWxCZWxvdy5wcm9wcy5maWx0ZXIoKHByb3ApID0+IHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHByb3AudHlwZSA9PT0gc3RhaXJVcFR5cGVLZXkgJiYgIUJvb2xlYW4ocHJvcC50ZWxlcG9ydCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdC8vIFRPRE86IEZpbmQgc3RhaXJzIHRvIGNvbm5lY3QgdG8gYmFzZWQgb24gcHJveGltaXR5XHJcblx0XHRcdFx0XHRjb25zdCBsZXZlbEJlbG93U3RhaXJzVXAgPSBwb3NzaWJsZVN0YWlyc1VwWzBdOyAvLyBUT0RPOiByZW1vdmUgdGhpc1xyXG5cdFx0XHRcdFx0dGhpcy5jb25uZWN0VGVsZXBvcnRQcm9wcyhsZXZlbEJlbG93U3RhaXJzVXAsIHN0YWlyLCBpLCBpICsgMSwgJ2FzY2VuZCcsICdkZXNjZW5kJyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjb25uZWN0VGVsZXBvcnRQcm9wcyhwcm9wMSwgcHJvcDIsIGxldmVsSW5kZXgxLCBsZXZlbEluZGV4MiwgdmVyYjEsIHZlcmIyKSB7XHJcblx0XHRpZiAoIXByb3AxIHx8ICFwcm9wMikgeyByZXR1cm47IH1cclxuXHRcdHByb3AxLnNldFRlbGVwb3J0KHtcclxuXHRcdFx0bGV2ZWxJbmRleDogbGV2ZWxJbmRleDEsIHg6IHByb3AyLngsIHk6IHByb3AyLnksIHZlcmI6IHZlcmIxXHJcblx0XHR9KTtcclxuXHRcdHByb3AyLnNldFRlbGVwb3J0KHtcclxuXHRcdFx0bGV2ZWxJbmRleDogbGV2ZWxJbmRleDIsIHg6IHByb3AxLngsIHk6IHByb3AxLnksIHZlcmI6IHZlcmIyXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBNb3ZlbWVudCwgQ29tYmF0XHJcblxyXG5cdG1vdmVBY3RvcihhY3RvciwgZGlyZWN0aW9uLCBidW1wQ29tYmF0ID0gZmFsc2UpIHtcclxuXHRcdGNvbnN0IGRpZmYgPSBST1QuRElSU1s4XVtkaXJlY3Rpb25dO1xyXG5cdFx0dmFyIG5ld1ggPSBhY3Rvci54ICsgZGlmZlswXTtcclxuXHRcdHZhciBuZXdZID0gYWN0b3IueSArIGRpZmZbMV07XHJcblx0XHRyZXR1cm4gdGhpcy5tb3ZlQWN0b3JUbyhhY3RvciwgbmV3WCwgbmV3WSwgYnVtcENvbWJhdCk7XHJcblx0fVxyXG5cclxuXHRtb3ZlQWN0b3JUbyhhY3RvciwgeCwgeSwgYnVtcENvbWJhdCA9IGZhbHNlKSB7XHJcblx0XHRjb25zdCBsZXZlbCA9IHRoaXMuZ2V0QWN0aXZlTGV2ZWwoKTtcclxuXHRcdGNvbnN0IGNhbk1vdmVUb0NlbGwgPSBsZXZlbC5nZXRDZWxsUGFzc2FiaWxpdHkoeCwgeSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnY29uc2lkZXJpbmcgbW92aW5nIHRvJywgeCwgeSwgJy4uLiBmcmVlPycsIGNhbk1vdmVUb0NlbGwpO1xyXG5cdFx0aWYgKCFjYW5Nb3ZlVG9DZWxsKSB7XHJcblx0XHRcdGNvbnN0IGJsb2NrZXIgPSBsZXZlbC5maW5kQWN0b3IoeCwgeSk7XHJcblx0XHRcdGlmIChibG9ja2VyKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYnVtcChhY3RvciwgYmxvY2tlciwgeCwgeSwgYnVtcENvbWJhdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHsgeDogeCwgeTogeSwgbW92ZWQ6IGZhbHNlIH07XHJcblx0XHR9XHJcblx0XHRhY3Rvci5tb3ZlVG8oeCwgeSk7XHJcblx0XHQvLyBUT0RPOiBqdXN0IHJlZHJhdyB0aGUgc3BhY2UgdGhhdCB3YXMgdW5kZXIgdGhlIGFjdG9yIGFuZCB0aGUgYWN0b3IgaW4gdGhlIG5ldyBzcG90P1xyXG5cdFx0aWYgKGFjdG9yLmlzSGVybykge1xyXG5cdFx0XHR0aGlzLmRpc2NvdmVyQXJvdW5kSGVybygpO1xyXG5cdFx0XHR0aGlzLm5hcnJhdGVBcm91bmRIZXJvKCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLmRyYXcoKTtcclxuXHRcdHJldHVybiB7IHgsIHksIG1vdmVkOiB0cnVlIH07XHJcblx0fVxyXG5cclxuXHRidW1wKGFjdG9yLCBibG9ja2VyLCB4LCB5LCBidW1wQ29tYmF0KSB7XHJcblx0XHRpZiAoYnVtcENvbWJhdCAmJiBhY3Rvci5mYWN0aW9uICE9PSBibG9ja2VyLmZhY3Rpb24pIHtcclxuXHRcdFx0dGhpcy5yZXNvbHZlQ29tYmF0KGFjdG9yLCBibG9ja2VyLCB4LCB5KTtcclxuXHRcdFx0cmV0dXJuIHsgeCwgeSwgbW92ZWQ6IGZhbHNlIH07XHJcblx0XHR9IGVsc2UgaWYgKEdhbWUuY2FuQnVtcFN3aXRjaChhY3RvciwgYmxvY2tlcikpIHtcclxuXHRcdFx0YWN0b3IubW92ZVRvKHgsIHkpO1xyXG5cdFx0XHRyZXR1cm4geyB4LCB5LCBtb3ZlZDogdHJ1ZSB9O1xyXG5cdFx0XHQvLyBUT0RPOiBhbGxvdyBwdXNoZXMgYmFzZWQgb24gYXV0aG9yaXR5L3NpemVcclxuXHRcdH0gZWxzZSB7IC8vIGp1c3QgYmxvY2tlZFxyXG5cdFx0XHRyZXR1cm4geyB4LCB5LCBtb3ZlZDogZmFsc2UgfTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjYW5CdW1wU3dpdGNoKGFjdG9yLCBibG9ja2VyKSB7XHJcblx0XHRpZiAoYWN0b3IuYWdncm8gfHwgYmxvY2tlci5hZ2dybykgeyAvLyBUT09EOiBtYWtlIHRoaXMgbW9yZSBudWFuY2VkXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGNvbnN0IGJsb2NrZXJzTmV4dEFjdGlvbiA9IGJsb2NrZXIuZ2V0TmV4dEFjdGlvbigpO1xyXG5cdFx0aWYgKCFibG9ja2Vyc05leHRBY3Rpb24pIHsgcmV0dXJuIHRydWU7IH1cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdGJsb2NrZXJzTmV4dEFjdGlvbi52ZXJiID09PSAnbW92ZScgJiZcclxuXHRcdFx0YmxvY2tlcnNOZXh0QWN0aW9uLnggPT09IGFjdG9yLnggJiZcclxuXHRcdFx0YmxvY2tlcnNOZXh0QWN0aW9uLnkgPT09IGFjdG9yLnlcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHR0ZWxlcG9ydEFjdG9yKGFjdG9yLCB0ZWxlcG9ydFBhcmFtcyA9IHt9KSB7XHJcblx0XHRjb25zdCBvcmlnaW5hbExldmVsSW5kZXggPSB0aGlzLmFjdGl2ZUxldmVsSW5kZXg7XHJcblx0XHQvLyBjb25zb2xlLndhcm4oJ3RlbGVwb3J0aW5nJywgYWN0b3IsIHRlbGVwb3J0UGFyYW1zKTtcclxuXHRcdGNvbnN0IHsgbGV2ZWxJbmRleCwgeCwgeSB9ID0gdGVsZXBvcnRQYXJhbXM7XHJcblx0XHRjb25zdCBjdXJyZW50TGV2ZWwgPSB0aGlzLmdldEFjdGl2ZUxldmVsKCk7XHJcblx0XHRjdXJyZW50TGV2ZWwucmVtb3ZlQWN0b3IoYWN0b3IpO1xyXG5cdFx0dGhpcy5zZXRBY3RpdmVMZXZlbChsZXZlbEluZGV4KTtcclxuXHRcdGNvbnN0IG5ld0xldmVsID0gdGhpcy5nZXRBY3RpdmVMZXZlbCgpO1xyXG5cdFx0bmV3TGV2ZWwuYWRkQWN0b3IoYWN0b3IpO1xyXG5cdFx0YWN0b3Iuc2V0Q29vcmRpbmF0ZXMoeCwgeSk7XHJcblx0XHRjb25zb2xlLmxvZygnTmV3IExldmVsOicsIG5ld0xldmVsKTtcclxuXHRcdGlmIChhY3Rvci5pc0hlcm8pIHtcclxuXHRcdFx0dGhpcy5kaXNjb3ZlckFyb3VuZEhlcm8oKTtcclxuXHRcdFx0dGhpcy5uYXJyYXRlQXJvdW5kSGVybygpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKG9yaWdpbmFsTGV2ZWxJbmRleCAhPT0gbGV2ZWxJbmRleCkge1xyXG5cdFx0XHR0aGlzLmhvb2soJ2FmdGVyVGVsZXBvcnRMZXZlbCcsIHsgbGV2ZWxJbmRleCwgeCwgeSB9KTtcclxuXHRcdH1cclxuXHRcdC8vIHRoaXMuZHJhdygpO1xyXG5cdH1cclxuXHJcblx0cmVzb2x2ZUNvbWJhdChhY3Rvciwgb3Bwb25lbnQsIHgsIHkpIHtcclxuXHRcdGNvbnN0IGxldmVsID0gdGhpcy5nZXRBY3RpdmVMZXZlbCgpO1xyXG5cdFx0aWYgKCFhY3RvciB8fCAhb3Bwb25lbnQgfHwgYWN0b3IuZmFjdGlvbiA9PT0gb3Bwb25lbnQuZmFjdGlvbikge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRjb25zdCB7IG91dGNvbWVBdHRhY2sgfSA9IGxldmVsLnJlc29sdmVDb21iYXRFZmZlY3RzKGFjdG9yLCBvcHBvbmVudCk7XHJcblx0XHQvLyBUT0RPOiBnZXQgbWVzc2FnZXMgZnJvbSByZXNvbHZlIGFuZCBlZmZlY3RzIG1ldGhvZHNcclxuXHRcdGcucHJpbnQoYCR7YWN0b3IubmFtZX0gYXR0YWNrcyAke29wcG9uZW50Lm5hbWV9IGFuZCBkb2VzICR7b3V0Y29tZUF0dGFjay5kYW1hZ2V9IGRhbWFnZSFgKTtcclxuXHRcdGlmIChvcHBvbmVudC5kZWFkKCkpIHtcclxuXHRcdFx0Zy5wcmludChgJHtvcHBvbmVudC5uYW1lfSBoYXMgYmVlbiBraWxsZWQuYCk7XHJcblx0XHRcdGFjdG9yLnNjb3JlICs9ICh0aGlzLmFjdGl2ZUxldmVsSW5kZXggKyAxKSAqIDEwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0YWN0b3JBZGREZWZhdWx0QWN0aW9uKGFjdG9yKSB7XHJcblx0XHRjb25zdCBsZXZlbCA9IHRoaXMuZ2V0QWN0aXZlTGV2ZWwoKTtcclxuXHRcdGNvbnN0IHRoaW5nID0gbGV2ZWwuZmluZFRoaW5nU21hcnQoYWN0b3IueCwgYWN0b3IueSwgJ3BvcnRhYmxlJyk7XHJcblx0XHQvLyBUT0RPOiBNYXliZSBnZXQgbXVsdGlwbGUgdGhpbmdzIGFuZCBjaGVjayBpZiB0aGV5IGhhdmUgYWN0aW9ucz9cclxuXHRcdGNvbnNvbGUubG9nKHRoaW5nLCBhY3Rvci54LCBhY3Rvci55KTtcclxuXHRcdGlmICghdGhpbmcpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaW5nLnBvcnRhYmxlKSB7XHJcblx0XHRcdGFjdG9yLnF1ZXVlQWN0aW9uKCdwaWNrdXAnLCB7IHRhcmdldDogdGhpbmcgfSk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaW5nLmhhc0FjdGlvbignb3BlbicpKSB7XHJcblx0XHRcdGFjdG9yLnF1ZXVlQWN0aW9uKCdvcGVuJywgeyB0YXJnZXQ6IHRoaW5nIH0pO1xyXG5cdFx0fSBlbHNlIGlmICh0aGluZy5oYXNBY3Rpb24oJ3VzZScpKSB7XHJcblx0XHRcdGFjdG9yLnF1ZXVlQWN0aW9uKCd1c2UnLCB7IHRhcmdldDogdGhpbmcgfSk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaW5nLmhhc0FjdGlvbignZGVzY2VuZCcpIHx8IHRoaW5nLmhhc0FjdGlvbignYXNjZW5kJykpIHtcclxuXHRcdFx0YWN0b3IucXVldWVBY3Rpb24oJ3RlbGVwb3J0JywgeyB0ZWxlcG9ydDogdGhpbmcudGVsZXBvcnQgfSk7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdQbGFubmluZyB0byB0ZWxlcG9ydC4uLicsIGFjdG9yLmFjdGlvblF1ZXVlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFkdmFuY2UoKSB7XHJcblx0XHRjb25zdCBzdGFydEhwID0gdGhpcy5oZXJvLmhwO1xyXG5cdFx0Ly8gVE9ETzogYWR2YW5jZSB0aW1lXHJcblx0XHQvLyBEbyBhY3Rpb25zIGZvciBhbGwgYWN0b3JzXHJcblx0XHRjb25zdCBsZXZlbCA9IHRoaXMuZ2V0QWN0aXZlTGV2ZWwoKTtcclxuXHRcdGxldmVsLnJlc29sdmVSb3VuZEVmZmVjdHMoKTtcclxuXHRcdGNvbnN0IGFjdG9ycyA9IGxldmVsLmdldEFjdG9yc0luaXRpYXRpdmVPcmRlcmVkKCk7XHJcblx0XHRsZXZlbC5jb29sT2ZmSW5pdGlhdGl2ZUJvb3N0cygpO1xyXG5cdFx0YWN0b3JzLmZvckVhY2goKGFjdG9yKSA9PiB7XHJcblx0XHRcdGFjdG9yLnBsYW5BY3Rpb24obGV2ZWwsIHRoaXMuaGVybyk7XHJcblx0XHRcdHRoaXMuYWR2YW5jZUFjdG9yKGFjdG9yKTtcclxuXHRcdH0pO1xyXG5cdFx0Ly8gdGhpcy5hZHZhbmNlQWN0b3IodGhpcy5oZXJvKTtcclxuXHRcdGNvbnN0IGlzRGFtYWdlZCA9IChzdGFydEhwID4gdGhpcy5oZXJvLmhwKTtcclxuXHRcdHRoaXMuZGlzcGxheS5kcmF3RGFtYWdlKGlzRGFtYWdlZCk7XHJcblx0XHRpZiAodGhpcy5oZXJvLmRlYWQoKSkge1xyXG5cdFx0XHR0aGlzLmhvb2soJ2FmdGVySGVyb0RlYXRoJywge30pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5kcmF3KCk7XHJcblx0fVxyXG5cclxuXHRhZHZhbmNlQWN0b3IoYWN0b3IpIHtcclxuXHRcdGNvbnN0IGxldmVsID0gdGhpcy5nZXRBY3RpdmVMZXZlbCgpO1xyXG5cdFx0Y29uc3QgYWN0aW9uID0gYWN0b3IuZG9BY3Rpb24oKTtcclxuXHRcdGlmICghYWN0aW9uKSB7IHJldHVybjsgfVxyXG5cdFx0Y29uc3QgeyB2ZXJiLCB0YXJnZXQsIHdoYXQsIHgsIHkgfSA9IGFjdGlvbjtcclxuXHRcdGlmIChhY3Rvci5pc0hlcm8pIHtcclxuXHRcdFx0aWYgKHZlcmIgPT09ICdtb3ZlJykgeyBjb25zb2xlLmxvZyhhY3Rvci5uYW1lICsgJyAnICsgdmVyYik7IH1cclxuXHRcdFx0ZWxzZSB7IGNvbnNvbGUubG9nKGFjdG9yLm5hbWUsIHZlcmIsIGFjdGlvbik7IH1cclxuXHRcdH1cclxuXHRcdGxldCBvdXRjb21lID0ge307XHJcblx0XHRsZXQgbWVzc2FnZSA9ICcnO1xyXG5cdFx0c3dpdGNoICh2ZXJiKSB7XHJcblx0XHRcdGNhc2UgJ21vdmUnOlxyXG5cdFx0XHRcdGNvbnN0IGJ1bXBDb21iYXQgPSAoYWN0b3IuaXNIZXJvIHx8IGFjdG9yLmFnZ3JvID4gMCk7XHJcblx0XHRcdFx0aWYgKGFjdGlvbi5kaXJlY3Rpb24gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlQWN0b3JUbyhhY3RvciwgYWN0aW9uLngsIGFjdGlvbi55LCBidW1wQ29tYmF0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5tb3ZlQWN0b3IoYWN0b3IsIGFjdGlvbi5kaXJlY3Rpb24sIGJ1bXBDb21iYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3VzZSc6XHJcblx0XHRcdFx0b3V0Y29tZSA9IGxldmVsLnVzZVRoaW5nKGFjdG9yLCAndXNlJywgdGFyZ2V0KTtcclxuXHRcdFx0XHRtZXNzYWdlID0gb3V0Y29tZS5tZXNzYWdlO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnb3Blbic6XHJcblx0XHRcdFx0b3V0Y29tZSA9IGxldmVsLnVzZVRoaW5nKGFjdG9yLCAnb3BlbicsIHRhcmdldCk7XHJcblx0XHRcdFx0bWVzc2FnZSA9IG91dGNvbWUubWVzc2FnZTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3RlbGVwb3J0JzpcclxuXHRcdFx0XHRtZXNzYWdlID0gYCR7YWN0b3IubmFtZX0gbm93IGVudGVyaW5nOiBgO1xyXG5cdFx0XHRcdHRoaXMudGVsZXBvcnRBY3RvcihhY3RvciwgYWN0aW9uLnRlbGVwb3J0KTtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRjb25zdCBuZXdMZXZlbCA9IHRoaXMuZ2V0QWN0aXZlTGV2ZWwoKTtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgKz0gbmV3TGV2ZWwubmFtZTtcclxuXHRcdFx0XHRcdGlmIChuZXdMZXZlbC5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHRcdFx0XHRtZXNzYWdlICs9ICcgLSAnICsgbmV3TGV2ZWwuZGVzY3JpcHRpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncGlja3VwJzpcclxuXHRcdFx0XHRjb25zdCBwaWNrZWRVcCA9IHRoaXMucGlja3VwSXRlbShhY3RvciwgdGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAocGlja2VkVXApIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBgJHthY3Rvci5uYW1lfSBwaWNrcyB1cCB0aGUgJHt0YXJnZXQubmFtZX0uYDtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRhcmdldCkge1xyXG5cdFx0XHRcdFx0bWVzc2FnZSA9IGAke2FjdG9yLm5hbWV9IGNvdWxkIG5vdCBwaWNrIHVwIHRoZSAke3RhcmdldC5uYW1lfS5gO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlID0gYE5vdGhpbmcgdG8gcGljayB1cC5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3Rocm93JzpcclxuXHRcdFx0XHRtZXNzYWdlID0gbGV2ZWwudGhyb3coYWN0b3IsIHdoYXQsIHgsIHkpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnbG9vayc6XHJcblx0XHRcdFx0Y29uc3QgdGhpbmdzID0gdGhpcy5nZXRBY3RpdmVMZXZlbCgpLmZpbmRFdmVyeXRoaW5nSW5WaWV3KHsgZXhjbHVkZUhlcm86IHRydWUgfSk7XHJcblx0XHRcdFx0Y29uc3QgbmFtZXMgPSB0aGluZ3MubWFwKCh0aGluZykgPT4gdGhpbmcubmFtZSB8fCAnPycpLmpvaW4oJywgJyk7XHJcblx0XHRcdFx0bWVzc2FnZSA9IGAke2FjdG9yLm5hbWV9IGxvb2tzIGFyb3VuZCBhbmQgc2VlczogJHtuYW1lc31gO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnd2FpdCc6XHJcblx0XHRcdFx0YWN0b3Iud2FpdCgpO1xyXG5cdFx0XHRcdGlmIChhY3Rvci5pc0hlcm8pIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBgJHthY3Rvci5uYW1lfSB3YWl0cyAocmFuZG9tIHJlY292ZXJ5IG9mIEFQLCBCUCwgb3IgRVAgcG9pbnRzKS5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHRpZiAodHlwZW9mIG1lc3NhZ2UgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ1Vua25vd24gbWVzc2FnZSBmcm9tIGRvaW5nIGFjdGlvbicsIHZlcmIpO1xyXG5cdFx0XHRtZXNzYWdlID0gJ0VSUk9SJztcclxuXHRcdH1cclxuXHRcdHRoaXMucHJpbnQobWVzc2FnZSk7XHJcblx0fVxyXG5cclxuXHRwaWNrdXBJdGVtKGFjdG9yLCB0aGluZykge1xyXG5cdFx0aWYgKCF0aGluZykgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdGlmICghdGhpbmcucG9ydGFibGUpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRjb25zdCBsZXZlbCA9IHRoaXMuZ2V0QWN0aXZlTGV2ZWwoKTtcclxuXHRcdGNvbnN0IGl0ZW0gPSBsZXZlbC5yZW1vdmVJdGVtKHRoaW5nKTtcclxuXHRcdGlmICghaXRlbSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdGNvbnN0IGFkZGVkID0gYWN0b3IuaW52ZW50b3J5LmFkZCh0aGluZyk7XHJcblx0XHRpZiAoIWFkZGVkKSB7XHJcblx0XHRcdGxldmVsLmFkZEl0ZW0oaXRlbSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYWRkZWQ7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gRXhwbG9yYXRpb25cclxuXHJcblx0ZGlzY292ZXJBcm91bmRIZXJvKCkge1xyXG5cdFx0Y29uc3QgbGV2ZWwgPSB0aGlzLmdldEFjdGl2ZUxldmVsKCk7XHJcblx0XHRjb25zdCBpbGx1bWluYXRpb24gPSB0aGlzLmhlcm8uaW52ZW50b3J5Lml0ZW1zLnJlZHVjZSgobiwgaXRlbSkgPT4ge1xyXG5cdFx0XHRyZXR1cm4gbiArIGl0ZW0uaWxsdW1pbmF0aW9uO1xyXG5cdFx0fSwgMCk7XHJcblx0XHRsZXZlbC5kaXNjb3ZlckNpcmNsZSh0aGlzLmhlcm8ueCwgdGhpcy5oZXJvLnksIHRoaXMuaGVyby5zaWdodFJhbmdlICsgaWxsdW1pbmF0aW9uKTsgLy8gVE9ETzogYWxsb3cgZGlmZmVyZW50IFBPVlxyXG5cdFx0bGV2ZWwuc2V0RXllKHRoaXMuaGVybyk7XHJcblx0fVxyXG5cclxuXHRuYXJyYXRlQXJvdW5kSGVybygpIHtcclxuXHRcdGNvbnN0IGFsbFRoaW5nc09uSGVybyA9IHRoaXMuZ2V0VGhpbmdzT25BY3Rvcih0aGlzLmhlcm8pO1xyXG5cdFx0aWYgKGFsbFRoaW5nc09uSGVyby5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XHJcblx0XHRjb25zdCBuYW1lc09uSGVybyA9IGFsbFRoaW5nc09uSGVyby5tYXAoKHRoaW5nKSA9PiB0aGluZy5uYW1lKTtcclxuXHRcdGNvbnN0IG5hbWVzU3RyaW5nID0gKG5hbWVzT25IZXJvLmxlbmd0aCA+IDEpID8gbmFtZXNPbkhlcm8uam9pbignLCAnKSA6ICdhICcgKyBuYW1lc09uSGVyb1swXTtcclxuXHRcdHRoaXMuY29uc29sZS5wcmludChgWW91IGFyZSBvbiAke25hbWVzU3RyaW5nfS5gKTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBTeXN0ZW1cclxuXHJcblx0cmVhZHkoY2FsbGJhY2ssIGZvbnRzID0gW10pIHsgLy8gVE9ETzogcmVtb3ZlIGZvbnRzIHBhcmFtP1xyXG5cdFx0Y29uc3QgZm9udEZhbWlsaWVzVG9Mb2FkID0gWyAuLi5mb250cyBdLmNvbmNhdCh0aGlzLmZvbnRGYW1pbGllcyk7XHJcblx0XHRjb25zb2xlLmxvZyhmb250RmFtaWxpZXNUb0xvYWQpO1xyXG5cdFx0cmVhZHkoKCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5sb2FkaW5nUHJvbWlzZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuXHRcdFx0XHR0aGlzLmxvYWRpbmdQcm9taXNlXHJcblx0XHRcdFx0XHQudGhlbigoKSA9PiB7IGNhbGxiYWNrKCk7IH0pO1xyXG5cdFx0XHRcdFx0Ly8gLmNhdGNoKChlcnIpID0+IHsgY29uc29sZS5lcnJvcignRXJyb3IgbG9hZGluZyBzb21ldGhpbmcnLCBlcnIpIH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNhbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sIGZvbnRGYW1pbGllc1RvTG9hZCk7XHJcblx0XHQvLyBUT0RPOiByZXR1cm4gYSBwcm9taXNlIHNvIGNhbiBiZSB1c2VkIGFzeW5jXHJcblx0fVxyXG5cclxuXHRzdGFydCgpIHtcclxuXHRcdHRoaXMuc2V0dXBFbmdpbmUoKTtcclxuXHRcdHRoaXMuc2V0dXBLZXlib2FyZCgpO1xyXG5cdFx0dGhpcy5zZXR1cE11c2ljKCk7XHJcblx0XHRjb25zdCBzdGFydFN0YXRlID0gKHRoaXMuaGF2ZVNwbGFzaCkgPyBTUExBU0hfU1RBVEUgOiBNQUlOX0dBTUVfU1RBVEU7XHJcblx0XHR0aGlzLnNldFN0YXRlRGV0ZWN0KHN0YXJ0U3RhdGUpO1xyXG5cdFx0Ly8gVE9ETzogc3RhcnQgZ3JhcGhpY3MgbG9vcFxyXG5cdFx0dGhpcy5kcmF3KCk7XHJcblx0fVxyXG5cclxuXHRzdG9wKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShPRkZfU1RBVEUpO1xyXG5cdFx0dGhpcy5yZW1vdmVLZXlib2FyZCgpO1xyXG5cdFx0Ly8gVE9ETzogc3RvcCBncmFwaGljcyBsb29wXHJcblx0fVxyXG5cclxuXHRsb2FkRGF0YShkYXRhKSB7XHJcblx0XHRjb25zdCBwcm9taXNlcyA9IFtdO1xyXG5cdFx0ZnVuY3Rpb24gcGFyc2VKc29uKHJlc3BvbnNlKSB7IHJldHVybiByZXNwb25zZS5qc29uKCk7IH1cclxuXHRcdGZ1bmN0aW9uIGZpeElubmVyT2JqZWN0KG9iaiwga2V5KSB7XHJcblx0XHRcdHJldHVybiAodHlwZW9mIG9ialtrZXldID09PSAnb2JqZWN0JykgPyBvYmpba2V5XSA6IG9iajtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGtleSBpbiBkYXRhKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgZGF0YVtrZXldID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdGNvbnN0IHAgPSBmZXRjaChkYXRhW2tleV0pXHJcblx0XHRcdFx0XHQudGhlbihwYXJzZUpzb24pXHJcblx0XHRcdFx0XHQudGhlbigob2JqKSA9PiBmaXhJbm5lck9iamVjdChvYmosIGtleSkpXHJcblx0XHRcdFx0XHQudGhlbigob2JqKSA9PiB7IHRoaXMuc2V0RGF0YShrZXksIG9iaik7IH0pO1xyXG5cdFx0XHRcdFx0Ly8uY2F0Y2goKGVycikgPT4geyBjb25zb2xlLmVycm9yKGRhdGEsIGtleSwgZXJyKTsgfSk7XHJcblx0XHRcdFx0cHJvbWlzZXMucHVzaChwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnNldERhdGEoa2V5LCBkYXRhW2tleV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmxvYWRpbmdQcm9taXNlID0gUHJvbWlzZS5hbGwocHJvbWlzZXMpOyAvLyAudGhlbigocmVzcCkgPT4geyBjb25zb2xlLmxvZyhyZXNwKTsgfSk7XHJcblx0XHRyZXR1cm4gdGhpcy5sb2FkaW5nUHJvbWlzZTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBIb29rc1xyXG5cclxuXHRhZGRIb29rKGhvb2tOYW1lLCBmbikge1xyXG5cdFx0aWYgKCF0aGlzLmhvb2tzW2hvb2tOYW1lXSkge1xyXG5cdFx0XHR0aGlzLmhvb2tzW2hvb2tOYW1lXSA9IFtdO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5ob29rc1tob29rTmFtZV0ucHVzaChmbik7XHJcblx0fVxyXG5cclxuXHRyZW1vdmVIb29rKGhvb2tOYW1lLCBmbikge1xyXG5cdFx0aWYgKCF0aGlzLmhvb2tzW2hvb2tOYW1lXSkgeyByZXR1cm47IH1cclxuXHRcdGNvbnN0IGkgPSB0aGlzLmhvb2tzW2hvb2tOYW1lXS5pbmRleE9mKGZuKTtcclxuXHRcdHRoaXMuaG9va3NbaG9va05hbWVdLnNwbGljZShpLCAxKTtcclxuXHR9XHJcblxyXG5cdGhvb2soaG9va05hbWUsIGRhdGEgPSB7fSkge1xyXG5cdFx0Y29uc3QgaG9vayA9IHRoaXMuaG9va3NbaG9va05hbWVdO1xyXG5cdFx0aWYgKCFob29rKSB7IHJldHVybjsgfVxyXG5cdFx0aG9vay5mb3JFYWNoKChmbikgPT4ge1xyXG5cdFx0XHRmbihkYXRhLCB0aGlzLCBob29rTmFtZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBHZXRzXHJcblxyXG5cdGdldEFjdGl2ZUxldmVsKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMubGV2ZWxzW3RoaXMuYWN0aXZlTGV2ZWxJbmRleF07XHJcblx0fVxyXG5cclxuXHRnZXRMZXZlbFR5cGUoa2V5KSB7XHJcblx0XHRjb25zdCBsdCA9IHRoaXMuZGF0YS5sZXZlbHNba2V5XTtcclxuXHRcdGlmICh0eXBlb2YgbHQgIT09ICdvYmplY3QnIHx8IGx0ID09PSBudWxsKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBmaW5kIGxldmVsIHR5cGUgJywga2V5KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBsdDtcclxuXHR9XHJcblxyXG5cdGdldERhdGFQcm9wQXJyYXkoKSB7XHJcblx0XHRjb25zdCBwcm9wS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGF0YS5wcm9wcyk7XHJcblx0XHRjb25zdCBhcnIgPSBbXTtcclxuXHRcdHByb3BLZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG5cdFx0XHRjb25zdCBwcm9wID0geyAuLi50aGlzLmRhdGEucHJvcHNba2V5XSwga2V5IH07XHJcblx0XHRcdGFyci5wdXNoKHByb3ApO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gYXJyO1xyXG5cdH1cclxuXHJcblx0Z2V0VGhpbmdzT25BY3RvcihhY3Rvcikge1xyXG5cdFx0Y29uc3QgeyB4LCB5IH0gPSBhY3RvcjtcclxuXHRcdHJldHVybiB0aGlzLmdldEFjdGl2ZUxldmVsKCkuZmluZFRoaW5ncyh4LCB5KTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBTZXRzXHJcblxyXG5cdHNldEFjdGl2ZUxldmVsKGkpIHtcclxuXHRcdHRoaXMuYWN0aXZlTGV2ZWxJbmRleCA9IGk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRzZXREYXRhKGtleSwgb2JqKSB7XHJcblx0XHR0aGlzLmRhdGFba2V5XSA9IE9iamVjdC5mcmVlemUob2JqKTtcclxuXHR9XHJcblxyXG5cdHNldFN0YXRlRGV0ZWN0KHN0YXRlRmFsbGJhY2spIHtcclxuXHRcdC8vIFRPRE86IGltcHJvdmUuLi4gbm90IHN1cmUgaSBsaWtlIGhvdyB0aGlzIHdvcmtzXHJcblx0XHQvLyBjb25zdCBoYXNoID0gbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkudG9VcHBlckNhc2UoKTtcclxuXHRcdC8vIGlmICh0aGlzLnN0YXRlcy5pbmNsdWRlcyhoYXNoKSkge1xyXG5cdFx0Ly8gXHRyZXR1cm4gdGhpcy5zZXRTdGF0ZShoYXNoKTtcclxuXHRcdC8vIH1cclxuXHRcdHJldHVybiB0aGlzLnNldFN0YXRlKHN0YXRlRmFsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0c2V0U3RhdGUoc3RhdGUpIHtcclxuXHRcdGNvbnN0IGlzTGVnaXRTdGF0ZSA9IHRoaXMuc3RhdGVzLmhhcyhzdGF0ZSk7XHJcblx0XHRjb25zdCBjb25zb2xlTWV0aG9kID0gKGlzTGVnaXRTdGF0ZSkgPyAnbG9nJyA6ICd3YXJuJztcclxuXHRcdGNvbnNvbGVbY29uc29sZU1ldGhvZF0oJ1NldHRpbmcgc3RhdGU6Jywgc3RhdGUpO1xyXG5cdFx0Y29uc3QgcHJlZml4ID0gJ3JvdGUtc3RhdGUtJztcclxuXHRcdHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuXHRcdC8vIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyb3RlLXN0YXRlJylbMF07XHJcblx0XHRjb25zdCBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcclxuXHRcdC8vIGJvZHkuY2xhc3NOYW1lID0gJ3JvdGUtc3RhdGUnOyAvLyBUT0RPOiBtYWtlIHRoaXMgc21hcnRlciBzbyBpdCBvbmx5IHJlbW92ZXMgcm90ZSBzdGF0ZXNcclxuXHRcdC8vIGJvZHkuY2xhc3NMaXN0LmFkZChwcmVmaXggKyB0aGlzLnN0YXRlLnRvTG93ZXJDYXNlKCkpO1xyXG5cdFx0Ym9keS5jbGFzc05hbWUgPSAncm90ZS1zdGF0ZSAnICsgcHJlZml4ICsgc3RhdGUudG9Mb3dlckNhc2UoKTtcclxuXHRcdGxvY2F0aW9uLmhhc2ggPSBzdGF0ZS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0dGhpcy5rZXlib2FyZC5zZXRTdGF0ZShzdGF0ZSk7XHJcblx0fVxyXG5cclxuXHRzZXRNYWluR2FtZVN0YXRlKCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShNQUlOX0dBTUVfU1RBVEUpO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcclxuIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjEuMCAtIMKpIEJyYW0gU3RlaW4uIExpY2Vuc2U6IEJTRC0zLUNsYXVzZSAqLyhmdW5jdGlvbigpe2Z1bmN0aW9uIGwoYSxiKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLGIsITEpOmEuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIixiKX1mdW5jdGlvbiBtKGEpe2RvY3VtZW50LmJvZHk/YSgpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbiBjKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjKTthKCl9KTpkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uIGsoKXtpZihcImludGVyYWN0aXZlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGV8fFwiY29tcGxldGVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZSlkb2N1bWVudC5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGspLGEoKX0pfTtmdW5jdGlvbiB0KGEpe3RoaXMuYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RoaXMuYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKTt0aGlzLmEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpO3RoaXMuYj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmc9LTE7dGhpcy5iLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmMuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xudGhpcy5mLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmguc3R5bGUuY3NzVGV4dD1cImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7XCI7dGhpcy5iLmFwcGVuZENoaWxkKHRoaXMuaCk7dGhpcy5jLmFwcGVuZENoaWxkKHRoaXMuZik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYyl9XG5mdW5jdGlvbiB1KGEsYil7YS5hLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDpcIitiK1wiO1wifWZ1bmN0aW9uIHooYSl7dmFyIGI9YS5hLm9mZnNldFdpZHRoLGM9YisxMDA7YS5mLnN0eWxlLndpZHRoPWMrXCJweFwiO2EuYy5zY3JvbGxMZWZ0PWM7YS5iLnNjcm9sbExlZnQ9YS5iLnNjcm9sbFdpZHRoKzEwMDtyZXR1cm4gYS5nIT09Yj8oYS5nPWIsITApOiExfWZ1bmN0aW9uIEEoYSxiKXtmdW5jdGlvbiBjKCl7dmFyIGE9azt6KGEpJiZhLmEucGFyZW50Tm9kZSYmYihhLmcpfXZhciBrPWE7bChhLmIsYyk7bChhLmMsYyk7eihhKX07ZnVuY3Rpb24gQihhLGIpe3ZhciBjPWJ8fHt9O3RoaXMuZmFtaWx5PWE7dGhpcy5zdHlsZT1jLnN0eWxlfHxcIm5vcm1hbFwiO3RoaXMud2VpZ2h0PWMud2VpZ2h0fHxcIm5vcm1hbFwiO3RoaXMuc3RyZXRjaD1jLnN0cmV0Y2h8fFwibm9ybWFsXCJ9dmFyIEM9bnVsbCxEPW51bGwsRT1udWxsLEY9bnVsbDtmdW5jdGlvbiBHKCl7aWYobnVsbD09PUQpaWYoSigpJiYvQXBwbGUvLnRlc3Qod2luZG93Lm5hdmlnYXRvci52ZW5kb3IpKXt2YXIgYT0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7RD0hIWEmJjYwMz5wYXJzZUludChhWzFdLDEwKX1lbHNlIEQ9ITE7cmV0dXJuIER9ZnVuY3Rpb24gSigpe251bGw9PT1GJiYoRj0hIWRvY3VtZW50LmZvbnRzKTtyZXR1cm4gRn1cbmZ1bmN0aW9uIEsoKXtpZihudWxsPT09RSl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7YS5zdHlsZS5mb250PVwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIn1jYXRjaChiKXt9RT1cIlwiIT09YS5zdHlsZS5mb250fXJldHVybiBFfWZ1bmN0aW9uIEwoYSxiKXtyZXR1cm5bYS5zdHlsZSxhLndlaWdodCxLKCk/YS5zdHJldGNoOlwiXCIsXCIxMDBweFwiLGJdLmpvaW4oXCIgXCIpfVxuQi5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMsaz1hfHxcIkJFU2Jzd3lcIixyPTAsbj1ifHwzRTMsSD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtpZihKKCkmJiFHKCkpe3ZhciBNPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gZSgpeyhuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PW4/YihFcnJvcihcIlwiK24rXCJtcyB0aW1lb3V0IGV4Y2VlZGVkXCIpKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGIpfWUoKX0pLE49bmV3IFByb21pc2UoZnVuY3Rpb24oYSxjKXtyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtjKEVycm9yKFwiXCIrbitcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpfSxuKX0pO1Byb21pc2UucmFjZShbTixNXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChyKTthKGMpfSxcbmIpfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHYoKXt2YXIgYjtpZihiPS0xIT1mJiYtMSE9Z3x8LTEhPWYmJi0xIT1ofHwtMSE9ZyYmLTEhPWgpKGI9ZiE9ZyYmZiE9aCYmZyE9aCl8fChudWxsPT09QyYmKGI9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEM9ISFiJiYoNTM2PnBhcnNlSW50KGJbMV0sMTApfHw1MzY9PT1wYXJzZUludChiWzFdLDEwKSYmMTE+PXBhcnNlSW50KGJbMl0sMTApKSksYj1DJiYoZj09dyYmZz09dyYmaD09d3x8Zj09eCYmZz09eCYmaD09eHx8Zj09eSYmZz09eSYmaD09eSkpLGI9IWI7YiYmKGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGNsZWFyVGltZW91dChyKSxhKGMpKX1mdW5jdGlvbiBJKCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSD49bilkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxiKEVycm9yKFwiXCIrXG5uK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLGc9cC5hLm9mZnNldFdpZHRoLGg9cS5hLm9mZnNldFdpZHRoLHYoKTtyPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyB0KGspLHA9bmV3IHQoaykscT1uZXcgdChrKSxmPS0xLGc9LTEsaD0tMSx3PS0xLHg9LTEseT0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt1KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dShwLEwoYyxcInNlcmlmXCIpKTt1KHEsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2QuYXBwZW5kQ2hpbGQocS5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3c9ZS5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO3k9cS5hLm9mZnNldFdpZHRoO0koKTtBKGUsZnVuY3Rpb24oYSl7Zj1hO3YoKX0pO3UoZSxcbkwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO0EocCxmdW5jdGlvbihhKXtnPWE7digpfSk7dShwLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtBKHEsZnVuY3Rpb24oYSl7aD1hO3YoKX0pO3UocSxMKGMsJ1wiJytjLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9Qjood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9Qix3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1CLnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIiwiY2xhc3MgQ2VsbCB7XHJcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XHJcblx0XHR0aGlzLmNoYXJhY3RlciA9IG9wdGlvbnMuY2hhcmFjdGVyIHx8ICcgJztcclxuXHRcdHRoaXMuZGlzY292ZXJlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgJyM3NzcnO1xyXG5cdFx0dGhpcy5iYWNrZ3JvdW5kID0gb3B0aW9ucy5iYWNrZ3JvdW5kIHx8ICcjMjIyJztcclxuXHRcdHRoaXMucGFzc2FiaWxpdHkgPSBmYWxzZTsgLy8gVE9ETzogaGFuZGxlIHRoaXMgZGlmZmVyZW50P1xyXG5cdH1cclxuXHJcblx0Ly8gR2V0c1xyXG5cclxuXHRnZXRQYXNzYWJpbGl0eSgpIHsgLy8gVE9ETzogdXBkYXRlIHRoaXNcclxuXHRcdHJldHVybiAodGhpcy5jaGFyYWN0ZXIgPT09ICcuJyk7XHJcblx0fVxyXG5cclxuXHRnZXRDaGFyYWN0ZXIoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5jaGFyYWN0ZXI7XHJcblx0fVxyXG5cclxuXHRnZXRGb3JlZ3JvdW5kQ29sb3IoaW5WaWV3ID0gdHJ1ZSkge1xyXG5cdFx0aWYgKCF0aGlzLmRpc2NvdmVyZWQpIHtcclxuXHRcdFx0cmV0dXJuICcjMDAwJztcclxuXHRcdH1cclxuXHRcdHJldHVybiAoaW5WaWV3KSA/IHRoaXMuY29sb3IgOiAnIzIzMjEyMCc7XHJcblx0fVxyXG5cclxuXHRnZXRCYWNrZ3JvdW5kQ29sb3IoaW5WaWV3ID0gdHJ1ZSkge1xyXG5cdFx0aWYgKCF0aGlzLmRpc2NvdmVyZWQpIHtcclxuXHRcdFx0cmV0dXJuICcjMDAwJztcclxuXHRcdH1cclxuXHRcdHJldHVybiAoaW5WaWV3KSA/IHRoaXMuYmFja2dyb3VuZCA6ICcjMTExMDEwJztcclxuXHR9XHJcblxyXG5cdC8vIFNldHNcclxuXHJcblx0c2V0Q2hhcmFjdGVyKGNoYXIpIHtcclxuXHRcdHRoaXMuY2hhcmFjdGVyID0gY2hhcjtcclxuXHR9XHJcblxyXG5cdGRpc2NvdmVyKCkge1xyXG5cdFx0dGhpcy5kaXNjb3ZlcmVkID0gdHJ1ZTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsbDtcclxuIiwiY29uc3QgRElSRUNUSU9OOCA9IHtcclxuXHQnVVAnOiAwLCAnVVAtUklHSFQnOiAxLFxyXG5cdCdSSUdIVCc6IDIsICdET1dOLVJJR0hUJzogMyxcclxuXHQnRE9XTic6IDQsICdET1dOLUxFRlQnOiA1LFxyXG5cdCdMRUZUJzogNiwgJ1VQLUxFRlQnOiA3XHJcbn07XHJcbmNvbnN0IERJUkVDVElPTjQgPSB7ICdVUCc6IDAsICdSSUdIVCc6IDEsICdET1dOJzogMiwgJ0xFRlQnOiAzIH07XHJcbmNvbnN0IERJUkVDVElPTjRfQVJSQVkgPSBbJ1VQJywgJ1JJR0hUJywgJ0RPV04nLCAnTEVGVCddO1xyXG5cclxuY29uc3QgVVNFRF9LRVlTID0gWydpJywgJ3QnLCAnbycsICdwJywgJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5J107XHJcbmNvbnN0IEtFWV9NQVAgPSB7XHJcblx0XCI5XCI6XHRcIlRBQlwiLFxyXG5cdFwiMTNcIjpcdFwiRU5URVJcIixcclxuXHRcIjI3XCI6XHRcIkVTQ1wiLFxyXG5cdFwiMzJcIjpcdFwiU1BBQ0VcIixcclxufTtcclxuS0VZX01BUFszOF0gPSAnVVAnOyAvLyB1cFxyXG5LRVlfTUFQWzMzXSA9ICdVUC1SSUdIVCc7XHJcbktFWV9NQVBbMzldID0gJ1JJR0hUJzsgLy8gcmlnaHRcclxuS0VZX01BUFszNF0gPSAnRE9XTi1SSUdIVCc7XHJcbktFWV9NQVBbNDBdID0gJ0RPV04nOyAvLyBkb3duXHJcbktFWV9NQVBbMzVdID0gJ0RPV04tTEVGVCc7XHJcbktFWV9NQVBbMzddID0gJ0xFRlQnOyAvLyBsZWZ0XHJcbktFWV9NQVBbMzZdID0gJ1VQLUxFRlQnO1xyXG5cclxuY29uc3QgV0FTRF9LRVlNQVAgPSB7XHJcblx0ODc6ICdVUCcsIC8vIHdcclxuXHQ2NTogJ0xFRlQnLCAvLyBhXHJcblx0ODM6ICdET1dOJywgLy8gc1xyXG5cdDY4OiAnUklHSFQnLCAvLyBkXHJcbn07XHJcbmNvbnN0IFdBU0RfRElBR09OQUwgPSB7XHJcblx0Li4uV0FTRF9LRVlNQVAsXHJcblx0ODE6ICdVUC1MRUZUJywgLy8gcVxyXG5cdDY5OiAnVVAtUklHSFQnLCAvLyBlXHJcblx0OTA6ICdET1dOLUxFRlQnLCAvLyB6XHJcblx0Njc6ICdET1dOLVJJR0hUJywgLy8gY1xyXG59O1xyXG5jb25zdCBWSV9LRVlNQVAgPSB7XHJcblx0NzI6ICdMRUZUJywgLy8gaFxyXG5cdDc0OiAnRE9XTicsIC8vIGpcclxuXHQ3NTogJ1VQJywgLy8ga1xyXG5cdDc2OiAnUklHSFQnLCAvLyBsXHJcbn07XHJcbmNvbnN0IFZJX0RJQUdPTkFMID0ge1xyXG5cdC4uLlZJX0tFWU1BUCxcclxuXHQ4OTogJ1VQLUxFRlQnLCAvLyB5XHJcblx0ODU6ICdVUC1SSUdIVCcsIC8vIHVcclxuXHQ2NjogJ0RPV04tTEVGVCcsIC8vIGJcclxuXHQ3ODogJ0RPV04tUklHSFQnLCAvLyBuXHJcbn07XHJcblxyXG5cclxuY29uc3QgVU5TUEVDSUZJRURfU1RBVEUgPSAnVU5TUEVDSUZJRUQnO1xyXG5cclxuY2xhc3MgS2V5Ym9hcmRMaXN0ZW5lciB7XHJcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XHJcblx0XHR0aGlzLmNhbGxiYWNrcyA9IHt9O1xyXG5cdFx0dGhpcy5pc0xpc3RlbmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5zdGF0ZSA9IG9wdGlvbnMuc3RhdGUgfHwgVU5TUEVDSUZJRURfU1RBVEU7XHJcblx0XHR0aGlzLmF1dG9TdGFydCA9IChvcHRpb25zLmF1dG9TdGFydCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogQm9vbGVhbihvcHRpb25zLmF1dG9TdGFydCk7XHJcblx0fVxyXG5cclxuXHRzZXRTdGF0ZShzdGF0ZSA9IFVOU1BFQ0lGSUVEX1NUQVRFKSB7XHJcblx0XHR0aGlzLnN0YXRlID0gc3RhdGUudG9TdHJpbmcoKTtcclxuXHR9XHJcblxyXG5cdG9uKHN0YXRlLCBrZXksIGNhbGxiYWNrKSB7XHJcblx0XHQvLyBrZXkgY2FuIGJlIGEga2V5Q29kZSBvciBhIGtleVR5cGUgbGlrZSAnRElSRUNUSU9OJ1xyXG5cdFx0dGhpcy5jYWxsYmFja3Nbc3RhdGUgKyAnXycgKyBrZXldID0gY2FsbGJhY2s7XHJcblx0XHRpZiAodGhpcy5hdXRvU3RhcnQpIHtcclxuXHRcdFx0dGhpcy5zdGFydCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRvZmYoc3RhdGUsIGtleSwgY2FsbGJhY2spIHtcclxuXHRcdC8vIFRPRE86IHJlbW92ZSBjYWxsYmFja1xyXG5cdFx0Ly8gVE9ETzogaWYgbm8gbW9yZSBjYWxsYmFja3MgdGhlbiBzdG9wXHJcblx0fVxyXG5cclxuXHRnZXRLZXlNYXAoKSB7XHJcblx0XHRsZXQga2V5TWFwID0geyAuLi5LRVlfTUFQIH07XHJcblx0XHQvLyBUT0RPOiB2YXJpYXRpb25zIGJhc2VkIG9uIG9wdGlvbnMgc2VsZWN0ZWRcclxuXHRcdGtleU1hcCA9IHsgLi4ua2V5TWFwLCAuLi5XQVNEX0RJQUdPTkFMLCAuLi5WSV9ESUFHT05BTCB9O1xyXG5cdFx0cmV0dXJuIGtleU1hcDtcclxuXHR9XHJcblxyXG5cdGhhbmRsZUV2ZW50KGUpIHtcclxuXHRcdGNvbnN0IGtleU1hcCA9IHRoaXMuZ2V0S2V5TWFwKCk7XHJcblx0XHRjb25zdCB7IGtleUNvZGUsIGtleSB9ID0gZTtcclxuXHRcdGNvbnN0IGlzS2V5VXNlZCA9IFVTRURfS0VZUy5pbmNsdWRlcyhrZXkpIHx8IChrZXlDb2RlIGluIGtleU1hcCk7XHJcblxyXG5cdFx0aWYgKCFpc0tleVVzZWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0tleWJvYXJkIGhhbmRsZUV2ZW50IC0gdW5hY2NvdW50ZWQgZm9yIGtleTonLCBrZXksIGtleUNvZGUpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0Ly8gTG9va3VwIGtleSBuYW1lIGFuZCBkaXJlY3Rpb25cclxuXHRcdGNvbnN0IGtleU5hbWUgPSBrZXlNYXBba2V5Q29kZV0gfHwga2V5O1xyXG5cdFx0Y29uc3QgZGlyZWN0aW9uID0gRElSRUNUSU9OOFtrZXlOYW1lXTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdoYW5kbGVFdmVudCcsIGUsIGtleU5hbWUsIGtleUNvZGUsIGRpcmVjdGlvbik7XHJcblxyXG5cdFx0Ly8gQ2FsbGJhY2tzXHJcblx0XHRpZiAoZGlyZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Y29uc3QgdHlwZUNhbGxiYWNrID0gdGhpcy5jYWxsYmFja3NbdGhpcy5zdGF0ZSArICdfRElSRUNUSU9OJ107XHJcblx0XHRcdGlmICh0eXBlQ2FsbGJhY2spIHtcclxuXHRcdFx0XHR0eXBlQ2FsbGJhY2soa2V5TmFtZSwga2V5Q29kZSwgZGlyZWN0aW9uKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Y29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrc1t0aGlzLnN0YXRlICsgJ18nICsga2V5TmFtZV07XHJcblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlICsgJ18nICsga2V5TmFtZSwgY2FsbGJhY2spO1xyXG5cdFx0aWYgKGNhbGxiYWNrKSB7XHJcblx0XHRcdGNhbGxiYWNrKGtleU5hbWUsIGtleUNvZGUsIGRpcmVjdGlvbik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGFydCgpIHtcclxuXHRcdGlmICh0aGlzLmlzTGlzdGVuaW5nKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcyk7ICAvLyBwYXNzIHRoaXM7IHRoZSBgaGFuZGxlRXZlbnRgIHdpbGwgYmUgdXNlZFxyXG5cdFx0dGhpcy5pc0xpc3RlbmluZyA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRzdG9wKCkge1xyXG5cdFx0Ly8gVE9ETzogcmVtb3ZlIGV2ZW50IGxpc3RlbmVyXHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkTGlzdGVuZXI7XHJcbiIsIlxyXG5jbGFzcyBNdXNpY0JveCB7XHJcblx0Y29uc3RydWN0b3IocGxheWxpc3QpIHtcclxuXHRcdHRoaXMuYXVkaW8gPSBudWxsO1xyXG5cdFx0dGhpcy5wbGF5bGlzdCA9IFsgLi4ucGxheWxpc3QgXTtcclxuXHR9XHJcblxyXG5cdGFkZFRvUGxheWxpc3Qoc29uZ1BhdGgpIHtcclxuXHRcdHRoaXMucGxheWxpc3QucHVzaChzb25nUGF0aCk7XHJcblx0fVxyXG5cclxuXHRwbGF5KGkgPSAwKSB7XHJcblx0XHR0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvKHRoaXMucGxheWxpc3RbaV0pO1xyXG5cdFx0dGhpcy5hdWRpby5wbGF5KCk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE11c2ljQm94O1xyXG4iLCJjbGFzcyBDb25zb2xlIHtcclxuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHRcdHRoaXMuaWQgPSBvcHRpb25zLmlkIHx8ICdjb25zb2xlJztcclxuXHRcdHRoaXMuY29udGFpbmVyID0gbnVsbDtcclxuXHRcdHRoaXMubGlzdCA9IG51bGw7XHJcblx0XHR0aGlzLm1lc3NhZ2VzID0gW107XHJcblx0XHR0aGlzLndyaXRlVG9Db25zb2xlTG9nID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRzZXR1cCgpIHtcclxuXHRcdHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XHJcblx0XHR0aGlzLmNsZWFyKCk7XHJcblx0fVxyXG5cclxuXHRjbGVhcigpIHtcclxuXHRcdHRoaXMubWVzc2FnZXMubGVuZ3RoID0gMDtcclxuXHRcdHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9ICc8dWw+PC91bD4nO1xyXG5cdFx0dGhpcy5saXN0ID0gdGhpcy5jb250YWluZXIuZmlyc3RDaGlsZDtcclxuXHR9XHJcblxyXG5cdHByaW50KHN0ciwgY2xhc3NlcyA9ICcnKSB7XHJcblx0XHRpZiAoIXN0cikge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy53cml0ZVRvQ29uc29sZUxvZykge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnJWMnICsgc3RyLCAnY29sb3I6ICM1NTk5NTUnKTtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHNhZmVTdHIgPSBzdHIucmVwbGFjZSgnPCcsICcmbHQ7Jyk7XHJcblx0XHR0aGlzLmxpc3QuaW5uZXJIVE1MICs9IGA8bGkgY2xhc3M9XCIke2NsYXNzZXN9XCI+JHtzYWZlU3RyfTwvbGk+YDtcclxuXHRcdHRoaXMuY29udGFpbmVyLnNjcm9sbFRvcCA9IHRoaXMuY29udGFpbmVyLnNjcm9sbEhlaWdodDtcclxuXHRcdHRoaXMudHJpbSgpO1xyXG5cdH1cclxuXHJcblx0Ly8gYWxpYXNlc1xyXG5cdGxvZyhzdHIpIHsgcmV0dXJuIHRoaXMucHJpbnQoc3RyKTtcdH1cclxuXHRhZGQoc3RyKSB7IHJldHVybiB0aGlzLnByaW50KHN0cik7IH1cclxuXHJcblx0dHJpbSgpIHtcclxuXHRcdGlmICh0aGlzLmxpc3QuaW5uZXJIVE1MLmxlbmd0aCA+IDUwMDApIHtcclxuXHRcdFx0dGhpcy5saXN0LnJlbW92ZUNoaWxkKHRoaXMubGlzdC5maXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29uc29sZTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==