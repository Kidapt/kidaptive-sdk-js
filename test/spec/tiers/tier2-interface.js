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

  describe('Tier 2 Interface', () => {

    let server;
    let spyCheckTier;

    const tier2Options = {tier: 2};

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
      TestUtils.setStateOptions({tier: 1});
    });

    after(() => {
      server.restore();
      spyCheckTier.restore();
      TestUtils.resetStateAndCache();
    });

    it('KidaptiveSdk.learnerManager.getLocalAbilityEstimate()', () => {
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getLocalAbilityEstimate('localDimensionUri');
      }, Error);
      TestUtils.setStateOptions(tier2Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.learnerManager.getLocalAbilityEstimate('localDimensionUri');
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(2)).true();
    });

    it('KidaptiveSdk.learnerManager.getLocalAbilityEstimates()', () => {
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getLocalAbilityEstimates();
      }, Error);
      TestUtils.setStateOptions(tier2Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.learnerManager.getLocalAbilityEstimates();
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(2)).true();
    });

    it('KidaptiveSdk.learnerManager.getLatentAbilityEstimate()', () => {
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getLatentAbilityEstimate('dimensionUri');
      }, Error);
      TestUtils.setStateOptions(tier2Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.learnerManager.getLatentAbilityEstimate('dimensionUri');
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(2)).true();
    });

    it('KidaptiveSdk.learnerManager.getLatentAbilityEstimates()', () => {
      Should.throws(() => { 
        KidaptiveSdk.learnerManager.getLatentAbilityEstimates();
      }, Error);
      TestUtils.setStateOptions(tier2Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.learnerManager.getLatentAbilityEstimates();
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(2)).true();
    });

    it('KidaptiveSdk.learnerManager.updateAbilityEstimates()', () => {
      return Should(KidaptiveSdk.learnerManager.updateAbilityEstimates()).rejected().then(() => {
        TestUtils.setStateOptions(tier2Options);
        return Should(KidaptiveSdk.learnerManager.updateAbilityEstimates()).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(2)).true();
        });
      });
    });

    it('KidaptiveSdk.modelManager.getGames()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getGames();
      }, Error);
      TestUtils.setStateOptions(tier2Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.modelManager.getGames();
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(2)).true();
    });

    it('KidaptiveSdk.modelManager.getGameByUri()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getGameByUri('gameUri');
      }, Error);
      TestUtils.setStateOptions(tier2Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.modelManager.getGameByUri('gameUri');
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(2)).true();
    });

    it('KidaptiveSdk.modelManager.getDimensions()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getDimensions();
      }, Error);
      TestUtils.setStateOptions(tier2Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.modelManager.getDimensions();
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(2)).true();
    });

    it('KidaptiveSdk.modelManager.getDimensionByUri()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getDimensionByUri('dimensionUri');
      }, Error);
      TestUtils.setStateOptions(tier2Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.modelManager.getDimensionByUri('dimensionUri');
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(2)).true();
    });

    it('KidaptiveSdk.modelManager.getLocalDimensions()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getLocalDimensions();
      }, Error);
      TestUtils.setStateOptions(tier2Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.modelManager.getLocalDimensions();
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(2)).true();
    });

    it('KidaptiveSdk.modelManager.getLocalDimensionByUri()', () => {
      Should.throws(() => { 
        KidaptiveSdk.modelManager.getLocalDimensionByUri('localDimensionUri');
      }, Error);
      TestUtils.setStateOptions(tier2Options);
      Should.doesNotThrow(() => { 
         KidaptiveSdk.modelManager.getLocalDimensionByUri('localDimensionUri');
      }, Error);
      Should(spyCheckTier.callCount).equal(2);
      Should(spyCheckTier.alwaysCalledWith(2)).true();
    });

    it('KidaptiveSdk.modelManager.updateModels()', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, '[]']);
      return Should(KidaptiveSdk.modelManager.updateModels()).rejected().then(() => {
        TestUtils.setStateOptions(tier2Options);
        return Should(KidaptiveSdk.modelManager.updateModels()).resolved().then(() => {
          Should(spyCheckTier.callCount).equal(2);
          Should(spyCheckTier.alwaysCalledWith(2)).true();
        });
      });
    });

  }); //END Tier 2 Interface

}; //END export
