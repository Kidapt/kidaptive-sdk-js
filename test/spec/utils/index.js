'use strict';
import DataManipulation from './data-manipulation';
import LocalStorage from './local-storage';
import StateChecking from './state-checking';
import TypeChecking from './type-checking';

export default () => {

  describe('Utils', () => {

    StateChecking();
    TypeChecking();
    LocalStorage();
    DataManipulation();

  }); //END Utils

}; //END export
