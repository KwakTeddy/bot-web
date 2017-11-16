angular.module('playchat').controller('AIChatLogController', ['$window', '$scope', '$resource', '$cookies', '$location', function ($window, $scope, $resource, $cookies, $location)
{
    $scope.$parent.changeWorkingGroundName('Operation > AI Chat Log');

    $scope.$parent.loaded('working-ground');
}]);
