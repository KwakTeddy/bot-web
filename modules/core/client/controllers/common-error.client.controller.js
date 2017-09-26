'use strict';

//플레이챗 전반적인 관리

angular.module('core').controller('CommonErrorController', ['$window', '$location', '$scope', '$timeout', function ($window, $location, $scope, $timeout)
{
    $scope.$parent.loading = false;
}]);
