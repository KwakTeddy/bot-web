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

    (function()
    {
        $scope.$parent.loaded('working-ground');

        $scope.getFileList = function()
        {
            DialogGraphsService.query({ botId: chatbot._id }, function(fileList)
            {
                $scope.fileList = fileList;
            },
            function(err)
            {
                console.error(err);
            });
        };

        $scope.selectTab = function(fileName)
        {
            angular.element('#' + fileName).addClass('select_tab');
        };

        $scope.loadFile = function(fileName)
        {
            DialogGraphsService.get({ botId: chatbot.id, fileName: fileName }, function(result)
            {
                var data = result.data;
                if(data)
                {
                    var result = DialogGraph.load(data);
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
    })();

    $scope.getFileList();
    $scope.loadFile(fileName);
}]);
