'use strict';

var utils = require('./utils');

/**
 * Create an instance of `Settings` with the given `options`.
 *
 * ```js
 * var settings = new Settings();
 * ```
 * @param {Object} `options`
 * @api public
 */

function Settings(options) {
  this.options = options || {};
  this.configs = [];
  this.cache = {};
}

/**
 * Normalize the given object with the user-defined
 * `options.normalize` function, or return the object unchanged
 * if `options.normalize` is not defined.
 *
 * @param {Object} `config` The object to normalize.
 */

Settings.prototype.normalize = function(config) {
  if (typeof this.options.normalize === 'function') {
    return this.options.normalize(config);
  }
  return config;
};

/**
 * Add a `config` object to be merged.
 *
 * ```js
 * config
 *   .addConfig({a: 'b', c: 'd'})
 *   .addConfig({a: 'z'})
 *   .merge();
 *
 * //=> {a: 'z', c: 'd'}
 * ```
 *
 * @param {Object} `object` The object to merge into the config.
 * @api public
 */

Settings.prototype.set = function(key, config) {
  if (typeof key !== 'string') {
    return this.addConfig.apply(this, arguments);
  }
  this.configs.push(config);
  utils.set(this.cache, key, config);
  return this;
};

/**
 * Get the normalized value of property `key` from the cache.
 *
 * ```js
 * config.get('foo');
 * ```
 * @param {String} `key`
 * @return {any} The normalized value of `key`
 * @api public
 */

Settings.prototype.get = function(key) {
  return this.normalize(utils.get(this.cache, key));
};

/**
 * Get the raw (non-normalized) value of property `key` from the cache.
 *
 * ```js
 * config.get('foo');
 * ```
 * @param {String} `key`
 * @return {any} The value of `key`
 * @api public
 */

Settings.prototype.getRaw = function(key) {
  return utils.get(this.cache, key);
};

/**
 * Add a `config` object to be merged.
 *
 * ```js
 * config
 *   .addConfig({a: 'b', c: 'd'})
 *   .addConfig({a: 'z'})
 *   .merge();
 *
 * //=> {a: 'z', c: 'd'}
 * ```
 *
 * @param {Object} `object` The object to merge into the config.
 * @api public
 */

Settings.prototype.addConfig = function(config) {
  if (typeof config === 'string') {
    return this.set.apply(this, arguments);
  }

  if (Array.isArray(config) || arguments.length > 1) {
    return this.addConfigs.apply(this, arguments);
  }

  this.configs.push(config);
  return this;
};

/**
 * Add an array or list of `config` objects to be merged.
 *
 * ```js
 * config
 *   .addConfigs({a: 'b'}, {c: 'd'})
 *   .addConfigs([{a: 'b'}, {c: 'd'}])
 * ```
 *
 * @param {Object} `object` The object to merge into the config.
 * @api public
 */

Settings.prototype.addConfigs = function(config) {
  var args = utils.flatten([].slice.call(arguments));
  var len = args.length;
  var idx = -1;
  while (++idx < len) {
    this.addConfig(args[idx]);
  }
  return this;
};

/**
 * Merge the given (optional) `config` object with cached config objects
 * in the order in which the objects were defined. If a `normalize` function
 * is passed on the contructor options, or as the first or second argument
 * to `.merge`, it will be used on each config object before merging it onto
 * the results object.
 *
 * ```js
 * var settings = new Settings()
 *   .set('foo', {a: 'b'})
 *   .set('bar', {c: 'd'})
 *   .set('baz', {e: 'f'})
 *   .merge();
 *
 * console.log(settings);
 * //=> {a: 'b', c: 'd', e: 'f'}
 *
 * // Pass a normalize function on the
 * // ctor options, or to .merge as first or second arg
 * var settings = new Settings()
 *   .set('foo', {a: 'b'})
 *   .set('bar', {c: 'd'})
 *   .set('baz', {e: 'f'})
 *   .merge(function(config) {
 *     // normalize config object
 *   });
 *
 * console.log(settings);
 * //=>
 * ```
 * @param {Object} `config`
 * @api public
 */

Settings.prototype.merge = function(config) {
  var fn = this.normalize.bind(this);

  if (typeof config === 'function') {
    fn = config.bind(this);
    config = null;
  }

  if (config) this.addConfig.apply(this, arguments);
  var len = this.configs.length;
  var idx = -1;
  var res = {};

  while (++idx < len) {
    var obj = fn(this.configs[idx]);

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var val = obj[key];

        if (utils.isObject(val)) {
          res[key] = utils.merge({}, res[key], val);
          continue;
        }

        if (Array.isArray(val) && val.length) {
          if (!Array.isArray(res[key])) {
            res[key] = val;
          } else {
            res[key] = utils.union([], res[key], val);
          }
          continue;
        }

        if (typeof val === 'string' || typeof val === 'boolean') {
          res[key] = val;
        }
      }
    }
    utils.merge(res, obj);
  }
  return res;
};

/**
 * Export `Settings`
 *
 * @type {Object}
 */

module.exports = Settings;
