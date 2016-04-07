'use strict';

require('mocha');
var assert = require('assert');
var Schema = require('map-schema');
var Settings = require('./');
var settings, schema;

describe('merge-settings', function() {
  describe('main export', function() {
    beforeEach(function() {
      schema = new Schema();
      settings = new Settings({
        normalize: schema.normalize.bind(schema)
      });
    });

    it('should export a function', function() {
      assert.equal(typeof Settings, 'function');
    });

    it('should instantiate Settings', function() {
      assert(settings instanceof Settings);
    });

    it('should expose an addConfig method', function() {
      assert.equal(typeof settings.addConfig, 'function');
    });

    it('should expose an addConfigs method', function() {
      assert.equal(typeof settings.addConfigs, 'function');
    });

    it('should expose a get method', function() {
      assert.equal(typeof settings.get, 'function');
    });

    it('should expose a getRaw method', function() {
      assert.equal(typeof settings.getRaw, 'function');
    });

    it('should expose a set method', function() {
      assert.equal(typeof settings.set, 'function');
    });

    it('should expose a merge method', function() {
      assert.equal(typeof settings.merge, 'function');
    });
  });

  describe('methods', function() {
    beforeEach(function() {
      schema = new Schema()
      settings = new Settings({
        normalize: schema.normalize.bind(schema)
      });
    });

    it('should add a config object to the `configs` array', function() {
      settings.addConfig({a: 'b'});
      assert.equal(settings.configs.length, 1);
      assert.equal(settings.configs[0].a, 'b');
    });

    it('should add multiple config objects to the `configs` array', function() {
      settings.addConfigs({a: 'b'}, {c: 'd'}, {e: 'f'});
      assert.equal(settings.configs.length, 3);
      assert.equal(settings.configs[0].a, 'b');
      assert.equal(settings.configs[1].c, 'd');
      assert.equal(settings.configs[2].e, 'f');
    });

    it('should merge multiple config objects', function() {
      settings.addConfigs({a: 'b'}, {c: 'd'}, {e: 'f'}, {a: 'z'});
      var config = settings.merge();

      assert.deepEqual(config, {a: 'z', c: 'd', e: 'f'});
    });
  });

  describe('schema', function() {
    beforeEach(function() {
      schema = new Schema()
        .field('plugins', ['array', 'object', 'string'], {
          normalize: function(val) {
            return val ? (Array.isArray(val) ? val : [val]) : [];
          }
        })
        .field('license', 'string', {
          default: 'MIT'
        });

      settings = new Settings({
        normalize: function(config) {
          return schema.normalize(config);
        }
      });
    });

    it('should add default values to the returned object', function() {
      var config = settings
        .addConfig({a: 'b'})
        .merge();
      assert.equal(config.license, 'MIT');
    });

    it('should normalize values on the returned object', function() {
      var config = settings
        .addConfig({plugins: 'abc'})
        .merge();
      assert.deepEqual(config.plugins, ['abc']);
    });
  });
});
