angular.module('playchat.working-ground').controller('DialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService', function ($window, $scope, $resource, $cookies, $location, FileUploader, ModalService, TabService, FormService, PagingService)
{
    $scope.$parent.changeWorkingGroundName('Development > Dialog Graph');

    var DialogGraphsService = $resource('/api/:botId/dialoggraphs', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');
    // var openDialogGraph = $cookies.getObject('openDialogGraph');
    
    var fileName = $location.search().fileName || 'default.graph.js';
    if(fileName === true)
        fileName = 'default.graph.js';

    $scope.currentTabName = fileName;

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
    })();

    $scope.getFileList();
}]);
