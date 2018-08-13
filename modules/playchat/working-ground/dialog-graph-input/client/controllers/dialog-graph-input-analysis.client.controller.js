"user strict"

angular.module("playchat").controller("DialogGraphInputAnalysisController", ['$scope', '$http', '$cookies', '$resource', 'DateRangePickerService', 'LanguageService', 'ExcelDownloadService', function ($scope, $http, $cookies, $resource, DateRangePickerService, LanguageService, ExcelDownloadService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Dialog Graph Input'), '/modules/playchat/gnb/client/imgs/graphinput.png');


    var DialogGraphInputService = $resource('/api/:botId/analysis/dialog-graph-input', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');

    var excelData = undefined;

    $scope.date = {};

    (function()
    {
        var indexing = function(index, source, target)
        {
            index = index || '';

            for(var i=0; i<source.length; i++)
            {
                if(source[i].name == target._id.dialogName)
                {
                    return index + (index ? '-' : '') + (i+1);
                }
                else if(source[i].children)
                {
                    return indexing(index + (index ? '-' : '') + (i+1), source[i].children, target);
                }
            }

            return '';
        }

        $scope.getList = function()
        {
            DialogGraphInputService.get({ botId: chatbot.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(result)
            {
                var indexList = {};
                var list = {};
                for(var i=0; i<result.list.length; i++)
                {
                    if(!list[result.list[i]._id.dialogName])
                        list[result.list[i]._id.dialogName] = [];

                    if(!indexList[result.list[i]._id.dialogName])
                    {
                        indexList[result.list[i]._id.dialogName] = indexing('', result.botScenario, result.list[i]);
                    }

                    list[result.list[i]._id.dialogName].push({ dialog: result.list[i]._id.dialog, count: result.list[i].count});
                }

                excelData = [];

                var html = '';
                for(var key in list)
                {
                    var data = { graphName: key, graphId: indexList[key] };

                    list[key].sort(function(a, b)
                    {
                        return b.count - a.count;
                    });

                    html += '<tr>';
                    html += '<td rowspan="2">' + indexList[key] + '</td>';
                    html += '<td rowspan="2">' + key + '</td>';
                    html += '<td>' + LanguageService('Input') + '</td>';

                    for(var i=0; i<5; i++)
                    {
                        if(i < list[key].length)
                        {
                            html += '<td>' + list[key][i].dialog + '</td>';
                            data[(i+1) + 'st'] = list[key][i].dialog + '\n' + list[key][i].count;
                        }
                        else
                        {
                            html += '<td></td>';
                            data[(i+1) + 'st'] = '';
                        }
                    }

                    html += '</tr>';
                    html += '<tr>';
                    html += '<td>' + LanguageService('Count') + '</td>';

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

                    excelData.push(data);
                }

                angular.element('tbody').html(html);

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
                sheetName: LanguageService('Dialog Graph Input'),
                columnOrder: ['graphId', 'graphName', '1st', '2st', '3st', '4st', '5st'],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.id, LanguageService('Dialog Graph Input'), $scope.date, template);
        };
    })();

    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();

    $scope.lan=LanguageService;
}]);
