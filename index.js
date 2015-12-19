require("babel-core/register");
require("babel-polyfill");


// babel goodness
var express = require('express');
var app = module.exports = express();
app.set('port', (process.env.PORT || 5000));

// Error
app.use(function(err,req,res,next){
  if(err){
    console.log(err);
  }
  next();
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});


app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine({
  transformViews: false
}));

app.use('/assets', express.static('./assets'));

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./routes/index.js')(app);


app.listen(app.get('port'), function () {
  console.log('running on port ' + app.get('port'))
});
