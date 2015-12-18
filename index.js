require("babel-core/register");


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
