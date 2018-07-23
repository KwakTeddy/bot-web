angular.module('playchat').controller('BizDialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', '$rootScope', 'BizChatService', 'LanguageService', function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, $rootScope, BizChatService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > ' + LanguageService('Biz Dialog Graph'), '/modules/playchat/gnb/client/imgs/scenario.png');
    $scope.bots = [
        {id:'survey',name:"설문 조사 봇"},
        {id:'marketing',name:"마케팅 봇"},
        {id:'infomation',name:"정보 봇"}];


    //
    //$scope.myBotAuth = chatbot.myBotAuth;
    // close header area
    angular.element("#top-bar-container").css("position", "relative").css("top", "-63px");
    angular.element('#middle-container').css("top", "0px");
    $scope.Data = [];
    var _isUpdated = false;
    var _waitDataList = [];
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
        $scope.uploader = function(card){
            return BizChatService.setUploader(card);
        };

        $scope.initialize = function()
        {
            $scope.chatbot = $cookies.getObject('chatbot');

            BizChatService.onReady($scope.chatbot, function(bizchat){
                $scope.Data = bizchat;
                bizchat_s = bizchat;
                $scope.addCardSentence = bizchat.defaultSentences[2];
                angular.element('.log-analysis').css('display', 'none');

                $scope.saveState = 'ready';
            });
        };

        $scope.getCardType = function(id){
            var ds = $scope.Data.defaultSentences.find(function(e){
                return id.indexOf(e._id) >= 0
            });

            return ds;
        };


        //when bizbot select option changed
        $scope.bizbotSelectChange = function(customName){
            $scope.refresh(customName.id);
        };

        /*
        Sample structure
        <div ng-click="imageUpload($event);">
          <input tabindex="-1" type="file" nv-file-select uploader="uploader" data-index="{{ $index }}">
        </div>
         */

        $scope.clickToImageFile = function(e)
        {
            var imageFile = angular.element(e.currentTarget.parentElement).find('input[type="file"]')

            $timeout(function()
            {
                imageFile.click();
            });
        };

        $scope.getNextInputList = function(index)
        {
            //$scope.customs.push($scope.Data.bizchatId);
            // sample bot data
            var lst = $scope.Data.cardArr.filter(function(e){return e.index > index});
            return lst
        };


        $scope.getValueString = function(val){
            var str = '';
            val.forEach(function(e){

            })
        }

        $scope.test = function(a){
            console.log(a)
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

        $scope.addNlp = function(me){
            BizChatService.addNlp(me.text,(nlp) => {
                me.nlp = nlp
            });
        };

        $scope.addCard = function(me){
            BizChatService.addCard(me,function(card){
                if(!card){
                    alert('빈 내용은 추가할 수 없습니다.');
                    return null;
                }

                card = card.data;

                var item = {
                    id: card.id,
                    botId : card.botId,
                    index: card.index,
                    message: card.message,
                    name: card.name,
                    type: card.type
                };
                card.connect != undefined ? item.connect = card.connect : null;
                card.input? item.input = card.input : null;
                card.output? item.output = card.output : null;

                $scope.Data.cardArr.push(item);
                $scope.Data.defaultSentences[2].message = '';
                $scope.addCardSentence = $scope.Data.defaultSentences[2];

            })
        };

        $scope.selectCard = function(card){
            card.botId = $scope.chatbot.id;

            if(card.name=='선택형'){
                card.connect = false;
            }else if(card.connect != undefined){
                delete card.connect;
            }
        };

        $scope.addudtList = function(card){
            var lst = _waitDataList.find((e) => {return e == card.id});
            if(!lst || lst.length < 1){
                _waitDataList.push(card.id);
            }
        };

        $scope.update = function(cb){
            var _udtCnt = _waitDataList.length;
            var connectType = $scope.Data.defaultSentences.find((a) => {return a.name == '선택형'});
            var imageType = $scope.Data.defaultSentences.find((a) => {return a.name == '이미지형'});
            $scope.Data.cardArr.forEach((e) => {
                if(e.type != connectType._id){
                     delete e.connect;
                }

                if(e.type != imageType._id){
                    e.output && e.output.image ? delete e.output.image : null;
                }
            });
            if(_udtCnt > 0){
                _waitDataList.forEach((e) => {
                    var card = $scope.Data.cardArr.find((q)=>{return e == q.id});
                    BizChatService.updateCard(card,(er)=> {
                        _udtCnt = _udtCnt - 1;
                        if(_udtCnt == 0){
                            _waitDataList = [];
                            if(cb && typeof cb == 'function'){
                                cb();
                            }
                        }
                    })
                })
            }else if(_isUpdated){
                var ln = $scope.Data.cardArr.length;
                $scope.Data.cardArr.forEach((e) => {
                    BizChatService.updateCard(e,(er)=>{
                        ln --;
                        if(ln == 0){
                            _isUpdated = false;
                            if(cb && typeof cb == 'function'){
                                cb();
                            }
                        }
                    })
                })
            }else{
                if(cb && typeof cb == 'function'){
                    cb();
                }
            }
        };

        var moveTarget, changeTarget;

        dragStartHandler = function(e){
            e.dataTransfer.dropEffect = "move";
            try{
                var data = JSON.parse(e.target.dataset.value);
            }catch(e){
                return null;
            }
            moveTarget = function(){
                return {id:data.id,index:data.index};
            };

        };

        dragover_handler = function(ev) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move"
        };

        drop_handler = function(e) {
            try{
                var data = JSON.parse(e.target.dataset.value);
            }catch(e){
                return null;
            }

            changeTarget = function(){
                return {id:data.id,index:data.index};
            };

            $timeout(()=>{
                var m = moveTarget();
                var c = changeTarget();
                $scope.Data.cardArr.forEach((e) => {
                    if(e.id==m.id){
                        e.index = c.index;
                    }else if(e.id==c.id){
                        e.index = m.index;
                    }
                });

                $scope.Data.cardArr.sort(e.index);

                console.log($scope.Data.cardArr)
            })
        };

        $scope.save = function(){
            $scope.update(function(){
                BizChatService.saveGraph($scope.Data.cardArr,function(err){
                    $rootScope.$broadcast('simulator-build');
                })
            });
        };

        $scope.deleteCard = function(me){
            _waitDataList = _waitDataList.filter((e) => {return e.id != me.id});
            $scope.Data.cardArr = $scope.Data.cardArr.filter((e) => {return e.id != me.id});
            var i = 0;
            $scope.Data.cardArr.forEach((e)=>{
                delete e._id;
                e.index = i;
                i++;
            });

            BizChatService.deleteCard($scope.Data.cardArr,(rtn) => {
                if(!rtn){
                    console.log(rtn);
                }
            });
        };

        $scope.test = function(e){
            console.log(e)
        }

        $scope.getChildCards = function(arr){
            return arr.filter((e) => {return !e.parentId && e.id !== 'startDialog'})
        };

        $scope.refresh = function(bizchatId){
            BizChatService.bizchatId = bizchatId;
            $scope.initialize();
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
        }

        $scope.$watch('Data.cardArr', function(newVal) {
            _isUpdated = true;
        },true);

    })();
    $scope.initialize();
    $scope.lan=LanguageService;
}]);
var bizchat_s = null;
var dragStartHandler , dragover_handler, drop_handler;
