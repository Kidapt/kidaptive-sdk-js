# kidaptive-sdk-js

 The Kidaptive ALP JavaScript Client SDK supports the integration of Kidaptive's Adaptive Learning Platform (ALP) into a javascript application. The following documentation provides introductory material, example code, and references to support the integration process.

* [Supported Browsers](#supported-browsers)
* [Installation](#installation)
  * [Loading Dependencies](#loading-dependencies)
* [API Reference](#api-reference)
  * [Core Interface](#core-interface)
    * [KidaptiveSdk.init()](#kidaptivesdkinitapikeystring-optionsobject)
    * [KidaptiveSdk.getSdkVersion()](#kidaptivesdkgetsdkversion)
    * [KidaptiveSdk.destroy()](#kidaptivesdkdestroy)
  * [Tier 1 Interface](#tier-1-interface)
    * [KidaptiveSdk.learnerManager.setUser()](#kidaptivesdklearnermanagersetuseruserobjectobject)
    * [KidaptiveSdk.learnerManager.selectActiveLearner()](#kidaptivesdklearnermanagerselectactivelearnerproviderlearneridstring)
    * [KidaptiveSdk.learnerManager.startTrial()](#kidaptivesdklearnermanagerstarttrial)
    * [KidaptiveSdk.learnerManager.clearActiveLearner()](#kidaptivesdklearnermanagerclearactivelearner)
    * [KidaptiveSdk.learnerManager.logout()](#kidaptivesdklearnermanagerlogout)
    * [KidaptiveSdk.learnerManager.getUser()](#kidaptivesdklearnermanagergetuser)
    * [KidaptiveSdk.learnerManager.getActiveLearner()](#kidaptivesdklearnermanagergetactivelearner)
    * [KidaptiveSdk.learnerManager.getLearnerList()](#kidaptivesdklearnermanagergetlearnerlist)
    * [KidaptiveSdk.learnerManager.getMetricByUri()](#kidaptivesdklearnermanagergetmetricbyurimetricuristring-mintimestampnumber-maxtimestampnumber)
    * [KidaptiveSdk.learnerManager.getInsightByUri()](#kidaptivesdklearnermanagergetinsightbyuriinsighturistring-contextkeysarray)
    * [KidaptiveSdk.learnerManager.getInsights()](#kidaptivesdklearnermanagergetinsightsmintimestampnumber-contextmapobject)
    * [KidaptiveSdk.eventManager.reportSimpleEvent()](#kidaptivesdkeventmanagerreportsimpleeventeventnamestring-eventfieldsobject)
    * [KidaptiveSdk.eventManager.reportRawEvent()](#kidaptivesdkeventmanagerreportraweventraweventstring)
    * [KidaptiveSdk.eventManager.flushEventQueue()](#kidaptivesdkeventmanagerflusheventqueue)
  * [Tier 2 Interface](#tier-2-interface)
    * [KidaptiveSdk.learnerManager.getLocalAbilityEstimates()](#kidaptivesdklearnermanagergetlocalabilityestimates)
    * [KidaptiveSdk.learnerManager.getLocalAbilityEstimate()](#kidaptivesdklearnermanagergetlocalabilityestimatelocaldimensionuristring)
    * [KidaptiveSdk.learnerManager.getLatentAbilityEstimates()](#kidaptivesdklearnermanagergetlatentabilityestimates)
    * [KidaptiveSdk.learnerManager.getLatentAbilityEstimate()](#kidaptivesdklearnermanagergetlatentabilityestimatedimensionuristring)
    * [KidaptiveSdk.learnerManager.updateAbilityEstimates()](#kidaptivesdklearnermanagerupdateabilityestimates)
    * [KidaptiveSdk.modelManager.getGames()](#kidaptivesdkmodelmanagergetgames)
    * [KidaptiveSdk.modelManager.getGameByUri()](#kidaptivesdkmodelmanagergetgamebyurigameuristring)
    * [KidaptiveSdk.modelManager.getDimensions()](#kidaptivesdkmodelmanagergetdimensions)
    * [KidaptiveSdk.modelManager.getDimensionByUri()](#kidaptivesdkmodelmanagergetdimensionbyuridimensionuristring)
    * [KidaptiveSdk.modelManager.getLocalDimensions()](#kidaptivesdkmodelmanagergetlocaldimensions)
    * [KidaptiveSdk.modelManager.getLocalDimensionByUri()](#kidaptivesdkmodelmanagergetlocaldimensionbyurilocaldimensionuristring)
    * [KidaptiveSdk.modelManager.updateModels()](#kidaptivesdkmodelmanagerupdatemodels)
  * [Tier 3 Interface](#tier-3-interface)
    * [KidaptiveSdk.eventManager.setEventTransformer()](#kidaptivesdkeventmanagerseteventtransformereventtransformerstring)
    * [KidaptiveSdk.modelManager.getItems()](#kidaptivesdkmodelmanagergetitems)
    * [KidaptiveSdk.modelManager.getItemByUri()](#kidaptivesdkmodelmanagergetitembyuriitemuristring)
* [Build Process](#build-process)
* [Testing](#testing)
* [Publishing](#publishing)

## Supported Browsers

Browser | Versions
--- | ---
Internet Explorer (IE) | 9, 10, 11, Edge
Chrome | Latest
Firefox | Latest
Safari | Latest
Opera | Latest

## Installation

```
npm install kidaptive-sdk-js
```

or

```
bower install kidaptive-sdk-js
```

### Loading Dependencies

Use one of the following methods depending on your environment:

1. Add the following to your HTML file:
```html
<script src="bower_components/kidaptive-sdk-js/dist/kidaptive-sdk.min.js"></script>
```

2. ES6
```javascript
import KidaptiveSdk from 'kidaptive-sdk-js';
```

3. AMD
```javascript
define(['kidaptive-sdk-js'], function (KidaptiveSdk) { });
```

4. CJS
```javascript
var KidaptiveSdk = require('kidaptive-sdk-js');
```

## API Reference

### Core Interface

#### KidaptiveSdk.init(apiKey:string, options:object)

Initializes the SDK. The return value is a [Promise] which resolves when the Kidaptive SDK is ready. The SDK is a singleton and only one SDK may be initialized at a time. The SDK must be initialized before any other methods can be called.

When the SDK is configured to at least tier 2, all relevent models for the API key provided will automatically be retrieved from the server, equivalent to calling [KidaptiveSdk.modelManager.updateModels()](#kidaptivesdkmodelmanagerupdatemodels).

```javascript
KidaptiveSdk.init("gPt1fU+pTaNgFv61Qbp3GUiaHsGcu+0h8", {environment: 'dev'}).then(function() {
    //SDK READY
}, function(error) {
    //ERROR
    console.log(error);
});
```

##### ALP Initialization Parameters

Parameter | Type | Required | Description
--- | --- | --- | ---
apiKey | string | true | The apiKey required by the Kidaptive API to recognize the app.
options | object | true | An object containing `ALP Initialization Options` to be sent to Kidaptive SDK during initialization.

##### ALP Initialization Options

These properties go into the `options object` that is passed as a parameter to the init function.

Option | Type | Required | Default | Description
--- | --- | --- | --- | ---
environment | string | true |  | Values can be `dev`, `prod`, or `custom`
tier | number | false | 1 | Sets up the SDK to have the desired level of functionality. Values can be `1`, `2`, or `3`
authMode | string | false | client | Defines the authentication mode to be used. Values can be `client` or `server`
baseUrl | string | false |  | This property is only used and required when environment is set to `custom`. This allows for sending events to a different host when using a proxy.
version | string | false |  | The version reported to the Kidaptive API with events.
build | string | false |  | The build reported to the Kidaptive API with events.
autoFlushInterval | number | false | 60000 | The interval in milliseconds that the events should be flushed. A value of 0 will result in the auto flush being disabled.
autoFlushCallback | function or array | false |  | A callback function or an array of callback functions to be called with results of auto event flush.
loggingLevel | string | false | all | Defines the logging level to use. Values can be `all`, `warn`, or `minimal`. `all` will log all internal errors to console, including those that could potentially be handled in a promise error handler.
defaultHttpCache | object | false | | Offline support configuration. Configuring this option will require support from Kidaptive.

---

#### KidaptiveSdk.getSdkVersion()

This returns the SDK version being used. This is the only method that can be called prior to SDK initialization.

```
var sdkVersion = KidaptiveSdk.getSdkVersion();
console.log(sdkVersion);
```

---

#### KidaptiveSdk.destroy()

Notifies the SDK to uninitialize. The return value is a [Promise] which resolves when the SDK is uninitialized. The shutdown process includes stopping the auto flush, flushing all events, logging the user out, clearing all state, and finally uninitializing itself.

```javascript
KidaptiveSdk.destroy().then(function() {
    //SDK DESTROYED
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

### Tier 1 Interface

#### KidaptiveSdk.learnerManager.setUser(userObject:object)

This method sets the current user. This method is required to be called before selecting a learner or sending events when `authMode` is configured to `server`. Calling this method while a learner is already selected will result in that learner being cleared, and all events for that user and learner being flushed.

If `authMode` is configured to `server`, the userObject is generated by the ALP API through backend communications between the app server and the ALP server. The `userObject` is then passed down to the Kidaptive SDK through the `setUser` method. It is up to you to figure out the best process for passing that information to the client. No modifications should be made to this `userObject`. This `userObject` includes properties such as ALP IDs, client provider IDs, learners, and user API keys to be used when sending events.

An active user is cached in local storage. If the local storage is retained, the user will be available and logged in when the SDK is re-initialized, even after a complete restart of the browser.

```javascript
var userObject = {}; //THIS WILL BE PASSED FROM BACKEND API CALL
KidaptiveSdk.learnerManager.setUser(userObject).then(function() {
    //USER SELECTED
}, function(error) {
    //ERROR
    console.log(error);
});
```

If the `authMode` is `client`, then this method is used to specify a `providerUserId` to be sent along with events. This will create the user on our system for that given `providerUserId` if necessary. Events can be sent for that user, or if desired, a learner can be selected or created through the [KidaptiveSdk.learnerManager.selectActiveLearner()](#kidaptivesdklearnermanagerselectactivelearnerproviderlearneridstring) method. 

```javascript
var userObject = {providerUserId:"user123"};
KidaptiveSdk.learnerManager.setUser(userObject).then(function() {
    //USER SELECTED
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

#### KidaptiveSdk.learnerManager.selectActiveLearner(providerLearnerId:string)

This method selects the active learner. If a learner is already selected, and you call this method again, the new learner will be selected for that given user.

If `authMode` is configured to `server`, then the learner must be a learner specified in the learner array which is passed in the `userObject` in the [KidaptiveSdk.learnerManager.setUser()](#kidaptivesdklearnermanagersetuseruserobjectobject) call. 

If the `authMode` is `client`, then the learner will be selected or created if it does not already exist. 

When `authMode` is set to `client` and you call [KidaptiveSdk.learnerManager.setUser()](#kidaptivesdklearnermanagersetuseruserobjectobject) prior to calling `selectActiveLearner`, the learner will be selected or created for that given user. You can create multiple learners for a single user this way. If you call [KidaptiveSdk.learnerManager.clearActiveLearner()](#kidaptivesdklearnermanagerclearactivelearner) the user that you set will still be logged in. To fully log the learner and user out, you must call [KidaptiveSdk.learnerManager.logout()](#kidaptivesdklearnermanagerlogout).

When `authMode` is set to `client` and you do not call [KidaptiveSdk.learnerManager.setUser()](#kidaptivesdklearnermanagersetuseruserobjectobject) prior to calling `selectActiveLearner`, the learner will be selected or created under a user that is mapped specifically to that learner. If you call `selectActiveLearner` again, it will log the existing user and learner out, and the new learner will be selected or created under a user that is mapped specically to that learner. If you call [KidaptiveSdk.learnerManager.clearActiveLearner()](#kidaptivesdklearnermanagerclearactivelearner) the user tied to that learner will also be logged out.

For all SDK tiers, a trial is created when a learner is selected, equivalent to calling [KidaptiveSdk.learnerManager.startTrial()](#kidaptivesdklearnermanagerstarttrial).

When the SDK is configured to tier 2, the ability estimates for that learner will be retrieved from the server when a learner is selected, equivalent to calling [KidaptiveSdk.learnerManager.updateAbilityEstimates()](#kidaptivesdklearnermanagerupdateabilityestimates).

An active learner is cached in local storage. If the local storage is retained, the learner and user will be available and logged in when the SDK is re-initialized, even after a complete restart of the browser.

```javascript
var learnerProviderId = 'learner123';
KidaptiveSdk.learnerManager.selectActiveLearner(learnerProviderId).then(function() {
    //LEARNER SELECTED
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

#### KidaptiveSdk.learnerManager.startTrial()

Updates the trial time for the current selected learner. The return value is a [Promise] which resolves when the trial time has been updated. Trials are used to control the weight of prior information when calculating learner ability estimates. Starting a new trial indicates that the learner's current ability may have changed and that the estimate may not be accurate. This causes new evidence to be weighted more to adjust to the new ability.

When the SDK is configured to tier 3 or greater, any of the ability estimates for the learner that have standard deviations below 0.65 will be reset to the value 0.65 when calling startTrial. The timestamps for those ability estimates will also be updated to the new trial time.

This function is automatically called from [KidaptiveSdk.learnerManager.selectActiveLearner()](#kidaptivesdklearnermanagerselectactivelearnerproviderlearneridstring) for all SDK tiers.

```javascript
KidaptiveSdk.learnerManager.startTrial().then(function() {
    //TRIAL STARTED
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

#### KidaptiveSdk.learnerManager.clearActiveLearner()

This method clears the current learner so no learner is selected. 

When `authMode` is set to `server` the user will still be logged in after calling `clearActiveLearner`.

When `authMode` is set to `client` and you do not call [KidaptiveSdk.learnerManager.setUser()](#kidaptivesdklearnermanagersetuseruserobjectobject) prior to calling `clearActiveLearner` the user will be logged out.

When `authMode` is set to `client` and you do call [KidaptiveSdk.learnerManager.setUser()](#kidaptivesdklearnermanagersetuseruserobjectobject) prior to calling `clearActiveLearner` the user will still be logged in.

```javascript
KidaptiveSdk.learnerManager.clearActiveLearner().then(function() {
    //LEARNER CLEARED
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

#### KidaptiveSdk.learnerManager.logout()

This method logs the current user and learner out. Any queued events will be flushed prior to logout. In the case of `authMode` being configured to `server` an API call will also be sent to the ALP server to log the user out.

```javascript
KidaptiveSdk.learnerManager.logout().then(function() {
    //USER LOGGED OUT
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

#### KidaptiveSdk.learnerManager.getUser()

This method returns the current user object. If there is no user `undefined` will be returned. Some of the properties available on the user object include `id` (ALP user ID), `apiKey` (apiKey used for user session), `providerId` (client user ID), and `learners` (array of available learners).

```javascript
var user = KidaptiveSdk.learnerManager.getUser();
console.log(user);
```

---

#### KidaptiveSdk.learnerManager.getActiveLearner()

This method returns the current active learner object. If there is no active learner `undefined` will be returned. Some properties available on the learner object include `id` (ALP learner ID), and `providerId` (client learner ID). 

```javascript
var learner = KidaptiveSdk.learnerManager.getActiveLearner();
console.log(learner);
```


---

#### KidaptiveSdk.learnerManager.getLearnerList()

This method returns an array of learners tied to a given user. If no user or learners exist an empty array is returned.

```javascript
var learnerList = KidaptiveSdk.learnerManager.getLearnerList();
console.log(learnerList);
```

---

#### KidaptiveSdk.learnerManager.getMetricByUri(metricUri:string, minTimestamp:number, maxTimestamp:number)

This fetches the metric for the given `metricUri` for the current selected learner. The return value is a [Promise] which resolves when the metric is retrieved. A metric is a JSON object containing concrete statistics about the learner, such as engagement totals, or a history of actions they have taken.

There are optional second and third parameters `minTimestamp` and `maxTimestamp` which are numeric values in milliseconds since unix epoch. These parameters determine the time range that the metric should be queried from. The most recent metric will always be queried from the designated time range. The following table explains the generated period based on what `minTimestamp` and `maxTimestamp` values are provided.

minTimestamp provided | maxTimestamp provided | Resulting queried period
--- | --- | ---
No | No | defaults to the last year
Yes | Yes | `minTimestamp` to `maxTimestamp`
Yes | No | `minTimestamp` to a year following `minTimestamp`
No | Yes | a year prior `maxTimestamp` to `maxTimestamp`

```javascript
var metricUri = '/metric/uri';
KidaptiveSdk.learnerManager.getMetricByUri(metricUri).then(function(metric) {
    //SUCCESS
    console.log(metric)
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

#### KidaptiveSdk.learnerManager.getInsightByUri(insightUri:string, contextKeys:array)

This fetches the insight for the given `insightUri` for the current selected learner. The return value is a [Promise] which resolves when the insight is retrieved. An insight is a JSON object containing customized, learner-specific data, such as a content recommendation, parent report, or progress notification.

There is an optional second parameter `contextKeys` that is an array of strings. These strings correspond with the properties you want to be present on the resulting insight. If no contextKeys are provided, then the entire insight will be returned.

```javascript
var insightUri = '/insight/uri';
KidaptiveSdk.learnerManager.getInsightByUri(insightUri).then(function(insight) {
    //SUCCESS
    console.log(insight)
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

#### KidaptiveSdk.learnerManager.getInsights(minTimestamp:number, contextMap:object)

This fetches all insights for the current selected learner starting at the `minTimestamp` provided. The `minTimestamp` is a numeric value in milliseconds since unix epoch. The return value is a [Promise] which resolves when the insights are retrieved. An insight is a JSON object containing customized, learner-specific data, such as a content recommendation, parent report, or progress notification.

There is an optional second parameter `contextMap` that is a flat key:value map of strings. These key:value pairs correspond with properties on the insight. Providing a `contextMap` will cause the server to return only the insights that match all the values for the given keys in the contextMap you provide. There can only be at most 8 key:value pairs provided in a contextMap.

```javascript
var timestamp = new Date() - 86400000; //last day
KidaptiveSdk.learnerManager.getInsights(timestamp).then(function(insights) {
    //SUCCESS
    console.log(insights)
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

#### KidaptiveSdk.eventManager.reportSimpleEvent(eventName:string, eventFields:object)

This reports an event to the Kidaptive API using an `eventName string` and `eventFields object`. The return value is a [Promise] which resolves when the event is queued. 

Certain fields will be autopopulated, such as the learner info, app info, trial time, event time, and device info. The learner info will be populated with the values specified in the [KidaptiveSdk.learnerManager.setUser()](#kidaptivesdklearnermanagersetuseruserobjectobject) and [KidaptiveSdk.learnerManager.selectActiveLearner()](#kidaptivesdklearnermanagerselectactivelearnerproviderlearneridstring) calls. The trial time will be populated by the timestamp stored during the [KidaptiveSdk.learnerManager.startTrial()](#kidaptivesdklearnermanagerstarttrial) call. The event time will be populated by the current timestamp of when the event was sent.

When `authMode` is configured to `server` a user must be selected, but a learner is optional to send events. When `authMode` is configured to `client` events can be sent with or without a user or learner selected.

The properties in the `eventFields object` will be the specific values sent along with the event. The structure for `eventFields` is a flat key:value map where the values can only be `boolean`, `null`, `numeric`, and `string` values.

```javascript
KidaptiveSdk.eventManager.reportSimpleEvent('eventName', {
    eventProperty1: 'value',
    eventProperty2: 'value'
}).then(function() {
    //EVENT QUEUED
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

#### KidaptiveSdk.eventManager.reportRawEvent(rawEvent:string)

This reports an event to the Kidaptive API using only a `rawEvent` string. The return value is a [Promise] which resolves when the event is queued. 

Certain fields will be autopopulated, such as the learner info, app info, trial time, event time, and device info. The learner info will be populated with the values specified in the [KidaptiveSdk.learnerManager.setUser()](#kidaptivesdklearnermanagersetuseruserobjectobject) and [KidaptiveSdk.learnerManager.selectActiveLearner()](#kidaptivesdklearnermanagerselectactivelearnerproviderlearneridstring) calls. The trial time will be populated by the timestamp stored during the [KidaptiveSdk.learnerManager.startTrial()](#kidaptivesdklearnermanagerstarttrial) call. The event time will be populated by the current timestamp of when the event was sent.

When `authMode` is configured to `server` a user must be selected, but a learner is optional to send events. When `authMode` is configured to `client` events can be sent with or without a user or learner selected.

The `rawEvent` string can be any string, including a query string, or stringified JSON object. The structure for `rawEvent` is flexible but must be established with the Kidaptive team so the API can evaluate the event correctly.

```javascript
var rawEvent = 'eventName?eventProperty1=value&eventProperty2=value';
KidaptiveSdk.eventManager.reportRawEvent(rawEvent).then(function() {
    //EVENT QUEUED
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

#### KidaptiveSdk.eventManager.flushEventQueue()

This flushes all events out of the event queue and sends them to the Kidaptive API. The return value is a [Promise] which resolves to the results of the events being flushed. Events are automatically flushed at the specified interval during configuration, or when the [KidaptiveSdk.destroy()](#kidaptivesdkdestroy) method is called.

```javascript
KidaptiveSdk.eventManager.flushEventQueue().then(function(result) {
    //EVENTS FLUSHED
    console.log(result);
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

### Tier 2 Interface

#### KidaptiveSdk.learnerManager.getLatentAbilityEstimates()

Returns an array of latent ability estimate objects associated with the selected learner and the current app. A latent ability represents a learner's proficiency in a dimension across multiple game contexts.

```javascript
var latentAbilities = KidaptiveSdk.learnerManager.getLatentAbilityEstimates();
console.log(latentAbilities);
```

---

#### KidaptiveSdk.learnerManager.getLatentAbilityEstimate(dimensionUri:string)

Returns the latent ability estimate object associated with the dimensionUri for the selected learner and the current app. If no dimension for the given `dimensionUri` exists, this function will return undefined. A latent ability represents a learner's proficiency in a dimension across multiple game contexts.

```javascript
var dimensionUri = '/dimension/uri';
var latentAbility = KidaptiveSdk.learnerManager.getLatentAbilityEstimate(dimensionUri);
console.log(latentAbility);
```

---

#### KidaptiveSdk.learnerManager.getLocalAbilityEstimates()

Returns an array of local ability estimate objects associated with the selected learner and the current app. A local ability represents a learner's proficiency in a dimension in a specific game context.

```javascript
var localAbilities = KidaptiveSdk.learnerManager.getLocalAbilityEstimates();
console.log(localAbilities);
```

---

#### KidaptiveSdk.learnerManager.getLocalAbilityEstimate(localDimensionUri:string)

Returns the local ability estimate object associated with the localDimensionUri for the selected learner and the current app. If no local dimension for the given `localDimensionUri` exists, this function will return undefined. A local ability represents a learner's proficiency in a dimension in a specific game context.

```javascript
var localDimensionUri = '/local-dimension/uri';
var localAbility = KidaptiveSdk.learnerManager.getLocalAbilityEstimate(localDimensionUri);
console.log(localAbility);
```

---

#### KidaptiveSdk.learnerManager.updateAbilityEstimates()

Updates the models associated with the current app and selected learner. The return value is a [Promise] which resolves when the ability estimates have been updated from the server. Once this function has resolved, the getters for the ability estimates can be used.

When the SDK is configured to tier 3 or greater, the ability estimates could be updated by the local IRT module. The server ability estimates will only replace the client ability estimates if the server ability estimate timestamps are newer than the client ability estimate timestamps. This prevents this function from overwriting the up-to-date client ability estimates with out-of-date server estimates.

Ability estimates for the learners associated with the currently active user are cached in local storage. If the local storage is retained, the ability estimates will be available for all learners associated with that user after re-initizliation of the SDK, even after a complete restart of the browser.

This function is automatically called from [KidaptiveSdk.learnerManager.selectActiveLearner()](#kidaptivesdklearnermanagerselectactivelearnerproviderlearneridstring).

```javascript
KidaptiveSdk.learnerManager.updateAbilityEstimates().then(function() {
    //ABILITY ESTIMATES UPDATED
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

#### KidaptiveSdk.modelManager.getGames()

Returns an array of game objects associated with the current app. A game is a subset of functionality within the app that defines its own rules and experience.

```javascript
var games = KidaptiveSdk.modelManager.getGames();
console.log(games);
```

---

#### KidaptiveSdk.modelManager.getGameByUri(gameUri:string)

Returns the game object associated with the gameUri within the current app. A game is a subset of functionality within the app that defines its own rules and experience.

```javascript
var gameUri = '/game/uri';
var game = KidaptiveSdk.modelManager.getGameByUri(gameUri);
console.log(game);
```

---

#### KidaptiveSdk.modelManager.getDimensions()

Returns an array of dimension objects associated with the current app. Dimensions represent the key skills and abilities that make up the app's learning framework.

```javascript
var dimensions = KidaptiveSdk.modelManager.getDimensions();
console.log(dimensions);
```

---

#### KidaptiveSdk.modelManager.getDimensionByUri(dimensionUri:string)

Returns the dimension object associated with the dimensionUri within the current app. Dimensions represent the key skills and abilities that make up the app's learning framework.

```javascript
var dimensionUri = '/dimension/uri';
var dimension = KidaptiveSdk.modelManager.getDimensionByUri(dimensionUri);
console.log(dimension);
```

---

#### KidaptiveSdk.modelManager.getLocalDimensions()

Returns an array of local dimension objects associated with the current app. Local dimensions are defined for a given app and map to specific dimensions specified in the app's learning framework.

```javascript
var localDimensions = KidaptiveSdk.modelManager.getLocalDimensions();
console.log(localDimensions);
```

---

#### KidaptiveSdk.modelManager.getLocalDimensionByUri(localDimensionUri:string)

Returns the local dimension object associated with the localDimensionUri within the current app. Local dimensions are defined for a given app and map to specific dimensions specified in the app's learning framework.

```javascript
var localDimensionUri = '/local-dimension/uri';
var localDimension = KidaptiveSdk.modelManager.getLocalDimensionByUri(localDimensionUri);
console.log(localDimension);
```

---

#### KidaptiveSdk.modelManager.updateModels()

Updates the models associated with the current app, depending on what models are used by the configured tier. For tier 2, the game, dimension, and local dimension models will be updated. For tier 3, items will also be updated in addition to the models updated in tier 2. The return value is a [Promise] which resolves when the models have been updated from the server. Once this function is resolved, the getter functions for the models can be used.

This function is called from [KidaptiveSdk.init()](#kidaptivesdkinitapikeystring-optionsobject) when the SDK is configured to at least tier 2.

```javascript
KidaptiveSdk.modelManager.updateModels().then(function() {
    //MODELS UPDATED
}, function(error) {
    //ERROR
    console.log(error);
});
```

---

### Tier 3 Interface

#### KidaptiveSdk.eventManager.setEventTransformer(eventTransformer:string)

This method allows you to set an event transformer which will be called for every event being sent through the Kidaptive SDK. Whatever event you return from this function will be the event that is queued and sent to the server. If something other than an object is returned from this function, no event will be queued.

The purpose of this method is to add attempts for the local IRT (Item Response Theory) module. The attempts property on the event object is optional, but if it is defined it should be an array of attempt objects with the following properties:

Attempt Property | Type | Required | Default | Description
--- | --- | --- | --- | ---
itemUri | string | true |  | The uri of the desired item to send an outcome
outcome | number | true |  | Determines if the outcome of the attempt was positive or negative. Values can be `1` or `0`
guessingParameter | number | false | 0 | Determines how likely the user was to guess at this item. Values can be between or equal to `0` and `1`
priorLatentMean | number | false | | The learner's prior latent ability mean for the item's dimension
priorLatentStandardDeviation | number | false | | The learner's prior latent ability standard deviation for the item's dimension
priorLocalMean | number | false | | The learner's prior local ability mean for the item's local dimension
priorLocalStandardDeviation | number | false | | The learner's prior local ability standard deviation for the item's local dimension

This method can also add tags that the local IRT module uses to help process attempts. The tags property on the event object is optional, but if it is defined it should be an object with the following properties:

Tags Property | Type | Required | Default | Description
--- | --- | --- | --- | ---
skipIRT | boolean | false | false | Determines whether the local IRT module should be skipped for the attempts attached to this event. 

When events are processed by the local IRT module, they will update ability estimates. Server side IRT will also update ability estimates, but this happens less frequently, so having the local IRT module processing your events can help provide a more adaptive experience.

```javascript
var eventTransformer = function(event) {
    //PROCESS EVENT HERE
    event.attempts = [{itemURI: '/item/uri', outcome: 1}]
    return event;
}
KidaptiveSdk.eventManager.setEventTransformer(eventTransformer);
```

---

#### KidaptiveSdk.modelManager.getItems()

Returns an array of item objects associated with the current app. Items represent the smallest unit of measurement for a given dimension or skill.

```javascript
var items = KidaptiveSdk.modelManager.getItems();
console.log(items);
```

---

#### KidaptiveSdk.modelManager.getItemByUri(itemUri:string)

Returns the item object associated with the itemUri within the current app. Items represent the smallest unit of measurement for a given dimension or skill.

```javascript
var itemUri = '/item/uri';
var item = KidaptiveSdk.modelManager.getItemByUri(itemUri);
console.log(item);
```

---

## Build Process

The build process depends on node and npm. The build process builds files in the `dist` directory using `Webpack`, `Babel`, and `Uglify`. The build command will create both a minified and beautified file for use in production and development. The configuration used for the build process is in `webpack.config.js`

```javascript
npm run build
```

## Testing

The testing process builds a test file, hosts the test on `localhost:8080`, and runs the tests in a PhantomJs headerless browser. All test related files are located in the `/test` directory. The configuration used for the test build process is in `/test/webpack.test.config.js`

```javascript
npm run test
```

## Publishing

First run the following command to adjust the version and prepare the build files:

`npm version <level>` where level is ‘patch’, ‘minor’, or ‘major’

Then run the following command to publish the build on NPM:

`npm publish`

[Promise]: https://promisesaplus.com/
