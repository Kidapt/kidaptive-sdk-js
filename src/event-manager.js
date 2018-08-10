import AttemptProcessor from './attempt-processor';
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
   *   The event name to use when reporting the event
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

      //create event object
      const event = {
        additionalFields: Utils.copyObject(eventFields),
        name: eventName
      };

      //add event to queue
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

      //create event object
      const event = {
        additionalFields: {'raw_event_payload': rawEvent},
        name: 'raw_custom_event'
      };

      //add event to queue
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
        const eventBatches = []
        eventQueue.forEach(event => {
          eventBatches.push(event);
          requests.push(
            HttpClient.request('POST', Constants.ENDPOINT.INGESTION, event, {noCache:true})
          );
        });
        eventQueue = [];
        KidaptiveSdkEventManager.setEventQueue(eventQueue);
        return Q.allSettled(requests).then(results => {
          //reset event queue in case new events have been pushed while event flush occurred
          let requeue = [];

          //loop through results and requeue ones that failed
          for (let i = 0; i < results.length; i++) {
            const rejected = results[i].state === 'rejected';
            const error = results[i].reason || {};;

            //requeue events when API unavailable
            if (rejected && error.type === Error.ERROR_CODES.GENERIC_ERROR) {
              requeue.push(eventBatches[i]);
            }

            //append requeue onto event queue
            if (requeue.length) {
              const newEventQueue = KidaptiveSdkEventManager.getEventQueue().concat(requeue);
              KidaptiveSdkEventManager.setEventQueue(newEventQueue);
            }
          }

          //return flush event queue results
          return results;
        });
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
   * Set the event transformer to be called with the event whenever and event is queued.
   * The main purpose of this function is to add attempt data onto events to be processed by the local IRT.
   * 
   * @param {function} eventTransformer
   *   The function to transform the event. The return value will be the event to be sent to the server.
   *   If the function returns a falsey value, no event will be sent to the server.
   */
  setEventTransformer(eventTransformer) {
    Utils.checkTier(3);

    //validate eventTransformer
    if (!Utils.isFunction(eventTransformer)) {
      throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'eventTransformer must be a function');
    }

    State.set('eventTransformer', eventTransformer, false);
  }

  /**
   * Internal method to add properties to an event and add it to the event queue
   * 
   * @param {object} event
   *   The event object to add to the event queue
   */
  static addToEventQueue(event) {
    const options = State.get('options') || {};
    const user = State.get('user');
    if (options.authMode === 'server' && !user) {
      throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'KidaptiveSdk.leanerManager.setUser must be called before sending events when using server authentication');
    }

    //copy event object
    let updatedEvent = Utils.copyObject(event);

    //update event object with added properties
    updatedEvent.eventTime = Date.now();
    updatedEvent.learnerId = State.get('learnerId');
    updatedEvent.trialTime = State.get('trialTime');
    updatedEvent.userId = user && user.id;

    //get app and device info
    const appInfo = {
      version: options.version,
      build: options.build
    };
    const deviceInfo = {
      deviceType: window && window.navigator && window.navigator.userAgent,
      language: window && window.navigator && window.navigator.language
    };

    //see if there is a batch of events this event can be added to based on app info and device info
    let eventQueue = KidaptiveSdkEventManager.getEventQueue();
    const itemIndex = Utils.findItemIndex(eventQueue, item =>
      item.appInfo.version === appInfo.version &&
      item.appInfo.build === appInfo.build &&
      item.deviceInfo.deviceType === deviceInfo.deviceType &&
      item.deviceInfo.language === deviceInfo.language
    );

    //transform event and process attempts
    if (options.tier >= 3) {
      
      //transform event if an event transformer is present
      const eventTransformer = State.get('eventTransformer', false);
      if (eventTransformer) {
        updatedEvent = Utils.copyObject(eventTransformer(updatedEvent));

        //if the event is not an object, do not queue any event
        if (!Utils.isObject(updatedEvent)) {
          return
        }

        //validate the updated event and display event warnings
        KidaptiveSdkEventManager.validateTransformedEvent(updatedEvent);

        //loop through events to add missing prior values
        if (Utils.isArray(updatedEvent.attempts)) {
          updatedEvent.attempts = updatedEvent.attempts.map(attempt => {
            //prepare attempt by validating attempt object and populating default values
            //if something is wrong with the attempt object or learner state, this will return undefined
            const updatedAttempt = AttemptProcessor.prepareAttempt(attempt);

            //process event attempts if skipIrt is falsey and if nothing went wrong with prepareAttempt
            if (updatedAttempt && (!updatedEvent.tags || !updatedEvent.tags.skipIrt)) {
              AttemptProcessor.processAttempt(updatedAttempt);
            }

            //return new updated attempt if available, or fall back on the old attempt if needed
            return updatedAttempt || attempt;
          });
        }
      }
    }

    //push the event onto the existing batch
    if (itemIndex !== -1) {
      eventQueue[itemIndex].events.push(updatedEvent);

    //create a new event group based on app info and device info
    } else {
      eventQueue.push({
        appInfo,
        deviceInfo,
        events: [updatedEvent]
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
    return HttpClient.getCacheKey(HttpClient.getRequestSettings('POST', Constants.ENDPOINT.INGESTION));
  };

  /**
   * If logging is enabled, validate a transformed event and log any issues to console
   * 
   * @param {string} event
   *   The transformed event to validate
   */
  static validateTransformedEvent(event) {
    //if logging enabled, validate the event object that is returned from the event transformer and provide warning logging
    if (Utils.checkLoggingLevel('warn') && console && console.log) {
      //validate root level properties
      if (!Utils.isString(event.name) || !event.name.length) {
        console.log('Warning: eventTransformer returned an event with name not set as a string.');   
      }
      if (!Utils.isObject(event.additionalFields) || event.additionalFields === null) {
        console.log('Warning: eventTransformer returned an event with additionalFields not set as an object.');   
      }
      if (event.userId != null && !Utils.isNumber(event.userId)) {
        console.log('Warning: eventTransformer returned an event with userId not set as a number.');   
      }
      if (event.learnerId != null && !Utils.isNumber(event.learnerId)) {
        console.log('Warning: eventTransformer returned an event with learnerId not set as a number.');   
      }
      if (!Utils.isNumber(event.eventTime)) {
        console.log('Warning: eventTransformer returned an event with eventTime not set as a number.');   
      }
      if (!Utils.isNumber(event.trialTime)) {
        console.log('Warning: eventTransformer returned an event with trialTime not set as a number.');   
      }

      //validate attempts
      if (event.attempts != null) {
        if (!Utils.isArray(event.attempts)) {
          console.log('Warning: eventTransformer returned an event with attempts not set as an array.');
        } else {
          event.attempts.forEach(attempt => {
            if (!Utils.isObject(attempt)) {
              console.log('Warning: eventTransformer returned an event with an attempt not set as an object.');
            } else {
              if (!Utils.isString(attempt.itemURI) || !attempt.itemURI.length) {
                console.log('Warning: eventTransformer returned an event attempt with itemURI not set as a string.');   
              }
              if (!Utils.isNumber(attempt.outcome)) {
                console.log('Warning: eventTransformer returned an event attempt with outcome not set as a numeric value.');   
              } else if (attempt.outcome !== 0 && attempt.outcome !== 1) {
                console.log('Warning: eventTransformer returned an event attempt with outcome not set as 0 or 1.');   
              }
              if (attempt.guessingParameter != null && !Utils.isNumber(attempt.guessingParameter)) {
                console.log('Warning: eventTransformer returned an event attempt with guessingParameter not set as a numeric value.');   
              } else if (attempt.guessingParameter != null && (attempt.guessingParameter < 0 || attempt.guessingParameter > 1)) {
                console.log('Warning: eventTransformer returned an event attempt with a guessingParameter not set as a value between (inclusive) 0 and 1.');   
              }
              if (attempt.priorLatentMean != null && !Utils.isNumber(attempt.priorLatentMean)) {
                console.log('Warning: eventTransformer returned an event attempt with priorLatentMean not as as a numeric value.');   
              }
              if (attempt.priorLocalMean != null && !Utils.isNumber(attempt.priorLocalMean)) {
                console.log('Warning: eventTransformer returned an event attempt with priorLocalMean not as as a numeric value.');   
              }
              if (attempt.priorLatentStandardDeviation != null && !Utils.isNumber(attempt.priorLatentStandardDeviation)) {
                console.log('Warning: eventTransformer returned an event attempt with priorLatentStandardDeviation not as as a numeric value.');   
              }
              if (attempt.priorLocalStandardDeviation != null && !Utils.isNumber(attempt.priorLocalStandardDeviation)) {
                console.log('Warning: eventTransformer returned an event attempt with priorLocalStandardDeviation not as as a numeric value.');   
              }
            }
          });
        }
      }

      //validate tags
      if (event.tags != null) {
        if (!Utils.isObject(event.tags)) {
          console.log('Warning: eventTransformer returned an event with tags not set as an object.');
        } else {
          if (event.tags.skipIrt != null && !Utils.isBoolean(event.tags.skipIrt)) {
            console.log('Warning: eventTransformer returned an event tag with skipIrt not set as a boolean.');   
          }
        }
      }
    } 
  }
}

export default new KidaptiveSdkEventManager();
