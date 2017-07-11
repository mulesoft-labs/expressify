'use strict';

const bluebird = require('bluebird');

module.exports = function expressify(callback = () => {}) {
  /**
   * @param  {Function|Object} functionOrObject
   * @return {Function|Object}
   */
  return function (functionOrObject) {
    return (typeof functionOrObject === 'function' ? expressifyFunction : expressifyObject)(functionOrObject);
  };

  function expressifyFunction(fn) {
    return function expressify(req, res, next) { // eslint-disable-line no-shadow
      return bluebird.method(fn)(req, res)
        .then(callback)
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
};
