export const GET_DATA = 'GET_DATA';
var Firebase = require('firebase')
var myFirebaseRef = new Firebase("https://stylecouncil.firebaseio.com/");

export function dataSaved(data = {}) {
  return {
    type: GET_DATA,
    data
  };
}

export function saveData(data) {
  return function thunk(dispatch) {
    myFirebaseRef.push(data, function(error) {
      if (error) { console.log(`Error: ${error}`)} else { dispatch(dataSaved(data)) }
    });
  }
}
