require("babel-core/register");
require("babel-polyfill");
var config = require('config');
// babel goodness
var express = require('express');
var app = module.exports = express();
app.set('config', config)
app.set('port', (process.env.PORT || app.get('config').port));
// views
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine({
  transformViews: false
}));
// middleware
require('./middleware/loadMiddlewares.js')(app, express);
// routes
require('./routes/index.js')(app);
// port
app.listen(app.get('port'), function () {
  var startupInfo = JSON.stringify(app.get('config')).replace(/,/g, '\n').replace(/:{/g, '\n');
  console.log('running on port ' + app.get('port'))
});
