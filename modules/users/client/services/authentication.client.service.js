'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    //TODO make bot Session
    var auth = {
      user: $window.user,
      bot: $window.bot
    };
    return auth;
  }
]);
