'use strict';
import TestUtils from '../test-utils';
import State from '../../../src/state';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('State', () => {
    let copiedObject;
    const testObject = {
      childArray: [1, {subProp: 'sub array value'}],
      childNumber: 200,
      childObject: {subProp: 'sub object value'},
      childString: 'string value'
    }

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      copiedObject = Utils.copyObject(testObject);
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

    describe('Copy True (default)', () => {

      it('State should stay constant when updating object passed to State.set', () => {
        State.set('testObject', copiedObject);
        copiedObject.childString = 'new string value';
        copiedObject.childObject.subProp = 'new sub object value';
        copiedObject.childArray[1].subProp = 'new sub array value';
        const stateObject = State.get('testObject');
        Should(stateObject).not.deepEqual(copiedObject);
        Should(stateObject).deepEqual(testObject);
      });

      it('State should stay constant when updating object passed from State.get', () => {
        State.set('testObject', copiedObject);
        const getObject = State.get('testObject');
        getObject.childString = 'new string value';
        getObject.childObject.subProp = 'new sub object value';
        getObject.childArray[1].subProp = 'new sub array value';
        const stateObject = State.get('testObject');
        Should(stateObject).not.deepEqual(getObject);
        Should(stateObject).deepEqual(testObject);
      });

    }); //END Copy True (default)

    describe('Copy False', () => {

      it('State should not stay constant when updating object passed to State.set with copy=false', () => {
        State.set('testObject', copiedObject, false);
        copiedObject.childString = 'new string value';
        copiedObject.childObject.subProp = 'new sub object value';
        copiedObject.childArray[1].subProp = 'new sub array value';
        const stateObject = State.get('testObject');
        Should(stateObject).deepEqual(copiedObject);
        Should(stateObject).not.deepEqual(testObject);
      });

      it('State should not stay constants when updating object passed from State.get with copy=false', () => {
        State.set('testObject', copiedObject);
        const getObject = State.get('testObject', false);
        getObject.childString = 'new string value';
        getObject.childObject.subProp = 'new sub object value';
        getObject.childArray[1].subProp = 'new sub array value';
        const stateObject = State.get('testObject');
        Should(stateObject).deepEqual(getObject);
        Should(stateObject).not.deepEqual(testObject);
      });

    }); //END Copy False

  }); //END State

}; //END export
