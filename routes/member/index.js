export default function(app){

  app.get('/member/new', function(req, res) {
    let config = res.locals.config;
    console.log(config.fields.main)
    res.render('member/new', {
      title: "Fire CMS",
      config
    });
  });

  app.post('/member/save', function (req, res) {

    var store = res.locals.store;
    var action = res.locals.action;

    let{title, description} = req.body;
    console.log(req.body)

    let results = {
      title: title,
      key: title,
      description: description
    }
    action.saveData(results);
    res.redirect('/member/view');
  });

  app.get('/member/delete/:id', async function(req, res) {
    var id = req.params.id;
    var action = res.locals.action;
    await action.removeMember(id);
    res.redirect('/member/view');
  });


  app.get('/member/edit/:id', async function(req, res) {
    var id = req.params.id;
    var store = res.locals.store;
    var action = res.locals.action;
    await action.fetchData();
    var items = store.getState().memberData.items[id];
    res.render('member/new', {
      title: "Fire CMS",
      data: items,
      id: id,
      edit: true
    });
  });

  app.post('/member/edit/:id', async function (req, res) {
  var id = req.params.id;
  var store = res.locals.store;
  var action = res.locals.action;

  let{title, description} = req.body;

  let results = {
    title: title,
    description: description
  }

  await action.updateMember(id, results);
  res.redirect('/member/view');
});

  app.get('/member/view', async function(req, res) {
    var store = res.locals.store;
    var action = res.locals.action;
    await action.fetchData();
    var items = store.getState().memberData.items
    res.render('member/view', {
      title: "Fire CMS - view",
      items: items
    });
  });

}
