describe("User Management", function() {
    var sdkPromise;
    var sdk;
    var expUser = {
        id: 1,
        nickname: 'abc'
    };

    beforeAll(function() {
        localStorage.clear();
        sdkPromise = KidaptiveSdk.init(appKey, {version:"1.0", build:expAppInfo.build}, swaggerUrl).then(function(data) {
            sdk = data;
            return sdk;
        });
    });

    it("Refresh User", function(done) {
        sdkPromise.then(function(sdk) {
            spyOn(sdk.learnerManager, 'syncLearnerList').and.callFake(function() {});
            return sdk.swaggerPromise.then(function(swagger) {
                spyOn(swagger.user, 'user_get_me').and.returnValue(Promise.resolve(expUser));
                return sdk;
            });
        }).then(function(sdk) {
            return sdk.refreshUser();
        }).then(function(user) {

        }).catch(function(error) {
            fail("should not throw error");
            console.log(error);
        }).then(done);
    });

    it("Logout", function(done) {
        sdkPromise.then(function (sdk) {
            sdk.logoutUser();
            expect(sdk.getCurrentUser()).toBeFalsy();
        }).catch(function(error) {
            fail("should not throw error");
            console.log(error);
        }).then(done);
    });

    afterAll(function() {
        if (sdk) {
            sdk.stopAutoFlush();
        }
    });
});