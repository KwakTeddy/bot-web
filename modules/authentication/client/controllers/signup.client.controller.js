(function()
{
    'use strict';
    angular.module('playchat').controller('SignupController', ['$scope', '$resource','$state', '$http', '$window', '$cookies', '$location', 'LanguageService', function ($scope, $resource, $state, $http,$window, $cookies, $location, LanguageService)
    {
        $scope.user = $cookies.getObject('user');

        $scope.$parent.loading = false;
        $scope.isMatchCode = false;

        $scope.signupErrorMessage = '';

        $scope.credentials = {};

        $scope.completeMessageEmail = '';

        $scope.successSignup = false;
        $scope.invalid = $location.search().invalid ? true : false;
        $scope.error = $location.search().error ? true : false;
        $scope.verified = $location.search().verified ? true : false;



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

        $scope.onClickAuthBtn = function () {
            var inputCode = $('.authentication-code-area .input_type09.sign-input').val();

            var param = {
                'email': $scope.credentials.email,
                'veriCode': inputCode
            };

            $http.post('/api/auth/emailconfirm/code',param)
                .success(function(res){
                    $scope.successSignup = false;
                    $scope.verified = true;
                }).error(function(err){
                    console.log(err);
                    $scope.isMatchCode = true
                });
        };


        $scope.resend = function ()
        {
            $http.post('/api/auth/signin', { resendEmail: $scope.credentials.email }).success(function (response)
            {
                alert(response.message)
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

        $scope.updateUserInfor = function()
        {
            var bizKindOfBusiness = document.getElementById("bizKindOfBusiness");
            if(bizKindOfBusiness.options[bizKindOfBusiness.selectedIndex].text !== "업종을 선택하세요."){
                $scope.credentials.bizKindOfBusiness = bizKindOfBusiness.options[bizKindOfBusiness.selectedIndex].text;
            }else{
                $scope.credentials.bizKindOfBusiness = '';
            }

            $scope.credentials.phone = document.getElementById("phone").value;
            $scope.credentials.organization = document.getElementById("organization").value;
            $scope.credentials.bizChairEmail = document.getElementById("bizChairEmail").value;
            $scope.credentials.bizChairName = document.getElementById("bizChairName").value;
            var bizChair = document.getElementById("bizChair");
            if(bizChair.options[bizChair.selectedIndex].text !== "직책"){
                $scope.credentials.bizChairName = $scope.credentials.bizChairName + ' ' + bizChair.options[bizChair.selectedIndex].text;
            }

            $http.post('/api/users/updateBizAuthUser', $scope.credentials).success(function (response)
            {
                $window.location.href = '/playchat/development/create-bot';
            }).error(function (response)
            {
                console.log(response);
            })
        };

        $scope.oauthCall = function(name)
        {
            $window.location.href = '/auth/' + name;
        };

        $scope.lan = LanguageService;
    }]);
})();
