(function()
{
    'use strict';
    angular.module('playchat').controller('PasswordForgotController', ['$scope', '$state', '$http', '$cookies', function ($scope, $state, $http, $cookies)
    {
        $scope.$parent.loading = false;

        $scope.credentials = {};

        $scope.findPassword = function()
        {
            $http.post('/api/auth/forgot', $scope.credentials).success(function (response)
            {
                alert('We sent email to you for reset password.');
            }).error(function (response)
            {
                if(response.message == 'SNS')
                {
                    alert('Your account is signed up from ' + response.provider + '.');
                }
                else
                {
                    alert('Email is not found.');
                }
            });
        };
    }]);
})();
