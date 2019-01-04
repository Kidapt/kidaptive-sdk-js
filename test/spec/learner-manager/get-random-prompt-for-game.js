'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import LearnerManager from '../../../src/learner-manager';
import RecommendationManager from '../../../src/recommendation-manager';
import State from '../../../src/state';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('getRandomPromptForGame', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setStateOptions({tier: 3});
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('getRecommendation is called with correct parameters', () => {
      let stubKey;
      let stubParams;
      const stubGetRecommendation = Sinon.stub(RecommendationManager, 'getRecommendation').callsFake((key, params) => {
        stubKey = key;
        stubParams = params;
        return {
          recommendations: [],
          type: 'prompt'
        };
      });
      Should(stubGetRecommendation.called).false();
      LearnerManager.getRandomPromptForGame('gameUri', 10, ['exclude'], ['include']);
      Should(stubGetRecommendation.called).true();
      Should(stubKey).equal('random');
      Should(stubParams).deepEqual({
        gameUri: 'gameUri',
        maxResults: 10, 
        excludedPromptUris: ['exclude'], 
        includedPromptUris: ['include']
      });
      stubGetRecommendation.restore();
    });

    it('Recommender is called with correct parameters', () => {
      let stubParams;
      const stubRecommender = Sinon.stub().callsFake(params => {
        stubParams = params;
        return {
          recommendations: [],
          type: 'prompt'
        };
      });
      TestUtils.setState({recommenders: {random: {getRecommendation: stubRecommender}}});
      Should(stubRecommender.called).false();
      LearnerManager.getRandomPromptForGame('gameUri', 10, ['exclude'], ['include']);
      Should(stubRecommender.called).true();
      Should(stubParams).deepEqual({
        gameUri: 'gameUri', 
        maxResults: 10, 
        excludedPromptUris: ['exclude'], 
        includedPromptUris: ['include']
      });
    });

    it('Error is captured and thrown', () => {
      const stubRecommender = Sinon.stub().callsFake(params => {
        return {
          error: new Error('Some error')
        };
      });
      TestUtils.setState({recommenders: {random: {getRecommendation: stubRecommender}}});
      Should.throws(() => { 
        LearnerManager.getRandomPromptForGame();
      }, Error);
    });

    it('If no error, recommendations are returned', () => {
      const stubRecommender = Sinon.stub().callsFake(params => {
        return {
          recommendations: ['rec1', 'rec2'],
          type: 'prompt'
        };
      });
      TestUtils.setState({recommenders: {random: {getRecommendation: stubRecommender}}});
      Should(LearnerManager.getRandomPromptForGame()).deepEqual(['rec1', 'rec2']);
    });

  }); //END getRandomPromptForGame

}; //END export
