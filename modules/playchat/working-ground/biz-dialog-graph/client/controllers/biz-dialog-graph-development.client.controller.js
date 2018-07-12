angular.module('playchat').controller('BizDialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', '$rootScope', 'BizDialogGraph', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, $rootScope, BizDialogGraph, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > ' + LanguageService('Biz Dialog Graph'), '/modules/playchat/gnb/client/imgs/scenario.png');

    var FailedDialogService = $resource('/api/:botId/operation/failed-dialogs/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
    var DialogGraphsService = $resource('/api/:botId/biz-dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });
    var GraphFileService = $resource('/api/:botId/graphfiles/:fileName', { botId: '@botId', fileName: '@fileName' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.myBotAuth = chatbot.myBotAuth;

    $scope.fromFailedDialog = false;
    $scope.failedDialogSaved = false;
    $scope.focus = true;

    angular.element("#top-bar-container").css("position", "relative").css("top", "-63px");
    angular.element('#middle-container').css("top", "0px");

    (function()
    {
        $scope.$parent.loaded('working-ground');

        $scope.initialize = function()
        {
            $scope.compactMode = 'Compact';
            $scope.commonMode = 'Common';
            $scope.zoom = 1;
            $scope.searchedDialogs = [];
            $scope.searchedDialogFocus = 0;
            $scope.graphHistory = [];
            $scope.graphHistoryIndex = -1;
            $scope.isDirty = false;
            $scope.saveState = 'ready';
            $timeout(() => {
                angular.element('.log-analysis').css('display', 'none');
            },100);
        };

    })();
    $scope.initialize();
    $scope.lan=LanguageService;
}]);
