'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  KakaoStrategy = require('passport-kakao').Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  // Use facebook strategy
  passport.use(new KakaoStrategy({
    clientID: config.kakao.clientID,
    //clientSecret: config.facebook.clientSecret,
    callbackURL: config.kakao.callbackURL,
    //profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    console.log(profile);
    // Create the user OAuth profile
    var providerUserProfile = {
      // firstName: firstName,
      // lastName: lastName,
      // displayName: profile.username,
      username: providerData.properties.nickname,
      displayName: providerData.properties.nickname,
      email: providerData.kaccount_email ? providerData.kaccount_email : 'kakao',
      profileImageURL: providerData.properties.profile_image,
      provider: 'kakao',
      providerIdentifierField: 'id',
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};
