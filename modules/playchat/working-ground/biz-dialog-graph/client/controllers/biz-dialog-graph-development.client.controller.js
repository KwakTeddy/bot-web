angular.module('playchat').controller('BizDialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', '$rootScope', 'BizChatService', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, $rootScope, BizChatService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > ' + LanguageService('Biz Dialog Graph'), '/modules/playchat/gnb/client/imgs/scenario.png');
    console.log('!!!!!!!!!!!!!!!!');
    var chatbot = $cookies.getObject('chatbot');
    //
    //$scope.myBotAuth = chatbot.myBotAuth;

    // close header area
    angular.element("#top-bar-container").css("position", "relative").css("top", "-63px");
    angular.element('#middle-container').css("top", "0px");
    $scope.Data = [];
    $scope.botData = {};
    //var data = BizChat.getCompleteData();

    //BizChat.save({ data: data, botId: chatbot.id, templateId: (chatbot.templateId ? chatbot.templateId.id : ''), fileName: fileName }, function()
    //{
    //    $rootScope.$broadcast('simulator-build');
    //}, function(error)
    //{
    //    alert($scope.lan('저장 실패 : ') + error.message);
    //});

    var CustomTypeService = $resource('/api/script/:type/:name', { type: '@type', name: '@name' }, { update: { method: 'PUT' } });

    var SentencesService = $resource('/api/:type/biz-sentences/:bizchatId', { type:'@type', bizchatId: '@bizchatId' });

    (function()
    {


        //when bizbot select option changed
        $scope.bizbotSelectChange = function(customName){
            $scope.botData.name = customName;
            // getCustomsDetail($scope.customData);
        };


        $scope.$parent.loaded('working-ground');

        // 나중에 HTML에 바인딩하면서
        BizChatService.template.card = angular.element('#cardTpl');
        BizChatService.template.input = angular.element('#inputTpl');
        BizChatService.template.output = angular.element('#outputTpl');

        $scope.initialize = function()
        {
            BizChatService.onReady(function(bizchat){

                bizchat_s = bizchat;
                $scope.Data = bizchat;
                console.log('$scope.Data:');
                console.log($scope.Data);

                $scope.dialogs = bizchat.dialogs;
                $scope.commonDialogs = bizchat.commonDialogs;
                $scope.tasks = bizchat.tasks;
                $scope.types = bizchat.types;
                $scope.scripts = bizchat.scripts;
                $scope.addOn = bizchat.addOn;

                $scope.sentences = bizchat.sentences;

                console.log($scope.sentences);
                // template set


                angular.element('.log-analysis').css('display', 'none');

                $scope.saveState = 'ready';
                $scope.getList();

            });
        };

        $scope.getList = function()
        {
            // $scope.customs = ["설문 조사 봇", "마케팅 봇","정보 봇"];
            $scope.customs = [];
            // for(var i=0; i<$scope.Data.dataset.length; i++){
            //     if($scope.customs.indexOf($scope.Data.dataset[i].templateId) === -1){
            //         $scope.customs.push($scope.Data.dataset[i].templateId);
            //     }
            // }
            $scope.customs.push($scope.Data.bizchatId);
            $scope.selectedCustom = $scope.customs[0];

            $scope.menus = ['메세지 추가하기'];
                for(var j=0; j<$scope.Data.dataset.length; j++){
                    if($scope.Data.dataset[j].templateId === $scope.selectedCustom){
                        $scope.menus.push($scope.Data.dataset[j].name);
                    }
                }
            $scope.selectedMenu = $scope.menus[0];
            $scope.botData.sentencesNumber = $scope.Data.sentences.length;

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
var bizchat_s = null;
