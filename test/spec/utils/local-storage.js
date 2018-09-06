'use strict';
import TestUtils from '../test-utils';
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

    it('localStorageGetKeys() returns a list of local storage keys', () => {
      const keysToSet = ['key1','key2','key3'];
      keysToSet.forEach(key => {
        Utils.localStorageSetItem(key, true);
      });
      const keys = Utils.localStorageGetKeys();
      Should(keys).Array();
      Should(keys.length).equal(3);
      Should(keysToSet.sort()).eql(keys.sort());
      Utils.localStorageSetItem('key4', true);
      const keys2 = Utils.localStorageGetKeys();
      Should(keys2).Array();
      Should(keys2.length).equal(4);
      Should(keysToSet.sort()).not.eql(keys2.sort());
    });

    it('localStorageGetKeys() defaults to an empty array when no keys present', () => {
      const keys = Utils.localStorageGetKeys();
      Should(keys).Array();
      Should(keys.length).equal(0);
    });

  }); //END Local Storage

}; //END export
