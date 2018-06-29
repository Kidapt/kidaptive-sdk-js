'use strict';
import Error from '../../src/error';
import OperationManager from '../../src/operation-manager';
import Should from 'should';
import Q from 'q';

describe('KidaptiveSdk Operation Manager Unit Tests',  () => {
  it('Queue Should Resolve', () => {
    const result = {a: "value1"};
    return Should(OperationManager.addToQueue(() => {
      return result;
    })).resolvedWith(result);
  });
  it('Queue With Error Should Reject', () => {
    const error = new Error(Error.ERROR_CODES.GENERIC_ERROR, 'Error within operation');
    return Should(OperationManager.addToQueue(() =>  {
      throw error;
    })).rejectedWith(error);
  });
  it('Queue Should Recover', () =>  {
    const result = {b: "value2"};
    return Should(OperationManager.addToQueue(() =>  {
      return result;
    })).resolvedWith(result);
  });
  it('Queue Should Resolve Inner Promise', () => {
    const result = {a: "value1"};
    const innerPromise = OperationManager.addToQueue(() => {
      return result;
    });
    return Should(OperationManager.addToQueue(() => {
      return innerPromise;
    })).resolvedWith(result);
  });
  it('Queue Should Reject Inner Promise', () => {
    const error = new Error(Error.ERROR_CODES.GENERIC_ERROR, 'Error within operation');
    const innerPromise = OperationManager.addToQueue(() => {
      throw error;
    });
    return Should(OperationManager.addToQueue(() => {
      return innerPromise;
    })).rejectedWith(error);
  });
  it('Queue Sequential Calls',  () =>  {
    const testVar = [];
    OperationManager.addToQueue(() =>  {
      testVar.push(1);
    });
    OperationManager.addToQueue(() =>  {
      testVar.push(2);
    });
    return OperationManager.addToQueue(() =>  {
      testVar.push(3);
      Should(testVar).deepEqual([1, 2, 3]);
    });
  });
  it('Queue Sequential Calls With Inner Calls', done =>  {
    const testVar = [];
    OperationManager.addToQueue(() => {
      testVar.push(1);
      OperationManager.addToQueue(() => {
        testVar.push(2);
      })
    });
    OperationManager.addToQueue(() => {
      testVar.push(3);
      Should(testVar).deepEqual([1, 2, 3]);
    }).then(done).catch(done);;
  });
  it('Queue Properly Waits', () =>  {
    const testVar = [];
    OperationManager.addToQueue(() => {
      const deferred = Q.defer();
      setTimeout(() => {
        testVar.push(1);
        deferred.resolve();
      }, 100);
      return deferred.promise;
    });
    return Should(OperationManager.addToQueue(() => {
      testVar.push(2);
      Should(testVar).deepEqual([1, 2]);
    })).resolved();
  });
  it('Queue Complex Chaining', () => {
    const testVar = [];
    return OperationManager.addToQueue(() => {
      testVar.push(1);
      OperationManager.addToQueue(() => {
        testVar.push(2);
      })
    }).then(() => {
      return OperationManager.addToQueue(() => {
        testVar.push(3);
        Should(testVar).deepEqual([1, 2, 3]);
      });
    });
  });
  it('Inner Operation Manager Calls Resolve', () => {
    const testVar = [];
    return Should(OperationManager.addToQueue(() => {
      return Should(OperationManager.addToQueue(() => {
        return true;
      })).resolvedWith(true);
    })).resolvedWith(true);
  });
  it('Queue Simplified Chaining', () => {
    const testVar = [];
    return OperationManager.addToQueue(() => {
      testVar.push(1);
      OperationManager.addToQueue(() => {
        testVar.push(2);
      })
      return OperationManager.addToQueue(() => {
        testVar.push(3);
        Should(testVar).deepEqual([1, 2, 3]);
      });
    });
  });
});
