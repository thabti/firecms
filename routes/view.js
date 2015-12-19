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

}
