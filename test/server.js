/**
 * Created by cameronperry on 2018-1-26.
 */
const express = require('express');
const app = express();
var router = express.Router();
var timeout;
router.use(function(req, res, next) {
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    process.exit(0);
  }, 100);
  next(); // make sure we go to the next routes and don't stop here
});
app.use('/', router);
app.use('/', express.static('./'));
app.listen(8080);
