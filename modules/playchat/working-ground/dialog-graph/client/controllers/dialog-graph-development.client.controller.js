angular.module('playchat').controller('DialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', 'DialogGraph', 'DialogGraphEditor', function ($window, $scope, $resource, $cookies, $location, $compile, DialogGraph, DialogGraphEditor)
{
    $scope.$parent.changeWorkingGroundName('Development > Dialog Graph');

    var DialogGraphsService = $resource('/api/:botId/dialoggraphs/:fileName', { botId: '@botId', fileName: '@fileName' });

    var chatbot = $cookies.getObject('chatbot');
    // var openDialogGraph = $cookies.getObject('openDialogGraph');
    
    var fileName = $location.search().fileName || 'default.graph.js';

    $scope.currentTabName = fileName;

    // 실제 그래프 로직이 들어있는 서비스
    DialogGraph.setScope($compile, $scope);
    DialogGraph.setDialogTemplate(angular.element('#dialogGraphTemplate').html());
    DialogGraph.setCanvas('#graphDialogCanvas');
    DialogGraph.setMenu('.dialog-menu');
    DialogGraph.setEditor(DialogGraphEditor);
    DialogGraph.setDirtyCallback(function(dirty)
    {
        if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest' )
        {
            $scope.isDirty = dirty;
        }
        else
        {
            $scope.$apply(function()
            {
                $scope.isDirty = dirty;
            })
        }
    });

    (function()
    {
        $scope.$parent.loaded('working-ground');

        $scope.initialize = function()
        {
            $scope.compactMode = 'Compact';
            $scope.zoom = 1;
            $scope.searchedDialogs = [];
            $scope.searchedDialogFocus = 0;
            $scope.graphHistory = [];
            $scope.graphHistoryIndex = -1;
            $scope.isDirty = false;
        };

        $scope.getFileList = function()
        {
            DialogGraphsService.query({ botId: chatbot.id }, function(fileList)
            {
                $scope.fileList = fileList;
            },
            function(err)
            {
                console.error(err);
            });
        };

        $scope.prevTab = function(e)
        {
            var tabBody = e.currentTarget.nextElementSibling;
            tabBody.scrollLeft -= 100;
        };

        $scope.nextTab = function(e)
        {
            var tabBody = e.currentTarget.previousElementSibling;
            tabBody.scrollLeft += 100;
        };

        $scope.selectTab = function(e, fileName)
        {
            angular.element('.tab-body .select_tab').removeClass('select_tab');
            angular.element(e.currentTarget).addClass('select_tab');

            if(fileName.endsWith('.graph.js'))
            {
                $location.search().fileName = fileName;
                $scope.loadFile(fileName);
            }
            else
            {
                alert('소스코드편집기 준비중!');
            }
        };

        $scope.loadFile = function(fileName)
        {
            $scope.initialize();

            DialogGraphsService.get({ botId: chatbot.id, fileName: fileName }, function(result)
            {
                var data = result.data;
                if(data)
                {
                    //최초 로딩한거 history에 넣어둠.
                    $scope.graphHistory.push(data);
                    $scope.graphHistoryIndex = $scope.graphHistory.length-1;

                    var result = DialogGraph.loadFromFile(data, fileName);
                    if(!result)
                    {
                        angular.element('.graph-body').html('<div class="dialog-graph-error"><h1>그래프 로드 실패</h1></div>');
                    }
                }
            },
            function(err)
            {
                if(err.status == 404)
                {
                    angular.element('.graph-body').html('<div class="dialog-graph-error"><h1>파일을 찾을 수 없습니다</h1></div>');
                }
            });
        };

        $scope.toggleChild = function(e)
        {
            if(e.currentTarget.className.indexOf('folded') != -1)
            {
                e.currentTarget.className = 'graph-fold';
            }
            else
            {
                e.currentTarget.className = 'graph-fold folded';
            }

            var target = e.currentTarget.parentElement.nextElementSibling;
            DialogGraph.toggleChild(target);
        };

        $scope.toggleCompactMode = function()
        {
            if($scope.compactMode == 'Detail')
            {
                // to Detail
                $scope.compactMode = 'Compact';

                angular.element('.graph-dialog-input').show();
                angular.element('.graph-dialog-output').show();
                angular.element('.graph-dialog-buttons').show();
            }
            else
            {
                // to Compact
                $scope.compactMode = 'Detail';

                angular.element('.graph-dialog-input').hide();
                angular.element('.graph-dialog-output').hide();
                angular.element('.graph-dialog-buttons').hide();
            }

            DialogGraph.refreshButtonsPosition();
            DialogGraph.refreshLine();
        };

        $scope.zoomIn = function()
        {
            $scope.zoom += 0.1;
            angular.element('#graphDialogCanvas').css('zoom', $scope.zoom);
            if($scope.zoom >= 1)
            {
                angular.element('svg line').attr('shape-rendering', 'crispEdges');
            }
        };

        $scope.zoomOut = function()
        {
            $scope.zoom -= 0.1;
            angular.element('#graphDialogCanvas').css('zoom', $scope.zoom);

            if($scope.zoom < 1)
            {
                // 1 이하로 줌이 내려가면 line이 사라지는 현상 해결용 코드
                angular.element('svg line').attr('shape-rendering', 'geometricPrecision');
            }
        };

        window.addEventListener('wheel', function(e)
        {
            if(e.ctrlKey || e.metaKey)
            {
                if(e.deltaY > 0)
                {
                    $scope.zoomIn();
                }
                else
                {
                    $scope.zoomOut();
                }
            }
        });

        $scope.searchDialog = function(e)
        {
            var value = e.currentTarget.value;

            if(e.keyCode == 13)
            {
                if(value)
                {
                    if($scope.searchedDialogs.length == 0)
                    {
                        $scope.searchedDialogs = angular.element("#graphDialogCanvas .graph-dialog-header > span:contains('" + value + "')").parent().parent();
                        $scope.searchedDialogFocus = 0;
                    }
                    else
                    {
                        if($scope.searchedDialogs.length-1 == $scope.searchedDialogFocus)
                        {
                            $scope.searchedDialogFocus = 0;
                        }
                        else
                        {
                            $scope.searchedDialogFocus++;
                        }
                    }

                    DialogGraph.focus($scope.searchedDialogs[$scope.searchedDialogFocus]);
                }

                e.preventDefault();
            }

            if(!value)
            {
                $scope.searchedDialogs = [];
            }
        };

        $scope.save = function()
        {
            var data = DialogGraph.getCompleteData();

            console.log('데이터 : ', data);
            var fileName = $location.search().fileName || 'default.graph.js';
            DialogGraphsService.save({ data: data, botId: chatbot.id, fileName: fileName }, function()
            {
                //저장할때마다 history 업데이트
                $scope.graphHistory.splice($scope.graphHistoryIndex + 1, $scope.graphHistory.length - $scope.graphHistoryIndex - 1);

                $scope.graphHistory.push(data);
                $scope.graphHistoryIndex = $scope.graphHistory.length-1;

                DialogGraph.setDirty(false);
            }, function(error)
            {
                alert('저장 실패 : ' + error.message);
            });
        };

        $scope.undo = function()
        {
            if($scope.graphHistoryIndex <= 0)
            {
                return;
            }

            var data = $scope.graphHistory[--$scope.graphHistoryIndex];
            var result = DialogGraph.loadFromFile(data);
            if(!result)
            {
                angular.element('.graph-body').html('<div class="dialog-graph-error"><h1>그래프 로드 실패</h1></div>');
            }

            DialogGraph.setDirty(true);
        };

        $scope.redo = function()
        {
            if($scope.graphHistoryIndex == $scope.graphHistory.length-1)
            {
                return;
            }

            var data = $scope.graphHistory[++$scope.graphHistoryIndex];
            var result = DialogGraph.loadFromFile(data);
            if(!result)
            {
                angular.element('.graph-body').html('<div class="dialog-graph-error"><h1>그래프 로드 실패</h1></div>');
            }

            if($scope.graphHistoryIndex == $scope.graphHistory.length-1)
            {
                //리두 하고 나서 history의 마지막 데이터가 되면 저장할 필요 없어짐. 왜냐 마지막 세이브 이후 다시 저장하지 않는한 history의 마지막 데이터가 최신이다.
                DialogGraph.setDirty(false);
            }
            else
            {
                DialogGraph.setDirty(true);
            }
        };
    })();

    $scope.initialize();
    $scope.getFileList();
    $scope.loadFile(fileName);
}]);