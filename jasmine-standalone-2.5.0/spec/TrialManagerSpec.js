describe("Trial Management", function() {
    var user = {
        email: Date.now() + "trial@kidaptive.com",
        password: "password"
    };

    var sdk;
    var sdkPromise;
    beforeAll(function() {
        localStorage.clear();
        sdkPromise = KidaptiveSdk.init(appKey, {version:"1.0", build:expAppInfo.build}, swaggerUrl).then(function(data) {
            sdk = data;
            return sdk.refreshUser();
        }).then(function() {
            var learners = sdk.getLearnerList();
            var delPromise;
            for (var index in learners) {
                var delFunction = function (index, learnerId) {
                    if (index == 0) {
                        delPromise = sdk.deleteLearner(learnerId);
                    } else {
                        delPromise = delPromise.then(function() {
                            return sdk.deleteLearner(learnerId);
                        });
                    }
                };
                delFunction(index, learners[index].id);
            }
            return delPromise.then(function() {
                return sdk;
            });
        }).catch(function (error) {
            console.log(error);
        });
    });

    it("start trial no user", function(done) {
        sdkPromise = sdkPromise.then(function(sdk) {
            expect(sdk.getCurrentTrial(1)).toBeFalsy();
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            sdk.startTrial();
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("LEARNER_NOT_FOUND");
        }).then(function() {
            sdk.startTrial(1);
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("LEARNER_NOT_FOUND");
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("normal start and end trial", function(done) {
        var learnerId1;
        var learnerId2;
        sdkPromise = sdkPromise.then(function() {
            return sdk.createLearner("learner");
        }).then(function(learner) {
            learnerId1 = learner.id;
            return sdk.createLearner("learner");
        }).then(function(learner) {
            learnerId2 = learner.id;
            expect(sdk.getCurrentTrial(learnerId1)).toBeFalsy();
            expect(sdk.getCurrentTrial(learnerId2)).toBeFalsy();
            sdk.startTrial(learnerId1);
            var trial1 = sdk.getCurrentTrial(learnerId1);
            expect(trial1).toBeTruthy();
            expect(sdk.getCurrentTrial(learnerId2)).toBeFalsy();
            sdk.startTrial(learnerId2);
            var trial2 = sdk.getCurrentTrial(learnerId2);
            expect(sdk.getCurrentTrial(learnerId1)).toBeTruthy();
            expect(trial2).toBeTruthy();
            expect(trial1).toBe(sdk.getCurrentTrial(learnerId1));
            sdk.closeTrial(learnerId1);
            expect(sdk.getCurrentTrial(learnerId1)).toBeFalsy();
            expect(sdk.getCurrentTrial(learnerId2)).toBeTruthy();
            expect(trial2).toBe(sdk.getCurrentTrial(learnerId2));
            sdk.closeTrial(learnerId2);
            expect(sdk.getCurrentTrial(learnerId1)).toBeFalsy();
            expect(sdk.getCurrentTrial(learnerId2)).toBeFalsy();
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("reset dimension bad learner", function(done) {
        var localDimensions;
        sdkPromise = sdkPromise.then(function() {
            localDimensions = sdk.getLocalDimensions();
            sdk.resetDimension(1, localDimensions[0].uri);
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("LEARNER_NOT_FOUND");
        }).then(function(){
           done();
           return sdk;
        });
    });

    it("reset dimension bad learner", function(done) {
        var learners;
        sdkPromise = sdkPromise.then(function() {
            learners = sdk.getLearnerList();
            sdk.resetDimension(learners[0].id, "Bad local dimension");
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("URI_NOT_FOUND");
        }).then(function(){
            done();
            return sdk;
        });
    });

    it("reset dimension trial not open", function(done) {
        var learners;
        var localDimensions;
        sdkPromise = sdkPromise.then(function() {
            learners = sdk.getLearnerList();
            localDimensions = sdk.getLocalDimensions();
            sdk.resetDimension(learners[0].id, localDimensions[0].uri);
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("TRIAL_NOT_OPEN");
        }).then(function(){
            done();
            return sdk;
        });
    });

    it("reset dimension trial correctly", function(done) {
        var learners;
        var localDimensions;
        sdkPromise = sdkPromise.then(function() {
            learners = sdk.getLearnerList();
            localDimensions = sdk.getLocalDimensions();
            sdk.startTrial(learners[0].id);
            for (var i in localDimensions) {
                expect(sdk.isDimensionReset(learners[0].id, localDimensions[i].uri)).toBeFalsy();
            }
            sdk.resetDimension(learners[0].id, localDimensions[0].uri);
            for (i in localDimensions) {
                expect(sdk.isDimensionReset(learners[0].id, localDimensions[i].uri)).toBe(i == 0);
            }
            sdk.startTrial(learners[1].id);
            sdk.resetDimension(learners[1].id, localDimensions[1].uri);
            for (i in localDimensions) {
                expect(sdk.isDimensionReset(learners[0].id, localDimensions[i].uri)).toBe(i == 0);
                expect(sdk.isDimensionReset(learners[1].id, localDimensions[i].uri)).toBe(i == 1);
            }
            sdk.closeAllTrials();
        }).catch(function() {
            expect(true).toBeFalsy();
        }).then(function(){
            done();
            return sdk;
        });
    });

    it("new trial implicit close", function(done) {
        var learners;
        var localDimensions;
        sdkPromise = sdkPromise.then(function() {
            learners = sdk.getLearnerList();
            localDimensions = sdk.getLocalDimensions();
            sdk.startTrial(learners[0].id);
            var oldTrial = sdk.getCurrentTrial(learners[0].id);
            for (var i in localDimensions) {
                expect(sdk.isDimensionReset(learners[0].id, localDimensions[i].uri)).toBeFalsy();
            }
            sdk.resetDimension(learners[0].id, localDimensions[0].uri);
            for (i in localDimensions) {
                expect(sdk.isDimensionReset(learners[0].id, localDimensions[i].uri)).toBe(i == 0);
            }
            sdk.startTrial(learners[0].id);
            for (i in localDimensions) {
                expect(sdk.isDimensionReset(learners[0].id, localDimensions[i].uri)).toBeFalsy();
            }
            expect(sdk.getCurrentTrial(learners[0].id).trialTime != oldTrial.trialTime
                || sdk.getCurrentTrial(learners[0].id).trialSalt != oldTrial.trialSalt).toBeTruthy();
            sdk.closeTrial();
        }).catch(function() {
            expect(true).toBeFalsy();
        }).then(function(){
            sdk.stopAutoFlush();
            done();
            return sdk;
        });
    });
});