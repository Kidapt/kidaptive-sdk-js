import Utils from './utils';
import Q from 'q';

class KidaptiveSdkOperationManager {
  constructor() {
    this.executing = false;
    this.operationQueue = Q(true);
  }

  /**
   * Adds an item to the queue for sequential operations
   * 
   * @param {function} action
   *   The action to push onto the operation queue
   */
  addToQueue(action) { 
    //if addToQueue is called while another addToQueue is executing, return resolved promise
    if (this.executing) {
      return Q.fcall(action);
    }
    //queue action onto operation promise chain
    const actionPromise = this.operationQueue.then(() => {
      //set flag for executing
      this.executing = true;
      //call action
      return Q.fcall(action);
    });
    //catch errors so operation promise chain can recover from errors
    this.operationQueue = actionPromise.then(() => {
      //reset execution flag
      this.executing = false;
    }, error => {
      //reset execution flag
      this.executing = false;
      //throw caught errors
      if (Utils.checkLoggingLevel('all') && console && console.error) {
        console.error(error);
      }
    });
    //return action promise chain
    return actionPromise;
  }
}

export default new KidaptiveSdkOperationManager();
