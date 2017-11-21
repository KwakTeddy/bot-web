"user strict"

angular.module("playchat").controller("IntentAnalysisController", ['$scope', '$http', '$cookies', '$resource', 'DateRangePickerService', 'ExcelDownloadService', function ($scope, $http, $cookies, $resource, DateRangePickerService, ExcelDownloadService)
{
    $scope.$parent.changeWorkingGroundName('Analysis > Intent');

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
                label: '인텐트 사용량',
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
                console.log('리스트 : ', list);

                var labels = [];

                var dataset = [{
                    label: '인텐트 사용량',
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
                sheetName: "인텐트 Top 10",
                columnOrder: ['name', 'count'],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.id, '인텐트 Top 10', $scope.date, template);
        };
    })();

    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
}]);
