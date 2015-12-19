require("babel-core/register");
require("babel-polyfill");
// babel goodness
var express = require('express');
var app = module.exports = express();
app.set('port', (process.env.PORT || 5000));
// middleware
var error = require('./middleware/errorMiddleware.js');
var model = require('./middleware/modelMiddleware.js');
console.log(error)
app.use(error);
app.use(model);
// app.use(require('./middleware/modelMiddleware.js')());
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
  console.log('running on port ' + app.get('port'))
});
