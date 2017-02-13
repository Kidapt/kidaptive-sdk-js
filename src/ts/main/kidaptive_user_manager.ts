/**
 * Created by solomonliu on 7/8/16.
 */

import Promise = require("bluebird");

import {KidaptiveErrorCode, KidaptiveError} from "./kidaptive_error";
import {User, UserApi} from "../../../swagger-client/api";
import {KidaptiveConstants} from "./kidaptive_constants";
import SwaggerClient = require("swagger-client");

interface UserManagerDelegate {
    getAppApiKey: () => string;
    getSwaggerClient: () => SwaggerClient;
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
     * Logout User
     */
    logoutUser():Promise<void> {
        this.currentUser = null;
        UserManager.deleteStoredUser();
        return this.userApi.userLogoutPost(this.delegate.getAppApiKey()).then(function() {
            return;
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

    refreshUser(): Promise<User> {
        return this.delegate.getSwaggerClient().then(function(swagger) {
            return swagger.user.get_user_me({"Api-Key": this.delegate.getAppApiKey()})
        }).then(function(data) {
            this.currentUser = data.obj;
            this.storeUser();
            return this.currentUser;
        }.bind(this), function(error) {
            return error.errorObj;
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
        }) as Promise<User>;
    }

    /*
     * Delete current user. Returns promise containing user just deleted.
     */
    deleteUser(): Promise<User> {
        if (!this.currentUser) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.NOT_LOGGED_IN, "User is not logged in"));
        }

        return this.userApi.userMeDelete(this.delegate.getAppApiKey()).then(function() {
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

    private storeUser() {
        localStorage.setItem("kidaptive.alp.user", JSON.stringify(this.currentUser));
    }

    loadStoredUser() {
        this.currentUser = JSON.parse(localStorage.getItem("kidaptive.alp.user"));
    }

    private static deleteStoredUser() {
        localStorage.removeItem("kidaptive.alp.user")
    }
}

export {UserManagerDelegate, UserManager};