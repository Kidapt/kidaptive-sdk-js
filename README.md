# kidaptive-sdk-js

##Usage
The [wiki](https://github.com/Kidapt/kidaptive-sdk-js/wiki) page contains a [Conceptional Introduction to ALP](https://github.com/Kidapt/kidaptive-sdk-js/wiki/Adaptive-Learning-Platform-Introduction), [Quickstart Guide](https://github.com/Kidapt/kidaptive-sdk-js/wiki/Quickstart-Guide), [Developer's Guide](https://github.com/Kidapt/kidaptive-sdk-js/wiki/Developer's-Guide), and [API Reference](https://github.com/Kidapt/kidaptive-sdk-js/wiki/API-Reference)

##Sample App
View the sample app [here](https://kidapt.github.io/kidaptive-sdk-js-demo/src/html/example_app.html)

[Source](https://github.com/Kidapt/kidaptive-sdk-js-demo/tree/gh-pages)

##Building

### Dependencies
* Node Package Manager (npm)
* Emscripten
* Swagger Codegen
* Make

### Global Node Modules
* Typings `[sudo] npm install -g typings`
* Watchify `[sudo] npm install -g watchify`

###Build IRT (Emscripten)
```
cd src/js/main/irt
make EMCC=<location of emcc>
```

###Generate Swagger Client Library
`swagger-codegen generate -i https://develop.kidaptive.com/swagger/v3.json -l typescript-node -o swagger-client`

###Build SDK
```
npm install
typings install
mkdir dist
npm run build
```

####Debug
`npm run build:debug`

####Production
`npm run build:prod`

####Watch
`npm run watch`

##Testing
Open `jasmine-standalone-2.5.0/SpecRunner.html` to run unit tests
