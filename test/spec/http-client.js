'use strict';
import Constants from '../../src/constants';
import Error from '../../src/error';
import HttpClient from '../../src/http-client';
import State from '../../src/state';
import Utils from '../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

describe('KidaptiveSdk HTTP Client Unit Tests', () => {
  describe('getRequestSettings', () => {
    it('Settings is Object', () => {
      Should(Utils.isObject(HttpClient.getRequestSettings())).equal(true);
    });
    let method = 'GET';
    const endpoint = 'testEndpoint';
    const data = 'testData';
    it('Settings are Correct', () => {
      const settings = HttpClient.getRequestSettings(method, endpoint, data);
      Should(settings.method).equal(method);
      Should(settings.endpoint).equal(endpoint);
      Should(settings.data).equal(data);
      Should(settings.contentType).equal(undefined);
    });
    it('POST Settings are Correct', () => {
      method = 'POST';
      const settings = HttpClient.getRequestSettings(method, endpoint, data);
      Should(settings.method).equal(method);
      Should(settings.endpoint).equal(endpoint);
      Should(settings.data).equal(data);
      Should(settings.contentType).equal('application/json');
    });
    it('API Key Settings are Correct', () => {
      const testApiKey = 'testApiKey';
      State.set('apiKey', testApiKey)
      Should(HttpClient.getRequestSettings().apiKey).equal(testApiKey);
      State.clear();
    });
    it('Dev Settings are Correct', () => {
      State.set('options', {environment: 'dev'});
      Should(HttpClient.getRequestSettings().host).equal(Constants.HOST.DEV);
      State.clear();
    });
    it('Prod Settings are Correct', () => {
      State.set('options', {environment: 'prod'});
      Should(HttpClient.getRequestSettings().host).equal(Constants.HOST.PROD);
      State.clear();
    });
  });

  describe('getCacheKey', () => {
    it('Cache Key is String', () => {
      const settings = HttpClient.getRequestSettings('POST', '', {});
      Should(Utils.isString(HttpClient.getCacheKey(settings))).equal(true);
    });
    it('Stable App Cache Key', () => {
      const settings = {};
      Should(HttpClient.getCacheKey(settings)).equal('RBNvo1WzZ4oRRq0W9-hknpT7T8If536DEMBg9hyq_4o.alpAppData');
    });
    it('Stable User Cache Key', () => {
      const settings = HttpClient.getRequestSettings('POST', Constants.ENDPOINT[Constants.USER_ENDPOINTS[0]], {});
      Should(HttpClient.getCacheKey(settings)).equal('EcIlKVPmmivUJTKKyRnNE_ypNeYZojk9ljs1bMdkNvc.alpUserData');
    });
  });

  describe('request', () => {
    const baseUrl = 'http://testBase/';
    const apiKey = 'testApiKey';
    const endpoint = 'testEndpoint';
    const data = {boolean: true, number: 1, string: "a", array:[]};
    const params = {boolean: false, number: 2, string: 'b', array:[1,2]};
    const query = 'boolean=false&number=2&string=b&array=1&array=2'
    let server;
    const parseUrl = url => {
      const parts = url.split('?');
      return {
      	url: parts[0],
      	query: parts[1] !== undefined ? parts[1] : undefined
      };
    }
    before(() => {
      server = Sinon.fakeServer.create()
      server.respondImmediately = true;
    });
    beforeEach(() => {
      server.resetHistory();
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(data)]);
      State.set('apiKey', apiKey);
      State.set('options', {environment: 'dev'});
    });
    afterEach(() => {
      State.clear();
    });
    after(() => {
      server.restore();
    });
    it('Development GET', () => {
      return Should(HttpClient.request('GET', endpoint, params)).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(parseUrl(request.url).url).startWith(Constants.HOST.DEV).endWith(endpoint);
        Should(parseUrl(request.url).query).equal(query);
        Should(request.requestHeaders['api-key']).equal(apiKey);
        Should(request.withCredentials).equal(true);
        Should(request.method).equal('GET');
        Should(request.requestBody).equal(null);
        Should(response).deepEqual(data);
      });
    });
    it('Production GET', () => {
      State.set('options', {environment: 'prod'});
      return Should(HttpClient.request('GET', endpoint, params)).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(parseUrl(request.url).url).startWith(Constants.HOST.PROD).endWith(endpoint);
        Should(parseUrl(request.url).query).equal(query);
        Should(request.requestHeaders['api-key']).equal(apiKey);
        Should(request.withCredentials).equal(true);
        Should(request.method).equal('GET');
        Should(request.requestBody).equal(null);
        Should(response).deepEqual(data);
      });
    });
    it('Custom GET', () => {
      State.set('options', {environment: 'custom', baseUrl: baseUrl});
      return Should(HttpClient.request('GET', endpoint, params)).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(parseUrl(request.url).url).startWith(baseUrl).endWith(endpoint);
        Should(parseUrl(request.url).query).equal(query);
        Should(request.requestHeaders['api-key']).equal(apiKey);
        Should(request.withCredentials).equal(true);
        Should(request.method).equal('GET');
        Should(request.requestBody).equal(null);
        Should(response).deepEqual(data);
      });
    });
    it('POST', () => {
      return Should(HttpClient.request('POST', endpoint, params)).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(parseUrl(request.url).url).startWith(Constants.HOST.DEV).endWith(endpoint);
        Should(parseUrl(request.url).query).equal(undefined);
        Should(request.requestHeaders['api-key']).equal(apiKey);
        Should(request.requestHeaders['Content-Type']).startWith('application/json');
        Should(request.withCredentials).equal(true);
        Should(request.method).equal('POST');
        Should(request.requestBody).equal(JSON.stringify(params));
        Should(response).deepEqual(data);
      });
    });
    it('Timeout', () => {
      server.respondWith([0, {}, '']);
      return Should(HttpClient.request('GET', endpoint, params)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.GENERIC_ERROR + ')');
      });
    });
    it('Bad Request', () => {
      server.respondWith([400, {}, '']);
      return Should(HttpClient.request('GET', endpoint, params)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.INVALID_PARAMETER + ')');
      });
    });
    it('Unauthorized', () => {
      server.respondWith([401, {}, '']);
      return Should(HttpClient.request('GET', endpoint, params)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.API_KEY_ERROR + ')');
      });
    });
    it('Internal Server Error', () => {
      server.respondWith([500, {}, '']);
      return Should(HttpClient.request('GET', endpoint, params)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.WEB_API_ERROR + ')');
      });
    });
    it('Bad Error Response', () => {
      server.respondWith([400, {'Content-Type': 'application/json'}, 'This is not JSON!']);
      return Should(HttpClient.request('GET', endpoint, params)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.INVALID_PARAMETER + ')');
        Should(error.message).endWith('Cannot parse response');
      });
    });
    it('Bad OK Response', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, 'This is not JSON!']);
      return Should(HttpClient.request('GET', endpoint, params)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.GENERIC_ERROR + ')');
        Should(error.message).endWith('Cannot parse response');
      });
    });
    it('Bad Timeout Response', () => {
      server.respondWith([0, {'Content-Type': 'application/json'}, 'This is not JSON!']);
      return Should(HttpClient.request('GET', endpoint, params)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.GENERIC_ERROR + ')');
        Should(error.message).not.endWith('Cannot parse response');
      });
    });
    //TODO FUTURE: Caching, Clearing Cache
  });
});
