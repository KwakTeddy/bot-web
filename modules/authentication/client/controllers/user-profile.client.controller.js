(function()
{
    'use strict';
    angular.module('playchat').controller('UserProfileController', ['$scope', '$resource', '$cookies', function ($scope, $resource, $cookies)
    {
        var UserLanguageService = $resource('/api/users/language');

        $scope.$parent.loading = false;

        var user = $cookies.getObject('user');
        console.log(user);
        $scope.language = user.language;

        (function()
        {
            $scope.save = function()
            {
                UserLanguageService.save({ language: $scope.language }, function(result)
                {
                    console.log(result);
                    user.language = $scope.language;
                    $cookies.putObject('user', user);

                    alert('성공적으로 저장되었습니다');
                },
                function(err)
                {
                    alert(err);
                });
            };
        })();
    }]);

})();
