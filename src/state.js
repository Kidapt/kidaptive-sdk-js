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
   */
  get(property) {
    return Utils.copyObject(_state[property]);
  }

  /**
   * Sets a property value in the state object
   * 
   * @param string property
   *   The target property to set
   *
   * @param {*} value
   *   The value to set for the target property
   */
  set(property, value) {
    _state[property] = Utils.copyObject(value);
  }

  /**
   * Clears the state object
   */
  clear() {
    _state = {};
  }
}

export default new KidaptiveSdkState();
