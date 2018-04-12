import Utils from './utils';
import Q from 'q';

class KidaptiveSdkOperationManager {
  constructor() {
    this.operationQueue = Q(true);
  }

  /**
   * Adds an item to the queue for sequential operations
   * 
   * @param {function} action
   *   The action to push onto the operation queue
   */
  addToQueue(action) { 
    //queue action onto operation promise chain
    const actionPromise = this.operationQueue.then(action);
    //catch errors so operation promise chain can recover from errors
    this.operationQueue = actionPromise.then(() => {}, error => {
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
