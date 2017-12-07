'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('TopBarController', ['$window', '$scope', '$cookies','LanguageService', function ($window, $scope, $cookies, LanguageService)
{
    $scope.$parent.loaded('top-bar');

    angular.element('.user-menu a').on('click', function()
    {
        angular.element('.user-menu').hide();
    });

    $scope.user = $cookies.getObject('user');

    $scope.openMenu = function(e)
    {
        var x = e.currentTarget.offsetLeft;
        var y = e.currentTarget.offsetTop + e.currentTarget.offsetHeight;

        x -= angular.element('.user-menu').css('width').replace('px', '')*1;

        angular.element('.user-menu').css('left', x + 'px').css('top', y + 'px').show();

        e.stopPropagation();
        e.preventDefault();
    };

    $scope.signout = function()
    {
        $window.location.href = '/api/auth/signout';
    };

    $scope.$on('update-topbar-title', function(scope, data)
    {
        angular.element('.breadcrumbs .menu-name').text(data.name);
        angular.element('.breadcrumbs .menu-name-icon').get(0).src = data.imgUrl;
    });

    window.addEventListener('click', function(e)
    {
        angular.element('.user-menu').hide();
    });

    $scope.lan=LanguageService;
}]);
