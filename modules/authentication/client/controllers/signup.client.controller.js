(function()
{
    'use strict';
    angular.module('playchat').controller('SignupController', ['$scope', '$state', '$http', '$cookies', '$location', 'LanguageService', function ($scope, $state, $http, $cookies, $location, LanguageService)
    {
        $scope.$parent.loading = false;

        $scope.signupErrorMessage = '';

        $scope.credentials = {};

        $scope.completeMessageEmail = '';

        $scope.successSignup = false;
        $scope.invalid = $location.search().invalid ? true : false;
        $scope.error = $location.search().error ? true : false;
        $scope.verified = $location.search().verified ? true : false;

        console.log('머지 : ', $scope.successSignup, $scope.invalid, $scope.error, $scope.verified);

        if($scope.invalid)
        {
            $scope.credentials.email = $location.search().email;
        }

        if($scope.error)
        {
            if($location.search().type == 'database')
            {
                $scope.errorMessage = LanguageService('There was a temporary error. Please try again in a few minutes.');
            }
            else
            {
                $scope.errorMessage = LanguageService('Your email is not signed up.');
            }
        }

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
            angular.element('#signupButton').hide().next().show();
            if($scope.credentials.password && $scope.credentials.passwordConfirm && $scope.credentials.password != $scope.credentials.passwordConfirm)
            {
                angular.element('#signupButton').show().next().hide();
                $scope.signupErrorMessage = LanguageService('Password is disaccord');
                return false;
            }

            $scope.credentials.language = $cookies.get('language') || 'en';

            $http.post('/api/auth/signup', $scope.credentials).success(function (response)
            {
                $scope.successSignup = true;
            }).error(function (response)
            {
                angular.element('#signupButton').show().next().hide();

                if(response.message.match('SNS'))
                {
                    $scope.signupErrorMessage = LanguageService('You already signed up by ' + response.provider);
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

        $scope.receiveAgain = function()
        {
            $http.post('/api/auth/signin', {resendEmail: $scope.credentials.email}).success(function (response)
            {
                alert(LanguageService('Email has been sent again.'));
            }).error(function (response)
            {
                console.log(response)
            })
        };

        $scope.moveToFront = function()
        {
            location.href = '/';
        };

        $scope.lan = LanguageService;
    }]);
})();
