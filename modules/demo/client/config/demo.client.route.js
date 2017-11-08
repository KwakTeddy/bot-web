'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('demo', {
        url: '/playchat/demo',
        templateUrl: 'modules/demo/client/views/demo.client.view.html',
        controller: 'DemoController'
    });
}]);
