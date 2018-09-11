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

const stringifyValue = (value, type) => {
  return JSON.stringify(value, (name, value) => {
    if (Utils.isFunction(value)) {
      return '() => {}';
    }
    return value;
  });
};

const validateProperty = (functionCall, expectedType, required, acceptableValues, unacceptableValues, skipTypes) => {
  if (required) {
    it('Value null should reject', () => {
      return Should(functionCall(null)).rejected();
    });
    it('Value undefined should reject', () => {
      return Should(functionCall(undefined)).rejected();
    });
  } else {
    it('Value null should resolve', () => {
      return Should(functionCall(null)).resolved();
    });
    it('Value undefined should resolve', () => {
      return Should(functionCall(undefined)).resolved();
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
          it('Value ' + stringifyValue(value, type) + ' of type ' + type + ' should reject', () => {
            return Should(functionCall(value)).rejected();
          });
        });
      }
    }
    //check all values for all types
    values.forEach(value => {
      if (type === expectedType) {
        it('Value ' + stringifyValue(value, type) + ' of type ' + type + ' should resolve', () => {
          return Should(functionCall(value)).resolved();
        });
      } else {
        it('Value ' + stringifyValue(value, type) + ' of type ' + type + ' should reject', () => {
          return Should(functionCall(value)).rejected();
        });
      }
    });
  });
};

const validatePropertyNotSet = (functionCall, usualType) => {
  let values = propertyTypes[usualType];

  values.forEach(value => {
    it('Value ' + stringifyValue(value, usualType) + ' of type ' + usualType + ' should reject', () => {
      return Should(functionCall(value)).rejected();
    });
  });

  it('Value null should resolve', () => {
    return Should(functionCall(null)).resolved();
  });
  it('Value undefined should resolve', () => {
    return Should(functionCall(undefined)).resolved();
  });
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
  resetStateAndCache,
  setState,
  setStateOptions,
  testRunner,
  validateProperty,
  validatePropertyNotSet
};


