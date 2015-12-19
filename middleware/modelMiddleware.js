
import { applyMiddleware, createStore, bindActionCreators } from 'redux';
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
import reducer from '../model/reducers.js';
import * as actions from '../model/actions.js';
import thunk from 'redux-thunk';
const store = createStoreWithMiddleware(reducer);
var action = bindActionCreators(actions, store.dispatch);
store.subscribe(() => console.log('store ', JSON.stringify(store.getState())))


module.exports = function(req, res, next) {
  console.log('Time:', Date.now());
  res.locals.store = store;
  res.locals.action = action;

  next();
}
