import Constants from './constants';
import Error from './error';
import State from './state';
import Utils from './utils';
import Base64 from 'base-64';
import Sha256 from 'js-sha256';
import Q from 'q';
import Superagent from './superagent-q';

class KidaptiveSdkHttpClient {

  /**
   * Sends a request to the Kidaptive API
   * 
   * @param {string} method
   *   The method to use for the request: 'POST' or 'GET'
   *
   * @param {string} endpoint
   *   The endpoint to send the request to
   *
   * @param {object} data
   *   The post data or query data to send with the POST or GET request
   *
   * @param {object} options
   *   The options used to configure the requests
   * 
   * @return
   *   A promise that resolves when the request is complete
   */
  request(method, endpoint, data, options = {}) {
    return Q.fcall(() => {
      const settings = this.getRequestSettings(method, endpoint, data, options);
      const request = Superagent(settings.method, settings.host + settings.endpoint);
      // request.withCredentials();
      if (settings.method === 'POST') {
        request.send(settings.data);
      } else {
        request.query(settings.data); 
      }
      if (settings.contentType) {
        request.set('Content-Type', settings.contentType);
      }
      request.set('api-key', settings.apiKey);

      //get cache key
      const cacheKey = this.getCacheKey(settings);

      //certain older browsers may fail to catch the error
      try {

        return request.end().then(result => {
          //set cache
          if (!options.noCache) {
            Utils.localStorageSetItem(cacheKey, result.body);
          }
          //return result
          return result.body;
        }, error => {
          const parseError = (error.parse && 'Cannot parse response') || '';
          //error statusCode is available when there is a parse error
          const status = error && (error.status || error.statusCode);
          const errorMessage = (error.response && error.response.text) || parseError;
          if (status === 400) {
            Utils.localStorageRemoveItem(cacheKey);
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, errorMessage);
          } else if (status === 401) {
            //always delete user data
            Utils.clearUserCache();
            //if app endpoint, delete app data cache
            if (!KidaptiveSdkHttpClient.isUserEndpoint(endpoint)) {
              Utils.clearAppCache();
            }
            throw new Error(Error.ERROR_CODES.API_KEY_ERROR, errorMessage);
          } else if (status && (status < 200 || status >= 300)) {
            Utils.localStorageRemoveItem(cacheKey);
            throw new Error(Error.ERROR_CODES.WEB_API_ERROR, errorMessage);
          } else {
            try {
              return Utils.localStorageGetItem(cacheKey);
            } catch (e) {
              throw new Error(Error.ERROR_CODES.GENERIC_ERROR, 'HTTP Client Error' + (errorMessage ? (': ' + errorMessage) : ''));
            }
          }
        });

      //for browsers that completely fail to handle the http error correctly, catch the error here
      } catch (errorMessage) {
        //try to resolve the request with cache
        try {
          return Utils.localStorageGetItem(cacheKey);
        } catch (e) {
          throw new Error(Error.ERROR_CODES.GENERIC_ERROR, 'HTTP Client Error' + (errorMessage ? (': ' + errorMessage) : ''));
        }
      }
    });
  }

  /**
   * Given a settings object, generate a cache key
   *
   * @param {object} settings
   *   The settings object used to generate the cache key
   * 
   * @return
   *   Returns the cache key string to be used
   */
  getCacheKey(settings) {
    return Base64.encode(String.fromCharCode.apply(undefined, Sha256.array(Utils.toJson(settings))))
      .replace(/[+]/g,'-')
      .replace(/[/]/g,'_')
      .replace(/=+/,'') + (KidaptiveSdkHttpClient.isUserEndpoint(settings.endpoint) ? Constants.CACHE_KEY.USER : Constants.CACHE_KEY.APP);
  }

  /**
   * Given a method, endpoint, and data, determine the settings object used for the request
   *
   * @param {string} method
   *   The method to use for the request: 'POST' or 'GET'
   *
   * @param {string} endpoint
   *   The endpoint to send the request to
   *
   * @param {object} data
   *   The post data or query data to send with the POST or GET request
   *
   * @return
   *   Returns the settings object used to generate a cache key and to submit a request
   */
  getRequestSettings(method, endpoint, data, options = {}) {
      let apiKey = State.get('apiKey');
      const user = State.get('user');
      if (KidaptiveSdkHttpClient.isUserEndpoint(endpoint) && user && user.apiKey && !options.defaultApiKey) {
        apiKey = user.apiKey;
      }
      const settings = {
        method,
        host: KidaptiveSdkHttpClient.getHost(),
        apiKey,
        endpoint,
        data
      };
      if (method === 'POST') {
        settings.contentType = 'application/json';
      }
      return settings;
  }

  /**
   * Internal method to determinee which host the request should go to
   * 
   * @return
   *   Returns the host string that the request should be sent to
   */
  static getHost() {
    const options = State.get('options') || {};
    if (options.environment === 'prod') {
      return Constants.HOST.PROD;
    }
    if (options.environment === 'dev') {
      return Constants.HOST.DEV;
    }
    if (options.environment === 'custom') {
      return options.baseUrl;
    }
  }

  /**
   * Internal method to determine if an endpoint is a user endpoint
   *
   * @param {string} endpoint
   *   The endpoint to check if its a user endpoint
   * 
   * @return
   *   True or false for whether the endpoint is a user endpoint
   */
  static isUserEndpoint(endpoint) {
    return Utils.findItemIndex(Constants.USER_ENDPOINTS, item => {
      return Constants.ENDPOINT[item] === endpoint
    }) !== -1;
  }
}

export default new KidaptiveSdkHttpClient();
