'use strict';
import ClearActiveLearner from './clear-active-learner';
import GetActiveLearner from './get-active-learner';
import GetLearnerList from './get-learner-list';
import GetUser from './get-user';
import Logout from './logout';
import SelectActiveLearner from './select-active-learner';
import SetUser from './set-user';

export default () => {

  describe('Learner Manager', () => {

    SetUser();
    SelectActiveLearner();
    Logout();
    ClearActiveLearner();
    GetUser();
    GetActiveLearner();
    GetLearnerList();

  }); //END Learner Manager

}; //END export
