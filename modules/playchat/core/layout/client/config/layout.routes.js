'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('playchat', {
        url: '/playchat',
        controller: function($state, $stateParams)
        {
            $state.go('playchat-page');
        }
    });

    $stateProvider.state('playchat-page', {
        url: '/playchat/:page',
        templateUrl: 'modules/playchat/core/layout/client/views/layout.client.view.html',
        controller: 'PlayChatController',
        data: {
            roles: ['user', 'admin']
        }
    });
}]);
