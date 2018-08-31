'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import HttpClient from '../../../src/http-client';
import Should from 'should';

export default () => {

  describe('getRequestSettings', () => {

    const data = 'testData';
    const endpoint = 'testEndpoint';

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('Settings is Object', () => {
      Should(HttpClient.getRequestSettings()).Object();
    });

    it('GET Settings are Correct', () => {
      const settings = HttpClient.getRequestSettings('GET', TestConstants.defaultEndpoint, data);
      Should(settings.method).equal('GET');
      Should(settings.endpoint).equal(TestConstants.defaultEndpoint);
      Should(settings.data).equal(data);
      Should(settings.contentType).equal(undefined);
    });

    it('POST Settings are Correct', () => {
      const settings = HttpClient.getRequestSettings('POST', TestConstants.defaultEndpoint, data);
      Should(settings.method).equal('POST');
      Should(settings.endpoint).equal(TestConstants.defaultEndpoint);
      Should(settings.data).equal(data);
      Should(settings.contentType).equal('application/json');
    });

    it('API Key Settings are Correct', () => {
      TestUtils.setState({
        apiKey: TestConstants.defaultApiKey
      });
      Should(HttpClient.getRequestSettings().apiKey).equal(TestConstants.defaultApiKey);
    });

    it('API Key replaced with User API Key (if defined) on User Endpoints', () => {
      TestUtils.setState({
        apiKey: TestConstants.defaultApiKey
      });
      Should(HttpClient.getRequestSettings().apiKey).equal(TestConstants.defaultApiKey);
      Should(HttpClient.getRequestSettings(
        'POST', 
        Constants.ENDPOINT[Constants.USER_ENDPOINTS[0]]
      ).apiKey).equal(TestConstants.defaultApiKey);
      TestUtils.setState({
        user: {apiKey: TestConstants.userApiKey}
      });
      Should(HttpClient.getRequestSettings().apiKey).equal(TestConstants.defaultApiKey);
      Should(HttpClient.getRequestSettings(
        'POST', 
        Constants.ENDPOINT[Constants.USER_ENDPOINTS[0]]
      ).apiKey).equal(TestConstants.userApiKey);    
    });

    it('API Key not replaced with User API Key on User Endpoints when defaultApiKey flag set', () => {
      const defaultApiKeyOption = {defaultApiKey: true};
      TestUtils.setState({
        apiKey: TestConstants.defaultApiKey,
        user: {apiKey: TestConstants.userApiKey}
      });
      Should(HttpClient.getRequestSettings(
        undefined, 
        undefined, 
        undefined, 
        defaultApiKeyOption
      ).apiKey).equal(TestConstants.defaultApiKey);
      Should(HttpClient.getRequestSettings(
        'POST', 
        Constants.ENDPOINT[Constants.USER_ENDPOINTS[0]], 
        undefined, 
        defaultApiKeyOption
      ).apiKey).equal(TestConstants.defaultApiKey);    
    });

    it('Dev Settings are Correct', () => {
      TestUtils.setStateOptions({
        environment: 'dev'
      });
      Should(HttpClient.getRequestSettings().host).equal(Constants.HOST.DEV);
    });

    it('Prod Settings are Correct', () => {
      TestUtils.setStateOptions({
        environment: 'prod'
      });
      Should(HttpClient.getRequestSettings().host).equal(Constants.HOST.PROD);
    });

    it('Custom Environment Settings are Correct', () => {
      TestUtils.setStateOptions({
        baseUrl: TestConstants.customBaseUrl,
        environment: 'custom'
      });
      Should(HttpClient.getRequestSettings().host).equal(TestConstants.customBaseUrl);
    });

    it('Base URL ignored for Prod/Dev', () => {
      TestUtils.setStateOptions({
        baseUrl: TestConstants.customBaseUrl,
        environment: 'dev'
      });
      Should(HttpClient.getRequestSettings().host).equal(Constants.HOST.DEV);
      TestUtils.setStateOptions({
        baseUrl: TestConstants.customBaseUrl,
        environment: 'prod'
      });
      Should(HttpClient.getRequestSettings().host).equal(Constants.HOST.PROD);
    });

  }); // END getRequestSettings

}; //END export
