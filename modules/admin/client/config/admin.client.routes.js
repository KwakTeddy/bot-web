'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('template-admin', {
        url: '/admin/templates',
        templateUrl: '/modules/admin/client/views/template-admin.client.view.html',
        controller: 'TemplateAdminController'
    });
}]);
