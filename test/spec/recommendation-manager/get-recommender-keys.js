'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import RecommendationManager from '../../../src/recommendation-manager';
import Should from 'should';

export default () => {

  describe('getRecommenderKeys', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('if no recommender, returns empty array', () => { 
      Should.doesNotThrow(() =>{
        RecommendationManager.getRecommenderKeys();
      }, Error);
      Should(RecommendationManager.getRecommenderKeys()).deepEqual([]);
    });

    it('returns recommender keys', () => {
      RecommendationManager.registerRecommender(TestConstants.defaultRecommender, 'key1');
      RecommendationManager.registerRecommender(TestConstants.defaultRecommender, 'key2');
      RecommendationManager.registerRecommender(TestConstants.defaultRecommender, 'key3');
      Should(RecommendationManager.getRecommenderKeys()).deepEqual(['key1', 'key2', 'key3']);
      RecommendationManager.unregisterRecommender('key3');
      Should(RecommendationManager.getRecommenderKeys()).deepEqual(['key1', 'key2']);
    });

  }); //END getRecommenderKeys

}; //END export
