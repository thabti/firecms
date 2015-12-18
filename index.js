// babel goodness
require("babel-core/register");
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



app.set('views', require('path').join(__dirname, '/views'));
app.use('/assets', express.static('./assets'));

app.engine('.hbs', require('express-handlebars')({defaultLayout: 'main', extname: '.hbs'}));

app.set('view engine', '.hbs');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./routes/index.js')(app);


app.listen(app.get('port'), function () {
  console.log('running on port ' + app.get('port'))
});
