import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../model/reducers.js';
import {getData, GET_DATA, saveData} from '../model/actions.js';
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

module.exports = function (app) {

  app.get('/new', function (req, res) {
    res.render('main');
  })


  app.get('/', function (req, res) {
    var isDev = process.env.NODE_ENV !== 'production'

    store.subscribe(() =>
      console.log(store.getState())
    )
    var data = store.getState().dataSaved;
    res.render('main', {
      dataSaved: JSON.stringify(data)
    });
  });

  app.post('/save', function (req, res) {
    console.log(req.body)
      store.dispatch(saveData(req.body));
      res.redirect('/');
  });
};
