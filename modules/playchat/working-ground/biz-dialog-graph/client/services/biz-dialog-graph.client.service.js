//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('BizChatService', function($window, $resource, $cookies, $rootScope, FileUploader)
    {
        // load chatbot obj
        // 쿠키의 봇이 구형봇으로 선택되어 제외
        //var chatbot = $cookies.getObject('chatbot');
        var bizchatId = 'survey';
        // load api list
        var DialogGraphsService = $resource('/api/:botId/biz-dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });

        var GraphFileService = $resource('/api/:botId/biz-graphfiles/:fileName', { botId: '@botId', fileName: '@fileName' });
        var JSFileService = $resource('/api/:botId/biz-dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });
        var DialogGraphsNLPService = $resource('/api/:botId/biz-dialog-graphs/nlp/:text', { botId: '@botId', text: '@text', language: 'ko' });

        var TaskService = $resource('/api/:botId/tasks', { botId: '@botId' }, { update: { method: 'PUT' } });
        var TypeService = $resource('/api/:botId/types', { botId: '@botId' }, { update: { method: 'PUT' } });

        var BizMsgsService = $resource('/api/:botId/biz-msg/:id', { botId: '@botId', id:'@id', data:'@data' });

        var CustomTypeService = $resource('/api/script/:type/:name', { type: '@type', name: '@name' }, { update: { method: 'PUT' } });

        var SentencesService = $resource('/api/:bizchatId/biz-sentences', { bizchatId: '@bizchatId' });

        var TC = {
            firstInput : function(){
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
            callCard : function(){
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
            }
        };

        var BizChat = {
            bot : null,
            type : 'bizchat',
            bizchatId : '',
            dialogFileName : 'default.graph.js',
            taskFileName : 'default.js',
            commonDialogs : null,
            dialogs : null,
            dataset : [],
            cardArr : [],
            template : {
                card : '',
                input : '',
                output : ''
            },
            tasks : [],
            types : [],
            scripts : [],
            addOn : {
                tasks : [],
                types : []
            },
            sentences : []
        };

        var _getCompleteData = function(dialog, commonDialogs, cb)
        {
            var children = commonDialogs[0].children;
            delete commonDialogs[0].children;

            var userDialogsString = JSON.stringify(JSON.parse(angular.toJson(dialog)), null, 4);
            var commonDialogsString = JSON.stringify(JSON.parse(angular.toJson(commonDialogs)), null, 4);

            commonDialogs[0].children = children;

            var data = 'var dialogs = ' + userDialogsString + ';\r\n\r\n' + 'var commonDialogs = ' + commonDialogsString + ';\r\n\r\n' + 'module.exports = function(bot)\r\n{\r\n\tbot.setDialogs(dialogs);\r\n\tbot.setCommonDialogs(commonDialogs);\r\n}';

            cb(data);
        };


        var _customTypeLoad = function(){
            CustomTypeService.get({name:'', type:'type'},(res) => {
                BizChat.addOn.types = res.data;
            },(err) => {
                console.log(err)
            });
        };

        var _customTaskLoad = function(){
            CustomTypeService.get({name:'', type:'task'},(res) => {
                BizChat.addOn.tasks = res.data;
            },(err) => {
                console.log(err)
            });
        };


        var _dialogRebasing = (dialog, resultbox) => {
            for(var i in dialog){
                var child = resultbox.filter((e) => {return e.index == dialog[i].index + 1});
                var dialogitem = BizChat.cardArr.find((a)=>{return dialog[i].index == a.index});
                if(child && child.length > 0 && !dialogitem.connect&& !dialogitem.target && !child[0].parent){
                    //resultbox.splice(dialogitem.index - dn,1);
                    //dn ++;
                    dialog[i].children = child;
                    _dialogRebasing(child,resultbox);
                }
            }

            return dialog;
        };

        var _getCallTarget = function(id){
            var t = BizChat.cardArr.find((e) => {return e.id == id});
            return {id:t.id,name:t.name};
        };

        var _createGraph = function(arr, userInput){
            var resultBox = [];
            var callIdx = 0;
            while(arr.length >= 1){
                var item = arr.splice(0, 1)[0];
                var card = _reform_item(item, userInput);
                var nextInput = _mk_nextInput(item);
                var child = [];
                if(item.connect == true){

                    nextInput.forEach((e, i) => {
                        var c = TC.callCard();
                        c.name = c.name + callIdx;
                        c.id = c.id + callIdx;


                        var target = _getCallTarget(item.input[i].target);
                        c.output[0].dialogId = target.id;
                        c.output[0].dialogName = target.name;

                        c.input = [e];
                        callIdx ++;

                        child.push(c);

                        var parent = null;
                        try{
                            parent = arr.find((v) => {return v.id == target.id })
                        }catch(e){
                            parent = resultBox.find((v) => {return v.id == target.id })
                        }
                        parent.parent = true;
                        parent.parentInput = [e];
                        //arr[idx] ? arr[idx].parent = true : null;
                        //callbox.push(arr.splice(idx,1)[0]);
                    });
                    card.children = child;
                    // call카드 등록 rely on input words
                    resultBox.unshift(card);
                }else if(item.target && item.target != ''){
                    var c = TC.callCard();

                    c.name = c.name + callIdx;
                    c.id = c.id + callIdx;

                    var target = _getCallTarget(item.target);
                    c.output[0].dialogId = target.id;
                    c.output[0].dialogName = target.name;

                    c.input = nextInput;
                    callIdx ++;

                    child.push(c);

                    //var idx = arr.findIndex((e) => {return e.id = target});
                    //callbox.push(arr.splice(idx,1)[0]);
                    var parent = null;
                    try{
                        parent = arr.find((v) => {return v.id == target.id })
                    }catch(e){
                        parent = resultBox.find((v) => {return v.id == target.id })
                    }
                    parent.parent = true;

                    card.children = child;
                    // call카드 등록 with any case
                    resultBox.unshift(card);
                    userInput = nextInput;
                }else{
                    userInput = nextInput;
                    resultBox.push(card);
                }
            }

            console.log(resultBox)

            BizChat.commonDialogs[0] = resultBox.filter((e) => {return e.index == 0})[0];
            var dialog = resultBox.filter((e) => {return e.index != 0}).sort((a,b)=>{return a.index - b.index});
            var startup = dialog.filter((e) => {return e.parent});
            if(startup.findIndex((e)=> {return dialog[0].id == e.id}) < 0){
                startup.unshift(dialog[0]);
            }
            var rtn = _dialogRebasing(startup, dialog);

            return rtn
        };

        var _reform_item = (card, userInput) => {
            var item = {};
            item.name = card.name;
            item.id = card.id;
            item.index = card.index;
            card.parent ? item.parent = true : null;

            // set input
            if(card.parentInput){
                item.input = card.parentInput;
            }else if(userInput){
                item.input = userInput;
            }else{
                item.input = [{'if':'true'}]
            }

            item.output = [{
                kind : 'Content',
                text : card.message
            }];

            // set output
            if(card.output){
                switch(Object.keys(card.output)[0]){
                    case 'image' :  item.output[0].image = {url : card.output.image}; break;
                    case 'url' : item.output[0].text = item.output[0].text + '\n\n' + card.output.url; break;
                    default : break
                }
            }
            return item;
        };

        var _mk_nextInput = (card) => {
            var nextInput = null;
            if(card.parentInput)
                return card.parentInput;

            if(card.input){
                if(Object.keys(card.input[0])[0] == 'types'){
                    nextInput = [
                        {types : [card.input[0].types]}
                    ]
                }else{
                    nextInput = [];
                    card.input.forEach((e) => {
                        nextInput.push({
                            text : {
                                raw : e.text,
                                nlp : e.nlp ? e.nlp : e.text
                            }
                        })
                    })
                }
            }else{
                nextInput = [{'if':'true'}]
            }

            return nextInput;
        };


        BizChat.saveGraph = (arr, cb) => {
            var dialog = [];
            BizChat.cardArr = arr.sort((a,b)=>{return a.index - b.index});
            angular.copy(BizChat.cardArr,dialog);
            var dialogs = _createGraph(dialog,TC.firstInput());
            _getCompleteData(dialogs, BizChat.commonDialogs,
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
            SentencesService.get({type:type, bizchatId:bizchatId},(res) => {
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

        BizChat.test = () => {

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
            BizChat.bizchatId = BizChat.bizchatId ? BizChat.bizchatId : bizchatId;
            // custom type list load
            _customTypeLoad();
            _customTaskLoad();

            // commonDialog load
            SentencesService.get({bizchatId: BizChat.bizchatId},(res) => {
                BizChat.commonDialogs = res.data.common;
                BizChat.defaultSentences = res.data.defaultSentences;
                BizChat.sentences = res.data.sentences;
                // message list load
                BizMsgsService.get({botId:BizChat.chatbot.id},(res) => {
                    BizChat.cardArr = res.data;
                    BizChat.cardArr[0].type = BizChat.defaultSentences.find((e) => {return e.name == '일반형'})._id;
                    cb(BizChat);
                },BizChat.error)
            },BizChat.error);
        };

        BizChat.makeCard = function(dialog){
            if(!BizChat.template.card) return alert('Template does not exist!');

            var tpl = BizChat.template.card.replace(/{id}/gi, dialog.id).replace('{name}', dialog.name);
            var input = [];

            // input이 if일 땐 필요없음
            dialog.input.forEach(function(v){
                var type = Object.keys(v)[0];
                if(type == 'text'){
                    // 대답에 의한 분기
                    input.push(BizChat.template.input.replace('{keyword}',v.text.raw))
                }else if(type == 'types'){
                    // 타입체크에 fail
                    input.push(BizChat.template.input.replace('{keyword}','type:'+v.types[0]))
                }
            });

            var output = [];

            // bot이 대답할 답변
            // 나중에 button이 있을 경우를 추가하여야 한다
            var op = dialog.output[0];
            output.push(BizChat.template.output.replace('{message}',op.text));


            return tpl.replace('{input}', input.join("")).replace('{output}', output.join(""));
        };

        // obj : addOn -> type
        // arr : types (already added type list...)
        BizChat.appendTypes = (obj, arr) => {
            var is_exist = false;
            BizChat.types.forEach(function(v){
                if(obj.name == v.name) is_exist = true
            });
            if(!is_exist) BizChat.scripts.push(obj);
            return arr;
        };

        // obj : addOn -> task
        // arr : tasks (already added task list...)
        BizChat.appendTasks = (obj, arr) => {
            var is_exist = false;
            BizChat.tasks.forEach(function(v){
                if(obj.name == v.name) is_exist = true
            });
            if(!is_exist) BizChat.scripts.push(obj);
            return arr;
        };

        BizChat.saveScript = (datas,cb) => {
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
            bizchatId = bizchatId ? bizchatId : BizChat.bizchatId;
            BizChat.onReady(bizchatId);


        };

        BizChat.template.card = (obj) => {
            var tpl = '';



            return tpl;
        };

        return BizChat;
    });
})();
