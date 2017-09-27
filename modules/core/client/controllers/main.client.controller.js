'use strict';

//플레이챗 전반적인 관리

angular.module('core').controller('MainController', ['$scope', 'Authentication', '$location', function ($scope, Authentication, $location)
{
    console.log('로그인 : ', Authentication.user);

    //로딩 페이지 사라지는 애니메이션.
    $scope.loading = true;

    if(!Authentication.user)
    {
        $location.url('/signin');
    }
}]);
