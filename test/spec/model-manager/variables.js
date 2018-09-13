'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import ModelManager from '../../../src/model-manager';
import Should from 'should';

export default () => {

  describe('variables', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('ModelManager.modelParents is set', () => {

      it('tier1', () => {
        Should(ModelManager.modelParents['tier1']).equal(undefined);
      });

      it('tier2', () => {
        Should(ModelManager.modelParents['tier2']).Object();
        Object.keys(ModelManager.modelParents['tier2']).forEach(modelName => {
          Should(ModelManager.modelParents['tier2'][modelName]).Array();
          ModelManager.modelParents['tier2'][modelName].forEach(parentName => {
            Should(parentName).String();
            //should exist in model parents source
            Should(ModelManager.modelParents['tier2'][parentName]).Array();
          })
        });
      });

      it('tier3', () => {
        Should(ModelManager.modelParents['tier3']).Object();
        Object.keys(ModelManager.modelParents['tier3']).forEach(modelName => {
          Should(ModelManager.modelParents['tier3'][modelName]).Array();
          ModelManager.modelParents['tier3'][modelName].forEach(parentName => {
            Should(parentName).String();
            //should exist in model parents source
            Should(ModelManager.modelParents['tier3'][parentName]).Array();
          })
        });
      });

    });

    describe('ModelManager.modelOrder is set', () => {

      it('tier1', () => {
        Should(ModelManager.modelOrder['tier1']).equal(undefined);
      });

      it('tier2', () => {
        Should(ModelManager.modelOrder['tier2']).Array();
        ModelManager.modelOrder['tier2'].forEach(modelName => {
          Should(modelName).String();
          //should exist in model parents source
          Should(ModelManager.modelParents['tier2'][modelName]).Array();
        });
      });

      it('tier3', () => {
        Should(ModelManager.modelOrder['tier3']).Array();
        ModelManager.modelOrder['tier3'].forEach(modelName => {
          Should(modelName).String();
          //should exist in model parents source
          Should(ModelManager.modelParents['tier3'][modelName]).Array();
        });
      });

    });

  }); //END variables

}; //END export
