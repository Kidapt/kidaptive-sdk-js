import Constants from './constants';
import Error from './error';
import EventManager from './event-manager';
import LearnerManager from './learner-manager';
import OperationManager from './operation-manager';
import State from './state';
import Utils from './utils';

class KidaptiveSdk {
  constructor() {
    State.clear();
    State.set('initialized', false);
    this.eventManager = EventManager;
    this.learnerManager = LearnerManager;
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
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Api key is required');
      }
      if (!Utils.isString(apiKey)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Api key must be a string');
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
      if ([1].indexOf(options.tier) === -1) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Tier option is not an accepted value');
      }

      //validate authMode
      if (!Utils.isString(options.authMode)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'AuthMode option must be a string');
      }
      if (['client', 'server'].indexOf(options.authMode) === -1) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'AuthMode option is not an accepted value');
      }

      //validate appUri
      if (options.appUri != null) {
        if (!Utils.isString(options.appUri)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'AppUri option must be a string');
        }
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

      State.set('initialized', true);
      State.set('apiKey', apiKey);
      State.set('options', options);

      //start auto flush
      if (State.get('options').tier >= 1) {
        EventManager.startAutoFlush();
      }
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
      
    }).then(() => {

      //flush event and logout
      if (State.get('options').tier >= 1) {
        EventManager.stopAutoFlush();
        return LearnerManager.logout();
      }
    }).then(() => {

      //resolve destroy promise once state is reset
      return OperationManager.addToQueue(() => {
        State.clear();
        State.set('initialized', false);
      });
    });
  }
}

export default new KidaptiveSdk();
