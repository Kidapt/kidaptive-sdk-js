'use strict';
import getRecommendation from './get-recommendation';
import getRecommenderKeys from './get-recommender-keys';
import registerRecommender from './register-recommender';
import unregisterRecommender from './unregister-recommender';

export default () => {

  describe('Recommendation Manager', () => {

    registerRecommender();
    unregisterRecommender();
    getRecommenderKeys();
    getRecommendation();

  }); //END Recommendation Manager

}; //END export
