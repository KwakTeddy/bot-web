(function()
{
    'use strict';
    angular.module('playchat').controller('UserProfileController', ['$window', '$scope', '$resource', '$cookies', '$rootScope', 'LanguageService', function ($window, $scope, $resource, $cookies, $rootScope, LanguageService)
    {
        var UserLanguageService = $resource('/api/users/language');

        $scope.$parent.loading = false;

        var user = $cookies.getObject('user');
        $scope.user = user;
        // $scope.language = user.language;

        (function()
        {
            $scope.save = function()
            {
                user.language = $scope.user.language;
                UserLanguageService.save({ language: $scope.user.language }, function(result)
                {
                    // user.language = $scope.language;
                    $cookies.putObject('user', user);

                    $rootScope.$broadcast('changeLanguage');

                    $window.history.back();
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
