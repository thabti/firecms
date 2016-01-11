export default function(app) {

  app.get('/location/new', function(req, res) {
    let config = res.locals.config;
    res.render('location/new', {
      title: "Fire CMS",
      config
    });
  });

  app.post('/location/save', function (req, res) {

    var store = res.locals.store;
    var action = res.locals.action;

    let{title, description} = req.body;

    let results = {
      title: title,
      key: title,
      description: description
    }


    action.saveLocation(results);
    res.redirect('/location/view');
  });


    app.get('/location/view', async function(req, res) {
      console.log("hello")
      var store = res.locals.store;
      var action = res.locals.action;
      await action.fetchLocations();
      let{items} = store.getState().locationData
      res.render('member/view', {
        title: "Fire CMS - view",
        items: items
      });
    });


}
