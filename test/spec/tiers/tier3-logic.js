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
import KidaptiveIrt from 'kidaptive-irt-js';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('Tier 3 Logic', () => {

    const tier3Options = {tier: 3};

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('KidaptiveSdk.init()', () => {

      let updateModelsStub;

      before(() => {
        //stub updateModels to prevent API call
        updateModelsStub = Sinon.stub(ModelManager, 'updateModels').callsFake(() => {
          return OperationManager.addToQueue(() => {});
        }); 
      });

      beforeEach(() => {
        updateModelsStub.resetHistory();
      });

      after(() => {
        updateModelsStub.restore();
      });

      it('RecommendationManager.registerRecommender() is called', () => {
        const spyRegisterRecommender = Sinon.spy(RecommendationManager, 'registerRecommender');
        Should(spyRegisterRecommender.called).false();
        return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev', tier: 3, irtModule: KidaptiveIrt})).resolved().then(() => {
          Should(spyRegisterRecommender.called).true();
          spyRegisterRecommender.restore();
        });
      });

      it('Recommenders are registered', () => {
        return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev', tier: 3, irtModule: KidaptiveIrt})).resolved().then(() => {
          Should(RecommendationManager.getRecommenderKeys().sort()).deepEqual(['optimalDifficulty', 'random']);
        });
      });

    }); //END KidaptiveSdk.init()

    describe('ModelManager.updateModels()', () => {

      beforeEach(() => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions(tier3Options);
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
          Should(requestMap).deepEqual({dimension: true, game: true, 'local-dimension': true, prompt: true, item: true});
          server.restore();
        });
      });

    }); //END ModelManager.updateModels()

    describe('LearnerManager.startTrial()', () => {

      beforeEach(() => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions(tier3Options);
      });

      it('Does adjust latent ability estimate standard deviation', () => {
        const abilities = [{standardDeviation: 0.25}];
        const learnerId = 100;
        State.set('learnerId', learnerId);
        State.set('latentAbilities.' + learnerId, abilities);
        return Should(LearnerManager.startTrial()).resolved().then(() => {
          Should(State.get('latentAbilities.' + learnerId)[0].standardDeviation).equal(0.65);
        });
      });

      it('Does use a non-null irt extension implementation to adjust latent ability estimate', () => {
        const defaultEstimate = {
          mean: 0.5,
          standardDeviation: 2.0,
          timestamp: 0
        };
        const updatedEstimate = {
          mean: 0.7,
          standardDeviation: 1.5,
          timestamp: 113
        };
        const irtExtension = {
          getInitialLocalAbilityEstimate: (localDimensionUri) => {
            return defaultEstimate;
          },
          resetLocalAbilityEstimate: (localAbilityEstimate) => {
            return updatedEstimate;
          },
          getInitialLatentAbilityEstimate: (dimensionUri) => {
            return defaultEstimate;
          },
          resetLatentAbilityEstimate: (latentAbilityEstimate) => {
            return updatedEstimate;
          }
        };
        
        const abilities = [{mean: 0.4, standardDeviation: 0.25}];
        const learnerId = 100;
        State.set('learnerId', learnerId);
        State.set('latentAbilities.' + learnerId, abilities);
        State.set('irtExtension', irtExtension);
        return Should(LearnerManager.startTrial()).resolved().then(() => {
          Should(State.get('latentAbilities.' + learnerId)).deepEqual([updatedEstimate]);
        });
      });

      it('Does store adjusted latent ability estimate at start of trial', () => {
        const abilities = [{standardDeviation: 0.25}];
        const learnerId = 100;
        State.set('learnerId', learnerId);
        State.set('latentAbilities.' + learnerId, abilities);
        State.set('latentAbilitiesAtStartOfTrial.' + learnerId, abilities);
        return Should(LearnerManager.startTrial()).resolved().then(() => {
          Should(State.get('latentAbilitiesAtStartOfTrial.' + learnerId)[0].standardDeviation).equal(0.65);
          Should(State.get('latentAbilitiesAtStartOfTrial.' + learnerId)).deepEqual(State.get('latentAbilities.' + learnerId));
        });
      });

      it('Resets trialAttemptHistory at start of trial', () => {
        const learnerId = 100;
        State.set('learnerId', learnerId);
        const oldAttempts = [{outcome: 1}, {outcome: 0}];
        State.set('trialAttemptHistory.' + learnerId, oldAttempts);
        return Should(LearnerManager.startTrial()).resolved().then(() => {
          Should(State.get('trialAttemptHistory.' + learnerId)).deepEqual([]);
        });
      });

    }); //END LearnerManager.startTrial()

    describe('EventManager.setEventTransformer()', () => {

      beforeEach(() => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions(tier3Options);
      });

      it('event calls eventTransformer if defined', () => {
        const spyEventTransformer = Sinon.spy();
        EventManager.setEventTransformer(spyEventTransformer);
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          Should(spyEventTransformer.called).equal(true);
        });
      });

    }); //END EventManager.setEventTransformer()

  }); //END Tier 3 Logic

}; //END export
