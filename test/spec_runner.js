'use strict';
//import AttemptProcessor from './spec/attempt-processor/';
import Constants from './spec/constants/';
import Core from './spec/core/';
import Error from './spec/error/';
import EventManager from './spec/event-manager/';
import HttpClient from './spec/http-client/';
import LearnerManager from './spec/learner-manager/';
import OperationManager from './spec/operation-manager/';
//import RecommendationManager from './spec/recommendation-manager/';
import State from './spec/state/';
//import Tier1 from './spec/tier1/';
//import Tier2 from './spec/tier2/';
//import Tier3 from './spec/tier3/';
import Utils from './spec/utils/';

describe('Kidaptive SDK Tests', () => {

  Constants();
  Error();
  State();
  Utils();
  OperationManager();
  HttpClient();
  //AttemptProcessor();
  EventManager();
  //RecommendationManager();
  LearnerManager();
  Core();
  //Tier1();
  //Tier2();
  //Tier3();

}); //END Kidaptive SDK Tests

mocha.checkLeaks();
mocha.run();
