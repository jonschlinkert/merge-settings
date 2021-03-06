# merge-settings [![NPM version](https://img.shields.io/npm/v/merge-settings.svg?style=flat)](https://www.npmjs.com/package/merge-settings) [![NPM downloads](https://img.shields.io/npm/dm/merge-settings.svg?style=flat)](https://npmjs.org/package/merge-settings) [![Build Status](https://img.shields.io/travis/jonschlinkert/merge-settings.svg?style=flat)](https://travis-ci.org/jonschlinkert/merge-settings)

> Load and merge configuration settings from multiple sources, in a specific order, and normalized according to a schema.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install merge-settings --save
```

## Usage

```js
var Settings = require('merge-settings');
```

## API

### [Settings](index.js#L15)

Create an instance of `Settings` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var settings = new Settings();
```

### [.set](index.js#L52)

Add a `config` object to be merged.

**Params**

* `object` **{Object}**: The object to merge into the config.

**Example**

```js
config
  .addConfig({a: 'b', c: 'd'})
  .addConfig({a: 'z'})
  .merge();

//=> {a: 'z', c: 'd'}
```

### [.get](index.js#L72)

Get the normalized value of property `key` from the cache.

**Params**

* `key` **{String}**
* `returns` **{any}**: The normalized value of `key`

**Example**

```js
config.get('foo');
```

### [.getRaw](index.js#L87)

Get the raw (non-normalized) value of property `key` from the cache.

**Params**

* `key` **{String}**
* `returns` **{any}**: The value of `key`

**Example**

```js
config.get('foo');
```

### [.addConfig](index.js#L107)

Add a `config` object to be merged.

**Params**

* `object` **{Object}**: The object to merge into the config.

**Example**

```js
config
  .addConfig({a: 'b', c: 'd'})
  .addConfig({a: 'z'})
  .merge();

//=> {a: 'z', c: 'd'}
```

### [.addConfigs](index.js#L133)

Add an array or list of `config` objects to be merged.

**Params**

* `object` **{Object}**: The object to merge into the config.

**Example**

```js
config
  .addConfigs({a: 'b'}, {c: 'd'})
  .addConfigs([{a: 'b'}, {c: 'd'}])
```

### [.merge](index.js#L177)

Merge the given (optional) `config` object with cached config objects in the order in which the objects were defined. If a `normalize` function is passed on the contructor options, or as the first or second argument to `.merge`, it will be used on each config object before merging it onto the results object.

**Params**

* `config` **{Object}**

**Example**

```js
var settings = new Settings()
  .set('foo', {a: 'b'})
  .set('bar', {c: 'd'})
  .set('baz', {e: 'f'})
  .merge();

console.log(settings);
//=> {a: 'b', c: 'd', e: 'f'}

// Pass a normalize function on the
// ctor options, or to .merge as first or second arg
var settings = new Settings()
  .set('foo', {a: 'b'})
  .set('bar', {c: 'd'})
  .set('baz', {e: 'f'})
  .merge(function(config) {
    // normalize config object
  });

console.log(settings);
//=>
```

## Related projects

You might also be interested in these projects:

* [base](https://www.npmjs.com/package/base): base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting… [more](https://www.npmjs.com/package/base) | [homepage](https://github.com/node-base/base)
* [data-store](https://www.npmjs.com/package/data-store): Easily get, set and persist config data. | [homepage](https://github.com/jonschlinkert/data-store)
* [extend-shallow](https://www.npmjs.com/package/extend-shallow): Extend an object with the properties of additional objects. node.js/javascript util. | [homepage](https://github.com/jonschlinkert/extend-shallow)
* [mixin-deep](https://www.npmjs.com/package/mixin-deep): Deeply mix the properties of objects into the first object. Like merge-deep, but doesn't clone. | [homepage](https://github.com/jonschlinkert/mixin-deep)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/merge-settings/issues/new).

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install verb && npm run docs
```

Or, if [verb](https://github.com/verbose/verb) is installed globally:

```sh
$ verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/merge-settings/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on April 07, 2016._