'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import KidaptiveSdk from '../../../src/index';
import EventManager from '../../../src/event-manager';
import LearnerManager from '../../../src/learner-manager';
import OperationManager from '../../../src/operation-manager';
import Utils from '../../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('Tier 1 Interface', () => {

    let server;
    let spyCheckTier;

    const tier1Options = {tier: 1};

    before(() => {
      server = Sinon.fakeServer.create();
      spyCheckTier = Sinon.spy(Utils, 'checkTier');
    });

    beforeEach(() => {
      server.resetHistory();
      server.respondImmediately = true;
      server.respondWith(TestConstants.defaultServerResponse);
      spyCheckTier.resetHistory();
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setStateOptions({tier: 0});
    });

    after(() => {
      server.restore();
      spyCheckTier.restore();
      TestUtils.resetStateAndCache();
    });

    it('KidaptiveSdk.learnerManager.setUser()', () => {
      //stub flushEventQueue in order to get accurate checkTier count
      const flushEventQueueStub = Sinon.stub(EventManager, 'flushEventQueue').callsFake(() => {
        return OperationManager.addToQueue(() => {});
      });
      return Should(KidaptiveSdk.learnerManager.setUser({providerUserId: 'userId'})).rejected().then(() => {
        TestUtils.setStateOptions(tier1Options);
        return Should(KidaptiveSdk.learnerManager.setUser({providerUserId: 'userId'})).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
          flushEventQueueStub.restore();
        });
      });
    });

    it('KidaptiveSdk.learnerManager.selectActiveLearner()', () => {
      const learners = [{providerId: 'providerLearnerId'}];
      //stub flushEventQueue in order to get accurate checkTier count
      const startTrialStub = Sinon.stub(LearnerManager, 'startTrial').callsFake(() => {
        return OperationManager.addToQueue(() => {});
      });
      //stub getLearnerList in order to get accurate checkTier count, and provide learner to bypass api call / learner validation
      const getLearnerListStub = Sinon.stub(LearnerManager, 'getLearnerList').callsFake(() => {
        return learners;
      });
      return Should(KidaptiveSdk.learnerManager.selectActiveLearner(learners[0].providerId)).rejected().then(() => {
        TestUtils.setStateOptions(tier1Options);
        return Should(KidaptiveSdk.learnerManager.selectActiveLearner(learners[0].providerId)).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
          startTrialStub.restore();
          getLearnerListStub.restore();
        });
      });
    });

    it('KidaptiveSdk.learnerManager.clearActiveLearner()', () => {
      return Should(KidaptiveSdk.learnerManager.clearActiveLearner()).rejected().then(() => {
        TestUtils.setStateOptions(tier1Options);
        return Should(KidaptiveSdk.learnerManager.clearActiveLearner()).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
        });
      });
    });

    it('KidaptiveSdk.learnerManager.logout()', () => {
      //stub flushEventQueue in order to get accurate checkTier count
      const flushEventQueueStub = Sinon.stub(EventManager, 'flushEventQueue').callsFake(() => {
        return OperationManager.addToQueue(() => {});
      });
      return Should(KidaptiveSdk.learnerManager.logout()).rejected().then(() => {
        TestUtils.setStateOptions(tier1Options);
        return Should(KidaptiveSdk.learnerManager.logout()).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
          flushEventQueueStub.restore();
        });
      });
    });

    it('KidaptiveSdk.learnerManager.getUser()', () => {
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getUser()
      }, Error);
      TestUtils.setStateOptions(tier1Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.learnerManager.getUser()
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(1)).true();
    });

    it('KidaptiveSdk.learnerManager.getActiveLearner()', () => {
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getActiveLearner()
      }, Error);
      TestUtils.setStateOptions(tier1Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.learnerManager.getActiveLearner()
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(1)).true();
    });

    it('KidaptiveSdk.learnerManager.getLearnerList()', () => {
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getLearnerList()
      }, Error);
      TestUtils.setStateOptions(tier1Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.learnerManager.getLearnerList()
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(1)).true();
    });

    it('KidaptiveSdk.eventManager.reportSimpleEvent()', () => {
      return Should(KidaptiveSdk.eventManager.reportSimpleEvent('eventName', {})).rejected().then(() => {
        TestUtils.setStateOptions(tier1Options);
        return Should(KidaptiveSdk.eventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
        });
      });
    });

    it('KidaptiveSdk.eventManager.reportRawEvent()', () => {
      return Should(KidaptiveSdk.eventManager.reportRawEvent('{}')).rejected().then(() => {  
        TestUtils.setStateOptions(tier1Options);
        return Should(KidaptiveSdk.eventManager.reportRawEvent('{}')).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
        });
      });
    });

    it('KidaptiveSdk.eventManager.flushEventQueue()', () => {
      return Should(KidaptiveSdk.eventManager.flushEventQueue()).rejected().then(() => {
        TestUtils.setStateOptions(tier1Options);
        return Should(KidaptiveSdk.eventManager.flushEventQueue()).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(1)).true();
        });
      });
    });

  }); //END Tier 1 Interface

}; //END export
