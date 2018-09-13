'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import ModelManager from '../../../src/model-manager';
import Should from 'should';

export default () => {

  describe('item', () => {

    const prompt1ModelList = [
      {id: 1, uri: '/item/1', prompt: {id: 1, uri: '/prompt/1', key: 'prompt1'}},
      {id: 2, uri: '/item/2', prompt: {id: 1, uri: '/prompt/1', key: 'prompt1'}}
    ];

    const prompt2ModelList = [
      {id: 3, uri: '/item/3', prompt: {id: 2, uri: '/prompt/2', key: 'prompt2'}},
      {id: 4, uri: '/item/4', prompt: {id: 2, uri: '/prompt/2', key: 'prompt2'}}
    ];

    const prompt3ModelList = [
      {id: 5, uri: '/item/5', prompt: {id: 3, uri: '/prompt/3', key: 'prompt3'}}
    ];

    const modelList = prompt1ModelList.concat(prompt2ModelList).concat(prompt3ModelList);

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
        modelListLookup: {item: modelList},
        uriToModel: {item: uriLookup}
      });
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('getItems', () => {

      it('if items exist return array of items', () => {
        Should(ModelManager.getItems()).deepEqual(modelList);
      });

      it('if no items exist return empty array', () => {
        TestUtils.setState({modelListLookup: undefined});
        Should(ModelManager.getItems()).deepEqual([]);
      });

    }); //END getItems

    describe('getItemByUri', () => {

      it('if itemUri exists, return the item object', () => {
        Should(ModelManager.getItemByUri(modelList[0].uri)).deepEqual(modelList[0]);
        Should(ModelManager.getItemByUri(modelList[1].uri)).deepEqual(modelList[1]);
        Should(ModelManager.getItemByUri(modelList[2].uri)).deepEqual(modelList[2]);
        Should(ModelManager.getItemByUri(modelList[3].uri)).deepEqual(modelList[3]);
        Should(ModelManager.getItemByUri(modelList[4].uri)).deepEqual(modelList[4]);
      });

      it('if itemUri does not exist return undefined', () => {
        Should(ModelManager.getItemByUri('')).equal(undefined);
      });

      describe('itemUri is required and must be a string', () => {
        const testFunction = parameter => {
          return ModelManager.getItemByUri(parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      });

    }); //END getItemByUri

    describe('getItemsByPromptUri', () => {

      it('if promptUri exists, return the array of items for that prompt', () => {
        Should(ModelManager.getItemsByPromptUri(prompt1ModelList[0].prompt.uri)).deepEqual(prompt1ModelList);
        Should(ModelManager.getItemsByPromptUri(prompt2ModelList[0].prompt.uri)).deepEqual(prompt2ModelList);
        Should(ModelManager.getItemsByPromptUri(prompt3ModelList[0].prompt.uri)).deepEqual(prompt3ModelList);
      });

      it('if promptUri does not exist return empty array', () => {
        Should(ModelManager.getItemsByPromptUri('')).deepEqual([]);
      });

      describe('promptUri is required and must be a string', () => {
        const testFunction = parameter => {
          return ModelManager.getItemsByPromptUri(parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      });

    }); //END getItemsByPromptUri

  }); //END item

}; //END export
