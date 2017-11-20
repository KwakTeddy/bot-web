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
            if(!$scope.bot.id.match(/^[a-z]+/))
            {
                return alert('아이디는 영문자 소문자로 시작해야합니다.');
            }

            ChatbotService.save({ id: $scope.bot.id, name: $scope.bot.name, description: $scope.bot.descipriont }, function()
            {
                $location.url('/playchat/chatbots');
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };
    }]);
})();
