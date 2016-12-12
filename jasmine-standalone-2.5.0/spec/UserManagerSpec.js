describe("User Management", function() {
    var expUser = {
        email: Date.now() + "@kidaptive.com",
        password: "password",
        nickname: "test user"
    };
    var sdkPromise;
    var sdk;

    beforeAll(function() {
        localStorage.clear();
        sdkPromise = KidaptiveSdk.init(appKey, {version:"1.0", build:expAppInfo.build}).then(function(data) {
            sdk = data;
            return sdk;
        });
    });

    it("Valid creation", function(done) {
        sdkPromise = sdkPromise.then(function(sdk) {
            expect(sdk.getCurrentUser()).toBeFalsy();
            return sdk.createUser(expUser.email, "old password", expUser.nickname);
        }).then(function(user) {
            var curUser = sdk.getCurrentUser();
            expect(user).toBe(curUser);
            expect(user.email).toBe(expUser.email);
            expect(user.nickname).toBe(expUser.nickname);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Valid update", function(done) {
        sdkPromise = sdkPromise.then(function(sdk) {
            return sdk.updateUser({nickname: "new nickname", password: expUser.password});
        }).then(function(user) {
            var curUser = sdk.getCurrentUser();
            expect(user).toBe(curUser);
            expect(user.email).toBe(expUser.email);
            expect(user.nickname).toBe("new nickname");
            return sdk.updateUser({nickname: expUser.nickname});
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Empty update", function(done) {
        sdkPromise = sdkPromise.then(function(sdk) {
            return sdk.updateUser();
        }).then(function(user) {
            var curUser = sdk.getCurrentUser();
            expect(user).toBe(curUser);
            expect(user.email).toBe(expUser.email);
            expect(user.nickname).toBe(expUser.nickname);
        }).catch(function(error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
            return sdk;
        });
    });

    it("Empty object update", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.updateUser({});
        }).then(function (user) {
            var curUser = sdk.getCurrentUser();
            expect(user).toBe(curUser);
            expect(user.email).toBe(expUser.email);
            expect(user.nickname).toBe(expUser.nickname);
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function() {
            done();
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

    it("Update without login", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.updateUser({nickname: expUser.nickname, password: expUser.password});
        }).then(function () {
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("NOT_LOGGED_IN");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Delete without login", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.deleteUser();
        }).then(function () {
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("NOT_LOGGED_IN");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Login without email", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.loginUser(null, expUser.password);
        }).then(function() {
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Login without password", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.loginUser(expUser.email);
        }).then(function() {
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Wrong password", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.loginUser(expUser.email, "wrong password");
        }).then(function () {
            expect(true).toBeFalsy();
        }).catch(function (error) {
            expect(error.code).toBe("AUTH_ERROR");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Duplicate Account", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.createUser(expUser.email, expUser.password, expUser.nickname);
        }).then(function() {
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Create account without email", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.createUser(null, expUser.password, expUser.nickname);
        }).then(function() {
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Create account without password", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.createUser(expUser.email, null, expUser.nickname); //null password create account
        }).then(function() {
            expect(true).toBeFalsy();
        }).catch(function(error) {
            expect(error.code).toBe("INVALID_PARAMETER");
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Create account without nickname", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.createUser("0" + expUser.email, expUser.password, null); //create account with null nickname
        }).then(function(user) {
            var curUser = sdk.getCurrentUser();
            expect(user).toBe(curUser);
            expect(user.email).toBe("0" + expUser.email);
            expect(user.nickname).toBeFalsy();
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Valid login", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.loginUser(expUser.email, expUser.password); //correct login
        }).then(function(user) {
            var curUser = sdk.getCurrentUser();
            expect(user).toBe(curUser);
            expect(user.email).toBe(expUser.email);
            expect(user.nickname).toBe(expUser.nickname);
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Set user", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            var user = sdk.getCurrentUser();
            sdk.logoutUser();
            expect(sdk.getCurrentUser()).toBeNull();
            return sdk.setUser(JSON.stringify(user));
        }).then(function(user) {
            var curUser = sdk.getCurrentUser();
            expect(user).toBe(curUser);
            expect(user.email).toBe(expUser.email);
            expect(user.nickname).toBe(expUser.nickname);
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Account deletion", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.deleteUser();
        }).then(function (user) {
            expect(user.email).toBe(expUser.email);
            expect(user.nickname).toBe(expUser.nickname);
        }).catch(function (error) {
            expect(true).toBeFalsy();
            console.log(error);
        }).then(function () {
            done();
            return sdk;
        });
    });

    it("Login with deleted account", function(done) {
        sdkPromise = sdkPromise.then(function (sdk) {
            return sdk.loginUser(expUser.email, expUser.password);
        }).then(function() {
            expect(true).toBeFalsy();
            return done();
        }).catch(function(error) {
            expect(error.code).toBe("AUTH_ERROR");
        }).then(function () {
            sdk.stopAutoFlush();
            done();
            return sdk;
        });
    });
});