angular.module('playchat').controller('BizDialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', '$rootScope', 'BizDialogGraph', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, $rootScope, BizDialogGraph, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > ' + LanguageService('Biz Dialog Graph'), '/modules/playchat/gnb/client/imgs/scenario.png');

    var FailedDialogService = $resource('/api/:botId/operation/failed-dialogs/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
    var DialogGraphsService = $resource('/api/:botId/biz-dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });
    var GraphFileService = $resource('/api/:botId/graphfiles/:fileName', { botId: '@botId', fileName: '@fileName' });
    //
    var chatbot = $cookies.getObject('chatbot');
    //
    $scope.myBotAuth = chatbot.myBotAuth;
    //
    $scope.fromFailedDialog = false;
    $scope.failedDialogSaved = false;
    $scope.focus = true;

    angular.element("#top-bar-container").css("position", "relative").css("top", "-63px");
    angular.element('#middle-container').css("top", "0px");

    //// 실제 그래프 로직이 들어있는 서비스
    BizDialogGraph.isFocused = true;
    BizDialogGraph.setScope($compile, $scope, $rootScope);
    BizDialogGraph.setDialogTemplate(angular.element('#dialogGraphTemplate').html());
    BizDialogGraph.setMenu('.dialog-menu');
    BizDialogGraph.setDirtyCallback(function(dirty)
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


        $scope.loadFile = function(fileName)
        {
            angular.element('.graph-body').append('<div class="dialog-graph-error"><h1>Loading...</h1></div>');
            GraphFileService.get({ botId: chatbot.id, templateId: chatbot.templateId ? chatbot.templateId.id : '', fileName: fileName }, function(result)
            {
                angular.element('.graph-body .dialog-graph-error').remove();

                if(result && result.dialogs && result.commonDialogs)
                {
                    //최초 로딩한거 history에 넣어둠.
                    $scope.graphHistory.push(JSON.parse(JSON.stringify(result)));
                    $scope.graphHistoryIndex = $scope.graphHistory.length-1;

                    var result = BizDialogGraph.loadFromFile(result, fileName);


                    if(!result)
                    {
                        angular.element('.graph-body').append($compile('<div class="dialog-graph-error"><div><h1>' + $scope.lan('There is an error in the graph file or an unsupported version of the graph file.') + '</h1><button type="button" class="blue-button" ng-click="viewGraphSource();">' + $scope.lan('View Source') + '</button></div></div>')($scope));
                    }

                    $scope.checkFailedDialog();
                }
                else
                {
                    angular.element('.graph-body').append($compile('<div class="dialog-graph-error"><div><h1 style="line-height: 50px; margin-bottom: 20px;">' + $scope.lan('There is an unsupported version of the graph file. if you are using previous version, then please move below.') + '</h1><a style="font-size: 20px;" href="https://old.playchat.ai">https://old.playchat.ai</a></div></div>')($scope));
                }


            },
            function(err)
            {
                if(err.status == 404)
                {
                    angular.element('.graph-body').append('<div class="dialog-graph-error"><h1>' + $scope.lan('File not found') + '</h1></div>');
                }
            });
        };
    })();
    $scope.initialize();
    $scope.lan=LanguageService;
}]);
