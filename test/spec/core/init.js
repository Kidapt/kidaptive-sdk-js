'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import KidaptiveSdk from '../../../src/index';
import State from '../../../src/state';
import Utils from '../../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('init', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('validate apiKey', () => {

      describe('apiKey is required and must be a string', () => {
        const testFunction = parameter => {
          return KidaptiveSdk.init(parameter, TestConstants.minimumOptions);
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      });

    }); //END validate apiKey

    describe('validate option', () => {

      let options;
      beforeEach(() => {
        options = Utils.copyObject(TestConstants.completeOptions);
      });

      describe('options is required and must be an object', () => {
        const testFunction = parameter => {
          return KidaptiveSdk.init(TestConstants.defaultApiKey, parameter);
        };
        TestUtils.validateProperty(testFunction, 'object', true, [TestConstants.minimumOptions]);
      });

      describe('environment is required and must be a string (dev, prod, custom)', () => {
        const testFunction = parameter => {
          options.environment = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validateProperty(testFunction, 'string', true, ['dev', 'prod', 'custom'], ['', 'randomValue']);
      });

      describe('baseUrl is an optional string when environment is not custom', () => {
        const testFunction = parameter => {
          options.environment = 'dev';
          options.baseUrl = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validateProperty(testFunction, 'string', false);
      });

      describe('baseUrl is required and must be a string when environment is custom', () => {
        const testFunction = parameter => {
          options.environment = 'custom';
          options.baseUrl = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      });

      describe('tier is an optional number (1, 2, 3)', () => {

        let server;

        before(() => {
          server = Sinon.fakeServer.create();
          server.respondImmediately = true;
          server.respondWith([200, {'Content-Type': 'application/json'}, '']);
        });

        after(() => {
          server.restore();
        });

        const testFunction = parameter => {
          options.tier = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validateProperty(testFunction, 'number', false, [1, 2, 3], [0, 4]);
      });

      describe('authmode is an optional string (client, server)', () => {
        const testFunction = parameter => {
          options.authMode = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validateProperty(testFunction, 'string', false, ['client', 'server'], ['', 'randomValue']);
      });

      describe('version is an optional string', () => {
        const testFunction = parameter => {
          options.version = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validateProperty(testFunction, 'string', false);
      });

      describe('build is an optional string', () => {
        const testFunction = parameter => {
          options.version = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validateProperty(testFunction, 'string', false);
      });

      describe('autoFlushInterval is an optional number (>=0)', () => {
        const testFunction = parameter => {
          options.autoFlushInterval = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validateProperty(testFunction, 'number', false, [0, 0.5, 1, 1000000], [-1]);
      });

      describe('loggingLevel is an optional string (all, warn, none)', () => {
        const testFunction = parameter => {
          options.loggingLevel = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validateProperty(testFunction, 'string', false, ['all', 'warn', 'none'], ['', 'randomValue']);
      });

      describe('autoFlushCallback is an optional function, or array of functions', () => {
        const arrayTestFunction = parameter => {
          options.autoFlushCallback = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validateProperty(arrayTestFunction, 'array', false, [[], [() => {}]], [['randomValue'], [{}], [null]], ['function']);
        const functionTestFunction = parameter => {
          options.autoFlushCallback = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validateProperty(functionTestFunction, 'function', false, undefined, undefined, ['array']);
      });

    }); //END validate option values

    describe('validate state', () => {

      it('before init State.get("initialized") is false', () => {
        Should(State.get('initialized')).not.ok();
      });

      it('promise resolved after initialization complete', () => {
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, TestConstants.completeOptions)).resolved().then(() => {
          Should(State.get('initialized')).equal(true);
        });
      });

      it('sets apiKey in state', () => {
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, TestConstants.completeOptions)).resolved().then(() => {
          Should(State.get('apiKey')).equal(TestConstants.defaultApiKey);
        });
      });

      it('sets options in state', () => {
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, TestConstants.completeOptions)).resolved().then(() => {
          Should(State.get('options')).deepEqual(TestConstants.completeOptions);
        });
      });

      it('second init call is rejected', () => {
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, TestConstants.completeOptions)).resolved().then(() => { 
          return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, TestConstants.completeOptions)).rejected();
        });
      });

      it('sets default option values', () => {
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, TestConstants.minimumOptions)).resolved().then(() => {
          const setOptions = State.get('options') || {};
          Should(setOptions.tier).equal(Constants.DEFAULT.TIER);
          Should(setOptions.authMode).equal(Constants.DEFAULT.AUTH_MODE);
          Should(setOptions.autoFlushInterval).equal(Constants.DEFAULT.AUTO_FLUSH_INTERVAL);
          Should(setOptions.loggingLevel).equal(Constants.DEFAULT.LOGGING_LEVEL);
        });
      });

      describe('autoFlushCallback always transformed into an array when provided', () => {

        let options;
        beforeEach(() => {
          options = Utils.copyObject(TestConstants.completeOptions);
        });

        it('autoFlushCallback transformed into an array when passed in as a function', () => {
          options.autoFlushCallback = () => {};
          return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
            const setOptions = State.get('options') || {};
            Should(setOptions.autoFlushCallback).Array();
          });
        });

        it('autoFlushCallback remains as an array of functions when passed in as an array of functions', () => {
          options.autoFlushCallback = [() => {}];
          return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
            const setOptions = State.get('options') || {};
            Should(setOptions.autoFlushCallback).Array();
            setOptions.autoFlushCallback.forEach(callback => {
              Should(callback).Function();
            });
          });
        });

        it('autoFlushCallback remains undefined when passed in as undefined', () => {
          options.autoFlushCallback = undefined;
          return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
            const setOptions = State.get('options') || {};
            Should(setOptions.autoFlushCallback).equal(undefined);
          });
        });

      });

    }); //END validate state

  }); //END init

}; //END export
