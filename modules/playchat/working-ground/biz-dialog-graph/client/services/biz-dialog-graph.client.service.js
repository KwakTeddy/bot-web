//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('BizChatService', function($window, $resource, $cookies, $rootScope, FileUploader)
    {
        // load api list
        var DialogGraphsService = $resource('/api/:botId/biz-dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });

        var GraphFileService = $resource('/api/:botId/biz-graphfiles/:fileName', { botId: '@botId', fileName: '@fileName' });
        var JSFileService = $resource('/api/:botId/biz-dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });
        var DialogGraphsNLPService = $resource('/api/:botId/biz-dialog-graphs/nlp/:text', { botId: '@botId', text: '@text', language: 'ko' });

        var TaskService = $resource('/api/:botId/tasks', { botId: '@botId' }, { update: { method: 'PUT' } });
        var TypeService = $resource('/api/:botId/types', { botId: '@botId' }, { update: { method: 'PUT' } });

        var CustomTypeService = $resource('/api/script/:type/:name', { type: '@type', name: '@name' }, { update: { method: 'PUT' } });
        var BizMsgsService = $resource('/api/:botId/biz-msg/:id', { botId: '@botId', id:'@id', data:'@data' });

        // bizchatId will change templateId
        var SentencesService = $resource('/api/:bizchatId/biz-sentences', { bizchatId: '@bizchatId' });


        var callIdx = 0;
        // TemplateCreator
        var TC = {
            firstInput : () => {
                return [
                    {
                        "text": {
                            "raw": "start",
                            "nlp": "start"
                        }
                    },
                    {
                        "text": {
                            "raw": "시작",
                            "nlp": "시작"
                        }
                    },
                    {
                        "text": {
                            "raw": "처음",
                            "nlp": "처음"
                        }
                    }
                ]
            },
            undefined : () => {
                var ar = {
                    "id": "noanswer_c",
                    "name": "답변없음",
                    "input": [{if: "true"}],
                    "output": [
                        {
                            text: "알아듣지 못했습니다.",
                            kind: 'Content'
                        }
                    ]
                };

                return ar;
            },
            callCard : () => {
                return {
                    "name": "call_",
                    "input":  [
                        {"if": "true"}
                    ],
                    "output": [
                        {
                            "kind": "Action",
                            "text": "",
                            "type": "call",
                            "dialogId": ""
                        }
                    ],
                    "id": "call_"
                }
            },
            getInput : (p,i) => {
                var input = null;
                if(!p){
                    input = [{'if':'true'}];
                }else if(p.text){
                    input = [{
                        text: {
                            raw:p.text.toString(),
                            nlp:p.nlp ? p.nlp : p.text.toString()
                        }
                    }];
                    var ii = i&&i>-1 ? i+1 : null;
                    if(ii&&ii!=p.text){
                        input.push({
                            text: {
                                raw:ii.toString(),
                                nlp:ii.toString()
                            }
                        })
                    }
                }else if(p[0].types){
                    input = [{types:[p[0].types]}]
                }else{
                    input = [{'if':'true'}];
                }
                return input;
            },
            getOutput : (card) => {
                var output = {
                    kind : 'Content',
                    text : card.message
                };

                if(card.output){
                    switch(Object.keys(card.output)[0]){
                        case 'image' :  output.image = {url : card.output.image}; break;
                        case 'url' : output.text = output.text + '\n\n' + card.output.url; break;
                        default : break
                    }
                }

                return [output];
            },
            createCard : (card, input) => {
                var item = {
                    id : card.id,
                    name : card.name
                };

                if(input){
                    item.input = input;
                    item.output = TC.getOutput(card);
                }else{
                    item.input = card.input;
                    item.output = card.output;
                }

                if(card.children){
                    item.children = card.children;
                }

                return item;
            },
            setChild : (cardA, cardB, dialog) => {
                if(cardB && !cardB.parent && !cardA.called){


                    // dialog item A
                    if(!cardB.called){
                        var c_item = dialog.find((e) => {return e.index == cardB.index+1});
                        cardB = TC.setChild(cardB, c_item, dialog);
                    }
                    var inf = cardA.fnInput? cardA.fnInput : cardA.input;
                    cardB.input = TC.getInput(inf);
                    cardA.children = [TC.createCard(cardB)];

                    if(inf&&inf[0].types){
                        var c = TC.callCard();
                        c.name = c.name + callIdx;
                        c.id = c.id + callIdx;
                        c.input = TC.getInput(null);
                        c.output[0].dialogId = cardA.id;
                        c.output[0].text = '예시를 참고하여 다시 한번 입력해 주세요.';
                        c.output[0].type = 'returnCall';
                        cardA.children.push(c);
                        callIdx ++;
                    }
                }
                return cardA;
            },
            _getCompleteData : function(dialog, commonDialogs, cb)
            {
                var children = commonDialogs[0].children;
                delete commonDialogs[0].children;

                var userDialogsString = JSON.stringify(JSON.parse(angular.toJson(dialog)), null, 4);
                var commonDialogsString = JSON.stringify(JSON.parse(angular.toJson(commonDialogs)), null, 4);

                commonDialogs[0].children = children;

                var data = 'var dialogs = ' + userDialogsString + ';\r\n\r\n' + 'var commonDialogs = ' + commonDialogsString + ';\r\n\r\n' + 'module.exports = function(bot)\r\n{\r\n\tbot.setDialogs(dialogs);\r\n\tbot.setCommonDialogs(commonDialogs);\r\n}';

                cb(data);
            }
        };

        var ScriptService = {
            _customTypeLoad : function(){
                CustomTypeService.get({name:'', type:'type'},(res) => {
                    BizChat.addOn.types = res.data;
                },(err) => {
                    console.log(err)
                });
            },
            _customTaskLoad : function(){
                CustomTypeService.get({name:'', type:'task'},(res) => {
                    BizChat.addOn.tasks = res.data;
                },(err) => {
                    console.log(err)
                });
            },
            // obj : addOn -> type
            // arr : types (already added type list...)
            appendTypes : (obj, arr) => {
                var is_exist = false;
                BizChat.types.forEach(function(v){
                    if(obj.name == v.name) is_exist = true
                });
                if(!is_exist) BizChat.scripts.push(obj);
                return arr;
            },
            // obj : addOn -> task
            // arr : tasks (already added task list...)
            appendTasks : (obj, arr) => {
                var is_exist = false;
                BizChat.tasks.forEach(function(v){
                    if(obj.name == v.name) is_exist = true
                });
                if(!is_exist) BizChat.scripts.push(obj);
                return arr;
            },
            saveScript : (datas,cb) => {
                if(!datas || datas.length <= 0){
                    return null;
                }else{
                    JSFileService.get({botId: BizChat.chatbot.id, fileName: BizChat.taskFileName},(res) => {
                        var scripts = res.data;
                        if(scripts.endsWith('};')){
                            scripts = scripts.slice(0,-2);
                        }else if(scripts.endsWith('}')){
                            scripts = scripts.slice(0,-1);
                        }

                        datas.forEach((v) => {
                            var ck = v.code.replace(' ','');
                            if(ck.startsWith('bot.set')) scripts = [scripts,'\n',v.code].join("")
                        });

                        scripts = scripts + '\n};';

                        GraphFileService.post(
                            {botId: BizChat.chatbot.id, fileName: BizChat.taskFileName, data : scripts},
                            (res) => {
                                cb(res);
                            }, (err) => {
                                console.log(err);
                            });
                    });
                }
            }
        };

        //Initailize BizChatService
        var BizChat = {
            chatbot : null,
            type : 'bizchat',
            bizchatId : '',
            dialogFileName : 'default.graph.js',
            taskFileName : 'default.js',
            commonDialogs : null,
            dialogs : null,
            cardArr : [],
            tasks : [],
            types : [],
            scripts : [],
            addOn : {
                tasks : [],
                types : []
            },
            sentences : []
        };


        var _recoverProcess = (newArr,oldArr,firstInput) => {

            // startDialog의 target에 input이 적용된 parent 설정
            if(firstInput && firstInput.length > 0){
                firstInput.forEach((e,i) => {
                    if(e.target){
                        var item = newArr.find((j) => {return j.id == e.target});
                        item.parent = true;
                        item.first = true;

                        // old input != new input
                        if(item.input){
                            item.fnInput = item.input;
                        }

                        item.input = TC.getInput(e,i);
                    }
                })
            }

            // dialog 내 call 설정
            for(var i in oldArr){
                var item = oldArr[i];
                var recall = false;
                newArr[i].output = TC.getOutput(item);
                var child = [];
                if(item.input){
                    item.input.forEach((e,i) => {
                        if(e.target){
                            // callcard 설정
                            var c = TC.callCard();
                            c.name = c.name + callIdx;
                            c.id = c.id + callIdx;
                            c.input = TC.getInput(e,i);
                            var target = newArr.find((j) => {return j.id == e.target});

                            c.output[0].dialogId = target.id;
                            c.output[0].dialogName = target.name;

                            child.push(c);
                            callIdx ++;
                            // target에 parent 설정

                            if(!target.parent){
                                target.parent = true;
                                target.input = TC.getInput(null);
                            }
                            recall = true;
                        }
                    })
                }else if(item.target&&item.target!=''){
                    var c = TC.callCard();
                    c.name = c.name + callIdx;
                    c.id = c.id + callIdx;
                    c.input = TC.getInput(null);
                    var target = newArr.find((j) => {return j.id == item.target});

                    c.output[0].dialogId = target.id;
                    c.output[0].dialogName = target.name;

                    child.push(c);
                    callIdx ++;

                    if(!target.parent){
                        target.parent = true;
                        target.input = TC.getInput(null);
                    }
                }
                if(recall){
                    var c = TC.callCard();
                    c.name = c.name + callIdx;
                    c.id = c.id + callIdx;
                    c.input = TC.getInput(null);
                    c.output[0].dialogId = item.id;
                    c.output[0].text = '보기에 따라 다시 선택해주세요.';
                    c.output[0].type = 'returnCall';
                    child.push(c);
                    callIdx ++;
                }

                if(child.length > 0){
                    newArr[i].called = true;
                    newArr[i].children = child;
                }
            }

            var dialog = [];
            newArr.forEach((e)=>{
                var item = {
                    id : e.id,
                    name : e.name,
                    input : e.input,
                    output : e.output,
                    parent : e.parent,
                    called : e.called,
                    children : e.children,
                    index : e.index
                };
                e.first ? item.first = true : null;
                e.fnInput ? item.fnInput = e.fnInput : null;
                dialog.push(item);
            });


            var firstDsSet = dialog.filter((e) => {return e.parent});

            if(firstDsSet.length == 0){
                dialog[0].input = TC.getInput();
                firstDsSet = [dialog[0]]
            }

            firstDsSet.forEach((e) => {
                // new item of B
                var b_item = dialog.find((j) => {return j.index == e.index+1});

                e = TC.setChild(e, b_item, dialog);
            });
            if(firstDsSet.filter((e)=>{return e.first}).length > 0){
                return firstDsSet.filter((e)=>{return e.first})
                    .concat(TC.undefined())
                    .concat(firstDsSet.filter((e)=>{return !e.first}))

            }else{
                firstDsSet = firstDsSet.filter((e)=>{return e.first})
                    .concat(firstDsSet.filter((e)=>{return !e.first}));
                firstDsSet.splice(1,0,TC.undefined());

                return firstDsSet;
            }
        };


        BizChat.saveGraph = (arr, cb) => {
            BizChat.cardArr = arr.sort((a,b)=>{return a.index - b.index});
            var newArr = [], oldArr = [];

            angular.copy(BizChat.cardArr,oldArr);
            var firstInput = oldArr[0].input;

            var startDialog = TC.createCard(oldArr[0],TC.firstInput());

            // 첫번째 카드 제거
            oldArr.splice(0,1);
            angular.copy(oldArr,newArr);


            var dialogs =_recoverProcess(newArr,oldArr,firstInput);

            console.log('startDialog');
            console.log(dialogs);

            BizChat.commonDialogs[0] = startDialog;
            TC._getCompleteData(dialogs, BizChat.commonDialogs,
                (script) => {
                    DialogGraphsService.save({
                            botId: BizChat.chatbot.id,
                            fileName: BizChat.dialogFileName,
                            data : script},
                        (res) => {
                            cb(res);
                        }, (err) => {
                            console.log(err);
                        })
                });
        };

        BizChat.getCustomSentence = function(bizchatId, type, ck){
            SentencesService.get({
                type:type,
                bizchatId:bizchatId
            },(res) => {
                if(typeof ck ==='function')ck(res.data)
            },(err) => {
                console.log(err)
            })
        };

        BizChat.addNlp = (text,cb) => {
            DialogGraphsNLPService.get({ botId: BizChat.chatbot.id, text: text }, function(result)
            {
                cb(result.text);
            });
        };

        BizChat.error = (err) => {
            console.log(err)
        };

        BizChat.addCard = (card,cb) => {
            if(!card.message || card.message == ''){
                cb(false);
                return null;
            }

            var idx = 0, track = true, id = '';

            while(track){
                id = 'dialog_' + (BizChat.cardArr.length + idx);
                track = BizChat.cardArr.filter((e) => {return e.id == id}).length > 0 ? true : false;
                idx ++;
            }

            card.botId = BizChat.chatbot.id;
            card.id = id;
            card.index = BizChat.cardArr.length;

            BizMsgsService.save(card, (rtn)=> {
                if(rtn.status == true) cb(rtn);
                else cb(false)
            },(err) => {
                cb(false);
            });
        };

        BizChat.updateCard = (card,cb) => {
            BizMsgsService.save(card, (rtn)=> {
                if(rtn.status == true) cb(rtn);
                else cb(false)
            },(err) => {
                cb(false);
            });
        };

        BizChat.deleteCard = (cards,cb) => {
            BizMsgsService.delete({botId:BizChat.chatbot.id,data:cards},(rtn) => {
                cb(rtn);
            },(err) => {
                cb(false);
            })
        };

        BizChat.onReady = (cb) => {
            // custom type list load
            // 아직 사용되지 않음
            //ScriptService._customTaskLoad();
            //ScriptService._customTypeLoad();

            // commonDialog load
            SentencesService.get({bizchatId: BizChat.bizchatId},(res) => {
                BizChat.commonDialogs = res.data.common;
                BizChat.defaultSentences = res.data.defaultSentences;
                BizChat.sentences = res.data.sentences;
                // message list load
                BizMsgsService.get({botId:BizChat.chatbot.id},(res) => {
                    BizChat.cardArr = res.data;
                    if(!BizChat.cardArr[0].type){
                        BizChat.cardArr[0].type = BizChat.defaultSentences.find((e) => {return e.name == '일반형'})._id;
                    }
                    cb(BizChat);
                },BizChat.error)
            },BizChat.error);
        };

        BizChat.setUploader = function(card){
            var uploader = new FileUploader({
                url: '/api/' + BizChat.chatbot.id + '/biz-dialog-graphs/uploadImage',
                alias: 'uploadFile',
                autoUpload: true
            });

            uploader.onSuccessItem = function(item, response, status, headers)
            {
                // bind with card scope
                card.output = {image:response.url}
            };

            uploader.onErrorItem = function(item, response, status, headers)
            {
                alert(response.message);
            };

            uploader.onProgressItem = function(fileItem, progress)
            {
                console.log(progress);
            };


            return uploader;
        };

        BizChat.refresh = (bizchatId) => {
            bizchatId = BizChat.bizchatId;
            BizChat.onReady(bizchatId);


        };

        return BizChat;
    });
})();


//미처리 이슈
//* 선택형 문항에 대하여 숫자 or 입력내용 인식하도록 추가
