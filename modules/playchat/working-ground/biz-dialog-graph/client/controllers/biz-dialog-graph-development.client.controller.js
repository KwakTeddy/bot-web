angular.module('playchat').controller('BizDialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', '$rootScope', 'BizChatService', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, $rootScope, BizChatService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > ' + LanguageService('Biz Dialog Graph'), '/modules/playchat/gnb/client/imgs/scenario.png');

    //var chatbot = $cookies.getObject('chatbot');
    //
    //$scope.myBotAuth = chatbot.myBotAuth;

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

        // 나중에 HTML에 바인딩하면서
        BizChatService.template.card = angular.element('#cardTpl');
        BizChatService.template.input = angular.element('#inputTpl');
        BizChatService.template.output = angular.element('#outputTpl');

        $scope.initialize = function()
        {
            BizChatService.onReady(function(bizchat){
                aaaaa = bizchat;
                $scope.dialogs = bizchat.dialogs;
                $scope.commonDialogs = bizchat.commonDialogs;
                $scope.tasks = bizchat.tasks;
                $scope.types = bizchat.types;
                $scope.scripts = bizchat.scripts;
                $scope.addOn = bizchat.addOn;

                $scope.sentences = bizchat.sentences;

                // template set


                angular.element('.log-analysis').css('display', 'none');

                $scope.saveState = 'ready';
            });
        };



        $scope.appendGrid = function(dialog){
            $scope.addCard(dialog);

            if(dialog.children.length > 0){
                var child = dialog.children;
                for(var c in child){
                    $scope.appendGrid(c);
                }
            }
        };

        $scope.addCard = function(dialog){
            var tpl = BizChatService.makeCard(dialog);

            angular.element('#cardArea').append(tpl);
        };

    })();
    $scope.initialize();
    $scope.lan=LanguageService;
}]);
var aaaaa = null;
