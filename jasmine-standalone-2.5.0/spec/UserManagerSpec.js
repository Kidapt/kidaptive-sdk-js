describe("User Management", function() {
    var sdkPromise;
    var sdk;

    beforeAll(function() {
        localStorage.clear();
        sdkPromise = KidaptiveSdk.init(appKey, {version:"1.0", build:expAppInfo.build}).then(function(data) {
            sdk = data;
            return sdk;
        });
    });

    it("Logout", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            sdk.logoutUser();
            expect(sdk.getCurrentUser()).toBeFalsy();
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });
});