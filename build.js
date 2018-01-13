(function(){
    return {
        baseUrl: 'src/js/main/',
        paths: {
            jquery: '../../../bower_components/jquery/dist/jquery',
            sjcl: '../../../bower_components/sjcl/sjcl'
        },
        name: 'kidaptive_sdk',
        out: 'dist/kidaptive_sdk.js',
        optimize: 'none',
        findNestedDependencies: true,
        skipModuleInsertion: true,
        onModuleBundleComplete: function (data) {
            var fs = module.require('fs');
            var amdclean = module.require('amdclean');
            fs.readFile('src/js/main/kidaptive_wrapper.js', 'utf8', function(err, wrapper_data) {
                var wrapper = wrapper_data.split(/[\x20\t]*\/\/ @CODE\n(?:[\x20\t]*\/\/[^\n]+\n)*/);
                var cleanedCode = amdclean.clean({
                    filePath: data.path,
                    wrap: {
                        start: wrapper[0],
                        end: wrapper[1]
                    }
                });
                fs.writeFileSync(data.path, cleanedCode);
            });

        }
    };
}());
