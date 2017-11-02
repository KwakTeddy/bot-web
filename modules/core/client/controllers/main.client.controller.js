'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('MainController', ['$scope', '$location', '$timeout', '$cookies', 'Authentication', function ($scope, $location, $timeout, $cookies, Authentication)
{
    $scope.loading = true;

    $scope.$watch('loading', function(after, before)
    {
        if(!after)
        {
            angular.element('.main-logo-background').css('opacity', 0);
            $timeout(function()
            {
                angular.element('.main-logo-background').css('display', 'none');
            }, 1200);
        }
        else if(!before && after)
        {
            angular.element('.main-logo-background').css('display', '');
            $timeout(function(){
                angular.element('.main-logo-background').css('opacity', 1);
            }, 100);
        }
    });

    console.log('흠 : ', Authentication.user);

    if(!Authentication.user)
    {
        $location.url('/signin');
    }
    else
    {
        $cookies.putObject('user', Authentication.user);
    }
}]);
