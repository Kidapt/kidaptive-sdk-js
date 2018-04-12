import Constants from './constants';
import Error from './error';
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
   * Sets a property value in local storage
   * 
   * @param string property
   *   The target property to set
   *
   * @param {*} value
   *   The value to set for the target property
   */
  localStorageSetItem(property, value) {
    try {
      localStorage.setItem(property, JSON.stringify(value));
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
}

export default new KidaptiveSdkUtils();
