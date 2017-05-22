import Promise = require("bluebird");

import {KidaptiveErrorCode, KidaptiveError} from "./kidaptive_error";
import {User, Learner} from "../../../swagger-client/api";

/**
 * Created by solomonliu on 7/11/16.
 */

interface LearnerManagerDelegate {
    getCurrentUser: () => User;
    getAppApiKey: () => string;
    getSwagger: () => any;
}

class LearnerManager {
    private learnerMap: {[key: number]: Learner} = {};

    constructor(private delegate: LearnerManagerDelegate){
        if (!delegate) {
            throw new KidaptiveError(KidaptiveErrorCode.MISSING_DELEGATE, "LearnerManagerDelegate not found");
        }
    }

    syncLearnerList(): Promise<Learner[]> {
        let currentUser = this.delegate.getCurrentUser();
        if (!currentUser) {
            throw new KidaptiveError(KidaptiveErrorCode.NOT_LOGGED_IN, "not logged in");
        }

        return this.delegate.getSwagger().learner.get_learner({"Api-Key": this.delegate.getAppApiKey()}).then(function(success:any) {
            return {body: success.obj};
        }, function(fail) {
            return Promise.reject(fail.errorObj);
        }).then(function(data) {
            let learners: {[key: number]: Learner} = {};
            for (let l of data.body) {
                learners[l.id] = l;
                this.learnerMap = learners;
            }
            this.storeLearners();
            return data.body;
        }.bind(this)).catch(function(error) {
            if (error.response) {
                if (error.response.statusCode == 401) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, error.response.statusMessage));
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, error.response.statusMessage));
                }
            } else {
                return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
            }
        }) as Promise<Learner[]>;
    }

    listLearners(): Learner[] {
        let learnerList:Learner[] = [];
        for (let i in this.learnerMap) {
            learnerList.push(this.learnerMap[i]);
        }

        return learnerList;
    }

    getLearner(learnerId:number): Learner {
        return this.learnerMap[learnerId];
    }

    //clears local copy of learner info; used when logging out
    clearLearnerList() {
        this.learnerMap = {};
        LearnerManager.deleteStoredLearners();
    }

    private storeLearners() {
        localStorage.setItem('kidaptive.alp.learners', JSON.stringify(this.learnerMap))
    }

    loadStoredLearners() {
        this.learnerMap = JSON.parse(localStorage.getItem('kidaptive.alp.learners'));
    }

    private static deleteStoredLearners() {
        localStorage.removeItem('kidaptive.alp.learners');
    }
}

export {LearnerManagerDelegate, LearnerManager}