'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import EventManager from '../../../src/event-manager';
import State from '../../../src/state';
import Should from 'should';

export default () => {

  describe('setEventTransformer', () => {

    const eventTransformer = () => {
      return 'transformed event';
    };

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setStateOptions({tier: 3});
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('Validate', () => {

      describe('eventTransformer is required and must be a function', () => {
        const testFunction = parameter => {
          EventManager.setEventTransformer(parameter);
        };
        TestUtils.validateProperty(testFunction, 'function', false);
      }); //END eventTransformer is required and must be a function

    }); //END Validate

    it('eventTransformer correctly stored in state', () => {
      EventManager.setEventTransformer(eventTransformer);
      Should(State.get('eventTransformer', false)).Function();
      Should(State.get('eventTransformer', false)()).equal('transformed event');
    });

    it('eventTransformer correctly removed from state', () => {
      EventManager.setEventTransformer(eventTransformer);
      Should(State.get('eventTransformer', false)).Function();
      EventManager.setEventTransformer();
      Should(State.get('eventTransformer', false)).equal(undefined);

      EventManager.setEventTransformer(eventTransformer);
      Should(State.get('eventTransformer', false)).Function();
      EventManager.setEventTransformer(null);
      Should(State.get('eventTransformer', false)).equal(undefined);
    });
    
  }); //END setEventTransformer

}; //END export
