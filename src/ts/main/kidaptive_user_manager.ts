/**
 * Created by solomonliu on 7/8/16.
 */

import Promise = require("bluebird");

import {KidaptiveErrorCode, KidaptiveError} from "./kidaptive_error";
import {User} from "../../../swagger-client/api";

interface UserManagerDelegate {
    getAppApiKey: () => string;
    getSwagger: () => any;
}

class UserManager {
    currentUser: User;

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
        return this.delegate.getSwagger().user.post_user_logout({"Api-Key": this.delegate.getAppApiKey()}).then(function() {
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
        return this.delegate.getSwagger().user.get_user_me({"Api-Key": this.delegate.getAppApiKey()}).then(function(data) {
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