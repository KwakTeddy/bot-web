'use strict';

// Authentication service for user variables
angular.module('playchat').factory('Authentication', ['$window', function ($window)
{
    //TODO make bot Session
    return { user: $window.__CONFIG.user };
}]);
