'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import EventManager from '../../../src/event-manager';
import State from '../../../src/state';
import Should from 'should';

export default () => {
  const defaultEstimate = {
    mean: 0.5,
    standardDeviation: 2.0,
    timestamp: 0
  };
  const updatedEstimate = {
    mean: 0.7,
    standardDeviation: 1.5,
    timestamp: 113
  };
  const irtExtension = {
    getInitialLocalAbilityEstimate: (localDimensionUri) => {
      return defaultEstimate;
    },
    resetLocalAbilityEstimate: (localAbilityEstimate) => {
      return updatedEstimate;
    },
    getInitialLatentAbilityEstimate: (dimensionUri) => {
      return defaultEstimate;
    },
    resetLatentAbilityEstimate: (latentAbilityEstimate) => {
      return updatedEstimate;
    }
  };

  const irtExtension2 = {
    getInitialLatentAbilityEstimate: (dimensionUri) => {
      return defaultEstimate;
    },
    resetLatentAbilityEstimate: (latentAbilityEstimate) => {
      return updatedEstimate;
    }
  };

  const invalidIrtExtension = {
    getInitialLocalAbilityEstimate: "not a function"
  };

  describe('setIrtExtension', () => {
    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setStateOptions({tier: 3});
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('Validate', () => {
      const testFunction = parameter => {
        EventManager.setIrtExtension(parameter);
      };
      TestUtils.validateProperty(testFunction, 'object', false, [irtExtension, irtExtension2], [invalidIrtExtension]);
    });

    it('irtExtension correctly stored in state', () => {
      EventManager.setIrtExtension(irtExtension);
      Should(State.get('irtExtension', false)).Object();
      Should(State.get('irtExtension', false).getInitialLocalAbilityEstimate).Function();
      Should(State.get('irtExtension', false).getInitialLocalAbilityEstimate("some/uri")).deepEqual(defaultEstimate);
      Should(State.get('irtExtension', false).resetLocalAbilityEstimate).Function();
      Should(State.get('irtExtension', false).resetLocalAbilityEstimate({some: "estimate"})).deepEqual(updatedEstimate);
      Should(State.get('irtExtension', false).getInitialLatentAbilityEstimate).Function();
      Should(State.get('irtExtension', false).getInitialLatentAbilityEstimate("some/uri")).deepEqual(defaultEstimate);
      Should(State.get('irtExtension', false).resetLatentAbilityEstimate).Function();
      Should(State.get('irtExtension', false).resetLatentAbilityEstimate({some: "estimate"})).deepEqual(updatedEstimate);
    });

    it('irtExtension correctly removed from state', () => {
      EventManager.setIrtExtension(irtExtension);
      Should(State.get('irtExtension', false)).Object();
      Should(State.get('irtExtension', false).getInitialLocalAbilityEstimate).Function();
      EventManager.setIrtExtension();
      Should(State.get('irtExtension', false)).equal(undefined);

      EventManager.setIrtExtension(irtExtension);
      Should(State.get('irtExtension', false)).Object();
      Should(State.get('irtExtension', false).getInitialLocalAbilityEstimate).Function();
      EventManager.setIrtExtension(null);
      Should(State.get('irtExtension', false)).equal(undefined);
    });

  }); // END setIrtExtension


}; // END export