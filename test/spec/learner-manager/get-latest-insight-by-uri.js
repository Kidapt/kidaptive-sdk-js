'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import LearnerManager from '../../../src/learner-manager';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('getLatestInsightByUri', () => {

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

      describe('insightUri is required and must be a string', () => {
        const testFunction = parameter => {
          return LearnerManager.getLatestInsightByUri(parameter);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true);
      }); //END insightUri is required and must be a string

      describe('contextKeys must be an array if defined', () => {
        const testFunction = parameter => {
          return LearnerManager.getLatestInsightByUri('insightUri', parameter);
        };
        TestUtils.validatePromiseProperty(testFunction, 'array', false);
      }); //END contextKeys must be an array if defined

      describe('contextKeys item must be a string', () => {
        const testFunction = parameter => {
          return LearnerManager.getLatestInsightByUri('insightUri', [parameter]);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true);
      }); //END contextKeys item must be a string

    }); //END Validate

    it('Correct API request sent', () => {
      const learnerId = 100;
      TestUtils.setState({learnerId});
      server.respondWith([200, {'Content-Type': 'application/json'}, '["ok"]']);
      return Should(LearnerManager.getLatestInsightByUri('insightUri', ['key1', 'key2'])).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(request.method).equal('GET');
        Should(TestUtils.parseUrl(request.url).url).endWith(Constants.ENDPOINT.INSIGHT);
        Should(TestUtils.parseUrl(request.url).query).equal('learnerId=100&uri=insightUri&latest=true&contextKeys=key1%2Ckey2');
        Should(request.requestBody).equal(null);
        Should(response).equal('ok');
      });
    }); //END Correct API request sent

    it('Response handled correctly', () => {
      const learnerId = 100;
      TestUtils.setState({learnerId});
      server.respondWith([200, {'Content-Type': 'application/json'}, '[{"prop":"value"}]']);
      return Should(LearnerManager.getLatestInsightByUri('insightUri')).resolved().then(result => {
        Should(result).deepEqual({prop:'value'});
      });
    }); //END Response handled correctly

    it('API error results in promise rejection', () => {
      const learnerId = 100;
      TestUtils.setState({learnerId});
      server.respondWith([500, {}, '']);
      return Should(LearnerManager.getLatestInsightByUri('insightUri')).rejected();
    }); //END API error results in promise rejection

    it('No learner returns undefined with no server request', () => {
      return Should(LearnerManager.getLatestInsightByUri('insightUri')).resolved().then(result => {
        Should(server.requests).length(0);
        Should(result).equal(undefined);
      });
    }); //END No learner returns undefined with no server request

  }); //END getLatestInsightByUri

}; //END export
