"user strict"

angular.module("playchat").controller("DialogGraphPathAnalysisController", ['$scope', '$http', '$cookies', '$resource', 'DateRangePickerService', function ($scope, $http, $cookies, $resource, DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName('Analysis > Dialog Graph Path');

    //서비스 선언
    var DialogGraphPathService = $resource('/api/:botId/analysis/dialog-graph-path', {botId: '@botId'});

    var chatbot = $cookies.getObject('chatbot');

    $scope.date = {};

    (function()
    {
        var getPath = function(list, item)
        {
            // item이 preDialogId가 없을때까지 recursive 돌아서 string으로 된 path를 만들고 그 값으로 list를 넣는다.

            if(item.preDialogId && item.dialogId != item.preDialogId)
            {
                for(var i=0; i<list.length; i++)
                {
                    if(item != list[i] && list[i].userId == item.userId && list[i].dialogId == item.preDialogId && new Date(item.created).getTime() > new Date(list[i].created).getTime())
                    {
                        // 이전 다이얼로그를 찾았다.
                        return getPath(list, list[i]) + '-' + item.dialogName;
                    }
                }
            }

            return item.dialogName;
        };

        $scope.getList = function()
        {
            DialogGraphPathService.query({ botId: chatbot.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(list)
            {
                var dialogMap = {};
                for(var i=0; i<list.length; i++)
                {
                    var path = getPath(list,  list[i]);
                    if(!dialogMap.hasOwnProperty(path))
                    {
                        dialogMap[path] = 1;
                    }
                    else
                    {
                        dialogMap[path]++;
                    }
                }

                $scope.paths = [];
                for(var key in dialogMap)
                {
                    var list = [];
                    var count = dialogMap[key];

                    $scope.paths.push({ list: key.split('-'), count: count });
                }

                $scope.$parent.loaded('working-ground');
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };
    })();

    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
}]);
