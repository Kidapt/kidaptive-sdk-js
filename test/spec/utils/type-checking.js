'use strict';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('Type Checking', () => {

    ['isArray', 'isBoolean', 'isFunction', 'isInteger', 'isJson', 'isNumber', 'isObject', 'isString'].forEach(method => {
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
        it(method + '(0.5) is ' + (method === 'isNumber'), () => {
          Should(Utils[method](0.5)).equal(method === 'isNumber');
        });
        it(method + '(-0.5) is ' + (method === 'isNumber'), () => {
          Should(Utils[method](-0.5)).equal(method === 'isNumber');
        });
        it(method + '(1) is ' + (method === 'isNumber' || method === 'isInteger'), () => {
          Should(Utils[method](1)).equal(method === 'isNumber' || method === 'isInteger');
        });
        it(method + '(-1) is ' + (method === 'isNumber' || method === 'isInteger'), () => {
          Should(Utils[method](1)).equal(method === 'isNumber' || method === 'isInteger');
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

  }); //END Type Checking

}; //END export
