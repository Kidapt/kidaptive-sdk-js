'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import LearnerManager from '../../../src/learner-manager';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('getInsights', () => {

    let server;

    before(() => {
      server = Sinon.fakeServer.create();
    });

    beforeEach(() => {
      server.resetHistory();
      server.respondImmediately = true;
      server.respondWith(TestConstants.defaultServerResponse);
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      server.restore();
      TestUtils.resetStateAndCache();
    });

    describe('Validate', () => {

      beforeEach(() => {
        server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      });

      describe('timestamp is required and must be an integer that is at least 0', () => {
        const testFunction = parameter => {
          return LearnerManager.getInsights(parameter);
        };
        TestUtils.validatePromiseProperty(testFunction, 'number', true, [0, 1, 1000000000], [-1, 1.5]);
      }); //END timestamp is required and must be a positive integer

      describe('contextMap must be an object if defined', () => {
        const testFunction = parameter => {
          return LearnerManager.getInsights(1000, parameter);
        };
        TestUtils.validatePromiseProperty(testFunction, 'object', false);
      }); //END contextMap must be an object if defined

      describe('contextMap value must be string', () => {
        const testFunction = parameter => {
          return LearnerManager.getInsights(1000, {someProp: parameter});
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true);
      }); //END contextMap value must be string

    }); //END Validate

    it('Correct API request sent', () => {
      const learnerId = 100;
      TestUtils.setState({learnerId});
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      return Should(LearnerManager.getInsights(100000, {key1: 'value1', key2: 'value2'})).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(request.method).equal('GET');
        Should(TestUtils.parseUrl(request.url).url).endWith(Constants.ENDPOINT.INSIGHT);
        Should(TestUtils.parseUrl(request.url).query).equal('learnerId=100&minDateCreated=100000&context.key1=value1&context.key2=value2');
        Should(request.requestBody).equal(null);
        Should(response).equal('ok');
      });
    }); //END Correct API request sent

    it('Response handled correctly', () => {
      const learnerId = 100;
      TestUtils.setState({learnerId});
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      return Should(LearnerManager.getInsights(0)).resolved().then(result => {
        Should(result).deepEqual('ok');
      });
    }); //END Response handled correctly

    it('API error results in promise rejection', () => {
      const learnerId = 100;
      TestUtils.setState({learnerId});
      server.respondWith([500, {}, '']);
      return Should(LearnerManager.getInsights(0)).rejected();
    }); //END API error results in promise rejection

    it('No learner returns an empty array with no server request', () => {
      return Should(LearnerManager.getInsights(0)).resolved().then(result => {
        Should(server.requests).length(0);
        Should(result).deepEqual([]);
      });
    }); //END No learner returns an empty array with no server request

  }); //END getInsights

}; //END export
