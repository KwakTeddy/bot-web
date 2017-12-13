(function()
{
    'use strict';
    angular.module('playchat').controller('SigninController', ['$scope', '$state', '$http', '$cookies', '$window', '$location', 'LanguageService', function ($scope, $state, $http, $cookies, $window, $location, LanguageService)
    {
        $scope.$parent.loading = false;
        $scope.credentials = {};

        var isLogin = $cookies.get('login');
        if(isLogin === true || isLogin === 'true')
        {
            if($state.previous.href)
                location.href = $state.previous.href;
            else
                location.href = '/playchat/chatbots';

            return;
        }

        $scope.fotgotPassword = function()
        {
            location.href = '/password/forgot';
        };

        $scope.signin = function()
        {
            $http.post('/api/auth/signin', $scope.credentials).success(function (response)
            {
                var user = $cookies.getObject('user');
                if(user && user.language)
                    response.language = user.language;

                $cookies.putObject('user', response);
                $cookies.put('login', true);

                if($state.previous.href)
                    location.href = $state.previous.href;
                else
                    location.href = '/playchat/chatbots';
            }).error(function(err)
            {
                if(err == 'not registration' || err.message.startsWith('E-mail 확인절차를'))
                {
                    alert('클로즈베타 심사중인 Email입니다. 결과를 기다려주세요.');
                }
            });
        };

        $scope.oauthCall = function(name)
        {
            $window.location.href = '/auth/' + name;
        };

        $scope.lan = LanguageService;

        var err = $location.search().err;
        if(err)
        {
            err = decodeURIComponent(err);
            if(err.indexOf('email_1 up key'))
            {
                alert('이미 다른 방법으로 로그인이 되었습니다');
            }
        }
    }]);
})();
