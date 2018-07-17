//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('BizChatService', function($window, $resource, $cookies, $rootScope, FileUploader)
    {
        // load chatbot obj
        var chatbot = $cookies.getObject('chatbot');

        // load api list
        var GraphFileService = $resource('/api/:botId/biz-graphfiles/:fileName', { botId: '@botId', fileName: '@fileName' });
        var JSFileService = $resource('/api/:botId/biz-dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });
        var TaskService = $resource('/api/:botId/tasks', { botId: '@botId' }, { update: { method: 'PUT' } });
        var TypeService = $resource('/api/:botId/types', { botId: '@botId' }, { update: { method: 'PUT' } });

        var CustomTypeService = $resource('/api/script/:type/:name', { type: '@type', name: '@name' }, { update: { method: 'PUT' } });

        var SentencesService = $resource('/api/:type/biz-sentences/:bizchatId', { type:'@type', bizchatId: '@bizchatId' });

        var BizChat = {
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

            var userDialogsString = JSON.stringify(JSON.parse(angular.toJson(userDialogs)), null, 4);
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

        var _dialogIndexing = function(dialog,parentId){
            for(var i in dialog){
                BizChat.cardArr.push(_mk_index(dialog[i], parentId));
                if(dialog[i].children && dialog[i].children.length) {
                    _dialogIndexing(dialog[i].children, dialog[i].id);
                }
            }
        };

        var _dialogRebasing = function(dialogs){
            for(var i in dialogs){
                console.log(dialogs[i].id);
                var child = _mk_rebase(dialogs[i]);
                if(child.length > 0){
                    dialogs[i].children = child;
                    _dialogRebasing(child);
                }
            }

            return dialogs;
        };

        BizChat.createDialog = function(dialog, parent){
            BizChat.cardArr.push(_mk_index(dialog, parent? parent.id : null))
        };

        BizChat.deleteDialog = function(id){
            var parentId = angular.element('#'+id).prev()[0].id;
            BizChat.cardArr = BizChat.cardArr.filter(function(e){return e.id != id});
            BizChat.cardArr.filter(function(e){if(e.parentId == id){e.parentId = parentId != ''? parentId : null}})
        };

        var _mk_rebase = function(dialog){
            return BizChat.cardArr.filter(function(e){return dialog.id == e.parentId})
        };

        var _mk_index = function(dia, parentId){
            return {
                id : dia.id,
                name : dia.name,
                type : dia.type,
                input : dia.input,
                output : dia.output,
                parentId : parentId ? parentId : null
            }
        };

        BizChat.getCustomSentence = function(bizchatId, type, ck){
            SentencesService.get({type:type, bizchatId:bizchatId},(res) => {
                if(typeof ck ==='function')ck(res.data)
            },(err) => {
                console.log(err)
            })
        };

        BizChat.test = () => {

        };

        BizChat.onReady = (bizchatId, cb) => {
            bizchatId = bizchatId ? bizchatId : 'survey';
            BizChat.bizchatId = bizchatId;
            // custom type list load
            _customTypeLoad();
            _customTaskLoad();
            BizChat.getCustomSentence(BizChat.bizchatId,'global',function(data){
                BizChat.dataset = data;
            });
            $rootScope.$broadcast('simulator-build');
            // load dialog list
            GraphFileService.get({botId: chatbot.id, fileName: BizChat.dialogFileName}
                , (res) => {
                    // it will be included dialogs, commonDialogs

                    BizChat.commonDialogs = res.commonDialogs;
                    BizChat.dialogs = res.dialogs;

                    _dialogIndexing(BizChat.dialogs);

                    // list of task names in the file
                    TaskService.query({botId: chatbot.id}
                        , (res) => {
                            // load templates task list. attach the task name each dialog
                            BizChat.tasks = res;

                            TypeService.query({botId: chatbot.id}
                                , (res) => {
                                    BizChat.types = res;

                                    SentencesService.get({type : BizChat.type, bizchatId: BizChat.bizchatId}
                                        , (res) => {
                                            BizChat.sentences = res.data;

                                            cb(BizChat);

                                        }, (err) => {
                                            console.log(err);
                                        })

                                }, (err) => {
                                    console.log(err);
                                })

                        }, (err) => {
                            console.log(err);
                        })
                },(err) => {
                    console.log(err);
                })
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

        BizChat.saveGraph = (cb) => {
            var dialog = BizChat.cardArr.filter((e) => {return e.parentId == null});

            var dialogs = _dialogRebasing(dialog);

            _getCompleteData(dialogs, BizChat.commonDialogs,
                (script) => {
                GraphFileService.post({
                        botId: chatbot.id,
                        fileName: BizChat.dialogFileName,
                        data : script},
                    (res) => {
                        cb(res);
                    }, (err) => {
                        console.log(err);
                    })
            });
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
                JSFileService.get({botId: chatbot.id, fileName: BizChat.taskFileName},(res) => {
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
                        {botId: chatbot.id, fileName: BizChat.taskFileName, data : scripts},
                        (res) => {
                            cb(res);
                        }, (err) => {
                            console.log(err);
                        });
                });
            }
        };

        BizChat.setUploader = function(){
            var uploader = new FileUploader({
                url: '/api/' + chatbot.id + '/biz-dialog-graphs/uploadImage',
                alias: 'uploadFile',
                autoUpload: true
            });

            uploader.onSuccessItem = function(item, response, status, headers)
            {
                var image = {
                    url: response.url,
                    displayname: item.file.name
                };
                // bind with card scope
                console.log(image)
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
