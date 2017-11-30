(function()
{
    'use strict';
    angular.module('playchat').controller('SigninController', ['$scope', '$state', '$http', '$cookies', 'LanguageService', function ($scope, $state, $http, $cookies, LanguageService)
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
                $cookies.putObject('user', response);
                $cookies.put('login', true);

                if($state.previous.href)
                    location.href = $state.previous.href;
                else
                    location.href = '/playchat/chatbots';
            });
        };


        $scope.lan = LanguageService;
    }]);
})();
