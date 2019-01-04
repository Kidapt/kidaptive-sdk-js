'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import EventManager from '../../../src/event-manager';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('startAutoFlush', () => {

    let server;
    let spyFlushEventQueue;

    const autoFlushInterval = 500;
    const spyAutoFlushCallback = Sinon.spy();

    before(() => {
      server = Sinon.fakeServer.create()
      spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
    });

    beforeEach(() => {
      server.resetHistory();
      server.respondImmediately = true;
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      spyAutoFlushCallback.resetHistory();
      spyFlushEventQueue.resetHistory();
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setStateOptions({
        autoFlushInterval,
        autoFlushCallback: [spyAutoFlushCallback]
      });
      return EventManager.stopAutoFlush();
    });

    after(() => {
      server.restore();
      spyFlushEventQueue.restore();
      TestUtils.resetStateAndCache();
    });

    it('events are flushed based on autoFlushInterval', done => {
      Should(EventManager.startAutoFlush()).resolved().then(() => {
        setTimeout(() => {
          Should(spyFlushEventQueue.callCount).equal(1);
          Should(spyAutoFlushCallback.callCount).equal(1);
        }, autoFlushInterval * 1.5)
        setTimeout(() => {
          Should(spyFlushEventQueue.callCount).equal(2);
          Should(spyAutoFlushCallback.callCount).equal(2);
          done();
        }, autoFlushInterval * 2.5)
      });
    });

    it('autoFlushCallback has http status for requests as argument', done => {
      Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
        return Should(EventManager.startAutoFlush()).resolved();
      }).then(() => {
        setTimeout(() => {
          Should(spyFlushEventQueue.callCount).equal(1);
          Should(spyAutoFlushCallback.callCount).equal(1);
          const result = spyAutoFlushCallback.firstCall.args[0];
          Should(result).Array();
          Should(result.length).equal(1);
          Should(result[0].state).equal('fulfilled');
          Should(result[0].value).equal('ok');
          done();
        }, autoFlushInterval * 1.5)
      });
    });

    it('autoFlushCallback has empty array as argument', done => {
      Should(EventManager.startAutoFlush()).resolved().then(() => {
        setTimeout(() => {
          Should(spyFlushEventQueue.callCount).equal(1);
          Should(spyAutoFlushCallback.callCount).equal(1);
          const result = spyAutoFlushCallback.firstCall.args[0]
          Should(result).Array();
          Should(result.length).equal(0);
          done();
        }, autoFlushInterval * 1.5)
      });
    });

    it('can be called multiple times', () => {
      return Should(EventManager.startAutoFlush()).resolved().then(() => {
        return Should(EventManager.startAutoFlush()).resolved();
      });
    });

    it('events can still be manaully flushed with flushEventQueue', () => {
      return Should(EventManager.startAutoFlush()).resolved().then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      });
    });

    it('autoFlushInterval of 0 disables auto flush', done => {
      TestUtils.setStateOptions({
        autoFlushInterval: 0
      });
      Should(EventManager.startAutoFlush()).resolved().then(() => {
        setTimeout(() => {
          Should(spyFlushEventQueue.callCount).equal(0);
          Should(spyAutoFlushCallback.callCount).equal(0);
          done();
        }, 1000)
      });
    });
    
  }); //END startAutoFlush

}; //END export
