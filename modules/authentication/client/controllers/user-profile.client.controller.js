(function()
{
    'use strict';
    angular.module('playchat').controller('UserProfileController', ['$window', '$scope', '$resource', '$cookies', '$rootScope', 'LanguageService', function ($window, $scope, $resource, $cookies, $rootScope, LanguageService)
    {
        var UserService = $resource('/api/users');

        $scope.$parent.loading = false;

        var user = $cookies.getObject('user');
        $scope.user = user;
        // $scope.language = user.language;

        $scope.password = '';
        $scope.passwordConfirm = '';

        (function()
        {
            $scope.save = function()
            {
                user.language = $scope.user.language;

                if($scope.password && $scope.passwordConfirm)
                {
                    if($scope.password != $scope.passwordConfirm)
                    {
                        return alert(LanguageService('Password is disaccord'));
                    }
                }
                else
                {
                    $scope.password = '';
                }

                UserService.save({ language: $scope.user.language, password: $scope.password }, function(result)
                {
                    // user.language = $scope.language;
                    $cookies.putObject('user', user);
                    $rootScope.$broadcast('changeLanguage');

                    alert(LanguageService('Has been applied'));
                },
                function(err)
                {
                    alert(err);
                });
            };
        })();

        $scope.lan = LanguageService;
    }]);

})();
