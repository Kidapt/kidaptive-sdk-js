'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import RecommendationManager from '../../../src/recommendation-manager';
import State from '../../../src/state';
import Should from 'should';

export default () => {

  describe('unregisterRecommender', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('validate key', () => {

      describe('key is required and must be an string', () => {

        beforeEach(() => {
          RecommendationManager.registerRecommender(TestConstants.defaultRecommender, TestConstants.defaultKey);
        });

        const testFunction = parameter => {
          return RecommendationManager.unregisterRecommender(parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);

      });

    }); //END validate key

    it('removes recommender from state', () => { 
      RecommendationManager.registerRecommender(TestConstants.defaultRecommender, TestConstants.defaultKey);
      const recommenders = State.get('recommenders', false);
      Should(recommenders[TestConstants.defaultKey]).deepEqual(TestConstants.defaultRecommender);
      RecommendationManager.unregisterRecommender(TestConstants.defaultKey);
      const updatedRecommenders = State.get('recommenders', false);
      Should(updatedRecommenders[TestConstants.defaultKey]).equal(undefined);
    });

    describe('key not existing should not throw error', () => {

      it('no recommenders exist', () => {
        Should(State.get('recommenders', false)).equal(undefined);
        Should.doesNotThrow(() =>{
          RecommendationManager.unregisterRecommender('random key');
        }, Error);
        Should(State.get('recommenders', false)).equal(undefined);
      });

      it('recommenders exist for different keys', () => {
        RecommendationManager.registerRecommender(TestConstants.defaultRecommender, TestConstants.defaultKey);
        Should.doesNotThrow(() =>{
          RecommendationManager.unregisterRecommender('rando key');
        }, Error);
        const recommenders = State.get('recommenders', false);
        Should(recommenders[TestConstants.defaultKey]).deepEqual(TestConstants.defaultRecommender);
      });

    }); //END key not existing should not throw error

  }); //END unregisterRecommender

}; //END export
