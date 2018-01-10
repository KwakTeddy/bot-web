'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  users = require('../../controllers/users.server.controller'),
  request = require('request');
var util = require('util');
module.exports = function (config) {
  // Use facebook strategy
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    request({
      url: 'https://graph.facebook.com/v2.9/oauth/access_token?grant_type=fb_exchange_token&client_id=' + config.facebook.clientID + '&client_secret=' + config.facebook.clientSecret + '&fb_exchange_token='+ accessToken,
      method: 'GET'
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        var providerData = profile._json;
        providerData.accessToken = body.access_token;
        providerData.refreshToken = refreshToken;

        // Create the user OAuth profile
        var providerUserProfile = {
          // firstName: profile.name.givenName,
          // lastName: profile.name.familyName,
          displayName: profile.displayName,
          email: profile._json ? profile._json.email : 'facebook',
          username: profile.username || generateUsername(profile),
          profileImageURL: (profile.id) ? '//graph.facebook.com/' + profile.id + '/picture?type=large' : undefined,
          provider: 'facebook',
          providerIdentifierField: 'id',
          providerData: providerData
        };

        // Save the user OAuth profile
        users.saveOAuthUserProfile(req, providerUserProfile, done);

      }
      console.log(JSON.stringify(error));
    });

    function generateUsername(profile) {
      var username = '';

      if (profile.emails) {
        username = profile.emails[0].value.split('@')[0];
      } else if (profile.name) {
        username = profile.name.givenName[0] + profile.name.familyName;
      }

      return username.toLowerCase() || undefined;
    }
  }));
};
