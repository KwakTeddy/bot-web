'use strict';

//플레이챗 전반적인 관리

angular.module('playchat.top-bar').controller('TopBarController', ['$window', '$scope', function ($window, $scope)
{
    $scope.$parent.loaded('top-bar');
}]);
