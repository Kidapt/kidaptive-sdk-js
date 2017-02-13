describe("Attempt Processor", function() {
    var user = {
        email: Date.now() + "attempt@kidaptive.com",
        password: "password"
    };

    var sdk;
    var learner1;
    var learner2;
    var sdkPromise;

    beforeAll(function() {
        localStorage.clear();
        sdkPromise = KidaptiveSdk.init(appKey, {version:expAppInfo.version, build: expAppInfo.build}).then(function(data) {
            sdk = data;
            sdk.modelManager.idToEntity.item[1] = {id:1, uri:'item1', promptId:1, localDimensionId:1, mean:0};
            sdk.modelManager.uriToId.item['item1'] = 1;
            sdk.modelManager.idToEntity.item[2] = {id:2, uri:'item2', promptId:1, localDimensionId:2, mean:0};
            sdk.modelManager.uriToId.item['item2'] = 2;
            sdk.modelManager.idToEntity.prompt[1] = {id:1, uri:'prompt1'};
            sdk.modelManager.uriToId.prompt['prompt1'] = 1;
            sdk.modelManager.idToEntity.localDimension[1] = {id:1, dimensionId:1, uri:'localDim1'};
            sdk.modelManager.uriToId.localDimension['localDim1'] = 1;
            sdk.modelManager.idToEntity.localDimension[2] = {id:2, dimensionId:2, uri:'localDim2'};
            sdk.modelManager.uriToId.localDimension['localDim2'] = 2;
            sdk.modelManager.idToEntity.dimension[1] = {id:1, uri:'dim1'};
            sdk.modelManager.uriToId.dimension['dim1'] = 1;
            sdk.modelManager.idToEntity.dimension[2] = {id:2, uri:'dim2'};
            sdk.modelManager.uriToId.dimension['dim2'] = 2;

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
        }).then(function() {
            return sdk.createLearner("L1");
        }).then(function(learner) {
            learner1 = learner;
            return sdk.createLearner("L2");
        }).then(function(learner) {
            learner2 = learner;

            sdk.modelManager.latentAbilities[learner2.id] = {};
            sdk.modelManager.latentAbilities[learner2.id][1] = {dimensionId: 1, mean:0, standardDeviation:.6, timestamp:0};
            sdk.modelManager.latentAbilities[learner2.id][2] = {dimensionId: 2, mean:0, standardDeviation:.5, timestamp:0};

            return sdk;
        }).catch(function (error) {
            console.log(error);
        });
    });

    it("Default Abilities", function(done) {
        sdkPromise = sdkPromise.then(function() {
            var abil = sdk.getLocalAbility(learner1.id, 'localDim1');
            expect(abil.mean).toBe(0);
            expect(abil.standardDeviation).toBe(1);
            abil = sdk.getLocalAbility(learner1.id, 'localDim2');
            expect(abil.mean).toBe(0);
            expect(abil.standardDeviation).toBe(1);
            abil = sdk.getLocalAbility(learner2.id, 'localDim1');
            expect(abil.mean).toBe(0);
            expect(abil.standardDeviation).toBe(.6);
            abil = sdk.getLocalAbility(learner2.id, 'localDim2');
            expect(abil.mean).toBe(0);
            expect(abil.standardDeviation).toBe(.5);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("update", function(done) {
        sdkPromise = sdkPromise.then(function() {
            sdk.startTrial(learner1.id);
            sdk.reportEvidence("attempt_proc_test", learner1.id, "prompt1", [{itemURI: "item1", outcome: 1}]);
            abil = sdk.getLocalAbility(learner1.id, 'localDim1');
            expect(abil.mean).toBeGreaterThan(0);
            expect(abil.standardDeviation).toBeLessThan(1);
            abil = sdk.getLocalAbility(learner1.id, 'localDim2');
            expect(abil.mean).toBe(0);
            expect(abil.standardDeviation).toBe(1);
            abil = sdk.getLocalAbility(learner2.id, 'localDim1');
            expect(abil.mean).toBe(0);
            expect(abil.standardDeviation).toBe(.6);
            abil = sdk.getLocalAbility(learner2.id, 'localDim2');
            expect(abil.mean).toBe(0);
            expect(abil.standardDeviation).toBe(.5);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("reset SD under .65", function(done) {
        sdkPromise = sdkPromise.then(function() {
            sdk.startTrial(learner2.id);
            sdk.reportEvidence("attempt_proc_test", learner2.id, "prompt1", [{itemURI: "item1", outcome:0},{itemURI: "item2", outcome:0}]);
            abil = sdk.getLocalAbility(learner2.id, 'localDim1');
            var abil2 = sdk.getLocalAbility(learner2.id, 'localDim2');
            expect(abil.mean).toBe(abil2.mean);
            expect(abil.mean).toBeLessThan(0);
            expect(abil.standardDeviation).toBe(abil2.standardDeviation);
            expect(abil.standardDeviation).toBeLessThan(.65);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("no reset SD above .65", function(done) {
        sdkPromise = sdkPromise.then(function() {
            sdk.modelManager.latentAbilities[learner2.id][1] = {mean:0, standardDeviation:.7};
            sdk.modelManager.latentAbilities[learner2.id][2] = {mean:0, standardDeviation:.8};
            sdk.startTrial(learner2.id);
            sdk.reportEvidence("attempt_proc_test", learner2.id, "prompt1", [{itemURI: "item1", outcome:1},{itemURI: "item2", outcome:1}]);
            abil = sdk.getLocalAbility(learner2.id, 'localDim1');
            abil2 = sdk.getLocalAbility(learner2.id, 'localDim2');
            expect(abil.mean).toBeLessThan(abil2.mean);
            expect(abil.standardDeviation).toBeLessThan(abil2.standardDeviation);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("reset only once", function(done) {
        sdkPromise = sdkPromise.then(function() {
            sdk.startTrial(learner2.id);
            sdk.reportEvidence("attempt_proc_test", learner2.id, "prompt1", [{itemURI: "item1", outcome:1}]);
            sdk.modelManager.latentAbilities[learner2.id][1] = {mean:0, standardDeviation:.3};
            sdk.modelManager.latentAbilities[learner2.id][2] = {mean:0, standardDeviation:.3};
            sdk.reportEvidence("attempt_proc_test", learner2.id, "prompt1", [{itemURI: "item1", outcome:0},{itemURI: "item2", outcome:0}]);
            abil = sdk.getLocalAbility(learner2.id, 'localDim1');
            abil2 = sdk.getLocalAbility(learner2.id, 'localDim2');
            expect(abil.mean).toBeGreaterThan(abil2.mean);
            expect(abil.standardDeviation).toBeLessThan(abil2.standardDeviation);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            sdk.stopAutoFlush();
            done();
            return sdk;
        });
    });
});