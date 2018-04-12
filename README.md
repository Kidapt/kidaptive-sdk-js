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
    * [KidaptiveSdk.eventManager.reportSimpleEvent()](#kidaptivesdkeventmanagerreportsimpleeventeventnamestring-eventfieldsobject)
    * [KidaptiveSdk.eventManager.reportRawEvent()](#kidaptivesdkeventmanagerreportraweventraweventstring)
    * [KidaptiveSdk.eventManager.flushEventQueue()](#kidaptivesdkeventmanagerflusheventqueue)
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
baseUrl | string | false |  | This property is only used and required when environment is set to `custom`. This allows for sending events to a different host when using a proxy.
appUri | string | false | | The appUri reported to the Kidaptive API with events.
version | string | false |  | The version reported to the Kidaptive API with events.
build | string | false |  | The build reported to the Kidaptive API with events.
autoFlushInterval | number | false | 60000 | The interval in milliseconds that the events should be flushed. A value of 0 will result in the auto flush being disabled.
autoFlushCallback | function or array | false |  | A callback function or an array of callback functions to be called with results of auto event flush.
loggingLevel | string | false | all | Defines the logging level to use. Values can be `all`, `warn`, or `minimal`. `all` will log all internal errors to console, including those that could potentially be handled in a promise error handler.

---

#### KidaptiveSdk.getSdkVersion()

This returns the SDK version being used. This is the only method that can be called prior to SDK initialization.

```
var sdkVersion = KidaptiveSdk.getSdkVersion();
console.log(sdkVersion);
```

---

#### KidaptiveSdk.destroy()

Notifies the SDK to uninitialize. The return value is a [Promise] which resolves when the SDK is uninitialized. The shutdown process includes stopping the auto flush, flushing all events, and finally uninitializing itself.

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

#### KidaptiveSdk.eventManager.reportSimpleEvent(eventName:string, eventFields:object)

This reports an event to the Kidaptive API using an `eventName string` and `eventFields object`. The return value is a [Promise] which resolves when the event is queued.  Certain fields will be autopopulated, such as the app info and device info. The properties in the `eventFields object` will be the specific values sent along with the event. The structure for `eventFields` is a flat key:value map where the values can only be `boolean`, `null`, `numeric`, and `string` values.

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

This reports an evevnt to the Kidaptive API using only a `rawEvent` string. The return value is a [Promise] which resolves when the event is queued. The `rawEvent` string can be any string, including a query string, or stringified JSON object. The structure for `rawEvent` is flexible but must be established with the Kidaptive team so the API can evaluate the event correctly.

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
