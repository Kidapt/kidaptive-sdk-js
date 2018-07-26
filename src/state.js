import Utils from './utils';

let _state;

class KidaptiveSdkState {
  constructor () {
    _state = {}
  }

  /**
   * Gets a property value from the state object
   * 
   * @param string property
   *   The target property to get
   * 
   * @return
   *   The value of the property
   *
   * @param bool copy
   *   If set to false the function will bypass the copying functionality
   *   This should only be used in special cases, and the value should be copied before modifying the value or passing to the parent app
   */
  get(property, copy = true) {
    //do not copy value if copy variable set to false
    return copy ? Utils.copyObject(_state[property]) : _state[property];
  }

  /**
   * Sets a property value in the state object
   * 
   * @param string property
   *   The target property to set
   *
   * @param {*} value
   *   The value to set for the target property
   *
   * @param bool copy
   *   If set to false the function will bypass the copying functionality
   *   This should only be used in special cases, and the value should be copied before modifying the value or passing to the parent app
   */
  set(property, value, copy = true) {
    //do not copy value if copy variable set to false
    _state[property] = copy ? Utils.copyObject(value) : value;
  }

  /**
   * Clears the state object
   */
  clear() {
    _state = {};
  }
}

export default new KidaptiveSdkState();
