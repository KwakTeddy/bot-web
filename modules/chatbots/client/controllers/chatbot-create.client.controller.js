(function()
{
    'use strict';

    angular.module('playchat').controller('ChatbotCreateController', ['$scope', '$resource','LanguageService', function ($scope, $resource, LanguageService)
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
                    // 카테고리별로 정리
                    // for(var i=0; i<result.length; i++)
                    // {
                    //     if(result[i].category)
                    //     {
                    //         if(!$scope.list[result[i].category.name])
                    //             $scope.list[result[i].category.name] = [];
                    //
                    //         $scope.list[result[i].category.name].push(result[i]);
                    //     }
                    // }

                    for(var i=0; i<result.length; i++)
                    {
                        if(result[i].category)
                        {
                            if(!$scope.list[LanguageService('Template')])
                                $scope.list[LanguageService('Template')] = [];

                            $scope.list[LanguageService('Template')].push(result[i]);
                        }
                    }

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
        $scope.lan=LanguageService;
    }]);

})();
