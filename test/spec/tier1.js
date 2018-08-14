'use strict';
import KidaptiveSdk from '../../src/index';
import EventManager from '../../src/event-manager';
import LearnerManager from '../../src/learner-manager';
import OperationManager from '../../src/operation-manager';
import State from '../../src/state';
import Utils from '../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

describe('KidaptiveSdk Tier 1 Unit Tests', () => {
  describe('requires KidaptiveSdk to be configured to at least tier 1', () => {
    let spyCheckTier;
    beforeEach(() => {
      spyCheckTier = Sinon.spy(Utils, 'checkTier');
    });
    after(() => {
      State.clear();
    });
    afterEach(() => {
      spyCheckTier.restore();
    });
    it('KidaptiveSdk.learnerManager.setUser()', () => {
      State.set('initialized', true);
      State.set('options', {tier: 0});
      const flushEventQueueStub = Sinon.stub(EventManager, 'flushEventQueue').callsFake(() => {
        return OperationManager.addToQueue(() => {});
      });
      return Should(KidaptiveSdk.learnerManager.setUser({providerUserId: 'userId'})).rejected().then(() => {
        State.set('options', {tier: 1});
        return Should(KidaptiveSdk.learnerManager.setUser({providerUserId: 'userId'})).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
          flushEventQueueStub.restore();
        });
      });
    });
    it('KidaptiveSdk.learnerManager.selectActiveLearner()', () => {
      State.set('initialized', true);
      State.set('options', {tier: 0});
      return Should(KidaptiveSdk.learnerManager.selectActiveLearner('learnerId')).rejected().then(() => {
        State.set('options', {tier: 1});
        return Should(KidaptiveSdk.learnerManager.selectActiveLearner('learnerId')).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
        });
      });
    });
    it('KidaptiveSdk.learnerManager.clearActiveLearner()', () => {
      State.set('initialized', true);
      State.set('options', {tier: 0});
      return Should(KidaptiveSdk.learnerManager.clearActiveLearner()).rejected().then(() => {
        State.set('options', {tier: 1});
        return Should(KidaptiveSdk.learnerManager.clearActiveLearner()).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
        });
      });
    });
    it('KidaptiveSdk.learnerManager.logout()', () => {
      State.set('initialized', true);
      State.set('options', {tier: 0});
      const flushEventQueueStub = Sinon.stub(EventManager, 'flushEventQueue').callsFake(() => {
        return OperationManager.addToQueue(() => {});
      });
      return Should(KidaptiveSdk.learnerManager.logout()).rejected().then(() => {
        State.set('options', {tier: 1});
        return Should(KidaptiveSdk.learnerManager.logout()).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
          flushEventQueueStub.restore();
        });
      });
    });
    it('KidaptiveSdk.learnerManager.getUser()', () => {
      State.set('initialized', true);
      State.set('options', {tier: 0});
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getUser()
      }, Error);
      State.set('options', {tier: 1});
      Should.doesNotThrow(() => { 
         KidaptiveSdk.learnerManager.getUser()
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(1)).true();
    });
    it('KidaptiveSdk.learnerManager.getActiveLearner()', () => {
      State.set('initialized', true);
      State.set('options', {tier: 0});
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getActiveLearner()
      }, Error);
      State.set('options', {tier: 1});
      Should.doesNotThrow(() => { 
         KidaptiveSdk.learnerManager.getActiveLearner()
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(1)).true();
    });
    it('KidaptiveSdk.learnerManager.getLearnerList()', () => {
      State.set('initialized', true);
      State.set('options', {tier: 0});
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getLearnerList()
      }, Error);
      State.set('options', {tier: 1});
      Should.doesNotThrow(() => { 
         KidaptiveSdk.learnerManager.getLearnerList()
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(1)).true();
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
