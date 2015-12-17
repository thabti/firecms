import { combineReducers } from 'redux';
import { GET_DATA } from './actions.js';

function getData(state = {}, action = {}) {
    switch (action.type) {
        case GET_DATA:
            return {
                ...action
            };
        default:
            return state;
    }
}

export default combineReducers({getData});
