// global json data, see /config/ folder. 
var config = require('config');

var Firebase = require('firebase');
var Fireproof = require('fireproof');

var myFirebaseRef = new Firebase(config.firebase.url);
var fireproof = new Fireproof(myFirebaseRef);

module.exports = fireproof
