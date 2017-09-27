'use strict';

// Setting up route
angular.module('chatbot').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('chatbot-list', {
        url: '/chatbot-list',
        templateUrl: 'modules/chatbot-list/client/views/chatbot.client.view.html',
        controller: 'ChatbotController'
    });
}]);
