/**
 * Created by solomonliu on 11/14/16.
 */


describe("Recommender Manager", function() {
    var sdkPromise;
    var sdk;
    var expectedKeys = ['mock1', 'mock2'];
    var mockRec1 = {
        delegate: null,
        provideRecommendation: function () {
        }
    };
    var mockRec2 = {
        delegate: null,
        provideRecommendation: function () {
        }
    };

    beforeAll(function() {
        localStorage.clear();
        sdkPromise = KidaptiveSdk.init(appKey, {version:"1.0", build:expAppInfo.build}).then(function(data) {
            sdk = data;
            return sdk;
        });
    });

    it("Recommender registration", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            spyOn(mockRec1, 'provideRecommendation');
            spyOn(mockRec2, 'provideRecommendation');
            var keys = sdk.getRecommenderKeys();

            expect(keys.length).toBe(0);
            sdk.registerRecommender(mockRec1, expectedKeys[0]);
            sdk.registerRecommender(mockRec2, expectedKeys[1]);
            keys = sdk.getRecommenderKeys();
            expect(keys.length).toBe(2);
            for (var i; i < expectedKeys.length; i++) {
                expect(keys.indexOf(expectedKeys[i])).not.toBe(-1);
            }
            params = {key1: 'value1', key2: 'value2'};

            sdk.provideRecommendation(expectedKeys[0], params);
            expect(mockRec1.provideRecommendation).toHaveBeenCalledWith(params);
            expect(mockRec1.provideRecommendation).toHaveBeenCalledTimes(1);
            expect(mockRec2.provideRecommendation).toHaveBeenCalledTimes(0);

            sdk.provideRecommendation(expectedKeys[1]);
            expect(mockRec1.provideRecommendation).toHaveBeenCalledTimes(1);
            expect(mockRec2.provideRecommendation).toHaveBeenCalledTimes(1);
            return sdk;
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("null recommender registration", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            try {
                sdk.registerRecommender(null, 'mock3');
            } catch (error) {
                expect(error.code).toBe('INVALID_PARAMETER');
                expect(sdk.getRecommenderKeys().indexOf('mock3')).toBe(-1);
            }
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("null recommender key", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            try {
                sdk.registerRecommender(mockRec1, null);
            } catch (error) {
                expect(error.code).toBe('INVALID_PARAMETER');
            }
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Recommender unregistration", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            spyOn(mockRec1, 'provideRecommendation');
            spyOn(mockRec2, 'provideRecommendation');

            sdk.unregisterRecommender(expectedKeys[0]);
            var keys = sdk.getRecommenderKeys();
            expect(keys.length).toBe(1);
            expect(keys[0]).toBe(expectedKeys[1]);

            sdk.unregisterRecommender(expectedKeys[0]);
            keys = sdk.getRecommenderKeys();
            expect(keys.length).toBe(1);
            expect(keys[0]).toBe(expectedKeys[1]);

            sdk.provideRecommendation(expectedKeys[1], params);
            expect(mockRec2.provideRecommendation).toHaveBeenCalledWith(params);
            expect(mockRec1.provideRecommendation).toHaveBeenCalledTimes(0);
            expect(mockRec2.provideRecommendation).toHaveBeenCalledTimes(1);

            try {
                sdk.provideRecommendation(expectedKeys[0]);
                expect(true).toBeFalsy();
            } catch (error) {
                expect(error.code).toBe("INVALID_PARAMETER");
            }
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Recommender unregistration", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            spyOn(mockRec1, 'provideRecommendation');
            spyOn(mockRec2, 'provideRecommendation');
            try {
                sdk.registerRecommender(mockRec1, expectedKeys[1]);
                expect(true).toBeFalsy();
            } catch (error) {
                expect(error.code).toBe("INVALID_PARAMETER");
                sdk.provideRecommendation(expectedKeys[1]);
                expect(mockRec1.provideRecommendation).toHaveBeenCalledTimes(0);
                expect(mockRec2.provideRecommendation).toHaveBeenCalledTimes(1);
            }
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Bad recommender key", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            try {
                sdk.provideRecommendation("bad key", params);
                expect(true).toBeFalsy();
            } catch (error) {
                expect(error.code).toBe("INVALID_PARAMETER");
            }
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Random recommender game only", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            var gameUri = "/game/kidaptive/demo_fireworks";
            var recs = sdk.recommendRandomPrompts(gameUri);
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(10);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Random recommender game and local dim", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            var gameUri = "/game/kidaptive/demo_fireworks";
            var recs = sdk.recommendRandomPrompts(gameUri, '/local_dimension/kidaptive/demo_fireworks/attention_control');
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(10);
            var expectedPrompts = Object.keys(sdk.modelManager.idToEntity['item']).map(function(itemId) {
                return sdk.modelManager.idToEntity['item'][itemId];
            }).filter(function(item) {
                return item.promptId != null && item.localDimensionId == 4;
            }).map(function(item){
                return item.promptId;
            });
            recs.recommendations.forEach(function(promptUri) {
                expect(sdk.getEntityByUri('prompt',promptUri).gameId).toBe(88);
                expect(expectedPrompts.indexOf(sdk.getEntityByUri('prompt', promptUri).id)).not.toBe(-1);
            });
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Random recommender game, local dim, and numResults", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            var gameUri = "/game/kidaptive/demo_fireworks";
            var recs = sdk.recommendRandomPrompts(gameUri, '/local_dimension/kidaptive/demo_fireworks/cognitive_flexibility', 20);
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(20);
            var expectedPrompts = Object.keys(sdk.modelManager.idToEntity['item']).map(function(itemId) {
                return sdk.modelManager.idToEntity['item'][itemId];
            }).filter(function(item) {
                return item.promptId != null && item.localDimensionId == 5;
            }).map(function(item){
                return item.promptId;
            });
            recs.recommendations.forEach(function(promptUri) {
                expect(sdk.getEntityByUri('prompt',promptUri).gameId).toBe(88);
                expect(expectedPrompts.indexOf(sdk.getEntityByUri('prompt', promptUri).id)).not.toBe(-1);
            });
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Random recommender no gameUri", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            try {
                sdk.recommendRandomPrompts();
                expect(true).toBeFalsy();
            } catch (error) {
                expect(error.code).toBe("RECOMMENDER_ERROR")
            }
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Random recommender bad gameUri", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            try {
                sdk.recommendRandomPrompts('bad gameUri');
                expect(true).toBeFalsy();
            } catch (error) {
                expect(error.code).toBe("RECOMMENDER_ERROR")
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Random recommender bad localDimensionUri", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            var gameUri = "/game/kidaptive/demo_fireworks";
            try {
                sdk.recommendRandomPrompts(gameUri, 'bad localDimensionUri');expect(true).toBeFalsy();
            } catch (error) {
                expect(error.code).toBe("RECOMMENDER_ERROR")
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Random recommender numResults infinity", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            var gameUri = "/game/kidaptive/demo_fireworks";
            var recs = sdk.recommendRandomPrompts(gameUri, null, Infinity);
            var expectedPrompts = Object.keys(sdk.modelManager.idToEntity['item']).map(function(itemId) {
                return sdk.modelManager.idToEntity['item'][itemId];
            }).filter(function(item) {
                return item.promptId != null
            }).map(function(item){
                return item.promptId;
            });
            expect(recs.recommendations.length).toBe(expectedPrompts.length);
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    var odRecMocks = function() {
        var items = {};
        var prompts = {};
        for (var i = 1; i < 10; i++) {
            items[i] = {
                id: i,
                promptId: i,
                mean: -2.5 + .5 * i,
                localDimensionId: i % 2 + 1
            };
            prompts[i] = {
                id: i,
                gameId: 1,
                uri: 'prompt' + i
            }
        }
        var entities = {
            item:items,
            prompt:prompts,
            game: {
                1: {
                    id: 1,
                    uri: 'game1'
                }
            },
            localDimension: {
                1: {
                    id: 1,
                    uri: 'localDimension1',
                    dimensionId: 1
                },
                2: {
                    id: 2,
                    uri: 'localDimension2',
                    dimensionId: 2
                }
            },
            dimension: {
                1: {
                    id: 1,
                    uri: 'dimension1'
                },
                2: {
                    id: 2,
                    uri: 'dimension2'
                }
            }
        };
        spyOn(sdk,'getLearner').and.callFake(function(learnerId) {
            if (learnerId == 1) {
                return {id: 1}
            } else {
                return null;
            }
        });

        spyOn(sdk, 'getEntityByUri').and.callFake(function(type, uri) {
            if (!type || !uri || !entities[type] || type != uri.substring(0,uri.length - 1)) {
                return null;
            }
            return entities[type][uri.substring(uri.length - 1)];
        });

        spyOn(sdk, 'getEntityById').and.callFake(function(type, id) {
            if (!type || !id || !entities[type]) {
                return null;
            }

            return entities[type][id];
        });

        spyOn(sdk, 'getItems').and.callFake(function(gameUri, ldUri) {
            if (!sdk.getEntityByUri('game', gameUri)) {
                return null;
            }

            var items = Object.keys(entities.item).map(function(id) {return entities.item[id]});

            if (ldUri) {
                var ld = sdk.getEntityByUri('localDimension', ldUri);
                if (!ld) {
                    return null;
                }

                return items.filter(function(item) {
                   return item.localDimensionId == ld.id;
                });
            }

            return items;

        });

        spyOn(sdk, 'getLocalAbility').and.callFake(function(learnerId, ldUri) {
            if (!sdk.getLearner(learnerId) || !sdk.getEntityByUri('localDimension', ldUri)) {
                return null;
            }

            return {mean:0};
        });
    };

    it("Optimal difficulty recommender easiest to hardest", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();

            var recs = sdk.recommendOptimalDifficultyPrompts(1, 'game1', null, null, 1);
            expect(recs.type).toBe('prompt');
            for (var i = 1; i < 10; i++) {
                expect(recs.recommendations[i - 1]).toBe('prompt' + i);
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender hardest to easiest", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();

            var recs = sdk.recommendOptimalDifficultyPrompts(1, 'game1', null, null, 0);
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(9);
            for (var i = 1; i < 10; i++) {
                expect(recs.recommendations[i - 1]).toBe('prompt' + (10 - i));
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender default diff", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();

            var recs = sdk.recommendOptimalDifficultyPrompts(1, 'game1');
            var expected = [4,3,5,2,1,6,7,8,9].map(function(x) {return "prompt" + x;});
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(9);
            for (var i = 0; i < 9; i++) {
                expect(recs.recommendations[i]).toBe(expected[i]);
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender probSuc = .3", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();

            var recs = sdk.recommendOptimalDifficultyPrompts(1, 'game1', null, null, .3);
            var expected = [6,7,5,8,9,4,3,2,1].map(function(x) {return "prompt" + x;});
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(9);
            for (var i = 0; i < 9; i++) {
                expect(recs.recommendations[i]).toBe(expected[i]);
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender local dimension filtered", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();

            var recs = sdk.recommendOptimalDifficultyPrompts(1, 'game1', 'localDimension1');
            var expected = [4,2,6,8].map(function(x) {return "prompt" + x;});
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(4);
            for (var i = 0; i < 9; i++) {
                expect(recs.recommendations[i]).toBe(expected[i]);
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender max result", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();

            var recs = sdk.recommendOptimalDifficultyPrompts(1, 'game1', null, 5);
            var expected = [4,3,5,2,1].map(function(x) {return "prompt" + x;});
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(5);
            for (var i = 0; i < 9; i++) {
                expect(recs.recommendations[i]).toBe(expected[i]);
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender bad learner", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();
            try {
                sdk.recommendOptimalDifficultyPrompts(2, 'game1');
                expect(true).toBeFalsy();
            } catch (error) {
                expect(error.code).toBe("RECOMMENDER_ERROR");
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender bad game", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();
            try {
                sdk.recommendOptimalDifficultyPrompts(1, 'bad game');
                expect(true).toBeFalsy();
            } catch (error) {
                expect(error.code).toBe("RECOMMENDER_ERROR");
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender bad localDimension", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();
            try {
                sdk.recommendOptimalDifficultyPrompts(1, 'game1', 'bad LD');
                expect(true).toBeFalsy();
            } catch (error) {
                expect(error.code).toBe("RECOMMENDER_ERROR");
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender maxResult < 0", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();
            var recs = sdk.recommendOptimalDifficultyPrompts(1, 'game1', null, -Infinity);
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(0);
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender maxResult infinity", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();
            var recs = sdk.recommendOptimalDifficultyPrompts(1, 'game1', null, Infinity);
            var expected = [4,3,5,2,1,6,7,8,9].map(function(x) {return "prompt" + x;});
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(9);
            for (var i = 0; i < 9; i++) {
                expect(recs.recommendations[i]).toBe(expected[i]);
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender probSuccess < 0", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();
            var recs = sdk.recommendOptimalDifficultyPrompts(1, 'game1', null, null, -Infinity);
            var expected = [9,8,7,6,5,4,3,2,1].map(function(x) {return "prompt" + x;});
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(9);
            for (var i = 0; i < 9; i++) {
                expect(recs.recommendations[i]).toBe(expected[i]);
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Optimal difficulty recommender probSuccess > 1", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            odRecMocks();
            var recs = sdk.recommendOptimalDifficultyPrompts(1, 'game1', null, null, Infinity);
            var expected = [1,2,3,4,5,6,7,8,9].map(function(x) {return "prompt" + x;});
            expect(recs.type).toBe('prompt');
            expect(recs.recommendations.length).toBe(9);
            for (var i = 0; i < 9; i++) {
                expect(recs.recommendations[i]).toBe(expected[i]);
            }
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });
});