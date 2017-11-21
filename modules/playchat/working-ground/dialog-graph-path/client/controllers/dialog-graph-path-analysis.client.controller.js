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
        var getPath = function(map, source)
        {
            if(source._id.preDialogId)
            {
                console.log(source.dialogName);
                getPath(map, map[source._id.preDialogId]);
            }
        };

        $scope.getList = function()
        {
            DialogGraphPathService.query({ botId: chatbot.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(list)
            {
                console.log('리스트 : ', list);

                var dialogMap = {};
                for(var i=0; i<list.length; i++)
                {
                    var dialogId = list[i]._id.dialogId;
                    if(dialogId)
                    {
                        dialogMap[dialogId] = list[i];
                    }
                }

                for(var i=0; i<list.length; i++)
                {
                    var dialogId = list[i]._id.dialogId;
                    if(!dialogMap[dialogId].next)
                    {
                        dialogMap[dialogId].next = [];
                    }

                    dialogMap[dialogId].next.push(dialogId);
                }

                console.log(dialogMap);

                // var dialogMap = {};
                // for(var i=0; i<list.length; i++)
                // {
                //     if(list[i]._id.dialogId)
                //         dialogMap[list[i]._id.dialogId] = list[i];
                // }
                //
                // var start = [];
                // for(var i=0; i<list.length; i++)
                // {
                //     if(list[i]._id.preDialogId)
                //     {
                //         if(!dialogMap[list[i]._id.preDialogId].next)
                //         {
                //             dialogMap[list[i]._id.preDialogId].next = [];
                //         }
                //
                //         dialogMap[list[i]._id.preDialogId].next.push(list[i]);
                //     }
                //     else
                //     {
                //         start.push(list[i]);
                //     }
                // }
                //
                // console.log(list);

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
