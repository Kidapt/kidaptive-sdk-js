'use strict';
import Dimension from './dimension';
import Game from './game';
import Item from './item';
import LocalDimension from './local-dimension';
import Prompt from './prompt';
import UpdateModels from './update-models';
import Variables from './variables';

export default () => {

  describe('Model Manager', () => {

    Game();
    Dimension();
    LocalDimension();
    Prompt();
    Item();
    Variables();
    UpdateModels();

  }); //END Model Manager

}; //END export
