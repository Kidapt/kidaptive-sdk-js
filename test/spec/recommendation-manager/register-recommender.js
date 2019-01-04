'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import RecommendationManager from '../../../src/recommendation-manager';
import State from '../../../src/state';
import Should from 'should';

export default () => {

  describe('registerRecommender', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('validate recommender', () => {


      describe('recommender is required and must be an object', () => {

        const testFunction = parameter => {
          return RecommendationManager.registerRecommender(parameter, TestConstants.defaultKey);
        };
        TestUtils.validateProperty(testFunction, 'object', true, [TestConstants.defaultRecommender]);

      });

      describe('recommender.getRecommendation is required and must be a function', () => {

        const testFunction = parameter => {
          return RecommendationManager.registerRecommender({
            getRecommendation: parameter
          }, TestConstants.defaultKey);
        };
        TestUtils.validateProperty(testFunction, 'function', true);

      });

    }); //END validate recommender

    describe('validate key', () => {

      describe('key is required and must be an string', () => {

        const testFunction = parameter => {
          return RecommendationManager.registerRecommender(TestConstants.defaultRecommender, parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);

      });

    }); //END validate key

    describe('state is updated', () => {

      it('recommender is stored in state', () => {
        Should(State.get('recommenders', false)).equal(undefined);  
        RecommendationManager.registerRecommender(TestConstants.defaultRecommender, TestConstants.defaultKey);
        const recommenders = State.get('recommenders', false);
        Should(recommenders).Object()
        Should(Object.keys(recommenders)).deepEqual([TestConstants.defaultKey]);
        Should(recommenders[TestConstants.defaultKey]).deepEqual(TestConstants.defaultRecommender);
      });

      it('if key already exists, recommender is replaced', () => {
        Should(State.get('recommenders', false)).equal(undefined);  
        RecommendationManager.registerRecommender(TestConstants.defaultRecommender, 'key1');
        RecommendationManager.registerRecommender(TestConstants.defaultRecommender, 'key2');
        RecommendationManager.registerRecommender(TestConstants.defaultRecommender, 'key3');
        const recommenders = State.get('recommenders', false);
        Should(recommenders).Object()
        Should(Object.keys(recommenders)).deepEqual(['key1', 'key2', 'key3']);
        const newRecommender = {
          getRecommendation: () => {},
          someExtraProp: true
        };
        RecommendationManager.registerRecommender(newRecommender, 'key2');
        const newRecommenders = State.get('recommenders', false);
        Should(newRecommenders).Object()
        Should(Object.keys(newRecommenders)).deepEqual(['key1', 'key2', 'key3']);
        Should(recommenders['key2']).deepEqual(newRecommender);
      });
      
    }); //END state is updated

  }); //END registerRecommender

}; //END export
