'use strict';

angular.module('playchat.working-ground').controller('SummaryController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService', function ($window, $scope, $resource, $cookies, $location, $compile, TabService)
{
    $scope.$parent.loaded('working-ground');
}]);
