'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import ModelManager from '../../../src/model-manager';
import Should from 'should';

export default () => {

  describe('game', () => {

    const modelList = [
      {id: 1, uri: '/game/1', name: 'Game 1'},
      {id: 2, uri: '/game/2', name: 'Game 2'},
      {id: 3, uri: '/game/3', name: 'Game 3'}
    ];

    const uriLookup = {
      [modelList[0].uri]: modelList[0],
      [modelList[1].uri]: modelList[1],
      [modelList[2].uri]: modelList[2]
    };

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setState({
        modelListLookup: {game: modelList},
        uriToModel: {game: uriLookup}
      });
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('getGames', () => {

      it('if games exist return array of games', () => {
        Should(ModelManager.getGames()).deepEqual(modelList);
      });

      it('if no games exist return empty array', () => {
        TestUtils.setState({modelListLookup: undefined});
        Should(ModelManager.getGames()).deepEqual([]);
      });

    }); //END getGames

    describe('getGameByUri', () => {

      it('if gameUri exists, return the game object', () => {
        Should(ModelManager.getGameByUri(modelList[0].uri)).deepEqual(modelList[0]);
        Should(ModelManager.getGameByUri(modelList[1].uri)).deepEqual(modelList[1]);
        Should(ModelManager.getGameByUri(modelList[2].uri)).deepEqual(modelList[2]);
      });

      it('if gameUri does not exist return undefined', () => {
        Should(ModelManager.getGameByUri('')).equal(undefined);
      });

      describe('gameUri is required and must be a string', () => {
        const testFunction = parameter => {
          return ModelManager.getGameByUri(parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      });

    }); //END getGameByUri

  }); //END game

}; //END export
