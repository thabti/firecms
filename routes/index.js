import React, { Component, PropTypes } from 'react';
import { applyMiddleware, createStore } from 'redux';
import { bindActionCreators } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../model/reducers.js';
// import actions, {getData, GET_DATA, saveData, fetchData} from ;
import * as actions from '../model/actions.js';
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);
var doAction = bindActionCreators(actions, store.dispatch);

var Remarkable = require('remarkable');
var md = new Remarkable({linkify: true, html: true});


module.exports = function (app) {

  app.get('/new', function(req, res) {
    var results = md.render("[I'm an inline-style link](https://www.google.com)");
    console.log(results);
    res.send(results)
  });

  app.get('/', function (req, res) {
    var isDev = process.env.NODE_ENV !== 'production'

    res.render('index', {
      title: "Fire CMS"
    });
  });


  app.get('/view', async function(req, res) {
    // store.subscribe(() =>
    // console.log(store.getState()))
    await doAction.fetchData();

    var items = store.getState().getData.items

    res.render('view', {
      title: "Fire CMS - view",
      items: items
    });
  });

  app.post('/save', function (req, res) {
    console.log(req.body)

    let{title, description} = req.body;

    let results = {
      title: title,
      description: md.render(description)
    }

    doAction.saveData(results);
    res.redirect('/view');
  });
};

function renderFullPage(html, initialState) {
  return `
  ${html}
  <script src="/static/bundle.js"></script>
</body>
</html>
`
}
