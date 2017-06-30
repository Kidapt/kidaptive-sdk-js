import {KidaptiveError, KidaptiveErrorCode} from "./kidaptive_error";
import {KidaptiveConstants} from "./kidaptive_constants";
$ = require("jQuery");
/**
 * Created by solomonliu on 2017-05-22.
 */

class KidaptiveHttpClient {
    private host;

    constructor(dev:boolean, private apiKey: string) {
        if (dev) {
            this.host = KidaptiveConstants.HOST_DEV;
        } else {
            this.host = KidaptiveConstants.HOST_PROD;
        }
    }

    ajax(method:string, endpoint:string, params) : any {
        let settings = this.getCommonSettings();
        settings.method = method;
        settings.url = this.host + endpoint;

        if (settings.method == 'GET') {
            settings.data = params;
        } else if (settings.method == 'POST') {
            settings.contentType = "application/json";
            settings.data = JSON.stringify(params);
        } else {
            return $.Deferred().reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Method must be 'GET' or 'POST'"));
        }

        return KidaptiveHttpClient.promiseHelper($.ajax(settings));
    }

    private getCommonSettings(): any {
        return {
            headers: {
                "api-key": this.apiKey
            },
            xhrFields: {
                withCredentials: true
            }
        }
    }

    private static promiseHelper(jqxhr: JQueryXHR) : JQueryPromise<any> {
        return jqxhr.then(function(data) {
            return data;
        }, function(xhr) {
            if (xhr.status == 400) {
                throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, xhr.responseText);
            } else if (xhr.status == 401) {
                throw new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, xhr.responseText);
            } else if (xhr.status) {
                throw new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, xhr.responseText);
            } else {
                throw new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, "HTTP Client Error");
            }
        });
    }
}

export {KidaptiveHttpClient}