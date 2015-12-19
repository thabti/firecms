
import { applyMiddleware, createStore, bindActionCreators } from 'redux';
import reducer from '../model/reducers.js';
import * as actions from '../model/actions.js';
import thunk from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);
const action = bindActionCreators(actions, store.dispatch);

// store.subscribe(() => console.log('store 1', JSON.stringify(store.getState())))
module.exports = function(req, res, next) {
  res.locals.store = store;
  res.locals.action = action;
  next();
}
