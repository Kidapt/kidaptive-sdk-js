'use strict';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('Data Manipulation', () => {

    describe('copyObject', () => {

      it('Number', () => {
        const testObject = 100
        const copiedObject = Utils.copyObject(testObject);
        Should(copiedObject).deepEqual(testObject);
      });

      it('Function', () => {
        const testObject = () => {};
        const copiedObject = Utils.copyObject(testObject);
        Should(copiedObject).not.deepEqual(testObject); //loses function declaration
        Should(copiedObject).deepEqual({});
      });

      it('Function with property', () => {
        const testObject = () => {};
        testObject.added = 100;
        const copiedObject = Utils.copyObject(testObject);
        Should(copiedObject).not.deepEqual(testObject); //loses function declaration
        Should(copiedObject).deepEqual({added: 100});
        copiedObject.secondAdded = 200;
        Should(testObject.secondAdded).equal(undefined);
      });

      it('String', () => {
        const testObject = 'string';
        const copiedObject = Utils.copyObject(testObject);
        Should(copiedObject).deepEqual(testObject);
      });

      const testArray = [
        [],
        {name: 'item1', items: []},
        () => {}
      ];

      it('Array Copy is Same', () => {
        const copiedArray = Utils.copyObject(testArray);
        Should(copiedArray).deepEqual(testArray);
      });

      it('Array Copy Push', () => {
        const copiedArray = Utils.copyObject(testArray);
        copiedArray.push('added');
        Should(copiedArray.length).equal(testArray.length + 1);
        Should(copiedArray).not.deepEqual(testArray);
      });

      it('Array Copy Child Array Push', () => {
        const copiedArray = Utils.copyObject(testArray);
        copiedArray[0].push('added');
        Should(copiedArray[0].length).equal(testArray[0].length + 1);
        Should(copiedArray).not.deepEqual(testArray);
      });

      it('Array Copy Child Object Adding Property', () => {
        const copiedArray = Utils.copyObject(testArray);
        copiedArray[1].added = 100;
        Should(copiedArray[1].added).equal(100);
        Should(testArray[1].added).equal(undefined);
        Should(copiedArray).not.deepEqual(testArray);
      });

      it('Array Copy Child Function Adding Property', () => {
        const copiedArray = Utils.copyObject(testArray);
        copiedArray[2].added = 200;
        Should(copiedArray[2].added).equal(200);
        Should(testArray[2].added).equal(200);
        Should(copiedArray).deepEqual(testArray);
      });

      it('Array Original Push', () => {
        const originalArray = Utils.copyObject(testArray);
        const copiedArray = Utils.copyObject(originalArray);
        originalArray.push('added');
        Should(originalArray.length).equal(copiedArray.length + 1);
        Should(originalArray).not.deepEqual(copiedArray);
      });

      it('Array Original Child Array Push', () => {
        const originalArray = Utils.copyObject(testArray);
        const copiedArray = Utils.copyObject(originalArray);
        originalArray[0].push('added');
        Should(originalArray[0].length).equal(copiedArray[0].length + 1);
        Should(originalArray).not.deepEqual(copiedArray);
      });

      it('Array Original Child Object Adding Property', () => {
        const originalArray = Utils.copyObject(testArray);
        const copiedArray = Utils.copyObject(originalArray);
        originalArray[1].added = 100;
        Should(originalArray[1].added).equal(100);
        Should(copiedArray[1].added).equal(undefined);
        Should(originalArray).not.deepEqual(copiedArray);
      });

      it('Array Original Child Function Adding Property', () => {
        const originalArray = Utils.copyObject(testArray);
        const copiedArray = Utils.copyObject(originalArray);
        originalArray[2].added = 200;
        Should(originalArray[2].added).equal(200);
        Should(copiedArray[2].added).equal(200);
        Should(originalArray).deepEqual(copiedArray);
      });

      const testObject = {
        childArray: [],
        childFunction: () => {},
        childNumber: 200,
        childObject: {},
        childString: 'string'
      };

      it('Object Copy is Same', () => {
        const copiedObject = Utils.copyObject(testObject);
        Should(copiedObject).deepEqual(testObject);
      });

      it('Object Copy Adding Property', () => {
        const copiedObject = Utils.copyObject(testObject);
        copiedObject.added = 100;
        Should(copiedObject.added).equal(100);
        Should(testObject.added).equal(undefined);
        Should(copiedObject).not.deepEqual(testObject);
      });

      it('Object Copy Child Array Push', () => {
        const copiedObject = Utils.copyObject(testObject);
        copiedObject.childArray.push('added');
        Should(copiedObject.childArray.length).equal(1);
        Should(testObject.childArray.length).equal(0);
        Should(copiedObject).not.deepEqual(testObject);
      });

      it('Object Copy Child Object Adding Property', () => {
        const copiedObject = Utils.copyObject(testObject);
        copiedObject.childObject.added = 200;
        Should(copiedObject.childObject.added).equal(200);
        Should(testObject.childObject.added).equal(undefined);
        Should(copiedObject).not.deepEqual(testObject);
      });

      it('Object Copy Child Function Adding Property', () => {
        const copiedObject = Utils.copyObject(testObject);
        copiedObject.childFunction.added = 300;
        Should(copiedObject.childFunction.added).equal(300);
        Should(testObject.childFunction.added).equal(300);
        Should(copiedObject).deepEqual(testObject);
      });

      it('Object Original Adding Property', () => {
        const originalObject = Utils.copyObject(testObject);
        const copiedObject = Utils.copyObject(originalObject);
        originalObject.added = 100;
        Should(originalObject.added).equal(100);
        Should(copiedObject.added).equal(undefined);
        Should(originalObject).not.deepEqual(copiedObject);
      });

      it('Object Original Child Array Push', () => {
        const originalObject = Utils.copyObject(testObject);
        const copiedObject = Utils.copyObject(originalObject);
        originalObject.childArray.push('added');
        Should(originalObject.childArray.length).equal(1);
        Should(copiedObject.childArray.length).equal(0);
        Should(originalObject).not.deepEqual(copiedObject);
      });

      it('Object Original Child Object Adding Property', () => {
        const originalObject = Utils.copyObject(testObject);
        const copiedObject = Utils.copyObject(originalObject);
        originalObject.childObject.added = 200;
        Should(originalObject.childObject.added).equal(200);
        Should(copiedObject.childObject.added).equal(undefined);
        Should(originalObject).not.deepEqual(copiedObject);
      });

      it('Object Original Child Function Adding Property', () => {
        const originalObject = Utils.copyObject(testObject);
        const copiedObject = Utils.copyObject(originalObject);
        originalObject.childFunction.added = 300;
        Should(originalObject.childFunction.added).equal(300);
        Should(copiedObject.childFunction.added).equal(300);
        Should(originalObject).deepEqual(copiedObject);
      });

    }); //END copyObject

    describe('findItem', () => {

      const testObject = [{a:1, b:3},{a:2, b:6},{a:3, b:9}];

      it('Nothing', () => {
        Should(Utils.findItem(testObject, item => {
          return false;
        })).equal(undefined);
      });

      it('First Element', () => {
        Should(Utils.findItem(testObject, item => {
          return true
        })).deepEqual({a:1, b:3});
      });

      it('Middle element', () => {
        Should(Utils.findItem(testObject, item => {
          return item.a === 2;
        })).deepEqual({a:2, b:6});
      });

      it('Last Element', () => {
        Should(Utils.findItem(testObject, item => {
          return item.a === 3;
        })).deepEqual({a:3, b:9});
      });

    }); //END findItem

    describe('findItemIndex', () => {

      const testObject = [undefined, 2, 3, 4, 5, 6, null];

      it('Nothing', () => {
        Should(Utils.findItemIndex(testObject, item => {
          return false;
        })).equal(-1);
      });

      it('First Element', () => {
        Should(Utils.findItemIndex(testObject, item => {
          return true
        })).equal(0);
      });

      it('Last Element', () => {
        Should(Utils.findItemIndex(testObject, item => {
          return item === null;
        })).equal(testObject.length - 1);
      });

      it('5th Element', () => {
        Should(Utils.findItemIndex(testObject, item => {
          return item === 5;
        })).equal(4);
      });

    }); //END findItemIndex

    describe('toJson', () => {

      it('null', () => {
        const testObject = null;
        Should(Utils.toJson(testObject)).equal('null');
      });

      it('undefined', () => {
        const testObject = undefined;
        Should(Utils.toJson(testObject)).equal(undefined);
      });

      it('Array', () => {
        const testObject = [];
        Should(Utils.toJson(testObject)).equal('[]');
      });

      it('Function', () => {
        const testObject = () => {};
        Should(Utils.toJson(testObject)).equal(undefined);
      });

      it('Number', () => {
        const testObject = 100;
        Should(Utils.toJson(testObject)).equal('100');
      });

      it('Object', () => {
        const testObject = {};
        Should(Utils.toJson(testObject)).equal('{}');
      });

      it('Object Order', () => {
        const testObject1 = {a: 1, b: 2, c: 3};
        const testObject2 = {c: 3, b: 2, a: 1};
        Should(Utils.toJson(testObject1)).equal(Utils.toJson(testObject2));
      });

      it('String', () => {
        const testObject = 'string';
        Should(Utils.toJson(testObject)).equal('"string"');
      });

      it('Array with null values', () => {
        const testObject = [null];
        Should(Utils.toJson(testObject)).equal('[null]');
      });

      it('Array with undefined values', () => {
        const testObject = [undefined];
        Should(Utils.toJson(testObject)).equal('[null]');
      });

      it('Array with missing values', () => {
        const testObject = [];
        testObject[2] = 10;
        Should(Utils.toJson(testObject)).equal('[null,null,10]');
      });

      it('Object undefined values', () => {
        const testObject = {
          childNull: undefined
        };
        Should(Utils.toJson(testObject)).equal('{}');
      });

      it('Object null calues', () => {
        const testObject = {
          childNull: null
        };
        Should(Utils.toJson(testObject)).equal('{"childNull":null}');
      });

      it('Complex Object', () => {
        const testObject = {
          childArray: [[1,2], undefined, null, [1, 2, {a: 3}]],
          childFunction: () => {},
          childNumber: 200,
          childObject: {},
          childString: 'string',
          childNull: null,
          childUndefined: undefined
        };
        Should(Utils.toJson(testObject)).equal('{"childArray":[[1,2],null,null,[1,2,{"a":3}]],"childNull":null,"childNumber":200,"childObject":{},"childString":"string"}');
      });
    }); //END toJson


  }); //END Data Manipulation

}; //END export
