'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import KidaptiveSdk from '../../../src/index';
import LearnerManager from '../../../src/learner-manager';
import OperationManager from '../../../src/operation-manager';
import State from '../../../src/state';
import Utils from '../../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('init', () => {
    
    let options;

    beforeEach(() => {
      options = Utils.copyObject(TestConstants.completeOptions);
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
        TestUtils.validatePromiseProperty(testFunction, 'string', true);
      });

    }); //END validate apiKey

    describe('validate option', () => {

      describe('options is required and must be an object', () => {
        const testFunction = parameter => {
          return KidaptiveSdk.init(TestConstants.defaultApiKey, parameter);
        };
        TestUtils.validatePromiseProperty(testFunction, 'object', true, [TestConstants.minimumOptions]);
      });

      describe('environment is required and must be a string (dev, prod, custom)', () => {
        const testFunction = parameter => {
          options.environment = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true, ['dev', 'prod', 'custom'], ['', 'randomValue']);
      });

      describe('baseUrl is an optional string when environment is not custom', () => {
        const testFunction = parameter => {
          options.environment = 'dev';
          options.baseUrl = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', false);
      });

      describe('baseUrl is required and must be a string when environment is custom', () => {
        const testFunction = parameter => {
          options.environment = 'custom';
          options.baseUrl = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true);
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
        TestUtils.validatePromiseProperty(testFunction, 'number', false, [1, 2, 3], [0, 4]);
      });

      describe('authmode is an optional string (client, server)', () => {
        const testFunction = parameter => {
          options.authMode = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', false, ['client', 'server'], ['', 'randomValue']);
      });

      describe('version is an optional string', () => {
        const testFunction = parameter => {
          options.version = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', false);
      });

      describe('build is an optional string', () => {
        const testFunction = parameter => {
          options.version = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', false);
      });

      describe('autoFlushInterval is an optional number (>=0)', () => {
        const testFunction = parameter => {
          options.autoFlushInterval = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validatePromiseProperty(testFunction, 'number', false, [0, 0.5, 1, 1000000], [-1]);
      });

      describe('loggingLevel is an optional string (all, warn, none)', () => {
        const testFunction = parameter => {
          options.loggingLevel = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', false, ['all', 'warn', 'none'], ['', 'randomValue']);
      });

      describe('autoFlushCallback is an optional function, or array of functions', () => {
        const testFunction = parameter => {
          options.autoFlushCallback = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validatePromiseProperty(testFunction, 'array', false, [[], [() => {}]], [['randomValue'], [{}], [null]], ['function']);
        TestUtils.validatePromiseProperty(testFunction, 'function', false, undefined, undefined, ['array']);
      });

      describe('defaultHttpCache is an optional object', () => {
        const testFunction = parameter => {
          options.defaultHttpCache = parameter;
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validatePromiseProperty(testFunction, 'object', false);
      });

      describe('defaultHttpCache object values must be strings', () => {
        const testFunction = parameter => {
          options.defaultHttpCache = {someProp: parameter};
          return KidaptiveSdk.init(TestConstants.defaultApiKey, options);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true);
      });

    }); //END validate option values

    describe('validate state', () => {

      it('before init State.get("initialized") is false', () => {
        Should(State.get('initialized')).not.ok();
      });

      it('before init KidaptiveSdk.isInitialized() is false', () => {
        Should(KidaptiveSdk.isInitialized()).not.ok();
      })

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

      if('after init KidaptiveSdk.isInitialized() is true', () => {
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, TestConstants.completeOptions)).resolved().then(() => {
          return Should(KidaptiveSdk.isInitialized()).ok();
        });
      })

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

      }); //END autoFlushCallback always transformed into an array when provided

      describe('defaultHttpCache sets cache correctly', () => {

        it('Sets cache items', () => {
          const cacheKey1 = 'someCacheKey';
          const cacheKey2 = 'anotherCacheKey';
          Should.throws(() => { 
            Utils.localStorageGetItem(cacheKey1); 
          }, Error);
          Should.throws(() => { 
            Utils.localStorageGetItem(cacheKey2);
          }, Error);
          options.defaultHttpCache = {
            [cacheKey1]: '"cached value"',
            [cacheKey2]: '["value1","value2"]'
          };
          return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
            Should(Utils.localStorageGetItem(cacheKey1)).equal('cached value');
            Should(Utils.localStorageGetItem(cacheKey2)).deepEqual(['value1','value2']);
          });
        });

        it('Does not override existing cache items', () => {
          const cacheKey1 = 'someCacheKey';
          const cacheKey2 = 'anotherCacheKey';
          Utils.localStorageSetItem(cacheKey1, 'original cached value'); 
          Should(Utils.localStorageGetItem(cacheKey1)).equal('original cached value');
          Should.throws(() => { 
            Utils.localStorageGetItem(cacheKey2);
          }, Error);
          options.defaultHttpCache = {
            [cacheKey1]: '"new cached value"',
            [cacheKey2]: '["value1","value2"]'
          };
          return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
            Should(Utils.localStorageGetItem(cacheKey1)).equal('original cached value');
            Should(Utils.localStorageGetItem(cacheKey2)).deepEqual(['value1','value2']);
          });
        });

      }); //END defaultHttpCache sets cache correctly

    }); //END validate state

    describe('Restoring user and learner from cache', () => {

      it('State empty if nothing cached', () => {
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => {
          Should(State.get('user')).equal(undefined);
          Should(State.get('learnerId')).equal(undefined);
        });
      });

      it('Gets user from cache and assigns to state', () => {
        const user = {id: 1, providerId: 'userProviderId', learners: [{id: 2, providerId: 'learnerProviderId'}]};
        Utils.localStorageSetItem('User.' + TestConstants.defaultApiKey + Constants.CACHE_KEY.USER, user)
        const spyGetCache = Sinon.spy(Utils, 'getCachedUser');
        Should(spyGetCache.called).false();
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
          Should(spyGetCache.called).true();
          Should(State.get('user')).deepEqual(user);
          spyGetCache.restore();
        });
      });

      it('Gets learnerId from cache and assigns to state', () => {
        const user = {id: 1, providerId: 'userProviderId', learners: [{id: 2, providerId: 'learnerProviderId'}]};
        Utils.localStorageSetItem('User.' + TestConstants.defaultApiKey + Constants.CACHE_KEY.USER, user);
        Utils.localStorageSetItem('LearnerId.' + TestConstants.defaultApiKey + Constants.CACHE_KEY.USER, user.learners[0].id);
        const spyGetCache = Sinon.spy(Utils, 'getCachedLearnerId');
        Should(spyGetCache.called).false();
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
          Should(spyGetCache.called).true();
          Should(State.get('learnerId')).equal(2);
          spyGetCache.restore();
        });
      });

      it('For authmode client, gets singletonLearner from cache and assigns to state', () => {
        options.authMode = 'client';
        Utils.localStorageSetItem('SingletonLearnerFlag.' + TestConstants.defaultApiKey + Constants.CACHE_KEY.USER, false)
        const spyGetCache = Sinon.spy(Utils, 'getCachedSingletonLearnerFlag');
        Should(spyGetCache.called).false();
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
          Should(spyGetCache.called).true();
          Should(State.get('singletonLearner')).equal(false);
          spyGetCache.restore();
        });
      });

      it('For authmode server, singletonLearner is ignored', () => {
        options.authMode = 'server';
        const spyGetCache = Sinon.spy(Utils, 'getCachedSingletonLearnerFlag');
        Should(spyGetCache.called).false();
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
          Should(spyGetCache.called).false();
          spyGetCache.restore();
        });
      });

      it('If an active learner is set, call LearnerManager.selectActiveLearner()', () => {
        const user = {id: 1, providerId: 'userProviderId', learners: [{id: 2, providerId: 'learnerProviderId'}]};
        Utils.localStorageSetItem('User.' + TestConstants.defaultApiKey + Constants.CACHE_KEY.USER, user);
        Utils.localStorageSetItem('LearnerId.' + TestConstants.defaultApiKey + Constants.CACHE_KEY.USER, user.learners[0].id);
        const spySelectActiveLearner = Sinon.spy(LearnerManager, 'selectActiveLearner');
        Should(spySelectActiveLearner.called).false();
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
          Should(spySelectActiveLearner.called).true();
          spySelectActiveLearner.restore();
        });
      });

      it('LearnerManager.selectActiveLearner() rejection will not cause init to reject', () => {
        const user = {id: 1, providerId: 'userProviderId', learners: [{id: 2, providerId: 'learnerProviderId'}]};
        Utils.localStorageSetItem('User.' + TestConstants.defaultApiKey + Constants.CACHE_KEY.USER, user);
        Utils.localStorageSetItem('LearnerId.' + TestConstants.defaultApiKey + Constants.CACHE_KEY.USER, user.learners[0].id);
        const selectActiveLearnerStub = Sinon.stub(LearnerManager, 'selectActiveLearner').callsFake(() => {
          return OperationManager.addToQueue(() => {
            throw new Error('Random rejection error');
          });
        });
        Should(selectActiveLearnerStub.called).false();
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
          Should(selectActiveLearnerStub.called).true();
          selectActiveLearnerStub.restore();
        });
      });

      it('If no active learner, clear the learnerId, and do not call LearnerManager.selectActiveLearner()', () => {
        const user = {id: 1, providerId: 'userProviderId', learners: [{id: 2, providerId: 'learnerProviderId'}]};
        Utils.localStorageSetItem('User.' + TestConstants.defaultApiKey + Constants.CACHE_KEY.USER, user);
        Utils.localStorageSetItem('LearnerId.' + TestConstants.defaultApiKey + Constants.CACHE_KEY.USER, 999);
        const spySelectActiveLearner = Sinon.spy(LearnerManager, 'selectActiveLearner');
        Should(spySelectActiveLearner.called).false();
        return Should(KidaptiveSdk.init(TestConstants.defaultApiKey, options)).resolved().then(() => { 
          Should(spySelectActiveLearner.called).false();
          Should(State.get('user')).deepEqual(user);
          Should(State.get('learnerId')).equal(undefined);
          spySelectActiveLearner.restore();
        });
      });

    }); //END Restoring user and learner from cache

  }); //END init

}; //END export
