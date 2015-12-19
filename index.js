require("babel-core/register");
require("babel-polyfill");
var config = require('config');
// babel goodness
var express = require('express');
var app = module.exports = express();
app.set('config', config)
app.set('port', (process.env.PORT || app.get('config').port));
// middleware
app.use(require('./middleware/configMiddleware.js')(config))
app.use(require('./middleware/errorMiddleware.js'));
app.use(require('./middleware/modelMiddleware.js'));
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// views
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine({
  transformViews: false
}));
// assets
app.use('/assets', express.static('./assets'));
// routes
require('./routes/index.js')(app);
// port
app.listen(app.get('port'), function () {
  console.log('running on port ' + app.get('port') + '\n' + app.get('config'))
});
