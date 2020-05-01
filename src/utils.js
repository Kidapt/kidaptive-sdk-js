import Constants from './constants';
import Error from './error';
import HttpClient from './http-client';
import State from './state';
import CloneDeep from 'lodash.clonedeep';
import Stringify from 'json-stable-stringify';

class KidaptiveSdkUtils {

  /**
   * Checks to see if the SDK is currently initialized.
   * If it isn't, an error is thrown.
   */
  checkInitialized(method) {
    if (!State.get('initialized')) {
      throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'SDK not initialized');
    }
  }

  /**
   * Checks to see if the SDK is set to at least the target tier.
   * This also requires that the SDK is initialized.
   * If it isn't initialized, or isn't the correct tier, an error is thrown.
   * 
   * @param {number} targetTier
   *   The target tier to check against
   */
  checkTier(targetTier) {
    this.checkInitialized();
    const options = State.get('options') || {};
    if (options.tier < targetTier) {
      throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'SDK not configured to tier ' + targetTier);
    }
  }

  /**
   * Checks to see if the SDK is set to the specified auth mode.
   * This also requires that the SDK is initialized.
   * If it isn't initialized, or isn't the correct auth mode, an error is thrown.
   * 
   * @param {string} targetAuthMode
   *   The target auth mode to check against
   */
  checkAuthMode(targetAuthMode) {
    this.checkInitialized();
    const options = State.get('options') || {};
    if (options.authMode !== targetAuthMode) {
      throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'SDK not configured to authMode ' + targetAuthMode);
    }
  }

  /**
   * Checks to see if the SDK is configured to display log messages of that level
   * 
   * @param {string} targetLoggingLevel
   *   The target logging level to check against
   * 
   * @return
   *   Truthy value whether the logging level is set to at least that level or not
   */
  checkLoggingLevel(targetLoggingLevel) {
    const loggingLevelValues = {
      'all': 3,
      'warn': 2,
      'none': 1
    };
    const options = State.get('options') || {};
    const loggingLevel = options.loggingLevel || Constants.DEFAULT.LOGGING_LEVEL;
    return (loggingLevelValues[loggingLevel] >= loggingLevelValues[targetLoggingLevel]);
  }

  /**
   * Creates a deep copy of a value
   * 
   * @param {*} value
   *   The target value to copy
   * 
   * @return
   *   The copied value
   */
  copyObject(value) {
    return CloneDeep(value);
  }

  /**
   * Finds the first item in an array that matches the expression
   * 
   * @param {array} array
   *   The array of items to search
   *
   * @param {function} evaluate
   *   The evaluation function that should return truthy value for the item in question
   * 
   * @return
   *   The matched item, or undefined if there is no match
   */
  findItem(array, evaluate) {
    for (let index = 0; index < array.length; index++) {
      if (evaluate(array[index])) {
        return array[index];
      } 
    }
    return;
  }

  /**
   * Finds the first item in an array that matches the expression
   * 
   * @param {array} array
   *   The array of items to search
   *
   * @param {function} evaluate
   *   The evaluation function that should return truthy value for the item in question
   * 
   * @return
   *   The matched item's index, or -1 if there is no match
   */
  findItemIndex(array, evaluate) {
    for (let index = 0; index < array.length; index++) {
      if (evaluate(array[index])) {
        return index;
      } 
    }
    return -1;
  }

  /**
   * Checks if an object is an array
   * 
   * @param {object} object
   *   The object to check
   * 
   * @return
   *   A truthy value whether the object is an array or not
   */
  isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]'
  }

  /**
   * Checks if an object is a boolean
   * 
   * @param {object} object
   *   The object to check
   * 
   * @return
   *   A truthy value whether the object is a boolean or not
   */
  isBoolean(object) {
    return typeof object === 'boolean'
  }

  /**
   * Checks if an object is a function
   * 
   * @param {object} object
   *   The object to check
   * 
   * @return
   *   A truthy value whether the object is a function or not
   */
  isFunction(object) {
    return Object.prototype.toString.call(object) === '[object Function]';
  }

  /**
   * Checks if an object is either falsy or a function
   * 
   * @param {*} object
   *   The object to check
   * 
   * @return
   *   A truthy value when the object is a function or falsy. 
   */
  isOptionalFunction(object) {
    return !object || this.isFunction(object);
  }

  /**
   * Checks if an object is a json string
   * 
   * @param {object} object
   *   The object to check
   * 
   * @return
   *   A truthy value whether the object is a json string or not
   */
  isJson(object) {
    if (!this.isString(object)) {
      return false;
    }
    try {
      JSON.parse(object);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Checks if an object is a number
   * 
   * @param {object} object
   *   The object to check
   * 
   * @return
   *   A truthy value whether the object is a number or not
   */
  isNumber(object) {
    return Object.prototype.toString.call(object) === '[object Number]';
  }

  /**
   * Checks if an object is an integer
   * 
   * @param {object} object
   *   The object to check
   * 
   * @return
   *   A truthy value whether the object is an integer or not
   */
  isInteger(object) {
    return this.isNumber(object) && isFinite(object) && Math.floor(object) === object;
  }

  /**
   * Checks if an object is an object {}
   * 
   * @param {object} object
   *   The object to check
   * 
   * @return
   *   A truthy value whether the object is an object or not
   */
  isObject(object) {
    return object === Object(object) 
      && Object.prototype.toString.call(object) !== '[object Array]'
      && Object.prototype.toString.call(object) !== '[object Function]';
  }

  /**
   * Checks if an object is a string
   * 
   * @param {object} object
   *   The object to check
   * 
   * @return
   *   A truthy value whether the object is a string or not
   */
  isString(object) {
    return Object.prototype.toString.call(object) === '[object String]';
  }

  /**
   * Gets a property value from local storage
   * 
   * @param string property
   *   The target property to get
   * 
   * @return
   *   The value of the property
   */
  localStorageGetItem(key) {
    const cached = localStorage.getItem(key);
    if (cached === null) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'No item found for key ' + key + ' in localStorage');
    }
    return cached === 'undefined' ? undefined : JSON.parse(cached);
  }

  /**
   * Gets the local storage keys
   * 
   * @return
   *   An array of keys
   */
  localStorageGetKeys() {
    try {
      return Object.keys(localStorage);
    } catch(e) {
      return [];
    }
  }

  /**
   * Removes a property value in local storage
   * 
   * @param string property
   *   The target property to remove
   */
  localStorageRemoveItem(property) {
    try {
      localStorage.removeItem(property);
    } catch (e) {}
  }

  /**
   * Sets a property value in local storage
   * 
   * @param string property
   *   The target property to set
   *
   * @param {*} value
   *   The value to set for the target property
   *
   * @param {boolean} stringify
   *   Whether the value should be stringified or not before being passed to the localaStorage
   */
  localStorageSetItem(property, value, stringify = true) {
    try {
      localStorage.setItem(property, stringify ? JSON.stringify(value) : value);
    } catch (e) {
      if (KidaptiveSdkUtils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: ALP SDK unable to write to localStorage. Cached data may be inconsistent or out-of-date');
      }
    }
  }

  /**
   * Converts the object to a stable JSON string representation
   * 
   * @param {object} object
   *   The object to stringify into JSON format
   * 
   * @return
   *   The stringified version of the object
   */
  toJson(object) {
    return Stringify(object);
  }

  /**
   * Deletes the cache for user requests
   */
  clearUserCache() {
    this.localStorageGetKeys().forEach(cacheKey => {
      if (cacheKey.match(/^[\w-.]*[.]alpUserData$/)) {
        this.localStorageRemoveItem(cacheKey);
      }
    });
  }

  /**
   * Deletes the cache for app requests
   */
  clearAppCache() {
    this.localStorageGetKeys().forEach(cacheKey => {
      if (cacheKey.match(/^[\w-.]*[.]alpAppData$/)) {
        this.localStorageRemoveItem(cacheKey);
      }
    });
  }

  /**
   * Stores the userId in cache for future comparisons to see if the user has changed
   *
   * @param {number} userId
   *   The numeric ID of the user
   */
  cacheUser(user) {
    this.localStorageSetItem('User.' + State.get('apiKey') + Constants.CACHE_KEY.USER, user);
  }

  /**
   * Stores the learnerId in cache to be loaded when the app is initialized
   *
   * @param {number} userId
   *   The numeric ID of the learner
   */
  cacheLearnerId(learnerId) {
    this.localStorageSetItem('LearnerId.' + State.get('apiKey') + Constants.CACHE_KEY.USER, learnerId);
  }

  /**
   * Stores the singleton learner flag in cache to be loaded when the app is initialized
   * This property determines if setUser has been called when authMode is set to client
   *
   * @param {bool} singletonLearnerFlag
   *   The bool value of whether setUser has been called and the user is a singletonLearner user
   */
  cacheSingletonLearnerFlag(singletonLearnerFlag) {
    this.localStorageSetItem('SingletonLearnerFlag.' + State.get('apiKey') + Constants.CACHE_KEY.USER, singletonLearnerFlag);
  }

  /**
   * Stores the latent ability estimates for the given learner
   *
   * @param {array} abilityEstimates
   *   The ability estimates to process and store
   */
  cacheLatentAbilityEstimates(abilityEstimates) {
    //get learner
    const learnerId = State.get('learnerId');

    //copy abilties
    const cacheReadyAbilities = this.copyObject(abilityEstimates);

    //prepare data for cache, replacing dimension references with ID
    cacheReadyAbilities.forEach(ability => {
      ability.dimensionId = ability.dimension && ability.dimension.id;
      delete ability.dimension;
    });

    //store copy of learner abilities in local storage cache
    const cacheKey = HttpClient.getCacheKey(HttpClient.getRequestSettings('GET', Constants.ENDPOINT.ABILITY , {learnerId}));
    this.localStorageSetItem(cacheKey, cacheReadyAbilities);
  }

  /**
   * Gets the user stored in cache
   *
   * @return
   *   The cached user object or undefined
   */
  getCachedUser() {
    try {
      return this.localStorageGetItem('User.' + State.get('apiKey') + Constants.CACHE_KEY.USER);
    } catch(e) {}
  }

  /**
   * Gets the learnerId stored in cache
   *
   * @return
   *   The cachedlearnerId or undefined
   */
  getCachedLearnerId() {
    try {
      return this.localStorageGetItem('LearnerId.' + State.get('apiKey') + Constants.CACHE_KEY.USER);
    } catch(e) {}
  }

  /**
   * Gets the singletonLearner flag stored in cache
   * This property determines if setUser has been called when authMode is set to client
   *
   * @return
   *   The bool value of the singletonLearnerFlag
   */
  getCachedSingletonLearnerFlag() {
    try {
      return this.localStorageGetItem('SingletonLearnerFlag.' + State.get('apiKey') +  Constants.CACHE_KEY.USER);
    } catch(e) {
      //since singleton learner flag gets set to false by setUser, need to default to true since singleton users are when setUser is not called
      return true;
    }
  }

}

export default new KidaptiveSdkUtils();
