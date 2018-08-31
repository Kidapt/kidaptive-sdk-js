'use strict';
import TestConstants from './test-constants';
import Constants from '../../../src/constants';
import HttpClient from '../../../src/http-client';
import Should from 'should';

export default () => {

  describe('getCacheKey', () => {

    it('Cache Key is String', () => {
      const settings = HttpClient.getRequestSettings(TestConstants.postMethod, '', {});
      Should(HttpClient.getCacheKey(settings)).String();
    });

    it('Stable App Cache Key', () => {
      const settings = {};
      Should(HttpClient.getCacheKey(settings)).equal('RBNvo1WzZ4oRRq0W9-hknpT7T8If536DEMBg9hyq_4o.alpAppData');
    });

    it('Stable User Cache Key', () => {
      const settings = HttpClient.getRequestSettings(TestConstants.postMethod, Constants.ENDPOINT[Constants.USER_ENDPOINTS[0]], {});
      Should(HttpClient.getCacheKey(settings)).equal('uIk9oUPnvE8cIe82-TF2SQUYtg8v3Xx8c-6wZIfldJo.alpUserData');
    });

  }); //END getCacheKey

}; //END export
