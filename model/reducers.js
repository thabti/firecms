import { combineReducers } from 'redux';
import { GET_DATA } from './actions.js';

function dataSaved(state = {}, action = {}) {
    switch (action.type) {
        case GET_DATA:
            return {
                ...action.data
            };
        default:
            return state;
    }
}

export default combineReducers({dataSaved});
