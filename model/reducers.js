import { combineReducers } from 'redux';
import { GET_DATA, SET_DATA } from './actions.js';

function dataSaved(state = {}, action = {}) {
    switch (action.type) {
        case SET_DATA:
            return {
                ...action.data
            };
        default:
            return state;
    }
}

function getData(state = {}, action = {}) {
    switch (action.type) {
        case GET_DATA:
            return {
                items: action.items
            };
        default:
            return state;
    }
}

export default combineReducers({dataSaved, getData});
