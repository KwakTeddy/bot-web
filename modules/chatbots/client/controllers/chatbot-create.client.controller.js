(function()
{
    'use strict';

    angular.module('playchat').controller('ChatbotCreateController', ['$scope', '$resource', function ($scope, $resource)
    {
        var ChatbotTemplatesService = $resource('/api/chatbots/templates');

        $scope.list = [];

        (function()
        {
            $scope.getList = function()
            {
                ChatbotTemplatesService.query({}, function(result)
                {
                    console.log(result);
                    $scope.list = result;

                    $scope.$parent.loading = false;
                },
                function(err)
                {
                    alert(err);
                });
            };
        })();

        $scope.getList();
    }]);
})();
