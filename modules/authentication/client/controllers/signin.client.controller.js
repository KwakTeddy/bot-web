(function()
{
    'use strict';
    angular.module('playchat').controller('SigninController', ['$scope', '$state', '$http', '$cookies', function ($scope, $state, $http, $cookies)
    {
        $scope.$parent.loading = false;
        $scope.credentials = {};

        var isLogin = $cookies.get('login');
        if(isLogin)
        {
            if($state.previous.href)
                location.href = $state.previous.href;
            else
                location.href = '/chatbot-list';

            return;
        }

        $scope.signin = function()
        {
            $http.post('/api/auth/signin', $scope.credentials).success(function (response)
            {
                $cookies.putObject('user', response);
                $cookies.put('login', true);

                if($state.previous.href)
                    location.href = $state.previous.href;
                else
                    location.href = '/chatbot-list';
            });
        };
    }]);
})();
