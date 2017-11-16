angular.module('playchat').controller('HumanChatLogController', ['$window', '$scope', '$resource', '$cookies', '$location', function ($window, $scope, $resource, $cookies, $location)
{
    $scope.$parent.changeWorkingGroundName('Operation > Human Chat Log');

    $scope.$parent.loaded('working-ground');
}]);
