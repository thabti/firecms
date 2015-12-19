module.exports = function(app, express) {
  var config = app.get('config');

  app.use(require('./configMiddleware.js')(config))
  app.use(require('./errorMiddleware.js'));
  app.use(require('./modelMiddleware.js'));

  var bodyParser = require('body-parser')
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // assets
  app.use('/assets', express.static('./assets'));
}
