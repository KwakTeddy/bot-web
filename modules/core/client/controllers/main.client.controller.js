'use strict';

//플레이챗 전반적인 관리

angular.module('core').controller('MainController', ['$scope', 'Authentication', '$location', '$timeout', function ($scope, Authentication, $location, $timeout)
{
    console.log('로그인 : ', Authentication.user);

    $scope.loading = true;

    $scope.$watch('loading', function(after, before)
    {
        if(!after)
        {
            angular.element('.main-logo-background').css('opacity', 0);
            $timeout(function()
            {
                angular.element('.main-logo-background').css('display', 'none');
            }, 2100);
        }
        else if(!before && after)
        {
            angular.element('.main-logo-background').css('display', '');
            $timeout(function(){
                angular.element('.main-logo-background').css('opacity', 1);
            }, 100);
        }
    });

    if(!Authentication.user)
    {
        $location.url('/signin');
    }
}]);
