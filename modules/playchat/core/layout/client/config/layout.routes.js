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

    $stateProvider.state('playchat-template-contents', {
        url: '/playchat/templates/:templatePage',
        templateUrl: 'modules/playchat/core/layout/client/views/layout.client.view.html',
        controller: 'LayoutController',
        data: {
            roles: ['user', 'admin']
        }
    });

    $stateProvider.state('playchat-template', {
        url: '/playchat/templates/:templateCategory/:templatePage',
        templateUrl: 'modules/playchat/core/layout/client/views/layout.client.view.html',
        controller: 'LayoutController',
        data: {
            roles: ['user', 'admin']
        }
    });

    $stateProvider.state('playchat-page-main', {
        url: '/playchat',
        templateUrl: 'modules/playchat/core/layout/client/views/layout.client.view.html',
        controller: 'LayoutController',
        data: {
            roles: ['user', 'admin']
        }
    });

    $stateProvider.state('playchat-page', {
        url: '/playchat/:page',
        templateUrl: 'modules/playchat/core/layout/client/views/layout.client.view.html',
        controller: 'LayoutController',
        data: {
            roles: ['user', 'admin']
        }
    });

    $stateProvider.state('playchat-page-subpage', {
        url: '/playchat/:category/:page',
        templateUrl: 'modules/playchat/core/layout/client/views/layout.client.view.html',
        controller: 'LayoutController',
        data: {
            roles: ['user', 'admin']
        }
    });

    $stateProvider.state('playchat-page-detail', {
        url: '/playchat/:category/:page/:detail',
        templateUrl: 'modules/playchat/core/layout/client/views/layout.client.view.html',
        controller: 'LayoutController',
        data: {
            roles: ['user', 'admin']
        }
    });
}]);
