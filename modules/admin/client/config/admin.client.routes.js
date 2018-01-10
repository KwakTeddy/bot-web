'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('template-admin', {
        url: '/admin/templates',
        templateUrl: '/modules/admin/client/views/template-admin.client.view.html',
        controller: 'TemplateAdminController'
    });

    $stateProvider.state('closed-beta-user', {
        url: '/admin/users/closed-beta',
        templateUrl: '/modules/admin/client/views/closed-beta-user.client.view.html',
        controller: 'ClosedBetaUserController'
    });
}]);
