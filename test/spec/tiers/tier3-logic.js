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
        return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev', tier: 3})).resolved().then(() => {
          Should(spyRegisterRecommender.called).true();
          spyRegisterRecommender.restore();
        });
      });

      it('Recommenders are registered', () => {
        return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev', tier: 3})).resolved().then(() => {
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

      it('Does not adjust latent ability estimate standard deviation', () => {
        const abilities = [{standardDeviation: 0.25}];
        const learnerId = 100;
        State.set('learnerId', learnerId);
        State.set('latentAbilities.' + learnerId, abilities)
        return Should(LearnerManager.startTrial()).resolved().then(() => {
          Should(State.get('latentAbilities.' + learnerId)[0].standardDeviation).equal(0.65);
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
