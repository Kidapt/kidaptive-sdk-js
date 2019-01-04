'use strict';
import KidaptiveError from '../../../src/error';
import Should from 'should';

export default () => {

  describe('Error', () => {

    it('throw new KidaptiveError() throw Error', () => {
      Should.throws(() => {
        throw new KidaptiveError('errorType', 'errorMessage');
      }, Error);
    });

    it('throw new KidaptiveError() with correct message', () => {
      Should.throws(() => {
        throw new KidaptiveError('errorType', 'errorMessage');
      }, Error, 'KidaptiveError (errorType) errorMessage');
    });

    it('KidaptiveError() has type property defined', () => {
      Should(new KidaptiveError('errorType', 'errorMessage').type).equal('errorType');
    });

    it('KidaptiveError.ERROR_CODES is object', () => {
      Should(KidaptiveError.ERROR_CODES).Object();
    });

    it('KidaptiveError.ERROR_CODES.* are strings', () => {
      Object.keys(KidaptiveError.ERROR_CODES).forEach(key => {
        Should(KidaptiveError.ERROR_CODES[key]).String();
      });
    });

  }); //END Error

}; //END export
