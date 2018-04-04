'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    User.findOne({
      email: email.toLowerCase()
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: '비밀번호가 잘못되었습니다'
          // message: '가입되지 않은 E-mail이거나 비밀번호가 잘못되었습니다'
        });
      }
      if (!user.localEmailConfirmed && (user.provider == 'local')){
        return done(null, false, {
          message: 'E-mail 확인절차를 거치지 않았습니다'
        })
      }

      return done(null, user);
    });
  }));
};
