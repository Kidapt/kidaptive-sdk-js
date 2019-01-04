'use strict';
import GetCacheKey from './get-cache-key';
import GetRequestSettings from './get-request-settings';
import Request from './request';

export default () => {

  describe('HTTP Client', () => {

    GetRequestSettings();
    GetCacheKey();
    Request();

  }); //END HTTP Client

}; //END export
