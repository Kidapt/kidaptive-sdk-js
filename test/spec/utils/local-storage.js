'use strict';
import TestUtils from '../../test-utils';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('Local Storage', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('localStorageGetItem() throws Error', () => {
      Should.throws(() => {
        Utils.localStorageGetItem('testKey');
      }, Error);
    });

    it('localStorageSetItem() then localStorageGetItem() returns value', () => {
      Utils.localStorageSetItem('testKey', 'value');
      Should(Utils.localStorageGetItem('testKey')).equal('value');
    });

    it('localStorageSetItem() overwrites value', () => {
      Utils.localStorageSetItem('testKey', 'value');
      Should(Utils.localStorageGetItem('testKey')).equal('value');
      Utils.localStorageSetItem('testKey', 'value2');
      Should(Utils.localStorageGetItem('testKey')).equal('value2');
    });

    it('localStorageSetItem(undefined) then localStorageGetItem() returns value', () => {
      Utils.localStorageSetItem('testKey', 'value');
      Should(Utils.localStorageGetItem('testKey')).equal('value');
      Utils.localStorageSetItem('testKey');
      Should(Utils.localStorageGetItem('testKey')).equal(undefined);
    });

    it('localStorageRemoveItem() then localStorageGetItem() throws Error', () => {
      Utils.localStorageSetItem('testKey', 'value');
      Should(Utils.localStorageGetItem('testKey')).equal('value');
      Utils.localStorageRemoveItem('testKey');
      Should.throws(() => { 
        Utils.localStorageGetItem('testKey');
      }, Error);
    });

  }); //END Local Storage

}; //END export
