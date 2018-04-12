//SETUP LOGGING
var log = function(message) {
  if (console && console.log) {
    console.log(message);
  }
}
var error = function(message) {
  if (console && console.log) {
    console.error(message);
  }
}

//SETUP ARGUMENTS
var apiKey = 'gsdkTestV3';
var options = {
  environment: 'dev',
  tier: 1,
  appUri: '/kidaptive/demo',
  version: '1.0.0',
  build: '1',
  autoFlushInterval: 30000,
  autoFlushCallback: function(results) {
    log('--- Auto flush event queue complete')
    log(results);
  },
  loggingLevel: 'all'
};

//INITIALIZE SDK
log('SDK Version: ' + KidaptiveSdk.getSdkVersion());
log('--- KidaptiveSDK initialization started');
KidaptiveSdk.init(apiKey, options).then(function() {
  log('SUCCESS: Initialization complete');
}, function() {
  error('ERROR: Initialization error!');
});

//SETUP EVENTS REPORTERS
document.getElementById('reportSimpleEvent').addEventListener("click", function() {
  var eventName = 'Click Event';
  var event = {
    time: (new Date()).getTime()
  }
  log('--- Report simple event: ' + eventName);
  log(event);
  KidaptiveSdk.eventManager.reportSimpleEvent(eventName, event).then(function() {
    log('SUCCESS: Report simple event queued');
  }, function() {
    error('ERROR: Report simple event error!');
  });
});

document.getElementById('reportRawEvent').addEventListener("click", function() {
  var rawEvent = 'ClickEvent?time=' + (new Date()).getTime();
  log('--- Report raw event');
  log(rawEvent);
  KidaptiveSdk.eventManager.reportRawEvent(rawEvent).then(function() {
    log('SUCCESS: Report raw event queued');
  }, function() {
    error('ERROR: Report raw event error!');
  });
});

document.getElementById('flushEventQueue').addEventListener("click", function() {
  log('--- Manually flush event queue');
  KidaptiveSdk.eventManager.flushEventQueue().then(function(results) {
    log('SUCCESS: Flush event queue complete');
    log(results);
  }, function() {
    error('ERROR: Flush event queue error!');
  });
});
