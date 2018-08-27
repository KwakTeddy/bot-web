"user strict"

angular.module("playchat").controller("IntentAnalysisController", ['$scope', '$http', '$cookies', '$resource', 'DateRangePickerService', 'ExcelDownloadService', 'LanguageService',function ($scope, $http, $cookies, $resource, DateRangePickerService, ExcelDownloadService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Intent'), '/modules/playchat/gnb/client/imgs/intent.png');

    //서비스 선언
    var IntentService = $resource('/api/:botId/analysis/intent', {botId: '@botId'});

    var chatbot = $cookies.getObject('chatbot');

    $scope.date = {};


    (function()
    {
        var intentCanvas = document.getElementById("intentCanvas").getContext('2d');

        var intentDataTemplate = {
            labels: [],
            datasets: [{
                label: LanguageService('Intent Usage'),
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }]
        };

        var intentChart = new Chart(intentCanvas, {
            type: 'bar',
            data: angular.copy(intentDataTemplate),
            options: {
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });

        var excelData = [];

        $scope.getList = function()
        {
            excelData = [];
            IntentService.query({ botId: chatbot.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(list)
            {
                var labels = [];

                var dataset = [{
                    label: LanguageService('Intent Usage'),
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }];

                for(var i=0; i<list.length; i++)
                {
                    labels.push(list[i]._id.name);
                    dataset[0].data.push(list[i].count);
                    dataset[0].backgroundColor.push('#3b5998');
                    dataset[0].borderColor.push('#29487d');

                    excelData.push({ name: list[i]._id.name, count: list[i].count });
                }

                intentChart.data = { labels: labels, datasets: dataset };
                intentChart.update();

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
                sheetName: LanguageService('Top 10 Intent'),
                columnOrder: ['name', 'count'],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.id, LanguageService('Top 10 Intent'), $scope.date, template);
        };
    })();

    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
    $scope.lan=LanguageService;
}]);
