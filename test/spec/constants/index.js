'use strict';
import Constants from '../../../src/constants';
import Should from 'should';

export default () => {

  describe('Constants', () => {

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

    it('Constants.CACHE_KEY is object', () => {
      Should(Constants.CACHE_KEY).Object();
    });

    it('Constants.CACHE_KEY.* are strings', () => {
      Object.keys(Constants.CACHE_KEY).forEach(key => {
        Should(Constants.CACHE_KEY[key]).String();
      });
    });

  }); //END Constants

}; //END export
