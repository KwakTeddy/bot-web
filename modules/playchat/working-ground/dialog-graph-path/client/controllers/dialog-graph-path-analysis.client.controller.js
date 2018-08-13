"user strict"

angular.module("playchat").controller("DialogGraphPathAnalysisController", ['$scope', '$http', '$cookies', '$resource', 'DateRangePickerService','LanguageService', 'ExcelDownloadService', function ($scope, $http, $cookies, $resource, DateRangePickerService, LanguageService, ExcelDownloadService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Dialog Graph Path'), '/modules/playchat/gnb/client/imgs/path.png');

    //서비스 선언
    var DialogGraphPathService = $resource('/api/:botId/analysis/dialog-graph-path', {botId: '@botId'});

    var chatbot = $cookies.getObject('chatbot');

    $scope.date = {};

    var excelData = undefined;

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

        var createLine = function(x1, y1, x2, y2)
        {
            var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#b1dbf4');
            line.setAttribute('stroke-width', '1px');
            line.setAttribute('shape-rendering', 'crispEdges');

            return line;
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

                excelData = [];
                $scope.paths = [];
                for(var key in dialogMap)
                {
                    var count = dialogMap[key];
                    $scope.paths.push({ list: key.split('-'), count: count });
                    excelData.push({ count: count, path: key });
                }

                setTimeout(function()
                {
                    var svg = angular.element('#lineSvg');
                    angular.element('.dialog-graph-path-card').each(function()
                    {
                        var left = this.offsetLeft;
                        var top = this.offsetTop;

                        var halfOfHeight = this.offsetHeight / 2;

                        var prev = this.previousElementSibling;
                        if(prev)
                        {
                            var prevLeft = prev.offsetLeft;
                            var prevRight = prev.offsetLeft + prev.offsetWidth;
                            var prevTop = prev.offsetTop;
                            var prevHalfOfHeight = prev.offsetHeight / 2;

                            if(prevRight < left)
                            {
                                svg.append(createLine(prevRight, prevTop + prevHalfOfHeight, left, top + halfOfHeight));
                            }
                            else if(prevTop + prevHalfOfHeight < top + halfOfHeight)
                            {
                                var halfOfWidth = this.offsetWidth / 2;

                                var prevBottom = prev.offsetTop + prev.offsetHeight;
                                var prevHalfOfWidth = prev.offsetWidth / 2;

                                svg.append(createLine(prevLeft + prevHalfOfWidth, prevBottom, prevLeft + prevHalfOfWidth, prevBottom + 10));
                                svg.append(createLine(left + halfOfWidth, top - 10, prevLeft + prevHalfOfWidth, prevBottom + 10));
                                svg.append(createLine(left + halfOfWidth, top - 10, left + halfOfWidth, top));
                            }
                        }
                    });
                }, 100);

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
                sheetName: LanguageService('Dialog Graph Path'),
                columnOrder: ['count', 'path'],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.name, LanguageService('Dialog Graph Path'), $scope.date, template);
        };
    })();

    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();

    $scope.lan=LanguageService;
}]);
