'use strict';
import Tier1Interface from './tier1-interface';
import Tier1Logic from './tier1-logic';
import Tier2Interface from './tier2-interface';
import Tier2Logic from './tier2-logic';
import Tier3Interface from './tier3-interface';
import Tier3Logic from './tier3-logic';

export default () => {

  describe('Tiers', () => {

    Tier1Interface();
    Tier1Logic();
    Tier2Interface();
    Tier2Logic();
    Tier3Interface();
    Tier3Logic();

  }); //END Tiers

}; //END export
