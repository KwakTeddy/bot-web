angular.module('playchat').controller('BizDialogGraphDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', '$rootScope', 'BizChatService', 'LanguageService', function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, $rootScope, BizChatService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > ' + LanguageService('Biz Dialog Graph'), '/modules/playchat/gnb/client/imgs/scenario.png');

    $scope.Data = [];

    var _isUpdated = false;
    var _waitDataList = [];

    // Drag & Drop event setting
    DRAG = {
        moveTarget : undefined,
        changeTarget : undefined,
        dragStartHandler : (e) => {
            e.dataTransfer.dropEffect = "move";
            try{
                var data = JSON.parse(e.target.dataset.value);
            }catch(e){
                return null;
            }
            DRAG.moveTarget = () => {
                return {id:data.id,index:data.index};
            };

        },
        dragover_handler : (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move"
        },
        drop_handler : (e) => {
            try{
                var data = JSON.parse(e.target.dataset.value);
            }catch(e){
                return null;
            }

            DRAG.changeTarget = function(){
                return {id:data.id,index:data.index};
            };

            $timeout(()=>{
                try{
                    var m = DRAG.moveTarget();
                    var c = DRAG.changeTarget();

                    $scope.Data.cardArr.forEach((e) => {
                        if(e.id==m.id){
                            e.index = c.index;
                        }else if(e.id==c.id){
                            e.index = m.index;
                        }
                    });

                    $scope.Data.cardArr.sort(e.index);
                }catch(e){
                    console.log(e);
                    pass();
                }
            })
        }
    };

    $scope.uploader = function(card){
        return BizChatService.setUploader(card);
    };

    $scope.deleteImg = (card) => {
        delete card.image
    };

    $scope.getCardType = function(id){
        var ds = $scope.Data.defaultSentences.find((e) => {
            return id.indexOf(e._id) >= 0
        });

        return ds;
    };

    //It will be updated later
    $scope.bizbotSelectChange = function(customName){
        $scope.refresh(customName.id);
    };

    $scope.clickToImageFile = function(e)
    {
        var imageFile = angular.element(e.currentTarget.parentElement).find('input[type="file"]');
        $timeout(() => { imageFile.click(); });
    };

    $scope.test = function(a){
        _isUpdated = true;
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

            var item = {};
            angular.copy(card,item);

            card.connect != undefined ? item.connect = card.connect : null;
            card.input? item.input = card.input : null;
            card.output? item.output = card.output : null;

            $scope.Data.cardArr.push(item);
            $scope.Data.defaultSentences[2].message = '';

            angular.copy($scope.Data.defaultSentences[2], $scope.addCardSentence);
            $scope.addCardSentence.type = $scope.Data.defaultSentences[2]._id;

            var _isUpdated = true;
        })
    };

    $scope.addInput = function(card,what){
        if(what){
            card.input.push({text:card.input.length+1})
        }else{
            card.input.pop()
        }
    };

    $scope.addudtList = function(card){
        var lst = _waitDataList.find((e) => {return e == card.id});
        if(!lst || lst.length < 1){
            _waitDataList.push(card.id);
        }
    };

    // DB update logic
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
                        _isUpdated = false;
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
                    ln = ln - 1;
                    if(ln == 0){
                        _isUpdated = false;
                        _waitDataList = [];
                        if(cb && typeof cb == 'function'){
                            cb();
                        }
                    }
                })
            })
        }else{
            if(cb && typeof cb == 'function'){
                _isUpdated = false;
                _waitDataList = [];
                cb();
            }
        }
    };

    $scope.save = function(){
        if(_isUpdated){
            $scope.update(function(){
                BizChatService.saveGraph($scope.Data.cardArr,function(err){
                    $rootScope.$broadcast('simulator-build');
                })
            });
        }
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

    $scope.setDefaultValue = function(card, typeNm){
        if(!typeNm){
            typeNm = $scope.getCardType(card.type).name
        }else{
            card.name = typeNm;
        }
        if(card.input && card.input.length > 0){card.input.forEach((e)=>{delete e.target});}
        switch(typeNm){
            case '단답형' :
            case '일반형' :
            case '연락처수집형' :
            case '날짜수집형' :
                delete card.connect;
                delete card.output;
                break;
            case '정보형' :
                delete card.connect;
                card.output = {url:''};
                break;
            case '이미지형' :
                delete card.connect;
                card.output = {image:''};
                break;
            case '선택형' :
                delete card.output;
                delete card.target;
                card.connect == undefined ? card.connect = false : null;
                if(!card.input || card.input.length < 2){
                    card.input = $scope.Data.defaultSentences.find((e) => {return e.name == typeNm}).input;
                }
                break;
        }
    };

    $scope.refresh = function(bizchatId){
        BizChatService.bizchatId = bizchatId;
        $scope.initialize();
    };

    $scope.cardUiSet = function(me){
        me.is_open = me.is_open ? false : true;
    };

    $scope.autoSaveTrigger = () => {
        _isUpdated = true;
    };

    $scope.initialize = function()
    {
        BizChatService.chatbot = $cookies.getObject('chatbot');
        if(!BizChatService.chatbot){
            alert('봇이 선택되지 않았습니다.\n봇을 선택한 후 진행해 주세요.');
            $location.url('/playchat/development/my-bot');
        }
        BizChatService.onReady(function(bizchat){
            $scope.Data = bizchat;
            bizchat_s = bizchat;
            $scope.addCardSentence = {};
            angular.copy($scope.Data.defaultSentences[2], $scope.addCardSentence);
            $scope.addCardSentence.type = bizchat.defaultSentences[2]._id;

            angular.element('.log-analysis').css('display', 'none');

            $scope.saveState = 'ready';
        });

        angular.element('.main-logo-background').css('opacity', 0);
        $timeout(function()
        {
            angular.element('.main-logo-background').css('display', 'none');
        }, 1200);
    };

    (function()
    {
        $scope.bots = [
            {id:'survey',name:"설문 조사 봇"},
            {id:'marketing',name:"마케팅 봇"},
            {id:'infomation',name:"정보 봇"}];

        // close header area
        angular.element("#top-bar-container").css("position", "relative").css("top", "-63px");
        angular.element('#middle-container').css("top", "0px");

        $scope.$parent.loaded('working-ground');

        $scope.initialize();
        $scope.lan=LanguageService;

    })();

}]);
var bizchat_s = null;
var DRAG = {};
