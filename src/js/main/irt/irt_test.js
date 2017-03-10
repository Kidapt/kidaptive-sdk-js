console.log("initializing...");

var irt = require('./irt.js');
var readline = require('readline');
var count = 0;

var stream = readline.createInterface({'input': process.stdin});

var post_mean = irt._malloc(8);
var post_sd = irt._malloc(8);

stream.on('line', function(line) {
	var row = line.trim().split(',');
    var y = row[0];
    var beta = row[1];
    var guessing = row[2];
    var prior_mean = row[3];
    var prior_sd = row[4];
    var post_mean_exp = row[5];
    var post_sd_exp = row[6];

    irt._estimate(y, beta, guessing, prior_mean, prior_sd, post_mean, post_sd);
    var post_mean_value = irt.getValue(post_mean, 'double');
    var post_sd_value = irt.getValue(post_sd, 'double');

    if (Math.abs(post_mean_value - post_mean_exp) > .001 || Math.abs(post_sd_value - post_sd_exp) > .001) {
        console.log([y, beta, guessing, prior_mean, prior_sd, post_mean_value, post_sd_value, post_mean_exp, post_sd_exp].join(','));
    }

    if (++count % 100000 == 0) {
        console.log(count + " complete");
    }
});

stream.on('close', function() {
    irt._free(post_mean);
    irt._free(post_sd);
    console.log("test complete");
});

