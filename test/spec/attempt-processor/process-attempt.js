'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import AttemptProcessor from '../../../src/attempt-processor';
import Irt from '../../../src/irt';
import State from '../../../src/state';
import Utils from '../../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('processAttempt', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('Calls IRT submodule', () => {
      const spyIrtEstimate = Sinon.spy(Irt, 'estimate');
      AttemptProcessor.processAttempt({
        itemURI: TestConstants.items[0].uri,
        outcome: 1,
        priorLatentMean: 0,
        priorLatentStandardDeviation: 1,
        priorLocalMean: 0,
        priorLocalStandardDeviation: 1
      });
      Should(spyIrtEstimate.called).true();
      spyIrtEstimate.restore();
    });

    describe('Ability updated in state', () => {

      it('Ability replaced if it existed', () => {
        const abilities = State.get('latentAbilities.' + TestConstants.learnerId);
        Should(abilities.length).equal(1);
        AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
          itemURI: TestConstants.items[0].uri,
          outcome: 1,
        }));
        const updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
        Should(updatedAbilities.length).equal(1);
      });

      it('Ability added if it did not exist', () => {
        const abilities = State.get('latentAbilities.' + TestConstants.learnerId);
        Should(abilities.length).equal(1);
        AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
          itemURI: TestConstants.items[1].uri,
          outcome: 1,
        }));
        const updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
        Should(updatedAbilities.length).equal(2);
      });

    });

    it('Ability trialTime updated', () => {
      const abilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(abilities[0].timestamp).equal(TestConstants.defaultAbility.timestamp);
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[0].uri,
        outcome: 1,
      }));
      const updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(updatedAbilities[0].timestamp).equal(TestConstants.trialTime);
    });

    it('Positive outcome positively influences ability', () => {
      const abilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(abilities[0].mean).equal(TestConstants.defaultAbility.mean);
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[0].uri,
        outcome: 1,
      }));
      const updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(updatedAbilities[0].mean).greaterThan(abilities[0].mean);
    });

    it('Negative outcome negatively influences ability', () => {
      const abilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(abilities[0].mean).equal(TestConstants.defaultAbility.mean);
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[0].uri,
        outcome: 0,
      }));
      const updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(updatedAbilities[0].mean).lessThan(abilities[0].mean);
    });

    it('cacheLatentAbilityEstimates should be called', () => {
      const spyCacheAbilities = Sinon.spy(Utils, 'cacheLatentAbilityEstimates');
      AttemptProcessor.processAttempt({
        itemURI: TestConstants.items[0].uri,
        outcome: 1,
        priorLatentMean: 0,
        priorLatentStandardDeviation: 1,
        priorLocalMean: 0,
        priorLocalStandardDeviation: 1
      });
      Should(spyCacheAbilities.called).true();
      const updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(spyCacheAbilities.alwaysCalledWith(updatedAbilities)).true();
      spyCacheAbilities.restore();
    });

  }); //END processAttempt

}; //END export
