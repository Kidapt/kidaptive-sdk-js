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
mkdir dist
npm run build
```

####Debug
Build dist/kidaptive_sdk.min.js

`npm run build:debug`

####Production
Build dist/kidaptive_sdk.js

`npm run build:prod`

####Watch
Automatically build debug on file change

`npm run watch`

####Deploy
Build, bump version by specified increment (patch, minor, major) and push

`npm run deploy <version_increment>`

##Testing
Open `jasmine-standalone-2.5.0/SpecRunner.html` to run unit tests
