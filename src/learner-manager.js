import State from './state';
import Utils from './utils';

class KidaptiveSdkLearnerManager {

  /**
   * Set the user object that contains the user metadata
   * 
   * @param {object} userObject
   *   The metadata object containing apiKey, user, and learners
   * 
   * @return
   *   A promise that resolves when the user has been set
   */
  setUser(userObject) {
    Utils.checkInitialized();

    //TODO VALIDATE PROVIDER USER ID

    const options = State.get('options') || {};
    if (options.authMode === 's2s') {
      //TODO VALIDATE ENTIRE USER OBJECT (apiKey, user, learners[learner])
    }

    //TODO CLEAR PREVIOUS LEARNER DATA
    //TODO STORE USER INFO
  }

  /**
   * Sets the active learner by the Provider Learner ID.
   * For client based auth, this will send a request to the server to set the learner.
   * For S2S based auth, this requires that setUser is called first.
   * For S2S based auth, this will validate against the learners provided in setUser.
   * 
   * @param {string} providerLearnerId
   *   The provider learnr ID to set as the active learner
   * 
   * @return
   *   A promise that resolves when the learner has been activated
   */
  setActiveLearner(providerLearnerId) {
    Utils.checkInitialized();
   
    const options = State.get('options') || {};
    if (options.authMode === 'client') {
      //TODO SEND API CALL
      //TODO STORE PROVIDER LEARNER ID
    }

    if (options.authMode === 's2s') {
      //TODO REQUIRE SET USER CALLED FIRST
      //TODO VALIDATE AGAINST LEARNERS FROM SET USER
      //TODO STORE PROVIDER LEARNER ID
    }

  }

  /**
   * Clears the active learner and all stored learner information.
   * 
   * @return
   *   A promise that resolves when the learner has been cleared
   */
  clearActiveLearner() {
    Utils.checkInitialized();
    
    //TODO CLEAR PROVIDER LEARNER ID
  }

  /**
   * Clears the user and learner information and logs the user out.
   * For S2S based auth, this will send a logout request to the server.
   * 
   * @return
   *   A promise that resolves when the user has been logged out
   */
  logout() {
    Utils.checkInitialized();

    //TODO CLEAR LEARNER DATA
    //TODO CLEAR USER DATA

    const options = State.get('options') || {};
    if (options.authMode === 's2s') {
      //TODO SEND API LOGOUT
    }

  }

  /**
   * Gets the current user.
   * For S2S based auth only.
   * Gets the user object from the object provided to the the setUser method.
   * 
   * @return
   *   The user object. If no user is defined, then undefined is returned.
   */
  getUser() {
    Utils.checkAuthMode('s2s');
    
    //TODO GET USER OBJECT, OR UNDEFINED
  }

  /**
   * Gets the active learner
   * For S2S based auth only.
   * Gets the active learner object from the object provided to the the setUser method.
   * 
   * @return
   *   The learner object. If no active learner is defined, then undefined is returned.
   */
  getActiveLearner() {
    Utils.checkAuthMode('s2s');
    
    //TODO GET ACTIVE LEARNER OBJECT, OR UNDEFINED
  }

  /**
   * Gets the learner list
   * For S2S based auth only.
   * Gets the learner list array from the object provided to the the setUser method.
   * 
   * @return
   *   The learner array. If no learner list is defined, an empty array is returned.
   */
  getLearnerList() {
    Utils.checkAuthMode('s2s');
    
    //TODO GET ACTIVE LEARNER LIST ARRAY, OR UNDEFINED
  }

}

export default new KidaptiveSdkLearnerManager();
