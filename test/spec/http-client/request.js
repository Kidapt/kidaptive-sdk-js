'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import KidaptiveError from '../../../src/error';
import HttpClient from '../../../src/http-client';
import State from '../../../src/state';
import Utils from '../../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('request', () => {

    let server;

    const noCacheOptions = {noCache: true};
    const requestData = {boolean: false, number: 2, string: 'b', array:[1,2]};
    const requestQueryString = 'boolean=false&number=2&string=b&array=1&array=2'
    const responseData = {boolean: true, number: 1, string: "a", array:[]};

    before(() => {
      server = Sinon.fakeServer.create()
    });

    beforeEach(() => {
      server.resetHistory();
      server.respondImmediately = true;
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(responseData)]);
      TestUtils.resetStateAndCache();
      TestUtils.setState({
        apiKey: TestConstants.defaultApiKey,
        options: {environment: 'dev'}
      });
    });

    after(() => {
      TestUtils.resetStateAndCache();
      server.restore();
    });

    describe('Get', () => {

      it('Development GET', () => {
        return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
          Should(server.requests).length(1);
          const request = server.requests[0];
          Should(TestUtils.parseUrl(request.url).url).startWith(Constants.HOST.DEV).endWith(TestConstants.defaultEndpoint);
          Should(TestUtils.parseUrl(request.url).query).equal(requestQueryString);
          Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
          Should(request.withCredentials).equal(false);
          Should(request.method).equal('GET');
          Should(request.requestBody).equal(null);
          Should(response).deepEqual(responseData);
        });
      });

      it('Production GET', () => {
        TestUtils.setStateOptions({
          environment: 'prod'
        });
        return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
          Should(server.requests).length(1);
          const request = server.requests[0];
          Should(TestUtils.parseUrl(request.url).url).startWith(Constants.HOST.PROD).endWith(TestConstants.defaultEndpoint);
          Should(TestUtils.parseUrl(request.url).query).equal(requestQueryString);
          Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
          Should(request.withCredentials).equal(false);
          Should(request.method).equal('GET');
          Should(request.requestBody).equal(null);
          Should(response).deepEqual(responseData);
        });
      });

      it('Custom GET', () => {
        TestUtils.setStateOptions({
          baseUrl: TestConstants.customBaseUrl,
          environment: 'custom'
        });
        return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
          Should(server.requests).length(1);
          const request = server.requests[0];
          Should(TestUtils.parseUrl(request.url).url).startWith(TestConstants.customBaseUrl).endWith(TestConstants.defaultEndpoint);
          Should(TestUtils.parseUrl(request.url).query).equal(requestQueryString);
          Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
          Should(request.withCredentials).equal(false);
          Should(request.method).equal('GET');
          Should(request.requestBody).equal(null);
          Should(response).deepEqual(responseData);
        });
      });

    }); //END Get

    describe('Post', () => {

      it('Development POST', () => {
        return Should(HttpClient.request('POST', TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
          Should(server.requests).length(1);
          const request = server.requests[0];
          Should(TestUtils.parseUrl(request.url).url).startWith(Constants.HOST.DEV).endWith(TestConstants.defaultEndpoint);
          Should(TestUtils.parseUrl(request.url).query).equal(undefined);
          Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
          Should(request.requestHeaders['Content-Type']).startWith('application/json');
          Should(request.withCredentials).equal(false);
          Should(request.method).equal('POST');
          Should(request.requestBody).equal(JSON.stringify(requestData));
          Should(response).deepEqual(responseData);
        });
      });

      it('Production POST', () => {
        TestUtils.setStateOptions({
          environment: 'prod'
        });
        return Should(HttpClient.request('POST', TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
          Should(server.requests).length(1);
          const request = server.requests[0];
          Should(TestUtils.parseUrl(request.url).url).startWith(Constants.HOST.PROD).endWith(TestConstants.defaultEndpoint);
          Should(TestUtils.parseUrl(request.url).query).equal(undefined);
          Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
          Should(request.requestHeaders['Content-Type']).startWith('application/json');
          Should(request.withCredentials).equal(false);
          Should(request.method).equal('POST');
          Should(request.requestBody).equal(JSON.stringify(requestData));
          Should(response).deepEqual(responseData);
        });
      });

      it('Custom POST', () => {
        TestUtils.setStateOptions({
          baseUrl: TestConstants.customBaseUrl,
          environment: 'custom'
        });
        return Should(HttpClient.request('POST', TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
          Should(server.requests).length(1);
          const request = server.requests[0];
          Should(TestUtils.parseUrl(request.url).url).startWith(TestConstants.customBaseUrl).endWith(TestConstants.defaultEndpoint);
          Should(TestUtils.parseUrl(request.url).query).equal(undefined);
          Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
          Should(request.requestHeaders['Content-Type']).startWith('application/json');
          Should(request.withCredentials).equal(false);
          Should(request.method).equal('POST');
          Should(request.requestBody).equal(JSON.stringify(requestData));
          Should(response).deepEqual(responseData);
        });
      });

    }); //END Post

    describe('Errors', () => {

      it('Timeout', () => {
        server.respondWith([0, {}, '']);
        return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
          Should(server.requests).length(1);
          Should(error.message).startWith('KidaptiveError (' + KidaptiveError.ERROR_CODES.GENERIC_ERROR + ')');
        });
      });

      it('Bad Request', () => {
        server.respondWith([400, {}, '']);
        return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
          Should(server.requests).length(1);
          Should(error.message).startWith('KidaptiveError (' + KidaptiveError.ERROR_CODES.INVALID_PARAMETER + ')');
        });
      });

      it('Unauthorized', () => {
        server.respondWith([401, {}, '']);
        return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
          Should(server.requests).length(1);
          Should(error.message).startWith('KidaptiveError (' + KidaptiveError.ERROR_CODES.API_KEY_ERROR + ')');
        });
      });

      it('Internal Server Error', () => {
        server.respondWith([500, {}, '']);
        return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
          Should(server.requests).length(1);
          Should(error.message).startWith('KidaptiveError (' + KidaptiveError.ERROR_CODES.WEB_API_ERROR + ')');
        });
      });

      it('Bad Error Response', () => {
        server.respondWith([400, {'Content-Type': 'application/json'}, 'This is not JSON!']);
        return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
          Should(server.requests).length(1);
          Should(error.message).startWith('KidaptiveError (' + KidaptiveError.ERROR_CODES.INVALID_PARAMETER + ')');
          Should(error.message).endWith('Cannot parse response');
        });
      });

      it('Bad OK Response', () => {
        server.respondWith([200, {'Content-Type': 'application/json'}, 'This is not JSON!']);
        return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
          Should(server.requests).length(1);
          Should(error.message).startWith('KidaptiveError (' + KidaptiveError.ERROR_CODES.GENERIC_ERROR + ')');
          Should(error.message).endWith('Cannot parse response');
        });
      });

      it('Bad Timeout Response', () => {
        server.respondWith([0, {'Content-Type': 'application/json'}, 'This is not JSON!']);
        return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
          Should(server.requests).length(1);
          Should(error.message).startWith('KidaptiveError (' + KidaptiveError.ERROR_CODES.GENERIC_ERROR + ')');
          Should(error.message).not.endWith('Cannot parse response');
        });
      });

    }); //END Errors

    describe('Cache', () => {

      let spyLocalStorageSetItem;
      let spyLocalStorageGetItem;

      const cachedResponse = 'Cached data to be served';
      const appEndpoint = Constants.ENDPOINT[Utils.findItem(Object.keys(Constants.ENDPOINT), endpointKey => (Constants.USER_ENDPOINTS.indexOf(endpointKey) === -1))];
      const userEndpoint = Constants.ENDPOINT[Constants.USER_ENDPOINTS[0]];

      before(() => {
        spyLocalStorageSetItem = Sinon.spy(Utils, 'localStorageSetItem');
        spyLocalStorageGetItem = Sinon.spy(Utils, 'localStorageGetItem');
      });

      beforeEach(() => {
        spyLocalStorageSetItem.resetHistory();
        spyLocalStorageGetItem.resetHistory();
      });

      after(() => {
        spyLocalStorageSetItem.restore();
        spyLocalStorageGetItem.restore();
      });

      describe('Caching implementation', () => {

        it('sets local storage', function() {
          const settings = HttpClient.getRequestSettings('GET', TestConstants.defaultEndpoint, requestData);
          const cacheKey = HttpClient.getCacheKey(settings);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).resolved().then(() => {
            Should(spyLocalStorageSetItem.callCount).equal(1);
            const keys = Utils.localStorageGetKeys();
            Should(keys.length).equal(1);
            const key = keys[0];
            Should(key).equal(cacheKey);
            Should(Utils.localStorageGetItem(cacheKey)).deepEqual(responseData);
          });
        });

        it('gets local storage', () => {
          server.respondWith([0, {}, '']);
          const settings = HttpClient.getRequestSettings('GET', TestConstants.defaultEndpoint, requestData);
          const cacheKey = HttpClient.getCacheKey(settings);
          Utils.localStorageSetItem(cacheKey, cachedResponse);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).resolved().then(result => {
            Should(spyLocalStorageGetItem.callCount).equal(1);
            Should(result).deepEqual(cachedResponse);
          });
        });

      }); //END Caching implementation

      describe('no-cache option', () => {

        it('no-cache option prevents storing cache', () => {
          const settings = HttpClient.getRequestSettings('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions);
          const cacheKey = HttpClient.getCacheKey(settings);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(() => {
            Should(spyLocalStorageSetItem.callCount).equal(0);
            Should(Utils.localStorageGetKeys().length).equal(0);
            Should.throws(() => { 
              Utils.localStorageGetItem(cacheKey);
            }, Error);
          });
        });


        it('no-cache option does not prevent retrieving cache', () => {
          server.respondWith([0, {}, '']);
          const settings = HttpClient.getRequestSettings('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions);
          const cacheKey = HttpClient.getCacheKey(settings);
          Utils.localStorageSetItem(cacheKey, cachedResponse);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(result => {
            Should(spyLocalStorageGetItem.callCount).equal(1);
            Should(result).deepEqual(cachedResponse);
          });
        });

      }); //END no-cache option

      describe('Cache works for POST/GET and App/User endpoints', () => {

        it('POST app endpoint', () => {
          server.respondWith([0, {}, '']);
          const settings = HttpClient.getRequestSettings('POST', appEndpoint, requestData);
          const cacheKey = HttpClient.getCacheKey(settings);
          Utils.localStorageSetItem(cacheKey, cachedResponse);
          return Should(HttpClient.request('POST', appEndpoint, requestData)).resolved().then(result => {
            Should(result).deepEqual(cachedResponse);
          });
        });

        it('POST user endpoint', () => {
          server.respondWith([0, {}, '']);
          const settings = HttpClient.getRequestSettings('POST', userEndpoint, requestData);
          const cacheKey = HttpClient.getCacheKey(settings);
          Utils.localStorageSetItem(cacheKey, cachedResponse);
          return Should(HttpClient.request('POST', userEndpoint, requestData)).resolved().then(result => {
            Should(result).deepEqual(cachedResponse);
          });
        });

        it('GET app endpoint', () => {
          server.respondWith([0, {}, '']);
          const settings = HttpClient.getRequestSettings('GET', appEndpoint, requestData);
          const cacheKey = HttpClient.getCacheKey(settings);
          Utils.localStorageSetItem(cacheKey, cachedResponse);
          return Should(HttpClient.request('GET', appEndpoint, requestData)).resolved().then(result => {
            Should(result).deepEqual(cachedResponse);
          });
        });

        it('GET user endpoint', () => {
          server.respondWith([0, {}, '']);
          const settings = HttpClient.getRequestSettings('GET', userEndpoint, requestData);
          const cacheKey = HttpClient.getCacheKey(settings);
          Utils.localStorageSetItem(cacheKey, cachedResponse);
          return Should(HttpClient.request('GET', userEndpoint, requestData)).resolved().then(result => {
            Should(result).deepEqual(cachedResponse);
          });
        });

      }); //END Cache works for POST/GET and App/User endpoints


      describe('Cache set when no errors', () => {

        let settings;
        let cacheKey;

        beforeEach(() => {
          settings = HttpClient.getRequestSettings('GET', TestConstants.defaultEndpoint, requestData);
          cacheKey = HttpClient.getCacheKey(settings);
        });

        it('status 0 does not set cache', () => {
          server.respondWith([0, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected().then(result => {
            Should.throws(() => { 
              Utils.localStorageGetItem(cacheKey);
            }, Error);
          });
        });

        it('status 200 sets cache', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(responseData)]);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).resolved().then(result => {
            Should(Utils.localStorageGetItem(cacheKey)).deepEqual(responseData);
            Should(Utils.localStorageGetItem(cacheKey)).deepEqual(result);
          });
        });

        it('status 200 invalid JSON does not set cache', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, 'This is not JSON!']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected().then(result => {
            Should.throws(() => { 
              Utils.localStorageGetItem(cacheKey);
            }, Error);
          });
        });

        it('status 300 does not set cache', () => {
          server.respondWith([300, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected().then(result => {
            Should.throws(() => { 
              Utils.localStorageGetItem(cacheKey);
            }, Error);
          });
        });

        it('status 400 does not set cache', () => {
          server.respondWith([400, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected().then(result => {
            Should.throws(() => { 
              Utils.localStorageGetItem(appCacheKey);
            }, Error);
          });
        });

        it('status 401 does not set cache', () => {
          server.respondWith([401, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected().then(result => {
            Should.throws(() => { 
              Utils.localStorageGetItem(cacheKey);
            }, Error);
          });
        });

        it('status 500 does not set cache', () => {
          server.respondWith([500, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected().then(result => {
            Should.throws(() => { 
              Utils.localStorageGetItem(cacheKey);
            }, Error);
          });
        });

      });

      describe('Cache served', () => {

        const cachedResponse = 'Cached data to be served';
        let settings;
        let cacheKey;

        beforeEach(() => {
          settings = HttpClient.getRequestSettings('GET', TestConstants.defaultEndpoint, requestData);
          cacheKey = HttpClient.getCacheKey(settings);
          Utils.localStorageSetItem(cacheKey, cachedResponse);
        });

        it('status 0 resolves to cache', () => {
          server.respondWith([0, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).resolved().then(result => {
            Should(result).deepEqual(cachedResponse);
          });
        });

        it('status 200 resolves to response', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(responseData)]);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).resolved().then(result => {
            Should(result).deepEqual(responseData);
          });
        });

        it('status 200 invalid JSON resolves to cache', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, 'This is not JSON!']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).resolved().then(result => {
            Should(result).deepEqual(cachedResponse);
          });
        });

        it('status 300 rejects', () => {
          server.respondWith([300, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected();
        });

        it('status 400 rejects', () => {
          server.respondWith([400, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected();
        });

        it('status 401 rejects', () => {
          server.respondWith([401, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected();
        });

        it('status 500 rejects', () => {
          server.respondWith([500, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected();
        });

      }); //END Cache served

      describe('Cache item cleared', () => {

        const cachedResponse = 'Cached data to be served';
        let settings;
        let cacheKey;

        beforeEach(() => {
          settings = HttpClient.getRequestSettings('GET', TestConstants.defaultEndpoint, requestData);
          cacheKey = HttpClient.getCacheKey(settings);
          Utils.localStorageSetItem(cacheKey, cachedResponse);
        });

        it('status 0 leaves cache in place', () => {
          server.respondWith([0, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).resolved().then(result => {
            Should(Utils.localStorageGetItem(cacheKey)).deepEqual(cachedResponse);
          });
        });

        it('status 200 replaces cache', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(responseData)]);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).resolved().then(result => {
            Should(Utils.localStorageGetItem(cacheKey)).deepEqual(responseData);
          });
        });

        it('status 200 with invalid JSON leaves cache in place', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, 'This is not JSON!']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).resolved().then(result => {
            Should(Utils.localStorageGetItem(cacheKey)).deepEqual(cachedResponse);
          });
        });

        it('status 300 clears cache item', () => {
          server.respondWith([300, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected().then(result => {
            Should.throws(() => { 
              Utils.localStorageGetItem(cacheKey);
            }, Error);
          });
        });

        it('status 400 clears cache item', () => {
          server.respondWith([400, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected().then(result => {
            Should.throws(() => { 
              Utils.localStorageGetItem(cacheKey);
            }, Error);
          });
        });

        it('status 401 clears cache item', () => {
          server.respondWith([401, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected().then(result => {
            Should.throws(() => { 
              Utils.localStorageGetItem(cacheKey);
            }, Error);
          });
        });

        it('status 500 clears cache item', () => {
          server.respondWith([500, {}, '']);
          return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData)).rejected().then(result => {
            Should.throws(() => { 
              Utils.localStorageGetItem(cacheKey);
            }, Error);
          });
        });

      }); //END Cache item cleared

      describe('App cache and user cache cleared', () => {

        let spyClearAppCache;
        let spyClearUserCache;

        before(() => {
          spyClearAppCache = Sinon.spy(Utils, 'clearAppCache');
          spyClearUserCache = Sinon.spy(Utils, 'clearUserCache');
        });

        beforeEach(() => {
          spyClearAppCache.resetHistory();
          spyClearUserCache.resetHistory();
        });

        after(() => {
          spyClearAppCache.restore();
          spyClearUserCache.restore();
        });

        it('app endpoint status 0 does not clear app or user cache', () => {
          server.respondWith([0, {}, '']);
          return Should(HttpClient.request('GET', appEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('user endpoint status 0 does not clear app or user cache', () => {
          server.respondWith([0, {}, '']);
          return Should(HttpClient.request('GET', userEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('app endpoint status 200 does not clear app or user cache', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(responseData)]);
          return Should(HttpClient.request('GET', appEndpoint, requestData)).resolved().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('user endpoint status 200 does not clear app or user cache', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(responseData)]);
          return Should(HttpClient.request('GET', userEndpoint, requestData)).resolved().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('app endpoint status 200 with invalid JSON does not clear app or user cache', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, 'This is not JSON!']);
          return Should(HttpClient.request('GET', appEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('user endpoint status 200 with invalid JSON does not clear app or user cache', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, 'This is not JSON!']);
          return Should(HttpClient.request('GET', userEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('app endpoint status 300 does not clear app or user cache', () => {
          server.respondWith([300, {}, '']);
          return Should(HttpClient.request('GET', appEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('user endpoint status 300 does not clear app or user cache', () => {
          server.respondWith([300, {}, '']);
          return Should(HttpClient.request('GET', userEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('app endpoint status 400 does not clear app or user cache', () => {
          server.respondWith([400, {}, '']);
          return Should(HttpClient.request('GET', appEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('user endpoint status 400 does not clear app or user cache', () => {
          server.respondWith([400, {}, '']);
          return Should(HttpClient.request('GET', userEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('app endpoint status 401 clears app or user cache', () => {
          server.respondWith([401, {}, '']);
          return Should(HttpClient.request('GET', appEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(1);
            Should(spyClearUserCache.callCount).equal(1);
          });
        });

        it('user endpoint status 401 does not clear app cache but clears user cache', () => {
          server.respondWith([401, {}, '']);
          return Should(HttpClient.request('GET', userEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(1);
          });
        });

        it('app endpoint status 403 does not clear app or user cache', () => {
          server.respondWith([403, {}, '']);
          return Should(HttpClient.request('GET', appEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('user endpoint status 403 does not clear app or user cache', () => {
          server.respondWith([403, {}, '']);
          return Should(HttpClient.request('GET', userEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('app endpoint status 500 does not clear app or user cache', () => {
          server.respondWith([500, {}, '']);
          return Should(HttpClient.request('GET', appEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

        it('user endpoint status 500 does not clear app or user cache', () => {
          server.respondWith([500, {}, '']);
          return Should(HttpClient.request('GET', userEndpoint, requestData)).rejected().then(result => {
            Should(spyClearAppCache.callCount).equal(0);
            Should(spyClearUserCache.callCount).equal(0);
          });
        });

      }); //END App cache and user cache cleared

    }); //END Cache

  }); //END request

}; //END export
