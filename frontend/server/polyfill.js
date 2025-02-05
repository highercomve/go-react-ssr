var process = { env: { NODE_ENV: "production" } };

function TextEncoder() {}
TextEncoder.prototype.encode = function (string) {
	var octets = [],
		length = string.length,
		i = 0;
	while (i < length) {
		var codePoint = string.codePointAt(i),
			c = 0,
			bits = 0;
		codePoint <= 0x7f
			? ((c = 0), (bits = 0x00))
			: codePoint <= 0x7ff
				? ((c = 6), (bits = 0xc0))
				: codePoint <= 0xffff
					? ((c = 12), (bits = 0xe0))
					: codePoint <= 0x1fffff && ((c = 18), (bits = 0xf0)),
			octets.push(bits | (codePoint >> c)),
			(c -= 6);
		while (c >= 0) {
			octets.push(0x80 | ((codePoint >> c) & 0x3f)), (c -= 6);
		}
		i += codePoint >= 0x10000 ? 2 : 1;
	}
	return octets;
};
function TextDecoder() {}
TextDecoder.prototype.decode = function (octets) {
	var string = "",
		i = 0;
	while (i < octets.length) {
		var octet = octets[i],
			bytesNeeded = 0,
			codePoint = 0;
		octet <= 0x7f
			? ((bytesNeeded = 0), (codePoint = octet & 0xff))
			: octet <= 0xdf
				? ((bytesNeeded = 1), (codePoint = octet & 0x1f))
				: octet <= 0xef
					? ((bytesNeeded = 2), (codePoint = octet & 0x0f))
					: octet <= 0xf4 &&
						((bytesNeeded = 3), (codePoint = octet & 0x07)),
			octets.length - i - bytesNeeded > 0
				? (function () {
						for (var k = 0; k < bytesNeeded; ) {
							(octet = octets[i + k + 1]),
								(codePoint = (codePoint << 6) | (octet & 0x3f)),
								(k += 1);
						}
					})()
				: (codePoint = 0xfffd),
			(bytesNeeded = octets.length - i),
			(string += String.fromCodePoint(codePoint)),
			(i += bytesNeeded + 1);
	}
	return string;
};

if (typeof MessageChannel === "undefined") {
	var MessageChannel = function () {
		(this.port1 = {
			postMessage: function (msg) {
				setTimeout(() => {
					this.onmessage && this.onmessage({ data: msg });
				}, 0);
			},
			onmessage: null,
		}),
			(this.port2 = {
				postMessage: function (msg) {
					setTimeout(() => {
						this.onmessage && this.onmessage({ data: msg });
					}, 0);
				},
				onmessage: null,
			});
	};
}

if (typeof globalThis.console === "undefined") {
	globalThis.console = {};
	const consoleMethods = [
		"log",
		"info",
		"warn",
		"error",
		"debug",
		"trace",
		"group",
		"groupEnd",
		"time",
		"timeEnd",
		"assert",
	];
	consoleMethods.forEach((method) => {
		globalThis.console[method] = () => {};
	});
}

// Create a minimal window-like object
const window = {
	location: {
		hostname: process.env.HOSTNAME || "localhost",
		protocol: process.env.PROTOCOL || "http:",
		origin: process.env.ORIGIN || "http://localhost",
		search: process.env.SEARCH || "",
	},
	navigator: {
		userAgent: "Server",
	},
	document: {
		createElement: () => ({}),
		title: "Server Render",
	},
	localStorage: {
		getItem: () => null,
		setItem: () => {},
		removeItem: () => {},
	},
	sessionStorage: {
		getItem: () => null,
		setItem: () => {},
		removeItem: () => {},
	},
};

// Attach to global scope
globalThis.window = window;
globalThis.document = window.document;
globalThis.navigator = window.navigator;
globalThis.localStorage = window.localStorage;
globalThis.sessionStorage = window.sessionStorage;

// Only define the polyfill if URLSearchParams is not natively available.
if (typeof globalThis.URLSearchParams === "undefined") {
	/**
	 * A simple polyfill for URLSearchParams.
	 * @constructor
	 * @param {string|object} init A URL query string or an object of key/value pairs.
	 */
	class URLSearchParams {
		constructor(init) {
			this._params = {};

			if (typeof init === "string") {
				if (init.indexOf("?") === 0) {
					init = init.substring(1);
				}
				const pairs = init.split("&");
				for (let i = 0; i < pairs.length; i++) {
					if (!pairs[i]) continue;
					const split = pairs[i].split("=");
					const key = decodeURIComponent(split[0]);
					const value =
						split.length > 1 ? decodeURIComponent(split[1]) : "";
					this.append(key, value);
				}
			} else if (init && typeof init === "object") {
				for (const key in init) {
					if (init.hasOwnProperty(key)) {
						this.append(key, init[key]);
					}
				}
			}
		}

		append(name, value) {
			if (this._params[name] === undefined) {
				this._params[name] = [];
			}
			this._params[name].push(String(value));
		}

		delete(name) {
			delete this._params[name];
		}

		get(name) {
			return this._params[name] ? this._params[name][0] : null;
		}

		getAll(name) {
			return this._params[name] ? this._params[name].slice(0) : [];
		}

		has(name) {
			return Object.prototype.hasOwnProperty.call(this._params, name);
		}

		set(name, value) {
			this._params[name] = [String(value)];
		}

		toString() {
			const pairs = [];
			for (const name in this._params) {
				if (this._params.hasOwnProperty(name)) {
					const encodedName = encodeURIComponent(name);
					this._params[name].forEach(function (value) {
						pairs.push(
							encodedName + "=" + encodeURIComponent(value),
						);
					});
				}
			}
			return pairs.join("&");
		}

		entries() {
			const items = [];
			for (const name in this._params) {
				if (this._params.hasOwnProperty(name)) {
					for (let j = 0; j < this._params[name].length; j++) {
						items.push([name, this._params[name][j]]);
					}
				}
			}
			return items[Symbol.iterator]();
		}
	}

	// Supporting iteration (for-of) if Symbol.iterator exists.
	if (typeof Symbol !== "undefined" && Symbol.iterator) {
		URLSearchParams.prototype[Symbol.iterator] =
			URLSearchParams.prototype.entries;
	}

	// Expose the polyfilled API on globalThis.
	globalThis.URLSearchParams = URLSearchParams;
}
