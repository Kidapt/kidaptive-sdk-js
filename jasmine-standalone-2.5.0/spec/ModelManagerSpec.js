/**
 * Created by solomonliu on 12/14/16.
 */
describe("Model Management", function() {
    var sdkPromise;
    var sdk;

    beforeAll(function() {
        localStorage.clear();
        sdkPromise = KidaptiveSdk.init(appKey, {version: "1.0", build: expAppInfo.build}, swaggerUrl).then(function (data) {
            sdk = data;
            return sdk;
        });
    });

    it("check game data", function(done) {
        sdkPromise = sdkPromise.then(function() {
            var games = sdk.getGames();
            expect(games).toBeTruthy();
            expect(games.length).toBeTruthy();
            games.forEach(function(game) {
                expect(sdk.getEntityByUri("game", game.uri)).toBe(game);
                expect(sdk.getEntityById("game", game.id)).toBe(game);
            });
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("check prompt data", function(done) {
        sdkPromise = sdkPromise.then(function() {
            var prompts = sdk.getPrompts();
            expect(prompts).toBeTruthy();
            expect(prompts.length).toBeTruthy();
            prompts.forEach(function(prompt) {
                expect(sdk.getEntityByUri("prompt", prompt.uri)).toBe(prompt);
                expect(sdk.getEntityById("prompt", prompt.id)).toBe(prompt);
            });
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("check item data", function(done) {
        sdkPromise = sdkPromise.then(function() {
            var items = sdk.getItems();
            expect(items).toBeTruthy();
            expect(items.length).toBeTruthy();
            items.forEach(function(item) {
                expect(sdk.getEntityByUri("item", item.uri)).toBe(item);
                expect(sdk.getEntityById("item", item.id)).toBe(item);
            });
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("check dimension data", function(done) {
        sdkPromise = sdkPromise.then(function() {
            var dimensions = sdk.getDimensions();
            expect(dimensions).toBeTruthy();
            expect(dimensions.length).toBeTruthy();
            dimensions.forEach(function(dimension) {
                expect(sdk.getEntityByUri("dimension", dimension.uri)).toBe(dimension);
                expect(sdk.getEntityById("dimension", dimension.id)).toBe(dimension);
            });
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("check localDimension data", function(done) {
        sdkPromise = sdkPromise.then(function() {
            var localDimensions = sdk.getLocalDimensions();
            expect(localDimensions).toBeTruthy();
            expect(localDimensions.length).toBeTruthy();
            localDimensions.forEach(function(localDimension) {
                expect(sdk.getEntityByUri("localDimension", localDimension.uri)).toBe(localDimension);
                expect(sdk.getEntityById("localDimension", localDimension.id)).toBe(localDimension);
            });
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            sdk.stopAutoFlush();
            done();
            return sdk;
        });
    });

    it("check category data", function(done) {
        sdkPromise = sdkPromise.then(function() {
            var categories = sdk.getCategories();
            expect(categories).toBeTruthy();
            expect(categories.length).toBeTruthy();
            categories.forEach(function(category) {
                expect(sdk.getEntityByUri("category", category.uri)).toBe(category);
                expect(sdk.getEntityById("category", category.id)).toBe(category);
            });
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("check instance data", function(done) {
        sdkPromise = sdkPromise.then(function() {
            var instances = sdk.getInstances();
            expect(instances).toBeTruthy();
            expect(instances.length).toBeTruthy();
            instances.forEach(function(instance) {
                expect(sdk.getEntityByUri("instance", instance.uri)).toBe(instance);
                expect(sdk.getEntityById("instance", instance.id)).toBe(instance);
            });
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("check promptCategory data", function(done) {
        sdkPromise = sdkPromise.then(function() {
            sdk.getPrompts().forEach(function(prompt) {
                var promptCats = sdk.getPromptCategoriesForPrompt(prompt.uri);
                var catIds = {};
                promptCats.forEach(function(promptCategory) {
                    expect(promptCategory.promptId).toBe(prompt.id);
                    catIds[promptCategory.categoryId] = true;
                });
                var cats = sdk.getCategories(prompt.uri);
                expect(cats.length).toBe(promptCats.length);
                cats.forEach(function(cat) {
                    expect(catIds[cat.id]).toBeTruthy();
                });
            });
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            sdk.stopAutoFlush();
            done();
            return sdk;
        });
    })
});