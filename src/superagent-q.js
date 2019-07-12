/**
 * bbecker: A superagent q wrapper, extracted from https://github.com/ericvicenti/superagent-q
 * to this file due to an outdated package-lock.json with security vulnerabilities in its dependencies 
 * (the repo was abandoned)
 */

var Q = require('q');
var superagent = require('superagent');


function wrap(item) {
  return function() {
    var agent = item.apply(superagent, arguments);

    var agentEnd = agent.end;

    agent.end = function() {
      var doEnd = Q.defer();
      
      agent.on('progress', function (e) {
        doEnd.notify(e);
      });
      
      agentEnd.call(agent, function(err, res) {
        if (err) return doEnd.reject(err);
        doEnd.resolve(res);
      });
      
      return doEnd.promise;
    }

    return agent;
  }
}

var agentQ = wrap(superagent);

agentQ.get = wrap(superagent.get);
agentQ.put = wrap(superagent.put);
agentQ.post = wrap(superagent.post);
agentQ.del = wrap(superagent.del);
agentQ.head = wrap(superagent.head);

module.exports = agentQ;