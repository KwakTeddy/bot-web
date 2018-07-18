angular.module('playchat').controller('BizDialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', '$rootScope', 'BizChatService', 'LanguageService', function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, $rootScope, BizChatService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > ' + LanguageService('Biz Dialog Graph'), '/modules/playchat/gnb/client/imgs/scenario.png');

    $scope.bots = [
        {id:'survey',name:"설문 조사 봇"},
        {id:'marketing',name:"마케팅 봇"},
        {id:'infomation',name:"정보 봇"}];

    var chatbot = $cookies.getObject('chatbot');
    //
    //$scope.myBotAuth = chatbot.myBotAuth;
    console.log(chatbot)
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

    (function()
    {

        $scope.$parent.loaded('working-ground');

        // 나중에 HTML에 바인딩하면서
        BizChatService.template.card = angular.element('#cardTpl');
        BizChatService.template.input = angular.element('#inputTpl');
        BizChatService.template.output = angular.element('#outputTpl');
        $scope.uploader = BizChatService.setUploader();

        $scope.initialize = function(bizchatId)
        {
            bizchatId = bizchatId ? bizchatId : 'survey';

            BizChatService.onReady(bizchatId, function(bizchat){
                $scope.Data = bizchat;
                bizchat_s = bizchat;

                $scope.selectedMessageMenu = $scope.selectedMessageMenu? $scope.selectedMessageMenu :$scope.Data.defaultSentences[0];
                angular.element('.log-analysis').css('display', 'none');

                $scope.saveState = 'ready';
            });
        };

        $scope.getCardType = function(id){
            var ds = $scope.Data.dataset.find(function(e){
                return id.indexOf(e._id) >= 0
            });
            return ds;
        };


        //when bizbot select option changed
        $scope.bizbotSelectChange = function(customName){
            $scope.botData.name = customName.name;
            $scope.refresh(customName.id);
        };

        /*
        Sample structure
        <div ng-click="imageUpload($event);">
          <input tabindex="-1" type="file" nv-file-select uploader="uploader" data-index="{{ $index }}">
        </div>
         */
        $scope.imageUpload = function(e){
            var imageFile = angular.element(e.currentTarget).find('input[type="file"]');
            $timeout(function()
            {
                imageFile.click();
            });
        };

        $scope.getNextInputList = function(id)
        {
            //$scope.customs.push($scope.Data.bizchatId);
            // sample bot data
            var lst = $scope.Data.cardArr.filter(function(e){return e.parentId == id});
            return lst
        };


        $scope.getValueString = function(val){
            var str = '';
            val.forEach(function(e){

            })
        }

        $scope.test = function(){
            console.log($scope.Data.cardArr)
        }


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

        $scope.refresh = function(bizchatId){
            BizChatService.bizchatId = bizchatId;
            $scope.initialize(bizchatId);
        };

        var _templateSet = function(card,type){
            var id = '#'+type._id;
            var t  = angular.element(id).html();
            t = t.replace(/{id}/gi, card.id)
                .replace('{name}',card.name)
                .replace('{messageType}',type.name)
                .replace('{output}',card.output[0].text);

            return t;
        };

        $scope.cardUiSet = function(me){
            me.is_open = me.is_open ? false : true;

            console.log(me);
        }

    })();
    $scope.initialize();
    $scope.lan=LanguageService;
}]);
var bizchat_s = null;
