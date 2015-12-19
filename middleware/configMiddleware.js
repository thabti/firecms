var config = require('config');
module.exports = function(config) {
  return function(req, res, next) {
    res.locals.config = config
    next();
  }
}
