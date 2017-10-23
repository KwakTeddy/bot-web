angular.module('playchat.working-ground').controller('DialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', 'DialogGraph', 'DialogGraphEditor', function ($window, $scope, $resource, $cookies, $location, $compile, DialogGraph, DialogGraphEditor)
{
    $scope.$parent.changeWorkingGroundName('Development > Dialog Graph');

    var DialogGraphsService = $resource('/api/:botId/dialoggraphs/:fileName', { botId: '@botId', fileName: '@fileName' });

    var chatbot = $cookies.getObject('chatbot');
    // var openDialogGraph = $cookies.getObject('openDialogGraph');
    
    var fileName = $location.search().fileName || 'default.graph.js';
    if(fileName === true)
        fileName = 'default.graph.js';

    $scope.currentTabName = fileName;

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
                        alert('로드실패');
                    }
                }
            },
            function(err)
            {
                console.log('에러 : ', err);
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
