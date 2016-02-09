'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('arr-flatten', 'flatten');
require('get-value', 'get');
require('isobject', 'isObject');
require('mixin-deep', 'merge');
require('set-value', 'set');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
