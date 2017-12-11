"user strict"

angular.module("playchat").controller("DialogGraphUsageAnalysisController", ['$scope', '$http', '$cookies', '$resource', 'DateRangePickerService', 'LanguageService', 'ExcelDownloadService',function ($scope, $http, $cookies, $resource, DateRangePickerService, LanguageService, ExcelDownloadService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Dialog Graph Usage'), '/modules/playchat/gnb/client/imgs/graphusage.png');

    //서비스 선언
    var DialogGraphUsageService = $resource('/api/:botId/analysis/dialog-graph-usage', { botId: '@botId' });

    $scope.$parent.loaded('working-ground');

    var chatbot = $cookies.getObject('chatbot');

    $scope.date = {};

    var excelData = undefined;

    (function()
    {
        var indexing = function (senario, depth, index) {
            var newDepth;
            newDepth = depth + "-" + index;
            $scope.senarioIndex[senario.name] = newDepth;
            if(senario.children){
                senario.children.forEach(function (child, index) {
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
                $scope.senarioIndex = {};
                $scope.senarioUsageList = [];

                var botSenario = doc.botSenario;

                var depth = "1";
                for(var i = 0; i < botSenario.length; i++)
                {
                    if(!botSenario[i].name)
                    {
                        continue;
                    }
                    else
                    {
                        $scope.senarioIndex[botSenario[i].name] = depth + "-0";
                    }

                    if(botSenario[i].children)
                    {
                        botSenario[i].children.forEach(function (child, index)
                        {
                            index++;
                            index = index.toString();
                            indexing(child, depth, index)
                        });
                    }

                    depth = parseInt(depth) + 1;
                    depth = depth.toString();
                }

                doc.senarioUsage.forEach(function (_doc)
                {
                    if($scope.senarioIndex[_doc._id.dialogName])
                    {
                        var prefix = "";
                        for(var i = 0; i < $scope.senarioIndex[_doc._id.dialogName].split('-')[0].length-1; i++)
                        {
                            prefix = prefix + "a"
                        }

                        _doc['index'] = $scope.senarioIndex[_doc._id.dialogName];
                        _doc['order'] = prefix + $scope.senarioIndex[_doc._id.dialogName];

                        delete $scope.senarioIndex[_doc._id.dialogName]
                    }
                });

                if($scope.senarioIndex)
                {
                    Object.keys($scope.senarioIndex).forEach(function (key)
                    {
                        var prefix = "";
                        for(var i = 0; i < $scope.senarioIndex[key].split('-')[0].length-1; i++)
                        {
                            prefix = prefix + "a"
                        }

                        var obj = {_id: {dialogName: ""}, order:"", index: "", facebook: 0, kakao: 0, navertalk: 0, total: 0};
                        obj._id.dialogName = key;
                        obj.order = $scope.senarioIndex[key];
                        obj.index = prefix + $scope.senarioIndex[key];
                        $scope.senarioUsageList.push(obj);
                    })
                }

                var result = [];
                result.push.apply($scope.senarioUsageList, doc.senarioUsage);

                var max = 0;
                for(var i=0; i<$scope.senarioUsageList.length; i++)
                {
                    if(max < $scope.senarioUsageList[i].total)
                        max = $scope.senarioUsageList[i].total;
                }

                for(var i=0; i<$scope.senarioUsageList.length; i++)
                {
                    $scope.senarioUsageList[i].percent = Math.round(($scope.senarioUsageList[i].total / max) * 100);
                }

                $scope.list = $scope.senarioUsageList;


                excelData = [];
                for(var i=0; i<$scope.senarioUsageList.length; i++)
                {
                    excelData.push({ name: $scope.senarioUsageList[i]._id.dialogName, index: $scope.senarioUsageList[i].index, count: $scope.senarioUsageList[i].total })
                }
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.exelDownload = function()
        {
            var template = {
                sheetName: LanguageService('Dialog Graph Usage'),
                columnOrder: ['index', 'name', 'count'],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.id, LanguageService('Dialog Graph Usage'), $scope.date, template);
        };
    })();

    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();

    $scope.lan=LanguageService;
}]);
