'use strict';
import Destroy from './destroy';
import GetSdkVersion from './get-sdk-version';
import Init from './init';

export default () => {

  describe('Core', () => {

    GetSdkVersion();
    Init();
    Destroy();

  }); //END Core

}; //END export
