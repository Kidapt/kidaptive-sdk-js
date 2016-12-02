# kidaptive-sdk-js

##Usage
Quickstart [Link coming soon]

API Documentation [Link coming soon]

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
