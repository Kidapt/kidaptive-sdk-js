var irt = require('./irt');

var y = Math.random() > .5;
var beta = irt._inv_logis(Math.random());
var prior_mean = irt._inv_logis(Math.random());
var prior_sd = Math.exp(irt._inv_logis(Math.random()));

var post_mean = irt._malloc(8);
var post_sd = irt._malloc(8);

irt._estimate(y, beta, prior_mean, prior_sd, post_mean, post_sd);
var post_mean_value = irt.getValue(post_mean, 'double');
var post_sd_value = irt.getValue(post_sd, 'double');
irt._free(post_mean);
irt._free(post_sd);

console.log(y + " " + beta + " " + prior_mean + " " + prior_sd + " " + post_mean_value + " " + post_sd_value);

console.log(irt._inv_logis(.9));
console.log(irt._inv_logis(.75));
console.log(irt._inv_logis(.5));
console.log(irt._inv_logis(.25));
console.log(irt._inv_logis(.9));