(function()
{
    'use strict';
    angular.module('playchat').controller('PasswordResetController', ['$scope', '$state', '$http', '$cookies', '$location', '$resource', 'LanguageService', function ($scope, $state, $http, $cookies, $location, $resource, LanguageService)
    {
        $scope.$parent.loading = false;

        var PasswordChangeService = $resource('/auth/reset/:token', { token: '@token' });

        var url = $location.url();
        var split = url.split('/');
        var token = split[split.length-1];

        $scope.newPassword = '';
        $scope.verifyPassword = '';

        $scope.changePassword = function()
        {
            if($scope.newPassword != $scope.verifyPassword)
            {
                alert(LanguageService('Password is disaccord'));
            }
            else
            {
                PasswordChangeService.save({ newPassword: $scope.newPassword, verifyPassword: $scope.verifyPassword, token: token }, function(result)
                {
                    location.href = '/playchat/development/create-bot';
                },
                function(error)
                {
                    if(error.data.message == 'expired')
                    {
                        alert(LanguageService('Your verification URL has expired.'));
                        location.href = '/password/forgot';
                    }
                    else
                    {
                        alert(error.message);
                    }
                });
            }
        };

        // $scope.credentials = {};
        //
        // $scope.findPassword = function()
        // {
        //   var user = $cookies.getObject('user');
        //
        //   if(user && user.language) $scope.credentials.language = user.language;
        //   else $scope.credentials.language = 'en';
        //
        //     $http.post('/api/auth/forgot', $scope.credentials).success(function (response)
        //     {
        //         alert('We sent email to you for reset password.');
        //     }).error(function (response)
        //     {
        //         if(response.message == 'SNS')
        //         {
        //             alert('Your account is signed up from ' + response.provider + '.');
        //         }
        //         else
        //         {
        //             alert('Email is not found.');
        //         }
        //     });
        // };

        $scope.lan = LanguageService;
    }]);
})();
