'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('demo', {
        url: '/playchat/demo',
        templateUrl: 'modules/demo/client/views/demo.client.view.html',
        controller: 'DemoController'
    });

    // $stateProvider.state('graph-knowledge', {
    //     url: '/playchat/graph-knowledge',
    //     templateUrl: 'modules/demo/client/views/graph-knowledge.client.view.html',
    //     controller: 'GraphKnowledgeController'
    // });
}]);
