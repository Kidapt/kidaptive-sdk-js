var appKey = "gCQ1NS3T394CU";
expAppInfo = {
    uri: '/kidaptive/showcase',
    version: "1.0",
    build: "1000"
};

describe("SDK init", function() {
    beforeAll(function() {
        localStorage.clear();
    });

    it("correct init", function(done) {
        KidaptiveSdk.init(appKey, {version:expAppInfo.version, build:expAppInfo.build}).then(function(sdk) {
            var appInfo = sdk.getAppInfo();
            expect(appInfo.uri).toBe(expAppInfo.uri);
            expect(appInfo.version).toBe(expAppInfo.version);
            expect(appInfo.build).toBe(expAppInfo.build);
            done();
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
            done();
        })
    });

    it("invalid key", function(done) {
        KidaptiveSdk.init("g_invalid_key", {version:expAppInfo.version, build:expAppInfo.build}).then(function(){
            expect(true).toBeFalsy();
            done();
        }).catch(function(error) {
            expect(error.code).toBe("API_KEY_ERROR");
            done();
        });
    });

    it("invalid version", function(done) {
        KidaptiveSdk.init(appKey, {version:"0.9", build:expAppInfo.build}).then(function() {
            expect(true).toBeFalsy();
            done();
        }).catch(function(error) {
            expect(error.code).toBe("INVALID_PARAMETER");
            done();
        });
    });
});