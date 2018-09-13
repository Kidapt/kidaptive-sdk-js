'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import ModelManager from '../../../src/model-manager';
import Should from 'should';

export default () => {

  describe('prompt', () => {

    const game1ModelList = [
      {id: 1, uri: '/prompt/1', key: 'prompt1', game: {id: 1, uri: '/game/1', name: 'Game 1'}},
      {id: 2, uri: '/prompt/2', key: 'prompt2', game: {id: 1, uri: '/game/1', name: 'Game 1'}}
    ];

    const game2ModelList = [
      {id: 3, uri: '/prompt/3', key: 'prompt3', game: {id: 2, uri: '/game/2', name: 'Game 2'}},
      {id: 4, uri: '/prompt/4', key: 'prompt4', game: {id: 2, uri: '/game/2', name: 'Game 2'}}
    ];

    const game3ModelList = [
      {id: 5, uri: '/prompt/5', key: 'prompt5', game: {id: 3, uri: '/game/3', name: 'Game 3'}}
    ];

    const modelList = game1ModelList.concat(game2ModelList).concat(game3ModelList);

    const uriLookup = {
      [modelList[0].uri]: modelList[0],
      [modelList[1].uri]: modelList[1],
      [modelList[2].uri]: modelList[2],
      [modelList[3].uri]: modelList[3],
      [modelList[4].uri]: modelList[4]
    };

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setState({
        modelListLookup: {prompt: modelList},
        uriToModel: {prompt: uriLookup}
      });
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('getPrompts', () => {

      it('if prompts exist return array of prompts', () => {
        Should(ModelManager.getPrompts()).deepEqual(modelList);
      });

      it('if no prompts exist return empty array', () => {
        TestUtils.setState({modelListLookup: undefined});
        Should(ModelManager.getPrompts()).deepEqual([]);
      });

    }); //END getPrompts

    describe('getPromptByUri', () => {

      it('if promptUri exists, return the prompt object', () => {
        Should(ModelManager.getPromptByUri(modelList[0].uri)).deepEqual(modelList[0]);
        Should(ModelManager.getPromptByUri(modelList[1].uri)).deepEqual(modelList[1]);
        Should(ModelManager.getPromptByUri(modelList[2].uri)).deepEqual(modelList[2]);
        Should(ModelManager.getPromptByUri(modelList[3].uri)).deepEqual(modelList[3]);
        Should(ModelManager.getPromptByUri(modelList[4].uri)).deepEqual(modelList[4]);
      });

      it('if promptUri does not exist return undefined', () => {
        Should(ModelManager.getPromptByUri('')).equal(undefined);
      });

      describe('promptUri is required and must be a string', () => {
        const testFunction = parameter => {
          return ModelManager.getPromptByUri(parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      });

    }); //END getPromptByUri

    describe('getPromptsByGameUri', () => {

      it('if gameUri exists, return the array of prompts for that game', () => {
        Should(ModelManager.getPromptsByGameUri(game1ModelList[0].game.uri)).deepEqual(game1ModelList);
        Should(ModelManager.getPromptsByGameUri(game2ModelList[0].game.uri)).deepEqual(game2ModelList);
        Should(ModelManager.getPromptsByGameUri(game3ModelList[0].game.uri)).deepEqual(game3ModelList);
      });

      it('if gameUri does not exist return empty array', () => {
        Should(ModelManager.getPromptsByGameUri('')).deepEqual([]);
      });

      describe('gameUri is required and must be a string', () => {
        const testFunction = parameter => {
          return ModelManager.getPromptsByGameUri(parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      });

    }); //END getPromptsByGameUri

  }); //END prompt

}; //END export
