angular.module('playchat').controller('FailedDialogsOperationController', ['$window', '$scope', '$resource', '$cookies', '$location', function ($window, $scope, $resource, $cookies, $location)
{
    $scope.$parent.changeWorkingGroundName('Operation > Failed Chat Log');

    $scope.changeTab = function(e, name)
    {
        angular.element(e.currentTarget).parent().find('.select_tab').removeClass('select_tab');
        angular.element(e.currentTarget).addClass('select_tab');

        angular.element('.tab-body').hide();
        angular.element('.tab-body[data-id="' + name + '"]').show();

        e.preventDefault();
        e.stopPropagation();
    };
}]);
