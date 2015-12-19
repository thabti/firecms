export default function(app) {


    app.post('/save', function (req, res) {

      var store = res.locals.store;
      var action = res.locals.action;

      let{title, description} = req.body;

      let results = {
        title: title,
        description: description
      }
      action.saveData(results);
      res.redirect('/view');
    });
}
