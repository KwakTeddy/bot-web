"user strict"

angular.module("playchat").controller("DialogGraphUsageAnalysisController", ['$scope', '$http', '$cookies', '$resource', 'DateRangePickerService', 'LanguageService', 'ExcelDownloadService',function ($scope, $http, $cookies, $resource, DateRangePickerService, LanguageService, ExcelDownloadService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Dialog Scenario Usage'), '/modules/playchat/gnb/client/imgs/graphusage.png');

    //서비스 선언
    var DialogGraphUsageService = $resource('/api/:botId/analysis/dialog-graph-usage', { botId: '@botId' });

    $scope.$parent.loaded('working-ground');

    var chatbot = $cookies.getObject('chatbot');

    $scope.date = {};

    $scope.list = undefined;

    var excelData = undefined;

    (function()
    {
        var indexing = function (scenario, depth, index) {
            var newDepth;
            newDepth = depth + "-" + index;
            $scope.scenarioIndex[scenario.name] = newDepth;
            if(scenario.children){
                scenario.children.forEach(function (child, index) {
                    index++;
                    index = index.toString();
                    indexing(child, newDepth, index)
                })
            }
        };

        $scope.getList = function()
        {
            DialogGraphUsageService.get({ botId: chatbot.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(doc)
            {
                $scope.scenarioIndex = {};
                $scope.scenarioUsageList = [];


                var botScenario = doc.botScenario;

                var depth = "1";
                for(var i = 0; i < botScenario.length; i++)
                {
                    if(!botScenario[i].name)
                    {
                        continue;
                    }
                    else
                    {
                        $scope.scenarioIndex[botScenario[i].name] = depth + "-0";
                    }

                    if(botScenario[i].children)
                    {
                        botScenario[i].children.forEach(function (child, index)
                        {
                            index++;
                            index = index.toString();
                            indexing(child, depth, index)
                        });
                    }

                    depth = parseInt(depth) + 1;
                    depth = depth.toString();
                }

                doc.scenarioUsage.forEach(function (_doc)
                {
                    if($scope.scenarioIndex[_doc._id.dialogName])
                    {
                        var prefix = "";
                        for(var i = 0; i < $scope.scenarioIndex[_doc._id.dialogName].split('-')[0]; i++)
                        {
                            prefix = prefix + "a"
                        }
                        _doc['index'] = $scope.scenarioIndex[_doc._id.dialogName];
                        _doc['order'] = prefix + $scope.scenarioIndex[_doc._id.dialogName];

                        delete $scope.scenarioIndex[_doc._id.dialogName]
                    }
                    else
                    {
                        _doc['index'] = '';
                        _doc['order'] = 'z';
                    }
                });

                if($scope.scenarioIndex)
                {
                    Object.keys($scope.scenarioIndex).forEach(function (key)
                    {
                        var prefix = "";
                        for(var i = 0; i < $scope.scenarioIndex[key].split('-')[0]; i++)
                        {
                            prefix = prefix + "a"
                        }

                        var obj = {_id: {dialogName: ""}, order:"", index: "", facebook: 0, kakao: 0, navertalk: 0, total: 0};
                        obj._id.dialogName = key;
                        obj.order = prefix + $scope.scenarioIndex[key];
                        obj.index = $scope.scenarioIndex[key];
                        $scope.scenarioUsageList.push(obj);
                    })
                }

                var result = [];
                result.push.apply($scope.scenarioUsageList, doc.scenarioUsage);

                var sum = 0;
                for(var i=0; i<$scope.scenarioUsageList.length; i++)
                {
                    sum += $scope.scenarioUsageList[i].total;
                }

                for(var i=0; i<$scope.scenarioUsageList.length; i++)
                {
                    $scope.scenarioUsageList[i].percent = Math.round(($scope.scenarioUsageList[i].total / sum) * 100);
                }

                $scope.list = $scope.scenarioUsageList;


                excelData = [];
                for(var i=0; i<$scope.scenarioUsageList.length; i++)
                {
                    excelData.push(
                        {
                            name: $scope.scenarioUsageList[i]._id.dialogName,
                            index: $scope.scenarioUsageList[i].index,
                            count: $scope.scenarioUsageList[i].total
                        })
                }
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.exelDownload = function()
        {
            excelData.sort(function (a, b) {

                if(!a.index) return 1;
                if(!b.index) return -1;

                var diff = function (a, b, idx) {
                    a = a.replace('-', '');
                    b = b.replace('-', '');

                    if(!a[idx]) return -1;
                    if(!b[idx]) return 1;

                    if(parseInt(a[idx]) - parseInt(b[idx]))
                    {
                        return parseInt(a[idx]) - parseInt(b[idx]);
                    }
                    else
                    {
                        return diff(a, b, idx + 1);
                    }

                };

                return diff(a.index, b.index, 0);

            });

            var template = {
                sheetName: LanguageService('Dialog Scenario Usage'),
                columnOrder: ['index', 'name', 'count'],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.name, LanguageService('Dialog Scenario Usage'), $scope.date, template);
        };
    })();

    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();

    $scope.lan=LanguageService;
}]);
