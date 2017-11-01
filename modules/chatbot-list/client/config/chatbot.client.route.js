'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('chatbot-list', {
        url: '/chatbot-list',
        templateUrl: 'modules/chatbot-list/client/views/chatbot.client.view.html',
        controller: 'ChatbotListController'
    });
}]);
