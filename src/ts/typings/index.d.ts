/**
 * Created by solomonliu on 2017-02-12.
 */

declare module 'swagger-client' {
    import Promise = require("bluebird");

    class SwaggerClient extends Promise<any> {
        constructor(url:string, {});
    }
    export = SwaggerClient;
}