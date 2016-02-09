'use strict';

var utils = require('./utils');

/**
 * Create an instance of `Settings`.
 *
 * @api public
 */

function Settings(schema) {
  if (!utils.isObject(schema) || !schema.isSchema) {
    throw new Error('expected an instance of map-schema');
  }
  this.schema = schema;
  this.configs = [];
  this.cache = {};
}

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
  return this.schema.normalize(utils.get(this.cache, key));
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
 * Merge normalized config objects.
 *
 * ```js
 * var config = {};
 * configs.merge(config);
 * ```
 *
 * @param {Object} `config`
 * @api public
 */

Settings.prototype.merge = function(config) {
  if (config) this.addConfig.apply(this, arguments);
  var len = this.configs.length;
  var idx = -1;
  var res = {};

  while (++idx < len) {
    var obj = this.schema.normalize(this.configs[idx]);
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
