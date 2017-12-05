'use strict';

angular.module('playchat').controller('FailedDialogsAnalysisController', ['$scope', '$resource', '$cookies', '$http', 'DateRangePickerService', 'ExcelDownloadService','LanguageService', function ($scope, $resource, $cookies, $http, DateRangePickerService, ExcelDownloadService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName('Analysis > Failed Dialogs');

    var FailedDialogsService = $resource('/api/:botId/analysis/failed-dialogs', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.date = {};
    $scope.list = [];

    (function()
    {
        $scope.getList = function()
        {
            FailedDialogsService.query({ botId: chatbot.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(result)
            {
                $scope.$parent.loaded('working-ground');
                $scope.list = result;
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };
    })();

    //initialize
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
    $scope.lan=LanguageService;
}]);
