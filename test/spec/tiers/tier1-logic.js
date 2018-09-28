'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import KidaptiveSdk from '../../../src/index';
import EventManager from '../../../src/event-manager';
import LearnerManager from '../../../src/learner-manager';
import ModelManager from '../../../src/model-manager';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('Tier 1 Logic', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('KidaptiveSdk.init()', () => {

      it('EventManager.startAutoFlush() gets called', () => {
        const spyStartAutoFlush = Sinon.spy(EventManager, 'startAutoFlush');
        Should(spyStartAutoFlush.called).false();
        return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev'})).resolved().then(() => {
          Should(spyStartAutoFlush.called).true();
          spyStartAutoFlush.restore();
        });
      });

      it('ModelManager.updateModels() does not get called', () => {
        const spyUpdateModels = Sinon.spy(ModelManager, 'updateModels');
        Should(spyUpdateModels.called).false();
        return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev'})).resolved().then(() => {
          Should(spyUpdateModels.called).false();
          spyUpdateModels.restore();
        });
      });

    }); //END KidaptiveSdk.init()

    describe('KidaptiveSdk.destroy()', () => {

      it('calls EventManager.stopAutoFlush()', () => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions({tier: 1});
        const spyStopAutoFlush = Sinon.spy(EventManager, 'stopAutoFlush');
        Should(spyStopAutoFlush.called).false();
        return Should(KidaptiveSdk.destroy()).resolved().then(() => {
          Should(spyStopAutoFlush.called).true();
          spyStopAutoFlush.restore();
        });
      });

      it('calls EventManager.flushEventQueue()', () => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions({tier: 1});
        const spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
        Should(spyFlushEventQueue.called).false();
        return Should(KidaptiveSdk.destroy()).resolved().then(() => {
          Should(spyFlushEventQueue.called).true();
          spyFlushEventQueue.restore();
        });
      });

    }); //END KidaptiveSdk.destroy()

    describe('LearnerManager.selectActiveLearner()', () => {
      
      let getLearnerListStub;
      const learners = [{providerId: 'providerLearnerId'}];

      before(() => {
        //stub getLearnerList in order to bypass api call / learner validation
        getLearnerListStub = Sinon.stub(LearnerManager, 'getLearnerList').callsFake(() => {
          return learners;
        });
      });

      after(() => {
        getLearnerListStub.restore();
      });

      it('LearnerManager.startTrial() gets called', () => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions({tier: 1});
        const spyStartTrial = Sinon.spy(LearnerManager, 'startTrial');
        Should(spyStartTrial.called).false();
        return Should(LearnerManager.selectActiveLearner(learners[0].providerId)).resolved().then(() => {
          Should(spyStartTrial.called).true();
          spyStartTrial.restore();
        });
      })

      it('LearnerManager.updateAbilityEstimates() does not get called', () => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions({tier: 1});
        const spyUpdateAbilityEstimates = Sinon.spy(LearnerManager, 'updateAbilityEstimates');
        Should(spyUpdateAbilityEstimates.called).false();
        return Should(LearnerManager.selectActiveLearner(learners[0].providerId)).resolved().then(() => {
          Should(spyUpdateAbilityEstimates.called).false();
          spyUpdateAbilityEstimates.restore();
        });
      })

    }); //END LearnerManager.selectActiveLearner()

  }); //END Tier 1 Logic

}; //END export

/*
*/
