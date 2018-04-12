'use strict';
import Constants from '../../src/constants';
import State from '../../src/state';
import Utils from '../../src/utils';
import Should from 'should';

describe('KidaptiveSdk Utils Unit Tests', () => {
  describe('State Checking Functions', () => {
    describe('checkInitialized', () => {
      it('Default checkInitialized() throws Error', () => {
        Should.throws(() => { 
          Utils.checkInitialized(); 
        }, Error);
      });
      it('init() then checkInitialized() does not throw Error', () => {
        State.set('initialized', true);
        Should.doesNotThrow(() => { 
          Utils.checkInitialized(); 
        }, Error);
      });
      it('destroy() then checkInitialized() throws Error', () => {
        State.set('initialized', false);
        Should.throws(() => { 
          Utils.checkInitialized(); 
        }, Error);
        State.clear();
      });
    });

    describe('checkTier', () => {
      it('checkTier without init throws Error', () => {
        Should.throws(() => { 
          Utils.checkTier(Constants.DEFAULT.TIER); 
        }, Error);
      });
      it('init default tier then checkTier with default does not throw Error', () => {
        State.set('initialized', true);
        State.set('options', {tier: Constants.DEFAULT.TIER});
        Should.doesNotThrow(() => {
          Utils.checkTier(Constants.DEFAULT.TIER);
        }, Error);
        State.clear();
      });
      const tiers = [1, 2, 3];
      tiers.forEach(configuredTier => {
        tiers.forEach(requiredTier => {
          it('init tier ' + configuredTier + ' checkTier(' + requiredTier + ') ' + ((requiredTier > configuredTier) ? 'throws error' : 'does not throw error'), () => {
            State.set('initialized', true);
            State.set('options', {tier: configuredTier});
            if (requiredTier > configuredTier) {
              Should.throws(() => {
                Utils.checkTier(requiredTier);
              }, Error);
            } else {
              Should.doesNotThrow(() =>{
                Utils.checkTier(requiredTier);
              }, Error);
            }
            State.clear();
          });
        });
      });
    });

    describe('checkLoggingLevel', () => {
      it('Default logging level', () => {
        Should(Utils.checkLoggingLevel(Constants.DEFAULT.LOGGING_LEVEL)).equal(true);
      });
      [ {config: 'none', check: 'all', expected: false},
        {config: 'none', check: 'warn', expected: false},
        {config: 'warn', check: 'all', expected: false},
        {config: 'warn', check: 'warn', expected: true},
        {config: 'all', check: 'all', expected: true},
        {config: 'all', check: 'warn', expected: true}
      ].forEach(test => {
        it('Configured to \'' + test.config + '\' checkLoggingLevel(\'' + test.check +'\') is ' + test.expected, () => {
          State.set('initialized', true);
          State.set('options', {loggingLevel: test.config});
          Should(Utils.checkLoggingLevel(test.check)).equal(test.expected);
          State.clear();
        });
      });
    });
  });

  describe('Type Checking Functions', () => {
    ['isArray', 'isBoolean', 'isFunction', 'isJson', 'isNumber', 'isObject', 'isString'].forEach(method => {
      describe(method, () => {
        it(method + '() is false', () => {
          Should(Utils[method]()).equal(false);
        });
        it(method + '(undefined) is false', () => {
          Should(Utils[method](undefined)).equal(false);
        });
        it(method + '(null) is false', () => {
          Should(Utils[method](null)).equal(false);
        });
        it(method + '([]) is ' + (method === 'isArray'), () => {
          Should(Utils[method]([])).equal(method === 'isArray');
        });
        it(method + '(true) is ' + (method === 'isBoolean'), () => {
          Should(Utils[method](true)).equal(method === 'isBoolean');
        });
        it(method + '(false) is ' + (method === 'isBoolean'), () => {
          Should(Utils[method](false)).equal(method === 'isBoolean');
        });
        it(method + '(function(){}) is ' + (method === 'isFunction'), () => {
          Should(Utils[method](() => {})).equal(method === 'isFunction');
        });
        it(method + '(1) is ' + (method === 'isNumber'), () => {
          Should(Utils[method](1)).equal(method === 'isNumber');
        });
        it(method + '({}) is ' + (method === 'isObject'), () => {
          Should(Utils[method]({})).equal(method === 'isObject');
        });
        it(method + '(\'\') is ' + (method === 'isString'), () => {
          Should(Utils[method]('')).equal(method === 'isString');
        });
        if (method === 'isJson') {
          it(method + '(\'not json\') is false', () => {
            Should(Utils[method]('not json')).equal(false);
          });
          it(method + '(\'{}\') is true', () => {
            Should(Utils[method]('{}')).equal(true);
          });
          it(method + '(\'{"a":"123"}\') is true', () => {
            Should(Utils[method]('{"a":"123"}')).equal(true);
          });
        }
      });
    });
  });

  describe('Local Storage Functions', () => {
    before(() => {
      localStorage.clear();
    });
    after(() => {
      localStorage.clear();
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
      Utils.localStorageSetItem('testKey', 'value2');
      Should(Utils.localStorageGetItem('testKey')).equal('value2');
    });
    it('localStorageSetItem(undefined) then localStorageGetItem() returns value', () => {
      Utils.localStorageSetItem('testKey');
      Should(Utils.localStorageGetItem('testKey')).equal(undefined);
    });
    it('localStorage.removeItem() then localStorageGetItem() throws Error', () => {
      localStorage.removeItem('testKey');
      Should.throws(() => { 
        Utils.localStorageGetItem('testKey');
      }, Error);
    });
  });

  describe('Data Manipulation Functions', () => {
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
    });

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
    });

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
    });
  });
});
