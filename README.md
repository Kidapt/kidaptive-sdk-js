# kidaptive-sdk-js

## Dependencies
* Node Package Manager (npm)
* Emscripten
* Swagger Codegen

### Global Node Modules
* Typescript `[sudo] npm install -g typescript`
* Typings `[sudo] npm install -g typings`
* Browserify `[sudo] npm install -g browserify`
* Watchify `[sudo] npm install -g watchify`

##Building

###Build IRT (Emscripten)
`cd src/js/main/irt`
`make EMCC=<location of emcc>`

###Generate Swagger Client Library
`swagger-codegen generate -i https://develop.kidaptive.com/swagger/v3.json -l typescript-node -o swagger-client`

###Build SDK
`npm install`
`typings install`
`mkdir dist`
`npm run build`

####Debug
`npm run build:debug`

####Production
`npm run build:prod`

####Watch
`npm run watch`
