'use strict';

const expressify = require('../expressify');
const bluebird = require('bluebird');
const sinon = require('sinon');
const assert = require('assert');
const sinonAsPromised = require('sinon-as-promised');

sinonAsPromised(bluebird);

describe('expressify', () => {
  const theError = new Error('some error');

  describe('an object', () => {
    let expressified;
    let obj;
    let callback;

    beforeEach(() => {
      const resolved = sinon.stub().resolves('foo');
      const rejected = sinon.stub().rejects(theError);

      obj = { resolved, rejected };
      expressified = expressify(obj);
      callback = sinon.spy();
    });

    describe('when resolving', () => {
      it('should call next fn', (done) => {
        expressified.resolved(null, null, callback).finally(() => {
          assert(callback.called);
          assert.equal(callback.firstCall.args.length, 0);
          done();
        });
      });
    });

    describe('when failing', () => {
      it('should call next with the error when failing', (done) => {
        expressified.rejected(null, null, callback).finally(() => {
          assert(callback.calledWith(theError));
          done();
        });
      });
    });
  });

  describe('a function', () => {
    describe('when resolving', () => {
      let resolved;
      let expressified;
      let callback;

      before(() => {
        resolved = sinon.stub().resolves('foo');
        expressified = expressify(resolved);
        callback = sinon.spy();
      });

      it('should call next fn', (done) => {
        expressified(null, null, callback).finally(() => {
          assert(callback.called);
          assert.equal(callback.firstCall.args.length, 0);
          done();
        });
      });
    });

    describe('when failing', () => {
      let rejected;
      let expressified;
      let callback;

      before(() => {
        rejected = sinon.stub().rejects(theError);
        expressified = expressify(rejected);
        callback = sinon.spy();
      });

      it('should call next fn with the error', (done) => {
        expressified(null, null, callback).finally(() => {
          assert(callback.calledWith(theError));
          done();
        });
      });
    });
  });
});
