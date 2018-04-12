'use strict';
import KidaptiveError from '../../src/error';
import Should from 'should';

describe('KidaptiveSdk Error Unit Tests', () => {
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
  it('KidaptiveError.ERROR_CODES should be object', () => {
    Should(KidaptiveError.ERROR_CODES).Object();
  });
});
