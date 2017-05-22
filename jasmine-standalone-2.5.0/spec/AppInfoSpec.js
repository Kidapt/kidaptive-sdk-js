var appKey = "gCQ1NS3T394CU";
var swaggerUrl = "http://localhost:63342/kidaptive-sdk-js/dist/swagger.json";
expAppInfo = {
    uri: '/kidaptive/showcase',
    version: "1.0",
    build: "1000"
};
var sdk;

describe("SDK init", function() {
    beforeEach(function() {
        localStorage.clear();
        sdk = null;
    });

    it("correct init", function(done) {
        sdkPromise = KidaptiveSdk.init(appKey, {version:expAppInfo.version, build:expAppInfo.build}, swaggerUrl).then(function(data) {
            sdk = data;
            var appInfo = sdk.getAppInfo();
            expect(appInfo.uri).toBe(expAppInfo.uri);
            expect(appInfo.version).toBe(expAppInfo.version);
            expect(appInfo.build).toBe(expAppInfo.build);
        }).catch(function(error) {
            fail("should not have thrown error");
            console.log(error);
        }).then(done);
    });

    it("invalid key", function(done) {
        sdkPromise = KidaptiveSdk.init("g_invalid_key", {version:expAppInfo.version, build:expAppInfo.build}, swaggerUrl).then(function(data){
            sdk = data;
            fail("should have thrown error");
        }).catch(function(error) {
            expect(error.code).toBe("API_KEY_ERROR");
        }).then(done);
    });

    it("invalid version", function(done) {
        sdkPromise = KidaptiveSdk.init(appKey, {version:"0.9", build:expAppInfo.build}, swaggerUrl).then(function(data) {
            sdk = data;
            fail("should have thrown error");
        }).catch(function(error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(done);
    });

    afterEach(function() {
        if (sdk) {
            sdk.stopAutoFlush();
        }
    });
});