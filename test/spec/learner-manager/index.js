'use strict';
import ClearActiveLearner from './clear-active-learner';
import GetActiveLearner from './get-active-learner';
import GetInsights from './get-insights';
import GetLatentAbilityEstimate from './get-latent-ability-estimate';
import GetLatentAbilityEstimates from './get-latent-ability-estimates';
import GetLatestInsightByUri from './get-latest-insight-by-uri';
import GetLearnerList from './get-learner-list';
import GetLocalAbilityEstimate from './get-local-ability-estimate';
import GetLocalAbilityEstimates from './get-local-ability-estimates';
import GetMetricsByUri from './get-metrics-by-uri';
import GetRandomPromptForGame from './get-random-prompt-for-game';
import GetSuggestedPrompts from './get-suggested-prompts';
import GetUser from './get-user';
import Logout from './logout';
import SelectActiveLearner from './select-active-learner';
import SetUser from './set-user';
import StartTrial from './start-trial';
import UpdateAbilityEstimates from './update-ability-estimates';


export default () => {

  describe('Learner Manager', () => {

    Logout();
    SetUser();
    StartTrial();
    SelectActiveLearner();
    ClearActiveLearner();
    GetUser();
    GetActiveLearner();
    GetLearnerList();
    GetInsights();
    GetLatestInsightByUri();
    GetMetricsByUri()
    UpdateAbilityEstimates();
    GetLatentAbilityEstimate();
    GetLatentAbilityEstimates();
    GetLocalAbilityEstimate();
    GetLocalAbilityEstimates();
    GetRandomPromptForGame();
    GetSuggestedPrompts();

  }); //END Learner Manager

}; //END export
