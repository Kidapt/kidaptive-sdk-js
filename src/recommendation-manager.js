import Error from './error';
import State from './state';
import Utils from './utils';

class KidaptiveSdkRecommendationManager {

  /**
   * Registers a recommender under a given key
   * 
   * @param {object} recommender
   *   The recommender object to register
   * 
   * @param {string} key
   *   The key to register the recommender under
   */
  registerRecommender(recommender, key) {
    Utils.checkTier(2);

    //validate recommender
    const recommenderError = KidaptiveSdkRecommendationManager.checkRecommender(recommender);
    if (recommenderError) {
      throw recommenderError;
    }

    //validate key
    if (key == null) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Recommender key is required');
    }
    if (!Utils.isString(key)) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Recommender key must be a string');
    }

    //get recommender list
    const recommenders = State.get('recommenders', false) || {};

    //if recommender already exists log a warning
    if (recommenders[key] && Utils.checkLoggingLevel('warn') && console && console.log) {
      console.log('Warning: recommender key already exists, recommender will be replaced.');       
    }

    //add the new recommender
    recommenders[key] = Utils.copyObject(recommender);

    //set state
    State.set('recommenders', recommenders, false);
  }

  /**
   * Unregisters a recommender under a given key
   * 
   * @param {string} key
   *   The key to unregister
   */
  unregisterRecommender(key) {
    Utils.checkTier(2);

    //validate key
    if (key == null) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Recommender key is required');
    }
    if (!Utils.isString(key)) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Recommender key must be a string');
    }

    //get recommender list
    const recommenders = State.get('recommenders', false) || {};

    //if recommender doesn't exists log a warning
    if (!recommenders[key]) {
      if (Utils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: recommender key does not exist.');
      }
      return;
    }

    //unregister
    delete recommenders[key];

    //set state
    State.set('recommenders', recommenders, false);
  }

  /**
   * Get the list of registered recommender keys
   * 
   * @return
   *   An array of recommender keys
   */
  getRecommenderKeys() {
    Utils.checkTier(2);

    //get recommenders
    const recommenders = State.get('recommenders', false) || {};

    //return list of keys
    return Object.keys(recommenders);
  }

  /**
   * Get a recommendation from a specific recommender
   * 
   * @param {string} key
   *   The key of the recommender to use
   *
   * @param {object} parameters
   *   The parameters to send to the recommender getRecommendation call
   *
   * @return
   *   A recommendation result object
   */
  getRecommendation(key, parameters = {}) {
    Utils.checkTier(2);

    //check null parameters
    if (parameters === null) {
      parameters = {};
    }

    //validate key
    if (key == null) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Recommender key is required');
    }
    if (!Utils.isString(key)) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Recommender key must be a string');
    }

    //validate parameters
    if (!Utils.isObject(parameters)) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Parameters must be an object');
    }

    //get recommenders
    const recommenders = State.get('recommenders', false) || {};

    //if key doesnt exist, return recommendationResult with error
    if (!recommenders[key]) {
      return {
        error: new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'Recommender for the provided key does not exist')
      };
    }

    //call get recommendation
    const recommendationResult = recommenders[key].getRecommendation(parameters);

    //validate the result
    const recommendationResultError = KidaptiveSdkRecommendationManager.checkRecommendationResult(recommendationResult);
    if (recommendationResultError) {
      return {
        error: recommendationResultError
      };
    }

    //return the result
    return recommendationResult
  }

  /**
   * Checks to see if the recommender is in the correct format
   * 
   * @param {object} recommender
   *   The recommender object to validate
   */
  static checkRecommender(recommender) {
    //validate recommender
    if (recommender == null) {
      return new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Recommender is required');
    }
    if (!Utils.isObject(recommender)) {
      return new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Recommender must be an object');
    }
    if (recommender.getRecommendation == null) {
      return new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Recommender.getRecommendation must be defined');
    }
    if (!Utils.isFunction(recommender.getRecommendation)) {
      return new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Recommender.getRecommendation must be a function');
    }
  }

  /**
   * Checks to see if the recommendation result is in the correct format
   * 
   * @param {object} recommendationResult
   *   The recommendationResult object to validate
   */
  static checkRecommendationResult(recommendationResult) {
    //validate recommendationResult
    if (recommendationResult == null) {
      return new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'No recommendationResult is returned from the recommender');
    }
    if (!Utils.isObject(recommendationResult)) {
      return new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'The recommendationResult returned from the recommender must be an object');
    }

    //if recommendation result has an error, only validate the error
    if (recommendationResult.error) {
      //TODO check error in future when Utils.isError is defined. Not a simpel task due to cross browser compatibility

    //if recommendation result doesn't have an error, validate everything else
    } else {
      const errorPrefix = 'The recommendationResult returned from the recommender ';
      //validate type
      if (recommendationResult.type == null) {
        return new Error(Error.ERROR_CODES.INVALID_PARAMETER, errorPrefix + 'must have a type property');
      }
      if (!Utils.isString(recommendationResult.type)) {
        return new Error(Error.ERROR_CODES.INVALID_PARAMETER, errorPrefix + 'must have a type property that is a string');
      }

      //validat erecommendations
      if (recommendationResult.recommendations == null) {
        return new Error(Error.ERROR_CODES.INVALID_PARAMETER, errorPrefix + 'must have a recommendations property');
      }
      if (!Utils.isArray(recommendationResult.recommendations)) {
        return new Error(Error.ERROR_CODES.INVALID_PARAMETER, errorPrefix + 'must have a recommendations property that is an array');
      }

      //validate context if it is defined
      if (recommendationResult.context != null) {
        if (!Utils.isObject(recommendationResult.context)) {
          return new Error(Error.ERROR_CODES.INVALID_PARAMETER, errorPrefix + 'must have a context property that is an object');
        }
        let hasContextStringError = false;
        Object.keys(recommendationResult.context).forEach(contextKey => {
          if (!Utils.isString(recommendationResult.context[contextKey])) {
            hasContextStringError = true;
          }
        });
        //return error outside of foreach context
        if (hasContextStringError) {
          return new Error(Error.ERROR_CODES.INVALID_PARAMETER, errorPrefix + 'must have a context property that is an object of key:value pairs with string values');
        }
      }
    }
  }
}

export default new KidaptiveSdkRecommendationManager();
