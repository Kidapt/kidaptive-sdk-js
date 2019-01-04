'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import ModelManager from '../../../src/model-manager';
import Should from 'should';

export default () => {

  describe('local-dimension', () => {

    const modelList = [
      {id: 1, uri: '/local-dimension/1', name: 'Local Dimension 1', dimension: {id: 1, uri: '/dimension/1', name: 'Dimension 1'}},
      {id: 2, uri: '/local-dimension/2', name: 'Local Dimension 2', dimension: {id: 2, uri: '/dimension/2', name: 'Dimension 2'}},
      {id: 3, uri: '/local-dimension/3', name: 'Local Dimension 3', dimension: {id: 3, uri: '/dimension/3', name: 'Dimension 3'}}
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
        modelListLookup: {'local-dimension': modelList},
        uriToModel: {'local-dimension': uriLookup}
      });
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('getLocalDimensions', () => {

      it('if local dimensions exist return array of local dimensions', () => {
        Should(ModelManager.getLocalDimensions()).deepEqual(modelList);
      });

      it('if no local dimensions exist return empty array', () => {
        TestUtils.setState({modelListLookup: undefined});
        Should(ModelManager.getLocalDimensions()).deepEqual([]);
      });

    }); //END getLocalDimensions

    describe('getLocalDimensionByUri', () => {

      it('if localDimensionUri exists, return the local dimension object', () => {
        Should(ModelManager.getLocalDimensionByUri(modelList[0].uri)).deepEqual(modelList[0]);
        Should(ModelManager.getLocalDimensionByUri(modelList[1].uri)).deepEqual(modelList[1]);
        Should(ModelManager.getLocalDimensionByUri(modelList[2].uri)).deepEqual(modelList[2]);
      });

      it('if localDimensionUri does not exist return undefined', () => {
        Should(ModelManager.getLocalDimensionByUri('')).equal(undefined);
      });

      describe('localDimensionUri is required and must be a string', () => {
        const testFunction = parameter => {
          return ModelManager.getLocalDimensionByUri(parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      });

    }); //END getLocalDimensionByUri

  }); //END local-dimension

}; //END export
