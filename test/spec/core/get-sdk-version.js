'use strict';
import TestUtils from '../test-utils';
import KidaptiveSdk from '../../../src/index';
import Should from 'should';

export default () => {

  describe('getSdkVersion', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('works without init', () => {
      Should(KidaptiveSdk.getSdkVersion()).not.Promise();
      Should.doesNotThrow(() => {
        KidaptiveSdk.getSdkVersion();
      }, Error);
    });

    it('works with init', () => {
      TestUtils.setState({
        initialized: true
      });
      Should(KidaptiveSdk.getSdkVersion()).not.Promise();
      Should.doesNotThrow(() => {
        KidaptiveSdk.getSdkVersion();
      }, Error);
    });
    
    it('returns correct version', () => {
      Should(KidaptiveSdk.getSdkVersion()).not.equal(undefined);
      Should(KidaptiveSdk.getSdkVersion()).equal(VERSION); //VERSION defined by build process
    });

  }); //END getSdkVersion

}; //END export
