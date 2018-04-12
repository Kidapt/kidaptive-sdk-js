'use strict';
import Constants from '../../src/constants';
import Utils from '../../src/utils';
import Should from 'should';

describe('KidaptiveSdk Constants Unit Tests', () => {
  it('Constants is object', () => {
    Should(Constants).Object();
  });
  it('Constants.DEFAULT is object', () => {
    Should(Constants.DEFAULT).Object();
  });
  it('Constants.ENDPOINT is object', () => {
    Should(Constants.ENDPOINT).Object();
  });
  it('Constants.ENDPOINT.* are strings', () => {
    Object.keys(Constants.ENDPOINT).forEach(key => {
      Should(Constants.ENDPOINT[key]).String();
    });
  });
  it('Constants.HOST is object', () => {
    Should(Constants.HOST).Object();
  });
  it('Constants.HOST.* are strings', () => {
    Object.keys(Constants.HOST).forEach(key => {
      Should(Constants.HOST[key]).String();
    });
  });
  it('Constants.USER_ENDPOINTS is array', () => {
    Should(Constants.USER_ENDPOINTS).Array();
  });
  it('Constants.USER_ENDPOINTS[*] are strings', () => {
    Constants.USER_ENDPOINTS.forEach(item => {
      Should(item).String();
    });
  });
});
