'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('playchat-main', {
        url: '/',
        templateUrl: 'modules/playchat/core/client/views/playchat.main.client.view.html',
        controller: 'PlayChatController',
        data: {
            roles: ['user', 'admin']
        }
    });
}]);
