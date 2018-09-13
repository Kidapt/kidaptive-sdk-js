'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import ModelManager from '../../../src/model-manager';
import State from '../../../src/state';
import Utils from '../../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('updateModels', () => {

    let server;

    const urlBase = 'https://develop.kidaptive.com/v3';

    const oldState = {
      uriToModel: {'game': {'old':{}}, 'dimension': {'old':{}}, 'local-dimension': {'old':{}}, 'prompt': {'old':{}}, 'item': {'old':{}}},
      idToModel: {'game': {'old':{}}, 'dimension': {'old':{}}, 'local-dimension': {'old':{}}, 'prompt': {'old':{}}, 'item': {'old':{}}},
      modelListLookup: {'game': [{}], 'dimension': [{}], 'local-dimension': [{}], 'prompt': [{}], 'item': [{}]}
    };

    const serverResponses = {
      'game': [{id: 1, uri: '/game/1', name: 'Game 1'},{id: 2, uri: '/game/2', name: 'Game 2'},{id: 3, uri: '/game/3', name: 'Game 3'}],
      'dimension': [{id: 1, uri: '/dimension/1', name: 'Dimension 1'},{id: 2, uri: '/dimension/2', name: 'Dimension 2'},{id: 3, uri: '/dimension/3', name: 'Dimension 3'}],
      'local-dimension': [  {id: 1, uri: '/local-dimension/1', name: 'Local Dimension 1', dimensionId: 1, gameId: 1},{id: 2, uri: '/local-dimension/2', name: 'Local Dimension 2', dimensionId: 2, gameId: 2},{id: 3, uri: '/local-dimension/3', name: 'Local Dimension 3', dimensionId: 3, gameId: 3}],
      'prompt': [{id: 1, uri: '/prompt/1', key: 'prompt1', gameId: 1},{id: 2, uri: '/prompt/2', key: 'prompt2', gameId: 2},{id: 3, uri: '/prompt/3', key: 'prompt3', gameId: 3}],
      'item': [{id: 1, uri: '/item/1', promptId: 1, localDimensionId: 1},{id: 2, uri: '/item/2', promptId: 2, localDimensionId: 2},{id: 3, uri: '/item/3', promptId: 3, localDimensionId: 3}]
    };

    const expectedResult = {
      uriToModel: {'game': {}, 'dimension': {}, 'local-dimension': {}, 'prompt': {}, 'item': {}},
      idToModel: {'game': {}, 'dimension': {}, 'local-dimension': {}, 'prompt': {}, 'item': {}},
      modelListLookup: {'game': [], 'dimension': [], 'local-dimension': [], 'prompt': [], 'item': []}
    };

    //store uri and id lookups
    Object.keys(serverResponses).forEach(modelName => {
      const modelList = Utils.copyObject(serverResponses[modelName]);
      modelList.forEach(model => {
        expectedResult.uriToModel[modelName][model.uri] = model;
        expectedResult.idToModel[modelName][model.id] = model;
      });
      expectedResult.modelListLookup[modelName] = modelList;
    });

    //create parent references and delete IDs in expected result
    expectedResult.modelListLookup['local-dimension'].forEach(localDimension => {
      localDimension['dimension'] = expectedResult.idToModel['dimension'][localDimension.dimensionId];
      delete localDimension.dimensionId;
      localDimension['game'] = expectedResult.idToModel['game'][localDimension.gameId];
      delete localDimension.gameId;
    });
    expectedResult.modelListLookup['prompt'].forEach(prompt => {
      prompt['game'] = expectedResult.idToModel['game'][prompt.gameId];
      delete prompt.gameId;
    });
    expectedResult.modelListLookup['item'].forEach(item => {
      item['prompt'] = expectedResult.idToModel['prompt'][item.promptId];
      delete item.promptId;
      item['localDimension'] = expectedResult.idToModel['local-dimension'][item.localDimensionId];
      delete item.localDimensionId;
    });


    before(() => {
      server = Sinon.fakeServer.create()
    });

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      server.resetHistory();
      server.respondImmediately = true;
      server.respondWith('GET', urlBase + '/game', [200, {'Content-Type': 'application/json'}, JSON.stringify(serverResponses['game'])]);
      server.respondWith('GET', urlBase + '/dimension', [200, {'Content-Type': 'application/json'}, JSON.stringify(serverResponses['dimension'])]);
      server.respondWith('GET', urlBase + '/local-dimension', [200, {'Content-Type': 'application/json'}, JSON.stringify(serverResponses['local-dimension'])]);
      server.respondWith('GET', urlBase + '/prompt', [200, {'Content-Type': 'application/json'}, JSON.stringify(serverResponses['prompt'])]);
      server.respondWith('GET', urlBase + '/item', [200, {'Content-Type': 'application/json'}, JSON.stringify(serverResponses['item'])]);
    });

    after(() => {
      TestUtils.resetStateAndCache();
      server.restore();
    });

    describe('resolves when ALL api complete', () => {

      it('all endpoints resolve, promise resolves', () => {
        Should(server.requests.length).equal(0);
        return Should(ModelManager.updateModels()).resolved().then(() => {
          Should(server.requests.length).equal(5);
        });
      });

      it('models are availabe as soon as promise resolves', () => {
        Should(ModelManager.getGames()).deepEqual([]);
        Should(ModelManager.getDimensions()).deepEqual([]);
        Should(ModelManager.getLocalDimensions()).deepEqual([]);
        Should(ModelManager.getPrompts()).deepEqual([]);
        Should(ModelManager.getItems()).deepEqual([]);
        return Should(ModelManager.updateModels()).resolved().then(() => {
          Should(ModelManager.getGames()).deepEqual(expectedResult.modelListLookup['game']);
          Should(ModelManager.getDimensions()).deepEqual(expectedResult.modelListLookup['dimension']);
          Should(ModelManager.getLocalDimensions()).deepEqual(expectedResult.modelListLookup['local-dimension']);
          Should(ModelManager.getPrompts()).deepEqual(expectedResult.modelListLookup['prompt']);
          Should(ModelManager.getItems()).deepEqual(expectedResult.modelListLookup['item']);
        });
      });

      it('if resolves, replaces old models', () => {
        TestUtils.setState(oldState);

        Should(ModelManager.getGames()).deepEqual(oldState.modelListLookup['game']);
        Should(ModelManager.getDimensions()).deepEqual(oldState.modelListLookup['dimension']);
        Should(ModelManager.getLocalDimensions()).deepEqual(oldState.modelListLookup['local-dimension']);
        Should(ModelManager.getPrompts()).deepEqual(oldState.modelListLookup['prompt']);
        Should(ModelManager.getItems()).deepEqual(oldState.modelListLookup['item']);

        Should(ModelManager.getGameByUri('old')).deepEqual(oldState.uriToModel['game']['old']);
        Should(ModelManager.getDimensionByUri('old')).deepEqual(oldState.uriToModel['dimension']['old']);
        Should(ModelManager.getLocalDimensionByUri('old')).deepEqual(oldState.uriToModel['local-dimension']['old']);
        Should(ModelManager.getPromptByUri('old')).deepEqual(oldState.uriToModel['prompt']['old']);
        Should(ModelManager.getItemByUri('old')).deepEqual(oldState.uriToModel['item']['old']);

        return Should(ModelManager.updateModels()).resolved().then(() => {
          Should(ModelManager.getGames()).deepEqual(expectedResult.modelListLookup['game']);
          Should(ModelManager.getDimensions()).deepEqual(expectedResult.modelListLookup['dimension']);
          Should(ModelManager.getLocalDimensions()).deepEqual(expectedResult.modelListLookup['local-dimension']);
          Should(ModelManager.getPrompts()).deepEqual(expectedResult.modelListLookup['prompt']);
          Should(ModelManager.getItems()).deepEqual(expectedResult.modelListLookup['item']);

          Should(ModelManager.getGameByUri('old')).equal(undefined);
          Should(ModelManager.getDimensionByUri('old')).equal(undefined);
          Should(ModelManager.getLocalDimensionByUri('old')).equal(undefined);
          Should(ModelManager.getPromptByUri('old')).equal(undefined);
          Should(ModelManager.getItemByUri('old')).equal(undefined);
        });
      });

    }); //END resolves when ALL api complete

    describe('API error handled', () => {

      describe('rejects if there is any model error', () => {

        ModelManager.modelOrder.tier3.forEach(modelName => {
          it(modelName + ' rejects', () => {
            server.respondWith('GET', urlBase + '/' + modelName, [0, {}, '']);
            return Should(ModelManager.updateModels()).rejected();
          });
        });

      }); //END rejects if there is any model get error

      it('if ANY model errors out, models will be cleared', () => {
        TestUtils.setState(oldState);
        server.respondWith('GET', urlBase + '/game', [0, {}, '']);
        return Should(ModelManager.updateModels()).rejected().then(() => {
          Should(State.get('modelListLookup')).deepEqual({});
          Should(State.get('idToModel')).deepEqual({});
          Should(State.get('uriToModel')).deepEqual({});
        });
      });

    }); //END API error handled

    describe('state is updated with lookup maps and lists', () => {

      it('lists are in correct format', () => {
        return Should(ModelManager.updateModels()).resolved().then(() => {
          Should(State.get('modelListLookup')).deepEqual(expectedResult.modelListLookup);
        });
      });

      it('id maps are in correct format', () => {
        return Should(ModelManager.updateModels()).resolved().then(() => {
          Should(State.get('idToModel')).deepEqual(expectedResult.idToModel);
        });
      });

      it('uri maps are in correct format', () => {
        return Should(ModelManager.updateModels()).resolved().then(() => {
          Should(State.get('uriToModel')).deepEqual(expectedResult.uriToModel);
        });
      });

    }); //END updates state with maps and list

    describe('objects have parents attached', () => {

      it('local dimension has dimension and game subobjects', () => {
        return Should(ModelManager.updateModels()).resolved().then(() => {
          ModelManager.getLocalDimensions().forEach(localDimension => {
            Should(localDimension.gameId).equal(undefined);
            Should(localDimension.game).Object();
            Should(localDimension.dimensionId).equal(undefined);
            Should(localDimension.dimension).Object();
          });
        });
      });

      it('prompt has game subobject', () => {
        return Should(ModelManager.updateModels()).resolved().then(() => {
          ModelManager.getPrompts().forEach(prompt => {
            Should(prompt.gameId).equal(undefined);
            Should(prompt.game).Object();
          });
        });
      });

      it('item has local dimension, prompt subobjects, which also have corresponding subobjects', () => {
        return Should(ModelManager.updateModels()).resolved().then(() => {
          ModelManager.getItems().forEach(item => {
            Should(item.localDimensionId).equal(undefined);
            Should(item.localDimension).Object();
            Should(item.localDimension.gameId).equal(undefined);
            Should(item.localDimension.game).Object();
            Should(item.localDimension.dimensionId).equal(undefined);
            Should(item.localDimension.dimension).Object();
            Should(item.promptId).equal(undefined);
            Should(item.prompt).Object();
            Should(item.prompt.gameId).equal(undefined);
            Should(item.prompt.game).Object();
          });
        });
      });

    }); //END objects have parents attached

    describe('API endpoint resolution order should not matter', () => {

      beforeEach(() => {
        server.autoRespond = false;
        server.respondImmediately = false;
      });

      it('reverse resolution order', () => {
        setTimeout(() => {
          //reverse order of responses
          Utils.copyObject(ModelManager.modelOrder.tier3).reverse().forEach(modelName => {
            server.requests.forEach(request => {
              if(request.url === (urlBase + '/' + modelName)) {
                request.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(serverResponses[modelName]));
              }
            });
          });
        });

        return Should(ModelManager.updateModels()).resolved().then(() => {
          Should(State.get('modelListLookup')).deepEqual(expectedResult.modelListLookup);
          Should(State.get('idToModel')).deepEqual(expectedResult.idToModel);
          Should(State.get('uriToModel')).deepEqual(expectedResult.uriToModel);
        });
      });

    }); //END API endpoint resolution order should not matter

  }); //END updateModels

}; //END export
