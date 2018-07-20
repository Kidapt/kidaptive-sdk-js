import Constants from './constants';
import Error from './error';
import HttpClient from './http-client';
import OperationManager from './operation-manager';
import State from './state';
import Utils from './utils';
import Q from 'q';

let _autoFlushTimeout = null;
let _eventQueue = [];

class KidaptiveSdkEventManager {
  /**
   * Reports an event to the Kidaptive SDK
   * 
   * @param {string} eventName
   *   THe event name to use when reporting the event
   *
   * @param {object} eventFields
   *   The data to send with the event in key:value pair format
   */
  reportSimpleEvent(eventName, eventFields) {
    return OperationManager.addToQueue(() => {
      Utils.checkTier(1);

      //validate event name
      if (eventName == null) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'EventName is required');
      }
      if (!Utils.isString(eventName)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'EventName must be a string');
      }

      //validate eventFields type
      eventFields = eventFields == null ? {} : eventFields;
      if (!Utils.isObject(eventFields)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'EventFields must be an object');
      }

      //validate and parse eventFields values
      eventFields = Utils.copyObject(eventFields);
      Object.keys(eventFields).forEach(key => {
        const value = eventFields[key];
        if (value !== null && !Utils.isBoolean(value) && !Utils.isNumber(value) && !Utils.isString(value)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'EventField values must be a boolean, null, number, or string');
        }
        //convert all accepted values to string
        const newValue = value === null ? null : value.toString();
        //throw warning for stringifying numbers
        if (Utils.isNumber(value) && newValue.indexOf('e') !== -1) {
          if (Utils.checkLoggingLevel('warn') && console && console.log) {
            console.log('Warning: Numeric value with large number of significant digits was converted to scientific notation.');
          }
        }
        //save new value
        eventFields[key] = newValue;
      });

      const user = State.get('user');
      const learner = State.get('learner');
      const event = {
        name: eventName,
        userId: user && user.id,
        learnerId: learner && learner.id,
        additionalFields: Utils.copyObject(eventFields)
      };

      KidaptiveSdkEventManager.addToEventQueue(event);
    });
  }

  /**
   * Reports a raw event to the Kidaptive SDK
   * 
   * @param {string} rawEvent
   *   THe raw event in string format
   */
  reportRawEvent(rawEvent) {
    return OperationManager.addToQueue(() => {
      Utils.checkTier(1);

      //copy user provided parameters
      rawEvent = Utils.copyObject(rawEvent);

      //validate raw event
      if (rawEvent == null) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'RawEvent is required');
      }
      if (!Utils.isString(rawEvent)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'RawEvent must be a string');
      }

      const user = State.get('user');
      const learner = State.get('learner');
      const event = {
        name: 'raw_custom_event',
        userId: user && user.id,
        learnerId: learner && learner.id,
        additionalFields: {'raw_event_payload': rawEvent}
      };

      KidaptiveSdkEventManager.addToEventQueue(event);
    });
  }

  /**
   * Flush the event queue and send all events to the Kidaptive API
   * 
   * @return
   *   A promise that resolves when the event queue is flushed
   */
  flushEventQueue() {
    return OperationManager.addToQueue(() => {
      Utils.checkTier(1);
      
      let eventQueue = KidaptiveSdkEventManager.getEventQueue();
      if (eventQueue.length) {
        const requests = [];
        eventQueue.forEach(event => {
          requests.push(
            HttpClient.request('POST', Constants.ENDPOINT.INGESTION, event, {noCache:true})
          );
        });
        eventQueue = [];
        KidaptiveSdkEventManager.setEventQueue(eventQueue);
        return Q.allSettled(requests);
      } else {
        return Q.fcall(() => []);
      }
    });
  }

  /**
   * Turn on auto-flushing of the event queue
   */
  startAutoFlush() {
    return OperationManager.addToQueue(() => {
      Utils.checkTier(1);

      clearTimeout(_autoFlushTimeout);
      const options = State.get('options') || {};
      if (options.autoFlushInterval) {
        _autoFlushTimeout = setTimeout(() => {
          this.flushEventQueue().then(results => {
            const options = State.get('options') || {}
            if (options.autoFlushCallback) {
              options.autoFlushCallback.forEach(function(callback) {
                callback(results);
              });
            }
            this.startAutoFlush();
          });
        }, options.autoFlushInterval);
      } else {
        if (Utils.checkLoggingLevel('warn') && console && console.log) {
          console.log('Warning: ALP SDK autoFlushInterval is configured to 0. Auto flush is disabled.');
        }
      }
    });
  }

  /**
   * Turn off auto-flushing of the event queue
   */
  stopAutoFlush() {
    return OperationManager.addToQueue(() => {
      Utils.checkTier(1);

      clearTimeout(_autoFlushTimeout);
      _autoFlushTimeout = null;
    });
  }

  /**
   * Internal method to add an event to the event queue
   * 
   * @param {object} event
   *   THe event object to add to the event queue
   */
  static addToEventQueue(event) {
    const options = State.get('options') || {};
    if (options.authMode === 'server' && !State.get('user')) {
      throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'KidaptiveSdk.leanerManager.setUser must be called before sending events when using server authentication');
    }
    
    const appInfo = {
      uri: options.appUri,
      version: options.version,
      build: options.build
    };
    const deviceInfo = {
      deviceType: window && window.navigator && window.navigator.userAgent,
      language: window && window.navigator && window.navigator.language
    };

    let eventQueue = KidaptiveSdkEventManager.getEventQueue();
    const itemIndex = Utils.findItemIndex(eventQueue, item =>
      item.appInfo.uri === appInfo.uri &&
      item.appInfo.version === appInfo.version &&
      item.appInfo.build === appInfo.build &&
      item.deviceInfo.deviceType === deviceInfo.deviceType &&
      item.deviceInfo.language === deviceInfo.language
    );

    if (itemIndex !== -1) {
      eventQueue[itemIndex].events.push(event);
    } else {
      eventQueue.push({
        appInfo,
        deviceInfo,
        events: [event]
      });
    }
    KidaptiveSdkEventManager.setEventQueue(eventQueue);
  }

  /**
   * Gets the event queue from local storage if possible, otherwise uses a local variable
   * 
   * @return
   *   The current event queue that is stored
   */
  static getEventQueue() {
    let result;
    try {
      result = Utils.localStorageGetItem(KidaptiveSdkEventManager.getEventQueueCacheKey());
    } catch (e) {
      result = Utils.copyObject(_eventQueue);
    }
    if (!(result instanceof Array)) {
      result = [];
    }
    return result;
  }

  /**
   * Sets the event queue in local storage if possible, and in a local variable
   * 
   * @param {array} eventQueue
   *   THe event queue to be stored
   */
  static setEventQueue(eventQueue) {
    eventQueue = Utils.copyObject(eventQueue);
    _eventQueue = eventQueue;
    Utils.localStorageSetItem(KidaptiveSdkEventManager.getEventQueueCacheKey(), eventQueue);
  }

  /**
   * Gets the cache key for storing and retrieving events from local storage
   * 
   * @return
   *   The cache key string to be used with local storage
   */
  static getEventQueueCacheKey() {
    const settings = HttpClient.getRequestSettings('POST', Constants.ENDPOINT.INGESTION);
    return HttpClient.getCacheKey(settings).replace(/[.].*/,'.alpEventData');
  };
}

export default new KidaptiveSdkEventManager();
