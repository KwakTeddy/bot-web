angular.module('playchat.working-ground').controller('DialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService', function ($window, $scope, $resource, $cookies, $location, FileUploader, ModalService, TabService, FormService, PagingService)
{
    $scope.$parent.changeWorkingGroundName('Development > Dialog Graph');

    (function()
    {
        $scope.$parent.loaded('working-ground');
    })();
}]);
