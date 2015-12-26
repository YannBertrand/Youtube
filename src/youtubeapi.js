var readline = require('readline');
var credentials = require('./credentials');

var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var Youtube = google.youtube('v3');

const REDIRECT_URL = 'http://localhost:9000/youtube/callback';
const oauth2Client = new OAuth2Client(credentials.CLIENT_ID, credentials.CLIENT_SECRET, REDIRECT_URL);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getAuthUrl(cb) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: 'https://www.googleapis.com/auth/youtube.readonly' // can be a space-delimited string or an array of scopes
  });

  return cb(url);
}

function getToken(code, cb) {
  // request access token
  oauth2Client.getToken(code, function(err, tokens) {
    // set tokens to the client
    oauth2Client.setCredentials(tokens);
    cb();
  });
}

// retrieve an access token
module.exports.getAuthUrl = function (cb) {
  getAuthUrl(cb);
};

module.exports.getToken = function (code, cb) {
  getToken(code, cb);
};

module.exports.getSubscriptions = function (cb) {
  Youtube.subscriptions.list({
    part: 'id',
    home: true,
    auth: oauth2Client
  }, cb);
};
