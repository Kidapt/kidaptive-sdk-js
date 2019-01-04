'use strict';
import optimalDifficulty from './optimal-difficulty';
import random from './random';

export default () => {

  describe('Recommenders', () => {

    optimalDifficulty();
    random();

  }); //END Recommenders

}; //END export
