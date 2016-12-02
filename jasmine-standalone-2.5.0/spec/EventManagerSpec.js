describe("Event Management", function() {
    var user = {
        email: Date.now() + 2 + "@kidaptive.com",
        password: "password"
    };

    var sdkPromise;
    var sdk;
    var learnerId;

    var p;
    var i;
    var promptAnswers;
    var badPA1;

    beforeAll(function() {
        localStorage.clear();
        sdkPromise = KidaptiveSdk.init(appKey, {version:expAppInfo.version, build: expAppInfo.build}).then(function(data) {
            sdk = data;
            var items = Object.keys(sdk.modelManager.idToEntity.item);
            i = sdk.getEntityById("item", items[Math.floor(Math.random() * items.length)]);
            p = sdk.getEntityById("prompt", i.promptId);

            //set up some bad models to use later
            sdk.modelManager.uriToId.category['extra_category'] = 1;
            sdk.modelManager.idToEntity.category[1] = {id:1, uri:'extra_category'};
            sdk.modelManager.uriToId.subCategory['extra_sub'] = 1;
            sdk.modelManager.idToEntity.subCategory[1] = {id:1, uri:'extra_sub', categoryId:1};
            sdk.modelManager.uriToId.instance['extra_instance'] = 1;
            sdk.modelManager.idToEntity.instance[1] = {id:1, uri:'extra_instance', subCategoryId:1};
            sdk.modelManager.uriToId.game["wrong_game"] = 1;
            sdk.modelManager.idToEntity.game[1] = {id:1, uri:"wrong_game"};

            promptAnswers = {};
            badPA1 = {};
            badPA2 = {};
            var pa = sdk.getCategoriesForPrompt(p.uri);
            for (var j in pa) {
                if (pa.hasOwnProperty(j)) {
                    var cat = sdk.getEntityById("category", j);
                    if (pa[j].instanceId) {
                        promptAnswers[cat.uri] = sdk.getEntityById("instance", pa[j].instanceId).uri;
                        badPA1[cat.uri] = 'bad_instance';
                        badPA2[cat.uri] = 'extra_instance';
                    } else {
                        promptAnswers[cat.uri] = 'catValue';
                        badPA1[cat.uri] = 'catValue';
                        badPA2[cat.uri] = 'catValue';
                    }
                }
            }
            return sdk.createUser(user.email, user.password);
        }).then(function() {
            return sdk.createLearner("L");
        }).then(function(learner) {
            learnerId = learner.id;
            sdk.logoutUser();
            return sdk;
        });
    });

    it("report behavior without login", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportBehavior("js_sdk_behavior_test_event");
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("NOT_LOGGED_IN");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("report evidence without login", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId);
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("LEARNER_NOT_FOUND");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("valid behavior and evidence reporting", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.loginUser(user.email, user.password);
        }).then(function() {
            sdk.reportBehavior("js_sdk_behavior_test_event"); //valid behavior event

            sdk.reportBehavior("js_sdk_behavior_test_event", //valid behavior event
                {
                    learnerId: learnerId,
                    gameUri: sdk.getEntityById("game", p.gameId).uri,
                    promptUri: p.uri,
                    duration: 1.23,
                    additionalFields: {af1: "val1", af2: "val2"},
                    tags: {tag1: "val1", tag2: "val2"}
                });

            sdk.startTrial(learnerId);
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, p.uri, [{
                itemURI: i.uri,
                outcome: 1
            }, {itemURI: i.uri, outcome: 0}], {
                duration: 4.56,
                promptAnswers: promptAnswers,
                additionalFields: {af1: "val1", af2: "val2"},
                tags: {tag1: "val1", tag2: "val2"}
            }); //valid evidence event
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, p.uri, null, {
                promptAnswers: promptAnswers
            }); //valid evidence event
            expect(true).toBeTruthy();
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("behavior event missing event name", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportBehavior();
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("behavior event game-prompt mismatch", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportBehavior("js_sdk_behavior_test_event",
                {
                    learnerId: learnerId,
                    gameUri: "wrong_game",
                    promptUri: p.uri,
                    duration: 1.23,
                    additionalFields: {af1: "val1", af2: "val2"},
                    tags: {tag1: "val1", tag2: "val2"}
                });
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence without event name", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence(null, learnerId, p.uri, [{itemURI: i.uri, outcome: 1}, {itemURI: i.uri, outcome: 0}], {
                duration: 4.56,
                promptAnswers: promptAnswers,
                additionalFields: {af1: "val1", af2: "val2"},
                tags: {tag1: "val1", tag2: "val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence no learner", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence("js_sdk_evidence_test_event", null, p.uri, [{itemURI: i.uri, outcome:1}, {itemURI: i.uri, outcome:0}], {
                duration:4.56,
                promptAnswers: promptAnswers,
                additionalFields: {af1:"val1", af2:"val2"},
                tags:{tag1:"val1", tag2:"val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("LEARNER_NOT_FOUND");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence bad learner", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence("js_sdk_evidence_test_event", 1, p.uri, [{itemURI: i.uri, outcome:1}, {itemURI: i.uri, outcome:0}], {
                duration:4.56,
                promptAnswers: promptAnswers,
                additionalFields: {af1:"val1", af2:"val2"},
                tags:{tag1:"val1", tag2:"val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("LEARNER_NOT_FOUND");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence bad prompt", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, "wrong_prompt", [{itemURI: i.uri, outcome:1}, {itemURI: i.uri, outcome:0}], {
                duration:4.56,
                promptAnswers: promptAnswers,
                additionalFields: {af1:"val1", af2:"val2"},
                tags:{tag1:"val1", tag2:"val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("URI_NOT_FOUND");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence no prompt", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, null, [{itemURI: i.uri, outcome:1}, {itemURI: i.uri, outcome:0}], {
                duration:4.56,
                promptAnswers: promptAnswers,
                additionalFields: {af1:"val1", af2:"val2"},
                tags:{tag1:"val1", tag2:"val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("URI_NOT_FOUND");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence prompt-item mismatch", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            var prompts = Object.keys(sdk.modelManager.idToEntity.prompt);
            var bad_prompt = p.id == prompts[0] ? sdk.getEntityById("prompt", prompts[1]) : sdk.getEntityById("prompt", prompts[0]);
            var pa = sdk.getCategoriesForPrompt(bad_prompt.uri);
            var badPromptAnswers = {};
            for (var j in pa) {
                if (pa.hasOwnProperty(j)) {
                    var cat = sdk.getEntityById("category", j);
                    if (pa[j].instanceId) {
                        badPromptAnswers[cat.uri] = sdk.getEntityById("instance", pa[j].instanceId).uri;
                    } else {
                        badPromptAnswers[cat.uri] = 'catValue';
                    }
                }
            }
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, bad_prompt.uri, [{itemURI: i.uri, outcome:1}, {itemURI: i.uri, outcome:0}], {
                duration:4.56,
                promptAnswers: badPromptAnswers,
                additionalFields: {af1:"val1", af2:"val2"},
                tags:{tag1:"val1", tag2:"val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence bad item uri", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, p.uri, [{
                itemURI: i.uri,
                outcome: 1
            }, {itemURI: "bad_item", outcome: 0}], {
                duration: 4.56,
                promptAnswers: promptAnswers,
                additionalFields: {af1: "val1", af2: "val2"},
                tags: {tag1: "val1", tag2: "val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("URI_NOT_FOUND");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence bad item outcome", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, p.uri, [{
                itemURI: i.uri,
                outcome: -1
            }, {itemURI: i.uri, outcome: 0}], {
                duration: 4.56,
                promptAnswers: promptAnswers,
                additionalFields: {af1: "val1", af2: "val2"},
                tags: {tag1: "val1", tag2: "val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence bad item outcome", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, p.uri, [{
                itemURI: i.uri,
                outcome: 1
            }, {itemURI: i.uri, outcome: 'abc'}], {
                duration: 4.56,
                promptAnswers: promptAnswers,
                additionalFields: {af1: "val1", af2: "val2"},
                tags: {tag1: "val1", tag2: "val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence trial not open", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.closeTrial(learnerId);
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, p.uri, [{itemURI: i.uri, outcome:1}, {itemURI: i.uri, outcome:0}], {
                duration:4.56,
                promptAnswers: promptAnswers,
                additionalFields: {af1:"val1", af2:"val2"},
                tags:{tag1:"val1", tag2:"val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("TRIAL_NOT_OPEN");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence missing promptAnswers", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.startTrial(learnerId);
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, p.uri, [{
                itemURI: i.uri,
                outcome: 1
            }, {itemURI: i.uri, outcome: 0}], {
                duration: 4.56,
                additionalFields: {af1: "val1", af2: "val2"},
                tags: {tag1: "val1", tag2: "val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence bad category", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, p.uri, [{itemURI: i.uri, outcome:1}, {itemURI: i.uri, outcome:0}], {
                duration:4.56,
                promptAnswers:{"bad_category": "bad_catVal"},
                additionalFields: {af1:"val1", af2:"val2"},
                tags:{tag1:"val1", tag2:"val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("URI_NOT_FOUND");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence bad instance", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, p.uri, [{itemURI: i.uri, outcome:1}, {itemURI: i.uri, outcome:0}], {
                duration:4.56,
                promptAnswers: badPA1,
                additionalFields: {af1:"val1", af2:"val2"},
                tags:{tag1:"val1", tag2:"val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("URI_NOT_FOUND");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence prompt-category mismatch", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            var mis = JSON.parse(JSON.stringify(promptAnswers));

            mis['extra_category'] = 'extra_cat_value';
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, p.uri, [{itemURI: i.uri, outcome:1}, {itemURI: i.uri, outcome:0}], {
                duration:4.56,
                promptAnswers: mis,
                additionalFields: {af1:"val1", af2:"val2"},
                tags:{tag1:"val1", tag2:"val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("evidence category-instance mismatch", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.reportEvidence("js_sdk_evidence_test_event", learnerId, p.uri, [{itemURI: i.uri, outcome:1}, {itemURI: i.uri, outcome:0}], {
                duration:4.56,
                promptAnswers: badPA2,
                additionalFields: {af1:"val1", af2:"val2"},
                tags:{tag1:"val1", tag2:"val2"}
            });
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });
});