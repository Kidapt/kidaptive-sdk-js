import Constants from './constants';
import Error from './error';
import EventManager from './event-manager';
import LearnerManager from './learner-manager';
import ModelManager from './model-manager';
import OperationManager from './operation-manager';
import RecommendationManager from './recommendation-manager';
import RecommenderOptimalDifficulty from './recommenders/optimal-difficulty';
import RecommenderRandom from './recommenders/random';
import State from './state';
import Utils from './utils';
import Q from 'q';

class KidaptiveSdk {
  constructor() {
    State.clear();
    State.set('initialized', false);
    this.eventManager = EventManager;
    this.learnerManager = LearnerManager;
    this.modelManager = ModelManager;
  }

  /**
   * Initialized the Kidaptive SDk with the given apiKey and options
   * 
   * @param {string} apiKey
   *   The apiKey to use when making calls to the Kidaptive API
   *
   * @param {object} options
   *   The options to use while configuring the Kidaptive SDK
   * 
   * @return
   *   A promise that resolves when the Kidaptive SDK is initialized
   */
  init(apiKey, options = {}) {
    return OperationManager.addToQueue(() => {
      if (State.get('initialized')) {
        throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'SDK already initialized');
      }

      //copy api key and options
      apiKey = Utils.copyObject(apiKey);
      options = Utils.copyObject(options);

      //force autoFlushCallback to be an array if set
      if (!Utils.isArray(options.autoFlushCallback) && options.autoFlushCallback != null) {
          options.autoFlushCallback = [options.autoFlushCallback];
      }

      //set default options by checking for undefined or null with == null
      options.tier = options.tier == null ? Constants.DEFAULT.TIER : options.tier;
      options.authMode = options.authMode == null ? Constants.DEFAULT.AUTH_MODE : options.authMode;
      options.autoFlushInterval = options.autoFlushInterval == null ? Constants.DEFAULT.AUTO_FLUSH_INTERVAL : options.autoFlushInterval;
      options.loggingLevel = options.loggingLevel == null ? Constants.DEFAULT.LOGGING_LEVEL : options.loggingLevel;

      //validate apiKey
      if (apiKey == null) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'API key is required');
      }
      if (!Utils.isString(apiKey)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'API key must be a string');
      }

      //validate environment
      if (options.environment == null) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Environment option is required');
      }
      if (!Utils.isString(options.environment)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Environment option must be a string');
      }
      if (['dev', 'prod', 'custom'].indexOf(options.environment) === -1) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Environment option is not an accepted value');
      }

      //validate baseUrl
      if (options.environment === 'custom') {
        if (options.baseUrl == null) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'BaseUrl option is required');
        }
      }
      if (options.baseUrl != null && !Utils.isString(options.baseUrl)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'BaseUrl option must be a string');
      }

      //validate tier
      if (!Utils.isNumber(options.tier)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Tier option must be a number');
      }
      if ([1, 2, 3].indexOf(options.tier) === -1) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Tier option is not an accepted value');
      }

      //validate authMode
      if (!Utils.isString(options.authMode)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'AuthMode option must be a string');
      }
      if (['client', 'server'].indexOf(options.authMode) === -1) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'AuthMode option is not an accepted value');
      }

      //validate version
      if (options.version != null) {
        if (!Utils.isString(options.version)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Version option must be a string');
        }
      }

      //validate build
      if (options.build != null) {
        if (!Utils.isString(options.build)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Build option must be a string');
        }
      }

      //validate autoFlushInterval
      if (!Utils.isNumber(options.autoFlushInterval)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'AutoFlushInterval option must be a number');
      }
      if (options.autoFlushInterval < 0) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'AutoFlushInterval option is not an accepted value');
      }

      //validate autoFlushCallback
      if (options.autoFlushCallback) {
        options.autoFlushCallback.forEach(callback => {
          if (!Utils.isFunction(callback)) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'AutoFlushCallback option must be a function or array of functions');
          }
        })
      }

      //validate loggingLevel
      if (!Utils.isString(options.loggingLevel)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'LoggingLevel option must be a string');
      }
      if (['all', 'warn', 'none'].indexOf(options.loggingLevel) === -1) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'LoggingLevel option is not an accepted value');
      }

      //validate defaultHttpCache
      if (options.defaultHttpCache != null) {
        if (!Utils.isObject(options.defaultHttpCache)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'defaultHttpCache must be an object');
        }
        Object.keys(options.defaultHttpCache).forEach(cacheKey => {
          if (!Utils.isString(options.defaultHttpCache[cacheKey])) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'defaultHttpCache must be an object of key:value pairs with string values');
          }
        });

        //set default http cache
        Object.keys(options.defaultHttpCache).forEach(cacheKey => {
          try {
            Utils.localStorageGetItem(cacheKey);
          } catch (e) {
            Utils.localStorageSetItem(cacheKey, options.defaultHttpCache[cacheKey], false);
          }
        });
      }

      //set state
      State.set('initialized', true);
      State.set('apiKey', apiKey);
      State.set('options', options);

      //get cached user and learner
      State.set('user', Utils.getCachedUser());
      State.set('learnerId', Utils.getCachedLearnerId());
      if (options.authMode === 'client') {
        State.set('singletonLearner', Utils.getCachedSingletonLearnerFlag());
      }

      //register built in recommenders
      if (options.tier >= 3) {
        RecommendationManager.registerRecommender(new RecommenderOptimalDifficulty(this), 'optimalDifficulty');
        RecommendationManager.registerRecommender(new RecommenderRandom(this), 'random');
      }

      //setup requests object to resolve when all items are resolved
      const requests = [];

      //start auto flush
      if (options.tier >= 1) {
        requests.push(EventManager.startAutoFlush());
      }

      //update models
      if (options.tier >= 2) {
        requests.push(ModelManager.updateModels());
      }

      //resolve init when all requests complete
      return Q.all(requests).then(results => {
        //if active learner, update it after models feteched
        const activeLearner = LearnerManager.getActiveLearner();
        if (activeLearner) {
          return LearnerManager.selectActiveLearner(activeLearner.providerId);

        //otherwise remove learnerId and resolve undefined
        } else {
          State.set('learnerId', undefined);
        }
      })

    });
  }

  /**
   * Gets the version of the SDK from package.json
   * 
   * @return
   *   The version string provided in package.json, set during the build process
   */
  getSdkVersion() {
    return VERSION;
  }

  /**
   * Uninitialized the Kidaptive SDk
   * 
   * @return
   *   A promise that resolves when the Kidaptive SDK is uninitialized
   */
  destroy() {
    return OperationManager.addToQueue(() => {
      Utils.checkInitialized();
     
      if (State.get('options').tier >= 1) {
        EventManager.stopAutoFlush();
        return EventManager.flushEventQueue().then(() => {
          State.clear();
          State.set('initialized', false);
        });
      }
      
      State.clear();
      State.set('initialized', false);
    });
  }
}

export default new KidaptiveSdk();
