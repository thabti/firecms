
// base routes
import member from './member/index.js';
import location from './locations/index.js';

module.exports = function (app) {
  member(app);
  location(app);

  app.get('/', function(req, res) {
    let config = res.locals.config;
    res.render('index', {
      title: "Fire CMS",
      config
    });
  });

  app.get('/api', async function(req, res) {
    var store = res.locals.store;
    var action = res.locals.action;
    await action.fetchData();
    var items = store.getState().getData.items;
    console.log(items)
    res.end(JSON.stringify(items));
  });



};
