'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import KidaptiveSdk from '../../../src/index';
import RecommendationManager from '../../../src/recommendation-manager'
import Utils from '../../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('Tier 3 Interface', () => {

    let server;
    let spyCheckTier;

    const tier3Options = {tier: 3};

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
      TestUtils.setStateOptions({tier: 2});
    });

    after(() => {
      server.restore();
      spyCheckTier.restore();
      TestUtils.resetStateAndCache();
    });

    it('KidaptiveSdk.learnerManager.getSuggestedPrompts()', () => {
      //stub getRecommendation to bypass recommender validation
      const getRecommendationStub = Sinon.stub(RecommendationManager, 'getRecommendation').callsFake(() => {
        return {};
      });
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getSuggestedPrompts();
      }, Error);
      TestUtils.setStateOptions(tier3Options);
      Should.doesNotThrow(() => { 
        KidaptiveSdk.learnerManager.getSuggestedPrompts();
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(3)).true();
      getRecommendationStub.restore();
    });

    it('KidaptiveSdk.learnerManager.getRandomPromptForGame()', () => {
      //stub getRecommendation to bypass recommender validation
      const getRecommendationStub = Sinon.stub(RecommendationManager, 'getRecommendation').callsFake(() => {
        return {};
      });
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getRandomPromptForGame();
      }, Error);
      TestUtils.setStateOptions(tier3Options);
      Should.doesNotThrow(() => { 
        KidaptiveSdk.learnerManager.getRandomPromptForGame();
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(3)).true();
      getRecommendationStub.restore();
    });

    it('KidaptiveSdk.eventManager.setEventTransformer()', () => {
      Should.throws(() => { 
        KidaptiveSdk.eventManager.setEventTransformer(() => {});
      }, Error);
      TestUtils.setStateOptions(tier3Options);
      Should.doesNotThrow(() => { 
        KidaptiveSdk.eventManager.setEventTransformer(() => {});
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(3)).true();
    });

    it('KidaptiveSdk.modelManager.getItems()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getItems();
      }, Error);
      TestUtils.setStateOptions(tier3Options);
      Should.doesNotThrow(() => { 
        KidaptiveSdk.modelManager.getItems();
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(3)).true();
    });

    it('KidaptiveSdk.modelManager.getItemByUri()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getItemByUri('itemUri');
      }, Error);
      TestUtils.setStateOptions(tier3Options);
      Should.doesNotThrow(() => { 
        KidaptiveSdk.modelManager.getItemByUri('itemUri');
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(3)).true();
    });

    it('KidaptiveSdk.modelManager.getItemsByPromptUri()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getItemsByPromptUri('promptUri');
      }, Error);
      TestUtils.setStateOptions(tier3Options);
      Should.doesNotThrow(() => { 
        KidaptiveSdk.modelManager.getItemsByPromptUri('promptUri');
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(3)).true();
    });

    it('KidaptiveSdk.modelManager.getPrompts()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getPrompts();
      }, Error);
      TestUtils.setStateOptions(tier3Options);
      Should.doesNotThrow(() => { 
        KidaptiveSdk.modelManager.getPrompts();
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(3)).true();
    });

    it('KidaptiveSdk.modelManager.getPromptByUri()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getPromptByUri('promptUri');
      }, Error);
      TestUtils.setStateOptions(tier3Options);
      Should.doesNotThrow(() => { 
        KidaptiveSdk.modelManager.getPromptByUri('promptUri');
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(3)).true();
    });

    it('KidaptiveSdk.modelManager.getPromptsByGameUri()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getPromptsByGameUri('gameUri');
      }, Error);
      TestUtils.setStateOptions(tier3Options);
      Should.doesNotThrow(() => { 
        KidaptiveSdk.modelManager.getPromptsByGameUri('gameUri');
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(3)).true();
    });

  }); //END Tier 3 Interface

}; //END export
