'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import AttemptProcessor from '../../../src/attempt-processor';
import KidaptiveIrt from 'kidaptive-irt-js';
import State from '../../../src/state';
import Utils from '../../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('processAttempt', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      State.set('irtModule', KidaptiveIrt);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('Calls IRT submodule', () => {
      const spyIrtEstimate = Sinon.spy(State.get('irtModule', false), 'univariateIrtEstimate');
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
        Should(updatedAbilities[0].mean).greaterThan(abilities[0].mean);
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

    describe('Ability at trial start is not updated by attempt processor', () => {

      it('Does not update latentAbilitiesAtStartOfTrial', () => {
        const abilities = State.get('latentAbilities.' + TestConstants.learnerId);
        Should(abilities.length).equal(1);
        const abilitiesAtStartOfTrial = State.get('latentAbilitiesAtStartOfTrial.' + TestConstants.learnerId);
        Should(abilitiesAtStartOfTrial.length).equal(1);
        AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
          itemURI: TestConstants.items[0].uri,
          outcome: 1,
        }));
        const updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
        Should(updatedAbilities.length).equal(1);
        const postProcessingAbilitiesAtStartOfTrial = State.get('latentAbilitiesAtStartOfTrial.' + TestConstants.learnerId);
        Should(abilitiesAtStartOfTrial).deepEqual(postProcessingAbilitiesAtStartOfTrial);
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

    //     test_cases, generated from kcat reference code
    //   n_trial n_item a    b    c outcome prior_theta prior_sd posterior_theta  posterior_sd        d conv_crit
    // 1       0      0 1 -1.0 0.25       1         0.5     0.75       0.5511701     0.7238235 1.595769     1e-12      # TestConstants.items[0].uri
    //  --- will perform attempt with respect to a different dimension between these                                   # TestConstants.items[1].uri
    // 2       0      2 1 -0.5 0.25       1         0.5     0.75       0.6360027     0.6890343 1.595769     1e-12      # TestConstants.items[2].uri
    // 3       0      3 1  0.8 0.25       0         0.5     0.75       0.3841432     0.6004662 1.595769     1e-12      # TestConstants.items[3].uri
    it('Uses trial response history in IRT estimation', () => {
      const abilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(abilities[0].mean).equal(TestConstants.defaultAbility.mean);
      Should(abilities[0].standardDeviation).equal(TestConstants.defaultAbility.standardDeviation);
      
      // First attempt 
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[0].uri,
        outcome: 1,
        guessingParameter: 0.25,
      }));
      let updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.5511701)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.7238235)).lessThan(1e-6);

      // Second attempt (different dimension, so expect no change to updatedAbilities[0])
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[1].uri,
        outcome: 1,
        guessingParameter: 0.25,
      }));
      updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.5511701)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.7238235)).lessThan(1e-6);
      Should(updatedAbilities.length).equal(2);

      // Third attempt (exercises that we properly filter out the previous attempt when updating the ability estimate)
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[2].uri,
        outcome: 1,
        guessingParameter: 0.25,
      }));
      updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.6360027)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.6890343)).lessThan(1e-6);

      // Fourth attempt
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[3].uri,
        outcome: 0,
        guessingParameter: 0.25,
      }));
      updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.3841432)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.6004662)).lessThan(1e-6);
    });

    //   n_trial n_item a    b    c   outcome prior_theta    prior_sd posterior_theta posterior_sd        d conv_crit
    // 1       0      0 1 -1.0 0.25         1   0.5000000   0.7500000       0.5511701    0.7238235 1.595769     1e-12    # TestConstants.items[0].uri
    //  --- will perform attempt with respect to a different dimension between these                                   # TestConstants.items[1].uri
    // 2       0      2 1 -0.5 0.25         1   0.5511701   0.7238235       0.6357263    0.6868056 1.595769     1e-12    # TestConstants.items[2].uri
    // 3       0      3 1  0.8 0.25         0   0.6357263   0.6868056       0.3807629    0.6096693 1.595769     1e-12    # TestConstants.items[3].uri
    it('Uses irtMethod value from SDK options (check usage of non-default irt_learn implementation)', () => {
      let options = State.get('options');
      options.irtMethod = 'irt_learn';
      State.set('options', options);

      const abilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(abilities[0].mean).equal(TestConstants.defaultAbility.mean);
      Should(abilities[0].standardDeviation).equal(TestConstants.defaultAbility.standardDeviation);
      
      // First attempt 
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[0].uri,
        outcome: 1,
        guessingParameter: 0.25,
      }));
      let updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.5511701)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.7238235)).lessThan(1e-6);

      // Second attempt (different dimension, so expect no change to updatedAbilities[0])
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[1].uri,
        outcome: 1,
        guessingParameter: 0.25,
      }));
      updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.5511701)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.7238235)).lessThan(1e-6);
      Should(updatedAbilities.length).equal(2);

      // Third attempt
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[2].uri,
        outcome: 1,
        guessingParameter: 0.25,
      }));
      updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.6357263)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.6868056)).lessThan(1e-6);

      // Fourth attempt
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[3].uri,
        outcome: 0,
        guessingParameter: 0.25,
      }));
      updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.3807629)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.6096693)).lessThan(1e-6);
    });

    //   n_trial n_item a    b    c   outcome prior_theta prior_sd  posterior_theta posterior_sd   d conv_crit
    // 1       0      0 1 -1.0 0.25         1         0.5     0.75        0.5646866    0.7269342 1.2     1e-12
    // 2       0      1 1 -0.5 0.25         1         0.5     0.75        0.6544609    0.7009669 1.2     1e-12
    // 3       0      2 1  0.8 0.25         0         0.5     0.75        0.4266929    0.6435669 1.2     1e-12
    it('Uses irtScalingFactor value from SDK options', () => {
      let options = State.get('options');
      options.irtScalingFactor = 1.2;
      State.set('options', options);

      const abilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(abilities[0].mean).equal(TestConstants.defaultAbility.mean);
      Should(abilities[0].standardDeviation).equal(TestConstants.defaultAbility.standardDeviation);
      
      // First attempt 
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[0].uri,
        outcome: 1,
        guessingParameter: 0.25,
      }));
      let updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.5646866)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.7269342)).lessThan(1e-6);

      // Second attempt (different dimension, so expect no change to updatedAbilities[0])
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[1].uri,
        outcome: 1,
        guessingParameter: 0.25,
      }));
      updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.5646866)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.7269342)).lessThan(1e-6);
      Should(updatedAbilities.length).equal(2);

      // Third attempt (exercises that we properly filter out the previous attempt when updating the ability estimate)
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[2].uri,
        outcome: 1,
        guessingParameter: 0.25,
      }));
      updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.6544609)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.7009669)).lessThan(1e-6);

      // Fourth attempt
      AttemptProcessor.processAttempt(AttemptProcessor.prepareAttempt({
        itemURI: TestConstants.items[3].uri,
        outcome: 0,
        guessingParameter: 0.25,
      }));
      updatedAbilities = State.get('latentAbilities.' + TestConstants.learnerId);
      Should(Math.abs(updatedAbilities[0].mean - 0.4266929)).lessThan(1e-6);
      Should(Math.abs(updatedAbilities[0].standardDeviation - 0.6435669)).lessThan(1e-6);
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
