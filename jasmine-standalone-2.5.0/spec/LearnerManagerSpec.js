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


});