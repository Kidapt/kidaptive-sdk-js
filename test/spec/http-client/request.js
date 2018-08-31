'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import Error from '../../../src/error';
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

    const parseUrl = url => {
      const parts = url.split('?');
      return {
        url: parts[0],
        query: parts[1] !== undefined ? parts[1] : undefined
      };
    }

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

    it('Development GET', () => {
      return Should(HttpClient.request('GET', TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(parseUrl(request.url).url).startWith(Constants.HOST.DEV).endWith(TestConstants.defaultEndpoint);
        Should(parseUrl(request.url).query).equal(requestQueryString);
        Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
        Should(request.withCredentials).equal(true);
        Should(request.method).equal(TestConstants.getMethod);
        Should(request.requestBody).equal(null);
        Should(response).deepEqual(responseData);
      });
    });

    it('Production GET', () => {
      TestUtils.setStateOptions({
        environment: 'prod'
      });
      return Should(HttpClient.request(TestConstants.getMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(parseUrl(request.url).url).startWith(Constants.HOST.PROD).endWith(TestConstants.defaultEndpoint);
        Should(parseUrl(request.url).query).equal(requestQueryString);
        Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
        Should(request.withCredentials).equal(true);
        Should(request.method).equal(TestConstants.getMethod);
        Should(request.requestBody).equal(null);
        Should(response).deepEqual(responseData);
      });
    });

    it('Custom GET', () => {
      TestUtils.setStateOptions({
        baseUrl: TestConstants.customBaseUrl,
        environment: 'custom'
      });
      return Should(HttpClient.request(TestConstants.getMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(parseUrl(request.url).url).startWith(TestConstants.customBaseUrl).endWith(TestConstants.defaultEndpoint);
        Should(parseUrl(request.url).query).equal(requestQueryString);
        Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
        Should(request.withCredentials).equal(true);
        Should(request.method).equal(TestConstants.getMethod);
        Should(request.requestBody).equal(null);
        Should(response).deepEqual(responseData);
      });
    });

    it('Development POST', () => {
      return Should(HttpClient.request(TestConstants.postMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(parseUrl(request.url).url).startWith(Constants.HOST.DEV).endWith(TestConstants.defaultEndpoint);
        Should(parseUrl(request.url).query).equal(undefined);
        Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
        Should(request.requestHeaders['Content-Type']).startWith('application/json');
        Should(request.withCredentials).equal(true);
        Should(request.method).equal(TestConstants.postMethod);
        Should(request.requestBody).equal(JSON.stringify(requestData));
        Should(response).deepEqual(responseData);
      });
    });

    it('Production POST', () => {
      TestUtils.setStateOptions({
        environment: 'prod'
      });
      return Should(HttpClient.request(TestConstants.postMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(parseUrl(request.url).url).startWith(Constants.HOST.PROD).endWith(TestConstants.defaultEndpoint);
        Should(parseUrl(request.url).query).equal(undefined);
        Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
        Should(request.requestHeaders['Content-Type']).startWith('application/json');
        Should(request.withCredentials).equal(true);
        Should(request.method).equal(TestConstants.postMethod);
        Should(request.requestBody).equal(JSON.stringify(requestData));
        Should(response).deepEqual(responseData);
      });
    });

    it('Custom POST', () => {
      TestUtils.setStateOptions({
        baseUrl: TestConstants.customBaseUrl,
        environment: 'custom'
      });
      return Should(HttpClient.request(TestConstants.postMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(parseUrl(request.url).url).startWith(TestConstants.customBaseUrl).endWith(TestConstants.defaultEndpoint);
        Should(parseUrl(request.url).query).equal(undefined);
        Should(request.requestHeaders['api-key']).equal(TestConstants.defaultApiKey);
        Should(request.requestHeaders['Content-Type']).startWith('application/json');
        Should(request.withCredentials).equal(true);
        Should(request.method).equal(TestConstants.postMethod);
        Should(request.requestBody).equal(JSON.stringify(requestData));
        Should(response).deepEqual(responseData);
      });
    });

    it('Timeout', () => {
      server.respondWith([0, {}, '']);
      return Should(HttpClient.request(TestConstants.getMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.GENERIC_ERROR + ')');
      });
    });

    it('Bad Request', () => {
      server.respondWith([400, {}, '']);
      return Should(HttpClient.request(TestConstants.getMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.INVALID_PARAMETER + ')');
      });
    });

    it('Unauthorized', () => {
      server.respondWith([401, {}, '']);
      return Should(HttpClient.request(TestConstants.getMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.API_KEY_ERROR + ')');
      });
    });

    it('Internal Server Error', () => {
      server.respondWith([500, {}, '']);
      return Should(HttpClient.request(TestConstants.getMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.WEB_API_ERROR + ')');
      });
    });

    it('Bad Error Response', () => {
      server.respondWith([400, {'Content-Type': 'application/json'}, 'This is not JSON!']);
      return Should(HttpClient.request(TestConstants.getMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.INVALID_PARAMETER + ')');
        Should(error.message).endWith('Cannot parse response');
      });
    });

    it('Bad OK Response', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, 'This is not JSON!']);
      return Should(HttpClient.request(TestConstants.getMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.GENERIC_ERROR + ')');
        Should(error.message).endWith('Cannot parse response');
      });
    });

    it('Bad Timeout Response', () => {
      server.respondWith([0, {'Content-Type': 'application/json'}, 'This is not JSON!']);
      return Should(HttpClient.request(TestConstants.getMethod, TestConstants.defaultEndpoint, requestData, noCacheOptions)).rejected().then(error => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError (' + Error.ERROR_CODES.GENERIC_ERROR + ')');
        Should(error.message).not.endWith('Cannot parse response');
      });
    });

  }); //END request

}; //END export
