(function()
{
    'use strict';

    angular.module('playchat').controller('TemplateAdminController', ['$scope', '$resource', '$cookies', '$location', function ($scope, $resource, $cookies, $location)
    {
        var user = $cookies.getObject('user');

        if(user.roles.indexOf('admin') == -1)
        {
            $location.url('/');
            return;
        }

        var TemplateService = $resource('/api/admin/templates');
        var TemplateCategoriesService = $resource('/api/template-categories');

        $scope.template = {
            language: 'ko'
        };

        (function()
        {
            $scope.getCategories = function()
            {
                TemplateCategoriesService.query({}, function(list)
                {
                    $scope.categories = list;
                    console.log(list);

                    $scope.$parent.loading = false;
                },
                function(err)
                {
                    alert(err);
                });
            }

            $scope.save = function()
            {
                console.log($scope.template);

                TemplateService.save(JSON.parse(angular.toJson($scope.template)), function(result)
                {
                    console.log(result);
                    alert('템플릿이 생성되었습니다');

                    $scope.template = {
                        language: 'ko'
                    };
                },
                function(err)
                {
                    alert(err);
                });
            };

        })();

        $scope.getCategories();
    }]);
})();
