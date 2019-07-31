import Constants from './constants';
import Error from './error';
import EventManager from './event-manager';
import HttpClient from './http-client';
import ModelManager from './model-manager';
import OperationManager from './operation-manager';
import RecommendationManager from './recommendation-manager';
import State from './state';
import Utils from './utils';
import Q from 'q';

class KidaptiveSdkLearnerManager {

  /**
   * Set the user object that contains the user metadata
   * For client based auth, the object in the parameter can only set the providerUserId.
   * For server based auth, the object in the parameter must have all properties.
   * 
   * @param {object} userObject
   *   The metadata object containing apiKey, user, and learners
   * 
   * @return
   *   A promise that resolves when the user has been set
   */
  setUser(userObject = {}) {
    return OperationManager.addToQueue(() => {
      Utils.checkTier(1);
      const options = State.get('options') || {};

      //if client level auth
      if (options.authMode === 'client') {

        //validate providerUserId
        if (userObject.providerUserId == null) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'providerUserId is required');
        }
        if (!Utils.isString(userObject.providerUserId)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'providerUserId must be a string');
        }

        if (userObject.providerLearnerId != null && !Utils.isString(userObject.providerLearnerId)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'if providerLearnerId is specified, it must be a string');
        }

        //if an apiKey is passed in the SDK is likely configured to the wrong auth mode
        if (userObject.apiKey != null) {
          throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'setUser apiKey not supported when the SDK authMode is cient');
        }

        //if a providerId is passed in the SDK is likely configured to the wrong auth mode
        if (userObject.providerId != null) {
          throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'setUser providerId not supported when the SDK authMode is cient');
        }

        //if an id is passed in the SDK is likely configured to the wrong auth mode
        if (userObject.id != null) {
          throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'setUser id not supported when the SDK authMode is cient');
        }

      }

      //if server level auth
      if (options.authMode === 'server') {
        const commonParamError = 'Invalid object passed to setUser. Please ensure SDK authmode is correct and the object being passed to setUser is correct.';

        //validate apiKey
        if (userObject.apiKey == null) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, commonParamError + ' ApiKey is required');
        }
        if (!Utils.isString(userObject.apiKey)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, commonParamError + ' ApiKey must be a string');
        }

        //validate user ID
        if (userObject.id == null) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, commonParamError + ' User ID is required');
        }
        if (!Utils.isNumber(userObject.id)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, commonParamError + ' User ID must be a number');
        }

        //validate learners
        if (!Utils.isArray(userObject.learners)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, commonParamError + ' Learners must be an array');
        }

        //validate learner IDs
        userObject.learners.forEach((learner) => {
          if (!Utils.isObject(learner)) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, commonParamError + ' Learner must be an object');
          }
          if (learner.id == null) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, commonParamError + ' Learner ID is required');
          }
          if (!Utils.isNumber(learner.id)) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, commonParamError + ' Learner ID must be a number');
          }
          if (learner.providerId == null) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, commonParamError + ' Learner ProviderID is required');
          }
          if (!Utils.isString(learner.providerId)) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, commonParamError + ' Learner ProviderID must be a string');
          }
        });
      }

      //flush events before changing user
      return EventManager.flushEventQueue().then(() => {
        //if client level auth
        if (options.authMode === 'client') {

          //send providerUserId to learner session endpoint to create user
          return HttpClient.request(
            'POST', 
            Constants.ENDPOINT.CLIENT_SESSION, 
            userObject,
            {defaultApiKey: true}
          ).then((userObjectResponse) => {

            //if the userId is different from cached userId, clear the user cache after request successful
            if (KidaptiveSdkLearnerManager.userIdDifferent(userObjectResponse.id)) {

              //call logout to log existing user out
              return this.logout().then(() => {

                //cache this response since it was just cleared during logout
                const cacheKey = HttpClient.getCacheKey(HttpClient.getRequestSettings(
                  'POST', 
                  Constants.ENDPOINT.CLIENT_SESSION, 
                  {providerUserId: userObject.providerUserId},
                  {defaultApiKey: true}
                ));
                Utils.localStorageSetItem(cacheKey, userObjectResponse);

                //call method to cache user and set state
                KidaptiveSdkLearnerManager.onClientSetUserSuccess(userObjectResponse);
              });

            }
            
            //call method to cache user and set state
            KidaptiveSdkLearnerManager.onClientSetUserSuccess(userObjectResponse);
          });
        }

        //if server level auth
        if (options.authMode === 'server') {

          //if the providerUserId is different from cached providerUserId, clear the user cache
          if (KidaptiveSdkLearnerManager.userIdDifferent(userObject.id)) {

            //call logout to log existing user out
            return this.logout().then(() => {

              //call method to cache user and set state
              KidaptiveSdkLearnerManager.onServerSetUserSuccess(userObject);
            });

          }

          //call method to cache user and set state
          KidaptiveSdkLearnerManager.onServerSetUserSuccess(userObject);
        }
      });
    });
  }

  /**
   * Set the state and cache for a user when authMode client setUser is complete
   *
   * @param {object} userObjectResponse
   *   The user object response from the client session endpoint
   */
  static onClientSetUserSuccess(userObjectResponse) {
    //cache new user and singletonLearner flag for future
    Utils.cacheUser(userObjectResponse);
    Utils.cacheSingletonLearnerFlag(false);

    //set the state
    State.set('user', userObjectResponse);
    State.set('learnerId', undefined);
    State.set('singletonLearner', false);
  }

  /**
   * Set the state and cache for a user when authMode server setUser is complete
   *
   * @param {object} userObject
   *   The user object provided from the backend
   */
  static onServerSetUserSuccess(userObject) {
    //cache new user object for future comparison
    Utils.cacheUser(userObject);
    Utils.cacheSingletonLearnerFlag(false);

    //set the state
    State.set('user', userObject);
    State.set('learnerId', undefined);
    State.set('singletonLearner', false);
  }

  /**
   * Sets the active learner by the Provider Learner ID.
   * For client based auth, this will send a request to the server to set the learner.
   * For server based auth, this requires that setUser is called first.
   * For server based auth, this will validate against the learners provided in setUser.
   * 
   * @param {string} providerLearnerId
   *   The provider learnr ID to set as the active learner
   * 
   * @return
   *   A promise that resolves when the learner has been activated
   */
  selectActiveLearner(providerLearnerId) {
    return OperationManager.addToQueue(() => {
      Utils.checkTier(1);
      const options = State.get('options') || {};
      const user = State.get('user');
      const learnerId = State.get('learnerId');
      //default singleton learner to true if its not set explicitly to false, as it won't be set if set user has never been called
      const singletonLearner = State.get('singletonLearner') === false ? false : true;

      //validate providerLearnerId
      if (providerLearnerId == null) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'providerLearnerId is required');
      }
      if (!Utils.isString(providerLearnerId)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'providerLearnerId must be a string');
      }
     
      //if client level auth
      if (options.authMode === 'client') {

        //get learner from user learner list if it exists
        const learner = Utils.findItem(this.getLearnerList(), learner => (learner.providerId === providerLearnerId));

        //if learner does exist in user object, then set learner without doing a request to client session
        if (learner) {
          //set learner
          State.set('learnerId', learner.id);
          Utils.cacheLearnerId(learner.id);
          
          //if tier 2 or greater, update ability estimates for learner before starting trial
          if (options.tier >= 2) {
            return this.updateAbilityEstimates().then(() => {}, () => {}).then(() => {
              return this.startTrial();
            });
          }

          //otherwise start trial immediately
          return this.startTrial()
        }

        //if singletonLearner (setUser not called), log that learner out before setting new learner
        if (singletonLearner && learnerId != null) {

          //call logout
          return this.logout().then(() => {
            //once the user is logged out, resubmit the selectActiveLearner function call
            return this.selectActiveLearner(providerLearnerId);
          });
        }

        //send providerLearnerID and providerUserId to learner session endpoint to create user and learner
        return HttpClient.request(
          'POST', 
          Constants.ENDPOINT.CLIENT_SESSION, 
          {providerLearnerId, providerUserId: user && user.providerId},
          {defaultApiKey: true}
        ).then((userObjectResponse) => {

          //get the previous user object to modify it
          let newUserObject = State.get('user');

          //if the user is not a singletonLearner user, and the learner doesn't already exist, then this http request occured
          //and the learner returned from this request should be merged into the list
          if (!singletonLearner) {
            if (userObjectResponse.learners < 1) {
              throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'The client session response is missing learner information');
            }
            newUserObject.learners.push(userObjectResponse.learners[0]);

          //otherwise use the response as the new user object
          } else {
            newUserObject = userObjectResponse;

            //since singleton learner truthy value never cached, cache it now
            State.set('singletonLearner', true);
            Utils.cacheSingletonLearnerFlag(true);
          }

          //set the user state
          State.set('user', newUserObject);

          //set the learner state
          const activeLearner = Utils.findItem(this.getLearnerList(), learner => (learner.providerId === providerLearnerId));
          if (!activeLearner) {
            throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'A learner with that providerLearnerId does not exist');
          }
          State.set('learnerId', activeLearner.id);

          //cache the new user and learnerId for future comparison
          Utils.cacheUser(newUserObject);
          Utils.cacheLearnerId(activeLearner.id);

          //if tier 2 or greater, update ability estimates for learner before starting trial
          if (options.tier >= 2) {
            return this.updateAbilityEstimates().then(() => {}, () => {}).then(() => {
              return this.startTrial();
            });
          }

          //otherwise start trial immediately
          return this.startTrial()
        });
      }

      //if server level auth
      if (options.authMode === 'server') {

        //setUser must be called before selecting an active learner
        if (!user) {  
          throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'KidaptiveSdk.leanerManager.setUser must be called before setting an active learner when using server authentication');
        }

        //validate that the providerLearnerId exists for that user
        const activeLearner = Utils.findItem(this.getLearnerList(), learner => (learner.providerId === providerLearnerId));
        if (!activeLearner) {
          throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'A learner with that providerLearnerId does not exist');
        }

        //set the state
        State.set('learnerId', activeLearner.id);

        //cache the new learnerId
        Utils.cacheLearnerId(activeLearner.id);

        //if tier 2 or greater, update ability estimates for learner before starting trial
        if (options.tier >= 2) {
          return this.updateAbilityEstimates().then(() => {
            return this.startTrial();
          });
        }

        //otherwise start trial immediately
        return this.startTrial()
      }
    });
  }

  /**
   * Clears the active learner and all stored learner information.
   * 
   * @return
   *   A promise that resolves when the learner has been cleared
   */
  clearActiveLearner() {
    return OperationManager.addToQueue(() => {
      Utils.checkTier(1);

      //if client based auth and singletonLearner
      const options = State.get('options') || {};
      if (options.authMode === 'client' && State.get('singletonLearner') === true) {
        //clear the user cache as the user and learner relationship is one to one
        Utils.clearUserCache();
        //clear the user state
        State.set('user', undefined);
      }

      //clear the learner state
      State.set('learnerId', undefined);
      Utils.cacheLearnerId(undefined);
    });
  }

  /**
   * Clears the user and learner information and logs the user out.
   * For server based auth, this will send a logout request to the server.
   * 
   * @return
   *   A promise that resolves when the user has been logged out
   */
  logout() {
    return OperationManager.addToQueue(() => {
      Utils.checkTier(1);

      //flush event queue before logging user out
      return EventManager.flushEventQueue().then(() => {
        const options = State.get('options') || {};

        //if authMode server, call logout endpoint
        if (options.authMode === 'server' && State.get('user')) {
          //catch logout error to prevent breaking logout chain
          return HttpClient.request('POST', Constants.ENDPOINT.LOGOUT, undefined, {noCache: true}).then(() => {}, () => {});
        }
      }).then(() => {
        //clear the user cache
        Utils.clearUserCache();

        //reset state
        State.set('learnerId', undefined);
        State.set('user', undefined);
        State.set('singletonLearner', undefined);
      });
    });
  }

  /**
   * Gets the current user.
   * In server based auth, it returns the user object provided in the setUser method
   * In client based auth, it returns the user object from the Kidaptive API
   * 
   * @return
   *   The user object. If no user is defined, then undefined is returned.
   */
  getUser() {
    Utils.checkTier(1);

    //get the state
    return State.get('user') || undefined;
  }

  /**
   * Gets the active learner
   * In server based auth, it returns the relevant learner object provided in the setUser method
   * In client based auth, it returns the relevant learner object from the Kidaptive API
   * 
   * @return
   *   The learner object. If no active learner is defined, then undefined is returned.
   */
  getActiveLearner() {
    Utils.checkTier(1);

    //if no learner, return undefined
    const learnerId = State.get('learnerId');
    if (learnerId == null) {
      return;
    }

    //get learner from user learner list
    return Utils.findItem(this.getLearnerList(), learner => (learner.id === learnerId));
  }

  /**
   * Gets the learner list
   * In server based auth, it returns the learner list provided in the setUser method
   * In client based auth, it returns the learner list from the Kidaptive API
   * 
   * @return
   *   The learner array. If no learner list is defined, an empty array is returned.
   */
  getLearnerList() {
    Utils.checkTier(1);

    //get the state
    const userObject = State.get('user') || {};
    return Utils.isArray(userObject.learners) ? userObject.learners : [];
  }

  /**
   * Gets the specific metric from the server for the current active learner
   * 
   * @param {string} metricUri
   *   The URI of the metric object that is to be returned
   * 
   * @param {number} minTimestamp
   *   The start of the time range to start quering for the metric.
   *
   * @param {number} maxTimestamp
   *   The end of the time range to start quering for the metric.
   * 
   * @return
   *   A promise that resolves with the result of the server request for the metric
   */
  getMetricsByUri(metricUri, minTimestamp, maxTimestamp) {
    return Q.fcall(() => {
      Utils.checkTier(1);

      //validate metricUri
      if (metricUri == null) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'metricUri is required');
      }
      if (!Utils.isString(metricUri)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'metricUri must be a string');
      }

      //validate minTimestamp
      if (minTimestamp != null) {
        if (!Utils.isInteger(minTimestamp) || minTimestamp < 0) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'minTimestamp must be an integer that is at least 0');
        }
      }

      //validate maxTimestamp
      if (maxTimestamp != null) {
        if (!Utils.isInteger(maxTimestamp) || maxTimestamp < 1) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'maxTimestamp must be a positive integer greater than 0');
        }
      }

      //validate minTimestamp and maxTimestamp if both provided
      if (minTimestamp != null && maxTimestamp != null) {
        if (minTimestamp >= maxTimestamp) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'maxTimestamp must be greater than minTimestamp');
        }
        if ((maxTimestamp - minTimestamp) > 31536000000) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'minTimestamp and maxTimestamp can only be 1 year (365 days) apart');
        }
      }

      //if no learner, return
      const learnerId = State.get('learnerId');
      if (learnerId == null) {
        //log a warning
        if (Utils.checkLoggingLevel('warn') && console && console.log) {
          console.log('Warning: getMetricsByUri called with no active learner selected.');       
        }
        return;
      }

      //default minTimestamp and maxTimestamp
      if (minTimestamp == null && maxTimestamp == null) {
        //maxTimestamp is tomorrow
        maxTimestamp = Date.now() + 86400000;
        //minTimestamp 1 year before maxTimestamp
        minTimestamp = maxTimestamp - 31536000000;
      } else if (minTimestamp  == null) {
        //minTimestamp is 1 year before maxTimestamp
        minTimestamp = maxTimestamp - 31536000000;
        if (minTimestamp < 0) {
          minTimestamp = 0;
        }
      } else if (maxTimestamp == null) {
        //maxTimestamp is 1 year after minTimestamp
        maxTimestamp = minTimestamp + 31536000000;
      }

      //setup request data
      const data = {
        learnerId,
        items: [{
          name: metricUri,
          start: minTimestamp,
          end: maxTimestamp
        }]
      };

      //setup options
      const options = {
        noCache: true
      };

      //http request
      return HttpClient.request('POST', Constants.ENDPOINT.METRIC, data, options).then(result => {
        return result;
      });
    });
  }

  /**
   * Gets the latest specified insight from the server for the current active learner
   * 
   * @param {string} insightUri
   *   The URI of the insight object that is to be returned
   * 
   * @param {array} contextKeys
   *   An optional array of strings which specify which keys should be present on the resulting insight.
   *
   * @return
   *   A promise that resolves with the result of the server request for the insight
   */
  getLatestInsightByUri(insightUri, contextKeys) {
    return Q.fcall(() => {
      Utils.checkTier(1);

      //validate insightUri
      if (insightUri == null) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'insightUri is required');
      }
      if (!Utils.isString(insightUri)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'insightUri must be a string');
      }

      //validate contextKeys
      if (contextKeys != null) {
        if (!Utils.isArray(contextKeys)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'contextKeys must be an array');
        } else {
          contextKeys.forEach(contextKey => {
            if (!Utils.isString(contextKey)) {
              throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'contextKeys must be an array of strings');
            }
          });
        }
      }

      //if no learner, return
      const learnerId = State.get('learnerId');
      if (learnerId == null) {
        //log a warning
        if (Utils.checkLoggingLevel('warn') && console && console.log) {
          console.log('Warning: getLatestInsightByUri called with no active learner selected.');       
        }
        return;
      }

      //setup request data
      const data = {
        learnerId,
        uri: insightUri,
        latest: true
      };
      if (contextKeys != null) {
        //join context keys into comma separated list
        data.contextKeys = contextKeys.join(',');
      }

      //setup options
      const options = {
        noCache: true
      };

      //http request
      return HttpClient.request('GET', Constants.ENDPOINT.INSIGHT, data, options).then(result => {
        return (result && result.length) ? result[0] : undefined;
      });
    });
  }

  /**
   * Gets all insights from a specific timestamp
   * 
   * @param {number} minTimestamp
   *   Insights that occur after the timestamp will be queried.
   * 
   * @param {object} contextMap
   *   An optional object of key:value string pairs which filter what insights are returned.
   *
   * @return
   *   A promise that resolves with the result of the server request for the insights
   */
  getInsights(minTimestamp, contextMap) {
    return Q.fcall(() => {
      Utils.checkTier(1);

      //validate minTimestamp
      if (minTimestamp == null) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'minTimestamp is required');
      }
      if (!Utils.isInteger(minTimestamp) || minTimestamp < 0) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'minTimestamp must be an integer that is at least 0');
      }

      //validate contextKeys
      if (contextMap != null) {
        if (!Utils.isObject(contextMap)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'contextMap must be an object');
        } else {
          Object.keys(contextMap).forEach(contextKey => {
            if (!Utils.isString(contextMap[contextKey])) {
              throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'contextMap must be an object of key:value pairs with string values');
            }
          });
        }
      }

      //if no learner, return
      const learnerId = State.get('learnerId');
      if (learnerId == null) {
        //log a warning
        if (Utils.checkLoggingLevel('warn') && console && console.log) {
          console.log('Warning: getInsights called with no active learner selected.');       
        }
        return [];
      }

      //setup request data
      const data = {
        learnerId,
        minDateCreated: minTimestamp
      };
      if (contextMap != null) {
        Object.keys(contextMap).forEach(contextKey => {
          data['context.' + contextKey] = contextMap[contextKey];
        });
      }

      //setup options
      const options = {
        noCache: true
      };

      //http request
      return HttpClient.request('GET', Constants.ENDPOINT.INSIGHT, data, options).then(result => {
        return result;
      });
    });
  }

  /**
   * Starts a trial for the given learner. Sends the trial time length when sending events
   * If no learner is selected, the function will log a warning, and resolve the promise
   * 
   * @return
   *   A promise that resolves when the trial has been started
   */
  startTrial() {
    return OperationManager.addToQueue(() => {
      Utils.checkTier(1);

      //resolve the promise if a learner is not set
      const learnerId = State.get('learnerId');
      if (learnerId == null) {
        //log a warning
        if (Utils.checkLoggingLevel('warn') && console && console.log) {
          console.log('Warning: startTrial called with no active learner selected.');       
        }
        return;
      }

      //get trial time
      const trialTime = Date.now();

      //adjust standard deviation to be at least 0.65
      const options = State.get('options');
      if (options.tier >= 3) {

        //get latent abilities for learner
        const previousLatentAbilities = State.get('latentAbilities.' + learnerId) || [];

        //adjust standard deviation for each latent ability
        const updatedLatentAbilities = previousLatentAbilities.map(latentAbility => {

          //copy object
          const updatedLatentAbility = Utils.copyObject(latentAbility);

          //adjust latent ability
          if (updatedLatentAbility.standardDeviation < 0.65) {
            updatedLatentAbility.standardDeviation = 0.65;
            updatedLatentAbility.timestamp = trialTime;
          }

          //return adjusted latent ability
          return updatedLatentAbility;
        });

        //update latent abilities in state
        State.set('latentAbilities.' + learnerId, updatedLatentAbilities);
      }

      //save trial start timestamp
      State.set('trialTime', trialTime);
    });
  }

  /**
   * Returns the latent ability estimates of the current active learner for all dimensions 
   * If no active learner is selected, the function will log a warning, and return an empty array
   * If no ability estimate exists for all or any of the dimension, a default ability estimate will be returned
   *
   * @return
   *   An array of objects of the latent ability estimates for all dimensions
   */
  getLatentAbilityEstimates() {
    Utils.checkTier(2);

    //if a learner is not set return an empty array
    const learnerId = State.get('learnerId');
    if (learnerId == null) {
      //log a warning
      if (Utils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: getLatentAbilityEstimates called with no active learner selected.');       
      }
      return [];
    }

    //map latent ability estimates to all available latent abilities
    return ModelManager.getDimensions().map(dimension => {
      return this.getLatentAbilityEstimate(dimension && dimension.uri);
    });
  }

  /**
   * Returns the latent ability estimate of the current active learner for the specified dimension
   * If no active learner is selected, the function will log a warning, and return undefined
   * If no ability estimate exists, a default ability estimate will be returned
   *
   * @param {string} dimensionUri
   *   The dimensionUri of the latent ability estimate that is to be returned
   * 
   * @return
   *   An object of the latent ability estimate for the specified dimension
   */
  getLatentAbilityEstimate(dimensionUri) {
    Utils.checkTier(2);

    //if a learner is not set return undefined
    const learnerId = State.get('learnerId');
    if (learnerId == null) {
      //log a warning
      if (Utils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: getLatentAbilityEstimate called with no active learner selected.');       
      }
      return;
    }

    //get dimension
    const dimension = ModelManager.getDimensionByUri(dimensionUri);

    //if dimension does not exist, return undefined
    if (!dimension) {
      //log a warning
      if (Utils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: getLatentAbilityEstimate called with an invalid dimension.');       
      }
      return;
    }

    //find learner latent ability
    const latentAbilities = State.get('latentAbilities.' + learnerId) || [];
    const latentAbility = Utils.copyObject(Utils.findItem(latentAbilities, latentAbility => latentAbility.dimension.id === dimension.id));

    //if latent ability found, return that latent ability
    if (latentAbility) {
      return latentAbility;
      
    //if nothing found return default
    } else {
      return {
        dimension: dimension,
        mean: 0,
        standardDeviation: 1,
        timestamp: 0
      }
    }
  }

  /**
   * Returns the local ability estimates of the current active learner for all local dimensions 
   * If no active learner is selected, the function will log a warning, and return an empty array
   * If no ability estimate exists for all or any of the local dimension, a default ability estimate will be returned
   *
   * @return
   *   An array of objects of the local ability estimates for all local dimensions
   */
  getLocalAbilityEstimates() {
    Utils.checkTier(2);

    //if a learner is not set return an empty array
    const learnerId = State.get('learnerId');
    if (learnerId == null) {
      //log a warning
      if (Utils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: getLatentAbilityEstimates called with no active learner selected.');       
      }
      return [];
    }

    //map local ability estimates to all available local dimensions
    return ModelManager.getLocalDimensions().map(localDimension => {
      return this.getLocalAbilityEstimate(localDimension && localDimension.uri);
    });
  }

  /**
   * Returns the local ability estimate of the current active learner for the specified local dimension
   * If no active learner is selected, the function will log a warning, and return undefined
   * If no ability estimate exists, a default ability estimate will be returned
   *
   * @param {string} localDimensionUri
   *   The localDimensionUri of the local ability estimate that is to be returned
   * 
   * @return
   *   An object of the local ability estimate for the specified local dimension
   */
  getLocalAbilityEstimate(localDimensionUri) {
    Utils.checkTier(2);

    //if a learner is not set return undefined
    const learnerId = State.get('learnerId');
    if (learnerId == null) {
      //log a warning
      if (Utils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: getLocalAbilityEstimate called with no active learner selected.');       
      }
      return;
    }

    //get local dimension
    const localDimension = ModelManager.getLocalDimensionByUri(localDimensionUri);

    //if local dimension does not exist, return undefined
    if (!localDimension) {
      //log a warning
      if (Utils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: getLocalAbilityEstimate called with an invalid local dimension.');       
      }
      return;
    }

    //get parent dimension
    const dimension = localDimension.dimension || {};

    //find learner latent ability
    const latentAbilities = State.get('latentAbilities.' + learnerId) || [];
    const latentAbility = Utils.copyObject(Utils.findItem(latentAbilities, latentAbility => latentAbility.dimension.id === dimension.id));

    //if latent ability found, return that local ability
    if (latentAbility) {

      //return local ability based off latent ability estimates
      return {
        localDimension,
        mean: latentAbility.mean,
        standardDeviation: latentAbility.standardDeviation,
        timestamp: latentAbility.timestamp
      }

    //if nothing found return default
    } else {
      return {
        localDimension,
        mean: 0,
        standardDeviation: 1,
        timestamp: 0
      }
    }
  }

  /**
   * Updates the ability estimates for the current active learner
   * If no learner is selected, the function will log a warning, and resolve the promise
   * 
   * @return
   *   A promise that resolves when the ability estimates have been updated from the server
   */
  updateAbilityEstimates() {
    return OperationManager.addToQueue(() => {
      Utils.checkTier(2);

      //check if learner is set
      const learnerId = State.get('learnerId');
      if (learnerId == null) {
        //log a warning
        if (Utils.checkLoggingLevel('warn') && console && console.log) {
          console.log('Warning: updateAbilityEstimates called with no active learner selected.');       
        }

        //resolve the promise
        return;
      }

      //get reference to dimension id model
      const idToModel = State.get('idToModel', false) || {};
      const idToDimension = idToModel.dimension || {};

      //try to get latent abilities from local storage cache
      const cacheKey = HttpClient.getCacheKey(HttpClient.getRequestSettings('GET', Constants.ENDPOINT.ABILITY , {learnerId}));
      let previousLatentAbilities;
      try {
        previousLatentAbilities = Utils.localStorageGetItem(cacheKey) || [];
        //attach dimension objects to match state version of latentAbilities
        previousLatentAbilities.forEach(previousAbility => {
          previousAbility.dimension = idToDimension[previousAbility.dimensionId];
          delete previousAbility.dimensionId;
        });

      //if that fails, get them from state or default to empty array
      } catch(e) {
        previousLatentAbilities = State.get('latentAbilities.' + learnerId) || [];
      }

      //query abilities
      return HttpClient.request('GET', Constants.ENDPOINT.ABILITY , {learnerId: learnerId}, {noCache:true}).then(latentAbilities => {
        //pass abilities to then function
        return latentAbilities;

      //swallow http error
      }, error => {
        //pass empty array to then function
        return [];

      //handle response after http error handled in case this code ever generates an error
      }).then(latentAbilities => {

        const newAbilities = [];

        //loop through abilities returned from server and compare with previous abilities to pick the most current one
        latentAbilities.forEach(latentAbility => {

          //find previous ability
          const previousLatentAbility = Utils.findItem(previousLatentAbilities, previousAbility => previousAbility.dimension.id === latentAbility.dimensionId);
          //if previous ability doesnt exist or previous ability timestamp is less than the ability returned from the server
          if (!previousLatentAbility || previousLatentAbility.timestamp < latentAbility.timestamp) {

            //replace dimensionId with dimension reference
            const newAbility = Utils.copyObject(latentAbility);
            newAbility.dimension = idToDimension[newAbility.dimensionId];
            delete newAbility.dimensionId;

            //add new ability
            newAbilities.push(newAbility);

          //if previous ability timestamp is greater, then it is more recent and use that
          } else {
            newAbilities.push(previousLatentAbility);

          }
        });

        //if new abilities missing any previous abilities, add them to the array
        previousLatentAbilities.forEach(previousAbility => {
          if (!Utils.findItem(newAbilities, newAbility => newAbility.dimension.id === previousAbility.dimension.id)) {
            newAbilities.push(previousAbility);
          }
        });

        //store copy of learner ability estimates in state
        State.set('latentAbilities.' + learnerId, newAbilities);

        //store copy of learner ability estimates in cache
        Utils.cacheLatentAbilityEstimates(newAbilities);

      //resolve error if there was one
      });
            
    });
  }

  /**
   * Returns recommendations based on the prompts associated with the local dimension 
   * and the learner's ability estimate for that local dimension.
   *
   * @param {string} localDimensionUri
   *   The localDimensionUri to be used for getting associated prompts and the learner's ability estimate
   *
   * @param {number} targetSuccessProbability
   *   The target success probability for the learner to succeed at the given prompt, between 0 and 1
   *
   * @param {number} maxResults
   *   The maximum number of recommendations that are desired
   *
   * @param {array} excludedPromptUris
   *   An array of promptUris which determine which prompts should be excluded from consideration when generating the recommendations
   *
   * @param {array} includedPromptUris
   *   An array of promptUris which determine which prompts should be included from used when generating the recommendations.
   *   ExcludedPromptUris will take priority and potentially exclude items from this list.
   * 
   * @return
   *   An array of recommendations in the form of an array of prompt uris
   */
  getSuggestedPrompts(localDimensionUri, targetSuccessProbability, maxResults, excludedPromptUris, includedPromptUris) {
    Utils.checkTier(3);

    //get recommendation
    const result = RecommendationManager.getRecommendation('optimalDifficulty', {localDimensionUri, targetSuccessProbability, maxResults, excludedPromptUris, includedPromptUris});

    //if an error is present, throw it
    if (result.error) {
      throw result.error;
    }

    //return recommendations
    return result.recommendations;
  }

  /**
   * Returns random recommendations based on the prompts associated with the game
   *
   * @param {string} gameUri
   *   The gameUri to be used for getting associated prompts
   *
   * @param {number} maxResults
   *   The maximum number of recommendations that are desired
   *
   * @param {array} excludedPromptUris
   *   An array of promptUris which determine which prompts should be excluded from consideration when generating the recommendations
   *
   * @param {array} includedPromptUris
   *   An array of promptUris which determine which prompts should be included from used when generating the recommendations.
   *   ExcludedPromptUris will take priority and potentially exclude items from this list.
   * 
   * @return
   *   An array of recommendations in the form of an array of prompt uris
   */
  getRandomPromptForGame(gameUri, maxResults, excludedPromptUris, includedPromptUris) {
    Utils.checkTier(3);

    //get recommendation
    const result = RecommendationManager.getRecommendation('random', {gameUri, maxResults, excludedPromptUris, includedPromptUris});

    //if an error is present, throw it
    if (result.error) {
      throw result.error;
    }

    //return recommendations
    return result.recommendations;
  }

  /**
   * Compares the userId with the userId in the state, or the cache
   *
   * @param {number} userId
   *   The user ID of the user to compare with the cached version
   *
   * @return
   *   If the userId is different from the cached userId, return true
   *   If the userId is the same as the cached userId, return false
   */
  static userIdDifferent(userId) {
    const user = State.get('user') || Utils.getCachedUser();
    //compare providerUserId, or if no user in the cache, see if the new userId is defined
    return user ? (user.id !== userId) : (userId != null);
  }
}

export default new KidaptiveSdkLearnerManager();
