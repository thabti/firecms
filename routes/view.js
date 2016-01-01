export default function(app) {
  app.get('/view', async function(req, res) {
    var store = res.locals.store;
    var action = res.locals.action;
    await action.fetchData();
    var items = store.getState().getData.items
    res.render('view', {
      title: "Fire CMS - view",
      items: items
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



  app.get('/edit/:id', async function(req, res) {
    var id = req.params.id;
    var store = res.locals.store;
    var action = res.locals.action;
    await action.fetchData();
    var items = store.getState().getData.items[id];
    res.render('new', {
      title: "Fire CMS",
      data: items,
      id: id,
      edit: true
    });
  });

}
