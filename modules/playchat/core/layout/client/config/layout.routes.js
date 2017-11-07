'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('playchat-main', {
        url: '/playchat',
        controller: function($state, $stateParams, $cookies)
        {
            $state.go('playchat-page');
        }
    });

    $stateProvider.state('playchat-page', {
        url: '/playchat/:menu/:page',
        templateUrl: 'modules/playchat/core/layout/client/views/layout.client.view.html',
        controller: 'LayoutController',
        data: {
            roles: ['user', 'admin']
        }
    });
}]);
