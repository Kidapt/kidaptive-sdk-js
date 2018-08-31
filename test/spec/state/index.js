'use strict';
import TestUtils from '../test-utils';
import State from '../../../src/state';
import Should from 'should';

export default () => {

  describe('State', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('State.get("testKey1") returns undefined', () => {
      Should(State.get('testKey1')).equal(undefined);
    });

    it('State.set("testKey1") then State.get("testKey1") returns value', () => {
      State.set('testKey1', 'value1');
      Should(State.get('testKey1')).equal('value1');
    });

    it('State.get("testKey1") and State.get("testKey2") returns correct values', () => {
      State.set('testKey1', 'value1');
      State.set('testKey2', 'value2');
      Should(State.get('testKey1')).equal('value1');
      Should(State.get('testKey2')).equal('value2');
    });

    it('State.set("testKey1") overwrites value', () => {
      State.set('testKey1', 'value1');
      Should(State.get('testKey1')).equal('value1');
      State.set('testKey1', 'value2');
      Should(State.get('testKey1')).equal('value2');
    });

    it('State.set("testKey1") to null sets value to null', () => {
      State.set('testKey1', 'value1');
      Should(State.get('testKey1')).equal('value1');
      State.set('testKey1', null);
      Should(State.get('testKey1')).equal(null);
    });

    it('State.set("testKey1") to undefined sets value to undefined', () => {
      State.set('testKey1', 'value1');
      Should(State.get('testKey1')).equal('value1');
      State.set('testKey1');
      Should(State.get('testKey1')).equal(undefined);
    });

    it('State.clear() removes all values', () => {
      State.set('testKey1', 'value1');
      State.set('testKey2', 'value2');
      Should(State.get('testKey1')).equal('value1');
      Should(State.get('testKey2')).equal('value2');
      State.clear();
      Should(State.get('testKey1')).equal(undefined);
      Should(State.get('testKey2')).equal(undefined);
    });

  }); //END State

}; //END export
