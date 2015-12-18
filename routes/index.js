import React, { Component, PropTypes } from 'react';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../model/reducers.js';
import {getData, GET_DATA, saveData} from '../model/actions.js';
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux';
import Index from '../views/index.jsx'
module.exports = function (app) {

  app.get('/new', function (req, res) {
    const html = renderToString(
       <Provider store={store}>
         <Index title="Fire CMS" />
       </Provider>
     )

     // Grab the initial state from our Redux store
 const initialState = store.getState()

 // Send the rendered page back to the client
 res.send(renderFullPage(html, initialState))
  })


  app.get('/', function (req, res) {
    var isDev = process.env.NODE_ENV !== 'production'

    store.subscribe(() =>
      console.log(store.getState())
    )
    var data = store.getState().dataSaved;
    res.render('index', {
      title: "Fire CMS",
      dataSaved: JSON.stringify(data)
    });
  });

  app.post('/save', function (req, res) {
    console.log(req.body)
      store.dispatch(saveData(req.body));
      res.redirect('/');
  });
};

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}
