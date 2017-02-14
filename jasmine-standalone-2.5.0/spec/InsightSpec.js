describe("Insight Management", function() {
    var user = {
        email: Date.now() + "insight@kidaptive.com",
        password: "password"
    };

    var sdk;
    var sdkPromise;
    var curLearner;
    var curUser;
    var insights = [
        {dateCreated: 0, uri: "type1"},
        {dateCreated: 1, uri: "type2"},
        {dateCreated: 2, uri: "type1"},
        {dateCreated: 3, uri: "type2"},
        {dateCreated: 4, uri: "type1"},
    ];

    beforeAll(function () {
        localStorage.clear();
        sdkPromise = KidaptiveSdk.init(appKey, {
            version: expAppInfo.version,
            build: expAppInfo.build
        }, swaggerUrl).then(function (data) {
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
        }).then(function (user) {
            curUser = user;
            return sdk.createLearner("L");
        }).then(function (learner) {
            curLearner = learner;
            return sdk;
        }).catch(function (error) {
            console.log(error);
        })

    });

    it("insight sync", function (done) {
        sdkPromise = sdkPromise.then(function () {
            spyOn(sdk.modelManager.learnerApi, "insightGet").and.callFake(function (apiKey, learnerId, after) {
                return Promise.resolve({
                    body: function (a) {
                        for (var i = 0; i < a.length; i++) {
                            var j = i + Math.floor(Math.random() * (a.length - i));
                            var x = a[i];
                            a[i] = a[j];
                            a[j] = x;
                        }
                        return a;
                    }(
                        insights.filter(function (x) {
                            return x.dateCreated >= after;
                        })
                    )
                });
            });

            return sdk.syncInsights();
        }).then(function () {
            expect(sdk.modelManager.learnerApi.insightGet).toHaveBeenCalledWith(sdk.getAppApiKey(), curLearner.id, 0);
            var learnerInsights = sdk.getInsights(curLearner.id);
            expect(learnerInsights.length).toBe(insights.length);
            for (var i in insights) {
                expect(learnerInsights[i].dateCreated).toBe(insights[i].dateCreated);
                expect(learnerInsights[i].uri).toBe(insights[i].uri);
            }
            return sdk.syncInsights();
        }).then(function() {
            expect(sdk.modelManager.learnerApi.insightGet).toHaveBeenCalledWith(sdk.getAppApiKey(), curLearner.id, 5);
            var learnerInsights = sdk.getInsights(curLearner.id);
            expect(learnerInsights.length).toBe(insights.length);
            for (var i in insights) {
                expect(learnerInsights[i].dateCreated).toBe(insights[i].dateCreated);
                expect(learnerInsights[i].uri).toBe(insights[i].uri);
            }
        }).catch(function (error) {
            console.log(error);
            expect(true).toBeFalsy();
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("get insights no filter", function (done) {
        sdkPromise = sdkPromise.then(function () {
            learnerInsights = sdk.getInsights(curLearner.id, null, new Date(1), new Date(3));
            expect(learnerInsights[0].dateCreated).toBe(insights[1].dateCreated);
            expect(learnerInsights[0].uri).toBe(insights[1].uri);
            expect(learnerInsights[1].dateCreated).toBe(insights[2].dateCreated);
            expect(learnerInsights[1].uri).toBe(insights[2].uri);
            expect(learnerInsights[2].dateCreated).toBe(insights[3].dateCreated);
            expect(learnerInsights[2].uri).toBe(insights[3].uri);
            expect(learnerInsights.length).toBe(3);
        }).catch(function (error) {
            console.log(error);
            expect(true).toBeFalsy();
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("get insights filtered", function (done) {
        sdkPromise = sdkPromise.then(function () {
            learnerInsights = sdk.getInsights(curLearner.id, ['type2'], new Date(1), new Date(3));
            expect(learnerInsights[0].dateCreated).toBe(insights[1].dateCreated);
            expect(learnerInsights[0].uri).toBe(insights[1].uri);
            expect(learnerInsights[1].dateCreated).toBe(insights[3].dateCreated);
            expect(learnerInsights[1].uri).toBe(insights[3].uri);
            expect(learnerInsights.length).toBe(2);
        }).catch(function (error) {
            console.log(error);
            expect(true).toBeFalsy();
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("get insights latest not filtered", function (done) {
        sdkPromise = sdkPromise.then(function () {
            learnerInsights = sdk.getInsights(curLearner.id, null, new Date(1), new Date(3), true);
            expect(learnerInsights[0].dateCreated).toBe(insights[3].dateCreated);
            expect(learnerInsights[0].uri).toBe(insights[3].uri);
            expect(learnerInsights[1].dateCreated).toBe(insights[2].dateCreated);
            expect(learnerInsights[1].uri).toBe(insights[2].uri);
            expect(learnerInsights.length).toBe(2);
        }).catch(function (error) {
            console.log(error);
            expect(true).toBeFalsy();
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("get insights latest filtered", function (done) {
        sdkPromise = sdkPromise.then(function () {
            learnerInsights = sdk.getInsights(curLearner.id, ['type2'], new Date(1), new Date(3), true);
            expect(learnerInsights[0].dateCreated).toBe(insights[3].dateCreated);
            expect(learnerInsights[0].uri).toBe(insights[3].uri);
            expect(learnerInsights.length).toBe(1);
        }).catch(function (error) {
            console.log(error);
            expect(true).toBeFalsy();
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("insights bad learner", function (done) {
        sdkPromise = sdkPromise.then(function () {
            learnerInsights = sdk.getInsights(1);
            expect(learnerInsights).toBeFalsy();
        }).catch(function (error) {
            console.log(error);
            expect(true).toBeFalsy();
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("insights no learner", function (done) {
        sdkPromise = sdkPromise.then(function () {
            learnerInsights = sdk.getInsights();
            expect(learnerInsights).toBeFalsy();
        }).catch(function (error) {
            console.log(error);
            expect(true).toBeFalsy();
        }).then(function () {
            done();
            sdk.stopAutoFlush();
            return sdk;
        });
    });
});