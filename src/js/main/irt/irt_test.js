var irt = require('./irt.js');
var parse = require('./node_modules/csv-parse');
var fs = require('fs');

var parser = parse({delimiter: ','}, function (err, data) {
	console.log("starting test...");
	var post_mean = irt._malloc(8);
	var post_sd = irt._malloc(8);

	for (var index in data) {
		var row = data[index];
		var y = row[0];
		var beta = row[1];
		var prior_mean = row[2];
		var prior_sd = row[3];
		var post_mean_exp = row[4];
		var post_sd_exp = row[5];

		irt._estimate(y, beta, prior_mean, prior_sd, post_mean, post_sd);
		var post_mean_value = irt.getValue(post_mean, 'double');
		var post_sd_value = irt.getValue(post_sd, 'double');
		if (Math.abs(post_mean_value - post_mean_exp) > .001 || Math.abs(post_sd_value - post_sd_exp) > .001) {
			console.log([y, beta, prior_mean, prior_sd, post_mean_value, post_sd_value, post_mean_exp, post_sd_exp]);
		}
	}
	irt._free(post_mean);
	irt._free(post_sd);
	console.log("test complete");
});

fs.createReadStream('./test.data').pipe(parser);
console.log(irt._inv_logis(.9));
console.log(irt._inv_logis(.75));
console.log(irt._inv_logis(.5));
console.log(irt._inv_logis(.25));
console.log(irt._inv_logis(.9));