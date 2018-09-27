'use strict';
import State from '../../src/state';
import Utils from '../../src/utils';
import Q from 'q';
import Should from 'should';
import Sinon from 'sinon';

const createDefer = () => {
  return Q.defer();
};

const createPromiseChain = (promises) => {
  let chain;
  for (let i = 0; i < promises.length; i++) {
    chain = chain ? chain.then(() => Q.fcall(promises[i])) : Q.fcall(promises[i]);
  }
  return chain;
};

const parseUrl = url => {
  const parts = url.split('?');
  return {
    url: parts[0],
    query: parts[1] !== undefined ? parts[1] : undefined
  };
}

const resetStateAndCache = () => {
  State.clear();
  localStorage.clear();
};

const setState = (newState) => {
  Object.keys(newState).forEach(key => {
    State.set(key, newState[key]);
  });
};

const setStateOptions = (newOptions) => {
  const options = State.get('options') || {};
  Object.keys(newOptions).forEach(key => {
    options[key] = newOptions[key];
  });
  State.set('options', options);
};

const propertyTypes = {
  array: [[]],
  bool: [true, false],
  function: [() => {}],
  object: [{}],
  number: [-100, 0, 100],
  string: ['', 'Test String', '50']
};

const stringifyValue = (value) => {
  return JSON.stringify(value, (name, value) => {
    if (Utils.isFunction(value)) {
      return '() => {}';
    }
    return value;
  });
};

const innerValidateProperty = (functionCall, expectedType, required, acceptableValues, unacceptableValues, skipTypes, isPromise) => {
  const positiveString = isPromise ? ' should resolve' : ' should not throw error';
  const negativeString = isPromise ? ' should reject' : ' should throw error';

  if (required) {
    it('Value null' + negativeString, () => {
      if (isPromise) {
        return Should(functionCall(null)).rejected();
      } else {
        Should.throws(() => { 
          functionCall(null);
        }, Error);
      }
    });
    it('Value undefined' + negativeString, () => {
      if (isPromise) {
        return Should(functionCall(undefined)).rejected();
      } else {
        Should.throws(() => { 
          functionCall(undefined);
        }, Error);
      }
    });
  } else {
    it('Value null' + positiveString, () => {
      if (isPromise) {
        return Should(functionCall(null)).resolved();
      } else {
        Should.doesNotThrow(() => { 
          functionCall(null);
        }, Error);
      }
    });
    it('Value undefined' + positiveString, () => {
      if (isPromise) {
        return Should(functionCall(undefined)).resolved();
      } else {
        Should.doesNotThrow(() => { 
          functionCall(undefined);
        }, Error);
      }
    });
  }

  Object.keys(propertyTypes).forEach(type => {
    //skip types defined in skip types (for dual type validation)
    if (skipTypes && skipTypes.indexOf(type) !== -1) {
      return;
    };
    //assign values from property type map
    let values = propertyTypes[type];
    if (type === expectedType) {
      //override values that are used if only certain values are acceptable
      if (acceptableValues) {
        values = acceptableValues;
      }
      //since there are only a few acceptable values, also test unacceptable values
      if (unacceptableValues) {
        unacceptableValues.forEach(value => {
          it('Value ' + stringifyValue(value) + ' of type ' + type + negativeString, () => {
            if (isPromise) {
              return Should(functionCall(value)).rejected();
            } else {
              Should.throws(() => { 
                functionCall(value);
              }, Error);
            }
          });
        });
      }
    }
    //check all values for all types
    values.forEach(value => {
      if (type === expectedType) {
        it('Value ' + stringifyValue(value) + ' of type ' + type + positiveString, () => {
          if (isPromise) {
            return Should(functionCall(value)).resolved();
          } else {
            Should.doesNotThrow(() => { 
              functionCall(value);
            }, Error);
          }
        });
      } else {
        it('Value ' + stringifyValue(value) + ' of type ' + type + negativeString, () => {
          if (isPromise) {
            return Should(functionCall(value)).rejected();
          } else {
            Should.throws(() => { 
              functionCall(value);
            }, Error);
          }
        });
      }
    });
  });
};

const innerValidatePropertyNotSet = (functionCall, usualType, isPromise) => {
  const positiveString = isPromise ? ' should resolve' : ' should not throw error';
  const negativeString = isPromise ? ' should reject' : ' should throw error';

  let values = propertyTypes[usualType];

  values.forEach(value => {
    it('Value ' + stringifyValue(value, usualType) + ' of type ' + usualType + negativeString, () => {
      if (isPromise) {
        return Should(functionCall(value)).rejected();
      } else {
        Should.throws(() => { 
          functionCall(value);
        }, Error);
      }
    });
  });

  it('Value null' + positiveString, () => {
    if (isPromise) {
      return Should(functionCall(null)).resolved();
    } else {
      Should.doesNotThrow(() => { 
        functionCall(null);
      }, Error);
    }
  });
  it('Value undefined' + positiveString, () => {
    if (isPromise) {
      return Should(functionCall(undefined)).resolved();
    } else {
      Should.doesNotThrow(() => { 
        functionCall(undefined);
      }, Error);
    }
  });
};


const validatePromiseProperty = (functionCall, expectedType, required, acceptableValues, unacceptableValues, skipTypes) => {
  innerValidateProperty(functionCall, expectedType, required, acceptableValues, unacceptableValues, skipTypes, true);
};

const validateProperty = (functionCall, expectedType, required, acceptableValues, unacceptableValues, skipTypes) => {
  innerValidateProperty(functionCall, expectedType, required, acceptableValues, unacceptableValues, skipTypes, false);
};

const validatePromisePropertyNotSet = (functionCall, usualType) => {
  innerValidatePropertyNotSet(functionCall, usualType, true);
};

const validatePropertyNotSet = (functionCall, usualType) => {
  innerValidatePropertyNotSet(functionCall, usualType, false);
};

const testRunner = (testCases, functionCall, resultTester) => {
  testCases.forEach(testCase => {
    const values = testCase.values;

    values.forEach(value => {
      it(testCase.name + ' with value ' + stringifyValue(value), () => {
        resultTester(functionCall(value), testCase, value);
      });
    });
  });
};

export default {
  createDefer,
  createPromiseChain,
  parseUrl,
  resetStateAndCache,
  setState,
  setStateOptions,
  testRunner,
  validatePromiseProperty,
  validateProperty,
  validatePromisePropertyNotSet,
  validatePropertyNotSet
};


