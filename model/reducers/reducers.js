import { combineReducers } from 'redux';
import {
  FETCH_MEMBER_DATA,
  SAVE_MEMEBER_DATA,
  SAVE_LOCATION_DATA,
  FETCH_LOCATION_DATA
} from '../actions/actions.js';

function saveMemberData(state = {}, action = {}) {
  switch (action.type) {
    case SAVE_MEMEBER_DATA:
      return {
        ...action.data
      };
    default:
      return state;
  }
}

function memberData(state = {}, action = {}) {
  switch (action.type) {
    case FETCH_MEMBER_DATA:
      return {
        items: action.items
      };
    default:
      return state;
  }
}

function locationData(state = {}, action = {}) {
  switch (action.type) {
    case FETCH_LOCATION_DATA:
      return {
        items: action.items
      };
    default:
      return state;
  }
}



function saveLocationData(state = {}, action = {}) {
  switch(action.type) {
    case SAVE_LOCATION_DATA:
      return {
        ...action.data
      };
    default:
      return state;
  }
}



export default combineReducers({saveMemberData, memberData,saveLocationData, locationData});
