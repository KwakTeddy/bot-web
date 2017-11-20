"user strict"

angular.module("playchat").controller("DialogGraphInputAnalysisController", ['$scope', '$http', '$cookies', '$resource', 'DateRangePickerService', function ($scope, $http, $cookies, $resource, DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName('Analysis > Dialog Graph Input');


    var DialogGraphInputService = $resource('/api/:botId/analysis/dialog-graph-input', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.date = {};

    (function()
    {
        $scope.getList = function()
        {
            DialogGraphInputService.query({ botId: chatbot.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(result)
            {
                var list = {};

                for(var i=0; i<result.length; i++)
                {
                    if(!list[result[i]._id.dialogName])
                        list[result[i]._id.dialogName] = [];

                    list[result[i]._id.dialogName].push({ dialog: result[i]._id.dialog, count: result[i].count});
                }

                var html = '';
                for(var key in list)
                {
                    list[key].sort(function(a, b)
                    {
                        return b.count - a.count;
                    });

                    html += '<tr>';
                    html += '<td rowspan="2">' + '</td>';
                    html += '<td rowspan="2">' + key + '</td>';
                    html += '<td>입력내용</td>';

                    for(var i=0; i<5; i++)
                    {
                        if(i < list[key].length)
                        {
                            html += '<td>' + list[key][i].dialog + '</td>';
                        }
                        else
                        {
                            html += '<td></td>';
                        }
                    }

                    html += '</tr>';
                    html += '<tr>';
                    html += '<td>횟수</td>';

                    for(var i=0; i<5; i++)
                    {
                        if(i < list[key].length)
                        {
                            html += '<td>' + list[key][i].count + '</td>';
                        }
                        else
                        {
                            html += '<td></td>';
                        }
                    }

                    html += '</tr>';
                }

                angular.element('tbody').html(html);

                console.log(list);
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };


        $scope.$parent.loaded('working-ground');

    })();

    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
}]);
