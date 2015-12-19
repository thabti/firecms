
// base routes
import view from './view.js';
import save from './save.js';


module.exports = function (app) {
// console.log(app.get('config') ,23434)
// console.log(res.locals.config)

  view(app);
  save(app)

  app.get('/', function(req, res) {
    res.render('index', {
      title: "Fire CMS"
    });
  })
};
