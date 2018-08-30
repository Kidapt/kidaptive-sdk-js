'use strict';
import State from '../src/state';
import Q from 'q';
import Should from 'should';
import Sinon from 'sinon';

const createDefer = () => {
  return Q.defer();
}

const createPromiseChain = (promises) => {
  let chain;
  for (let i = 0; i < promises.length; i++) {
    chain = chain ? chain.then(() => Q.fcall(promises[i])) : Q.fcall(promises[i]);
  }
  return chain;
}

const resetStateAndCache = () => {
  State.clear();
  localStorage.clear();
}

const setState = (newState) => {
  Object.keys(newState).forEach(key => {
    State.set(key, newState[key]);
  });
}

const setStateOptions = (newOptions) => {
  const options = State.get('options') || {};
  Object.keys(newOptions).forEach(key => {
    options[key] = newOptions[key];
  });
  State.set('options', options);
}

const propertyTypes = {
  array: [[]],
  bool: [true, false],
  function: [() => {}],
  object: [{}],
  number: [-100, 0, 100],
  string: ['', 'Test String', '50']
};

const validateProperty = (functionCall, expectedType, required, acceptableValues) => {
  if (required) {
    it('Value of null should reject', () => {
      return Should(functionCall(null)).rejected();
    });
    it('Value of undefined should reject', () => {
      return Should(functionCall(undefined)).rejected();
    });
  } else {
    it('Value of null should resolve', () => {
      return Should(functionCall(null)).resolved();
    });
    it('Value of undefined should resolve', () => {
      return Should(functionCall(undefined)).resolved();
    });
  }

  Object.keys(propertyTypes).forEach(type => {
    let values = propertyTypes[type];
    if (type === expectedType && acceptableValues) {
      values = acceptableValues;
    }
    values.forEach(value => {
      if (type === expectedType) {
        it('Value ' + value + ' of type ' + type + ' should resolve', () => {
          return Should(functionCall(value)).resolved();
        });
      } else {
        it('Value ' + value + ' of type ' + type + ' should reject', () => {
          return Should(functionCall(value)).rejected();
        });
      }
    });
  });
}

const validatePropertyNotSet = (functionCall, usualType) => {
  let values = propertyTypes[usualType];

  values.forEach(value => {
    it('Value ' + value + ' of type ' + usualType + ' should reject', () => {
      return Should(functionCall(value)).rejected();
    });
  });

  it('Value of null should resolve', () => {
    return Should(functionCall(null)).resolved();
  });
  it('Value of undefined should resolve', () => {
    return Should(functionCall(undefined)).resolved();
  });
}

export default {
  createDefer,
  createPromiseChain,
  resetStateAndCache,
  setState,
  setStateOptions,
  validateProperty,
  validatePropertyNotSet
};


