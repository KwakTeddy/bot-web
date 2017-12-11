'use strict';

angular.module('playchat').controller('FailedDialogsAnalysisController', ['$scope', '$resource', '$cookies', '$http', 'DateRangePickerService', 'ExcelDownloadService','LanguageService', function ($scope, $resource, $cookies, $http, DateRangePickerService, ExcelDownloadService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Failed Dialogs'), '/modules/playchat/gnb/client/imgs/failed.png');

    var FailedDialogsService = $resource('/api/:botId/analysis/failed-dialogs', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.date = {};
    $scope.list = [];

    var excelData = undefined;

    (function()
    {
        $scope.getList = function()
        {
            FailedDialogsService.query({ botId: chatbot.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(result)
            {
                $scope.$parent.loaded('working-ground');
                $scope.list = result;

                excelData = angular.copy(result.list);
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.exelDownload = function()
        {
            var template = {
                sheetName: LanguageService('Failed Dialog'),
                columnOrder: ["dialog", "count"],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.id, LanguageService('Failed Dialog'), $scope.date, template);
        };
    })();

    //initialize
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
    $scope.lan=LanguageService;
}]);
