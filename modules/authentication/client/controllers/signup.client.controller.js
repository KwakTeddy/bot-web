(function()
{
    'use strict';
    angular.module('playchat').controller('SignupController', ['$scope', '$state', '$http', '$cookies', 'LanguageService', function ($scope, $state, $http, $cookies, LanguageService)
    {
        $scope.$parent.loading = false;

        $scope.signupErrorMessage = '';
        $scope.successSignup = false;

        $scope.credentials = {};

        $scope.completeMessageEmail = '';

        $scope.resend = function ()
        {
            $http.post('/api/auth/signin', { resendEmail: $scope.credentials.email }).success(function (response)
            {
                console.log(response);
            }).error(function (response)
            {
                console.log(response);
            });
        };

        $scope.signup = function()
        {
            if($scope.credentials.password && $scope.credentials.passwordConfirm && $scope.credentials.password != $scope.credentials.passwordConfirm)
            {
                $scope.signupErrorMessage = 'Password is disaccord.';
                return false;
            }

            $http.post('/api/auth/signup', $scope.credentials).success(function (response)
            {
                $scope.successSignup = true;
            }).error(function (response)
            {
                if(response.message.match('SNS'))
                {
                    $scope.signupErrorMessage = 'You already signed up by ' + response.provider + '.';
                }
                else if(response.message.match('Failure sending email'))
                {
                    $scope.signupErrorMessage = '회원가입은 되었지만 E-mail 인증 메일 보내기에 실패했어요. 관리자에게 문의해주세요.';
                }
                else if(response.message.match('valid email'))
                {
                    $scope.signupErrorMessage = '유효한 형식의 이메일이 아니에요';
                }
                else
                {
                    $scope.signupErrorMessage = response.message;
                }
            });
        };


        $scope.lan = LanguageService;
    }]);
})();
