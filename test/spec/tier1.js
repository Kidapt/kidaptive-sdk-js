'use strict';
import KidaptiveSdk from '../../src/index';
import EventManager from '../../src/event-manager';
import State from '../../src/state';
import Utils from '../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

describe('KidaptiveSdk Tier 1 Unit Tests', () => {
  describe('requires KidaptiveSdk to be configured to at least tier 1', () => {
    let spyCheckTier;
    before(() => {
      spyCheckTier = Sinon.spy(Utils, 'checkTier');
    });
    after(() => {
      State.clear();
    });
    afterEach(() => {
      spyCheckTier.restore();
    });
    it('KidaptiveSdk.eventManager.reportSimpleEvent()', () => {
      State.set('initialized', true);
      State.set('options', {tier: 0});
      return Should(KidaptiveSdk.eventManager.reportSimpleEvent('eventName', {})).rejected().then(() => {
        State.set('options', {tier: 1});
        return Should(KidaptiveSdk.eventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
        });
      });
    });
    it('KidaptiveSdk.eventManager.reportRawEvent()', () => {
      State.set('options', {tier: 0});
      return Should(KidaptiveSdk.eventManager.reportRawEvent('{}')).rejected().then(() => {
        State.set('options', {tier: 1});
        return Should(KidaptiveSdk.eventManager.reportRawEvent('{}')).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
        });
      });
    });
    it('KidaptiveSdk.eventManager.flushEventQueue()', () => {
      const server = Sinon.fakeServer.create()
      server.respondImmediately = true;
      server.respondWith([200, {'Content-Type': 'application/json'}, 'ok']);
      State.set('options', {tier: 0});
      return Should(KidaptiveSdk.eventManager.flushEventQueue()).rejected().then(() => {
        State.set('options', {tier: 1});
        return Should(KidaptiveSdk.eventManager.flushEventQueue()).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
        });
      }).then(() => {
        server.restore();
      });
    });
  });
  describe('KidaptiveSdk.init()', () => {
    it('EventManager.startAutoFlush() gets called', () => {
      const spyStartAutoFlush = Sinon.spy(EventManager, 'startAutoFlush');
      Should(spyStartAutoFlush.called).false();
      return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev'})).resolved().then(() => {
        Should(spyStartAutoFlush.called).true();
        spyStartAutoFlush.restore();
        return Should(KidaptiveSdk.destroy()).resolved();
      });
    });
  });
  describe('KidaptiveSdk.destroy()', () => {
    it('calls EventManager.stopAutoFlush()', () => {
      const spyStopAutoFlush = Sinon.spy(EventManager, 'stopAutoFlush');
      Should(spyStopAutoFlush.called).false();
      return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev'})).resolved().then(() => {
        Should(spyStopAutoFlush.called).false();
        return Should(KidaptiveSdk.destroy()).resolved();
      }).then(() => {
        Should(spyStopAutoFlush.called).true();
        spyStopAutoFlush.restore();
      });
    });
    it('calls EventManager.flushEventQueue()', () => {
      const spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
      Should(spyFlushEventQueue.called).false();
      return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev', autoFlushInterval: 0})).resolved().then(() => {
        Should(spyFlushEventQueue.called).false();
        return Should(KidaptiveSdk.destroy()).resolved();
      }).then(() => {
        Should(spyFlushEventQueue.called).true();
        spyFlushEventQueue.restore();
      });
    });
  });
});
