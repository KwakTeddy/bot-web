'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('HeaderController', ['$scope', '$location', '$timeout', '$cookies', '$window', '$rootScope', '$resource', 'Authentication', function ($scope, $location, $timeout, $cookies, $window, $rootScope, $resource, Authentication)
{
    $scope.isLogin = $cookies.get('login') == 'true';

    var UserLanguageService = $resource('/api/users/language');

    var user = $scope.user = $cookies.getObject('user');

    var userLang = navigator.language || navigator.userLanguage;
    var code = user ? user.language : userLang || 'en';

    code = code.split('-')[0];

    $scope.language = code || 'ko';

    $scope.languageChange = function()
    {
        UserLanguageService.save({ language: $scope.language }, function(result)
        {
            user.language = $scope.language;
            $cookies.putObject('user', user);

            $rootScope.$broadcast('changeLanguage');
        },
        function(err)
        {
            alert(err);
        });
    };

    angular.element('.user-menu a').on('click', function()
    {
        angular.element('.user-menu').hide();
    });

    $scope.openMenu = function(e)
    {
        var x = e.currentTarget.offsetLeft;
        var y = e.currentTarget.offsetTop + e.currentTarget.offsetHeight;

        x -= angular.element('.user-menu').css('width').replace('px', '')*1;

        console.log(angular.element('.user-menu'));

        angular.element('.user-menu').css('left', x + 'px').css('top', y + 'px').show();

        e.stopPropagation();
        e.preventDefault();
    };

    $scope.signout = function()
    {
        $window.location.href = '/api/auth/signout';
    };

    window.addEventListener('click', function(e)
    {
        angular.element('.user-menu').hide();
    });
}]);
