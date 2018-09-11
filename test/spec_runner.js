'use strict';
import AttemptProcessor from './spec/attempt-processor/';
import Constants from './spec/constants/';
import Core from './spec/core/';
import Error from './spec/error/';
import EventManager from './spec/event-manager/';
import HttpClient from './spec/http-client/';
import LearnerManager from './spec/learner-manager/';
//import ModelManager from './spect/model-manager/';
import OperationManager from './spec/operation-manager/';
//import RecommendationManager from './spec/recommendation-manager/';
import State from './spec/state/';
import Tiers from './spec/tiers/';
import Utils from './spec/utils/';

describe('Kidaptive SDK Tests', () => {

  Constants();
  Error();
  State();
  Utils();
  OperationManager();
  HttpClient();
  //ModelManager();
  //RecommendationManager();
  LearnerManager();
  AttemptProcessor();
  EventManager();
  Core();
  Tiers();

}); //END Kidaptive SDK Tests

mocha.checkLeaks();
mocha.run();
