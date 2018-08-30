/**
 * Created by cameronperry on 2017-11-07.
 */
'use strict';
//import Constants from './spec/constants.js';
//import Error from './spec/error.js';
//import Utils from './spec/utils.js';
//import State from './spec/state.js';
//import OperationManager from './spec/operation-manager.js';
//import HttpClient from './spec/http-client.js';
//import EventManager from './spec/event-manager.js';
import LearnerManager from './spec/learner-manager/';
//import Core from './spec/core.js';
//import Tier1 from './spec/tier1.js';


describe('Kidaptive SDK Tests', () => {

  LearnerManager();


}); //END Kidaptive SDK Tests

mocha.checkLeaks();
mocha.run();
