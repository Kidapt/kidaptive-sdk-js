'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import KidaptiveSdk from '../../../src/index';
import EventManager from '../../../src/event-manager';
import LearnerManager from '../../../src/learner-manager';
import ModelManager from '../../../src/model-manager';
import OperationManager from '../../../src/operation-manager';
import RecommendationManager from '../../../src/recommendation-manager';
import State from '../../../src/state';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('Tier 2 Logic', () => {

    const tier2Options = {tier: 2};

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('KidaptiveSdk.init()', () => {

      it('LearnerManager.updateModels() gets called', () => {
        const updateModelsStub = Sinon.stub(ModelManager, 'updateModels').callsFake(() => {
          return OperationManager.addToQueue(() => {});
        });
        Should(updateModelsStub.called).false();
        return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev', tier: 2})).resolved().then(() => {
          Should(updateModelsStub.called).true();
          updateModelsStub.restore();
        });
      });

      it('LearnerManager.updateModels() rejection causes init to reject', () => {
        const updateModelsStub = Sinon.stub(ModelManager, 'updateModels').callsFake(() => {
          return OperationManager.addToQueue(() => {
            throw new Error('Random rejection error');
          });
        });
        Should(updateModelsStub.called).false();
        return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev', tier: 2})).rejected().then(() => {
          Should(updateModelsStub.called).true();
          updateModelsStub.restore();
        });
      });

      it('RecommendationManager.registerRecommender() does not get called', () => {
        //stub updateModels to prevent API call
        const updateModelsStub = Sinon.stub(ModelManager, 'updateModels').callsFake(() => {
          return OperationManager.addToQueue(() => {});
        });
        const spyRegisterRecommender = Sinon.spy(RecommendationManager, 'registerRecommender');
        Should(spyRegisterRecommender.called).false();
        return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev', tier: 2})).resolved().then(() => {
          Should(spyRegisterRecommender.called).false();
          spyRegisterRecommender.restore();
          updateModelsStub.restore();
        });
      });

    }); //END KidaptiveSdk.init()

    describe('ModelManager.updateModels()', () => {

      beforeEach(() => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions(tier2Options);
      });

      it('Correct models are fetched', () => {
        const server = Sinon.fakeServer.create();
        server.respondImmediately = true;
        server.respondWith([200, {'Content-Type': 'application/json'}, '[]']);
        return Should(ModelManager.updateModels()).resolved().then(() => {
          const requestMap = {};
          server.requests.forEach(request => {
            const requestPieces = request.url.split('/');
            requestMap[requestPieces.pop()] = true;
          });
          Should(requestMap).deepEqual({dimension: true, game: true, 'local-dimension': true});
          server.restore();
        });
      });

    }); //END ModelManager.updateModels()

    describe('LearnerManager.selectActiveLearner()', () => {
      
      let getLearnerListStub;
      const learners = [{providerId: 'providerLearnerId'}];

      before(() => {
        //stub getLearnerList in order to bypass api call / learner validation
        getLearnerListStub = Sinon.stub(LearnerManager, 'getLearnerList').callsFake(() => {
          return learners;
        });
      });

      beforeEach(() => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions(tier2Options);
      });

      after(() => {
        getLearnerListStub.restore();
      });

      it('LearnerManager.updateAbilityEstimates() gets called', () => {
        const spyUpdateAbilityEstimates = Sinon.spy(LearnerManager, 'updateAbilityEstimates');
        Should(spyUpdateAbilityEstimates.called).false();
        return Should(LearnerManager.selectActiveLearner(learners[0].providerId)).resolved().then(() => {
          Should(spyUpdateAbilityEstimates.called).true();
          spyUpdateAbilityEstimates.restore();
        });
      });

      it('LearnerManager.startTrial() gets called after updateAbilityEstimates resolves', () => {
        let abilityEstimatesResolved = false;
        let trialCalledAfterAbilityEstimates = false;
        const updateAbilityEstimatesStub = Sinon.stub(LearnerManager, 'updateAbilityEstimates').callsFake(() => {
          return OperationManager.addToQueue(() => {
            abilityEstimatesResolved = true;
          });
        });
        const startTrialStub = Sinon.stub(LearnerManager, 'startTrial').callsFake(() => {
          return OperationManager.addToQueue(() => {
            if (abilityEstimatesResolved) {
              trialCalledAfterAbilityEstimates = true;
            }
          });
        });
        Should(startTrialStub.called).false();
        return Should(LearnerManager.selectActiveLearner(learners[0].providerId)).resolved().then(() => {
          Should(startTrialStub.called).true();
          Should(trialCalledAfterAbilityEstimates).equal(true);
          updateAbilityEstimatesStub.restore();
          startTrialStub.restore();
        });
      });

      it('LearnerManager.startTrial() gets called after updateAbilityEstimates rejects', () => {
        const updateAbilityEstimatesStub = Sinon.stub(LearnerManager, 'updateAbilityEstimates').callsFake(() => {
          return OperationManager.addToQueue(() => {
            throw new Error('Random rejection error');
          });
        });
        const spyStartTrial = Sinon.spy(LearnerManager, 'startTrial');
        Should(spyStartTrial.called).false();
        return Should(LearnerManager.selectActiveLearner(learners[0].providerId)).resolved().then(() => {
          Should(spyStartTrial.called).true();
        });
      });

    }); //END LearnerManager.selectActiveLearner()

    describe('LearnerManager.startTrial()', () => {

      beforeEach(() => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions(tier2Options);
      });

      it('Does not adjust latent ability estimate standard deviation', () => {
        const abilities = [{standardDeviation: 0.25}];
        const learnerId = 100;
        State.set('learnerId', learnerId);
        State.set('latentAbilities.' + learnerId, abilities)
        return Should(LearnerManager.startTrial()).resolved().then(() => {
          Should(State.get('latentAbilities.' + learnerId)).deepEqual(abilities);
        });
      });

    }); //END LearnerManager.startTrial()

  }); //END Tier 2 Logic

}; //END export
