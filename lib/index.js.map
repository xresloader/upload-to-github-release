module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
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
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(325);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = withDefaults

const graphql = __webpack_require__(500)

function withDefaults (request, newDefaults) {
  const newRequest = request.defaults(newDefaults)
  const newApi = function (query, options) {
    return graphql(newRequest, query, options)
  }

  newApi.defaults = withDefaults.bind(null, newRequest)
  return newApi
}


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const macosRelease = __webpack_require__(118);
const winRelease = __webpack_require__(49);

const osName = (platform, release) => {
	if (!platform && release) {
		throw new Error('You can\'t specify a `release` without specifying `platform`');
	}

	platform = platform || os.platform();

	let id;

	if (platform === 'darwin') {
		if (!release && os.platform() === 'darwin') {
			release = os.release();
		}

		const prefix = release ? (Number(release.split('.')[0]) > 15 ? 'macOS' : 'OS X') : 'macOS';
		id = release ? macosRelease(release).name : '';
		return prefix + (id ? ' ' + id : '');
	}

	if (platform === 'linux') {
		if (!release && os.platform() === 'linux') {
			release = os.release();
		}

		id = release ? release.replace(/^(\d+\.\d+).*/, '$1') : '';
		return 'Linux' + (id ? ' ' + id : '');
	}

	if (platform === 'win32') {
		if (!release && os.platform() === 'win32') {
			release = os.release();
		}

		id = release ? winRelease(release) : '';
		return 'Windows' + (id ? ' ' + id : '');
	}

	return platform;
};

module.exports = osName;


/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = iterator

const normalizePaginatedListResponse = __webpack_require__(301)

function iterator (octokit, options) {
  const headers = options.headers
  let url = octokit.request.endpoint(options).url

  return {
    [Symbol.asyncIterator]: () => ({
      next () {
        if (!url) {
          return Promise.resolve({ done: true })
        }

        return octokit.request({ url, headers })

          .then((response) => {
            normalizePaginatedListResponse(octokit, url, response)

            // `response.headers.link` format:
            // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
            // sets `url` to undefined if "next" URL is not present or `link` header is not set
            url = ((response.headers.link || '').match(/<([^>]+)>;\s*rel="next"/) || [])[1]

            return { value: response }
          })
      }
    })
  }
}


/***/ }),
/* 9 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(969);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		if (readable && !(rs && rs.ended)) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && ws.ended)) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),
/* 10 */,
/* 11 */
/***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function() {

eval("require")("encoding");


/***/ }),
/* 19 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin

const { Deprecation } = __webpack_require__(692)
const once = __webpack_require__(969)

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation))

const authenticate = __webpack_require__(674)
const beforeRequest = __webpack_require__(471)
const requestError = __webpack_require__(349)

function authenticationPlugin (octokit, options) {
  if (options.auth) {
    octokit.authenticate = () => {
      deprecateAuthenticate(octokit.log, new Deprecation('[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'))
    }
    return
  }
  const state = {
    octokit,
    auth: false
  }
  octokit.authenticate = authenticate.bind(null, state)
  octokit.hook.before('request', beforeRequest.bind(null, state))
  octokit.hook.error('request', requestError.bind(null, state))
}


/***/ }),
/* 20 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const cp = __webpack_require__(129);
const parse = __webpack_require__(568);
const enoent = __webpack_require__(881);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */
/***/ (function(module) {

module.exports = require("https");

/***/ }),
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */
/***/ (function(module) {

"use strict";

module.exports = opts => {
	opts = opts || {};

	const env = opts.env || process.env;
	const platform = opts.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(env).find(x => x.toUpperCase() === 'PATH') || 'Path';
};


/***/ }),
/* 40 */,
/* 41 */,
/* 42 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const merge2 = __webpack_require__(538);
function merge(streams) {
    const mergedStream = merge2(streams);
    streams.forEach((stream) => {
        stream.once('error', (err) => mergedStream.emit('error', err));
    });
    return mergedStream;
}
exports.merge = merge;


/***/ }),
/* 43 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DirentFromStats {
    constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
}
function createDirentFromStats(name, stats) {
    return new DirentFromStats(name, stats);
}
exports.createDirentFromStats = createDirentFromStats;


/***/ }),
/* 44 */,
/* 45 */,
/* 46 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getUserAgentNode

const osName = __webpack_require__(2)

function getUserAgentNode () {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return 'Windows <version undetectable>'
    }

    throw error
  }
}


/***/ }),
/* 47 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = factory

const Octokit = __webpack_require__(402)
const registerPlugin = __webpack_require__(855)

function factory (plugins) {
  const Api = Octokit.bind(null, plugins || [])
  Api.plugin = registerPlugin.bind(null, plugins || [])
  return Api
}


/***/ }),
/* 48 */,
/* 49 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const execa = __webpack_require__(955);

// Reference: https://www.gaijin.at/en/lstwinver.php
const names = new Map([
	['10.0', '10'],
	['6.3', '8.1'],
	['6.2', '8'],
	['6.1', '7'],
	['6.0', 'Vista'],
	['5.2', 'Server 2003'],
	['5.1', 'XP'],
	['5.0', '2000'],
	['4.9', 'ME'],
	['4.1', '98'],
	['4.0', '95']
]);

const windowsRelease = release => {
	const version = /\d+\.\d/.exec(release || os.release());

	if (release && !version) {
		throw new Error('`release` argument doesn\'t match `n.n`');
	}

	const ver = (version || [])[0];

	// Server 2008, 2012 and 2016 versions are ambiguous with desktop versions and must be detected at runtime.
	// If `release` is omitted or we're on a Windows system, and the version number is an ambiguous version
	// then use `wmic` to get the OS caption: https://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
	// If the resulting caption contains the year 2008, 2012 or 2016, it is a server version, so return a server OS name.
	if ((!release || release === os.release()) && ['6.1', '6.2', '6.3', '10.0'].includes(ver)) {
		const stdout = execa.sync('wmic', ['os', 'get', 'Caption']).stdout || '';
		const year = (stdout.match(/2008|2012|2016/) || [])[0];
		if (year) {
			return `Server ${year}`;
		}
	}

	return names.get(ver);
};

module.exports = windowsRelease;


/***/ }),
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const util = __webpack_require__(669);
const braces = __webpack_require__(783);
const picomatch = __webpack_require__(827);
const utils = __webpack_require__(224);
const isEmptyString = val => typeof val === 'string' && (val === '' || val === './');

/**
 * Returns an array of strings that match one or more glob patterns.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm(list, patterns[, options]);
 *
 * console.log(mm(['a.js', 'a.txt'], ['*.js']));
 * //=> [ 'a.js' ]
 * ```
 * @param {String|Array<string>} list List of strings to match.
 * @param {String|Array<string>} patterns One or more glob patterns to use for matching.
 * @param {Object} options See available [options](#options)
 * @return {Array} Returns an array of matches
 * @summary false
 * @api public
 */

const micromatch = (list, patterns, options) => {
  patterns = [].concat(patterns);
  list = [].concat(list);

  let omit = new Set();
  let keep = new Set();
  let items = new Set();
  let negatives = 0;

  let onResult = state => {
    items.add(state.output);
    if (options && options.onResult) {
      options.onResult(state);
    }
  };

  for (let i = 0; i < patterns.length; i++) {
    let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
    if (negated) negatives++;

    for (let item of list) {
      let matched = isMatch(item, true);

      let match = negated ? !matched.isMatch : matched.isMatch;
      if (!match) continue;

      if (negated) {
        omit.add(matched.output);
      } else {
        omit.delete(matched.output);
        keep.add(matched.output);
      }
    }
  }

  let result = negatives === patterns.length ? [...items] : [...keep];
  let matches = result.filter(item => !omit.has(item));

  if (options && matches.length === 0) {
    if (options.failglob === true) {
      throw new Error(`No matches found for "${patterns.join(', ')}"`);
    }

    if (options.nonull === true || options.nullglob === true) {
      return options.unescape ? patterns.map(p => p.replace(/\\/g, '')) : patterns;
    }
  }

  return matches;
};

/**
 * Backwards compatibility
 */

micromatch.match = micromatch;

/**
 * Returns a matcher function from the given glob `pattern` and `options`.
 * The returned function takes a string to match as its only argument and returns
 * true if the string is a match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matcher(pattern[, options]);
 *
 * const isMatch = mm.matcher('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @param {String} `pattern` Glob pattern
 * @param {Object} `options`
 * @return {Function} Returns a matcher function.
 * @api public
 */

micromatch.matcher = (pattern, options) => picomatch(pattern, options);

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.isMatch(string, patterns[, options]);
 *
 * console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(mm.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Backwards compatibility
 */

micromatch.any = micromatch.isMatch;

/**
 * Returns a list of strings that _**do not match any**_ of the given `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.not(list, patterns[, options]);
 *
 * console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
 * //=> ['b.b', 'c.c']
 * ```
 * @param {Array} `list` Array of strings to match.
 * @param {String|Array} `patterns` One or more glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of strings that **do not match** the given patterns.
 * @api public
 */

micromatch.not = (list, patterns, options = {}) => {
  patterns = [].concat(patterns).map(String);
  let result = new Set();
  let items = [];

  let onResult = state => {
    if (options.onResult) options.onResult(state);
    items.push(state.output);
  };

  let matches = micromatch(list, patterns, { ...options, onResult });

  for (let item of items) {
    if (!matches.includes(item)) {
      result.add(item);
    }
  }
  return [...result];
};

/**
 * Returns true if the given `string` contains the given pattern. Similar
 * to [.isMatch](#isMatch) but the pattern can match any part of the string.
 *
 * ```js
 * var mm = require('micromatch');
 * // mm.contains(string, pattern[, options]);
 *
 * console.log(mm.contains('aa/bb/cc', '*b'));
 * //=> true
 * console.log(mm.contains('aa/bb/cc', '*d'));
 * //=> false
 * ```
 * @param {String} `str` The string to match.
 * @param {String|Array} `patterns` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if the patter matches any part of `str`.
 * @api public
 */

micromatch.contains = (str, pattern, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
  }

  if (Array.isArray(pattern)) {
    return pattern.some(p => micromatch.contains(str, p, options));
  }

  if (typeof pattern === 'string') {
    if (isEmptyString(str) || isEmptyString(pattern)) {
      return false;
    }

    if (str.includes(pattern) || (str.startsWith('./') && str.slice(2).includes(pattern))) {
      return true;
    }
  }

  return micromatch.isMatch(str, pattern, { ...options, contains: true });
};

/**
 * Filter the keys of the given object with the given `glob` pattern
 * and `options`. Does not attempt to match nested keys. If you need this feature,
 * use [glob-object][] instead.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matchKeys(object, patterns[, options]);
 *
 * const obj = { aa: 'a', ab: 'b', ac: 'c' };
 * console.log(mm.matchKeys(obj, '*b'));
 * //=> { ab: 'b' }
 * ```
 * @param {Object} `object` The object with keys to filter.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Object} Returns an object with only keys that match the given patterns.
 * @api public
 */

micromatch.matchKeys = (obj, patterns, options) => {
  if (!utils.isObject(obj)) {
    throw new TypeError('Expected the first argument to be an object');
  }
  let keys = micromatch(Object.keys(obj), patterns, options);
  let res = {};
  for (let key of keys) res[key] = obj[key];
  return res;
};

/**
 * Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.some(list, patterns[, options]);
 *
 * console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // true
 * console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.some = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern), options);
    if (items.some(item => isMatch(item))) {
      return true;
    }
  }
  return false;
};

/**
 * Returns true if every string in the given `list` matches
 * any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.every(list, patterns[, options]);
 *
 * console.log(mm.every('foo.js', ['foo.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // false
 * console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.every = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern), options);
    if (!items.every(item => isMatch(item))) {
      return false;
    }
  }
  return true;
};

/**
 * Returns true if **all** of the given `patterns` match
 * the specified string.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.all(string, patterns[, options]);
 *
 * console.log(mm.all('foo.js', ['foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', '!foo.js']));
 * // false
 *
 * console.log(mm.all('foo.js', ['*.js', 'foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
 * // true
 * ```
 * @param {String|Array} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.all = (str, patterns, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
  }

  return [].concat(patterns).every(p => picomatch(p, options)(str));
};

/**
 * Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.capture(pattern, string[, options]);
 *
 * console.log(mm.capture('test/*.js', 'test/foo.js'));
 * //=> ['foo']
 * console.log(mm.capture('test/*.js', 'foo/bar.css'));
 * //=> null
 * ```
 * @param {String} `glob` Glob pattern to use for matching.
 * @param {String} `input` String to match
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
 * @api public
 */

micromatch.capture = (glob, input, options) => {
  let posix = utils.isWindows(options);
  let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
  let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);

  if (match) {
    return match.slice(1).map(v => v === void 0 ? '' : v);
  }
};

/**
 * Create a regular expression from the given glob `pattern`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.makeRe(pattern[, options]);
 *
 * console.log(mm.makeRe('*.js'));
 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
 * ```
 * @param {String} `pattern` A glob pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

micromatch.makeRe = (...args) => picomatch.makeRe(...args);

/**
 * Scan a glob pattern to separate the pattern into segments. Used
 * by the [split](#split) method.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm.scan(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

micromatch.scan = (...args) => picomatch.scan(...args);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm(pattern[, options]);
 * ```
 * @param {String} `glob`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as regex source string.
 * @api public
 */

micromatch.parse = (patterns, options) => {
  let res = [];
  for (let pattern of [].concat(patterns || [])) {
    for (let str of braces(String(pattern), options)) {
      res.push(picomatch.parse(str, options));
    }
  }
  return res;
};

/**
 * Process the given brace `pattern`.
 *
 * ```js
 * const { braces } = require('micromatch');
 * console.log(braces('foo/{a,b,c}/bar'));
 * //=> [ 'foo/(a|b|c)/bar' ]
 *
 * console.log(braces('foo/{a,b,c}/bar', { expand: true }));
 * //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
 * ```
 * @param {String} `pattern` String with brace pattern to process.
 * @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
 * @return {Array}
 * @api public
 */

micromatch.braces = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  if ((options && options.nobrace === true) || !/\{.*\}/.test(pattern)) {
    return [pattern];
  }
  return braces(pattern, options);
};

/**
 * Expand braces
 */

micromatch.braceExpand = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  return micromatch.braces(pattern, { ...options, expand: true });
};

/**
 * Expose micromatch
 */

module.exports = micromatch;


/***/ }),
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sync_1 = __webpack_require__(519);
const provider_1 = __webpack_require__(589);
class ProviderSync extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new sync_1.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = this.api(root, task, options);
        return entries.map(options.transform);
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderSync;


/***/ }),
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */
/***/ (function(module) {

module.exports = require("os");

/***/ }),
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __webpack_require__(622)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(306)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(858);
const constants_1 = __webpack_require__(171);
const utils = __webpack_require__(933);
function read(dir, settings) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(dir, settings);
    }
    return readdir(dir, settings);
}
exports.read = read;
function readdirWithFileTypes(dir, settings) {
    const dirents = settings.fs.readdirSync(dir, { withFileTypes: true });
    return dirents.map((dirent) => {
        const entry = {
            dirent,
            name: dirent.name,
            path: `${dir}${settings.pathSegmentSeparator}${dirent.name}`
        };
        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
            try {
                const stats = settings.fs.statSync(entry.path);
                entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
            }
            catch (error) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    throw error;
                }
            }
        }
        return entry;
    });
}
exports.readdirWithFileTypes = readdirWithFileTypes;
function readdir(dir, settings) {
    const names = settings.fs.readdirSync(dir);
    return names.map((name) => {
        const entryPath = `${dir}${settings.pathSegmentSeparator}${name}`;
        const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
        const entry = {
            name,
            path: entryPath,
            dirent: utils.fs.createDirentFromStats(name, stats)
        };
        if (settings.stats) {
            entry.stats = stats;
        }
        return entry;
    });
}
exports.readdir = readdir;


/***/ }),
/* 112 */,
/* 113 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(608);
const provider_1 = __webpack_require__(589);
class ProviderAsync extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new stream_1.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = [];
        return new Promise((resolve, reject) => {
            const stream = this.api(root, task, options);
            stream.once('error', reject);
            stream.on('data', (entry) => entries.push(options.transform(entry)));
            stream.once('end', () => resolve(entries));
        });
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderAsync;


/***/ }),
/* 114 */,
/* 115 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isEnoentCodeError(error) {
    return error.code === 'ENOENT';
}
exports.isEnoentCodeError = isEnoentCodeError;


/***/ }),
/* 116 */,
/* 117 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __webpack_require__(622);
var isWindows = process.platform === 'win32';
var fs = __webpack_require__(747);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),
/* 118 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);

const nameMap = new Map([
	[19, 'Catalina'],
	[18, 'Mojave'],
	[17, 'High Sierra'],
	[16, 'Sierra'],
	[15, 'El Capitan'],
	[14, 'Yosemite'],
	[13, 'Mavericks'],
	[12, 'Mountain Lion'],
	[11, 'Lion'],
	[10, 'Snow Leopard'],
	[9, 'Leopard'],
	[8, 'Tiger'],
	[7, 'Panther'],
	[6, 'Jaguar'],
	[5, 'Puma']
]);

const macosRelease = release => {
	release = Number((release || os.release()).split('.')[0]);
	return {
		name: nameMap.get(release),
		version: '10.' + (release - 4)
	};
};

module.exports = macosRelease;
// TODO: remove this in the next major version
module.exports.default = macosRelease;


/***/ }),
/* 119 */,
/* 120 */
/***/ (function(module, __unusedexports, __webpack_require__) {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var fs = __webpack_require__(747)
var rp = __webpack_require__(302)
var minimatch = __webpack_require__(93)
var Minimatch = minimatch.Minimatch
var inherits = __webpack_require__(689)
var EE = __webpack_require__(614).EventEmitter
var path = __webpack_require__(622)
var assert = __webpack_require__(357)
var isAbsolute = __webpack_require__(681)
var globSync = __webpack_require__(245)
var common = __webpack_require__(856)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __webpack_require__(634)
var util = __webpack_require__(669)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __webpack_require__(969)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    Set = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = uniq;


/***/ }),
/* 127 */,
/* 128 */,
/* 129 */
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = withAuthorizationPrefix

const atob = __webpack_require__(368)

const REGEX_IS_BASIC_AUTH = /^[\w-]+:/

function withAuthorizationPrefix (authorization) {
  if (/^(basic|bearer|token) /i.test(authorization)) {
    return authorization
  }

  try {
    if (REGEX_IS_BASIC_AUTH.test(atob(authorization))) {
      return `basic ${authorization}`
    }
  } catch (error) { }

  if (authorization.split(/\./).length === 3) {
    return `bearer ${authorization}`
  }

  return `token ${authorization}`
}


/***/ }),
/* 144 */,
/* 145 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const pump = __webpack_require__(453);
const bufferStream = __webpack_require__(966);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = Object.assign({maxBuffer: Infinity}, options);

	const {maxBuffer} = options;

	let stream;
	return new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream.getBufferedValue();
			}
			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	}).then(() => stream.getBufferedValue());
}

module.exports = getStream;
module.exports.buffer = (stream, options) => getStream(stream, Object.assign({}, options, {encoding: 'buffer'}));
module.exports.array = (stream, options) => getStream(stream, Object.assign({}, options, {array: true}));
module.exports.MaxBufferError = MaxBufferError;


/***/ }),
/* 146 */,
/* 147 */,
/* 148 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginatePlugin

const iterator = __webpack_require__(8)
const paginate = __webpack_require__(807)

function paginatePlugin (octokit) {
  octokit.paginate = paginate.bind(null, octokit)
  octokit.paginate.iterator = iterator.bind(null, octokit)
}


/***/ }),
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */
/***/ (function(module) {

"use strict";


module.exports = {
  MAX_LENGTH: 1024 * 64,

  // Digits
  CHAR_0: '0', /* 0 */
  CHAR_9: '9', /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 'A', /* A */
  CHAR_LOWERCASE_A: 'a', /* a */
  CHAR_UPPERCASE_Z: 'Z', /* Z */
  CHAR_LOWERCASE_Z: 'z', /* z */

  CHAR_LEFT_PARENTHESES: '(', /* ( */
  CHAR_RIGHT_PARENTHESES: ')', /* ) */

  CHAR_ASTERISK: '*', /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: '&', /* & */
  CHAR_AT: '@', /* @ */
  CHAR_BACKSLASH: '\\', /* \ */
  CHAR_BACKTICK: '`', /* ` */
  CHAR_CARRIAGE_RETURN: '\r', /* \r */
  CHAR_CIRCUMFLEX_ACCENT: '^', /* ^ */
  CHAR_COLON: ':', /* : */
  CHAR_COMMA: ',', /* , */
  CHAR_DOLLAR: '$', /* . */
  CHAR_DOT: '.', /* . */
  CHAR_DOUBLE_QUOTE: '"', /* " */
  CHAR_EQUAL: '=', /* = */
  CHAR_EXCLAMATION_MARK: '!', /* ! */
  CHAR_FORM_FEED: '\f', /* \f */
  CHAR_FORWARD_SLASH: '/', /* / */
  CHAR_HASH: '#', /* # */
  CHAR_HYPHEN_MINUS: '-', /* - */
  CHAR_LEFT_ANGLE_BRACKET: '<', /* < */
  CHAR_LEFT_CURLY_BRACE: '{', /* { */
  CHAR_LEFT_SQUARE_BRACKET: '[', /* [ */
  CHAR_LINE_FEED: '\n', /* \n */
  CHAR_NO_BREAK_SPACE: '\u00A0', /* \u00A0 */
  CHAR_PERCENT: '%', /* % */
  CHAR_PLUS: '+', /* + */
  CHAR_QUESTION_MARK: '?', /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: '>', /* > */
  CHAR_RIGHT_CURLY_BRACE: '}', /* } */
  CHAR_RIGHT_SQUARE_BRACKET: ']', /* ] */
  CHAR_SEMICOLON: ';', /* ; */
  CHAR_SINGLE_QUOTE: '\'', /* ' */
  CHAR_SPACE: ' ', /*   */
  CHAR_TAB: '\t', /* \t */
  CHAR_UNDERSCORE: '_', /* _ */
  CHAR_VERTICAL_LINE: '|', /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */
};


/***/ }),
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {Transform} = __webpack_require__(413);

class ObjectTransform extends Transform {
	constructor() {
		super({
			objectMode: true
		});
	}
}

class FilterStream extends ObjectTransform {
	constructor(filter) {
		super();
		this._filter = filter;
	}

	_transform(data, encoding, callback) {
		if (this._filter(data)) {
			this.push(data);
		}

		callback();
	}
}

class UniqueStream extends ObjectTransform {
	constructor() {
		super();
		this._pushed = new Set();
	}

	_transform(data, encoding, callback) {
		if (!this._pushed.has(data)) {
			this.push(data);
			this._pushed.add(data);
		}

		callback();
	}
}

module.exports = {
	FilterStream,
	UniqueStream
};


/***/ }),
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */
/***/ (function(module) {

"use strict";

const alias = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => alias.some(x => Boolean(opts[x]));

module.exports = opts => {
	if (!opts) {
		return null;
	}

	if (opts.stdio && hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${alias.map(x => `\`${x}\``).join(', ')}`);
	}

	if (typeof opts.stdio === 'string') {
		return opts.stdio;
	}

	const stdio = opts.stdio || [];

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const result = [];
	const len = Math.max(stdio.length, alias.length);

	for (let i = 0; i < len; i++) {
		let value = null;

		if (stdio[i] !== undefined) {
			value = stdio[i];
		} else if (opts[alias[i]] !== undefined) {
			value = opts[alias[i]];
		}

		result[i] = value;
	}

	return result;
};


/***/ }),
/* 169 */,
/* 170 */,
/* 171 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const NODE_PROCESS_VERSION_PARTS = process.versions.node.split('.');
const MAJOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
const MINOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
/**
 * IS `true` for Node.js 10.10 and greater.
 */
exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = MAJOR_VERSION > 10 || (MAJOR_VERSION === 10 && MINOR_VERSION >= 10);


/***/ }),
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(858);
const rpl = __webpack_require__(885);
const constants_1 = __webpack_require__(171);
const utils = __webpack_require__(933);
function read(dir, settings, callback) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(dir, settings, callback);
    }
    return readdir(dir, settings, callback);
}
exports.read = read;
function readdirWithFileTypes(dir, settings, callback) {
    settings.fs.readdir(dir, { withFileTypes: true }, (readdirError, dirents) => {
        if (readdirError) {
            return callFailureCallback(callback, readdirError);
        }
        const entries = dirents.map((dirent) => ({
            dirent,
            name: dirent.name,
            path: `${dir}${settings.pathSegmentSeparator}${dirent.name}`
        }));
        if (!settings.followSymbolicLinks) {
            return callSuccessCallback(callback, entries);
        }
        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
        rpl(tasks, (rplError, rplEntries) => {
            if (rplError) {
                return callFailureCallback(callback, rplError);
            }
            callSuccessCallback(callback, rplEntries);
        });
    });
}
exports.readdirWithFileTypes = readdirWithFileTypes;
function makeRplTaskEntry(entry, settings) {
    return (done) => {
        if (!entry.dirent.isSymbolicLink()) {
            return done(null, entry);
        }
        settings.fs.stat(entry.path, (statError, stats) => {
            if (statError) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    return done(statError);
                }
                return done(null, entry);
            }
            entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
            return done(null, entry);
        });
    };
}
function readdir(dir, settings, callback) {
    settings.fs.readdir(dir, (readdirError, names) => {
        if (readdirError) {
            return callFailureCallback(callback, readdirError);
        }
        const filepaths = names.map((name) => `${dir}${settings.pathSegmentSeparator}${name}`);
        const tasks = filepaths.map((filepath) => {
            return (done) => fsStat.stat(filepath, settings.fsStatSettings, done);
        });
        rpl(tasks, (rplError, results) => {
            if (rplError) {
                return callFailureCallback(callback, rplError);
            }
            const entries = [];
            for (let index = 0; index < names.length; index++) {
                const name = names[index];
                const stats = results[index];
                const entry = {
                    name,
                    path: filepaths[index],
                    dirent: utils.fs.createDirentFromStats(name, stats)
                };
                if (settings.stats) {
                    entry.stats = stats;
                }
                entries.push(entry);
            }
            callSuccessCallback(callback, entries);
        });
    });
}
exports.readdir = readdir;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, result) {
    callback(null, result);
}


/***/ }),
/* 183 */,
/* 184 */
/***/ (function(module) {

"use strict";

module.exports = path => {
	const isExtendedLengthPath = /^\\\\\?\\/.test(path);
	const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

	if (isExtendedLengthPath || hasNonAscii) {
		return path;
	}

	return path.replace(/\\/g, '/');
};


/***/ }),
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin

const beforeRequest = __webpack_require__(863)
const requestError = __webpack_require__(293)
const validate = __webpack_require__(954)

function authenticationPlugin (octokit, options) {
  if (!options.auth) {
    return
  }

  validate(options.auth)

  const state = {
    octokit,
    auth: options.auth
  }

  octokit.hook.before('request', beforeRequest.bind(null, state))
  octokit.hook.error('request', requestError.bind(null, state))
}


/***/ }),
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),
/* 198 */,
/* 199 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

module.exports = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHAR: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  SEP: path.sep,

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};


/***/ }),
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DirentFromStats {
    constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
}
function createDirentFromStats(name, stats) {
    return new DirentFromStats(name, stats);
}
exports.createDirentFromStats = createDirentFromStats;


/***/ }),
/* 211 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(2));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    throw error;
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */
/***/ (function(module) {

module.exports = {"_args":[["@octokit/rest@16.28.9","/data/workspace/xresloader/upload-to-github-release"]],"_from":"@octokit/rest@16.28.9","_id":"@octokit/rest@16.28.9","_inBundle":false,"_integrity":"sha512-IKGnX+Tvzt7XHhs8f4ajqxyJvYAMNX5nWfoJm4CQj8LZToMiaJgutf5KxxpxoC3y5w7JTJpW5rnWnF4TsIvCLA==","_location":"/@octokit/rest","_phantomChildren":{"os-name":"3.1.0"},"_requested":{"type":"version","registry":true,"raw":"@octokit/rest@16.28.9","name":"@octokit/rest","escapedName":"@octokit%2frest","scope":"@octokit","rawSpec":"16.28.9","saveSpec":null,"fetchSpec":"16.28.9"},"_requiredBy":["/@actions/github"],"_resolved":"http://mirrors.tencent.com/npm/@octokit%2frest/-/rest-16.28.9.tgz","_spec":"16.28.9","_where":"/data/workspace/xresloader/upload-to-github-release","author":{"name":"Gregor Martynus","url":"https://github.com/gr2m"},"bugs":{"url":"https://github.com/octokit/rest.js/issues"},"bundlesize":[{"path":"./dist/octokit-rest.min.js.gz","maxSize":"33 kB"}],"contributors":[{"name":"Mike de Boer","email":"info@mikedeboer.nl"},{"name":"Fabian Jakobs","email":"fabian@c9.io"},{"name":"Joe Gallo","email":"joe@brassafrax.com"},{"name":"Gregor Martynus","url":"https://github.com/gr2m"}],"dependencies":{"@octokit/request":"^5.0.0","@octokit/request-error":"^1.0.2","atob-lite":"^2.0.0","before-after-hook":"^2.0.0","btoa-lite":"^1.0.0","deprecation":"^2.0.0","lodash.get":"^4.4.2","lodash.set":"^4.3.2","lodash.uniq":"^4.5.0","octokit-pagination-methods":"^1.1.0","once":"^1.4.0","universal-user-agent":"^4.0.0"},"description":"GitHub REST API client for Node.js","devDependencies":{"@gimenete/type-writer":"^0.1.3","@octokit/fixtures-server":"^5.0.1","@octokit/routes":"20.9.2","@types/node":"^12.0.0","bundlesize":"^0.18.0","chai":"^4.1.2","compression-webpack-plugin":"^3.0.0","coveralls":"^3.0.0","glob":"^7.1.2","http-proxy-agent":"^2.1.0","lodash.camelcase":"^4.3.0","lodash.merge":"^4.6.1","lodash.upperfirst":"^4.3.1","mkdirp":"^0.5.1","mocha":"^6.0.0","mustache":"^3.0.0","nock":"^10.0.0","npm-run-all":"^4.1.2","nyc":"^14.0.0","prettier":"^1.14.2","proxy":"^0.2.4","semantic-release":"^15.0.0","sinon":"^7.2.4","sinon-chai":"^3.0.0","sort-keys":"^4.0.0","standard":"^14.0.2","string-to-arraybuffer":"^1.0.0","string-to-jsdoc-comment":"^1.0.0","typescript":"^3.3.1","webpack":"^4.0.0","webpack-bundle-analyzer":"^3.0.0","webpack-cli":"^3.0.0"},"files":["index.js","index.d.ts","lib","plugins"],"homepage":"https://github.com/octokit/rest.js#readme","keywords":["octokit","github","rest","api-client"],"license":"MIT","name":"@octokit/rest","nyc":{"ignore":["test"]},"publishConfig":{"access":"public"},"release":{"publish":["@semantic-release/npm",{"path":"@semantic-release/github","assets":["dist/*","!dist/*.map.gz"]}]},"repository":{"type":"git","url":"git+https://github.com/octokit/rest.js.git"},"scripts":{"build":"npm-run-all build:*","build:browser":"npm-run-all build:browser:*","build:browser:development":"webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json","build:browser:production":"webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map","build:ts":"node scripts/generate-types","coverage":"nyc report --reporter=html && open coverage/index.html","generate-bundle-report":"webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html","generate-routes":"node scripts/generate-routes","postvalidate:ts":"tsc --noEmit --target es6 test/typescript-validate.ts","prebuild:browser":"mkdirp dist/","pretest":"standard","prevalidate:ts":"npm run -s build:ts","start-fixtures-server":"octokit-fixtures-server","test":"nyc mocha test/mocha-node-setup.js \"test/*/**/*-test.js\"","test:browser":"cypress run --browser chrome","test:memory":"mocha test/memory-test","validate:ts":"tsc --target es6 --noImplicitAny index.d.ts"},"standard":{"globals":["describe","before","beforeEach","afterEach","after","it","expect","cy"],"ignore":["/docs"]},"types":"index.d.ts","version":"16.28.9"};

/***/ }),
/* 216 */,
/* 217 */
/***/ (function(module) {

"use strict";


/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);

  for (var i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }

  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * If a type declares an extension that has already been defined, an error will
 * be thrown.  To suppress this error and force the extension to be associated
 * with the new type, pass `force`=true.  Alternatively, you may prefix the
 * extension with "*" to map the type to extension, without mapping the
 * extension to the type.
 *
 * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
 *
 *
 * @param map (Object) type definitions
 * @param force (Boolean) if true, force overriding of existing definitions
 */
Mime.prototype.define = function(typeMap, force) {
  for (var type in typeMap) {
    var extensions = typeMap[type].map(function(t) {return t.toLowerCase()});
    type = type.toLowerCase();

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];

      // '*' prefix = not the preferred type for this extension.  So fixup the
      // extension, and skip it.
      if (ext[0] == '*') {
        continue;
      }

      if (!force && (ext in this._types)) {
        throw new Error(
          'Attempt to change mapping for "' + ext +
          '" extension from "' + this._types[ext] + '" to "' + type +
          '". Pass `force=true` to allow this, otherwise remove "' + ext +
          '" from the list of extensions for "' + type + '".'
        );
      }

      this._types[ext] = type;
    }

    // Use first extension as default
    if (force || !this._extensions[type]) {
      var ext = extensions[0];
      this._extensions[type] = (ext[0] != '*') ? ext : ext.substr(1)
    }
  }
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.getType = function(path) {
  path = String(path);
  var last = path.replace(/^.*[/\\]/, '').toLowerCase();
  var ext = last.replace(/^.*\./, '').toLowerCase();

  var hasPath = last.length < path.length;
  var hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && this._types[ext] || null;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};

module.exports = Mime;


/***/ }),
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const win32 = process.platform === 'win32';
const {
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL,
  REGEX_REMOVE_BACKSLASH
} = __webpack_require__(199);

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(/\\/g, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
}

exports.supportsLookbehinds = () => {
  let segs = process.version.slice(1).split('.');
  if (segs.length === 3 && +segs[0] >= 9 || (+segs[0] === 8 && +segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.isWindows = options => {
  if (options && typeof options.windows === 'boolean') {
    return options.windows;
  }
  return win32 === true || path.sep === '\\';
};

exports.escapeLast = (input, char, lastIdx) => {
  let idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return input.slice(0, idx) + '\\' + input.slice(idx);
};


/***/ }),
/* 225 */
/***/ (function(__unusedmodule, exports) {

"use strict";


exports.isInteger = num => {
  if (typeof num === 'number') {
    return Number.isInteger(num);
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isInteger(Number(num));
  }
  return false;
};

/**
 * Find a node of the given type
 */

exports.find = (node, type) => node.nodes.find(node => node.type === type);

/**
 * Find a node of the given type
 */

exports.exceedsLimit = (min, max, step = 1, limit) => {
  if (limit === false) return false;
  if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
  return ((Number(max) - Number(min)) / Number(step)) >= limit;
};

/**
 * Escape the given node with '\\' before node.value
 */

exports.escapeNode = (block, n = 0, type) => {
  let node = block.nodes[n];
  if (!node) return;

  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
    if (node.escaped !== true) {
      node.value = '\\' + node.value;
      node.escaped = true;
    }
  }
};

/**
 * Returns true if the given brace node should be enclosed in literal braces
 */

exports.encloseBrace = node => {
  if (node.type !== 'brace') return false;
  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
    node.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a brace node is invalid.
 */

exports.isInvalidBrace = block => {
  if (block.type !== 'brace') return false;
  if (block.invalid === true || block.dollar) return true;
  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
    block.invalid = true;
    return true;
  }
  if (block.open !== true || block.close !== true) {
    block.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a node is an open or close node
 */

exports.isOpenOrClose = node => {
  if (node.type === 'open' || node.type === 'close') {
    return true;
  }
  return node.open === true || node.close === true;
};

/**
 * Reduce an array of text nodes.
 */

exports.reduce = nodes => nodes.reduce((acc, node) => {
  if (node.type === 'text') acc.push(node.value);
  if (node.type === 'range') node.type = 'text';
  return acc;
}, []);

/**
 * Flatten an array
 */

exports.flatten = (...args) => {
  const result = [];
  const flat = arr => {
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i];
      Array.isArray(ele) ? flat(ele, result) : ele !== void 0 && result.push(ele);
    }
    return result;
  };
  flat(args);
  return result;
};


/***/ }),
/* 226 */,
/* 227 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const stringify = __webpack_require__(382);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  CHAR_BACKSLASH, /* \ */
  CHAR_BACKTICK, /* ` */
  CHAR_COMMA, /* , */
  CHAR_DOT, /* . */
  CHAR_LEFT_PARENTHESES, /* ( */
  CHAR_RIGHT_PARENTHESES, /* ) */
  CHAR_LEFT_CURLY_BRACE, /* { */
  CHAR_RIGHT_CURLY_BRACE, /* } */
  CHAR_LEFT_SQUARE_BRACKET, /* [ */
  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
  CHAR_DOUBLE_QUOTE, /* " */
  CHAR_SINGLE_QUOTE, /* ' */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = __webpack_require__(154);

/**
 * parse
 */

const parse = (input, options = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  let opts = options || {};
  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  if (input.length > max) {
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
  }

  let ast = { type: 'root', input, nodes: [] };
  let stack = [ast];
  let block = ast;
  let prev = ast;
  let brackets = 0;
  let length = input.length;
  let index = 0;
  let depth = 0;
  let value;
  let memo = {};

  /**
   * Helpers
   */

  const advance = () => input[index++];
  const push = node => {
    if (node.type === 'text' && prev.type === 'dot') {
      prev.type = 'text';
    }

    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };

  push({ type: 'bos' });

  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();

    /**
     * Invalid chars
     */

    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }

    /**
     * Escaped chars
     */

    if (value === CHAR_BACKSLASH) {
      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
      continue;
    }

    /**
     * Right square bracket (literal): ']'
     */

    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
      push({ type: 'text', value: '\\' + value });
      continue;
    }

    /**
     * Left square bracket: '['
     */

    if (value === CHAR_LEFT_SQUARE_BRACKET) {
      brackets++;

      let closed = true;
      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          continue;
        }

        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          brackets--;

          if (brackets === 0) {
            break;
          }
        }
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Parentheses
     */

    if (value === CHAR_LEFT_PARENTHESES) {
      block = push({ type: 'paren', nodes: [] });
      stack.push(block);
      push({ type: 'text', value });
      continue;
    }

    if (value === CHAR_RIGHT_PARENTHESES) {
      if (block.type !== 'paren') {
        push({ type: 'text', value });
        continue;
      }
      block = stack.pop();
      push({ type: 'text', value });
      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Quotes: '|"|`
     */

    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      let open = value;
      let next;

      if (options.keepQuotes !== true) {
        value = '';
      }

      while (index < length && (next = advance())) {
        if (next === CHAR_BACKSLASH) {
          value += next + advance();
          continue;
        }

        if (next === open) {
          if (options.keepQuotes === true) value += next;
          break;
        }

        value += next;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Left curly brace: '{'
     */

    if (value === CHAR_LEFT_CURLY_BRACE) {
      depth++;

      let dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
      let brace = {
        type: 'brace',
        open: true,
        close: false,
        dollar,
        depth,
        commas: 0,
        ranges: 0,
        nodes: []
      };

      block = push(brace);
      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    /**
     * Right curly brace: '}'
     */

    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (block.type !== 'brace') {
        push({ type: 'text', value });
        continue;
      }

      let type = 'close';
      block = stack.pop();
      block.close = true;

      push({ type, value });
      depth--;

      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Comma: ','
     */

    if (value === CHAR_COMMA && depth > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        let open = block.nodes.shift();
        block.nodes = [open, { type: 'text', value: stringify(block) }];
      }

      push({ type: 'comma', value });
      block.commas++;
      continue;
    }

    /**
     * Dot: '.'
     */

    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
      let siblings = block.nodes;

      if (depth === 0 || siblings.length === 0) {
        push({ type: 'text', value });
        continue;
      }

      if (prev.type === 'dot') {
        block.range = [];
        prev.value += value;
        prev.type = 'range';

        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = 'text';
          continue;
        }

        block.ranges++;
        block.args = [];
        continue;
      }

      if (prev.type === 'range') {
        siblings.pop();

        let before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }

      push({ type: 'dot', value });
      continue;
    }

    /**
     * Text
     */

    push({ type: 'text', value });
  }

  // Mark imbalanced braces and brackets as invalid
  do {
    block = stack.pop();

    if (block.type !== 'root') {
      block.nodes.forEach(node => {
        if (!node.nodes) {
          if (node.type === 'open') node.isOpen = true;
          if (node.type === 'close') node.isClose = true;
          if (!node.nodes) node.type = 'text';
          node.invalid = true;
        }
      });

      // get the location of the block on parent.nodes (block's siblings)
      let parent = stack[stack.length - 1];
      let index = parent.nodes.indexOf(block);
      // replace the (invalid) block with it's nodes
      parent.nodes.splice(index, 1, ...block.nodes);
    }
  } while (stack.length > 0);

  push({ type: 'eos' });
  return ast;
};

module.exports = parse;


/***/ }),
/* 228 */,
/* 229 */,
/* 230 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var isGlob = __webpack_require__(486);
var pathPosixDirname = __webpack_require__(622).posix.dirname;
var isWin32 = __webpack_require__(87).platform() === 'win32';

var slash = '/';
var backslash = /\\/g;
var enclosure = /[\{\[].*[\/]*.*[\}\]]$/;
var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var escaped = /\\([\*\?\|\[\]\(\)\{\}])/g;

module.exports = function globParent(str) {
  // flip windows path separators
  if (isWin32 && str.indexOf(slash) < 0) {
    str = str.replace(backslash, slash);
  }

  // special case for strings ending in enclosure containing path separator
  if (enclosure.test(str)) {
    str += slash;
  }

  // preserves full path in case of trailing path separator
  str += 'a';

  // remove path parts that are globby
  do {
    str = pathPosixDirname(str);
  } while (isGlob(str) || globby.test(str));

  // remove escape chars and return result
  return str.replace(escaped, '$1');
};


/***/ }),
/* 231 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function flatten(items) {
    return items.reduce((collection, item) => [].concat(collection, item), []);
}
exports.flatten = flatten;


/***/ }),
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __webpack_require__(747)
var rp = __webpack_require__(302)
var minimatch = __webpack_require__(93)
var Minimatch = minimatch.Minimatch
var Glob = __webpack_require__(120).Glob
var util = __webpack_require__(669)
var path = __webpack_require__(622)
var assert = __webpack_require__(357)
var isAbsolute = __webpack_require__(681)
var common = __webpack_require__(856)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),
/* 246 */,
/* 247 */,
/* 248 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = octokitRegisterEndpoints

const registerEndpoints = __webpack_require__(899)

function octokitRegisterEndpoints (octokit) {
  octokit.registerEndpoints = registerEndpoints.bind(null, octokit)
}


/***/ }),
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */
/***/ (function(module, __unusedexports, __webpack_require__) {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = __webpack_require__(357)
var signals = __webpack_require__(654)

var EE = __webpack_require__(614)
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}


/***/ }),
/* 261 */,
/* 262 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(747);
const os_1 = __webpack_require__(87);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                process.stdout.write(`GITHUB_EVENT_PATH ${process.env.GITHUB_EVENT_PATH} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pullRequest || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),
/* 263 */,
/* 264 */,
/* 265 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)
const HttpError = __webpack_require__(297)

function getPage (octokit, link, which, headers) {
  deprecate(`octokit.get${which.charAt(0).toUpperCase() + which.slice(1)}Page() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  const url = getPageLinks(link)[which]

  if (!url) {
    const urlError = new HttpError(`No ${which} page found`, 404)
    return Promise.reject(urlError)
  }

  const requestOptions = {
    url,
    headers: applyAcceptHeader(link, headers)
  }

  const promise = octokit.request(requestOptions)

  return promise
}

function applyAcceptHeader (res, headers) {
  const previous = res.headers && res.headers['x-github-media-type']

  if (!previous || (headers && headers.accept)) {
    return headers
  }
  headers = headers || {}
  headers.accept = 'application/vnd.' + previous
    .replace('; param=', '.')
    .replace('; format=', '+')

  return headers
}


/***/ }),
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */
/***/ (function(module, exports) {

exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var R = 0

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*'
var NUMERICIDENTIFIERLOOSE = R++
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')'

var MAINVERSIONLOOSE = R++
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')'

var PRERELEASEIDENTIFIERLOOSE = R++
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))'

var PRERELEASELOOSE = R++
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?'

src[FULL] = '^' + FULLPLAIN + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?'

var LOOSE = R++
src[LOOSE] = '^' + LOOSEPLAIN + '$'

var GTLT = R++
src[GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
var XRANGEIDENTIFIER = R++
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*'

var XRANGEPLAIN = R++
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?'

var XRANGEPLAINLOOSE = R++
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?'

var XRANGE = R++
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$'
var XRANGELOOSE = R++
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
var COERCE = R++
src[COERCE] = '(?:^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++
src[LONETILDE] = '(?:~>?)'

var TILDETRIM = R++
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+'
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

var TILDE = R++
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$'
var TILDELOOSE = R++
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++
src[LONECARET] = '(?:\\^)'

var CARETTRIM = R++
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+'
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g')
var caretTrimReplace = '$1^'

var CARET = R++
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$'
var CARETLOOSE = R++
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$'
var COMPARATOR = R++
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$'

var HYPHENRANGELOOSE = R++
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
var STAR = R++
src[STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[LOOSE] : re[FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compare(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.rcompare(a, b, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1]
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY) {
    return true
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return thisComparators.every(function (thisComparator) {
      return range.set.some(function (rangeComparators) {
        return rangeComparators.every(function (rangeComparator) {
          return thisComparator.intersects(rangeComparator, options)
        })
      })
    })
  })
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[TILDELOOSE] : re[TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[CARETLOOSE] : re[CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[XRANGELOOSE] : re[XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '')
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  var match = version.match(re[COERCE])

  if (match == null) {
    return null
  }

  return parse(match[1] +
    '.' + (match[2] || '0') +
    '.' + (match[3] || '0'))
}


/***/ }),
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */
/***/ (function(module) {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(614);
const fsScandir = __webpack_require__(661);
const fastq = __webpack_require__(830);
const common = __webpack_require__(617);
const reader_1 = __webpack_require__(962);
class AsyncReader extends reader_1.default {
    constructor(_root, _settings) {
        super(_root, _settings);
        this._settings = _settings;
        this._scandir = fsScandir.scandir;
        this._emitter = new events_1.EventEmitter();
        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
        this._isFatalError = false;
        this._isDestroyed = false;
        this._queue.drain = () => {
            if (!this._isFatalError) {
                this._emitter.emit('end');
            }
        };
    }
    read() {
        this._isFatalError = false;
        this._isDestroyed = false;
        setImmediate(() => {
            this._pushToQueue(this._root, this._settings.basePath);
        });
        return this._emitter;
    }
    destroy() {
        if (this._isDestroyed) {
            throw new Error('The reader is already destroyed');
        }
        this._isDestroyed = true;
        this._queue.killAndDrain();
    }
    onEntry(callback) {
        this._emitter.on('entry', callback);
    }
    onError(callback) {
        this._emitter.once('error', callback);
    }
    onEnd(callback) {
        this._emitter.once('end', callback);
    }
    _pushToQueue(dir, base) {
        const queueItem = { dir, base };
        this._queue.push(queueItem, (error) => {
            if (error) {
                this._handleError(error);
            }
        });
    }
    _worker(item, done) {
        this._scandir(item.dir, this._settings.fsScandirSettings, (error, entries) => {
            if (error) {
                return done(error, undefined);
            }
            for (const entry of entries) {
                this._handleEntry(entry, item.base);
            }
            done(null, undefined);
        });
    }
    _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
            return;
        }
        this._isFatalError = true;
        this._isDestroyed = true;
        this._emitter.emit('error', error);
    }
    _handleEntry(entry, base) {
        if (this._isDestroyed || this._isFatalError) {
            return;
        }
        const fullpath = entry.path;
        if (base !== undefined) {
            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
            this._emitEntry(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
            this._pushToQueue(fullpath, entry.path);
        }
    }
    _emitEntry(entry) {
        this._emitter.emit('entry', entry);
    }
}
exports.default = AsyncReader;


/***/ }),
/* 292 */,
/* 293 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError

const { RequestError } = __webpack_require__(463)

function authenticationRequestError (state, error, options) {
  if (!error.headers) throw error

  const otpRequired = /required/.test(error.headers['x-github-otp'] || '')
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error
  }

  if (error.status === 401 && otpRequired && error.request && error.request.headers['x-github-otp']) {
    if (state.otp) {
      delete state.otp // no longer valid, request again
    } else {
      throw new RequestError('Invalid one-time password for two-factor authentication', 401, {
        headers: error.headers,
        request: options
      })
    }
  }

  if (typeof state.auth.on2fa !== 'function') {
    throw new RequestError('2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication', 401, {
      headers: error.headers,
      request: options
    })
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa()
    })
    .then((oneTimePassword) => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(options.headers, { 'x-github-otp': oneTimePassword })
      })
      return state.octokit.request(newOptions)
        .then(response => {
          // If OTP still valid, then persist it for following requests
          state.otp = oneTimePassword
          return response
        })
    })
}


/***/ }),
/* 294 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = parseOptions

const { Deprecation } = __webpack_require__(692)
const { getUserAgent } = __webpack_require__(619)
const once = __webpack_require__(969)

const pkg = __webpack_require__(215)

const deprecateOptionsTimeout = once((log, deprecation) => log.warn(deprecation))
const deprecateOptionsAgent = once((log, deprecation) => log.warn(deprecation))
const deprecateOptionsHeaders = once((log, deprecation) => log.warn(deprecation))

function parseOptions (options, log, hook) {
  if (options.headers) {
    options.headers = Object.keys(options.headers).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = options.headers[key]
      return newObj
    }, {})
  }

  const clientDefaults = {
    headers: options.headers || {},
    request: options.request || {},
    mediaType: {
      previews: [],
      format: ''
    }
  }

  if (options.baseUrl) {
    clientDefaults.baseUrl = options.baseUrl
  }

  if (options.userAgent) {
    clientDefaults.headers['user-agent'] = options.userAgent
  }

  if (options.previews) {
    clientDefaults.mediaType.previews = options.previews
  }

  if (options.timeout) {
    deprecateOptionsTimeout(log, new Deprecation('[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request'))
    clientDefaults.request.timeout = options.timeout
  }

  if (options.agent) {
    deprecateOptionsAgent(log, new Deprecation('[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request'))
    clientDefaults.request.agent = options.agent
  }

  if (options.headers) {
    deprecateOptionsHeaders(log, new Deprecation('[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request'))
  }

  const userAgentOption = clientDefaults.headers['user-agent']
  const defaultUserAgent = `octokit.js/${pkg.version} ${getUserAgent()}`

  clientDefaults.headers['user-agent'] = [userAgentOption, defaultUserAgent].filter(Boolean).join(' ')

  clientDefaults.request.hook = hook.bind(null, 'request')

  return clientDefaults
}


/***/ }),
/* 295 */,
/* 296 */,
/* 297 */
/***/ (function(module) {

module.exports = class HttpError extends Error {
  constructor (message, code, headers) {
    super(message)

    // Maintains proper stack trace (only available on V8)
    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = 'HttpError'
    this.code = code
    this.headers = headers
  }
}


/***/ }),
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */
/***/ (function(module, __unusedexports, __webpack_require__) {

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint:
 *
 * - https://developer.github.com/v3/search/#example (key `items`)
 * - https://developer.github.com/v3/checks/runs/#response-3 (key: `check_runs`)
 * - https://developer.github.com/v3/checks/suites/#response-1 (key: `check_suites`)
 * - https://developer.github.com/v3/apps/installations/#list-repositories (key: `repositories`)
 * - https://developer.github.com/v3/apps/installations/#list-installations-for-a-user (key `installations`)
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not. For the exceptions with the namespace, a fallback check for the route
 * paths has to be added in order to normalize the response. We cannot check for the total_count
 * property because it also exists in the response of Get the combined status for a specific ref.
 */

module.exports = normalizePaginatedListResponse

const { Deprecation } = __webpack_require__(692)
const once = __webpack_require__(969)

const deprecateIncompleteResults = once((log, deprecation) => log.warn(deprecation))
const deprecateTotalCount = once((log, deprecation) => log.warn(deprecation))
const deprecateNamespace = once((log, deprecation) => log.warn(deprecation))

const REGEX_IS_SEARCH_PATH = /^\/search\//
const REGEX_IS_CHECKS_PATH = /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)/
const REGEX_IS_INSTALLATION_REPOSITORIES_PATH = /^\/installation\/repositories/
const REGEX_IS_USER_INSTALLATIONS_PATH = /^\/user\/installations/

function normalizePaginatedListResponse (octokit, url, response) {
  const path = url.replace(octokit.request.endpoint.DEFAULTS.baseUrl, '')
  if (
    !REGEX_IS_SEARCH_PATH.test(path) &&
    !REGEX_IS_CHECKS_PATH.test(path) &&
    !REGEX_IS_INSTALLATION_REPOSITORIES_PATH.test(path) &&
    !REGEX_IS_USER_INSTALLATIONS_PATH.test(path)
  ) {
    return
  }

  // keep the additional properties intact to avoid a breaking change,
  // but log a deprecation warning when accessed
  const incompleteResults = response.data.incomplete_results
  const repositorySelection = response.data.repository_selection
  const totalCount = response.data.total_count
  delete response.data.incomplete_results
  delete response.data.repository_selection
  delete response.data.total_count

  const namespaceKey = Object.keys(response.data)[0]

  response.data = response.data[namespaceKey]

  Object.defineProperty(response.data, namespaceKey, {
    get () {
      deprecateNamespace(octokit.log, new Deprecation(`[@octokit/rest] "result.data.${namespaceKey}" is deprecated. Use "result.data" instead`))
      return response.data
    }
  })

  if (typeof incompleteResults !== 'undefined') {
    Object.defineProperty(response.data, 'incomplete_results', {
      get () {
        deprecateIncompleteResults(octokit.log, new Deprecation('[@octokit/rest] "result.data.incomplete_results" is deprecated.'))
        return incompleteResults
      }
    })
  }

  if (typeof repositorySelection !== 'undefined') {
    Object.defineProperty(response.data, 'repository_selection', {
      get () {
        deprecateTotalCount(octokit.log, new Deprecation('[@octokit/rest] "result.data.repository_selection" is deprecated.'))
        return repositorySelection
      }
    })
  }

  Object.defineProperty(response.data, 'total_count', {
    get () {
      deprecateTotalCount(octokit.log, new Deprecation('[@octokit/rest] "result.data.total_count" is deprecated.'))
      return totalCount
    }
  })
}


/***/ }),
/* 302 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __webpack_require__(747)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __webpack_require__(117)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var concatMap = __webpack_require__(896);
var balanced = __webpack_require__(284);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),
/* 307 */,
/* 308 */,
/* 309 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = octokitRestNormalizeGitReferenceResponses

const { RequestError } = __webpack_require__(463)

function octokitRestNormalizeGitReferenceResponses (octokit) {
  octokit.hook.wrap('request', (request, options) => {
    const isGetOrListRefRequest = /\/repos\/:?\w+\/:?\w+\/git\/refs\/:?\w+/.test(options.url)

    if (!isGetOrListRefRequest) {
      return request(options)
    }

    const isGetRefRequest = 'ref' in options

    return request(options)
      .then(response => {
        // request single reference
        if (isGetRefRequest) {
          if (Array.isArray(response.data)) {
            throw new RequestError(`More than one reference found for "${options.ref}"`, 404, {
              request: options
            })
          }

          // ✅ received single reference
          return response
        }

        // request list of references
        if (!Array.isArray(response.data)) {
          response.data = [response.data]
        }

        return response
      })

      .catch(error => {
        if (isGetRefRequest) {
          throw error
        }

        if (error.status === 404) {
          return {
            status: 200,
            headers: error.headers,
            data: []
          }
        }

        throw error
      })
  })
}


/***/ }),
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */
/***/ (function(module) {

module.exports = {"_args":[["@octokit/graphql@2.1.3","/data/workspace/xresloader/upload-to-github-release"]],"_from":"@octokit/graphql@2.1.3","_id":"@octokit/graphql@2.1.3","_inBundle":false,"_integrity":"sha512-XoXJqL2ondwdnMIW3wtqJWEwcBfKk37jO/rYkoxNPEVeLBDGsGO1TCWggrAlq3keGt/O+C/7VepXnukUxwt5vA==","_location":"/@octokit/graphql","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"@octokit/graphql@2.1.3","name":"@octokit/graphql","escapedName":"@octokit%2fgraphql","scope":"@octokit","rawSpec":"2.1.3","saveSpec":null,"fetchSpec":"2.1.3"},"_requiredBy":["/@actions/github"],"_resolved":"http://mirrors.tencent.com/npm/@octokit%2fgraphql/-/graphql-2.1.3.tgz","_spec":"2.1.3","_where":"/data/workspace/xresloader/upload-to-github-release","author":{"name":"Gregor Martynus","url":"https://github.com/gr2m"},"bugs":{"url":"https://github.com/octokit/graphql.js/issues"},"bundlesize":[{"path":"./dist/octokit-graphql.min.js.gz","maxSize":"5KB"}],"dependencies":{"@octokit/request":"^5.0.0","universal-user-agent":"^2.0.3"},"description":"GitHub GraphQL API client for browsers and Node","devDependencies":{"chai":"^4.2.0","compression-webpack-plugin":"^2.0.0","coveralls":"^3.0.3","cypress":"^3.1.5","fetch-mock":"^7.3.1","mkdirp":"^0.5.1","mocha":"^6.0.0","npm-run-all":"^4.1.3","nyc":"^14.0.0","semantic-release":"^15.13.3","simple-mock":"^0.8.0","standard":"^12.0.1","webpack":"^4.29.6","webpack-bundle-analyzer":"^3.1.0","webpack-cli":"^3.2.3"},"files":["lib"],"homepage":"https://github.com/octokit/graphql.js#readme","keywords":["octokit","github","api","graphql"],"license":"MIT","main":"index.js","name":"@octokit/graphql","publishConfig":{"access":"public"},"release":{"publish":["@semantic-release/npm",{"path":"@semantic-release/github","assets":["dist/*","!dist/*.map.gz"]}]},"repository":{"type":"git","url":"git+https://github.com/octokit/graphql.js.git"},"scripts":{"build":"npm-run-all build:*","build:development":"webpack --mode development --entry . --output-library=octokitGraphql --output=./dist/octokit-graphql.js --profile --json > dist/bundle-stats.json","build:production":"webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=octokitGraphql --output-path=./dist --output-filename=octokit-graphql.min.js --devtool source-map","bundle-report":"webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html","coverage":"nyc report --reporter=html && open coverage/index.html","coverage:upload":"nyc report --reporter=text-lcov | coveralls","prebuild":"mkdirp dist/","pretest":"standard","test":"nyc mocha test/*-test.js","test:browser":"cypress run --browser chrome"},"standard":{"globals":["describe","before","beforeEach","afterEach","after","it","expect"]},"version":"2.1.3"};

/***/ }),
/* 315 */
/***/ (function(module) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),
/* 316 */,
/* 317 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(444);
class EntryTransformer {
    constructor(_settings) {
        this._settings = _settings;
    }
    getTransformer() {
        return (entry) => this._transform(entry);
    }
    _transform(entry) {
        let filepath = entry.path;
        if (this._settings.absolute) {
            filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
            filepath = utils.path.unixify(filepath);
        }
        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
            filepath += '/';
        }
        if (!this._settings.objectMode) {
            return filepath;
        }
        return Object.assign({}, entry, { path: filepath });
    }
}
exports.default = EntryTransformer;


/***/ }),
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */
/***/ (function(module) {

"use strict";


var isStream = module.exports = function (stream) {
	return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
};

isStream.writable = function (stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
};

isStream.readable = function (stream) {
	return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
};

isStream.duplex = function (stream) {
	return isStream.writable(stream) && isStream.readable(stream);
};

isStream.transform = function (stream) {
	return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
};


/***/ }),
/* 324 */,
/* 325 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const action_core = __importStar(__webpack_require__(470));
const action_github = __importStar(__webpack_require__(469));
const globby_1 = __importDefault(__webpack_require__(625));
const path = __importStar(__webpack_require__(622));
const fs = __importStar(__webpack_require__(747));
const lite_1 = __importDefault(__webpack_require__(825));
// const io = require('@actions/io');
// const tc = require('@actions/tool-cache');
function getInputAsArray(name) {
    return (action_core.getInput(name) || '').split(";").map(v => v.trim()).filter(v => !!v);
}
function getInputAsBool(name) {
    const res = (action_core.getInput(name) || '').toLowerCase();
    if (!res) {
        return false;
    }
    return res != "false" && res != "disabled" && res != "0" && res != "no" && res != "disable";
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const github_token = (process.env['GITHUB_TOKEN'] || '').trim();
            const upload_files_pattern = getInputAsArray('file');
            const is_overwrite = action_core.getInput('overwrite');
            const is_draft = getInputAsBool('draft');
            const is_prerelease = getInputAsBool('prerelease');
            const with_tags = getInputAsBool('tags');
            const with_branches = getInputAsArray('branches');
            if (typeof (github_token) != 'string') {
                action_core.setFailed("token is invalid");
                return;
            }
            if (!github_token) {
                action_core.setFailed("GITHUB_TOKEN is required to upload files");
                return;
            }
            // action_github.context.eventName = push
            // action_github.context.sha = ae7dc58d20ad51b3c8c37deca1bc07f3ae8526cd
            // context.ref = refs/heads/BRANCH_NAME  or refs/tags/TAG_NAME   
            // action_github.context.ref = refs/heads/master
            // action_github.context.action = xresloaderupload-to-github-release
            // action_github.context.actor = owt5008137
            // action_github.context.repo.repo = upload-to-github-release-test
            // action_github.context.repo.owner = xresloader
            var release_name = "Release-" + action_github.context.sha.substr(0, 8);
            if (with_branches || with_tags) {
                // check branches or tags
                var match_filter = false;
                if (with_tags) {
                    const match_tag = action_github.context.ref.match(/refs\/tags\/(.*)/);
                    if (match_tag) {
                        match_filter = true;
                        release_name = match_tag[1];
                    }
                    else {
                        console.log('Current event is not a tag push.');
                    }
                }
                if (!match_filter && with_branches) {
                    const match_branch = action_github.context.ref.match(/refs\/heads\/(.*)/);
                    if (match_branch) {
                        const selected_branch = with_branches.filter((s) => s == match_branch[1]);
                        if (selected_branch) {
                            match_filter = true;
                            release_name = match_branch[1] + '-' + action_github.context.sha.substr(0, 8);
                        }
                    }
                    if (!match_filter) {
                        console.log(`Current event is not one of branches [${with_branches.join(", ")}].`);
                    }
                }
                if (!match_filter) {
                    console.log(`Current event will be skipped.`);
                    return;
                }
            }
            else if (action_github.context.ref) {
                // try get branch name
                const match_branch = action_github.context.ref.match(/([^\/]+)$/);
                if (match_branch && match_branch.length > 1) {
                    release_name = match_branch[1] + '-' + action_github.context.sha.substr(0, 8);
                }
            }
            const upload_files = yield globby_1.default(upload_files_pattern);
            if (!upload_files) {
                action_core.setFailed(`Can not find any file by ${upload_files_pattern}`);
                return;
            }
            for (const file_path of upload_files) {
                console.log(`File found to upload: ${file_path}`);
            }
            // request github release
            const octokit = new action_github.GitHub(github_token);
            /** Can not upload assets by v4 API, so we use v3 API by now **/
            /**
            // Debug Tool: https://developer.github.com/v4/explorer
            // API Docs:   https://developer.github.com/v4/
            const repo_info = await octokit.graphql(`query {
                    repository (owner:"xresloader", name:"xresloader") {
                        release (tagName: "v2.5.0") {
                        id,
                        name,
                        isDraft,
                        resourcePath,
                        tag {
                            id,
                            name,
                            prefix
                        },
                        updatedAt,
                        url,
                        releaseAssets(last: 5) {
                            nodes {
                            id,
                            name,
                            size,
                            downloadUrl
                            }
                        }
                        }
                    }
                }`);
    
            const repo_info_of_release = await octokit.graphql(`query {
                    repository (owner:"${action_github.context.repo.owner}", name:"${action_github.context.repo.repo}") {
                        release (tagName: "${release_name}") {
                        id,
                        name,
                        isDraft,
                        resourcePath,
                        tag {
                            id,
                            name,
                            prefix
                        },
                        updatedAt,
                        url,
                        releaseAssets(last: 5) {
                            nodes {
                            id,
                            name,
                            size,
                            downloadUrl
                            }
                        }
                        }
                    }
                }`);
    
            console.log("============================= v4 API: graphql(query {repository}) =============================");
            console.log(`repo_info = ${JSON.stringify(repo_info)}`);
            console.log(`repo_info_of_release = ${JSON.stringify(repo_info_of_release)}`);
            **/
            // https://developer.github.com/v3/repos/releases/#upload-a-release-asset
            var deploy_release = undefined;
            try {
                deploy_release = yield octokit.repos.getReleaseByTag({
                    owner: action_github.context.repo.owner,
                    repo: action_github.context.repo.repo,
                    tag: release_name
                });
            }
            catch (error) {
                console.log(`Try to get release ${release_name} from ${action_github.context.repo.owner}/${action_github.context.repo.repo} : ${error.message}`);
            }
            console.log("============================= v3 API: getReleaseByTag =============================");
            if (deploy_release && deploy_release.headers) {
                console.log(`Try to get release ${release_name} from ${action_github.context.repo.owner}/${action_github.context.repo.repo} : ${deploy_release.headers.status}`);
                // console.log(`${action_github.context.repo.repo}.getReleaseByTag.data = ${JSON.stringify(deploy_release.data)}`);
            }
            const pending_to_delete = [];
            const pending_to_upload = [];
            var upload_url = deploy_release ? deploy_release.data.upload_url : "";
            var release_url = deploy_release ? deploy_release.data.url : "";
            var release_tag_name = deploy_release ? deploy_release.data.tag_name : "";
            var release_commitish = deploy_release ? deploy_release.data.target_commitish : "";
            // https://developer.github.com/v3/repos/releases/#create-a-release
            if (deploy_release && deploy_release.data) {
                try {
                    console.log(`Try to update release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo}`);
                    deploy_release = yield octokit.repos.updateRelease({
                        owner: action_github.context.repo.owner,
                        repo: action_github.context.repo.repo,
                        release_id: deploy_release.data.id,
                        tag_name: release_name,
                        target_commitish: action_github.context.sha,
                        name: release_name,
                        body: deploy_release.data.body,
                        draft: is_draft,
                        prerelease: is_prerelease
                    });
                    upload_url = deploy_release.data.upload_url;
                    release_url = deploy_release.data.url;
                    release_tag_name = deploy_release.data.tag_name;
                    release_commitish = deploy_release.data.target_commitish;
                    console.log(`Update release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} success`);
                }
                catch (error) {
                    var msg = `Try to update release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} failed: ${error.message}`;
                    msg += `\r\n${error.stack}`;
                    console.log(msg);
                    action_core.setFailed(msg);
                }
            }
            else {
                try {
                    console.log(`Try to create release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo}`);
                    deploy_release = yield octokit.repos.createRelease({
                        owner: action_github.context.repo.owner,
                        repo: action_github.context.repo.repo,
                        tag_name: release_name,
                        target_commitish: action_github.context.sha,
                        name: release_name,
                        // body: "",
                        draft: is_draft,
                        prerelease: is_prerelease
                    });
                    upload_url = deploy_release.data.upload_url;
                    release_url = deploy_release.data.url;
                    release_tag_name = deploy_release.data.tag_name;
                    release_commitish = deploy_release.data.target_commitish;
                    console.log(`Create release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} success`);
                }
                catch (error) {
                    var msg = `Try to create release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} failed: ${error.message}`;
                    msg += `\r\n${error.stack}`;
                    console.log(msg);
                    action_core.setFailed(msg);
                }
            }
            if (deploy_release && deploy_release.data && deploy_release.data.assets) {
                const old_asset_map = {};
                for (const asset of deploy_release.data.assets || []) {
                    old_asset_map[asset.name] = asset;
                }
                for (const file_path of upload_files) {
                    const file_base_name = path.basename(file_path);
                    if (old_asset_map[file_base_name]) {
                        if (is_overwrite) {
                            pending_to_delete.push(old_asset_map[file_base_name]);
                            pending_to_upload.push(file_path);
                        }
                        else {
                            console.log(`Skip asset file: ${file_base_name}, it'salready existed.`);
                        }
                    }
                    else {
                        pending_to_upload.push(file_path);
                    }
                }
            }
            // Delete old assets.
            for (const asset of pending_to_delete) {
                try {
                    // const pick_id = Buffer.from(asset.id, 'base64').toString().match(/\d+$/); // convert id from graphql v4 api to v3 rest api
                    console.log(`Deleting old asset: ${asset.name} ...`);
                    const delete_rsp = yield octokit.repos.deleteReleaseAsset({
                        owner: action_github.context.repo.owner,
                        repo: action_github.context.repo.repo,
                        asset_id: asset.id
                    });
                    console.log(`Delete old asset: ${asset.name} => ${delete_rsp.headers.status}`);
                }
                catch (error) {
                    const msg = `Delete old asset: ${asset.name} failed => ${error.message}`;
                    console.log(msg);
                }
            }
            // Upload new assets
            for (const file_path of pending_to_upload) {
                const file_base_name = path.basename(file_path);
                try {
                    console.log(`Uploading asset: ${file_path} ...`);
                    const find_mime = lite_1.default.getType(path.extname(file_path));
                    const upload_rsp = yield octokit.repos.uploadReleaseAsset({
                        url: upload_url,
                        headers: {
                            "content-type": find_mime || "application/octet-stream",
                            "content-length": fs.statSync(file_path).size
                        },
                        name: file_base_name,
                        file: fs.createReadStream(file_path)
                    });
                    if (200 != (upload_rsp.status - upload_rsp.status % 100)) {
                        const msg = `Upload asset: ${file_base_name} failed => ${upload_rsp.headers.status}`;
                        console.log(msg);
                        action_core.setFailed(msg);
                    }
                    else {
                        console.log(`Upload asset: ${file_base_name} success`);
                    }
                }
                catch (error) {
                    const msg = `Upload asset: ${file_base_name} failed => ${error.message}\r\n${error.stack}`;
                    console.log(msg);
                    action_core.setFailed(msg);
                }
            }
            // Environment sample
            // GITHUB_ACTION=run
            // GITHUB_ACTIONS=true
            // GITHUB_ACTOR=owt5008137
            // GITHUB_BASE_REF=
            // GITHUB_EVENT_NAME=push
            // GITHUB_EVENT_PATH=/home/runner/work/_temp/_github_workflow/event.json
            // GITHUB_HEAD_REF=
            // GITHUB_REF=refs/heads/master
            // GITHUB_REPOSITORY=xresloader/upload-to-github-release-test
            // GITHUB_SHA=d3e5b42d6fdf7bfab40c5d6d7d51491d0287780f
            // GITHUB_WORKFLOW=main
            // GITHUB_WORKSPACE=/home/runner/work/upload-to-github-release-test/upload-to-github-release-test
            // set output
            action_core.setOutput("release_name", release_name);
            action_core.setOutput("release_url", release_url);
            action_core.setOutput("release_tag_name", release_tag_name);
            action_core.setOutput("release_commitish", release_commitish);
        }
        catch (error) {
            action_core.setFailed(error.message + "\r\n" + error.stack);
        }
    });
}
run();


/***/ }),
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(747);
const os = __webpack_require__(87);
const CPU_COUNT = os.cpus().length;
exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    lstatSync: fs.lstatSync,
    stat: fs.stat,
    statSync: fs.statSync,
    readdir: fs.readdir,
    readdirSync: fs.readdirSync
};
// tslint:enable no-redundant-jsdoc
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.absolute = this._getValue(this._options.absolute, false);
        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
        this.cwd = this._getValue(this._options.cwd, process.cwd());
        this.deep = this._getValue(this._options.deep, Infinity);
        this.dot = this._getValue(this._options.dot, false);
        this.extglob = this._getValue(this._options.extglob, true);
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
        this.fs = this._getFileSystemMethods(this._options.fs);
        this.globstar = this._getValue(this._options.globstar, true);
        this.ignore = this._getValue(this._options.ignore, []);
        this.markDirectories = this._getValue(this._options.markDirectories, false);
        this.objectMode = this._getValue(this._options.objectMode, false);
        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
        this.stats = this._getValue(this._options.stats, false);
        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
        this.unique = this._getValue(this._options.unique, true);
        if (this.onlyDirectories) {
            this.onlyFiles = false;
        }
        if (this.stats) {
            this.objectMode = true;
        }
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
    _getFileSystemMethods(methods = {}) {
        return Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER, methods);
    }
}
exports.default = Settings;


/***/ }),
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasLastPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasLastPage (link) {
  deprecate(`octokit.hasLastPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).last
}


/***/ }),
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


module.exports = validate

const { RequestError } = __webpack_require__(463)
const get = __webpack_require__(854)
const set = __webpack_require__(883)

function validate (octokit, options) {
  if (!options.request.validate) {
    return
  }
  const { validate: params } = options.request

  Object.keys(params).forEach(parameterName => {
    const parameter = get(params, parameterName)

    const expectedType = parameter.type
    let parentParameterName
    let parentValue
    let parentParamIsPresent = true
    let parentParameterIsArray = false

    if (/\./.test(parameterName)) {
      parentParameterName = parameterName.replace(/\.[^.]+$/, '')
      parentParameterIsArray = parentParameterName.slice(-2) === '[]'
      if (parentParameterIsArray) {
        parentParameterName = parentParameterName.slice(0, -2)
      }
      parentValue = get(options, parentParameterName)
      parentParamIsPresent = parentParameterName === 'headers' || (typeof parentValue === 'object' && parentValue !== null)
    }

    const values = parentParameterIsArray
      ? (get(options, parentParameterName) || []).map(value => value[parameterName.split(/\./).pop()])
      : [get(options, parameterName)]

    values.forEach((value, i) => {
      const valueIsPresent = typeof value !== 'undefined'
      const valueIsNull = value === null
      const currentParameterName = parentParameterIsArray
        ? parameterName.replace(/\[\]/, `[${i}]`)
        : parameterName

      if (!parameter.required && !valueIsPresent) {
        return
      }

      // if the parent parameter is of type object but allows null
      // then the child parameters can be ignored
      if (!parentParamIsPresent) {
        return
      }

      if (parameter.allowNull && valueIsNull) {
        return
      }

      if (!parameter.allowNull && valueIsNull) {
        throw new RequestError(`'${currentParameterName}' cannot be null`, 400, {
          request: options
        })
      }

      if (parameter.required && !valueIsPresent) {
        throw new RequestError(`Empty value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
          request: options
        })
      }

      // parse to integer before checking for enum
      // so that string "1" will match enum with number 1
      if (expectedType === 'integer') {
        const unparsedValue = value
        value = parseInt(value, 10)
        if (isNaN(value)) {
          throw new RequestError(`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(unparsedValue)} is NaN`, 400, {
            request: options
          })
        }
      }

      if (parameter.enum && parameter.enum.indexOf(value) === -1) {
        throw new RequestError(`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
          request: options
        })
      }

      if (parameter.validation) {
        const regex = new RegExp(parameter.validation)
        if (!regex.test(value)) {
          throw new RequestError(`Invalid value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
            request: options
          })
        }
      }

      if (expectedType === 'object' && typeof value === 'string') {
        try {
          value = JSON.parse(value)
        } catch (exception) {
          throw new RequestError(`JSON parse error of value for parameter '${currentParameterName}': ${JSON.stringify(value)}`, 400, {
            request: options
          })
        }
      }

      set(options, parameter.mapTo || currentParameterName, value)
    })
  })

  return options
}


/***/ }),
/* 349 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError

const { RequestError } = __webpack_require__(463)

function authenticationRequestError (state, error, options) {
  /* istanbul ignore next */
  if (!error.headers) throw error

  const otpRequired = /required/.test(error.headers['x-github-otp'] || '')
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error
  }

  if (error.status === 401 && otpRequired && error.request && error.request.headers['x-github-otp']) {
    throw new RequestError('Invalid one-time password for two-factor authentication', 401, {
      headers: error.headers,
      request: options
    })
  }

  if (typeof state.auth.on2fa !== 'function') {
    throw new RequestError('2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication', 401, {
      headers: error.headers,
      request: options
    })
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa()
    })
    .then((oneTimePassword) => {
      const newOptions = Object.assign(options, {
        headers: Object.assign({ 'x-github-otp': oneTimePassword }, options.headers)
      })
      return state.octokit.request(newOptions)
    })
}


/***/ }),
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */
/***/ (function(module) {

module.exports = require("assert");

/***/ }),
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */
/***/ (function(module) {

module.exports = register

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {}
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}


/***/ }),
/* 364 */,
/* 365 */,
/* 366 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const scan = __webpack_require__(537);
const parse = __webpack_require__(806);
const utils = __webpack_require__(224);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    let fns = glob.map(input => picomatch(input, options, returnState));
    return str => {
      for (let isMatch of fns) {
        let state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
  }

  if (typeof glob !== 'string' || glob === '') {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  let opts = options || {};
  let posix = utils.isWindows(options);
  let regex = picomatch.makeRe(glob, options, false, true);
  let state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    let ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    let { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    let result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  let opts = options || {};
  let format = opts.format || (posix ? utils.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: !!match, match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
  let regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(path.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(glob[, options]);
 * ```
 * @param {String} `glob`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (glob, options) => parse(glob, options);

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * // { prefix: '!./',
 * //   input: '!./foo/*.js',
 * //   base: 'foo',
 * //   glob: '*.js',
 * //   negated: true,
 * //   isGlob: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan(input, options);

/**
 * Create a regular expression from a glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.makeRe(input[, options]);
 *
 * console.log(picomatch.makeRe('*.js'));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `input` A glob pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  let opts = options || {};
  let prepend = opts.contains ? '' : '^';
  let append = opts.contains ? '' : '$';
  let state = { negated: false, fastpaths: true };
  let prefix = '';
  let output;

  if (input.startsWith('./')) {
    input = input.slice(2);
    prefix = state.prefix = './';
  }

  if (opts.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    output = parse.fastpaths(input, options);
  }

  if (output === void 0) {
    state = picomatch.parse(input, options);
    state.prefix = prefix + (state.prefix || '');
    output = state.output;
  }

  if (returnOutput === true) {
    return output;
  }

  let source = `${prepend}(?:${output})${append}`;
  if (state && state.negated === true) {
    source = `^(?!${source}).*$`;
  }

  let regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = state;
  }

  return regex;
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    let opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = __webpack_require__(199);

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),
/* 367 */,
/* 368 */
/***/ (function(module) {

module.exports = function atob(str) {
  return Buffer.from(str, 'base64').toString('binary')
}


/***/ }),
/* 369 */,
/* 370 */
/***/ (function(module) {

module.exports = deprecate

const loggedMessages = {}

function deprecate (message) {
  if (loggedMessages[message]) {
    return
  }

  console.warn(`DEPRECATED (@octokit/rest): ${message}`)
  loggedMessages[message] = 1
}


/***/ }),
/* 371 */,
/* 372 */
/***/ (function(module) {

module.exports = octokitDebug

function octokitDebug (octokit) {
  octokit.hook.wrap('request', (request, options) => {
    octokit.log.debug('request', options)
    const start = Date.now()
    const requestOptions = octokit.request.endpoint.parse(options)
    const path = requestOptions.url.replace(options.baseUrl, '')

    return request(options)

      .then(response => {
        octokit.log.info(`${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`)
        return response
      })

      .catch(error => {
        octokit.log.info(`${requestOptions.method} ${path} - ${error.status} in ${Date.now() - start}ms`)
        throw error
      })
  })
}


/***/ }),
/* 373 */,
/* 374 */,
/* 375 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(444);
class ErrorFilter {
    constructor(_settings) {
        this._settings = _settings;
    }
    getFilter() {
        return (error) => this._isNonFatalError(error);
    }
    _isNonFatalError(error) {
        return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
    }
}
exports.default = ErrorFilter;


/***/ }),
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */,
/* 381 */,
/* 382 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(225);

module.exports = (ast, options = {}) => {
  let stringify = (node, parent = {}) => {
    let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output = '';

    if (node.value) {
      if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
        return '\\' + node.value;
      }
      return node.value;
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += stringify(child);
      }
    }
    return output;
  };

  return stringify(ast);
};



/***/ }),
/* 383 */,
/* 384 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(444);
function generate(patterns, settings) {
    const positivePatterns = getPositivePatterns(patterns);
    const negativePatterns = getNegativePatternsAsPositive(patterns, settings.ignore);
    /**
     * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
     * filepath directly (without read directory).
     */
    const staticPatterns = !settings.caseSensitiveMatch ? [] : positivePatterns.filter(utils.pattern.isStaticPattern);
    const dynamicPatterns = !settings.caseSensitiveMatch ? positivePatterns : positivePatterns.filter(utils.pattern.isDynamicPattern);
    const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, /* dynamic */ false);
    const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, /* dynamic */ true);
    return staticTasks.concat(dynamicTasks);
}
exports.generate = generate;
function convertPatternsToTasks(positive, negative, dynamic) {
    const positivePatternsGroup = groupPatternsByBaseDirectory(positive);
    // When we have a global group – there is no reason to divide the patterns into independent tasks.
    // In this case, the global task covers the rest.
    if ('.' in positivePatternsGroup) {
        const task = convertPatternGroupToTask('.', positive, negative, dynamic);
        return [task];
    }
    return convertPatternGroupsToTasks(positivePatternsGroup, negative, dynamic);
}
exports.convertPatternsToTasks = convertPatternsToTasks;
function getPositivePatterns(patterns) {
    return utils.pattern.getPositivePatterns(patterns);
}
exports.getPositivePatterns = getPositivePatterns;
function getNegativePatternsAsPositive(patterns, ignore) {
    const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
    const positive = negative.map(utils.pattern.convertToPositivePattern);
    return positive;
}
exports.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
function groupPatternsByBaseDirectory(patterns) {
    return patterns.reduce((collection, pattern) => {
        const base = utils.pattern.getBaseDirectory(pattern);
        if (base in collection) {
            collection[base].push(pattern);
        }
        else {
            collection[base] = [pattern];
        }
        return collection;
    }, {});
}
exports.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
function convertPatternGroupsToTasks(positive, negative, dynamic) {
    return Object.keys(positive).map((base) => {
        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
    });
}
exports.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
function convertPatternGroupToTask(base, positive, negative, dynamic) {
    return {
        dynamic,
        positive,
        negative,
        base,
        patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
    };
}
exports.convertPatternGroupToTask = convertPatternGroupToTask;


/***/ }),
/* 385 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isPlainObject = _interopDefault(__webpack_require__(696));
var universalUserAgent = __webpack_require__(562);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = route || {};
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = options.url.replace(/:([a-z]\w+)/g, "{+$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequset = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequset) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "0.0.0-development";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`;
const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),
/* 386 */,
/* 387 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = __webpack_require__(291);
class AsyncProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._storage = new Set();
    }
    read(callback) {
        this._reader.onError((error) => {
            callFailureCallback(callback, error);
        });
        this._reader.onEntry((entry) => {
            this._storage.add(entry);
        });
        this._reader.onEnd(() => {
            callSuccessCallback(callback, Array.from(this._storage));
        });
        this._reader.read();
    }
}
exports.default = AsyncProvider;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, entries) {
    callback(null, entries);
}


/***/ }),
/* 388 */,
/* 389 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(747);
const shebangCommand = __webpack_require__(866);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    let buffer;

    if (Buffer.alloc) {
        // Node.js v4.5+ / v5.10+
        buffer = Buffer.alloc(size);
    } else {
        // Old Node.js API
        buffer = new Buffer(size);
        buffer.fill(0); // zero-fill
    }

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsScandir = __webpack_require__(661);
const common = __webpack_require__(617);
const reader_1 = __webpack_require__(962);
class SyncReader extends reader_1.default {
    constructor() {
        super(...arguments);
        this._scandir = fsScandir.scandirSync;
        this._storage = new Set();
        this._queue = new Set();
    }
    read() {
        this._pushToQueue(this._root, this._settings.basePath);
        this._handleQueue();
        return Array.from(this._storage);
    }
    _pushToQueue(dir, base) {
        this._queue.add({ dir, base });
    }
    _handleQueue() {
        for (const item of this._queue.values()) {
            this._handleDirectory(item.dir, item.base);
        }
    }
    _handleDirectory(dir, base) {
        try {
            const entries = this._scandir(dir, this._settings.fsScandirSettings);
            for (const entry of entries) {
                this._handleEntry(entry, base);
            }
        }
        catch (error) {
            this._handleError(error);
        }
    }
    _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
            return;
        }
        throw error;
    }
    _handleEntry(entry, base) {
        const fullpath = entry.path;
        if (base !== undefined) {
            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
            this._pushToStorage(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
            this._pushToQueue(fullpath, entry.path);
        }
    }
    _pushToStorage(entry) {
        this._storage.add(entry);
    }
}
exports.default = SyncReader;


/***/ }),
/* 395 */,
/* 396 */
/***/ (function(module) {

// A simple implementation of make-array
function makeArray (subject) {
  return Array.isArray(subject)
    ? subject
    : [subject]
}

const REGEX_TEST_BLANK_LINE = /^\s+$/
const REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/
const REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/
const REGEX_SPLITALL_CRLF = /\r?\n/g
// /foo,
// ./foo,
// ../foo,
// .
// ..
const REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/

const SLASH = '/'
const KEY_IGNORE = typeof Symbol !== 'undefined'
  ? Symbol.for('node-ignore')
  /* istanbul ignore next */
  : 'node-ignore'

const define = (object, key, value) =>
  Object.defineProperty(object, key, {value})

const REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g

// Sanitize the range of a regular expression
// The cases are complicated, see test cases for details
const sanitizeRange = range => range.replace(
  REGEX_REGEXP_RANGE,
  (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0)
    ? match
    // Invalid range (out of order) which is ok for gitignore rules but
    //   fatal for JavaScript regular expression, so eliminate it.
    : ''
)

// > If the pattern ends with a slash,
// > it is removed for the purpose of the following description,
// > but it would only find a match with a directory.
// > In other words, foo/ will match a directory foo and paths underneath it,
// > but will not match a regular file or a symbolic link foo
// >  (this is consistent with the way how pathspec works in general in Git).
// '`foo/`' will not match regular file '`foo`' or symbolic link '`foo`'
// -> ignore-rules will not deal with it, because it costs extra `fs.stat` call
//      you could use option `mark: true` with `glob`

// '`foo/`' should not continue with the '`..`'
const REPLACERS = [

  // > Trailing spaces are ignored unless they are quoted with backslash ("\")
  [
    // (a\ ) -> (a )
    // (a  ) -> (a)
    // (a \ ) -> (a  )
    /\\?\s+$/,
    match => match.indexOf('\\') === 0
      ? ' '
      : ''
  ],

  // replace (\ ) with ' '
  [
    /\\\s/g,
    () => ' '
  ],

  // Escape metacharacters
  // which is written down by users but means special for regular expressions.

  // > There are 12 characters with special meanings:
  // > - the backslash \,
  // > - the caret ^,
  // > - the dollar sign $,
  // > - the period or dot .,
  // > - the vertical bar or pipe symbol |,
  // > - the question mark ?,
  // > - the asterisk or star *,
  // > - the plus sign +,
  // > - the opening parenthesis (,
  // > - the closing parenthesis ),
  // > - and the opening square bracket [,
  // > - the opening curly brace {,
  // > These special characters are often called "metacharacters".
  [
    /[\\^$.|*+(){]/g,
    match => `\\${match}`
  ],

  [
    // > [abc] matches any character inside the brackets
    // >    (in this case a, b, or c);
    /\[([^\]/]*)($|\])/g,
    (match, p1, p2) => p2 === ']'
      ? `[${sanitizeRange(p1)}]`
      : `\\${match}`
  ],

  [
    // > a question mark (?) matches a single character
    /(?!\\)\?/g,
    () => '[^/]'
  ],

  // leading slash
  [

    // > A leading slash matches the beginning of the pathname.
    // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
    // A leading slash matches the beginning of the pathname
    /^\//,
    () => '^'
  ],

  // replace special metacharacter slash after the leading slash
  [
    /\//g,
    () => '\\/'
  ],

  [
    // > A leading "**" followed by a slash means match in all directories.
    // > For example, "**/foo" matches file or directory "foo" anywhere,
    // > the same as pattern "foo".
    // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
    // >   under directory "foo".
    // Notice that the '*'s have been replaced as '\\*'
    /^\^*\\\*\\\*\\\//,

    // '**/foo' <-> 'foo'
    () => '^(?:.*\\/)?'
  ],

  // ending
  [
    // 'js' will not match 'js.'
    // 'ab' will not match 'abc'
    /(?:[^*])$/,

    // WTF!
    // https://git-scm.com/docs/gitignore
    // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
    // which re-fixes #24, #38

    // > If there is a separator at the end of the pattern then the pattern
    // > will only match directories, otherwise the pattern can match both
    // > files and directories.

    // 'js*' will not match 'a.js'
    // 'js/' will not match 'a.js'
    // 'js' will match 'a.js' and 'a.js/'
    match => /\/$/.test(match)
      // foo/ will not match 'foo'
      ? `${match}$`
      // foo matches 'foo' and 'foo/'
      : `${match}(?=$|\\/$)`
  ],

  // starting
  [
    // there will be no leading '/'
    //   (which has been replaced by section "leading slash")
    // If starts with '**', adding a '^' to the regular expression also works
    /^(?=[^^])/,
    function startingReplacer () {
      // If has a slash `/` at the beginning or middle
      return !/\/(?!$)/.test(this)
        // > Prior to 2.22.1
        // > If the pattern does not contain a slash /,
        // >   Git treats it as a shell glob pattern
        // Actually, if there is only a trailing slash,
        //   git also treats it as a shell glob pattern

        // After 2.22.1 (compatible but clearer)
        // > If there is a separator at the beginning or middle (or both)
        // > of the pattern, then the pattern is relative to the directory
        // > level of the particular .gitignore file itself.
        // > Otherwise the pattern may also match at any level below
        // > the .gitignore level.
        ? '(?:^|\\/)'

        // > Otherwise, Git treats the pattern as a shell glob suitable for
        // >   consumption by fnmatch(3)
        : '^'
    }
  ],

  // two globstars
  [
    // Use lookahead assertions so that we could match more than one `'/**'`
    /\\\/\\\*\\\*(?=\\\/|$)/g,

    // Zero, one or several directories
    // should not use '*', or it will be replaced by the next replacer

    // Check if it is not the last `'/**'`
    (_, index, str) => index + 6 < str.length

      // case: /**/
      // > A slash followed by two consecutive asterisks then a slash matches
      // >   zero or more directories.
      // > For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b" and so on.
      // '/**/'
      ? '(?:\\/[^\\/]+)*'

      // case: /**
      // > A trailing `"/**"` matches everything inside.

      // #21: everything inside but it should not include the current folder
      : '\\/.+'
  ],

  // intermediate wildcards
  [
    // Never replace escaped '*'
    // ignore rule '\*' will match the path '*'

    // 'abc.*/' -> go
    // 'abc.*'  -> skip this rule
    /(^|[^\\]+)\\\*(?=.+)/g,

    // '*.js' matches '.js'
    // '*.js' doesn't match 'abc'
    (_, p1) => `${p1}[^\\/]*`
  ],

  // trailing wildcard
  [
    /(\^|\\\/)?\\\*$/,
    (_, p1) => {
      const prefix = p1
        // '\^':
        // '/*' does not match ''
        // '/*' does not match everything

        // '\\\/':
        // 'abc/*' does not match 'abc/'
        ? `${p1}[^/]+`

        // 'a*' matches 'a'
        // 'a*' matches 'aa'
        : '[^/]*'

      return `${prefix}(?=$|\\/$)`
    }
  ],

  [
    // unescape
    /\\\\\\/g,
    () => '\\'
  ]
]

// A simple cache, because an ignore rule only has only one certain meaning
const regexCache = Object.create(null)

// @param {pattern}
const makeRegex = (pattern, negative, ignorecase) => {
  const r = regexCache[pattern]
  if (r) {
    return r
  }

  // const replacers = negative
  //   ? NEGATIVE_REPLACERS
  //   : POSITIVE_REPLACERS

  const source = REPLACERS.reduce(
    (prev, current) => prev.replace(current[0], current[1].bind(pattern)),
    pattern
  )

  return regexCache[pattern] = ignorecase
    ? new RegExp(source, 'i')
    : new RegExp(source)
}

const isString = subject => typeof subject === 'string'

// > A blank line matches no files, so it can serve as a separator for readability.
const checkPattern = pattern => pattern
  && isString(pattern)
  && !REGEX_TEST_BLANK_LINE.test(pattern)

  // > A line starting with # serves as a comment.
  && pattern.indexOf('#') !== 0

const splitPattern = pattern => pattern.split(REGEX_SPLITALL_CRLF)

class IgnoreRule {
  constructor (
    origin,
    pattern,
    negative,
    regex
  ) {
    this.origin = origin
    this.pattern = pattern
    this.negative = negative
    this.regex = regex
  }
}

const createRule = (pattern, ignorecase) => {
  const origin = pattern
  let negative = false

  // > An optional prefix "!" which negates the pattern;
  if (pattern.indexOf('!') === 0) {
    negative = true
    pattern = pattern.substr(1)
  }

  pattern = pattern
  // > Put a backslash ("\") in front of the first "!" for patterns that
  // >   begin with a literal "!", for example, `"\!important!.txt"`.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, '!')
  // > Put a backslash ("\") in front of the first hash for patterns that
  // >   begin with a hash.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, '#')

  const regex = makeRegex(pattern, negative, ignorecase)

  return new IgnoreRule(
    origin,
    pattern,
    negative,
    regex
  )
}

const throwError = (message, Ctor) => {
  throw new Ctor(message)
}

const checkPath = (path, originalPath, doThrow) => {
  if (!isString(path)) {
    return doThrow(
      `path must be a string, but got \`${originalPath}\``,
      TypeError
    )
  }

  // We don't know if we should ignore '', so throw
  if (!path) {
    return doThrow(`path must not be empty`, TypeError)
  }

  // Check if it is a relative path
  if (checkPath.isNotRelative(path)) {
    const r = '`path.relative()`d'
    return doThrow(
      `path should be a ${r} string, but got "${originalPath}"`,
      RangeError
    )
  }

  return true
}

const isNotRelative = path => REGEX_TEST_INVALID_PATH.test(path)

checkPath.isNotRelative = isNotRelative
checkPath.convert = p => p

class Ignore {
  constructor ({
    ignorecase = true
  } = {}) {
    this._rules = []
    this._ignorecase = ignorecase
    define(this, KEY_IGNORE, true)
    this._initCache()
  }

  _initCache () {
    this._ignoreCache = Object.create(null)
    this._testCache = Object.create(null)
  }

  _addPattern (pattern) {
    // #32
    if (pattern && pattern[KEY_IGNORE]) {
      this._rules = this._rules.concat(pattern._rules)
      this._added = true
      return
    }

    if (checkPattern(pattern)) {
      const rule = createRule(pattern, this._ignorecase)
      this._added = true
      this._rules.push(rule)
    }
  }

  // @param {Array<string> | string | Ignore} pattern
  add (pattern) {
    this._added = false

    makeArray(
      isString(pattern)
        ? splitPattern(pattern)
        : pattern
    ).forEach(this._addPattern, this)

    // Some rules have just added to the ignore,
    // making the behavior changed.
    if (this._added) {
      this._initCache()
    }

    return this
  }

  // legacy
  addPattern (pattern) {
    return this.add(pattern)
  }

  //          |           ignored : unignored
  // negative |   0:0   |   0:1   |   1:0   |   1:1
  // -------- | ------- | ------- | ------- | --------
  //     0    |  TEST   |  TEST   |  SKIP   |    X
  //     1    |  TESTIF |  SKIP   |  TEST   |    X

  // - SKIP: always skip
  // - TEST: always test
  // - TESTIF: only test if checkUnignored
  // - X: that never happen

  // @param {boolean} whether should check if the path is unignored,
  //   setting `checkUnignored` to `false` could reduce additional
  //   path matching.

  // @returns {TestResult} true if a file is ignored
  _testOne (path, checkUnignored) {
    let ignored = false
    let unignored = false

    this._rules.forEach(rule => {
      const {negative} = rule
      if (
        unignored === negative && ignored !== unignored
        || negative && !ignored && !unignored && !checkUnignored
      ) {
        return
      }

      const matched = rule.regex.test(path)

      if (matched) {
        ignored = !negative
        unignored = negative
      }
    })

    return {
      ignored,
      unignored
    }
  }

  // @returns {TestResult}
  _test (originalPath, cache, checkUnignored, slices) {
    const path = originalPath
      // Supports nullable path
      && checkPath.convert(originalPath)

    checkPath(path, originalPath, throwError)

    return this._t(path, cache, checkUnignored, slices)
  }

  _t (path, cache, checkUnignored, slices) {
    if (path in cache) {
      return cache[path]
    }

    if (!slices) {
      // path/to/a.js
      // ['path', 'to', 'a.js']
      slices = path.split(SLASH)
    }

    slices.pop()

    // If the path has no parent directory, just test it
    if (!slices.length) {
      return cache[path] = this._testOne(path, checkUnignored)
    }

    const parent = this._t(
      slices.join(SLASH) + SLASH,
      cache,
      checkUnignored,
      slices
    )

    // If the path contains a parent directory, check the parent first
    return cache[path] = parent.ignored
      // > It is not possible to re-include a file if a parent directory of
      // >   that file is excluded.
      ? parent
      : this._testOne(path, checkUnignored)
  }

  ignores (path) {
    return this._test(path, this._ignoreCache, false).ignored
  }

  createFilter () {
    return path => !this.ignores(path)
  }

  filter (paths) {
    return makeArray(paths).filter(this.createFilter())
  }

  // @returns {TestResult}
  test (path) {
    return this._test(path, this._testCache, true)
  }
}

const factory = options => new Ignore(options)

const returnFalse = () => false

const isPathValid = path =>
  checkPath(path && checkPath.convert(path), path, returnFalse)

factory.isPathValid = isPathValid

// Fixes typescript
factory.default = factory

module.exports = factory

// Windows
// --------------------------------------------------------------
/* istanbul ignore if  */
if (
  // Detect `process` so that it can run in browsers.
  typeof process !== 'undefined'
  && (
    process.env && process.env.IGNORE_TEST_WIN32
    || process.platform === 'win32'
  )
) {
  /* eslint no-control-regex: "off" */
  const makePosix = str => /^\\\\\?\\/.test(str)
  || /["<>|\u0000-\u001F]+/u.test(str)
    ? str
    : str.replace(/\\/g, '/')

  checkPath.convert = makePosix

  // 'C:\\foo'     <- 'C:\\foo' has been converted to 'C:/'
  // 'd:\\foo'
  const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i
  checkPath.isNotRelative = path =>
    REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path)
    || isNotRelative(path)
}


/***/ }),
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = Octokit

const { request } = __webpack_require__(753)
const Hook = __webpack_require__(523)

const parseClientOptions = __webpack_require__(294)

function Octokit (plugins, options) {
  options = options || {}
  const hook = new Hook.Collection()
  const log = Object.assign({
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error
  }, options && options.log)
  const api = {
    hook,
    log,
    request: request.defaults(parseClientOptions(options, log, hook))
  }

  plugins.forEach(pluginFunction => pluginFunction(api, options))

  return api
}


/***/ }),
/* 403 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(622);
const fsStat = __webpack_require__(858);
const fs = __webpack_require__(874);
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
        this.fs = fs.createFileSystemAdapter(this._options.fs);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
        this.stats = this._getValue(this._options.stats, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
        this.fsStatSettings = new fsStat.Settings({
            followSymbolicLink: this.followSymbolicLinks,
            fs: this.fs,
            throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),
/* 404 */,
/* 405 */,
/* 406 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const taskManager = __webpack_require__(384);
const async_1 = __webpack_require__(113);
const stream_1 = __webpack_require__(775);
const sync_1 = __webpack_require__(78);
const settings_1 = __webpack_require__(332);
const utils = __webpack_require__(444);
function FastGlob(source, options) {
    try {
        assertPatternsInput(source);
    }
    catch (error) {
        return Promise.reject(error);
    }
    const works = getWorks(source, async_1.default, options);
    return Promise.all(works).then(utils.array.flatten);
}
(function (FastGlob) {
    function sync(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, sync_1.default, options);
        return utils.array.flatten(works);
    }
    FastGlob.sync = sync;
    function stream(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, stream_1.default, options);
        /**
         * The stream returned by the provider cannot work with an asynchronous iterator.
         * To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
         * This affects performance (+25%). I don't see best solution right now.
         */
        return utils.stream.merge(works);
    }
    FastGlob.stream = stream;
    function generateTasks(source, options) {
        assertPatternsInput(source);
        const patterns = [].concat(source);
        const settings = new settings_1.default(options);
        return taskManager.generate(patterns, settings);
    }
    FastGlob.generateTasks = generateTasks;
})(FastGlob || (FastGlob = {}));
function getWorks(source, _Provider, options) {
    const patterns = [].concat(source);
    const settings = new settings_1.default(options);
    const tasks = taskManager.generate(patterns, settings);
    const provider = new _Provider(settings);
    return tasks.map(provider.read, provider);
}
function assertPatternsInput(source) {
    if ([].concat(source).every(isString)) {
        return;
    }
    throw new TypeError('Patterns must be a string or an array of strings');
}
function isString(source) {
    /* tslint:disable-next-line strict-type-predicates */
    return typeof source === 'string';
}
module.exports = FastGlob;


/***/ }),
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */
/***/ (function(module) {

module.exports = require("stream");

/***/ }),
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(622);
/**
 * Designed to work only with simple paths: `dir\\file`.
 */
function unixify(filepath) {
    return filepath.replace(/\\/g, '/');
}
exports.unixify = unixify;
function makeAbsolute(cwd, filepath) {
    return path.resolve(cwd, filepath);
}
exports.makeAbsolute = makeAbsolute;


/***/ }),
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */,
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

// Older verions of Node.js might not have `util.getSystemErrorName()`.
// In that case, fall back to a deprecated internal.
const util = __webpack_require__(669);

let uv;

if (typeof util.getSystemErrorName === 'function') {
	module.exports = util.getSystemErrorName;
} else {
	try {
		uv = process.binding('uv');

		if (typeof uv.errname !== 'function') {
			throw new TypeError('uv.errname is not a function');
		}
	} catch (err) {
		console.error('execa/lib/errname: unable to establish process.binding(\'uv\')', err);
		uv = null;
	}

	module.exports = code => errname(uv, code);
}

// Used for testing the fallback behavior
module.exports.__test__ = errname;

function errname(uv, code) {
	if (uv) {
		return uv.errname(code);
	}

	if (!(code < 0)) {
		throw new Error('err >= 0');
	}

	return `Unknown system error ${code}`;
}



/***/ }),
/* 428 */,
/* 429 */,
/* 430 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = octokitValidate

const validate = __webpack_require__(348)

function octokitValidate (octokit) {
  octokit.hook.before('request', validate.bind(null, octokit))
}


/***/ }),
/* 431 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(87);
/**
 * Commands
 *
 * Command Format:
 *   ##[name key=value;key=value]message
 *
 * Examples:
 *   ##[warning]This is the user warning message
 *   ##[set-secret name=mypassword]definitelyNotAPassword!
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_PREFIX = '##[';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_PREFIX + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        // safely append the val - avoid blowing up when attempting to
                        // call .replace() if message is not a string for some reason
                        cmdStr += `${key}=${escape(`${val || ''}`)};`;
                    }
                }
            }
        }
        cmdStr += ']';
        // safely append the message - avoid blowing up when attempting to
        // call .replace() if message is not a string for some reason
        const message = `${this.message || ''}`;
        cmdStr += escapeData(message);
        return cmdStr;
    }
}
function escapeData(s) {
    return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}
function escape(s) {
    return s
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/]/g, '%5D')
        .replace(/;/g, '%3B');
}
//# sourceMappingURL=command.js.map

/***/ }),
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const fill = __webpack_require__(730);
const utils = __webpack_require__(225);

const compile = (ast, options = {}) => {
  let walk = (node, parent = {}) => {
    let invalidBlock = utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let invalid = invalidBlock === true || invalidNode === true;
    let prefix = options.escapeInvalid === true ? '\\' : '';
    let output = '';

    if (node.isOpen === true) {
      return prefix + node.value;
    }
    if (node.isClose === true) {
      return prefix + node.value;
    }

    if (node.type === 'open') {
      return invalid ? (prefix + node.value) : '(';
    }

    if (node.type === 'close') {
      return invalid ? (prefix + node.value) : ')';
    }

    if (node.type === 'comma') {
      return node.prev.type === 'comma' ? '' : (invalid ? node.value : '|');
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);
      let range = fill(...args, { ...options, wrap: false, toRegex: true });

      if (range.length !== 0) {
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += walk(child, node);
      }
    }
    return output;
  };

  return walk(ast);
};

module.exports = compile;


/***/ }),
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */,
/* 440 */
/***/ (function(module) {

"use strict";


function reusify (Constructor) {
  var head = new Constructor()
  var tail = head

  function get () {
    var current = head

    if (current.next) {
      head = current.next
    } else {
      head = new Constructor()
      tail = head
    }

    current.next = null

    return current
  }

  function release (obj) {
    tail.next = obj
    tail = obj
  }

  return {
    get: get,
    release: release
  }
}

module.exports = reusify


/***/ }),
/* 441 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const fill = __webpack_require__(730);
const stringify = __webpack_require__(382);
const utils = __webpack_require__(225);

const append = (queue = '', stash = '', enclose = false) => {
  let result = [];

  queue = [].concat(queue);
  stash = [].concat(stash);

  if (!stash.length) return queue;
  if (!queue.length) {
    return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
  }

  for (let item of queue) {
    if (Array.isArray(item)) {
      for (let value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : (item + ele));
      }
    }
  }
  return utils.flatten(result);
};

const expand = (ast, options = {}) => {
  let rangeLimit = options.rangeLimit === void 0 ? 1000 : options.rangeLimit;

  let walk = (node, parent = {}) => {
    node.queue = [];

    let p = parent;
    let q = parent.queue;

    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
      p = p.parent;
      q = p.queue;
    }

    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ['{}']));
      return;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);

      if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
      }

      let range = fill(...args, options);
      if (range.length === 0) {
        range = stringify(node, options);
      }

      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }

    let enclose = utils.encloseBrace(node);
    let queue = node.queue;
    let block = node;

    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
      block = block.parent;
      queue = block.queue;
    }

    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];

      if (child.type === 'comma' && node.type === 'brace') {
        if (i === 1) queue.push('');
        queue.push('');
        continue;
      }

      if (child.type === 'close') {
        q.push(append(q.pop(), queue, enclose));
        continue;
      }

      if (child.value && child.type !== 'open') {
        queue.push(append(queue.pop(), child.value));
        continue;
      }

      if (child.nodes) {
        walk(child, node);
      }
    }

    return queue;
  };

  return utils.flatten(walk(ast));
};

module.exports = expand;


/***/ }),
/* 442 */,
/* 443 */,
/* 444 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const array = __webpack_require__(231);
exports.array = array;
const errno = __webpack_require__(115);
exports.errno = errno;
const fs = __webpack_require__(43);
exports.fs = fs;
const path = __webpack_require__(418);
exports.path = path;
const pattern = __webpack_require__(724);
exports.pattern = pattern;
const stream = __webpack_require__(42);
exports.stream = stream;


/***/ }),
/* 445 */,
/* 446 */,
/* 447 */,
/* 448 */,
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */,
/* 453 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(969)
var eos = __webpack_require__(9)
var fs = __webpack_require__(747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),
/* 454 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__webpack_require__(413));
var http = _interopDefault(__webpack_require__(605));
var Url = _interopDefault(__webpack_require__(835));
var https = _interopDefault(__webpack_require__(34));
var zlib = _interopDefault(__webpack_require__(761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __webpack_require__(18).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),
/* 455 */,
/* 456 */,
/* 457 */,
/* 458 */,
/* 459 */,
/* 460 */
/***/ (function(module) {

module.exports = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomsvc+xml":["atomsvc"],"application/bdoc":["bdoc"],"application/ccxml+xml":["ccxml"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma","es"],"application/emma+xml":["emma"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-diff+xml":["xdf"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/ktx":["ktx"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

/***/ }),
/* 461 */,
/* 462 */
/***/ (function(module) {

"use strict";


// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),
/* 463 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __webpack_require__(692);
var once = _interopDefault(__webpack_require__(969));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;


/***/ }),
/* 464 */
/***/ (function(module) {

"use strict";


module.exports = (...arguments_) => {
	return [...new Set([].concat(...arguments_))];
};


/***/ }),
/* 465 */,
/* 466 */,
/* 467 */,
/* 468 */,
/* 469 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Originally pulled from https://github.com/JasonEtco/actions-toolkit/blob/master/src/github.ts
const graphql_1 = __webpack_require__(503);
const rest_1 = __importDefault(__webpack_require__(613));
const Context = __importStar(__webpack_require__(262));
// We need this in order to extend Octokit
rest_1.default.prototype = new rest_1.default();
exports.context = new Context.Context();
class GitHub extends rest_1.default {
    constructor(token, opts = {}) {
        super(Object.assign(Object.assign({}, opts), { auth: `token ${token}` }));
        this.graphql = graphql_1.defaults({
            headers: { authorization: `token ${token}` }
        });
    }
}
exports.GitHub = GitHub;
//# sourceMappingURL=github.js.map

/***/ }),
/* 470 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const path = __webpack_require__(622);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * exports the variable and registers a secret which will get masked from logs
 * @param name the name of the variable to set
 * @param val value of the secret
 */
function exportSecret(name, val) {
    exportVariable(name, val);
    // the runner will error with not implemented
    // leaving the function but raising the error earlier
    command_1.issueCommand('set-secret', {}, val);
    throw new Error('Not implemented.');
}
exports.exportSecret = exportSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(' ', '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
}
exports.warning = warning;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//# sourceMappingURL=core.js.map

/***/ }),
/* 471 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest

const btoa = __webpack_require__(675)
const uniq = __webpack_require__(126)

function authenticationBeforeRequest (state, options) {
  if (!state.auth.type) {
    return
  }

  if (state.auth.type === 'basic') {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`)
    options.headers.authorization = `Basic ${hash}`
    return
  }

  if (state.auth.type === 'token') {
    options.headers.authorization = `token ${state.auth.token}`
    return
  }

  if (state.auth.type === 'app') {
    options.headers.authorization = `Bearer ${state.auth.token}`
    const acceptHeaders = options.headers.accept.split(',')
      .concat('application/vnd.github.machine-man-preview+json')
    options.headers.accept = uniq(acceptHeaders).filter(Boolean).join(',')
    return
  }

  options.url += options.url.indexOf('?') === -1 ? '?' : '&'

  if (state.auth.token) {
    options.url += `access_token=${encodeURIComponent(state.auth.token)}`
    return
  }

  const key = encodeURIComponent(state.auth.key)
  const secret = encodeURIComponent(state.auth.secret)
  options.url += `client_id=${key}&client_secret=${secret}`
}


/***/ }),
/* 472 */,
/* 473 */,
/* 474 */,
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */,
/* 481 */,
/* 482 */,
/* 483 */,
/* 484 */,
/* 485 */,
/* 486 */
/***/ (function(module, __unusedexports, __webpack_require__) {

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isExtglob = __webpack_require__(888);
var chars = { '{': '}', '(': ')', '[': ']'};
var strictRegex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
var relaxedRegex = /\\(.)|(^!|[*?{}()[\]]|\(\?)/;

module.exports = function isGlob(str, options) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  if (isExtglob(str)) {
    return true;
  }

  var regex = strictRegex;
  var match;

  // optionally relax regex
  if (options && options.strict === false) {
    regex = relaxedRegex;
  }

  while ((match = regex.exec(str))) {
    if (match[2]) return true;
    var idx = match.index + match[0].length;

    // if an open bracket/brace/paren is escaped,
    // set the index to the next closing character
    var open = match[1];
    var close = open ? chars[open] : null;
    if (open && close) {
      var n = str.indexOf(close, idx);
      if (n !== -1) {
        idx = n + 1;
      }
    }

    str = str.slice(idx);
  }
  return false;
};


/***/ }),
/* 487 */,
/* 488 */,
/* 489 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const which = __webpack_require__(814);
const pathKey = __webpack_require__(39)();

function resolveCommandAttempt(parsed, withoutPathExt) {
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (hasCustomCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: (parsed.options.env || process.env)[pathKey],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        process.chdir(cwd);
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),
/* 490 */,
/* 491 */,
/* 492 */,
/* 493 */,
/* 494 */,
/* 495 */,
/* 496 */,
/* 497 */,
/* 498 */,
/* 499 */,
/* 500 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = graphql

const GraphqlError = __webpack_require__(862)

const NON_VARIABLE_OPTIONS = ['method', 'baseUrl', 'url', 'headers', 'request', 'query']

function graphql (request, query, options) {
  if (typeof query === 'string') {
    options = Object.assign({ query }, options)
  } else {
    options = query
  }

  const requestOptions = Object.keys(options).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = options[key]
      return result
    }

    if (!result.variables) {
      result.variables = {}
    }

    result.variables[key] = options[key]
    return result
  }, {})

  return request(requestOptions)
    .then(response => {
      if (response.data.errors) {
        throw new GraphqlError(requestOptions, response)
      }

      return response.data.data
    })
}


/***/ }),
/* 501 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

const {promisify} = __webpack_require__(669);
const fs = __webpack_require__(747);

async function isType(fsStatType, statsMethodName, filePath) {
	if (typeof filePath !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof filePath}`);
	}

	try {
		const stats = await promisify(fs[fsStatType])(filePath);
		return stats[statsMethodName]();
	} catch (error) {
		if (error.code === 'ENOENT') {
			return false;
		}

		throw error;
	}
}

function isTypeSync(fsStatType, statsMethodName, filePath) {
	if (typeof filePath !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof filePath}`);
	}

	try {
		return fs[fsStatType](filePath)[statsMethodName]();
	} catch (error) {
		if (error.code === 'ENOENT') {
			return false;
		}

		throw error;
	}
}

exports.isFile = isType.bind(null, 'stat', 'isFile');
exports.isDirectory = isType.bind(null, 'stat', 'isDirectory');
exports.isSymlink = isType.bind(null, 'lstat', 'isSymbolicLink');
exports.isFileSync = isTypeSync.bind(null, 'statSync', 'isFile');
exports.isDirectorySync = isTypeSync.bind(null, 'statSync', 'isDirectory');
exports.isSymlinkSync = isTypeSync.bind(null, 'lstatSync', 'isSymbolicLink');


/***/ }),
/* 502 */,
/* 503 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const { request } = __webpack_require__(753)
const getUserAgent = __webpack_require__(46)

const version = __webpack_require__(314).version
const userAgent = `octokit-graphql.js/${version} ${getUserAgent()}`

const withDefaults = __webpack_require__(0)

module.exports = withDefaults(request, {
  method: 'POST',
  url: '/graphql',
  headers: {
    'user-agent': userAgent
  }
})


/***/ }),
/* 504 */,
/* 505 */,
/* 506 */,
/* 507 */,
/* 508 */,
/* 509 */,
/* 510 */
/***/ (function(module) {

module.exports = addHook

function addHook (state, kind, name, hook) {
  var orig = hook
  if (!state.registry[name]) {
    state.registry[name] = []
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    }
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    }
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    }
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  })
}


/***/ }),
/* 511 */,
/* 512 */,
/* 513 */,
/* 514 */,
/* 515 */,
/* 516 */,
/* 517 */,
/* 518 */,
/* 519 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(858);
const fsWalk = __webpack_require__(522);
const reader_1 = __webpack_require__(949);
class ReaderSync extends reader_1.default {
    constructor() {
        super(...arguments);
        this._walkSync = fsWalk.walkSync;
        this._statSync = fsStat.statSync;
    }
    dynamic(root, options) {
        return this._walkSync(root, options);
    }
    static(patterns, options) {
        const entries = [];
        for (const pattern of patterns) {
            const filepath = this._getFullEntryPath(pattern);
            const entry = this._getEntry(filepath, pattern, options);
            if (entry === null || !options.entryFilter(entry)) {
                continue;
            }
            entries.push(entry);
        }
        return entries;
    }
    _getEntry(filepath, pattern, options) {
        try {
            const stats = this._getStat(filepath);
            return this._makeEntry(stats, pattern);
        }
        catch (error) {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        }
    }
    _getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
    }
}
exports.default = ReaderSync;


/***/ }),
/* 520 */,
/* 521 */,
/* 522 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = __webpack_require__(387);
const stream_1 = __webpack_require__(798);
const sync_1 = __webpack_require__(833);
const settings_1 = __webpack_require__(611);
exports.Settings = settings_1.default;
function walk(dir, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return new async_1.default(dir, getSettings()).read(optionsOrSettingsOrCallback);
    }
    new async_1.default(dir, getSettings(optionsOrSettingsOrCallback)).read(callback);
}
exports.walk = walk;
function walkSync(dir, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new sync_1.default(dir, settings);
    return provider.read();
}
exports.walkSync = walkSync;
function walkStream(dir, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new stream_1.default(dir, settings);
    return provider.read();
}
exports.walkStream = walkStream;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),
/* 523 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var register = __webpack_require__(363)
var addHook = __webpack_require__(510)
var removeHook = __webpack_require__(763)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),
/* 524 */,
/* 525 */,
/* 526 */,
/* 527 */,
/* 528 */,
/* 529 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const factory = __webpack_require__(47)

module.exports = factory()


/***/ }),
/* 530 */,
/* 531 */,
/* 532 */,
/* 533 */,
/* 534 */,
/* 535 */,
/* 536 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasFirstPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasFirstPage (link) {
  deprecate(`octokit.hasFirstPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).first
}


/***/ }),
/* 537 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(224);

const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET /* ] */
} = __webpack_require__(199);

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), and `negated` (true if the path starts with `!`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

module.exports = (input, options) => {
  let opts = options || {};
  let length = input.length - 1;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isGlob = false;
  let backslashes = false;
  let negated = false;
  let braces = 0;
  let prev;
  let code;

  let braceEscaped = false;

  let eos = () => index >= length;
  let advance = () => {
    prev = code;
    return input.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = true;
      next = advance();

      if (next === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (!eos() && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = true;
          next = advance();
          continue;
        }

        if (next === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (!braceEscaped && next === CHAR_DOT && (next = advance()) === CHAR_DOT) {
          isGlob = true;
          break;
        }

        if (!braceEscaped && next === CHAR_COMMA) {
          isGlob = true;
          break;
        }

        if (next === CHAR_RIGHT_CURLY_BRACE) {
          braces--;
          if (braces === 0) {
            braceEscaped = false;
            break;
          }
        }
      }
    }

    if (code === CHAR_FORWARD_SLASH) {
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (code === CHAR_ASTERISK) {
      isGlob = true;
      break;
    }

    if (code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK) {
      isGlob = true;
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (!eos() && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = true;
          next = advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isGlob = true;
          break;
        }
      }
    }

    let isExtglobChar = code === CHAR_PLUS
      || code === CHAR_AT
      || code === CHAR_EXCLAMATION_MARK;

    if (isExtglobChar && input.charCodeAt(index + 1) === CHAR_LEFT_PARENTHESES) {
      isGlob = true;
      break;
    }

    if (code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = true;
      start++;
      continue;
    }

    if (code === CHAR_LEFT_PARENTHESES) {
      while (!eos() && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = true;
          next = advance();
          continue;
        }

        if (next === CHAR_RIGHT_PARENTHESES) {
          isGlob = true;
          break;
        }
      }
    }

    if (isGlob) {
      break;
    }
  }

  let prefix = '';
  let orig = input;
  let base = input;
  let glob = '';

  if (start > 0) {
    prefix = input.slice(0, start);
    input = input.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = input.slice(0, lastIndex);
    glob = input.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = input;
  } else {
    base = input;
  }

  if (base && base !== '' && base !== '/' && base !== input) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils.removeBackslashes(base);
    }
  }

  return { prefix, input: orig, base, glob, negated, isGlob };
};


/***/ }),
/* 538 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

/*
 * merge2
 * https://github.com/teambition/merge2
 *
 * Copyright (c) 2014-2016 Teambition
 * Licensed under the MIT license.
 */
const Stream = __webpack_require__(413)
const PassThrough = Stream.PassThrough
const slice = Array.prototype.slice

module.exports = merge2

function merge2 () {
  const streamsQueue = []
  let merging = false
  const args = slice.call(arguments)
  let options = args[args.length - 1]

  if (options && !Array.isArray(options) && options.pipe == null) args.pop()
  else options = {}

  const doEnd = options.end !== false
  if (options.objectMode == null) options.objectMode = true
  if (options.highWaterMark == null) options.highWaterMark = 64 * 1024
  const mergedStream = PassThrough(options)

  function addStream () {
    for (let i = 0, len = arguments.length; i < len; i++) {
      streamsQueue.push(pauseStreams(arguments[i], options))
    }
    mergeStream()
    return this
  }

  function mergeStream () {
    if (merging) return
    merging = true

    let streams = streamsQueue.shift()
    if (!streams) {
      process.nextTick(endStream)
      return
    }
    if (!Array.isArray(streams)) streams = [streams]

    let pipesCount = streams.length + 1

    function next () {
      if (--pipesCount > 0) return
      merging = false
      mergeStream()
    }

    function pipe (stream) {
      function onend () {
        stream.removeListener('merge2UnpipeEnd', onend)
        stream.removeListener('end', onend)
        next()
      }
      // skip ended stream
      if (stream._readableState.endEmitted) return next()

      stream.on('merge2UnpipeEnd', onend)
      stream.on('end', onend)
      stream.pipe(mergedStream, { end: false })
      // compatible for old stream
      stream.resume()
    }

    for (let i = 0; i < streams.length; i++) pipe(streams[i])

    next()
  }

  function endStream () {
    merging = false
    // emit 'queueDrain' when all streams merged.
    mergedStream.emit('queueDrain')
    return doEnd && mergedStream.end()
  }

  mergedStream.setMaxListeners(0)
  mergedStream.add = addStream
  mergedStream.on('unpipe', function (stream) {
    stream.emit('merge2UnpipeEnd')
  })

  if (args.length) addStream.apply(null, args)
  return mergedStream
}

// check and pause streams for pipe.
function pauseStreams (streams, options) {
  if (!Array.isArray(streams)) {
    // Backwards-compat with old-style streams
    if (!streams._readableState && streams.pipe) streams = streams.pipe(PassThrough(options))
    if (!streams._readableState || !streams.pause || !streams.pipe) {
      throw new Error('Only readable stream can be merged.')
    }
    streams.pause()
  } else {
    for (let i = 0, len = streams.length; i < len; i++) streams[i] = pauseStreams(streams[i], options)
  }
  return streams
}


/***/ }),
/* 539 */,
/* 540 */,
/* 541 */,
/* 542 */,
/* 543 */,
/* 544 */,
/* 545 */,
/* 546 */,
/* 547 */,
/* 548 */,
/* 549 */,
/* 550 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getNextPage

const getPage = __webpack_require__(265)

function getNextPage (octokit, link, headers) {
  return getPage(octokit, link, 'next', headers)
}


/***/ }),
/* 551 */,
/* 552 */,
/* 553 */,
/* 554 */,
/* 555 */,
/* 556 */,
/* 557 */,
/* 558 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasPreviousPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasPreviousPage (link) {
  deprecate(`octokit.hasPreviousPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).prev
}


/***/ }),
/* 559 */,
/* 560 */,
/* 561 */,
/* 562 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(2));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    throw error;
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),
/* 563 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPreviousPage

const getPage = __webpack_require__(265)

function getPreviousPage (octokit, link, headers) {
  return getPage(octokit, link, 'prev', headers)
}


/***/ }),
/* 564 */,
/* 565 */,
/* 566 */,
/* 567 */,
/* 568 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const niceTry = __webpack_require__(948);
const resolveCommand = __webpack_require__(489);
const escape = __webpack_require__(462);
const readShebang = __webpack_require__(389);
const semver = __webpack_require__(280);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

// `options.shell` is supported in Node ^4.8.0, ^5.7.0 and >= 6.0.0
const supportsShellOption = niceTry(() => semver.satisfies(process.version, '^4.8.0 || ^5.7.0 || >= 6.0.0', true)) || false;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parseShell(parsed) {
    // If node supports the shell option, there's no need to mimic its behavior
    if (supportsShellOption) {
        return parsed;
    }

    // Mimic node shell option
    // See https://github.com/nodejs/node/blob/b9f6a2dc059a1062776133f3d4fd848c4da7d150/lib/child_process.js#L335
    const shellCommand = [parsed.command].concat(parsed.args).join(' ');

    if (isWin) {
        parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    } else {
        if (typeof parsed.options.shell === 'string') {
            parsed.command = parsed.options.shell;
        } else if (process.platform === 'android') {
            parsed.command = '/system/bin/sh';
        } else {
            parsed.command = '/bin/sh';
        }

        parsed.args = ['-c', shellCommand];
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parseShell(parsed) : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),
/* 569 */,
/* 570 */,
/* 571 */,
/* 572 */,
/* 573 */,
/* 574 */,
/* 575 */,
/* 576 */,
/* 577 */
/***/ (function(module) {

module.exports = getPageLinks

function getPageLinks (link) {
  link = link.link || link.headers.link || ''

  const links = {}

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type) => {
    links[type] = uri
  })

  return links
}


/***/ }),
/* 578 */,
/* 579 */,
/* 580 */,
/* 581 */,
/* 582 */,
/* 583 */,
/* 584 */,
/* 585 */,
/* 586 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = octokitRestApiEndpoints

const ROUTES = __webpack_require__(705)

function octokitRestApiEndpoints (octokit) {
  // Aliasing scopes for backward compatibility
  // See https://github.com/octokit/rest.js/pull/1134
  ROUTES.gitdata = ROUTES.git
  ROUTES.authorization = ROUTES.oauthAuthorizations
  ROUTES.pullRequests = ROUTES.pulls

  octokit.registerEndpoints(ROUTES)
}


/***/ }),
/* 587 */,
/* 588 */,
/* 589 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(622);
const deep_1 = __webpack_require__(887);
const entry_1 = __webpack_require__(703);
const error_1 = __webpack_require__(375);
const entry_2 = __webpack_require__(317);
class Provider {
    constructor(_settings) {
        this._settings = _settings;
        this.errorFilter = new error_1.default(this._settings);
        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
        this.entryTransformer = new entry_2.default(this._settings);
    }
    _getRootDirectory(task) {
        return path.resolve(this._settings.cwd, task.base);
    }
    _getReaderOptions(task) {
        const basePath = task.base === '.' ? '' : task.base;
        return {
            basePath,
            pathSegmentSeparator: '/',
            concurrency: this._settings.concurrency,
            deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
            entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
            errorFilter: this.errorFilter.getFilter(),
            followSymbolicLinks: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            stats: this._settings.stats,
            throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
            transform: this.entryTransformer.getTransformer()
        };
    }
    _getMicromatchOptions() {
        return {
            dot: this._settings.dot,
            matchBase: this._settings.baseNameMatch,
            nobrace: !this._settings.braceExpansion,
            nocase: !this._settings.caseSensitiveMatch,
            noext: !this._settings.extglob,
            noglobstar: !this._settings.globstar,
            posix: true,
            strictSlashes: false
        };
    }
}
exports.default = Provider;


/***/ }),
/* 590 */,
/* 591 */,
/* 592 */,
/* 593 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function read(path, settings) {
    const lstat = settings.fs.lstatSync(path);
    if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
        return lstat;
    }
    try {
        const stat = settings.fs.statSync(path);
        if (settings.markSymbolicLink) {
            stat.isSymbolicLink = () => true;
        }
        return stat;
    }
    catch (error) {
        if (!settings.throwErrorOnBrokenSymbolicLink) {
            return lstat;
        }
        throw error;
    }
}
exports.read = read;


/***/ }),
/* 594 */,
/* 595 */,
/* 596 */,
/* 597 */,
/* 598 */,
/* 599 */,
/* 600 */,
/* 601 */,
/* 602 */,
/* 603 */,
/* 604 */,
/* 605 */
/***/ (function(module) {

module.exports = require("http");

/***/ }),
/* 606 */,
/* 607 */,
/* 608 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(413);
const fsStat = __webpack_require__(858);
const fsWalk = __webpack_require__(522);
const reader_1 = __webpack_require__(949);
class ReaderStream extends reader_1.default {
    constructor() {
        super(...arguments);
        this._walkStream = fsWalk.walkStream;
        this._stat = fsStat.stat;
    }
    dynamic(root, options) {
        return this._walkStream(root, options);
    }
    static(patterns, options) {
        const filepaths = patterns.map(this._getFullEntryPath, this);
        const stream = new stream_1.PassThrough({ objectMode: true });
        stream._write = (index, _enc, done) => {
            return this._getEntry(filepaths[index], patterns[index], options)
                .then((entry) => {
                if (entry !== null && options.entryFilter(entry)) {
                    stream.push(entry);
                }
                if (index === filepaths.length - 1) {
                    stream.end();
                }
                done();
            })
                .catch(done);
        };
        for (let i = 0; i < filepaths.length; i++) {
            stream.write(i);
        }
        return stream;
    }
    _getEntry(filepath, pattern, options) {
        return this._getStat(filepath)
            .then((stats) => this._makeEntry(stats, pattern))
            .catch((error) => {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        });
    }
    _getStat(filepath) {
        return new Promise((resolve, reject) => {
            this._stat(filepath, this._fsStatSettings, (error, stats) => {
                error ? reject(error) : resolve(stats);
            });
        });
    }
}
exports.default = ReaderStream;


/***/ }),
/* 609 */,
/* 610 */,
/* 611 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(622);
const fsScandir = __webpack_require__(661);
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.basePath = this._getValue(this._options.basePath, undefined);
        this.concurrency = this._getValue(this._options.concurrency, Infinity);
        this.deepFilter = this._getValue(this._options.deepFilter, null);
        this.entryFilter = this._getValue(this._options.entryFilter, null);
        this.errorFilter = this._getValue(this._options.errorFilter, null);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
        this.fsScandirSettings = new fsScandir.Settings({
            followSymbolicLinks: this._options.followSymbolicLinks,
            fs: this._options.fs,
            pathSegmentSeparator: this._options.pathSegmentSeparator,
            stats: this._options.stats,
            throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),
/* 612 */,
/* 613 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const Octokit = __webpack_require__(529)

const CORE_PLUGINS = [
  __webpack_require__(372),
  __webpack_require__(19), // deprecated: remove in v17
  __webpack_require__(190),
  __webpack_require__(148),
  __webpack_require__(309),
  __webpack_require__(248),
  __webpack_require__(586),
  __webpack_require__(430),

  __webpack_require__(850) // deprecated: remove in v17
]

module.exports = Octokit.plugin(CORE_PLUGINS)


/***/ }),
/* 614 */
/***/ (function(module) {

module.exports = require("events");

/***/ }),
/* 615 */,
/* 616 */,
/* 617 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isFatalError(settings, error) {
    if (settings.errorFilter === null) {
        return true;
    }
    return !settings.errorFilter(error);
}
exports.isFatalError = isFatalError;
function isAppliedFilter(filter, value) {
    return filter === null || filter(value);
}
exports.isAppliedFilter = isAppliedFilter;
function replacePathSegmentSeparator(filepath, separator) {
    return filepath.split(/[\\\/]/).join(separator);
}
exports.replacePathSegmentSeparator = replacePathSegmentSeparator;
function joinPathSegments(a, b, separator) {
    if (a === '') {
        return b;
    }
    return a + separator + b;
}
exports.joinPathSegments = joinPathSegments;


/***/ }),
/* 618 */,
/* 619 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(2));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    throw error;
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),
/* 620 */,
/* 621 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(622);
const pathKey = __webpack_require__(39);

module.exports = opts => {
	opts = Object.assign({
		cwd: process.cwd(),
		path: process.env[pathKey()]
	}, opts);

	let prev;
	let pth = path.resolve(opts.cwd);
	const ret = [];

	while (prev !== pth) {
		ret.push(path.join(pth, 'node_modules/.bin'));
		prev = pth;
		pth = path.resolve(pth, '..');
	}

	// ensure the running `node` binary is used
	ret.push(path.dirname(process.execPath));

	return ret.concat(opts.path).join(path.delimiter);
};

module.exports.env = opts => {
	opts = Object.assign({
		env: process.env
	}, opts);

	const env = Object.assign({}, opts.env);
	const path = pathKey({env});

	opts.path = env[path];
	env[path] = module.exports(opts);

	return env;
};


/***/ }),
/* 622 */
/***/ (function(module) {

module.exports = require("path");

/***/ }),
/* 623 */,
/* 624 */,
/* 625 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const fs = __webpack_require__(747);
const arrayUnion = __webpack_require__(464);
const merge2 = __webpack_require__(538);
const glob = __webpack_require__(120);
const fastGlob = __webpack_require__(406);
const dirGlob = __webpack_require__(895);
const gitignore = __webpack_require__(804);
const {FilterStream, UniqueStream} = __webpack_require__(162);

const DEFAULT_FILTER = () => false;

const isNegative = pattern => pattern[0] === '!';

const assertPatternsInput = patterns => {
	if (!patterns.every(pattern => typeof pattern === 'string')) {
		throw new TypeError('Patterns must be a string or an array of strings');
	}
};

const checkCwdOption = (options = {}) => {
	if (!options.cwd) {
		return;
	}

	let stat;
	try {
		stat = fs.statSync(options.cwd);
	} catch (_) {
		return;
	}

	if (!stat.isDirectory()) {
		throw new Error('The `cwd` option must be a path to a directory');
	}
};

const getPathString = p => p.stats instanceof fs.Stats ? p.path : p;

const generateGlobTasks = (patterns, taskOptions) => {
	patterns = arrayUnion([].concat(patterns));
	assertPatternsInput(patterns);
	checkCwdOption(taskOptions);

	const globTasks = [];

	taskOptions = {
		ignore: [],
		expandDirectories: true,
		...taskOptions
	};

	for (const [index, pattern] of patterns.entries()) {
		if (isNegative(pattern)) {
			continue;
		}

		const ignore = patterns
			.slice(index)
			.filter(isNegative)
			.map(pattern => pattern.slice(1));

		const options = {
			...taskOptions,
			ignore: taskOptions.ignore.concat(ignore)
		};

		globTasks.push({pattern, options});
	}

	return globTasks;
};

const globDirs = (task, fn) => {
	let options = {};
	if (task.options.cwd) {
		options.cwd = task.options.cwd;
	}

	if (Array.isArray(task.options.expandDirectories)) {
		options = {
			...options,
			files: task.options.expandDirectories
		};
	} else if (typeof task.options.expandDirectories === 'object') {
		options = {
			...options,
			...task.options.expandDirectories
		};
	}

	return fn(task.pattern, options);
};

const getPattern = (task, fn) => task.options.expandDirectories ? globDirs(task, fn) : [task.pattern];

const getFilterSync = options => {
	return options && options.gitignore ?
		gitignore.sync({cwd: options.cwd, ignore: options.ignore}) :
		DEFAULT_FILTER;
};

const globToTask = task => glob => {
	const {options} = task;
	if (options.ignore && Array.isArray(options.ignore) && options.expandDirectories) {
		options.ignore = dirGlob.sync(options.ignore);
	}

	return {
		pattern: glob,
		options
	};
};

module.exports = async (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const getFilter = async () => {
		return options && options.gitignore ?
			gitignore({cwd: options.cwd, ignore: options.ignore}) :
			DEFAULT_FILTER;
	};

	const getTasks = async () => {
		const tasks = await Promise.all(globTasks.map(async task => {
			const globs = await getPattern(task, dirGlob);
			return Promise.all(globs.map(globToTask(task)));
		}));

		return arrayUnion(...tasks);
	};

	const [filter, tasks] = await Promise.all([getFilter(), getTasks()]);
	const paths = await Promise.all(tasks.map(task => fastGlob(task.pattern, task.options)));

	return arrayUnion(...paths).filter(path_ => !filter(getPathString(path_)));
};

module.exports.sync = (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const tasks = globTasks.reduce((tasks, task) => {
		const newTask = getPattern(task, dirGlob.sync).map(globToTask(task));
		return tasks.concat(newTask);
	}, []);

	const filter = getFilterSync(options);

	return tasks.reduce(
		(matches, task) => arrayUnion(matches, fastGlob.sync(task.pattern, task.options)),
		[]
	).filter(path_ => !filter(path_));
};

module.exports.stream = (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const tasks = globTasks.reduce((tasks, task) => {
		const newTask = getPattern(task, dirGlob.sync).map(globToTask(task));
		return tasks.concat(newTask);
	}, []);

	const filter = getFilterSync(options);
	const filterStream = new FilterStream(p => !filter(p));
	const uniqueStream = new UniqueStream();

	return merge2(tasks.map(task => fastGlob.stream(task.pattern, task.options)))
		.pipe(filterStream)
		.pipe(uniqueStream);
};

module.exports.generateGlobTasks = generateGlobTasks;

module.exports.hasMagic = (patterns, options) => []
	.concat(patterns)
	.some(pattern => glob.hasMagic(pattern, options));

module.exports.gitignore = gitignore;


/***/ }),
/* 626 */,
/* 627 */,
/* 628 */,
/* 629 */,
/* 630 */,
/* 631 */,
/* 632 */,
/* 633 */,
/* 634 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(11)
var reqs = Object.create(null)
var once = __webpack_require__(969)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),
/* 635 */,
/* 636 */,
/* 637 */,
/* 638 */,
/* 639 */,
/* 640 */,
/* 641 */,
/* 642 */,
/* 643 */,
/* 644 */,
/* 645 */,
/* 646 */,
/* 647 */,
/* 648 */,
/* 649 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getLastPage

const getPage = __webpack_require__(265)

function getLastPage (octokit, link, headers) {
  return getPage(octokit, link, 'last', headers)
}


/***/ }),
/* 650 */,
/* 651 */,
/* 652 */,
/* 653 */,
/* 654 */
/***/ (function(module) {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),
/* 655 */,
/* 656 */,
/* 657 */,
/* 658 */,
/* 659 */,
/* 660 */,
/* 661 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async = __webpack_require__(182);
const sync = __webpack_require__(111);
const settings_1 = __webpack_require__(403);
exports.Settings = settings_1.default;
function scandir(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return async.read(path, getSettings(), optionsOrSettingsOrCallback);
    }
    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
}
exports.scandir = scandir;
function scandirSync(path, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    return sync.read(path, settings);
}
exports.scandirSync = scandirSync;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),
/* 662 */,
/* 663 */,
/* 664 */,
/* 665 */,
/* 666 */,
/* 667 */,
/* 668 */,
/* 669 */
/***/ (function(module) {

module.exports = require("util");

/***/ }),
/* 670 */,
/* 671 */,
/* 672 */,
/* 673 */,
/* 674 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticate

const { Deprecation } = __webpack_require__(692)
const once = __webpack_require__(969)

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation))

function authenticate (state, options) {
  deprecateAuthenticate(state.octokit.log, new Deprecation('[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'))

  if (!options) {
    state.auth = false
    return
  }

  switch (options.type) {
    case 'basic':
      if (!options.username || !options.password) {
        throw new Error('Basic authentication requires both a username and password to be set')
      }
      break

    case 'oauth':
      if (!options.token && !(options.key && options.secret)) {
        throw new Error('OAuth2 authentication requires a token or key & secret to be set')
      }
      break

    case 'token':
    case 'app':
      if (!options.token) {
        throw new Error('Token authentication requires a token to be set')
      }
      break

    default:
      throw new Error("Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'")
  }

  state.auth = options
}


/***/ }),
/* 675 */
/***/ (function(module) {

module.exports = function btoa(str) {
  return new Buffer(str).toString('base64')
}


/***/ }),
/* 676 */,
/* 677 */,
/* 678 */,
/* 679 */,
/* 680 */,
/* 681 */
/***/ (function(module) {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),
/* 682 */,
/* 683 */,
/* 684 */,
/* 685 */,
/* 686 */,
/* 687 */,
/* 688 */,
/* 689 */
/***/ (function(module, __unusedexports, __webpack_require__) {

try {
  var util = __webpack_require__(669);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __webpack_require__(315);
}


/***/ }),
/* 690 */,
/* 691 */,
/* 692 */
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),
/* 693 */,
/* 694 */,
/* 695 */,
/* 696 */
/***/ (function(module) {

"use strict";


/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

module.exports = isPlainObject;


/***/ }),
/* 697 */
/***/ (function(module) {

"use strict";

module.exports = (promise, onFinally) => {
	onFinally = onFinally || (() => {});

	return promise.then(
		val => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => val),
		err => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => {
			throw err;
		})
	);
};


/***/ }),
/* 698 */,
/* 699 */,
/* 700 */,
/* 701 */,
/* 702 */,
/* 703 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(444);
class EntryFilter {
    constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this.index = new Map();
    }
    getFilter(positive, negative) {
        const positiveRe = utils.pattern.convertPatternsToRe(positive, this._micromatchOptions);
        const negativeRe = utils.pattern.convertPatternsToRe(negative, this._micromatchOptions);
        return (entry) => this._filter(entry, positiveRe, negativeRe);
    }
    _filter(entry, positiveRe, negativeRe) {
        if (this._settings.unique) {
            if (this._isDuplicateEntry(entry)) {
                return false;
            }
            this._createIndexRecord(entry);
        }
        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
            return false;
        }
        if (this._isSkippedByAbsoluteNegativePatterns(entry, negativeRe)) {
            return false;
        }
        const filepath = this._settings.baseNameMatch ? entry.name : entry.path;
        return this._isMatchToPatterns(filepath, positiveRe) && !this._isMatchToPatterns(entry.path, negativeRe);
    }
    _isDuplicateEntry(entry) {
        return this.index.has(entry.path);
    }
    _createIndexRecord(entry) {
        this.index.set(entry.path, undefined);
    }
    _onlyFileFilter(entry) {
        return this._settings.onlyFiles && !entry.dirent.isFile();
    }
    _onlyDirectoryFilter(entry) {
        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
    }
    _isSkippedByAbsoluteNegativePatterns(entry, negativeRe) {
        if (!this._settings.absolute) {
            return false;
        }
        const fullpath = utils.path.makeAbsolute(this._settings.cwd, entry.path);
        return this._isMatchToPatterns(fullpath, negativeRe);
    }
    _isMatchToPatterns(filepath, patternsRe) {
        return utils.pattern.matchAny(filepath, patternsRe);
    }
}
exports.default = EntryFilter;


/***/ }),
/* 704 */,
/* 705 */
/***/ (function(module) {

module.exports = {"activity":{"checkStarringRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/user/starred/:owner/:repo"},"deleteRepoSubscription":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/subscription"},"deleteThreadSubscription":{"method":"DELETE","params":{"thread_id":{"required":true,"type":"integer"}},"url":"/notifications/threads/:thread_id/subscription"},"getRepoSubscription":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/subscription"},"getThread":{"method":"GET","params":{"thread_id":{"required":true,"type":"integer"}},"url":"/notifications/threads/:thread_id"},"getThreadSubscription":{"method":"GET","params":{"thread_id":{"required":true,"type":"integer"}},"url":"/notifications/threads/:thread_id/subscription"},"listEventsForOrg":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/events/orgs/:org"},"listEventsForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/events"},"listFeeds":{"method":"GET","params":{},"url":"/feeds"},"listNotifications":{"method":"GET","params":{"all":{"type":"boolean"},"before":{"type":"string"},"page":{"type":"integer"},"participating":{"type":"boolean"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/notifications"},"listNotificationsForRepo":{"method":"GET","params":{"all":{"type":"boolean"},"before":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"participating":{"type":"boolean"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"since":{"type":"string"}},"url":"/repos/:owner/:repo/notifications"},"listPublicEvents":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/events"},"listPublicEventsForOrg":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/events"},"listPublicEventsForRepoNetwork":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/networks/:owner/:repo/events"},"listPublicEventsForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/events/public"},"listReceivedEventsForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/received_events"},"listReceivedPublicEventsForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/received_events/public"},"listRepoEvents":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/events"},"listReposStarredByAuthenticatedUser":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/user/starred"},"listReposStarredByUser":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"sort":{"enum":["created","updated"],"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/starred"},"listReposWatchedByUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/subscriptions"},"listStargazersForRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stargazers"},"listWatchedReposForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/subscriptions"},"listWatchersForRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/subscribers"},"markAsRead":{"method":"PUT","params":{"last_read_at":{"type":"string"}},"url":"/notifications"},"markNotificationsAsReadForRepo":{"method":"PUT","params":{"last_read_at":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/notifications"},"markThreadAsRead":{"method":"PATCH","params":{"thread_id":{"required":true,"type":"integer"}},"url":"/notifications/threads/:thread_id"},"setRepoSubscription":{"method":"PUT","params":{"ignored":{"type":"boolean"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"subscribed":{"type":"boolean"}},"url":"/repos/:owner/:repo/subscription"},"setThreadSubscription":{"method":"PUT","params":{"ignored":{"type":"boolean"},"thread_id":{"required":true,"type":"integer"}},"url":"/notifications/threads/:thread_id/subscription"},"starRepo":{"method":"PUT","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/user/starred/:owner/:repo"},"unstarRepo":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/user/starred/:owner/:repo"}},"apps":{"addRepoToInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"PUT","params":{"installation_id":{"required":true,"type":"integer"},"repository_id":{"required":true,"type":"integer"}},"url":"/user/installations/:installation_id/repositories/:repository_id"},"checkAccountIsAssociatedWithAny":{"method":"GET","params":{"account_id":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/marketplace_listing/accounts/:account_id"},"checkAccountIsAssociatedWithAnyStubbed":{"method":"GET","params":{"account_id":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/marketplace_listing/stubbed/accounts/:account_id"},"createContentAttachment":{"headers":{"accept":"application/vnd.github.corsair-preview+json"},"method":"POST","params":{"body":{"required":true,"type":"string"},"content_reference_id":{"required":true,"type":"integer"},"title":{"required":true,"type":"string"}},"url":"/content_references/:content_reference_id/attachments"},"createFromManifest":{"headers":{"accept":"application/vnd.github.fury-preview+json"},"method":"POST","params":{"code":{"required":true,"type":"string"}},"url":"/app-manifests/:code/conversions"},"createInstallationToken":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"POST","params":{"installation_id":{"required":true,"type":"integer"},"permissions":{"type":"object"},"repository_ids":{"type":"integer[]"}},"url":"/app/installations/:installation_id/access_tokens"},"deleteInstallation":{"headers":{"accept":"application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"},"method":"DELETE","params":{"installation_id":{"required":true,"type":"integer"}},"url":"/app/installations/:installation_id"},"findOrgInstallation":{"deprecated":"octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)","headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org/installation"},"findRepoInstallation":{"deprecated":"octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)","headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/installation"},"findUserInstallation":{"deprecated":"octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)","headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"username":{"required":true,"type":"string"}},"url":"/users/:username/installation"},"getAuthenticated":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{},"url":"/app"},"getBySlug":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"app_slug":{"required":true,"type":"string"}},"url":"/apps/:app_slug"},"getInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"installation_id":{"required":true,"type":"integer"}},"url":"/app/installations/:installation_id"},"getOrgInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org/installation"},"getRepoInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/installation"},"getUserInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"username":{"required":true,"type":"string"}},"url":"/users/:username/installation"},"listAccountsUserOrOrgOnPlan":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"plan_id":{"required":true,"type":"integer"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/marketplace_listing/plans/:plan_id/accounts"},"listAccountsUserOrOrgOnPlanStubbed":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"plan_id":{"required":true,"type":"integer"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/marketplace_listing/stubbed/plans/:plan_id/accounts"},"listInstallationReposForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"installation_id":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/installations/:installation_id/repositories"},"listInstallations":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/app/installations"},"listInstallationsForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/installations"},"listMarketplacePurchasesForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/marketplace_purchases"},"listMarketplacePurchasesForAuthenticatedUserStubbed":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/marketplace_purchases/stubbed"},"listPlans":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/marketplace_listing/plans"},"listPlansStubbed":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/marketplace_listing/stubbed/plans"},"listRepos":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/installation/repositories"},"removeRepoFromInstallation":{"headers":{"accept":"application/vnd.github.machine-man-preview+json"},"method":"DELETE","params":{"installation_id":{"required":true,"type":"integer"},"repository_id":{"required":true,"type":"integer"}},"url":"/user/installations/:installation_id/repositories/:repository_id"}},"checks":{"create":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"POST","params":{"actions":{"type":"object[]"},"actions[].description":{"required":true,"type":"string"},"actions[].identifier":{"required":true,"type":"string"},"actions[].label":{"required":true,"type":"string"},"completed_at":{"type":"string"},"conclusion":{"enum":["success","failure","neutral","cancelled","timed_out","action_required"],"type":"string"},"details_url":{"type":"string"},"external_id":{"type":"string"},"head_sha":{"required":true,"type":"string"},"name":{"required":true,"type":"string"},"output":{"type":"object"},"output.annotations":{"type":"object[]"},"output.annotations[].annotation_level":{"enum":["notice","warning","failure"],"required":true,"type":"string"},"output.annotations[].end_column":{"type":"integer"},"output.annotations[].end_line":{"required":true,"type":"integer"},"output.annotations[].message":{"required":true,"type":"string"},"output.annotations[].path":{"required":true,"type":"string"},"output.annotations[].raw_details":{"type":"string"},"output.annotations[].start_column":{"type":"integer"},"output.annotations[].start_line":{"required":true,"type":"integer"},"output.annotations[].title":{"type":"string"},"output.images":{"type":"object[]"},"output.images[].alt":{"required":true,"type":"string"},"output.images[].caption":{"type":"string"},"output.images[].image_url":{"required":true,"type":"string"},"output.summary":{"required":true,"type":"string"},"output.text":{"type":"string"},"output.title":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"started_at":{"type":"string"},"status":{"enum":["queued","in_progress","completed"],"type":"string"}},"url":"/repos/:owner/:repo/check-runs"},"createSuite":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"POST","params":{"head_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-suites"},"get":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"check_run_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-runs/:check_run_id"},"getSuite":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"check_suite_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-suites/:check_suite_id"},"listAnnotations":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"check_run_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-runs/:check_run_id/annotations"},"listForRef":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"check_name":{"type":"string"},"filter":{"enum":["latest","all"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"status":{"enum":["queued","in_progress","completed"],"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref/check-runs"},"listForSuite":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"check_name":{"type":"string"},"check_suite_id":{"required":true,"type":"integer"},"filter":{"enum":["latest","all"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"status":{"enum":["queued","in_progress","completed"],"type":"string"}},"url":"/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"},"listSuitesForRef":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"GET","params":{"app_id":{"type":"integer"},"check_name":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref/check-suites"},"rerequestSuite":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"POST","params":{"check_suite_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"},"setSuitesPreferences":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"PATCH","params":{"auto_trigger_checks":{"type":"object[]"},"auto_trigger_checks[].app_id":{"required":true,"type":"integer"},"auto_trigger_checks[].setting":{"required":true,"type":"boolean"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/check-suites/preferences"},"update":{"headers":{"accept":"application/vnd.github.antiope-preview+json"},"method":"PATCH","params":{"actions":{"type":"object[]"},"actions[].description":{"required":true,"type":"string"},"actions[].identifier":{"required":true,"type":"string"},"actions[].label":{"required":true,"type":"string"},"check_run_id":{"required":true,"type":"integer"},"completed_at":{"type":"string"},"conclusion":{"enum":["success","failure","neutral","cancelled","timed_out","action_required"],"type":"string"},"details_url":{"type":"string"},"external_id":{"type":"string"},"name":{"type":"string"},"output":{"type":"object"},"output.annotations":{"type":"object[]"},"output.annotations[].annotation_level":{"enum":["notice","warning","failure"],"required":true,"type":"string"},"output.annotations[].end_column":{"type":"integer"},"output.annotations[].end_line":{"required":true,"type":"integer"},"output.annotations[].message":{"required":true,"type":"string"},"output.annotations[].path":{"required":true,"type":"string"},"output.annotations[].raw_details":{"type":"string"},"output.annotations[].start_column":{"type":"integer"},"output.annotations[].start_line":{"required":true,"type":"integer"},"output.annotations[].title":{"type":"string"},"output.images":{"type":"object[]"},"output.images[].alt":{"required":true,"type":"string"},"output.images[].caption":{"type":"string"},"output.images[].image_url":{"required":true,"type":"string"},"output.summary":{"required":true,"type":"string"},"output.text":{"type":"string"},"output.title":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"started_at":{"type":"string"},"status":{"enum":["queued","in_progress","completed"],"type":"string"}},"url":"/repos/:owner/:repo/check-runs/:check_run_id"}},"codesOfConduct":{"getConductCode":{"headers":{"accept":"application/vnd.github.scarlet-witch-preview+json"},"method":"GET","params":{"key":{"required":true,"type":"string"}},"url":"/codes_of_conduct/:key"},"getForRepo":{"headers":{"accept":"application/vnd.github.scarlet-witch-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/community/code_of_conduct"},"listConductCodes":{"headers":{"accept":"application/vnd.github.scarlet-witch-preview+json"},"method":"GET","params":{},"url":"/codes_of_conduct"}},"emojis":{"get":{"method":"GET","params":{},"url":"/emojis"}},"gists":{"checkIsStarred":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/star"},"create":{"method":"POST","params":{"description":{"type":"string"},"files":{"required":true,"type":"object"},"files.content":{"type":"string"},"public":{"type":"boolean"}},"url":"/gists"},"createComment":{"method":"POST","params":{"body":{"required":true,"type":"string"},"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/comments"},"delete":{"method":"DELETE","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id"},"deleteComment":{"method":"DELETE","params":{"comment_id":{"required":true,"type":"integer"},"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/comments/:comment_id"},"fork":{"method":"POST","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/forks"},"get":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id"},"getComment":{"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/comments/:comment_id"},"getRevision":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"},"sha":{"required":true,"type":"string"}},"url":"/gists/:gist_id/:sha"},"list":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/gists"},"listComments":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/gists/:gist_id/comments"},"listCommits":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/gists/:gist_id/commits"},"listForks":{"method":"GET","params":{"gist_id":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/gists/:gist_id/forks"},"listPublic":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/gists/public"},"listPublicForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/gists"},"listStarred":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/gists/starred"},"star":{"method":"PUT","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/star"},"unstar":{"method":"DELETE","params":{"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/star"},"update":{"method":"PATCH","params":{"description":{"type":"string"},"files":{"type":"object"},"files.content":{"type":"string"},"files.filename":{"type":"string"},"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id"},"updateComment":{"method":"PATCH","params":{"body":{"required":true,"type":"string"},"comment_id":{"required":true,"type":"integer"},"gist_id":{"required":true,"type":"string"}},"url":"/gists/:gist_id/comments/:comment_id"}},"git":{"createBlob":{"method":"POST","params":{"content":{"required":true,"type":"string"},"encoding":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/blobs"},"createCommit":{"method":"POST","params":{"author":{"type":"object"},"author.date":{"type":"string"},"author.email":{"type":"string"},"author.name":{"type":"string"},"committer":{"type":"object"},"committer.date":{"type":"string"},"committer.email":{"type":"string"},"committer.name":{"type":"string"},"message":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"parents":{"required":true,"type":"string[]"},"repo":{"required":true,"type":"string"},"signature":{"type":"string"},"tree":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/commits"},"createRef":{"method":"POST","params":{"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/refs"},"createTag":{"method":"POST","params":{"message":{"required":true,"type":"string"},"object":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"tag":{"required":true,"type":"string"},"tagger":{"type":"object"},"tagger.date":{"type":"string"},"tagger.email":{"type":"string"},"tagger.name":{"type":"string"},"type":{"enum":["commit","tree","blob"],"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/tags"},"createTree":{"method":"POST","params":{"base_tree":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"tree":{"required":true,"type":"object[]"},"tree[].content":{"type":"string"},"tree[].mode":{"enum":["100644","100755","040000","160000","120000"],"type":"string"},"tree[].path":{"type":"string"},"tree[].sha":{"type":"string"},"tree[].type":{"enum":["blob","tree","commit"],"type":"string"}},"url":"/repos/:owner/:repo/git/trees"},"deleteRef":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/refs/:ref"},"getBlob":{"method":"GET","params":{"file_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/blobs/:file_sha"},"getCommit":{"method":"GET","params":{"commit_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/commits/:commit_sha"},"getRef":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/refs/:ref"},"getTag":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"tag_sha":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/tags/:tag_sha"},"getTree":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"recursive":{"enum":[1],"type":"integer"},"repo":{"required":true,"type":"string"},"tree_sha":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/trees/:tree_sha"},"listRefs":{"method":"GET","params":{"namespace":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/refs/:namespace"},"updateRef":{"method":"PATCH","params":{"force":{"type":"boolean"},"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/git/refs/:ref"}},"gitignore":{"getTemplate":{"method":"GET","params":{"name":{"required":true,"type":"string"}},"url":"/gitignore/templates/:name"},"listTemplates":{"method":"GET","params":{},"url":"/gitignore/templates"}},"interactions":{"addOrUpdateRestrictionsForOrg":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"PUT","params":{"limit":{"enum":["existing_users","contributors_only","collaborators_only"],"required":true,"type":"string"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/interaction-limits"},"addOrUpdateRestrictionsForRepo":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"PUT","params":{"limit":{"enum":["existing_users","contributors_only","collaborators_only"],"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/interaction-limits"},"getRestrictionsForOrg":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org/interaction-limits"},"getRestrictionsForRepo":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/interaction-limits"},"removeRestrictionsForOrg":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"DELETE","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org/interaction-limits"},"removeRestrictionsForRepo":{"headers":{"accept":"application/vnd.github.sombra-preview+json"},"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/interaction-limits"}},"issues":{"addAssignees":{"method":"POST","params":{"assignees":{"type":"string[]"},"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/assignees"},"addLabels":{"method":"POST","params":{"issue_number":{"required":true,"type":"integer"},"labels":{"required":true,"type":"string[]"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/labels"},"checkAssignee":{"method":"GET","params":{"assignee":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/assignees/:assignee"},"create":{"method":"POST","params":{"assignee":{"type":"string"},"assignees":{"type":"string[]"},"body":{"type":"string"},"labels":{"type":"string[]"},"milestone":{"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"title":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues"},"createComment":{"method":"POST","params":{"body":{"required":true,"type":"string"},"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/comments"},"createLabel":{"method":"POST","params":{"color":{"required":true,"type":"string"},"description":{"type":"string"},"name":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/labels"},"createMilestone":{"method":"POST","params":{"description":{"type":"string"},"due_on":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"state":{"enum":["open","closed"],"type":"string"},"title":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/milestones"},"deleteComment":{"method":"DELETE","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/comments/:comment_id"},"deleteLabel":{"method":"DELETE","params":{"name":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/labels/:name"},"deleteMilestone":{"method":"DELETE","params":{"milestone_number":{"required":true,"type":"integer"},"number":{"alias":"milestone_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/milestones/:milestone_number"},"get":{"method":"GET","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number"},"getComment":{"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/comments/:comment_id"},"getEvent":{"method":"GET","params":{"event_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/events/:event_id"},"getLabel":{"method":"GET","params":{"name":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/labels/:name"},"getMilestone":{"method":"GET","params":{"milestone_number":{"required":true,"type":"integer"},"number":{"alias":"milestone_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/milestones/:milestone_number"},"list":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"filter":{"enum":["assigned","created","mentioned","subscribed","all"],"type":"string"},"labels":{"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"},"sort":{"enum":["created","updated","comments"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/issues"},"listAssignees":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/assignees"},"listComments":{"method":"GET","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"since":{"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/comments"},"listCommentsForRepo":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"since":{"type":"string"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/repos/:owner/:repo/issues/comments"},"listEvents":{"method":"GET","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/events"},"listEventsForRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/events"},"listEventsForTimeline":{"headers":{"accept":"application/vnd.github.mockingbird-preview+json"},"method":"GET","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/timeline"},"listForAuthenticatedUser":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"filter":{"enum":["assigned","created","mentioned","subscribed","all"],"type":"string"},"labels":{"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"},"sort":{"enum":["created","updated","comments"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/user/issues"},"listForOrg":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"filter":{"enum":["assigned","created","mentioned","subscribed","all"],"type":"string"},"labels":{"type":"string"},"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"},"sort":{"enum":["created","updated","comments"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/orgs/:org/issues"},"listForRepo":{"method":"GET","params":{"assignee":{"type":"string"},"creator":{"type":"string"},"direction":{"enum":["asc","desc"],"type":"string"},"labels":{"type":"string"},"mentioned":{"type":"string"},"milestone":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"since":{"type":"string"},"sort":{"enum":["created","updated","comments"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/repos/:owner/:repo/issues"},"listLabelsForMilestone":{"method":"GET","params":{"milestone_number":{"required":true,"type":"integer"},"number":{"alias":"milestone_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/milestones/:milestone_number/labels"},"listLabelsForRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/labels"},"listLabelsOnIssue":{"method":"GET","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/labels"},"listMilestonesForRepo":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"sort":{"enum":["due_on","completeness"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/repos/:owner/:repo/milestones"},"lock":{"method":"PUT","params":{"issue_number":{"required":true,"type":"integer"},"lock_reason":{"enum":["off-topic","too heated","resolved","spam"],"type":"string"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/lock"},"removeAssignees":{"method":"DELETE","params":{"assignees":{"type":"string[]"},"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/assignees"},"removeLabel":{"method":"DELETE","params":{"issue_number":{"required":true,"type":"integer"},"name":{"required":true,"type":"string"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/labels/:name"},"removeLabels":{"method":"DELETE","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/labels"},"replaceLabels":{"method":"PUT","params":{"issue_number":{"required":true,"type":"integer"},"labels":{"type":"string[]"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/labels"},"unlock":{"method":"DELETE","params":{"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/lock"},"update":{"method":"PATCH","params":{"assignee":{"type":"string"},"assignees":{"type":"string[]"},"body":{"type":"string"},"issue_number":{"required":true,"type":"integer"},"labels":{"type":"string[]"},"milestone":{"allowNull":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"state":{"enum":["open","closed"],"type":"string"},"title":{"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number"},"updateComment":{"method":"PATCH","params":{"body":{"required":true,"type":"string"},"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/comments/:comment_id"},"updateLabel":{"method":"PATCH","params":{"color":{"type":"string"},"current_name":{"required":true,"type":"string"},"description":{"type":"string"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/labels/:current_name"},"updateMilestone":{"method":"PATCH","params":{"description":{"type":"string"},"due_on":{"type":"string"},"milestone_number":{"required":true,"type":"integer"},"number":{"alias":"milestone_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"state":{"enum":["open","closed"],"type":"string"},"title":{"type":"string"}},"url":"/repos/:owner/:repo/milestones/:milestone_number"}},"licenses":{"get":{"method":"GET","params":{"license":{"required":true,"type":"string"}},"url":"/licenses/:license"},"getForRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/license"},"list":{"deprecated":"octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)","method":"GET","params":{},"url":"/licenses"},"listCommonlyUsed":{"method":"GET","params":{},"url":"/licenses"}},"markdown":{"render":{"method":"POST","params":{"context":{"type":"string"},"mode":{"enum":["markdown","gfm"],"type":"string"},"text":{"required":true,"type":"string"}},"url":"/markdown"},"renderRaw":{"headers":{"content-type":"text/plain; charset=utf-8"},"method":"POST","params":{"data":{"mapTo":"data","required":true,"type":"string"}},"url":"/markdown/raw"}},"meta":{"get":{"method":"GET","params":{},"url":"/meta"}},"migrations":{"cancelImport":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/import"},"deleteArchiveForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"DELETE","params":{"migration_id":{"required":true,"type":"integer"}},"url":"/user/migrations/:migration_id/archive"},"deleteArchiveForOrg":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"DELETE","params":{"migration_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/migrations/:migration_id/archive"},"getArchiveForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"migration_id":{"required":true,"type":"integer"}},"url":"/user/migrations/:migration_id/archive"},"getArchiveForOrg":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"migration_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/migrations/:migration_id/archive"},"getCommitAuthors":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"since":{"type":"string"}},"url":"/repos/:owner/:repo/import/authors"},"getImportProgress":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/import"},"getLargeFiles":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/import/large_files"},"getStatusForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"migration_id":{"required":true,"type":"integer"}},"url":"/user/migrations/:migration_id"},"getStatusForOrg":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"migration_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/migrations/:migration_id"},"listForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/migrations"},"listForOrg":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/migrations"},"mapCommitAuthor":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"PATCH","params":{"author_id":{"required":true,"type":"integer"},"email":{"type":"string"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/import/authors/:author_id"},"setLfsPreference":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"PATCH","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"use_lfs":{"enum":["opt_in","opt_out"],"required":true,"type":"string"}},"url":"/repos/:owner/:repo/import/lfs"},"startForAuthenticatedUser":{"method":"POST","params":{"exclude_attachments":{"type":"boolean"},"lock_repositories":{"type":"boolean"},"repositories":{"required":true,"type":"string[]"}},"url":"/user/migrations"},"startForOrg":{"method":"POST","params":{"exclude_attachments":{"type":"boolean"},"lock_repositories":{"type":"boolean"},"org":{"required":true,"type":"string"},"repositories":{"required":true,"type":"string[]"}},"url":"/orgs/:org/migrations"},"startImport":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"PUT","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"tfvc_project":{"type":"string"},"vcs":{"enum":["subversion","git","mercurial","tfvc"],"type":"string"},"vcs_password":{"type":"string"},"vcs_url":{"required":true,"type":"string"},"vcs_username":{"type":"string"}},"url":"/repos/:owner/:repo/import"},"unlockRepoForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"DELETE","params":{"migration_id":{"required":true,"type":"integer"},"repo_name":{"required":true,"type":"string"}},"url":"/user/migrations/:migration_id/repos/:repo_name/lock"},"unlockRepoForOrg":{"headers":{"accept":"application/vnd.github.wyandotte-preview+json"},"method":"DELETE","params":{"migration_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"},"repo_name":{"required":true,"type":"string"}},"url":"/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"},"updateImport":{"headers":{"accept":"application/vnd.github.barred-rock-preview+json"},"method":"PATCH","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"vcs_password":{"type":"string"},"vcs_username":{"type":"string"}},"url":"/repos/:owner/:repo/import"}},"oauthAuthorizations":{"checkAuthorization":{"method":"GET","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/tokens/:access_token"},"createAuthorization":{"method":"POST","params":{"client_id":{"type":"string"},"client_secret":{"type":"string"},"fingerprint":{"type":"string"},"note":{"required":true,"type":"string"},"note_url":{"type":"string"},"scopes":{"type":"string[]"}},"url":"/authorizations"},"deleteAuthorization":{"method":"DELETE","params":{"authorization_id":{"required":true,"type":"integer"}},"url":"/authorizations/:authorization_id"},"deleteGrant":{"method":"DELETE","params":{"grant_id":{"required":true,"type":"integer"}},"url":"/applications/grants/:grant_id"},"getAuthorization":{"method":"GET","params":{"authorization_id":{"required":true,"type":"integer"}},"url":"/authorizations/:authorization_id"},"getGrant":{"method":"GET","params":{"grant_id":{"required":true,"type":"integer"}},"url":"/applications/grants/:grant_id"},"getOrCreateAuthorizationForApp":{"method":"PUT","params":{"client_id":{"required":true,"type":"string"},"client_secret":{"required":true,"type":"string"},"fingerprint":{"type":"string"},"note":{"type":"string"},"note_url":{"type":"string"},"scopes":{"type":"string[]"}},"url":"/authorizations/clients/:client_id"},"getOrCreateAuthorizationForAppAndFingerprint":{"method":"PUT","params":{"client_id":{"required":true,"type":"string"},"client_secret":{"required":true,"type":"string"},"fingerprint":{"required":true,"type":"string"},"note":{"type":"string"},"note_url":{"type":"string"},"scopes":{"type":"string[]"}},"url":"/authorizations/clients/:client_id/:fingerprint"},"getOrCreateAuthorizationForAppFingerprint":{"deprecated":"octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)","method":"PUT","params":{"client_id":{"required":true,"type":"string"},"client_secret":{"required":true,"type":"string"},"fingerprint":{"required":true,"type":"string"},"note":{"type":"string"},"note_url":{"type":"string"},"scopes":{"type":"string[]"}},"url":"/authorizations/clients/:client_id/:fingerprint"},"listAuthorizations":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/authorizations"},"listGrants":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/applications/grants"},"resetAuthorization":{"method":"POST","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/tokens/:access_token"},"revokeAuthorizationForApplication":{"method":"DELETE","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/tokens/:access_token"},"revokeGrantForApplication":{"method":"DELETE","params":{"access_token":{"required":true,"type":"string"},"client_id":{"required":true,"type":"string"}},"url":"/applications/:client_id/grants/:access_token"},"updateAuthorization":{"method":"PATCH","params":{"add_scopes":{"type":"string[]"},"authorization_id":{"required":true,"type":"integer"},"fingerprint":{"type":"string"},"note":{"type":"string"},"note_url":{"type":"string"},"remove_scopes":{"type":"string[]"},"scopes":{"type":"string[]"}},"url":"/authorizations/:authorization_id"}},"orgs":{"addOrUpdateMembership":{"method":"PUT","params":{"org":{"required":true,"type":"string"},"role":{"enum":["admin","member"],"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/memberships/:username"},"blockUser":{"method":"PUT","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/blocks/:username"},"checkBlockedUser":{"method":"GET","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/blocks/:username"},"checkMembership":{"method":"GET","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/members/:username"},"checkPublicMembership":{"method":"GET","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/public_members/:username"},"concealMembership":{"method":"DELETE","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/public_members/:username"},"convertMemberToOutsideCollaborator":{"method":"PUT","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/outside_collaborators/:username"},"createHook":{"method":"POST","params":{"active":{"type":"boolean"},"config":{"required":true,"type":"object"},"config.content_type":{"type":"string"},"config.insecure_ssl":{"type":"string"},"config.secret":{"type":"string"},"config.url":{"required":true,"type":"string"},"events":{"type":"string[]"},"name":{"required":true,"type":"string"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/hooks"},"createInvitation":{"method":"POST","params":{"email":{"type":"string"},"invitee_id":{"type":"integer"},"org":{"required":true,"type":"string"},"role":{"enum":["admin","direct_member","billing_manager"],"type":"string"},"team_ids":{"type":"integer[]"}},"url":"/orgs/:org/invitations"},"deleteHook":{"method":"DELETE","params":{"hook_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/hooks/:hook_id"},"get":{"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org"},"getHook":{"method":"GET","params":{"hook_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/hooks/:hook_id"},"getMembership":{"method":"GET","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/memberships/:username"},"getMembershipForAuthenticatedUser":{"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/user/memberships/orgs/:org"},"list":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/organizations"},"listBlockedUsers":{"method":"GET","params":{"org":{"required":true,"type":"string"}},"url":"/orgs/:org/blocks"},"listForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/orgs"},"listForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/orgs"},"listHooks":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/hooks"},"listInvitationTeams":{"method":"GET","params":{"invitation_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/invitations/:invitation_id/teams"},"listMembers":{"method":"GET","params":{"filter":{"enum":["2fa_disabled","all"],"type":"string"},"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"role":{"enum":["all","admin","member"],"type":"string"}},"url":"/orgs/:org/members"},"listMemberships":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"state":{"enum":["active","pending"],"type":"string"}},"url":"/user/memberships/orgs"},"listOutsideCollaborators":{"method":"GET","params":{"filter":{"enum":["2fa_disabled","all"],"type":"string"},"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/outside_collaborators"},"listPendingInvitations":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/invitations"},"listPublicMembers":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/public_members"},"pingHook":{"method":"POST","params":{"hook_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/hooks/:hook_id/pings"},"publicizeMembership":{"method":"PUT","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/public_members/:username"},"removeMember":{"method":"DELETE","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/members/:username"},"removeMembership":{"method":"DELETE","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/memberships/:username"},"removeOutsideCollaborator":{"method":"DELETE","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/outside_collaborators/:username"},"unblockUser":{"method":"DELETE","params":{"org":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/orgs/:org/blocks/:username"},"update":{"method":"PATCH","params":{"billing_email":{"type":"string"},"company":{"type":"string"},"default_repository_permission":{"enum":["read","write","admin","none"],"type":"string"},"description":{"type":"string"},"email":{"type":"string"},"has_organization_projects":{"type":"boolean"},"has_repository_projects":{"type":"boolean"},"location":{"type":"string"},"members_allowed_repository_creation_type":{"enum":["all","private","none"],"type":"string"},"members_can_create_repositories":{"type":"boolean"},"name":{"type":"string"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org"},"updateHook":{"method":"PATCH","params":{"active":{"type":"boolean"},"config":{"type":"object"},"config.content_type":{"type":"string"},"config.insecure_ssl":{"type":"string"},"config.secret":{"type":"string"},"config.url":{"required":true,"type":"string"},"events":{"type":"string[]"},"hook_id":{"required":true,"type":"integer"},"org":{"required":true,"type":"string"}},"url":"/orgs/:org/hooks/:hook_id"},"updateMembership":{"method":"PATCH","params":{"org":{"required":true,"type":"string"},"state":{"enum":["active"],"required":true,"type":"string"}},"url":"/user/memberships/orgs/:org"}},"projects":{"addCollaborator":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"PUT","params":{"permission":{"enum":["read","write","admin"],"type":"string"},"project_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/projects/:project_id/collaborators/:username"},"createCard":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"column_id":{"required":true,"type":"integer"},"content_id":{"type":"integer"},"content_type":{"type":"string"},"note":{"type":"string"}},"url":"/projects/columns/:column_id/cards"},"createColumn":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"name":{"required":true,"type":"string"},"project_id":{"required":true,"type":"integer"}},"url":"/projects/:project_id/columns"},"createForAuthenticatedUser":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"body":{"type":"string"},"name":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/projects"},"createForOrg":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"body":{"type":"string"},"name":{"required":true,"type":"string"},"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/projects"},"createForRepo":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"body":{"type":"string"},"name":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/projects"},"delete":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"DELETE","params":{"project_id":{"required":true,"type":"integer"}},"url":"/projects/:project_id"},"deleteCard":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"DELETE","params":{"card_id":{"required":true,"type":"integer"}},"url":"/projects/columns/cards/:card_id"},"deleteColumn":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"DELETE","params":{"column_id":{"required":true,"type":"integer"}},"url":"/projects/columns/:column_id"},"get":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"project_id":{"required":true,"type":"integer"}},"url":"/projects/:project_id"},"getCard":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"card_id":{"required":true,"type":"integer"}},"url":"/projects/columns/cards/:card_id"},"getColumn":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"column_id":{"required":true,"type":"integer"}},"url":"/projects/columns/:column_id"},"listCards":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"archived_state":{"enum":["all","archived","not_archived"],"type":"string"},"column_id":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/projects/columns/:column_id/cards"},"listCollaborators":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"affiliation":{"enum":["outside","direct","all"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"project_id":{"required":true,"type":"integer"}},"url":"/projects/:project_id/collaborators"},"listColumns":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"project_id":{"required":true,"type":"integer"}},"url":"/projects/:project_id/columns"},"listForOrg":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/orgs/:org/projects"},"listForRepo":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/repos/:owner/:repo/projects"},"listForUser":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"state":{"enum":["open","closed","all"],"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/projects"},"moveCard":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"card_id":{"required":true,"type":"integer"},"column_id":{"type":"integer"},"position":{"required":true,"type":"string","validation":"^(top|bottom|after:\\d+)$"}},"url":"/projects/columns/cards/:card_id/moves"},"moveColumn":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"POST","params":{"column_id":{"required":true,"type":"integer"},"position":{"required":true,"type":"string","validation":"^(first|last|after:\\d+)$"}},"url":"/projects/columns/:column_id/moves"},"removeCollaborator":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"DELETE","params":{"project_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/projects/:project_id/collaborators/:username"},"reviewUserPermissionLevel":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"project_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/projects/:project_id/collaborators/:username/permission"},"update":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"PATCH","params":{"body":{"type":"string"},"name":{"type":"string"},"organization_permission":{"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"private":{"type":"boolean"},"project_id":{"required":true,"type":"integer"},"state":{"enum":["open","closed"],"type":"string"}},"url":"/projects/:project_id"},"updateCard":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"PATCH","params":{"archived":{"type":"boolean"},"card_id":{"required":true,"type":"integer"},"note":{"type":"string"}},"url":"/projects/columns/cards/:card_id"},"updateColumn":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"PATCH","params":{"column_id":{"required":true,"type":"integer"},"name":{"required":true,"type":"string"}},"url":"/projects/columns/:column_id"}},"pulls":{"checkIfMerged":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/merge"},"create":{"method":"POST","params":{"base":{"required":true,"type":"string"},"body":{"type":"string"},"draft":{"type":"boolean"},"head":{"required":true,"type":"string"},"maintainer_can_modify":{"type":"boolean"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"title":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls"},"createComment":{"method":"POST","params":{"body":{"required":true,"type":"string"},"commit_id":{"required":true,"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"position":{"required":true,"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/comments"},"createCommentReply":{"method":"POST","params":{"body":{"required":true,"type":"string"},"in_reply_to":{"required":true,"type":"integer"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/comments"},"createFromIssue":{"method":"POST","params":{"base":{"required":true,"type":"string"},"draft":{"type":"boolean"},"head":{"required":true,"type":"string"},"issue":{"required":true,"type":"integer"},"maintainer_can_modify":{"type":"boolean"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls"},"createReview":{"method":"POST","params":{"body":{"type":"string"},"comments":{"type":"object[]"},"comments[].body":{"required":true,"type":"string"},"comments[].path":{"required":true,"type":"string"},"comments[].position":{"required":true,"type":"integer"},"commit_id":{"type":"string"},"event":{"enum":["APPROVE","REQUEST_CHANGES","COMMENT"],"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews"},"createReviewRequest":{"method":"POST","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"reviewers":{"type":"string[]"},"team_reviewers":{"type":"string[]"}},"url":"/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"},"deleteComment":{"method":"DELETE","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments/:comment_id"},"deletePendingReview":{"method":"DELETE","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"},"deleteReviewRequest":{"method":"DELETE","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"reviewers":{"type":"string[]"},"team_reviewers":{"type":"string[]"}},"url":"/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"},"dismissReview":{"method":"PUT","params":{"message":{"required":true,"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"},"get":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number"},"getComment":{"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments/:comment_id"},"getCommentsForReview":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"},"getReview":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"},"list":{"method":"GET","params":{"base":{"type":"string"},"direction":{"enum":["asc","desc"],"type":"string"},"head":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"sort":{"enum":["created","updated","popularity","long-running"],"type":"string"},"state":{"enum":["open","closed","all"],"type":"string"}},"url":"/repos/:owner/:repo/pulls"},"listComments":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"since":{"type":"string"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/comments"},"listCommentsForRepo":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"since":{"type":"string"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments"},"listCommits":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/commits"},"listFiles":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/files"},"listReviewRequests":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"},"listReviews":{"method":"GET","params":{"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews"},"merge":{"method":"PUT","params":{"commit_message":{"type":"string"},"commit_title":{"type":"string"},"merge_method":{"enum":["merge","squash","rebase"],"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/merge"},"submitReview":{"method":"POST","params":{"body":{"type":"string"},"event":{"enum":["APPROVE","REQUEST_CHANGES","COMMENT"],"required":true,"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"},"update":{"method":"PATCH","params":{"base":{"type":"string"},"body":{"type":"string"},"maintainer_can_modify":{"type":"boolean"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"state":{"enum":["open","closed"],"type":"string"},"title":{"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number"},"updateBranch":{"headers":{"accept":"application/vnd.github.lydian-preview+json"},"method":"PUT","params":{"expected_head_sha":{"type":"string"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/:pull_number/update-branch"},"updateComment":{"method":"PATCH","params":{"body":{"required":true,"type":"string"},"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments/:comment_id"},"updateReview":{"method":"PUT","params":{"body":{"required":true,"type":"string"},"number":{"alias":"pull_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"pull_number":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"review_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"}},"rateLimit":{"get":{"method":"GET","params":{},"url":"/rate_limit"}},"reactions":{"createForCommitComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments/:comment_id/reactions"},"createForIssue":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/reactions"},"createForIssueComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/comments/:comment_id/reactions"},"createForPullRequestReviewComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments/:comment_id/reactions"},"createForTeamDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/reactions"},"createForTeamDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"},"method":"POST","params":{"comment_number":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"required":true,"type":"string"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"},"delete":{"headers":{"accept":"application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"},"method":"DELETE","params":{"reaction_id":{"required":true,"type":"integer"}},"url":"/reactions/:reaction_id"},"listForCommitComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments/:comment_id/reactions"},"listForIssue":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"issue_number":{"required":true,"type":"integer"},"number":{"alias":"issue_number","deprecated":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/:issue_number/reactions"},"listForIssueComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/issues/comments/:comment_id/reactions"},"listForPullRequestReviewComment":{"headers":{"accept":"application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pulls/comments/:comment_id/reactions"},"listForTeamDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"discussion_number":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/reactions"},"listForTeamDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"},"method":"GET","params":{"comment_number":{"required":true,"type":"integer"},"content":{"enum":["+1","-1","laugh","confused","heart","hooray","rocket","eyes"],"type":"string"},"discussion_number":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"}},"repos":{"acceptInvitation":{"method":"PATCH","params":{"invitation_id":{"required":true,"type":"integer"}},"url":"/user/repository_invitations/:invitation_id"},"addCollaborator":{"method":"PUT","params":{"owner":{"required":true,"type":"string"},"permission":{"enum":["pull","push","admin"],"type":"string"},"repo":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/collaborators/:username"},"addDeployKey":{"method":"POST","params":{"key":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"read_only":{"type":"boolean"},"repo":{"required":true,"type":"string"},"title":{"type":"string"}},"url":"/repos/:owner/:repo/keys"},"addProtectedBranchAdminEnforcement":{"method":"POST","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/enforce_admins"},"addProtectedBranchRequiredSignatures":{"headers":{"accept":"application/vnd.github.zzzax-preview+json"},"method":"POST","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_signatures"},"addProtectedBranchRequiredStatusChecksContexts":{"method":"POST","params":{"branch":{"required":true,"type":"string"},"contexts":{"mapTo":"data","required":true,"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"},"addProtectedBranchTeamRestrictions":{"method":"POST","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"teams":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"},"addProtectedBranchUserRestrictions":{"method":"POST","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"users":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/users"},"checkCollaborator":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/collaborators/:username"},"checkVulnerabilityAlerts":{"headers":{"accept":"application/vnd.github.dorian-preview+json"},"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/vulnerability-alerts"},"compareCommits":{"method":"GET","params":{"base":{"required":true,"type":"string"},"head":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/compare/:base...:head"},"createCommitComment":{"method":"POST","params":{"body":{"required":true,"type":"string"},"commit_sha":{"required":true,"type":"string"},"line":{"type":"integer"},"owner":{"required":true,"type":"string"},"path":{"type":"string"},"position":{"type":"integer"},"repo":{"required":true,"type":"string"},"sha":{"alias":"commit_sha","deprecated":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:commit_sha/comments"},"createDeployment":{"method":"POST","params":{"auto_merge":{"type":"boolean"},"description":{"type":"string"},"environment":{"type":"string"},"owner":{"required":true,"type":"string"},"payload":{"type":"string"},"production_environment":{"type":"boolean"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"required_contexts":{"type":"string[]"},"task":{"type":"string"},"transient_environment":{"type":"boolean"}},"url":"/repos/:owner/:repo/deployments"},"createDeploymentStatus":{"method":"POST","params":{"auto_inactive":{"type":"boolean"},"deployment_id":{"required":true,"type":"integer"},"description":{"type":"string"},"environment":{"enum":["production","staging","qa"],"type":"string"},"environment_url":{"type":"string"},"log_url":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"state":{"enum":["error","failure","inactive","in_progress","queued","pending","success"],"required":true,"type":"string"},"target_url":{"type":"string"}},"url":"/repos/:owner/:repo/deployments/:deployment_id/statuses"},"createFile":{"deprecated":"octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)","method":"PUT","params":{"author":{"type":"object"},"author.email":{"required":true,"type":"string"},"author.name":{"required":true,"type":"string"},"branch":{"type":"string"},"committer":{"type":"object"},"committer.email":{"required":true,"type":"string"},"committer.name":{"required":true,"type":"string"},"content":{"required":true,"type":"string"},"message":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"}},"url":"/repos/:owner/:repo/contents/:path"},"createForAuthenticatedUser":{"method":"POST","params":{"allow_merge_commit":{"type":"boolean"},"allow_rebase_merge":{"type":"boolean"},"allow_squash_merge":{"type":"boolean"},"auto_init":{"type":"boolean"},"description":{"type":"string"},"gitignore_template":{"type":"string"},"has_issues":{"type":"boolean"},"has_projects":{"type":"boolean"},"has_wiki":{"type":"boolean"},"homepage":{"type":"string"},"is_template":{"type":"boolean"},"license_template":{"type":"string"},"name":{"required":true,"type":"string"},"private":{"type":"boolean"},"team_id":{"type":"integer"}},"url":"/user/repos"},"createFork":{"method":"POST","params":{"organization":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/forks"},"createHook":{"method":"POST","params":{"active":{"type":"boolean"},"config":{"required":true,"type":"object"},"config.content_type":{"type":"string"},"config.insecure_ssl":{"type":"string"},"config.secret":{"type":"string"},"config.url":{"required":true,"type":"string"},"events":{"type":"string[]"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks"},"createInOrg":{"method":"POST","params":{"allow_merge_commit":{"type":"boolean"},"allow_rebase_merge":{"type":"boolean"},"allow_squash_merge":{"type":"boolean"},"auto_init":{"type":"boolean"},"description":{"type":"string"},"gitignore_template":{"type":"string"},"has_issues":{"type":"boolean"},"has_projects":{"type":"boolean"},"has_wiki":{"type":"boolean"},"homepage":{"type":"string"},"is_template":{"type":"boolean"},"license_template":{"type":"string"},"name":{"required":true,"type":"string"},"org":{"required":true,"type":"string"},"private":{"type":"boolean"},"team_id":{"type":"integer"}},"url":"/orgs/:org/repos"},"createOrUpdateFile":{"method":"PUT","params":{"author":{"type":"object"},"author.email":{"required":true,"type":"string"},"author.name":{"required":true,"type":"string"},"branch":{"type":"string"},"committer":{"type":"object"},"committer.email":{"required":true,"type":"string"},"committer.name":{"required":true,"type":"string"},"content":{"required":true,"type":"string"},"message":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"}},"url":"/repos/:owner/:repo/contents/:path"},"createRelease":{"method":"POST","params":{"body":{"type":"string"},"draft":{"type":"boolean"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"prerelease":{"type":"boolean"},"repo":{"required":true,"type":"string"},"tag_name":{"required":true,"type":"string"},"target_commitish":{"type":"string"}},"url":"/repos/:owner/:repo/releases"},"createStatus":{"method":"POST","params":{"context":{"type":"string"},"description":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"required":true,"type":"string"},"state":{"enum":["error","failure","pending","success"],"required":true,"type":"string"},"target_url":{"type":"string"}},"url":"/repos/:owner/:repo/statuses/:sha"},"createUsingTemplate":{"headers":{"accept":"application/vnd.github.baptiste-preview+json"},"method":"POST","params":{"description":{"type":"string"},"name":{"required":true,"type":"string"},"owner":{"type":"string"},"private":{"type":"boolean"},"template_owner":{"required":true,"type":"string"},"template_repo":{"required":true,"type":"string"}},"url":"/repos/:template_owner/:template_repo/generate"},"declineInvitation":{"method":"DELETE","params":{"invitation_id":{"required":true,"type":"integer"}},"url":"/user/repository_invitations/:invitation_id"},"delete":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo"},"deleteCommitComment":{"method":"DELETE","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments/:comment_id"},"deleteDownload":{"method":"DELETE","params":{"download_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/downloads/:download_id"},"deleteFile":{"method":"DELETE","params":{"author":{"type":"object"},"author.email":{"type":"string"},"author.name":{"type":"string"},"branch":{"type":"string"},"committer":{"type":"object"},"committer.email":{"type":"string"},"committer.name":{"type":"string"},"message":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/contents/:path"},"deleteHook":{"method":"DELETE","params":{"hook_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks/:hook_id"},"deleteInvitation":{"method":"DELETE","params":{"invitation_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/invitations/:invitation_id"},"deleteRelease":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"release_id":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/:release_id"},"deleteReleaseAsset":{"method":"DELETE","params":{"asset_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/assets/:asset_id"},"disableAutomatedSecurityFixes":{"headers":{"accept":"application/vnd.github.london-preview+json"},"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/automated-security-fixes"},"disablePagesSite":{"headers":{"accept":"application/vnd.github.switcheroo-preview+json"},"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages"},"disableVulnerabilityAlerts":{"headers":{"accept":"application/vnd.github.dorian-preview+json"},"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/vulnerability-alerts"},"enableAutomatedSecurityFixes":{"headers":{"accept":"application/vnd.github.london-preview+json"},"method":"PUT","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/automated-security-fixes"},"enablePagesSite":{"headers":{"accept":"application/vnd.github.switcheroo-preview+json"},"method":"POST","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"source":{"type":"object"},"source.branch":{"enum":["master","gh-pages"],"type":"string"},"source.path":{"type":"string"}},"url":"/repos/:owner/:repo/pages"},"enableVulnerabilityAlerts":{"headers":{"accept":"application/vnd.github.dorian-preview+json"},"method":"PUT","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/vulnerability-alerts"},"get":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo"},"getArchiveLink":{"method":"GET","params":{"archive_format":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/:archive_format/:ref"},"getBranch":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch"},"getBranchProtection":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection"},"getClones":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"per":{"enum":["day","week"],"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/traffic/clones"},"getCodeFrequencyStats":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stats/code_frequency"},"getCollaboratorPermissionLevel":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/collaborators/:username/permission"},"getCombinedStatusForRef":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref/status"},"getCommit":{"method":"GET","params":{"commit_sha":{"alias":"ref","deprecated":true,"type":"string"},"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"alias":"commit_sha","deprecated":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref"},"getCommitActivityStats":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stats/commit_activity"},"getCommitComment":{"method":"GET","params":{"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments/:comment_id"},"getCommitRefSha":{"deprecated":"\"Get the SHA-1 of a commit reference\" will be removed. Use \"Get a single commit\" instead with media type format set to \"sha\" instead.","method":"GET","params":{"owner":{"required":true,"type":"string"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref"},"getContents":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"ref":{"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/contents/:path"},"getContributorsStats":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stats/contributors"},"getDeployKey":{"method":"GET","params":{"key_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/keys/:key_id"},"getDeployment":{"method":"GET","params":{"deployment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/deployments/:deployment_id"},"getDeploymentStatus":{"method":"GET","params":{"deployment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"status_id":{"required":true,"type":"integer"}},"url":"/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"},"getDownload":{"method":"GET","params":{"download_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/downloads/:download_id"},"getHook":{"method":"GET","params":{"hook_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks/:hook_id"},"getLatestPagesBuild":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages/builds/latest"},"getLatestRelease":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/latest"},"getPages":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages"},"getPagesBuild":{"method":"GET","params":{"build_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages/builds/:build_id"},"getParticipationStats":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stats/participation"},"getProtectedBranchAdminEnforcement":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/enforce_admins"},"getProtectedBranchPullRequestReviewEnforcement":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"},"getProtectedBranchRequiredSignatures":{"headers":{"accept":"application/vnd.github.zzzax-preview+json"},"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_signatures"},"getProtectedBranchRequiredStatusChecks":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks"},"getProtectedBranchRestrictions":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions"},"getPunchCardStats":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/stats/punch_card"},"getReadme":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"ref":{"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/readme"},"getRelease":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"release_id":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/:release_id"},"getReleaseAsset":{"method":"GET","params":{"asset_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/assets/:asset_id"},"getReleaseByTag":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"tag":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/tags/:tag"},"getTopPaths":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/traffic/popular/paths"},"getTopReferrers":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/traffic/popular/referrers"},"getViews":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"per":{"enum":["day","week"],"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/traffic/views"},"list":{"method":"GET","params":{"affiliation":{"type":"string"},"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"sort":{"enum":["created","updated","pushed","full_name"],"type":"string"},"type":{"enum":["all","owner","public","private","member"],"type":"string"},"visibility":{"enum":["all","public","private"],"type":"string"}},"url":"/user/repos"},"listAssetsForRelease":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"release_id":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/:release_id/assets"},"listBranches":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"protected":{"type":"boolean"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches"},"listBranchesForHeadCommit":{"headers":{"accept":"application/vnd.github.groot-preview+json"},"method":"GET","params":{"commit_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:commit_sha/branches-where-head"},"listCollaborators":{"method":"GET","params":{"affiliation":{"enum":["outside","direct","all"],"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/collaborators"},"listCommentsForCommit":{"method":"GET","params":{"commit_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"ref":{"alias":"commit_sha","deprecated":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:commit_sha/comments"},"listCommitComments":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments"},"listCommits":{"method":"GET","params":{"author":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"path":{"type":"string"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"},"since":{"type":"string"},"until":{"type":"string"}},"url":"/repos/:owner/:repo/commits"},"listContributors":{"method":"GET","params":{"anon":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/contributors"},"listDeployKeys":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/keys"},"listDeploymentStatuses":{"method":"GET","params":{"deployment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/deployments/:deployment_id/statuses"},"listDeployments":{"method":"GET","params":{"environment":{"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"ref":{"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"},"task":{"type":"string"}},"url":"/repos/:owner/:repo/deployments"},"listDownloads":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/downloads"},"listForOrg":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"sort":{"enum":["created","updated","pushed","full_name"],"type":"string"},"type":{"enum":["all","public","private","forks","sources","member"],"type":"string"}},"url":"/orgs/:org/repos"},"listForUser":{"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"sort":{"enum":["created","updated","pushed","full_name"],"type":"string"},"type":{"enum":["all","owner","member"],"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/repos"},"listForks":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"},"sort":{"enum":["newest","oldest","stargazers"],"type":"string"}},"url":"/repos/:owner/:repo/forks"},"listHooks":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks"},"listInvitations":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/invitations"},"listInvitationsForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/repository_invitations"},"listLanguages":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/languages"},"listPagesBuilds":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages/builds"},"listProtectedBranchRequiredStatusChecksContexts":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"},"listProtectedBranchTeamRestrictions":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"},"listProtectedBranchUserRestrictions":{"method":"GET","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/users"},"listPublic":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/repositories"},"listPullRequestsAssociatedWithCommit":{"headers":{"accept":"application/vnd.github.groot-preview+json"},"method":"GET","params":{"commit_sha":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:commit_sha/pulls"},"listReleases":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases"},"listStatusesForRef":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"ref":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/commits/:ref/statuses"},"listTags":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/tags"},"listTeams":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/teams"},"listTopics":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/topics"},"merge":{"method":"POST","params":{"base":{"required":true,"type":"string"},"commit_message":{"type":"string"},"head":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/merges"},"pingHook":{"method":"POST","params":{"hook_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks/:hook_id/pings"},"removeBranchProtection":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection"},"removeCollaborator":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/collaborators/:username"},"removeDeployKey":{"method":"DELETE","params":{"key_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/keys/:key_id"},"removeProtectedBranchAdminEnforcement":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/enforce_admins"},"removeProtectedBranchPullRequestReviewEnforcement":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"},"removeProtectedBranchRequiredSignatures":{"headers":{"accept":"application/vnd.github.zzzax-preview+json"},"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_signatures"},"removeProtectedBranchRequiredStatusChecks":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks"},"removeProtectedBranchRequiredStatusChecksContexts":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"contexts":{"mapTo":"data","required":true,"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"},"removeProtectedBranchRestrictions":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions"},"removeProtectedBranchTeamRestrictions":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"teams":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"},"removeProtectedBranchUserRestrictions":{"method":"DELETE","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"users":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/users"},"replaceProtectedBranchRequiredStatusChecksContexts":{"method":"PUT","params":{"branch":{"required":true,"type":"string"},"contexts":{"mapTo":"data","required":true,"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"},"replaceProtectedBranchTeamRestrictions":{"method":"PUT","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"teams":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"},"replaceProtectedBranchUserRestrictions":{"method":"PUT","params":{"branch":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"users":{"mapTo":"data","required":true,"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection/restrictions/users"},"replaceTopics":{"method":"PUT","params":{"names":{"required":true,"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/topics"},"requestPageBuild":{"headers":{"accept":"application/vnd.github.mister-fantastic-preview+json"},"method":"POST","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/pages/builds"},"retrieveCommunityProfileMetrics":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/community/profile"},"testPushHook":{"method":"POST","params":{"hook_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks/:hook_id/tests"},"transfer":{"headers":{"accept":"application/vnd.github.nightshade-preview+json"},"method":"POST","params":{"new_owner":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"team_ids":{"type":"integer[]"}},"url":"/repos/:owner/:repo/transfer"},"update":{"method":"PATCH","params":{"allow_merge_commit":{"type":"boolean"},"allow_rebase_merge":{"type":"boolean"},"allow_squash_merge":{"type":"boolean"},"archived":{"type":"boolean"},"default_branch":{"type":"string"},"description":{"type":"string"},"has_issues":{"type":"boolean"},"has_projects":{"type":"boolean"},"has_wiki":{"type":"boolean"},"homepage":{"type":"string"},"is_template":{"type":"boolean"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"private":{"type":"boolean"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo"},"updateBranchProtection":{"method":"PUT","params":{"branch":{"required":true,"type":"string"},"enforce_admins":{"allowNull":true,"required":true,"type":"boolean"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"required_pull_request_reviews":{"allowNull":true,"required":true,"type":"object"},"required_pull_request_reviews.dismiss_stale_reviews":{"type":"boolean"},"required_pull_request_reviews.dismissal_restrictions":{"type":"object"},"required_pull_request_reviews.dismissal_restrictions.teams":{"type":"string[]"},"required_pull_request_reviews.dismissal_restrictions.users":{"type":"string[]"},"required_pull_request_reviews.require_code_owner_reviews":{"type":"boolean"},"required_pull_request_reviews.required_approving_review_count":{"type":"integer"},"required_status_checks":{"allowNull":true,"required":true,"type":"object"},"required_status_checks.contexts":{"required":true,"type":"string[]"},"required_status_checks.strict":{"required":true,"type":"boolean"},"restrictions":{"allowNull":true,"required":true,"type":"object"},"restrictions.teams":{"type":"string[]"},"restrictions.users":{"type":"string[]"}},"url":"/repos/:owner/:repo/branches/:branch/protection"},"updateCommitComment":{"method":"PATCH","params":{"body":{"required":true,"type":"string"},"comment_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/comments/:comment_id"},"updateFile":{"deprecated":"octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)","method":"PUT","params":{"author":{"type":"object"},"author.email":{"required":true,"type":"string"},"author.name":{"required":true,"type":"string"},"branch":{"type":"string"},"committer":{"type":"object"},"committer.email":{"required":true,"type":"string"},"committer.name":{"required":true,"type":"string"},"content":{"required":true,"type":"string"},"message":{"required":true,"type":"string"},"owner":{"required":true,"type":"string"},"path":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"sha":{"type":"string"}},"url":"/repos/:owner/:repo/contents/:path"},"updateHook":{"method":"PATCH","params":{"active":{"type":"boolean"},"add_events":{"type":"string[]"},"config":{"type":"object"},"config.content_type":{"type":"string"},"config.insecure_ssl":{"type":"string"},"config.secret":{"type":"string"},"config.url":{"required":true,"type":"string"},"events":{"type":"string[]"},"hook_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"remove_events":{"type":"string[]"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/hooks/:hook_id"},"updateInformationAboutPagesSite":{"method":"PUT","params":{"cname":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"source":{"enum":["\"gh-pages\"","\"master\"","\"master /docs\""],"type":"string"}},"url":"/repos/:owner/:repo/pages"},"updateInvitation":{"method":"PATCH","params":{"invitation_id":{"required":true,"type":"integer"},"owner":{"required":true,"type":"string"},"permissions":{"enum":["read","write","admin"],"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/invitations/:invitation_id"},"updateProtectedBranchPullRequestReviewEnforcement":{"method":"PATCH","params":{"branch":{"required":true,"type":"string"},"dismiss_stale_reviews":{"type":"boolean"},"dismissal_restrictions":{"type":"object"},"dismissal_restrictions.teams":{"type":"string[]"},"dismissal_restrictions.users":{"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"require_code_owner_reviews":{"type":"boolean"},"required_approving_review_count":{"type":"integer"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"},"updateProtectedBranchRequiredStatusChecks":{"method":"PATCH","params":{"branch":{"required":true,"type":"string"},"contexts":{"type":"string[]"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"strict":{"type":"boolean"}},"url":"/repos/:owner/:repo/branches/:branch/protection/required_status_checks"},"updateRelease":{"method":"PATCH","params":{"body":{"type":"string"},"draft":{"type":"boolean"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"prerelease":{"type":"boolean"},"release_id":{"required":true,"type":"integer"},"repo":{"required":true,"type":"string"},"tag_name":{"type":"string"},"target_commitish":{"type":"string"}},"url":"/repos/:owner/:repo/releases/:release_id"},"updateReleaseAsset":{"method":"PATCH","params":{"asset_id":{"required":true,"type":"integer"},"label":{"type":"string"},"name":{"type":"string"},"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"}},"url":"/repos/:owner/:repo/releases/assets/:asset_id"},"uploadReleaseAsset":{"method":"POST","params":{"file":{"mapTo":"data","required":true,"type":"string | object"},"headers":{"required":true,"type":"object"},"headers.content-length":{"required":true,"type":"integer"},"headers.content-type":{"required":true,"type":"string"},"label":{"type":"string"},"name":{"required":true,"type":"string"},"url":{"required":true,"type":"string"}},"url":":url"}},"search":{"code":{"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["indexed"],"type":"string"}},"url":"/search/code"},"commits":{"headers":{"accept":"application/vnd.github.cloak-preview+json"},"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["author-date","committer-date"],"type":"string"}},"url":"/search/commits"},"issues":{"deprecated":"octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)","method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["comments","reactions","reactions-+1","reactions--1","reactions-smile","reactions-thinking_face","reactions-heart","reactions-tada","interactions","created","updated"],"type":"string"}},"url":"/search/issues"},"issuesAndPullRequests":{"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["comments","reactions","reactions-+1","reactions--1","reactions-smile","reactions-thinking_face","reactions-heart","reactions-tada","interactions","created","updated"],"type":"string"}},"url":"/search/issues"},"labels":{"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"q":{"required":true,"type":"string"},"repository_id":{"required":true,"type":"integer"},"sort":{"enum":["created","updated"],"type":"string"}},"url":"/search/labels"},"repos":{"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["stars","forks","help-wanted-issues","updated"],"type":"string"}},"url":"/search/repositories"},"topics":{"method":"GET","params":{"q":{"required":true,"type":"string"}},"url":"/search/topics"},"users":{"method":"GET","params":{"order":{"enum":["desc","asc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"q":{"required":true,"type":"string"},"sort":{"enum":["followers","repositories","joined"],"type":"string"}},"url":"/search/users"}},"teams":{"addMember":{"method":"PUT","params":{"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/members/:username"},"addOrUpdateMembership":{"method":"PUT","params":{"role":{"enum":["member","maintainer"],"type":"string"},"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/memberships/:username"},"addOrUpdateProject":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"PUT","params":{"permission":{"enum":["read","write","admin"],"type":"string"},"project_id":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/projects/:project_id"},"addOrUpdateRepo":{"method":"PUT","params":{"owner":{"required":true,"type":"string"},"permission":{"enum":["pull","push","admin"],"type":"string"},"repo":{"required":true,"type":"string"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/repos/:owner/:repo"},"checkManagesRepo":{"method":"GET","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/repos/:owner/:repo"},"create":{"method":"POST","params":{"description":{"type":"string"},"maintainers":{"type":"string[]"},"name":{"required":true,"type":"string"},"org":{"required":true,"type":"string"},"parent_team_id":{"type":"integer"},"permission":{"enum":["pull","push","admin"],"type":"string"},"privacy":{"enum":["secret","closed"],"type":"string"},"repo_names":{"type":"string[]"}},"url":"/orgs/:org/teams"},"createDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"POST","params":{"body":{"required":true,"type":"string"},"private":{"type":"boolean"},"team_id":{"required":true,"type":"integer"},"title":{"required":true,"type":"string"}},"url":"/teams/:team_id/discussions"},"createDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"POST","params":{"body":{"required":true,"type":"string"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments"},"delete":{"method":"DELETE","params":{"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id"},"deleteDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"DELETE","params":{"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number"},"deleteDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"DELETE","params":{"comment_number":{"required":true,"type":"integer"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments/:comment_number"},"get":{"method":"GET","params":{"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id"},"getByName":{"method":"GET","params":{"org":{"required":true,"type":"string"},"team_slug":{"required":true,"type":"string"}},"url":"/orgs/:org/teams/:team_slug"},"getDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"GET","params":{"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number"},"getDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"GET","params":{"comment_number":{"required":true,"type":"integer"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments/:comment_number"},"getMember":{"method":"GET","params":{"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/members/:username"},"getMembership":{"method":"GET","params":{"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/memberships/:username"},"list":{"method":"GET","params":{"org":{"required":true,"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/orgs/:org/teams"},"listChild":{"headers":{"accept":"application/vnd.github.hellcat-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/teams"},"listDiscussionComments":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"discussion_number":{"required":true,"type":"integer"},"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments"},"listDiscussions":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"GET","params":{"direction":{"enum":["asc","desc"],"type":"string"},"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions"},"listForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/teams"},"listMembers":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"role":{"enum":["member","maintainer","all"],"type":"string"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/members"},"listPendingInvitations":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/invitations"},"listProjects":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/projects"},"listRepos":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/repos"},"removeMember":{"method":"DELETE","params":{"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/members/:username"},"removeMembership":{"method":"DELETE","params":{"team_id":{"required":true,"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/teams/:team_id/memberships/:username"},"removeProject":{"method":"DELETE","params":{"project_id":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/projects/:project_id"},"removeRepo":{"method":"DELETE","params":{"owner":{"required":true,"type":"string"},"repo":{"required":true,"type":"string"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/repos/:owner/:repo"},"reviewProject":{"headers":{"accept":"application/vnd.github.inertia-preview+json"},"method":"GET","params":{"project_id":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/projects/:project_id"},"update":{"method":"PATCH","params":{"description":{"type":"string"},"name":{"required":true,"type":"string"},"parent_team_id":{"type":"integer"},"permission":{"enum":["pull","push","admin"],"type":"string"},"privacy":{"type":"string"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id"},"updateDiscussion":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"PATCH","params":{"body":{"type":"string"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"},"title":{"type":"string"}},"url":"/teams/:team_id/discussions/:discussion_number"},"updateDiscussionComment":{"headers":{"accept":"application/vnd.github.echo-preview+json"},"method":"PATCH","params":{"body":{"required":true,"type":"string"},"comment_number":{"required":true,"type":"integer"},"discussion_number":{"required":true,"type":"integer"},"team_id":{"required":true,"type":"integer"}},"url":"/teams/:team_id/discussions/:discussion_number/comments/:comment_number"}},"users":{"addEmails":{"method":"POST","params":{"emails":{"required":true,"type":"string[]"}},"url":"/user/emails"},"block":{"method":"PUT","params":{"username":{"required":true,"type":"string"}},"url":"/user/blocks/:username"},"checkBlocked":{"method":"GET","params":{"username":{"required":true,"type":"string"}},"url":"/user/blocks/:username"},"checkFollowing":{"method":"GET","params":{"username":{"required":true,"type":"string"}},"url":"/user/following/:username"},"checkFollowingForUser":{"method":"GET","params":{"target_user":{"required":true,"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/following/:target_user"},"createGpgKey":{"method":"POST","params":{"armored_public_key":{"type":"string"}},"url":"/user/gpg_keys"},"createPublicKey":{"method":"POST","params":{"key":{"type":"string"},"title":{"type":"string"}},"url":"/user/keys"},"deleteEmails":{"method":"DELETE","params":{"emails":{"required":true,"type":"string[]"}},"url":"/user/emails"},"deleteGpgKey":{"method":"DELETE","params":{"gpg_key_id":{"required":true,"type":"integer"}},"url":"/user/gpg_keys/:gpg_key_id"},"deletePublicKey":{"method":"DELETE","params":{"key_id":{"required":true,"type":"integer"}},"url":"/user/keys/:key_id"},"follow":{"method":"PUT","params":{"username":{"required":true,"type":"string"}},"url":"/user/following/:username"},"getAuthenticated":{"method":"GET","params":{},"url":"/user"},"getByUsername":{"method":"GET","params":{"username":{"required":true,"type":"string"}},"url":"/users/:username"},"getContextForUser":{"headers":{"accept":"application/vnd.github.hagar-preview+json"},"method":"GET","params":{"subject_id":{"type":"string"},"subject_type":{"enum":["organization","repository","issue","pull_request"],"type":"string"},"username":{"required":true,"type":"string"}},"url":"/users/:username/hovercard"},"getGpgKey":{"method":"GET","params":{"gpg_key_id":{"required":true,"type":"integer"}},"url":"/user/gpg_keys/:gpg_key_id"},"getPublicKey":{"method":"GET","params":{"key_id":{"required":true,"type":"integer"}},"url":"/user/keys/:key_id"},"list":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"since":{"type":"string"}},"url":"/users"},"listBlocked":{"method":"GET","params":{},"url":"/user/blocks"},"listEmails":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/emails"},"listFollowersForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/followers"},"listFollowersForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/followers"},"listFollowingForAuthenticatedUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/following"},"listFollowingForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/following"},"listGpgKeys":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/gpg_keys"},"listGpgKeysForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/gpg_keys"},"listPublicEmails":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/public_emails"},"listPublicKeys":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"}},"url":"/user/keys"},"listPublicKeysForUser":{"method":"GET","params":{"page":{"type":"integer"},"per_page":{"type":"integer"},"username":{"required":true,"type":"string"}},"url":"/users/:username/keys"},"togglePrimaryEmailVisibility":{"method":"PATCH","params":{"email":{"required":true,"type":"string"},"visibility":{"required":true,"type":"string"}},"url":"/user/email/visibility"},"unblock":{"method":"DELETE","params":{"username":{"required":true,"type":"string"}},"url":"/user/blocks/:username"},"unfollow":{"method":"DELETE","params":{"username":{"required":true,"type":"string"}},"url":"/user/following/:username"},"updateAuthenticated":{"method":"PATCH","params":{"bio":{"type":"string"},"blog":{"type":"string"},"company":{"type":"string"},"email":{"type":"string"},"hireable":{"type":"boolean"},"location":{"type":"string"},"name":{"type":"string"}},"url":"/user"}}};

/***/ }),
/* 706 */,
/* 707 */,
/* 708 */,
/* 709 */,
/* 710 */,
/* 711 */,
/* 712 */,
/* 713 */,
/* 714 */,
/* 715 */,
/* 716 */,
/* 717 */,
/* 718 */,
/* 719 */,
/* 720 */,
/* 721 */,
/* 722 */,
/* 723 */,
/* 724 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(622);
const globParent = __webpack_require__(230);
const isGlob = __webpack_require__(486);
const micromatch = __webpack_require__(74);
const GLOBSTAR = '**';
function isStaticPattern(pattern) {
    return !isDynamicPattern(pattern);
}
exports.isStaticPattern = isStaticPattern;
function isDynamicPattern(pattern) {
    return isGlob(pattern, { strict: false });
}
exports.isDynamicPattern = isDynamicPattern;
function convertToPositivePattern(pattern) {
    return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
}
exports.convertToPositivePattern = convertToPositivePattern;
function convertToNegativePattern(pattern) {
    return '!' + pattern;
}
exports.convertToNegativePattern = convertToNegativePattern;
function isNegativePattern(pattern) {
    return pattern.startsWith('!') && pattern[1] !== '(';
}
exports.isNegativePattern = isNegativePattern;
function isPositivePattern(pattern) {
    return !isNegativePattern(pattern);
}
exports.isPositivePattern = isPositivePattern;
function getNegativePatterns(patterns) {
    return patterns.filter(isNegativePattern);
}
exports.getNegativePatterns = getNegativePatterns;
function getPositivePatterns(patterns) {
    return patterns.filter(isPositivePattern);
}
exports.getPositivePatterns = getPositivePatterns;
function getBaseDirectory(pattern) {
    return globParent(pattern);
}
exports.getBaseDirectory = getBaseDirectory;
function hasGlobStar(pattern) {
    return pattern.indexOf(GLOBSTAR) !== -1;
}
exports.hasGlobStar = hasGlobStar;
function endsWithSlashGlobStar(pattern) {
    return pattern.endsWith('/' + GLOBSTAR);
}
exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
function isAffectDepthOfReadingPattern(pattern) {
    const basename = path.basename(pattern);
    return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
}
exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
function getNaiveDepth(pattern) {
    const base = getBaseDirectory(pattern);
    const patternDepth = pattern.split('/').length;
    const patternBaseDepth = base.split('/').length;
    /**
     * This is a hack for pattern that has no base directory.
     *
     * This is related to the `*\something\*` pattern.
     */
    if (base === '.') {
        return patternDepth - patternBaseDepth;
    }
    return patternDepth - patternBaseDepth - 1;
}
exports.getNaiveDepth = getNaiveDepth;
function getMaxNaivePatternsDepth(patterns) {
    return patterns.reduce((max, pattern) => {
        const depth = getNaiveDepth(pattern);
        return depth > max ? depth : max;
    }, 0);
}
exports.getMaxNaivePatternsDepth = getMaxNaivePatternsDepth;
function makeRe(pattern, options) {
    return micromatch.makeRe(pattern, options);
}
exports.makeRe = makeRe;
function convertPatternsToRe(patterns, options) {
    return patterns.map((pattern) => makeRe(pattern, options));
}
exports.convertPatternsToRe = convertPatternsToRe;
function matchAny(entry, patternsRe) {
    const filepath = entry.replace(/^\.[\\\/]/, '');
    return patternsRe.some((patternRe) => patternRe.test(filepath));
}
exports.matchAny = matchAny;


/***/ }),
/* 725 */,
/* 726 */,
/* 727 */,
/* 728 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function read(path, settings, callback) {
    settings.fs.lstat(path, (lstatError, lstat) => {
        if (lstatError) {
            return callFailureCallback(callback, lstatError);
        }
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
            return callSuccessCallback(callback, lstat);
        }
        settings.fs.stat(path, (statError, stat) => {
            if (statError) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    return callFailureCallback(callback, statError);
                }
                return callSuccessCallback(callback, lstat);
            }
            if (settings.markSymbolicLink) {
                stat.isSymbolicLink = () => true;
            }
            callSuccessCallback(callback, stat);
        });
    });
}
exports.read = read;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, result) {
    callback(null, result);
}


/***/ }),
/* 729 */,
/* 730 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */



const util = __webpack_require__(669);
const toRegexRange = __webpack_require__(789);

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

const transform = toNumber => {
  return value => toNumber === true ? Number(value) : String(value);
};

const isValidValue = value => {
  return typeof value === 'number' || (typeof value === 'string' && value !== '');
};

const isNumber = num => Number.isInteger(+num);

const zeros = input => {
  let value = `${input}`;
  let index = -1;
  if (value[0] === '-') value = value.slice(1);
  if (value === '0') return false;
  while (value[++index] === '0');
  return index > 0;
};

const stringify = (start, end, options) => {
  if (typeof start === 'string' || typeof end === 'string') {
    return true;
  }
  return options.stringify === true;
};

const pad = (input, maxLength, toNumber) => {
  if (maxLength > 0) {
    let dash = input[0] === '-' ? '-' : '';
    if (dash) input = input.slice(1);
    input = (dash + input.padStart(dash ? maxLength - 1 : maxLength, '0'));
  }
  if (toNumber === false) {
    return String(input);
  }
  return input;
};

const toMaxLen = (input, maxLength) => {
  let negative = input[0] === '-' ? '-' : '';
  if (negative) {
    input = input.slice(1);
    maxLength--;
  }
  while (input.length < maxLength) input = '0' + input;
  return negative ? ('-' + input) : input;
};

const toSequence = (parts, options) => {
  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);

  let prefix = options.capture ? '' : '?:';
  let positives = '';
  let negatives = '';
  let result;

  if (parts.positives.length) {
    positives = parts.positives.join('|');
  }

  if (parts.negatives.length) {
    negatives = `-(${prefix}${parts.negatives.join('|')})`;
  }

  if (positives && negatives) {
    result = `${positives}|${negatives}`;
  } else {
    result = positives || negatives;
  }

  if (options.wrap) {
    return `(${prefix}${result})`;
  }

  return result;
};

const toRange = (a, b, isNumbers, options) => {
  if (isNumbers) {
    return toRegexRange(a, b, { wrap: false, ...options });
  }

  let start = String.fromCharCode(a);
  if (a === b) return start;

  let stop = String.fromCharCode(b);
  return `[${start}-${stop}]`;
};

const toRegex = (start, end, options) => {
  if (Array.isArray(start)) {
    let wrap = options.wrap === true;
    let prefix = options.capture ? '' : '?:';
    return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
  }
  return toRegexRange(start, end, options);
};

const rangeError = (...args) => {
  return new RangeError('Invalid range arguments: ' + util.inspect(...args));
};

const invalidRange = (start, end, options) => {
  if (options.strictRanges === true) throw rangeError([start, end]);
  return [];
};

const invalidStep = (step, options) => {
  if (options.strictRanges === true) {
    throw new TypeError(`Expected step "${step}" to be a number`);
  }
  return [];
};

const fillNumbers = (start, end, step = 1, options = {}) => {
  let a = Number(start);
  let b = Number(end);

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    if (options.strictRanges === true) throw rangeError([start, end]);
    return [];
  }

  // fix negative zero
  if (a === 0) a = 0;
  if (b === 0) b = 0;

  let descending = a > b;
  let startString = String(start);
  let endString = String(end);
  let stepString = String(step);
  step = Math.max(Math.abs(step), 1);

  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
  let toNumber = padded === false && stringify(start, end, options) === false;
  let format = options.transform || transform(toNumber);

  if (options.toRegex && step === 1) {
    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
  }

  let parts = { negatives: [], positives: [] };
  let push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    if (options.toRegex === true && step > 1) {
      push(a);
    } else {
      range.push(pad(format(a, index), maxLen, toNumber));
    }
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return step > 1
      ? toSequence(parts, options)
      : toRegex(range, null, { wrap: false, ...options });
  }

  return range;
};

const fillLetters = (start, end, step = 1, options = {}) => {
  if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1)) {
    return invalidRange(start, end, options);
  }


  let format = options.transform || (val => String.fromCharCode(val));
  let a = `${start}`.charCodeAt(0);
  let b = `${end}`.charCodeAt(0);

  let descending = a > b;
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  if (options.toRegex && step === 1) {
    return toRange(min, max, false, options);
  }

  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    range.push(format(a, index));
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return toRegex(range, null, { wrap: false, options });
  }

  return range;
};

const fill = (start, end, step, options = {}) => {
  if (end == null && isValidValue(start)) {
    return [start];
  }

  if (!isValidValue(start) || !isValidValue(end)) {
    return invalidRange(start, end, options);
  }

  if (typeof step === 'function') {
    return fill(start, end, 1, { transform: step });
  }

  if (isObject(step)) {
    return fill(start, end, 0, step);
  }

  let opts = { ...options };
  if (opts.capture === true) opts.wrap = true;
  step = step || opts.step || 1;

  if (!isNumber(step)) {
    if (step != null && !isObject(step)) return invalidStep(step, opts);
    return fill(start, end, 1, step);
  }

  if (isNumber(start) && isNumber(end)) {
    return fillNumbers(start, end, step, opts);
  }

  return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
};

module.exports = fill;


/***/ }),
/* 731 */,
/* 732 */,
/* 733 */,
/* 734 */,
/* 735 */,
/* 736 */,
/* 737 */,
/* 738 */,
/* 739 */,
/* 740 */,
/* 741 */,
/* 742 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __webpack_require__(818)
} else {
  core = __webpack_require__(197)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),
/* 743 */,
/* 744 */,
/* 745 */,
/* 746 */,
/* 747 */
/***/ (function(module) {

module.exports = require("fs");

/***/ }),
/* 748 */,
/* 749 */,
/* 750 */,
/* 751 */,
/* 752 */,
/* 753 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __webpack_require__(385);
var universalUserAgent = __webpack_require__(211);
var isPlainObject = _interopDefault(__webpack_require__(696));
var nodeFetch = _interopDefault(__webpack_require__(454));
var requestError = __webpack_require__(463);

const VERSION = "0.0.0-development";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requsets


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          Object.assign(error, JSON.parse(error.message));
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),
/* 754 */,
/* 755 */,
/* 756 */,
/* 757 */,
/* 758 */,
/* 759 */,
/* 760 */,
/* 761 */
/***/ (function(module) {

module.exports = require("zlib");

/***/ }),
/* 762 */,
/* 763 */
/***/ (function(module) {

module.exports = removeHook

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1)
}


/***/ }),
/* 764 */,
/* 765 */,
/* 766 */,
/* 767 */,
/* 768 */
/***/ (function(module) {

"use strict";

module.exports = function (x) {
	var lf = typeof x === 'string' ? '\n' : '\n'.charCodeAt();
	var cr = typeof x === 'string' ? '\r' : '\r'.charCodeAt();

	if (x[x.length - 1] === lf) {
		x = x.slice(0, x.length - 1);
	}

	if (x[x.length - 1] === cr) {
		x = x.slice(0, x.length - 1);
	}

	return x;
};


/***/ }),
/* 769 */,
/* 770 */,
/* 771 */,
/* 772 */,
/* 773 */,
/* 774 */,
/* 775 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(413);
const stream_2 = __webpack_require__(608);
const provider_1 = __webpack_require__(589);
class ProviderStream extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new stream_2.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const dest = new stream_1.Readable({ objectMode: true, read: () => { } });
        source
            .once('error', (error) => dest.emit('error', error))
            .on('data', (entry) => dest.emit('data', options.transform(entry)))
            .once('end', () => dest.emit('end'));
        return dest;
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderStream;


/***/ }),
/* 776 */,
/* 777 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getFirstPage

const getPage = __webpack_require__(265)

function getFirstPage (octokit, link, headers) {
  return getPage(octokit, link, 'first', headers)
}


/***/ }),
/* 778 */,
/* 779 */,
/* 780 */,
/* 781 */,
/* 782 */,
/* 783 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const stringify = __webpack_require__(382);
const compile = __webpack_require__(435);
const expand = __webpack_require__(441);
const parse = __webpack_require__(227);

/**
 * Expand the given pattern or create a regex-compatible string.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

const braces = (input, options = {}) => {
  let output = [];

  if (Array.isArray(input)) {
    for (let pattern of input) {
      let result = braces.create(pattern, options);
      if (Array.isArray(result)) {
        output.push(...result);
      } else {
        output.push(result);
      }
    }
  } else {
    output = [].concat(braces.create(input, options));
  }

  if (options && options.expand === true && options.nodupes === true) {
    output = [...new Set(output)];
  }
  return output;
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * // braces.parse(pattern, [, options]);
 * const ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * ```
 * @param {String} pattern Brace pattern to parse
 * @param {Object} options
 * @return {Object} Returns an AST
 * @api public
 */

braces.parse = (input, options = {}) => parse(input, options);

/**
 * Creates a braces string from an AST, or an AST node.
 *
 * ```js
 * const braces = require('braces');
 * let ast = braces.parse('foo/{a,b}/bar');
 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.stringify = (input, options = {}) => {
  if (typeof input === 'string') {
    return stringify(braces.parse(input, options), options);
  }
  return stringify(input, options);
};

/**
 * Compiles a brace pattern into a regex-compatible, optimized string.
 * This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.compile('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.compile = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }
  return compile(input, options);
};

/**
 * Expands a brace pattern into an array. This method is called by the
 * main [braces](#braces) function when `options.expand` is true. Before
 * using this method it's recommended that you read the [performance notes](#performance))
 * and advantages of using [.compile](#compile) instead.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.expand = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }

  let result = expand(input, options);

  // filter out empty strings if specified
  if (options.noempty === true) {
    result = result.filter(Boolean);
  }

  // filter out duplicates if specified
  if (options.nodupes === true) {
    result = [...new Set(result)];
  }

  return result;
};

/**
 * Processes a brace pattern and returns either an expanded array
 * (if `options.expand` is true), a highly optimized regex-compatible string.
 * This method is called by the main [braces](#braces) function.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.create = (input, options = {}) => {
  if (input === '' || input.length < 3) {
    return [input];
  }

 return options.expand !== true
    ? braces.compile(input, options)
    : braces.expand(input, options);
};

/**
 * Expose "braces"
 */

module.exports = braces;


/***/ }),
/* 784 */,
/* 785 */,
/* 786 */,
/* 787 */,
/* 788 */,
/* 789 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */



const isNumber = __webpack_require__(914);

const toRegexRange = (min, max, options) => {
  if (isNumber(min) === false) {
    throw new TypeError('toRegexRange: expected the first argument to be a number');
  }

  if (max === void 0 || min === max) {
    return String(min);
  }

  if (isNumber(max) === false) {
    throw new TypeError('toRegexRange: expected the second argument to be a number.');
  }

  let opts = { relaxZeros: true, ...options };
  if (typeof opts.strictZeros === 'boolean') {
    opts.relaxZeros = opts.strictZeros === false;
  }

  let relax = String(opts.relaxZeros);
  let shorthand = String(opts.shorthand);
  let capture = String(opts.capture);
  let wrap = String(opts.wrap);
  let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;

  if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
    return toRegexRange.cache[cacheKey].result;
  }

  let a = Math.min(min, max);
  let b = Math.max(min, max);

  if (Math.abs(a - b) === 1) {
    let result = min + '|' + max;
    if (opts.capture) {
      return `(${result})`;
    }
    if (opts.wrap === false) {
      return result;
    }
    return `(?:${result})`;
  }

  let isPadded = hasPadding(min) || hasPadding(max);
  let state = { min, max, a, b };
  let positives = [];
  let negatives = [];

  if (isPadded) {
    state.isPadded = isPadded;
    state.maxLen = String(state.max).length;
  }

  if (a < 0) {
    let newMin = b < 0 ? Math.abs(b) : 1;
    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
    a = state.a = 0;
  }

  if (b >= 0) {
    positives = splitToPatterns(a, b, state, opts);
  }

  state.negatives = negatives;
  state.positives = positives;
  state.result = collatePatterns(negatives, positives, opts);

  if (opts.capture === true) {
    state.result = `(${state.result})`;
  } else if (opts.wrap !== false && (positives.length + negatives.length) > 1) {
    state.result = `(?:${state.result})`;
  }

  toRegexRange.cache[cacheKey] = state;
  return state.result;
};

function collatePatterns(neg, pos, options) {
  let onlyNegative = filterPatterns(neg, pos, '-', false, options) || [];
  let onlyPositive = filterPatterns(pos, neg, '', false, options) || [];
  let intersected = filterPatterns(neg, pos, '-?', true, options) || [];
  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
  return subpatterns.join('|');
}

function splitToRanges(min, max) {
  let nines = 1;
  let zeros = 1;

  let stop = countNines(min, nines);
  let stops = new Set([max]);

  while (min <= stop && stop <= max) {
    stops.add(stop);
    nines += 1;
    stop = countNines(min, nines);
  }

  stop = countZeros(max + 1, zeros) - 1;

  while (min < stop && stop <= max) {
    stops.add(stop);
    zeros += 1;
    stop = countZeros(max + 1, zeros) - 1;
  }

  stops = [...stops];
  stops.sort(compare);
  return stops;
}

/**
 * Convert a range to a regex pattern
 * @param {Number} `start`
 * @param {Number} `stop`
 * @return {String}
 */

function rangeToPattern(start, stop, options) {
  if (start === stop) {
    return { pattern: start, count: [], digits: 0 };
  }

  let zipped = zip(start, stop);
  let digits = zipped.length;
  let pattern = '';
  let count = 0;

  for (let i = 0; i < digits; i++) {
    let [startDigit, stopDigit] = zipped[i];

    if (startDigit === stopDigit) {
      pattern += startDigit;

    } else if (startDigit !== '0' || stopDigit !== '9') {
      pattern += toCharacterClass(startDigit, stopDigit, options);

    } else {
      count++;
    }
  }

  if (count) {
    pattern += options.shorthand === true ? '\\d' : '[0-9]';
  }

  return { pattern, count: [count], digits };
}

function splitToPatterns(min, max, tok, options) {
  let ranges = splitToRanges(min, max);
  let tokens = [];
  let start = min;
  let prev;

  for (let i = 0; i < ranges.length; i++) {
    let max = ranges[i];
    let obj = rangeToPattern(String(start), String(max), options);
    let zeros = '';

    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      if (prev.count.length > 1) {
        prev.count.pop();
      }

      prev.count.push(obj.count[0]);
      prev.string = prev.pattern + toQuantifier(prev.count);
      start = max + 1;
      continue;
    }

    if (tok.isPadded) {
      zeros = padZeros(max, tok, options);
    }

    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
    tokens.push(obj);
    start = max + 1;
    prev = obj;
  }

  return tokens;
}

function filterPatterns(arr, comparison, prefix, intersection, options) {
  let result = [];

  for (let ele of arr) {
    let { string } = ele;

    // only push if _both_ are negative...
    if (!intersection && !contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }

    // or _both_ are positive
    if (intersection && contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }
  }
  return result;
}

/**
 * Zip strings
 */

function zip(a, b) {
  let arr = [];
  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
  return arr;
}

function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function contains(arr, key, val) {
  return arr.some(ele => ele[key] === val);
}

function countNines(min, len) {
  return Number(String(min).slice(0, -len) + '9'.repeat(len));
}

function countZeros(integer, zeros) {
  return integer - (integer % Math.pow(10, zeros));
}

function toQuantifier(digits) {
  let [start = 0, stop = ''] = digits;
  if (stop || start > 1) {
    return `{${start + (stop ? ',' + stop : '')}}`;
  }
  return '';
}

function toCharacterClass(a, b, options) {
  return `[${a}${(b - a === 1) ? '' : '-'}${b}]`;
}

function hasPadding(str) {
  return /^-?(0+)\d/.test(str);
}

function padZeros(value, tok, options) {
  if (!tok.isPadded) {
    return value;
  }

  let diff = Math.abs(tok.maxLen - String(value).length);
  let relax = options.relaxZeros !== false;

  switch (diff) {
    case 0:
      return '';
    case 1:
      return relax ? '0?' : '0';
    case 2:
      return relax ? '0{0,2}' : '00';
    default: {
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
  }
}

/**
 * Cache
 */

toRegexRange.cache = {};
toRegexRange.clearCache = () => (toRegexRange.cache = {});

/**
 * Expose `toRegexRange`
 */

module.exports = toRegexRange;


/***/ }),
/* 790 */,
/* 791 */,
/* 792 */,
/* 793 */,
/* 794 */,
/* 795 */,
/* 796 */,
/* 797 */,
/* 798 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(413);
const async_1 = __webpack_require__(291);
class StreamProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._stream = new stream_1.Readable({
            objectMode: true,
            read: () => { },
            destroy: this._reader.destroy.bind(this._reader)
        });
    }
    read() {
        this._reader.onError((error) => {
            this._stream.emit('error', error);
        });
        this._reader.onEntry((entry) => {
            this._stream.push(entry);
        });
        this._reader.onEnd(() => {
            this._stream.push(null);
        });
        this._reader.read();
        return this._stream;
    }
}
exports.default = StreamProvider;


/***/ }),
/* 799 */,
/* 800 */,
/* 801 */,
/* 802 */,
/* 803 */,
/* 804 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {promisify} = __webpack_require__(669);
const fs = __webpack_require__(747);
const path = __webpack_require__(622);
const fastGlob = __webpack_require__(406);
const gitIgnore = __webpack_require__(396);
const slash = __webpack_require__(184);

const DEFAULT_IGNORE = [
	'**/node_modules/**',
	'**/flow-typed/**',
	'**/coverage/**',
	'**/.git'
];

const readFileP = promisify(fs.readFile);

const mapGitIgnorePatternTo = base => ignore => {
	if (ignore.startsWith('!')) {
		return '!' + path.posix.join(base, ignore.slice(1));
	}

	return path.posix.join(base, ignore);
};

const parseGitIgnore = (content, options) => {
	const base = slash(path.relative(options.cwd, path.dirname(options.fileName)));

	return content
		.split(/\r?\n/)
		.filter(Boolean)
		.filter(line => !line.startsWith('#'))
		.map(mapGitIgnorePatternTo(base));
};

const reduceIgnore = files => {
	return files.reduce((ignores, file) => {
		ignores.add(parseGitIgnore(file.content, {
			cwd: file.cwd,
			fileName: file.filePath
		}));
		return ignores;
	}, gitIgnore());
};

const ensureAbsolutePathForCwd = (cwd, p) => {
	if (path.isAbsolute(p)) {
		if (p.startsWith(cwd)) {
			return p;
		}

		throw new Error(`Path ${p} is not in cwd ${cwd}`);
	}

	return path.join(cwd, p);
};

const getIsIgnoredPredecate = (ignores, cwd) => {
	return p => ignores.ignores(slash(path.relative(cwd, ensureAbsolutePathForCwd(cwd, p))));
};

const getFile = async (file, cwd) => {
	const filePath = path.join(cwd, file);
	const content = await readFileP(filePath, 'utf8');

	return {
		cwd,
		filePath,
		content
	};
};

const getFileSync = (file, cwd) => {
	const filePath = path.join(cwd, file);
	const content = fs.readFileSync(filePath, 'utf8');

	return {
		cwd,
		filePath,
		content
	};
};

const normalizeOptions = ({
	ignore = [],
	cwd = process.cwd()
} = {}) => {
	return {ignore, cwd};
};

module.exports = async options => {
	options = normalizeOptions(options);

	const paths = await fastGlob('**/.gitignore', {
		ignore: DEFAULT_IGNORE.concat(options.ignore),
		cwd: options.cwd
	});

	const files = await Promise.all(paths.map(file => getFile(file, options.cwd)));
	const ignores = reduceIgnore(files);

	return getIsIgnoredPredecate(ignores, options.cwd);
};

module.exports.sync = options => {
	options = normalizeOptions(options);

	const paths = fastGlob.sync('**/.gitignore', {
		ignore: DEFAULT_IGNORE.concat(options.ignore),
		cwd: options.cwd
	});

	const files = paths.map(file => getFileSync(file, options.cwd));
	const ignores = reduceIgnore(files);

	return getIsIgnoredPredecate(ignores, options.cwd);
};


/***/ }),
/* 805 */,
/* 806 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(224);
const constants = __webpack_require__(199);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHAR,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  let value = `[${args.join('-')}]`;

  try {
    /* eslint-disable no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
};

const negate = state => {
  let count = 1;

  while (state.peek() === '!' && (state.peek(2) !== '(' || state.peek(3) === '?')) {
    state.advance();
    state.start++;
    count++;
  }

  if (count % 2 === 0) {
    return false;
  }

  state.negated = true;
  state.start++;
  return true;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  let opts = { ...options };
  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  let bos = { type: 'bos', value: '', output: opts.prepend || '' };
  let tokens = [bos];

  let capture = opts.capture ? '' : '?:';
  let win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants.globChars(win32);
  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = (opts) => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  let nodot = opts.dot ? '' : NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;
  let qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  let state = {
    index: -1,
    start: 0,
    consumed: '',
    output: '',
    backtrack: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    tokens
  };

  let extglobs = [];
  let stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index];
  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    state.consumed += token.value || '';
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      let isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      let isExtglob = extglobs.length && (tok.type === 'pipe' || tok.type === 'paren');
      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren' && !EXTGLOB_CHARS[tok.value]) {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    let token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    let output = (opts.capture ? '(' : '') + token.open;

    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    increment('parens');
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(input.slice(state.index + 1))) {
        output = token.close = ')$))' + extglobStar;
      }

      if (token.prev.type === 'bos' && eos()) {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  if (opts.fastpaths !== false && !/(^[*!]|[/{[()\]}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : '\\' + m;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    state.output = output;
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      let next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      let match = /^\\+/.exec(input.slice(state.index + 1));
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance() || '';
      } else {
        value += advance() || '';
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        let inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            let idx = prev.value.lastIndexOf('[');
            let pre = prev.value.slice(0, idx);
            let rest = prev.value.slice(idx + 2);
            let posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = '\\' + value;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = '\\' + value;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      push({ type: 'paren', value });
      increment('parens');
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      let extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !input.slice(state.index + 1).includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = '\\' + value;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: '\\' + value });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: '\\' + value });
        continue;
      }

      decrement('brackets');

      let prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = '/' + value;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
        continue;
      }

      let escaped = utils.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      push({ type: 'brace', value, output: '(' });
      increment('braces');
      continue;
    }

    if (value === '}') {
      if (opts.nobrace === true || state.braces === 0) {
        push({ type: 'text', value, output: '\\' + value });
        continue;
      }

      let output = ')';

      if (state.dots === true) {
        let arr = tokens.slice();
        let range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      if (state.braces > 0 && stack[stack.length - 1] === 'braces') {
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        state.dots = true;
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      if (prev && prev.type === 'paren') {
        let next = peek();
        let output = value;

        if (next === '<' && !utils.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if (prev.value === '(' && !/[!=<:]/.test(next) || (next === '<' && !/[!=]/.test(peek(2)))) {
          output = '\\' + value;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate(state);
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if (prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) {
        let output = prev.extglob === true ? '\\' + value : value;
        push({ type: 'plus', value, output });
        continue;
      }

      // use regex behavior inside parens
      if (state.parens > 0 && opts.regex !== false) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = '\\' + value;
      }

      let match = REGEX_NON_SPECIAL_CHAR.exec(input.slice(state.index + 1));
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.consumed += value;
      continue;
    }

    if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        state.consumed += value;
        continue;
      }

      let prior = prev.prev;
      let before = prior.prev;
      let isStart = prior.type === 'slash' || prior.type === 'bos';
      let afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (!eos() && peek() !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      let isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      let isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (input.slice(state.index + 1, state.index + 4) === '/**') {
        let after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        state.consumed += '/**';
        state.index += 3;
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.consumed += value;
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = '(?:' + prior.output;

        prev.type = 'globstar';
        prev.output = globstar(opts) + '|$)';
        prev.value += value;

        state.output += prior.output + prev.output;
        state.consumed += value;
        continue;
      }

      let next = peek();
      if (prior.type === 'slash' && prior.prev.type !== 'bos' && next === '/') {
        let end = peek(2) !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = '(?:' + prior.output;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.consumed += value + advance();

        push({ type: 'slash', value, output: '' });
        continue;
      }

      if (prior.type === 'bos' && next === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.consumed += value + advance();
        push({ type: 'slash', value, output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.consumed += value;
      continue;
    }

    let token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (let token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse.fastpaths = (input, options) => {
  let opts = { ...options };
  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  let win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants.globChars(win32);

  let capture = opts.capture ? '' : '?:';
  let star = opts.bash === true ? '.*?' : STAR;
  let nodot = opts.dot ? NO_DOTS : NO_DOT;
  let slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = (opts) => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        let match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        let source = create(match[1], options);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  let output = create(input);
  if (output && opts.strictSlashes !== true) {
    output += `${SLASH_LITERAL}?`;
  }

  return output;
};

module.exports = parse;


/***/ }),
/* 807 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginate

const iterator = __webpack_require__(8)

function paginate (octokit, route, options, mapFn) {
  if (typeof options === 'function') {
    mapFn = options
    options = undefined
  }
  options = octokit.request.endpoint.merge(route, options)
  return gather(octokit, [], iterator(octokit, options)[Symbol.asyncIterator](), mapFn)
}

function gather (octokit, results, iterator, mapFn) {
  return iterator.next()
    .then(result => {
      if (result.done) {
        return results
      }

      let earlyExit = false
      function done () {
        earlyExit = true
      }

      results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data)

      if (earlyExit) {
        return results
      }

      return gather(octokit, results, iterator, mapFn)
    })
}


/***/ }),
/* 808 */,
/* 809 */,
/* 810 */,
/* 811 */,
/* 812 */,
/* 813 */,
/* 814 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = which
which.sync = whichSync

var isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

var path = __webpack_require__(622)
var COLON = isWindows ? ';' : ':'
var isexe = __webpack_require__(742)

function getNotFoundError (cmd) {
  var er = new Error('not found: ' + cmd)
  er.code = 'ENOENT'

  return er
}

function getPathInfo (cmd, opt) {
  var colon = opt.colon || COLON
  var pathEnv = opt.path || process.env.PATH || ''
  var pathExt = ['']

  pathEnv = pathEnv.split(colon)

  var pathExtExe = ''
  if (isWindows) {
    pathEnv.unshift(process.cwd())
    pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
    pathExt = pathExtExe.split(colon)


    // Always test the cmd itself first.  isexe will check to make sure
    // it's found in the pathExt set.
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
    pathEnv = ['']

  return {
    env: pathEnv,
    ext: pathExt,
    extExe: pathExtExe
  }
}

function which (cmd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  ;(function F (i, l) {
    if (i === l) {
      if (opt.all && found.length)
        return cb(null, found)
      else
        return cb(getNotFoundError(cmd))
    }

    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    ;(function E (ii, ll) {
      if (ii === ll) return F(i + 1, l)
      var ext = pathExt[ii]
      isexe(p + ext, { pathExt: pathExtExe }, function (er, is) {
        if (!er && is) {
          if (opt.all)
            found.push(p + ext)
          else
            return cb(null, p + ext)
        }
        return E(ii + 1, ll)
      })
    })(0, pathExt.length)
  })(0, pathEnv.length)
}

function whichSync (cmd, opt) {
  opt = opt || {}

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  for (var i = 0, l = pathEnv.length; i < l; i ++) {
    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    for (var j = 0, ll = pathExt.length; j < ll; j ++) {
      var cur = p + pathExt[j]
      var is
      try {
        is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}


/***/ }),
/* 815 */,
/* 816 */
/***/ (function(module) {

"use strict";

module.exports = /^#!.*/;


/***/ }),
/* 817 */,
/* 818 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),
/* 819 */,
/* 820 */,
/* 821 */,
/* 822 */,
/* 823 */,
/* 824 */,
/* 825 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Mime = __webpack_require__(217);
module.exports = new Mime(__webpack_require__(460));


/***/ }),
/* 826 */,
/* 827 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(366);


/***/ }),
/* 828 */,
/* 829 */,
/* 830 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var reusify = __webpack_require__(440)

function fastqueue (context, worker, concurrency) {
  if (typeof context === 'function') {
    concurrency = worker
    worker = context
    context = null
  }

  var cache = reusify(Task)
  var queueHead = null
  var queueTail = null
  var _running = 0

  var self = {
    push: push,
    drain: noop,
    saturated: noop,
    pause: pause,
    paused: false,
    concurrency: concurrency,
    running: running,
    resume: resume,
    idle: idle,
    length: length,
    unshift: unshift,
    empty: noop,
    kill: kill,
    killAndDrain: killAndDrain
  }

  return self

  function running () {
    return _running
  }

  function pause () {
    self.paused = true
  }

  function length () {
    var current = queueHead
    var counter = 0

    while (current) {
      current = current.next
      counter++
    }

    return counter
  }

  function resume () {
    if (!self.paused) return
    self.paused = false
    for (var i = 0; i < self.concurrency; i++) {
      _running++
      release()
    }
  }

  function idle () {
    return _running === 0 && self.length() === 0
  }

  function push (value, done) {
    var current = cache.get()

    current.context = context
    current.release = release
    current.value = value
    current.callback = done || noop

    if (_running === self.concurrency || self.paused) {
      if (queueTail) {
        queueTail.next = current
        queueTail = current
      } else {
        queueHead = current
        queueTail = current
        self.saturated()
      }
    } else {
      _running++
      worker.call(context, current.value, current.worked)
    }
  }

  function unshift (value, done) {
    var current = cache.get()

    current.context = context
    current.release = release
    current.value = value
    current.callback = done || noop

    if (_running === self.concurrency || self.paused) {
      if (queueHead) {
        current.next = queueHead
        queueHead = current
      } else {
        queueHead = current
        queueTail = current
        self.saturated()
      }
    } else {
      _running++
      worker.call(context, current.value, current.worked)
    }
  }

  function release (holder) {
    if (holder) {
      cache.release(holder)
    }
    var next = queueHead
    if (next) {
      if (!self.paused) {
        if (queueTail === queueHead) {
          queueTail = null
        }
        queueHead = next.next
        next.next = null
        worker.call(context, next.value, next.worked)
        if (queueTail === null) {
          self.empty()
        }
      } else {
        _running--
      }
    } else if (--_running === 0) {
      self.drain()
    }
  }

  function kill () {
    queueHead = null
    queueTail = null
    self.drain = noop
  }

  function killAndDrain () {
    queueHead = null
    queueTail = null
    self.drain()
    self.drain = noop
  }
}

function noop () {}

function Task () {
  this.value = null
  this.callback = noop
  this.next = null
  this.release = noop
  this.context = null

  var self = this

  this.worked = function worked (err, result) {
    var callback = self.callback
    self.value = null
    self.callback = noop
    callback.call(self.context, err, result)
    self.release(self)
  }
}

module.exports = fastqueue


/***/ }),
/* 831 */,
/* 832 */,
/* 833 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sync_1 = __webpack_require__(394);
class SyncProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new sync_1.default(this._root, this._settings);
    }
    read() {
        return this._reader.read();
    }
}
exports.default = SyncProvider;


/***/ }),
/* 834 */,
/* 835 */
/***/ (function(module) {

module.exports = require("url");

/***/ }),
/* 836 */,
/* 837 */,
/* 838 */,
/* 839 */,
/* 840 */,
/* 841 */,
/* 842 */,
/* 843 */,
/* 844 */,
/* 845 */,
/* 846 */,
/* 847 */,
/* 848 */,
/* 849 */,
/* 850 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginationMethodsPlugin

function paginationMethodsPlugin (octokit) {
  octokit.getFirstPage = __webpack_require__(777).bind(null, octokit)
  octokit.getLastPage = __webpack_require__(649).bind(null, octokit)
  octokit.getNextPage = __webpack_require__(550).bind(null, octokit)
  octokit.getPreviousPage = __webpack_require__(563).bind(null, octokit)
  octokit.hasFirstPage = __webpack_require__(536)
  octokit.hasLastPage = __webpack_require__(336)
  octokit.hasNextPage = __webpack_require__(929)
  octokit.hasPreviousPage = __webpack_require__(558)
}


/***/ }),
/* 851 */,
/* 852 */,
/* 853 */,
/* 854 */
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),
/* 855 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = registerPlugin

const factory = __webpack_require__(47)

function registerPlugin (plugins, pluginFunction) {
  return factory(plugins.includes(pluginFunction) ? plugins : plugins.concat(pluginFunction))
}


/***/ }),
/* 856 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

exports.alphasort = alphasort
exports.alphasorti = alphasorti
exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path = __webpack_require__(622)
var minimatch = __webpack_require__(93)
var isAbsolute = __webpack_require__(681)
var Minimatch = minimatch.Minimatch

function alphasorti (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase())
}

function alphasort (a, b) {
  return a.localeCompare(b)
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(self.nocase ? alphasorti : alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),
/* 857 */,
/* 858 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async = __webpack_require__(728);
const sync = __webpack_require__(593);
const settings_1 = __webpack_require__(872);
exports.Settings = settings_1.default;
function stat(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return async.read(path, getSettings(), optionsOrSettingsOrCallback);
    }
    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
}
exports.stat = stat;
function statSync(path, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    return sync.read(path, settings);
}
exports.statSync = statSync;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),
/* 859 */,
/* 860 */,
/* 861 */,
/* 862 */
/***/ (function(module) {

module.exports = class GraphqlError extends Error {
  constructor (request, response) {
    const message = response.data.errors[0].message
    super(message)

    Object.assign(this, response.data)
    this.name = 'GraphqlError'
    this.request = request

    // Maintains proper stack trace (only available on V8)
    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}


/***/ }),
/* 863 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest

const btoa = __webpack_require__(675)

const withAuthorizationPrefix = __webpack_require__(143)

function authenticationBeforeRequest (state, options) {
  if (typeof state.auth === 'string') {
    options.headers.authorization = withAuthorizationPrefix(state.auth)

    // https://developer.github.com/v3/previews/#integrations
    if (/^bearer /i.test(state.auth) && !/machine-man/.test(options.headers.accept)) {
      const acceptHeaders = options.headers.accept.split(',')
        .concat('application/vnd.github.machine-man-preview+json')
      options.headers.accept = acceptHeaders.filter(Boolean).join(',')
    }

    return
  }

  if (state.auth.username) {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`)
    options.headers.authorization = `Basic ${hash}`
    if (state.otp) {
      options.headers['x-github-otp'] = state.otp
    }
    return
  }

  if (state.auth.clientId) {
    // There is a special case for OAuth applications, when `clientId` and `clientSecret` is passed as
    // Basic Authorization instead of query parameters. The only routes where that applies share the same
    // URL though: `/applications/:client_id/tokens/:access_token`.
    //
    //  1. [Check an authorization](https://developer.github.com/v3/oauth_authorizations/#check-an-authorization)
    //  2. [Reset an authorization](https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization)
    //  3. [Revoke an authorization for an application](https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application)
    //
    // We identify by checking the URL. It must merge both "/applications/:client_id/tokens/:access_token"
    // as well as "/applications/123/tokens/token456"
    if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(options.url)) {
      const hash = btoa(`${state.auth.clientId}:${state.auth.clientSecret}`)
      options.headers.authorization = `Basic ${hash}`
      return
    }

    options.url += options.url.indexOf('?') === -1 ? '?' : '&'
    options.url += `client_id=${state.auth.clientId}&client_secret=${state.auth.clientSecret}`
    return
  }

  return Promise.resolve()

    .then(() => {
      return state.auth()
    })

    .then((authorization) => {
      options.headers.authorization = withAuthorizationPrefix(authorization)
    })
}


/***/ }),
/* 864 */,
/* 865 */,
/* 866 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

var shebangRegex = __webpack_require__(816);

module.exports = function (str) {
	var match = str.match(shebangRegex);

	if (!match) {
		return null;
	}

	var arr = match[0].replace(/#! ?/, '').split(' ');
	var bin = arr[0].split('/').pop();
	var arg = arr[1];

	return (bin === 'env' ?
		arg :
		bin + (arg ? ' ' + arg : '')
	);
};


/***/ }),
/* 867 */,
/* 868 */,
/* 869 */,
/* 870 */,
/* 871 */,
/* 872 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(984);
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = fs.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),
/* 873 */,
/* 874 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(747);
exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    stat: fs.stat,
    lstatSync: fs.lstatSync,
    statSync: fs.statSync,
    readdir: fs.readdir,
    readdirSync: fs.readdirSync
};
function createFileSystemAdapter(fsMethods) {
    if (!fsMethods) {
        return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign({}, exports.FILE_SYSTEM_ADAPTER, fsMethods);
}
exports.createFileSystemAdapter = createFileSystemAdapter;


/***/ }),
/* 875 */,
/* 876 */,
/* 877 */,
/* 878 */,
/* 879 */,
/* 880 */,
/* 881 */
/***/ (function(module) {

"use strict";


const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),
/* 882 */,
/* 883 */
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;


/***/ }),
/* 884 */,
/* 885 */
/***/ (function(module) {

module.exports = runParallel

function runParallel (tasks, cb) {
  var results, pending, keys
  var isSync = true

  if (Array.isArray(tasks)) {
    results = []
    pending = tasks.length
  } else {
    keys = Object.keys(tasks)
    results = {}
    pending = keys.length
  }

  function done (err) {
    function end () {
      if (cb) cb(err, results)
      cb = null
    }
    if (isSync) process.nextTick(end)
    else end()
  }

  function each (i, err, result) {
    results[i] = result
    if (--pending === 0 || err) {
      done(err)
    }
  }

  if (!pending) {
    // empty
    done(null)
  } else if (keys) {
    // object
    keys.forEach(function (key) {
      tasks[key](function (err, result) { each(key, err, result) })
    })
  } else {
    // array
    tasks.forEach(function (task, i) {
      task(function (err, result) { each(i, err, result) })
    })
  }

  isSync = false
}


/***/ }),
/* 886 */,
/* 887 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(444);
class DeepFilter {
    constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
    }
    getFilter(basePath, positive, negative) {
        const maxPatternDepth = this._getMaxPatternDepth(positive);
        const negativeRe = this._getNegativePatternsRe(negative);
        return (entry) => this._filter(basePath, entry, negativeRe, maxPatternDepth);
    }
    _getMaxPatternDepth(patterns) {
        const globstar = patterns.some(utils.pattern.hasGlobStar);
        return globstar ? Infinity : utils.pattern.getMaxNaivePatternsDepth(patterns);
    }
    _getNegativePatternsRe(patterns) {
        const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
        return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
    }
    _filter(basePath, entry, negativeRe, maxPatternDepth) {
        const depth = this._getEntryDepth(basePath, entry.path);
        if (this._isSkippedByDeep(depth)) {
            return false;
        }
        if (this._isSkippedByMaxPatternDepth(depth, maxPatternDepth)) {
            return false;
        }
        if (this._isSkippedSymbolicLink(entry)) {
            return false;
        }
        if (this._isSkippedDotDirectory(entry)) {
            return false;
        }
        return this._isSkippedByNegativePatterns(entry, negativeRe);
    }
    _getEntryDepth(basePath, entryPath) {
        const basePathDepth = basePath.split('/').length;
        const entryPathDepth = entryPath.split('/').length;
        return entryPathDepth - (basePath === '' ? 0 : basePathDepth);
    }
    _isSkippedByDeep(entryDepth) {
        return entryDepth >= this._settings.deep;
    }
    _isSkippedByMaxPatternDepth(entryDepth, maxPatternDepth) {
        return !this._settings.baseNameMatch && maxPatternDepth !== Infinity && entryDepth > maxPatternDepth;
    }
    _isSkippedSymbolicLink(entry) {
        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
    }
    _isSkippedDotDirectory(entry) {
        return !this._settings.dot && entry.name.startsWith('.');
    }
    _isSkippedByNegativePatterns(entry, negativeRe) {
        return !utils.pattern.matchAny(entry.path, negativeRe);
    }
}
exports.default = DeepFilter;


/***/ }),
/* 888 */
/***/ (function(module) {

/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function isExtglob(str) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  var match;
  while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(str))) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }

  return false;
};


/***/ }),
/* 889 */,
/* 890 */,
/* 891 */,
/* 892 */,
/* 893 */,
/* 894 */,
/* 895 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(622);
const pathType = __webpack_require__(501);

const getExtensions = extensions => extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0];

const getPath = (filepath, cwd) => {
	const pth = filepath[0] === '!' ? filepath.slice(1) : filepath;
	return path.isAbsolute(pth) ? pth : path.join(cwd, pth);
};

const addExtensions = (file, extensions) => {
	if (path.extname(file)) {
		return `**/${file}`;
	}

	return `**/${file}.${getExtensions(extensions)}`;
};

const getGlob = (directory, options) => {
	if (options.files && !Array.isArray(options.files)) {
		throw new TypeError(`Expected \`files\` to be of type \`Array\` but received type \`${typeof options.files}\``);
	}

	if (options.extensions && !Array.isArray(options.extensions)) {
		throw new TypeError(`Expected \`extensions\` to be of type \`Array\` but received type \`${typeof options.extensions}\``);
	}

	if (options.files && options.extensions) {
		return options.files.map(x => path.posix.join(directory, addExtensions(x, options.extensions)));
	}

	if (options.files) {
		return options.files.map(x => path.posix.join(directory, `**/${x}`));
	}

	if (options.extensions) {
		return [path.posix.join(directory, `**/*.${getExtensions(options.extensions)}`)];
	}

	return [path.posix.join(directory, '**')];
};

module.exports = async (input, options) => {
	options = {
		cwd: process.cwd(),
		...options
	};

	if (typeof options.cwd !== 'string') {
		throw new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof options.cwd}\``);
	}

	const globs = await Promise.all([].concat(input).map(async x => {
		const isDirectory = await pathType.isDirectory(getPath(x, options.cwd));
		return isDirectory ? getGlob(x, options) : x;
	}));

	return [].concat.apply([], globs); // eslint-disable-line prefer-spread
};

module.exports.sync = (input, options) => {
	options = {
		cwd: process.cwd(),
		...options
	};

	if (typeof options.cwd !== 'string') {
		throw new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof options.cwd}\``);
	}

	const globs = [].concat(input).map(x => pathType.isDirectorySync(getPath(x, options.cwd)) ? getGlob(x, options) : x);

	return [].concat.apply([], globs); // eslint-disable-line prefer-spread
};


/***/ }),
/* 896 */
/***/ (function(module) {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 897 */,
/* 898 */,
/* 899 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = registerEndpoints

const { Deprecation } = __webpack_require__(692)

function registerEndpoints (octokit, routes) {
  Object.keys(routes).forEach(namespaceName => {
    if (!octokit[namespaceName]) {
      octokit[namespaceName] = {}
    }

    Object.keys(routes[namespaceName]).forEach(apiName => {
      const apiOptions = routes[namespaceName][apiName]

      const endpointDefaults = ['method', 'url', 'headers'].reduce((map, key) => {
        if (typeof apiOptions[key] !== 'undefined') {
          map[key] = apiOptions[key]
        }

        return map
      }, {})

      endpointDefaults.request = {
        validate: apiOptions.params
      }

      let request = octokit.request.defaults(endpointDefaults)

      // patch request & endpoint methods to support deprecated parameters.
      // Not the most elegant solution, but we don’t want to move deprecation
      // logic into octokit/endpoint.js as it’s out of scope
      const hasDeprecatedParam = Object.keys(apiOptions.params || {}).find(key => apiOptions.params[key].deprecated)
      if (hasDeprecatedParam) {
        const patch = patchForDeprecation.bind(null, octokit, apiOptions)
        request = patch(
          octokit.request.defaults(endpointDefaults),
          `.${namespaceName}.${apiName}()`
        )
        request.endpoint = patch(
          request.endpoint,
          `.${namespaceName}.${apiName}.endpoint()`
        )
        request.endpoint.merge = patch(
          request.endpoint.merge,
          `.${namespaceName}.${apiName}.endpoint.merge()`
        )
      }

      if (apiOptions.deprecated) {
        octokit[namespaceName][apiName] = function deprecatedEndpointMethod () {
          octokit.log.warn(new Deprecation(`[@octokit/rest] ${apiOptions.deprecated}`))
          octokit[namespaceName][apiName] = request
          return request.apply(null, arguments)
        }

        return
      }

      octokit[namespaceName][apiName] = request
    })
  })
}

function patchForDeprecation (octokit, apiOptions, method, methodName) {
  const patchedMethod = (options) => {
    options = Object.assign({}, options)

    Object.keys(options).forEach(key => {
      if (apiOptions.params[key] && apiOptions.params[key].deprecated) {
        const aliasKey = apiOptions.params[key].alias

        octokit.log.warn(new Deprecation(`[@octokit/rest] "${key}" parameter is deprecated for "${methodName}". Use "${aliasKey}" instead`))

        if (!(aliasKey in options)) {
          options[aliasKey] = options[key]
        }
        delete options[key]
      }
    })

    return method(options)
  }
  Object.keys(method).forEach(key => {
    patchedMethod[key] = method[key]
  })

  return patchedMethod
}


/***/ }),
/* 900 */,
/* 901 */,
/* 902 */,
/* 903 */,
/* 904 */,
/* 905 */,
/* 906 */,
/* 907 */,
/* 908 */,
/* 909 */,
/* 910 */,
/* 911 */,
/* 912 */,
/* 913 */,
/* 914 */
/***/ (function(module) {

"use strict";
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */



module.exports = function(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};


/***/ }),
/* 915 */,
/* 916 */,
/* 917 */,
/* 918 */,
/* 919 */,
/* 920 */,
/* 921 */,
/* 922 */,
/* 923 */,
/* 924 */,
/* 925 */,
/* 926 */,
/* 927 */,
/* 928 */,
/* 929 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasNextPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasNextPage (link) {
  deprecate(`octokit.hasNextPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).next
}


/***/ }),
/* 930 */,
/* 931 */,
/* 932 */,
/* 933 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(210);
exports.fs = fs;


/***/ }),
/* 934 */,
/* 935 */,
/* 936 */,
/* 937 */,
/* 938 */,
/* 939 */,
/* 940 */,
/* 941 */,
/* 942 */,
/* 943 */,
/* 944 */,
/* 945 */,
/* 946 */,
/* 947 */,
/* 948 */
/***/ (function(module) {

"use strict";


/**
 * Tries to execute a function and discards any error that occurs.
 * @param {Function} fn - Function that might or might not throw an error.
 * @returns {?*} Return-value of the function when no error occurred.
 */
module.exports = function(fn) {

	try { return fn() } catch (e) {}

}

/***/ }),
/* 949 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(622);
const fsStat = __webpack_require__(858);
const utils = __webpack_require__(444);
class Reader {
    constructor(_settings) {
        this._settings = _settings;
        this._fsStatSettings = new fsStat.Settings({
            followSymbolicLink: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
        });
    }
    _getFullEntryPath(filepath) {
        return path.resolve(this._settings.cwd, filepath);
    }
    _makeEntry(stats, pattern) {
        const entry = {
            name: pattern,
            path: pattern,
            dirent: utils.fs.createDirentFromStats(pattern, stats)
        };
        if (this._settings.stats) {
            entry.stats = stats;
        }
        return entry;
    }
    _isFatalError(error) {
        return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
    }
}
exports.default = Reader;


/***/ }),
/* 950 */,
/* 951 */,
/* 952 */,
/* 953 */,
/* 954 */
/***/ (function(module) {

module.exports = validateAuth

function validateAuth (auth) {
  if (typeof auth === 'string') {
    return
  }

  if (typeof auth === 'function') {
    return
  }

  if (auth.username && auth.password) {
    return
  }

  if (auth.clientId && auth.clientSecret) {
    return
  }

  throw new Error(`Invalid "auth" option: ${JSON.stringify(auth)}`)
}


/***/ }),
/* 955 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(622);
const childProcess = __webpack_require__(129);
const crossSpawn = __webpack_require__(20);
const stripEof = __webpack_require__(768);
const npmRunPath = __webpack_require__(621);
const isStream = __webpack_require__(323);
const _getStream = __webpack_require__(145);
const pFinally = __webpack_require__(697);
const onExit = __webpack_require__(260);
const errname = __webpack_require__(427);
const stdio = __webpack_require__(168);

const TEN_MEGABYTES = 1000 * 1000 * 10;

function handleArgs(cmd, args, opts) {
	let parsed;

	opts = Object.assign({
		extendEnv: true,
		env: {}
	}, opts);

	if (opts.extendEnv) {
		opts.env = Object.assign({}, process.env, opts.env);
	}

	if (opts.__winShell === true) {
		delete opts.__winShell;
		parsed = {
			command: cmd,
			args,
			options: opts,
			file: cmd,
			original: {
				cmd,
				args
			}
		};
	} else {
		parsed = crossSpawn._parse(cmd, args, opts);
	}

	opts = Object.assign({
		maxBuffer: TEN_MEGABYTES,
		buffer: true,
		stripEof: true,
		preferLocal: true,
		localDir: parsed.options.cwd || process.cwd(),
		encoding: 'utf8',
		reject: true,
		cleanup: true
	}, parsed.options);

	opts.stdio = stdio(opts);

	if (opts.preferLocal) {
		opts.env = npmRunPath.env(Object.assign({}, opts, {cwd: opts.localDir}));
	}

	if (opts.detached) {
		// #115
		opts.cleanup = false;
	}

	if (process.platform === 'win32' && path.basename(parsed.command) === 'cmd.exe') {
		// #116
		parsed.args.unshift('/q');
	}

	return {
		cmd: parsed.command,
		args: parsed.args,
		opts,
		parsed
	};
}

function handleInput(spawned, input) {
	if (input === null || input === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
}

function handleOutput(opts, val) {
	if (val && opts.stripEof) {
		val = stripEof(val);
	}

	return val;
}

function handleShell(fn, cmd, opts) {
	let file = '/bin/sh';
	let args = ['-c', cmd];

	opts = Object.assign({}, opts);

	if (process.platform === 'win32') {
		opts.__winShell = true;
		file = process.env.comspec || 'cmd.exe';
		args = ['/s', '/c', `"${cmd}"`];
		opts.windowsVerbatimArguments = true;
	}

	if (opts.shell) {
		file = opts.shell;
		delete opts.shell;
	}

	return fn(file, args, opts);
}

function getStream(process, stream, {encoding, buffer, maxBuffer}) {
	if (!process[stream]) {
		return null;
	}

	let ret;

	if (!buffer) {
		// TODO: Use `ret = util.promisify(stream.finished)(process[stream]);` when targeting Node.js 10
		ret = new Promise((resolve, reject) => {
			process[stream]
				.once('end', resolve)
				.once('error', reject);
		});
	} else if (encoding) {
		ret = _getStream(process[stream], {
			encoding,
			maxBuffer
		});
	} else {
		ret = _getStream.buffer(process[stream], {maxBuffer});
	}

	return ret.catch(err => {
		err.stream = stream;
		err.message = `${stream} ${err.message}`;
		throw err;
	});
}

function makeError(result, options) {
	const {stdout, stderr} = result;

	let err = result.error;
	const {code, signal} = result;

	const {parsed, joinedCmd} = options;
	const timedOut = options.timedOut || false;

	if (!err) {
		let output = '';

		if (Array.isArray(parsed.opts.stdio)) {
			if (parsed.opts.stdio[2] !== 'inherit') {
				output += output.length > 0 ? stderr : `\n${stderr}`;
			}

			if (parsed.opts.stdio[1] !== 'inherit') {
				output += `\n${stdout}`;
			}
		} else if (parsed.opts.stdio !== 'inherit') {
			output = `\n${stderr}${stdout}`;
		}

		err = new Error(`Command failed: ${joinedCmd}${output}`);
		err.code = code < 0 ? errname(code) : code;
	}

	err.stdout = stdout;
	err.stderr = stderr;
	err.failed = true;
	err.signal = signal || null;
	err.cmd = joinedCmd;
	err.timedOut = timedOut;

	return err;
}

function joinCmd(cmd, args) {
	let joinedCmd = cmd;

	if (Array.isArray(args) && args.length > 0) {
		joinedCmd += ' ' + args.join(' ');
	}

	return joinedCmd;
}

module.exports = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const {encoding, buffer, maxBuffer} = parsed.opts;
	const joinedCmd = joinCmd(cmd, args);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.cmd, parsed.args, parsed.opts);
	} catch (err) {
		return Promise.reject(err);
	}

	let removeExitHandler;
	if (parsed.opts.cleanup) {
		removeExitHandler = onExit(() => {
			spawned.kill();
		});
	}

	let timeoutId = null;
	let timedOut = false;

	const cleanup = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}

		if (removeExitHandler) {
			removeExitHandler();
		}
	};

	if (parsed.opts.timeout > 0) {
		timeoutId = setTimeout(() => {
			timeoutId = null;
			timedOut = true;
			spawned.kill(parsed.opts.killSignal);
		}, parsed.opts.timeout);
	}

	const processDone = new Promise(resolve => {
		spawned.on('exit', (code, signal) => {
			cleanup();
			resolve({code, signal});
		});

		spawned.on('error', err => {
			cleanup();
			resolve({error: err});
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', err => {
				cleanup();
				resolve({error: err});
			});
		}
	});

	function destroy() {
		if (spawned.stdout) {
			spawned.stdout.destroy();
		}

		if (spawned.stderr) {
			spawned.stderr.destroy();
		}
	}

	const handlePromise = () => pFinally(Promise.all([
		processDone,
		getStream(spawned, 'stdout', {encoding, buffer, maxBuffer}),
		getStream(spawned, 'stderr', {encoding, buffer, maxBuffer})
	]).then(arr => {
		const result = arr[0];
		result.stdout = arr[1];
		result.stderr = arr[2];

		if (result.error || result.code !== 0 || result.signal !== null) {
			const err = makeError(result, {
				joinedCmd,
				parsed,
				timedOut
			});

			// TODO: missing some timeout logic for killed
			// https://github.com/nodejs/node/blob/master/lib/child_process.js#L203
			// err.killed = spawned.killed || killed;
			err.killed = err.killed || spawned.killed;

			if (!parsed.opts.reject) {
				return err;
			}

			throw err;
		}

		return {
			stdout: handleOutput(parsed.opts, result.stdout),
			stderr: handleOutput(parsed.opts, result.stderr),
			code: 0,
			failed: false,
			killed: false,
			signal: null,
			cmd: joinedCmd,
			timedOut: false
		};
	}), destroy);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput(spawned, parsed.opts.input);

	spawned.then = (onfulfilled, onrejected) => handlePromise().then(onfulfilled, onrejected);
	spawned.catch = onrejected => handlePromise().catch(onrejected);

	return spawned;
};

// TODO: set `stderr: 'ignore'` when that option is implemented
module.exports.stdout = (...args) => module.exports(...args).then(x => x.stdout);

// TODO: set `stdout: 'ignore'` when that option is implemented
module.exports.stderr = (...args) => module.exports(...args).then(x => x.stderr);

module.exports.shell = (cmd, opts) => handleShell(module.exports, cmd, opts);

module.exports.sync = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const joinedCmd = joinCmd(cmd, args);

	if (isStream(parsed.opts.input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}

	const result = childProcess.spawnSync(parsed.cmd, parsed.args, parsed.opts);
	result.code = result.status;

	if (result.error || result.status !== 0 || result.signal !== null) {
		const err = makeError(result, {
			joinedCmd,
			parsed
		});

		if (!parsed.opts.reject) {
			return err;
		}

		throw err;
	}

	return {
		stdout: handleOutput(parsed.opts, result.stdout),
		stderr: handleOutput(parsed.opts, result.stderr),
		code: 0,
		failed: false,
		signal: null,
		cmd: joinedCmd,
		timedOut: false
	};
};

module.exports.shellSync = (cmd, opts) => handleShell(module.exports.sync, cmd, opts);


/***/ }),
/* 956 */,
/* 957 */,
/* 958 */,
/* 959 */,
/* 960 */,
/* 961 */,
/* 962 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common = __webpack_require__(617);
class Reader {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
    }
}
exports.default = Reader;


/***/ }),
/* 963 */,
/* 964 */,
/* 965 */,
/* 966 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {PassThrough} = __webpack_require__(413);

module.exports = options => {
	options = Object.assign({}, options);

	const {array} = options;
	let {encoding} = options;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream = new PassThrough({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	stream.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream.getBufferedLength = () => len;

	return stream;
};


/***/ }),
/* 967 */,
/* 968 */,
/* 969 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(11)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),
/* 970 */,
/* 971 */,
/* 972 */,
/* 973 */,
/* 974 */,
/* 975 */,
/* 976 */,
/* 977 */,
/* 978 */,
/* 979 */,
/* 980 */,
/* 981 */,
/* 982 */,
/* 983 */,
/* 984 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(747);
exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    stat: fs.stat,
    lstatSync: fs.lstatSync,
    statSync: fs.statSync
};
function createFileSystemAdapter(fsMethods) {
    if (!fsMethods) {
        return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign({}, exports.FILE_SYSTEM_ADAPTER, fsMethods);
}
exports.createFileSystemAdapter = createFileSystemAdapter;


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map