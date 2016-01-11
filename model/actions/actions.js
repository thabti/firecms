import firebase from '../firebase.js';
export const FETCH_MEMBER_DATA = 'FETCH_MEMBER_DATA';
export const SAVE_MEMEBER_DATA = 'SAVE_MEMEBER_DATA';

export const SAVE_LOCATION_DATA = 'SAVE_LOCATION_DATA';
export const FETCH_LOCATION_DATA = 'FETCH_LOCATION_DATA';



// location
export function saveLocationData(data = {}) {
  return { type: SAVE_LOCATION_DATA, data}
}

export function locationData(items = {}) {
  return {
    type: FETCH_LOCATION_DATA,
    items
  };
}

// member
export function saveMemberData(data = {}) {
  return {
    type: SAVE_MEMEBER_DATA,
    data
  };
}

export function fetchMemberData(items = {}) {
  return {
    type: FETCH_MEMBER_DATA,
    items
  };
}

// Member
export function saveData(data) {
  return async function thunk(dispatch) {
    firebase.child('member').push(data, function(error) {
      if (error) { console.log(`Error: ${error}`)} else { dispatch(saveMemberData(data)) }
    });
  }
}


export function fetchData(limit = 0) {
  return function thunk(dispatch) {
    return firebase.child('member').on("value").then((snapshot) => {
      dispatch(fetchMemberData(snapshot.val()))
    }, (err) => {
      console.error('Firebase!', err);
    })

  }
}

export function removeMember(key) {
  return async function thunk(dispatch) {
    firebase.child('member').child(key).remove().then((data) => {
      dispatch(null);
    }, (err) => {
      console.error('Firebase!', err);
    });
  }
}

export function updateMember(key, data) {
  return async function thunk(dispatch) {
    firebase.child('member').child(key).update(data).then((data) => {
      dispatch(saveMemberData(data));
    }, (err) => {
      console.error('Firebase!', err);
    });
  }
}

// Location
export function fetchLocations(limit = 0) {
  return function thunk(dispatch) {
    return firebase.child('location').on("value").then((snapshot) => {
        dispatch(locationData(snapshot.val()))
    }, (err) => {
      console.error('Firebase!', err);
    })

  }
}

export function saveLocation(data) {
  return async function thunk(dispatch) {
    firebase.child('location').push(data, function(error) {
      if (error) { console.log(`Error: ${error}`)} else { dispatch(saveLocationData(data)) }
    });
  }
}
