"user strict"

angular.module("playchat").controller("DialogTrainingUsageAnalysisController", ['$scope', '$resource', '$cookies', '$http', 'DateRangePickerService', 'ExcelDownloadService','LanguageService', function ($scope, $resource, $cookies, $http, DateRangePickerService, ExcelDownloadService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Dialog Training Usage'), '/modules/playchat/gnb/client/imgs/training.png');

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
                var max = 0;
                for(var i=0; i<result.list.length; i++)
                {
                    if(max < result.list[i].count)
                        max = result.list[i].count;

                    result.list[i].dialog = result.list[i]._id;
                    delete result.list[i]._id;
                }

                excelData = angular.copy(result.list);

                for(var i=0; i<result.list.length; i++)
                {
                    result.list[i].percent = Math.round((result.list[i].count / max) * 100);
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
                sheetName: "학습 대화 사용량",
                columnOrder: ["dialog", "count"],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.id, '학습 대화 사용량', $scope.date, template);
        };
    })();

    //initialize
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
    $scope.lan=LanguageService;
}]);
