angular.module('playchat').controller('BizDialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', '$rootScope', 'BizChat', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, $rootScope, BizChat, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > ' + LanguageService('Biz Dialog Graph'), '/modules/playchat/gnb/client/imgs/scenario.png');

    var chatbot = $cookies.getObject('chatbot');

    $scope.myBotAuth = chatbot.myBotAuth;

    // close header area
    angular.element("#top-bar-container").css("position", "relative").css("top", "-63px");
    angular.element('#middle-container').css("top", "0px");

    //var data = BizChat.getCompleteData();

    //BizChat.save({ data: data, botId: chatbot.id, templateId: (chatbot.templateId ? chatbot.templateId.id : ''), fileName: fileName }, function()
    //{
    //    $rootScope.$broadcast('simulator-build');
    //}, function(error)
    //{
    //    alert($scope.lan('저장 실패 : ') + error.message);
    //});


    (function()
    {
        $scope.$parent.loaded('working-ground');

        $scope.initialize = function()
        {
            $scope.searchedDialogs = [];
            $scope.searchedDialogFocus = 0;
            $scope.graphHistory = [];
            $scope.graphHistoryIndex = -1;
            $scope.isDirty = false;
            $scope.saveState = 'ready';
            BizChat.onReady(function(){
                console.log('Bizchat bot is placed successfully');
                console.log(BizChat);
                angular.element('.log-analysis').css('display', 'none');
            });
        };

    })();
    $scope.initialize();
    $scope.lan=LanguageService;
}]);
