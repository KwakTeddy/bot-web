"user strict"

angular.module("playchat").controller("DialogGraphUsageAnalysisController", ['$scope', '$http', '$cookies', '$resource', 'DateRangePickerService', function ($scope, $http, $cookies, $resource, DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName('Analysis > Dialog Graph Usage');

    //서비스 선언
    var DialogGraphUsageService = $resource('/api/:botId/analysis/dialog-graph-usage', { botId: '@botId' });

    $scope.$parent.loaded('working-ground');

    var chatbot = $cookies.getObject('chatbot');

    $scope.date = {};


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
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.excelDownload = function()
        {
            var startYear =  $scope.date.start.getFullYear();
            var startMonth = $scope.date.start.getMonth() + 1;
            var startDay =   $scope.date.start.getDate();
            var endYear =  $scope.date.end.getFullYear();
            var endMonth = $scope.date.end.getMonth() + 1;
            var endDay =   $scope.date.end.getDate();
            var date = {
                start: startYear + "/" + startMonth + "/" + startDay,
                end: endYear + "/" + endMonth + "/" + endDay
            };

            $http.post('/api/analytics/statistics/senario/exel-download/' + chatbot.id, {date: date}).then(function (doc)
            {
                var fileName = $cookies.get("default_bot") + '_' + "시나리오 사용 통계" + '_' + startYear + '-' + startMonth + '-' + startDay + '~' + endYear + '-' + endMonth + '-' + endDay + '_' + '.xlsx';
                function s2ab(s)
                {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }

                saveAs(new Blob([s2ab(doc.data)],{type:"application/octet-stream"}), fileName);
            },
            function (err)
            {
                alert('error: ' + JSON.stringify(err));
            });
        };
    })();

    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
}]);
