/**
 * Created by solomonliu on 7/8/16.
 */

import Promise = require("bluebird");

import {KidaptiveErrorCode, KidaptiveError} from "./kidaptive_error";
import {User, UserApi, UserLogin} from "../../../swagger-client/api";
import {KidaptiveConstants} from "./kidaptive_constants";

interface UserManagerDelegate {
    getAppApiKey: () => string;
}

class UserManager {
    currentUser: User;
    private userApi: UserApi = new UserApi(KidaptiveConstants.ALP_BASE_URL);

    constructor(private delegate: UserManagerDelegate) {
        if (!this.delegate) {
            throw new KidaptiveError(KidaptiveErrorCode.MISSING_DELEGATE, "UserManagerDelegate not found");
        }
    }

    /*
     * Create a new user. If successful, logs out current user and logs in new user;
     */
    createUser(email: string, password: string, name?: string): Promise<User> {
        if (!email) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "email is required"));
        }
        if (!password) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "password is required"));
        }

        let user: User = new User();
        user.email = email;
        user.password = password;
        if (name) {
            user.nickname = name;
        }

        return this.userApi.userPost(this.delegate.getAppApiKey(), user).then(function(data) {
            this.currentUser = data.body;
            this.storeUser();
            return this.currentUser;
        }.bind(this)).catch(function(error) {
            if (error.response) {
                if (error.response.statusCode == 400) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, error.response.statusMessage));
                } else if (error.response.statusCode == 401) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, error.response.statusMessage));
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, error.response.statusMessage));
                }
            } else {
                return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
            }
        }) as Promise<User>;
    }

    /*
     * Authenticates user with ALP server, sets current user if successful
     * If there was an error logging in, original user is retained
     * If login was successful but userDidLogin is not, current user is null
     * If everything was successful, current user is changed to new user
     */
    loginUser(email:string, password:string): Promise<User> {
        if (!email) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "email is required"));
        }
        if (!password) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "password is required"));
        }

        let login: UserLogin = new UserLogin();
        login.email = email;
        login.password = password;

        return this.userApi.userLoginPost(this.delegate.getAppApiKey(), login).then(function(data) {
            this.currentUser = data.body;
            this.storeUser();
            return this.currentUser;
        }.bind(this)).catch(function(error) {
            if (error.response) {
                if (error.response.statusCode == 400) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.AUTH_ERROR, "No user found with provided email and password"));
                } else if (error.response.statusCode == 401) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, error.response.statusMessage));
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, error.response.statusMessage));
                }
            } else {
                return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
            }
        }) as Promise<User>;
    }

    /*
     * Logout User
     */
    logoutUser() {
        this.currentUser = null;
        this.deleteStoredUser();
    }

    /*
     * Recover Password
     */
    recoverPassword(email: string): Promise<string> {
        if (!email) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "email is required"));
        }

        let user: User = new User();
        user.email = email;

        return this.userApi.userForgotPasswordPost(this.delegate.getAppApiKey(), user).then(function() {
            return 'Password reset request submitted';
        }).catch(function(error) {
            if (error.response) {
                if (error.response.statusCode == 401) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, error.response.statusMessage));
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, error.response.statusMessage));
                }
            } else {
                return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
            }
        });
    }

    /*
     * Update User
     * accepts an object with the following optional properties
     * -name
     * -password
     */
    updateUser(userProps?: {nickname?:string, password?:string}): Promise<User> {
        if (!this.currentUser) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.NOT_LOGGED_IN, "User is not logged in"));
        }

        //nothing changed; no point contacting the server
        if (!userProps || (!userProps.nickname && !userProps.password)) {
            return Promise.resolve(this.currentUser);
        }

        let user:User = new User();
        user.nickname = this.currentUser.nickname;
        user.deviceId = this.currentUser.deviceId;

        if (userProps.nickname) {
            user.nickname = userProps.nickname;
        }
        if (userProps.password) {
            user.password = userProps.password;
        }

        return this.userApi.userMePost(this.currentUser.apiKey, user).then(function(data) {
            if (!data.body.apiKey) {
                data.body.apiKey = this.currentUser.apiKey; //apiKey only returned on password change so we need to copy it.
            }

            this.currentUser = data.body;
            this.storeUser();
            return this.currentUser;
        }.bind(this)).catch(function(error) {
            if (error.response) {
                if (error.response.statusCode == 400) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, error.response.statusMessage));
                } else if (error.response.statusCode == 401) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, error.response.statusMessage));
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, error.response.statusMessage));
                }
            } else {
                return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
            }
        }.bind(this)) as Promise<User>;
    }

    /*
     * Refresh user info
     */
    refreshUser(): Promise<User> {
        if (!this.currentUser) {
            return Promise.resolve(null);
        }

        return this.userApi.userMeGet(this.currentUser.apiKey).then(function(data) {
            if (!data.body.apiKey) {
                data.body.apiKey = this.currentUser.apiKey; //apiKey only returned on password change so we need to copy it.
            }

            this.currentUser = data.body;
            this.storeUser();
            return this.currentUser;
        }.bind(this)).catch(function(error) {
            if (error.response) {
                if (error.response.statusCode == 401) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, error.response.statusMessage));
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, error.response.statusMessage));
                }
            } else {
                return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
            }
        }.bind(this)) as Promise<User>;
    }

    /*
     * Delete current user. Returns promise containing user just deleted.
     */
    deleteUser(): Promise<User> {
        if (!this.currentUser) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.NOT_LOGGED_IN, "User is not logged in"));
        }

        return this.userApi.userMeDelete(this.currentUser.apiKey).then(function() {
            let user = this.currentUser;
            this.logoutUser();
            return user;
        }.bind(this)).catch(function(error) {
            if (error.response) {
                if (error.response.statusCode == 401) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, error.response.statusMessage));
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, error.response.statusMessage));
                }
            } else {
                return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
            }
        }) as Promise<User>;
    }

    /*
     * Set user object. This is called when using 3rd party auth
     */
    setUser(userJson: string): Promise<User> {
        let user: User;
        try {
            user = JSON.parse(userJson);
        } catch (error) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Invalid user JSON"));
        }

        if (!user.apiKey) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "User JSON does not contain api key"));
        }

        this.currentUser = user;
        return this.refreshUser();
    }

    private storeUser() {
        localStorage.setItem("kidaptive.alp.user", JSON.stringify(this.currentUser));
    }

    loadStoredUser() {
        this.currentUser = JSON.parse(localStorage.getItem("kidaptive.alp.user"));
    }

    private deleteStoredUser() {
        localStorage.removeItem("kidaptive.alp.user")
    }
}

export {UserManagerDelegate, UserManager};