"user strict"

angular.module("playchat").controller("DialogTrainingUsageAnalysisController", ['$scope', '$resource', '$cookies', '$http', 'DateRangePickerService', 'ExcelDownloadService','LanguageService', function ($scope, $resource, $cookies, $http, DateRangePickerService, ExcelDownloadService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Dialog Set Usage'), '/modules/playchat/gnb/client/imgs/training.png');

    //서비스 선언
    var DialogTrainingUsageService = $resource('/api/:botId/analysis/dialog-training-usage', { botId: '@botId' });

    //변수 선언
    var chatbot = $cookies.getObject('chatbot');

    var excelData = undefined;

    //스코프 변수 선언
    $scope.date = {};
    $scope.list = [];

    (function()
    {
        //함수 선언
        $scope.getList = function()
        {
            DialogTrainingUsageService.get({ botId: chatbot.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(result)
            {
                var sum = 0;
                for(var i=0; i<result.list.length; i++)
                {
                    sum += result.list[i].count;

                    result.list[i].dialog = result.list[i]._id;
                    delete result.list[i]._id;
                }

                excelData = angular.copy(result.list);

                for(var i=0; i<result.list.length; i++)
                {
                    result.list[i].percent = Math.round((result.list[i].count / sum) * 100);
                }

                $scope.list = result.list;

                $scope.$parent.loaded('working-ground');
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.exelDownload = function()
        {
            var template = {
                sheetName: LanguageService('Usage of Dialog Set'),
                columnOrder: ["dialog", "count"],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.name, LanguageService('Usage of Dialog Set'), $scope.date, template);
        };
    })();

    //initialize
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
    $scope.lan=LanguageService;
}]);
