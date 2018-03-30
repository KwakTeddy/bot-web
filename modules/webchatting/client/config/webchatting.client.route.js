'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('webchatting', {
        url: '/playchat/webchatting',
        templateUrl: 'modules/webchatting/client/views/webchatting.client.view.html',
        controller: 'WebChattingController'
    });
}]);
