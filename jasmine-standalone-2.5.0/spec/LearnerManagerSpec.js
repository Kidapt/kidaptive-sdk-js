describe("Learner Management", function() {
    var expLearner = {
        name: 'L1',
        birthday: Date.now() - 3600 * 24 * 365 * 3,
        gender: "female"
    };
    var sdk;
    var sdkPromise;
    var learnerId;

    beforeAll(function() {
        localStorage.clear();
        sdkPromise = KidaptiveSdk.init(appKey, {version:"1.0", build:expAppInfo.build}, swaggerUrl).then(function(data) {
            sdk = data;
            return sdk.refreshUser();
        }).then(function() {
            var learners = sdk.getLearnerList();
            var delPromise = Promise.resolve(sdk);
            for (var index in learners) {
                var delFunction = function (learnerId) {
                    delPromise = delPromise.then(function() {
                        return sdk.deleteLearner(learnerId);
                    });
                };
                delFunction(learners[index].id);
            }
            return delPromise.then(function() {
                return sdk;
            });
        }).catch(function (error) {
            console.log(error);
        });
    });

    it("Valid creation", function(done) {
        sdkPromise = sdkPromise.then(function(sdk) {
            expect(sdk.getLearnerList().length).toBe(0);
            return sdk.createLearner(expLearner.name, new Date(expLearner.birthday), expLearner.gender);
        }).then(function(learner) {
            learnerId = learner.id;
            expect(sdk.getLearnerList().length).toBe(1);
            var curLearner = sdk.getLearnerList()[0];
            expect(curLearner).toBe(learner);

            expect(learner.name).toBe(expLearner.name);
            expect(learner.birthday).toBe(expLearner.birthday);
            expect(learner.gender).toBe(expLearner.gender);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Creation missing name", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.createLearner(null, new Date(expLearner.birthday), expLearner.gender);
        }).then(function () {
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Creation missing optionals", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.createLearner(expLearner.name, null, null);
        }).then(function(learner) {
            expect(sdk.getLearnerList().length).toBe(2);
            var curLearner = sdk.getLearnerList()[1];
            expect(curLearner).toBe(learner);

            expect(learner.name).toBe(expLearner.name);
            expect(learner.birthday).toBeFalsy();
            expect(learner.gender).toBe("decline");

            var learnerList = sdk.getLearnerList();
            for (var i = 0; i < learnerList.length; i++) {
                expect(sdk.getLearner(learnerList[i].id)).toBe(learnerList[i]);
            }
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("valid update", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.updateLearner(sdk.getLearnerList()[0].id, {name:"L2", birthday: new Date(147700000), gender:"male"});
        }).then(function(learner) {
            expect(sdk.getLearnerList().length).toBe(2);
            var curLearner = sdk.getLearnerList()[0];
            expect(curLearner).toBe(learner);

            expect(learner.name).toBe("L2");
            expect(learner.birthday).toBe(147700000);
            expect(learner.gender).toBe("male");
            return sdk.updateLearner(learnerId, {name:expLearner.name, birthday: new Date(expLearner.birthday), gender:expLearner.gender});
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("null update", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.updateLearner(learnerId, null);
        }).then(function(learner) {
            expect(sdk.getLearnerList().length).toBe(2);
            var curLearner = sdk.getLearnerList()[0];
            expect(curLearner).toBe(learner);

            expect(learner.name).toBe(expLearner.name);
            expect(learner.birthday).toBe(expLearner.birthday);
            expect(learner.gender).toBe(expLearner.gender);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("empty update", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.updateLearner(sdk.getLearnerList()[0].id, {});
        }).then(function(learner) {
            expect(sdk.getLearnerList().length).toBe(2);
            var curLearner = sdk.getLearnerList()[0];
            expect(curLearner).toBe(learner);

            expect(learner.name).toBe(expLearner.name);
            expect(learner.birthday).toBe(expLearner.birthday);
            expect(learner.gender).toBe(expLearner.gender);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("update without learnerId", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.updateLearner(null, {name: "L2", birthday: new Date(147700000), gender: "male"});
        }).then(function () {
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("invalid update", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.updateLearner(1, {name: "L2", birthday: new Date(147700000), gender: "male"});
        }).then(function () {
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("LEARNER_NOT_FOUND");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("delete without learnerId", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.deleteLearner();
        }).then(function () {
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("invalid delete", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.deleteLearner(1);
        }).then(function () {
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("LEARNER_NOT_FOUND");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("valid delete", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.deleteLearner(learnerId);
        }).then(function(learner) {
            expect(sdk.getLearnerList().length).toBe(1);
            expect(learner).not.toBe(sdk.getLearnerList()[0]);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("delete deleted learner", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.deleteLearner(learnerId);
        }).then(function() {
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("LEARNER_NOT_FOUND");
            expect(sdk.getLearnerList().length).toBe(1);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("update deleted learner", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.updateLearner(learnerId, {name:"L2", birthday: new Date(147700000), gender:"male"}); //invalid update
        }).then(function() {
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("LEARNER_NOT_FOUND");
            expect(sdk.getLearnerList().length).toBe(1);
        }).then(function() {
            done();
            return sdk;
        });
    });

    xit("Logout", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            learnerId = sdk.getLearnerList()[0].id;
            sdk.logoutUser();
            expect(sdk.getLearner(learnerId)).toBeFalsy();
            expect(sdk.getLearnerList().length).toBe(0);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    xit("create learner without login", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.createLearner(expLearner.name, new Date(expLearner.birthday), expLearner.gender);
        }).then(function () {
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("NOT_LOGGED_IN");
        }).then(function () {
            done();
            return sdk;
        });
    });

    xit("update learner without login", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.updateLearner(learnerId, {name:"L2", birthday: new Date(147700000), gender:"male"});
        }).then(function() {
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("NOT_LOGGED_IN");
        }).then(function () {
            done();
            return sdk;
        });
    });

    xit("delete learner without login", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.deleteLearner(learnerId);
        }).then(function() {
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("NOT_LOGGED_IN");
        }).then(function () {
            done();
            return sdk;
        });
    });
});