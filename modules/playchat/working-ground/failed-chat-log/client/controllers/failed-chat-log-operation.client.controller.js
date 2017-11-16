angular.module('playchat').controller('FailedChatLogController', ['$window', '$scope', '$resource', '$cookies', '$location', function ($window, $scope, $resource, $cookies, $location)
{
    $scope.$parent.changeWorkingGroundName('Operation > Failed Chat Log');

    $scope.changeTab = function(name)
    {
        angular.element('.tab-body').hide();
        angular.element('.tab-body[data-id="' + name + '"]').show();
    };
}]);
