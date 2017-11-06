(function()
{
    'use strict';

    angular.module('playchat').controller('ChatbotCreateController', ['$scope', '$resource', '$location', '$cookies', '$state', 'PagingService', 'CaretService', function ($scope, $resource, $location, $cookies, $state, PagingService, CaretService)
    {
        var ChatbotService = $resource('/api/chatbots');

        $scope.$parent.loading = false;

        $scope.bot = {};

        $scope.save = function()
        {
            ChatbotService.save({ id: $scope.bot.id, name: $scope.bot.name, description: $scope.bot.descipriont }, function()
            {
                $location.url('/chatbots');
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };
    }]);
})();
