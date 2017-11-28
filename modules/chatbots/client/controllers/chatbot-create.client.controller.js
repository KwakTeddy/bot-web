(function()
{
    'use strict';

    angular.module('playchat').controller('ChatbotCreateController', ['$scope', '$resource', function ($scope, $resource)
    {
        var ChatbotTemplateCategoryService = $resource('/api/template-categories');
        var ChatbotTemplatesService = $resource('/api/chatbots/templates');

        $scope.list = {};

        (function()
        {
            $scope.getList = function()
            {
                ChatbotTemplatesService.query({}, function(result)
                {
                    console.log(result);
                    for(var i=0; i<result.length; i++)
                    {
                        if(!$scope.list[result[i].category.name])
                            $scope.list[result[i].category.name] = [];

                        $scope.list[result[i].category.name].push(result[i]);
                    }
                    // $scope.list = result;

                    console.log($scope.list);

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
