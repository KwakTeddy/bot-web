(function()
{
    'use strict';
    angular.module('playchat').controller('PasswordForgotController', ['$scope', '$state', '$http', '$cookies', 'LanguageService', function ($scope, $state, $http, $cookies, LanguageService)
    {
        $scope.$parent.loading = false;

        $scope.credentials = {};

        $scope.findPassword = function()
        {
            $scope.credentials.language = $cookies.get('language') || 'en';
            $http.post('/api/auth/forgot', $scope.credentials).success(function (response)
            {
                alert(LanguageService('We sent email to you for reset password.'));
            }).error(function (response)
            {
                if(response.message == 'SNS')
                {
                    alert(LanguageService('Your account is signed up from ' + response.provider + '.'));
                }
                else
                {
                    alert(LanguageService('Email is not found.'));
                }
            });
        };

        $scope.lan = LanguageService;
    }]);
})();
