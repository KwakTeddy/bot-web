angular.module('playchat.working-ground').controller('DialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', 'Rayde', function ($window, $scope, $resource, $cookies, $location, Rayde)
{
    $scope.$parent.changeWorkingGroundName('Development > Dialog Graph');

    var DialogGraphsService = $resource('/api/:botId/dialoggraphs/:fileName', { botId: '@botId', fileName: '@fileName' });

    var chatbot = $cookies.getObject('chatbot');
    // var openDialogGraph = $cookies.getObject('openDialogGraph');
    
    var fileName = $location.search().fileName || 'default.graph.js';
    if(fileName === true)
        fileName = 'default.graph.js';

    $scope.currentTabName = fileName;

    Rayde.setDialogTemplate(angular.element('#dialogGraphTemplate').html());
    Rayde.setCanvas('#graphDialogCanvas');

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
                    var result = Rayde.load(data);
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
    })();

    $scope.getFileList();
    $scope.loadFile(fileName);
}]);
