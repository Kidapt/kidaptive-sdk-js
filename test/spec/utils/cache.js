'use strict';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('Cache', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('Clear Cache', () => {

      const user1Key = 'user1' + Constants.CACHE_KEY.USER;
      const user2Key = 'user2' + Constants.CACHE_KEY.USER;
      const app1Key = 'app1' + Constants.CACHE_KEY.APP;
      const app2Key = 'app2' + Constants.CACHE_KEY.APP;
      const user1Value = true;
      const user2Value = 100;
      const app1Value = 200;
      const app2Value = 'some string';

      beforeEach(() => {
        Utils.localStorageSetItem(user1Key, user1Value);
        Utils.localStorageSetItem(user2Key, user2Value);
        Utils.localStorageSetItem(app1Key, app1Value);
        Utils.localStorageSetItem(app2Key, app2Value);
      });

      it('clearUserCache removes user cache keys', () => {
        Should(Utils.localStorageGetItem(user1Key)).equal(user1Value);
        Should(Utils.localStorageGetItem(user2Key)).equal(user2Value);
        Utils.clearUserCache();
        Should.throws(() => { 
          Utils.localStorageGetItem(user1Key);
        }, Error);
        Should.throws(() => { 
          Utils.localStorageGetItem(user2Key);
        }, Error);
      });

      it('clearUserCache does not remove app cache keys', () => {
        Should(Utils.localStorageGetItem(app1Key)).equal(app1Value);
        Should(Utils.localStorageGetItem(app2Key)).equal(app2Value);
        Utils.clearUserCache();
        Should(Utils.localStorageGetItem(app1Key)).equal(app1Value);
        Should(Utils.localStorageGetItem(app2Key)).equal(app2Value);
      });

      it('clearAppCache removes app cache keys', () => {
        Should(Utils.localStorageGetItem(app1Key)).equal(app1Value);
        Should(Utils.localStorageGetItem(app2Key)).equal(app2Value);
        Utils.clearAppCache();
        Should.throws(() => { 
          Utils.localStorageGetItem(app1Key);
        }, Error);
        Should.throws(() => { 
          Utils.localStorageGetItem(app2Key);
        }, Error);
      });

      it('clearAppCache does not remove user cache keys', () => {
        Should(Utils.localStorageGetItem(user1Key)).equal(user1Value);
        Should(Utils.localStorageGetItem(user2Key)).equal(user2Value);
        Utils.clearAppCache();
        Should(Utils.localStorageGetItem(user1Key)).equal(user1Value);
        Should(Utils.localStorageGetItem(user2Key)).equal(user2Value);
      });

    }); //END Clear Cache

    describe('Set Cache', () => {
      const testApiKey = 'testApiKey';
      const userKey = 'User.' + testApiKey + Constants.CACHE_KEY.USER;
      const learnerIdKey = 'LearnerId.' + testApiKey + Constants.CACHE_KEY.USER;
      const singletonLearnerFlagKey = 'SingletonLearnerFlag.' + testApiKey + Constants.CACHE_KEY.USER;

      beforeEach(() => {
        TestUtils.setState({
          apiKey: testApiKey,
          user: {apiKey: 'thisKeyShouldNotBeUsed'}
        });
      });

      it('cacheUser caches user with api key and user cache key flag', () => {
        const user = {id: 1, name: 'user name', learners: [{id: 2, name: 'learner name'}]};
        Utils.cacheUser(user);
        Should(Utils.localStorageGetItem(userKey)).deepEqual(user);
      });

      it('cacheLearnerId caches learner id with api key and user cache key flag', () => {
        const learnerId = 100;
        Utils.cacheLearnerId(100);
        Should(Utils.localStorageGetItem(learnerIdKey)).equal(learnerId);
      });

      it('cacheSingletonLearnerFlag caches flag with api key and user cache key flag', () => {
        const flag = false;
        Utils.cacheSingletonLearnerFlag(false);
        Should(Utils.localStorageGetItem(singletonLearnerFlagKey)).equal(flag);
      });

    }); //END Set Cache

    describe('Get Cache', () => {

      it('getCachedUser gets the user set from cacheUser', () => {
        const user = {id: 1, name: 'user name', learners: [{id: 2, name: 'learner name'}]};
        Utils.cacheUser(user);
        Should(Utils.getCachedUser()).deepEqual(user);
      });

      it('getCachedUser defaults to undefined when no cache item present', () => {
        Should(Utils.getCachedUser()).equal(undefined);
      });

      it('getCachedLearnerId gets the user set from cacheLearnerId', () => {
        const learnerId = 100;
        Utils.cacheLearnerId(100);
        Should(Utils.getCachedLearnerId()).equal(learnerId);
      });

      it('getCachedLearnerId defaults to undefined when no cache item present', () => {
        Should(Utils.getCachedLearnerId()).equal(undefined);
      });

      it('getCachedSingletonLearnerFlag gets the flag set from cacheSingletonLearnerFlag', () => {
        const flag = false;
        Utils.cacheSingletonLearnerFlag(false);
        Should(Utils.getCachedSingletonLearnerFlag()).equal(flag);
      });

      it('getCachedSingletonLearnerFlag defaults to true when no cache item present', () => {
        Should(Utils.getCachedSingletonLearnerFlag()).equal(true);
      });

    }); //END Get Cache

  }); //END Cache

}; //END export
