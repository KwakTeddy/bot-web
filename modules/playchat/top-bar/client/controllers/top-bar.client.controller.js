'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('TopBarController', ['$window', '$scope', function ($window, $scope)
{
    $scope.$parent.loaded('top-bar');

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
    };

    $scope.signout = function()
    {
        $window.location.href = '/api/auth/signout';
    };
}]);
