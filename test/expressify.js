'use strict';

const expressify = require('../expressify')();
const bluebird = require('bluebird');
const sinon = require('sinon');
const assert = require('assert');
const sinonAsPromised = require('sinon-as-promised');

sinonAsPromised(bluebird);

describe('expressify', () => {
  const theError = new Error('some error');

  describe('an object', () => {
    let obj;
    let response;
    let expressified;
    let nextCallback;

    beforeEach(() => {
      response = 'foo';
      const resolved = sinon.stub().resolves(response);
      const rejected = sinon.stub().rejects(theError);

      obj = { resolved, rejected };
      expressified = expressify(obj);
      nextCallback = sinon.spy();
    });

    describe('when resolving', () => {
      it('should not call next fn', (done) => {
        expressified.resolved(null, null, nextCallback).finally(() => {
          assert(nextCallback.notCalled);
          done();
        });
      });
    });

    describe('when failing', () => {
      it('should call next with the error when failing', (done) => {
        expressified.rejected(null, null, nextCallback).finally(() => {
          assert(nextCallback.calledWith(theError));
          done();
        });
      });
    });

    describe('when callback is define', () => {
      let resolveCallback;
      let expressifyWithCallback;

      beforeEach(() => {
        resolveCallback = sinon.spy();
        expressifyWithCallback = require('../expressify')(resolveCallback);
        expressified = expressifyWithCallback(obj);
      });

      describe('when resolving', () => {
        it('should call callback after resolve with the response', (done) => {
          expressified.resolved(null, null, nextCallback).finally(() => {
            assert(nextCallback.notCalled);
            assert(resolveCallback.calledWith(response));
            done();
          });
        });
      });

      describe('when failing', () => {
        it('should call next with the error when failing and dont call callback', (done) => {
          expressified.rejected(null, null, nextCallback).finally(() => {
            assert(nextCallback.calledWith(theError));
            assert(resolveCallback.notCalled);
            done();
          });
        });
      });
    });
  });

  describe('a function', () => {
    let resolved;
    let rejected;
    let response;
    let expressified;
    let nextCallback;

    beforeEach(() => {
      response = 'foo';
      resolved = sinon.stub().resolves(response);
      rejected = sinon.stub().rejects(theError);
      nextCallback = sinon.spy();
    });

    describe('when resolving', () => {
      beforeEach(() => (expressified = expressify(resolved)));

      it('should not call next fn', (done) => {
        expressified(null, null, nextCallback).finally(() => {
          assert(nextCallback.notCalled);
          done();
        });
      });
    });

    describe('when failing', () => {
      beforeEach(() => (expressified = expressify(rejected)));

      it('should call next fn with the error', (done) => {
        expressified(null, null, nextCallback).finally(() => {
          assert(nextCallback.calledWith(theError));
          done();
        });
      });
    });

    describe('when callback is define', () => {
      let resolveCallback;
      let expressifyWithCallback;

      beforeEach(() => {
        resolveCallback = sinon.spy();
        expressifyWithCallback = require('../expressify')(resolveCallback);
      });

      describe('when resolving', () => {
        beforeEach(() => (expressified = expressifyWithCallback(resolved)));

        it('should call callback after resolve with the response', (done) => {
          expressified(null, null, nextCallback).finally(() => {
            assert(nextCallback.notCalled);
            assert(resolveCallback.calledWith(response));
            done();
          });
        });
      });

      describe('when failing', () => {
        beforeEach(() => (expressified = expressifyWithCallback(rejected)));

        it('should call next fn with the error and dont call the callback', (done) => {
          expressified(null, null, nextCallback).finally(() => {
            assert(nextCallback.calledWith(theError));
            assert(resolveCallback.notCalled);
            done();
          });
        });
      });
    });
  });
});
