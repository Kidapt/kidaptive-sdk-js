'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import LearnerManager from '../../../src/learner-manager';
import State from '../../../src/state';
import Utils from '../../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('updateAbilityEstimates', () => {

    const idToDimension = {
      1: {id: 1, uri: 'dimension/1'},
      2: {id: 2, uri: 'dimension/2'},
      3: {id: 3, uri: 'dimension/3'},
      4: {id: 4, uri: 'dimension/4'}
    };

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
      TestUtils.setStateOptions({tier: 2});
      TestUtils.setState({idToModel: {dimension: idToDimension}});
    });

    after(() => {
      server.restore();
      TestUtils.resetStateAndCache();
    });

    it('Correct API request sent', () => {
      const learnerId = 100;
      TestUtils.setState({learnerId});
      server.respondWith([200, {'Content-Type': 'application/json'}, '[]']);
      return Should(LearnerManager.updateAbilityEstimates()).resolved().then(response => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(request.method).equal('GET');
        Should(TestUtils.parseUrl(request.url).url).endWith(Constants.ENDPOINT.ABILITY);
        Should(TestUtils.parseUrl(request.url).query).equal('learnerId=100');
        Should(request.requestBody).equal(null);
        Should(response).equal(undefined);
      });
    }); //END Correct API request sent


    it('Sets state correctly', () => {
      const response = [
        {dimensionId: 1, mean: 1, standardDeviation: 1.5, timestamp: 100},
        {dimensionId: 2, mean: 0, standardDeviation: 2, timestamp: 100},
        {dimensionId: 3, mean: -1, standardDeviation: 1, timestamp: 100}
      ];
      const expected = [
        {dimension: idToDimension[1], mean: 1, standardDeviation: 1.5, timestamp: 100},
        {dimension: idToDimension[2], mean: 0, standardDeviation: 2, timestamp: 100},
        {dimension: idToDimension[3], mean: -1, standardDeviation: 1, timestamp: 100}
      ];
      const learnerId = 100;
      TestUtils.setState({learnerId});
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(response)]);
      Should(State.get('latentAbilities.' + learnerId)).equal(undefined);
      return Should(LearnerManager.updateAbilityEstimates()).resolved().then(() => {
        Should(State.get('latentAbilities.' + learnerId)).deepEqual(expected);
      });
    }); //END Sets state correctly

    it('Promise resolves even with API error', () => {
      const learnerId = 100;
      TestUtils.setState({learnerId});
      server.respondWith([500, {}, '']);
      return Should(LearnerManager.updateAbilityEstimates()).resolved();
    }); //END Promise resolves even with API error

    it('No API request when no learner selected', () => {
      return Should(LearnerManager.updateAbilityEstimates()).resolved().then(response => {
        Should(server.requests).length(0);
        Should(response).equal(undefined);
      });
    }); //END No API request when no learner selected

    it('cacheLatentAbilityEstimates is called', () => {
      const spyCache = Sinon.spy(Utils, 'cacheLatentAbilityEstimates');
      const learnerId = 100;
      TestUtils.setState({learnerId});
      server.respondWith([200, {'Content-Type': 'application/json'}, '[]']);
      Should(spyCache.called).false();
      return Should(LearnerManager.updateAbilityEstimates()).resolved().then(response => {
        Should(spyCache.called).true();
        spyCache.restore();
      });

    }); //END cacheLatentAbilityEstimates is called

    it('Merge new with old, taking newest timestamp', () => {
      const previous = [
        {dimension: idToDimension[1], mean: 1, standardDeviation: 1.5, timestamp: 100},
        {dimension: idToDimension[2], mean: 0, standardDeviation: 2, timestamp: 100},
        {dimension: idToDimension[4], mean: 0, standardDeviation: 1, timestamp: 100}
      ];
      const response = [
        {dimensionId: 1, mean: 1.25, standardDeviation: 1.25, timestamp: 50},
        {dimensionId: 2, mean: -0.5, standardDeviation: 1, timestamp: 200},
        {dimensionId: 3, mean: -1, standardDeviation: 1, timestamp: 200}
      ];
      const expected = [
        {dimension: idToDimension[1], mean: 1, standardDeviation: 1.5, timestamp: 100},
        {dimension: idToDimension[2], mean: -0.5, standardDeviation: 1, timestamp: 200},
        {dimension: idToDimension[3], mean: -1, standardDeviation: 1, timestamp: 200},
        {dimension: idToDimension[4], mean: 0, standardDeviation: 1, timestamp: 100}
      ];
      const learnerId = 100;
      TestUtils.setState({
        learnerId,
        ['latentAbilities.' + learnerId]: previous
      });
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(response)]);
      Should(State.get('latentAbilities.' + learnerId)).deepEqual(previous);
      return Should(LearnerManager.updateAbilityEstimates()).resolved().then(() => {
        Should(State.get('latentAbilities.' + learnerId)).deepEqual(expected);
      });
    }); //END Merge new with old, taking newest timestamp

  }); //END updateAbilityEstimates

}; //END export
