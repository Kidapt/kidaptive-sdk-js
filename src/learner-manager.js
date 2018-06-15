import Constants from './constants';
import Error from './error';
import EventManager from './event-manager';
import HttpClient from './http-client';
import OperationManager from './operation-manager';
import State from './state';
import Utils from './utils';

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

        //if an apiKey is passed in the SDK is likely configured to the wrong auth mode
        if (userObject.apiKey != null) {
          throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'setUser apiKey not supported when the SDK authMode is server');
        }

        //if a providerId is passed in the SDK is likely configured to the wrong auth mode
        if (userObject.providerId != null) {
          throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'setUser providerId not supported when the SDK authMode is server');
        }

        //if an id is passed in the SDK is likely configured to the wrong auth mode
        if (userObject.id != null) {
          throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'setUser id not supported when the SDK authMode is server');
        }
      }

      //if server level auth
      if (options.authMode === 'server') {

        //validate apiKey
        if (userObject.apiKey == null) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Invalid object passed to setUser. Please insure SDK authmode is correct and object being passed to setUser is correct. ApiKey is required');
        }
        if (!Utils.isString(userObject.apiKey)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Invalid object passed to setUser. Please insure SDK authmode is correct and object being passed to setUser is correct. ApiKey must be a string');
        }

        //validate user ID
        if (userObject.id == null) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Invalid object passed to setUser. Please insure SDK authmode is correct and object being passed to setUser is correct. User ID is required');
        }
        if (!Utils.isNumber(userObject.id)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Invalid object passed to setUser. Please insure SDK authmode is correct and object being passed to setUser is correct. User ID must be a number');
        }

        //validate learners
        if (!Utils.isArray(userObject.learners)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Invalid object passed to setUser. Please insure SDK authmode is correct and object being passed to setUser is correct. Learners must be an array');
        }

        //validate learner IDs
        userObject.learners.forEach((learner) => {
          if (!Utils.isObject(learner)) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Invalid object passed to setUser. Please insure SDK authmode is correct and object being passed to setUser is correct. Learner must be an object');
          }
          if (learner.id == null) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Invalid object passed to setUser. Please insure SDK authmode is correct and object being passed to setUser is correct. Learner ID is required');
          }
          if (!Utils.isNumber(learner.id)) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Invalid object passed to setUser. Please insure SDK authmode is correct and object being passed to setUser is correct. Learner ID must be a number');
          }
          if (learner.providerId == null) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Invalid object passed to setUser. Please insure SDK authmode is correct and object being passed to setUser is correct. Learner ProviderID is required');
          }
          if (!Utils.isString(learner.providerId)) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Invalid object passed to setUser. Please insure SDK authmode is correct and object being passed to setUser is correct. Learner ProviderID must be a string');
          }
        });
      }
    }).then(() => {
      const options = State.get('options') || {};

      //if client level auth
      if (options.authMode === 'client') {
        //flush events before changing user
        return EventManager.flushEventQueue().then(() => {

          //send providerUserId to learner session endpoint to create user
          return HttpClient.request(
            'POST', 
            Constants.ENDPOINT.CLIENT_SESSION, 
            {providerUserId: userObject.providerUserId}, 
            {noCache: true}
          ).then((userObjectResponse) => {

            //set the state
            State.set('user', userObjectResponse);
            State.set('learner', undefined);
          });
        });
      }

      //if server level auth
      if (options.authMode === 'server') {

        //flush events before changing user
        return EventManager.flushEventQueue().then(() => {
          
          //set the state
          State.set('user', userObject);
          State.set('learner', undefined);
        });
      }
    });
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

      //validate providerLearnerId
      if (providerLearnerId == null) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'providerLearnerId is required');
      }
      if (!Utils.isString(providerLearnerId)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'providerLearnerId must be a string');
      }
     
      //if client level auth
      if (options.authMode === 'client') {

        //send providerLearnerID and providerUserId learner session endpoint to create user and learner
        return HttpClient.request(
          'POST', 
          Constants.ENDPOINT.CLIENT_SESSION, 
          {providerLearnerId, providerUserId: user && user.providerId}, 
          {noCache: true}
        ).then((userObjectResponse) => {
          //set the state
          State.set('user', userObjectResponse);
          State.set('learner', Utils.findItem(this.getLearnerList(), learner => (learner.providerId === providerLearnerId)));
        });
      }

      //if server level auth
      if (options.authMode === 'server') {

        //setUser must be called before selecting an active learner
        if (!user) {  
          throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'KidaptiveSdk.leanerManager.setUser must be called before setting an active learner when using server authentication');
        }

        //validate that the providerLearnerId exists for that user
        let activeLearner = Utils.findItem(this.getLearnerList(), learner => (learner.providerId === providerLearnerId));
        if (!activeLearner) {
          throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'A learner with that providerLearnerId does not exist');
        }

        //set the state
        State.set('learner', activeLearner);
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

      //set the state
      State.set('learner', undefined);
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
      EventManager.flushEventQueue();
    }).then(() => {

      //log the user out if authMode server
      return OperationManager.addToQueue(() => {
        const options = State.get('options') || {};

        if (options.authMode === 'server' && State.get('user')) {
          //wrap logout call to prevent error from breaking logout chain
          OperationManager.addToQueue(() => {
            return HttpClient.request('POST', Constants.ENDPOINT.LOGOUT, undefined, {noCache: true});
          });
        }
      });
    }).then(() => {

      //resolve destroy promise once state is reset
      return OperationManager.addToQueue(() => {
        State.set('learner', undefined);
        State.set('user', undefined);
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

    //get the state
    return State.get('learner') || undefined;
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

}

export default new KidaptiveSdkLearnerManager();
