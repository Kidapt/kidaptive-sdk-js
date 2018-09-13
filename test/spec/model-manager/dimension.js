'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import ModelManager from '../../../src/model-manager';
import Should from 'should';

export default () => {

  describe('dimension', () => {

    const modelList = [
      {id: 1, uri: '/dimension/1', name: 'Dimension 1'},
      {id: 1, uri: '/dimension/2', name: 'Dimension 2'},
      {id: 1, uri: '/dimension/3', name: 'Dimension 3'}
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
        modelListLookup: {dimension: modelList},
        uriToModel: {dimension: uriLookup}
      });
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('getDimensions', () => {

      it('if dimensions exist return array of dimensions', () => {
        Should(ModelManager.getDimensions()).deepEqual(modelList);
      });

      it('if no dimensions exist return empty array', () => {
        TestUtils.setState({modelListLookup: undefined});
        Should(ModelManager.getDimensions()).deepEqual([]);
      });

    }); //END getDimensions

    describe('getDimensionByUri', () => {

      it('if dimensionUri exists, return the dimension object', () => {
        Should(ModelManager.getDimensionByUri(modelList[0].uri)).deepEqual(modelList[0]);
        Should(ModelManager.getDimensionByUri(modelList[1].uri)).deepEqual(modelList[1]);
        Should(ModelManager.getDimensionByUri(modelList[2].uri)).deepEqual(modelList[2]);
      });

      it('if dimensionUri does not exist return undefined', () => {
        Should(ModelManager.getDimensionByUri('')).equal(undefined);
      });

      describe('dimensionUri is required and must be a string', () => {
        const testFunction = parameter => {
          return ModelManager.getDimensionByUri(parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      });

    }); //END getDimensionByUri

  }); //END dimension

}; //END export
