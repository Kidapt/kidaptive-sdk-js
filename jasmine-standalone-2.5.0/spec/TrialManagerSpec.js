describe("Trial Management", function() {
    beforeAll(function() {
        localStorage.clear();
        sdkPromise = KidaptiveSdk.init(appKey, {version:"1.0", build:expAppInfo.build}).then(function(data) {
            sdk = data;
            return sdk;
        });
    });
});