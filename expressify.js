'use strict';

const bluebird = require('bluebird');

// ---

module.exports = expressify;

/**
 * @param  {Function|Object} functionOrObject
 * @return {Function|Object}
 */
function expressify(functionOrObject) {
  return (typeof functionOrObject === 'function' ? expressifyFunction : expressifyObject)(functionOrObject);
}

function expressifyFunction(fn) {
  return function expressify(req, res, next) { // eslint-disable-line no-shadow
    return bluebird.method(fn)(req, res)
      .catch(next);
  };
}

function expressifyObject(object) {
  const result = {};

  Object.keys(object).forEach((key) => {
    result[key] = expressifyFunction(object[key]);
  });

  return result;
}
