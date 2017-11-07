'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('chatbots', {
        url: '/playchat/chatbots',
        templateUrl: 'modules/chatbots/client/views/chatbot.client.view.html',
        controller: 'ChatbotListController'
    });

    $stateProvider.state('chatbots-create', {
        url: '/playchat/chatbots/create',
        templateUrl: 'modules/chatbots/client/views/chatbot-create.client.view.html',
        controller: 'ChatbotCreateController'
    });
}]);
