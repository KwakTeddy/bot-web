//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('BizChatService', function($window, $resource, $cookies, $rootScope)
    {
        var chatbot = null;

        // load api list
        var GraphFileService = $resource('/api/:botId/biz-graphfiles/:fileName', { botId: '@botId', fileName: '@fileName' });
        var JSFileService = $resource('/api/:botId/biz-dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });
        var TaskService = $resource('/api/:botId/tasks', { botId: '@botId' }, { update: { method: 'PUT' } });
        var TypeService = $resource('/api/:botId/types', { botId: '@botId' }, { update: { method: 'PUT' } });

        var CustomTypeService = $resource('/api/script/:type/:name', { type: '@type', name: '@name' }, { update: { method: 'PUT' } });

        var SentencesService = $resource('/api/:type/biz-sentences/:bizchatId', { type:'@type', bizchatId: '@bizchatId' });


        var BizChat = {
            type : 'bizchat',
            bizchatId : 'survey',
            dialogFileName : 'default.graph.js',
            taskFileName : 'default.js',
            commonDialogs : null,
            dialogs : null,
            template : {
                card : '',
                input : '',
                output : {
                    text : '',
                    button : ''
                }
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


        BizChat.onReady = (cb) => {
            // load chatbot obj
            chatbot = $cookies.getObject('chatbot');

            // custom type list load
            _customTypeLoad();
            _customTaskLoad();

            // load dialog list
            GraphFileService.get({botId: chatbot.id, fileName: BizChat.dialogFileName}
                , (res) => {
                    // it will be included dialogs, commonDialogs
                    BizChat.commonDialogs = res.commonDialogs;
                    BizChat.dialogs = res.dialogs;

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
            if(!BizChat.template.card)
                return alert('Template does not exist!');

            BizChat.template.card.replace(/{id}/gi, dialog.id).replace('{name}', dialog.name);
            var input = [];
            dialog.input.forEach(function(v){
                var type = Object.keys(v)[0];
                if(type == 'text'){
                    input.push(BizChat.template.input.replace('{keyword}',v.text.raw))
                }else if(type == 'types'){
                    input.push(BizChat.template.input.replace('{keyword}',v.types))
                }else if(type == 'if'){
                    input.push(BizChat.template.input.replace('{keyword}','if:'+v.if))
                }
            });

            var output = [];
            dialog.output.forEach(function(v){
                var type = Object.keys(v)[0];
                if(type == 'text'){
                    input.push(BizChat.template.input.replace('{keyword}',v.text.raw))
                }
            });

            //if(dialog.)
        };

        BizChat.saveGraph = (cb) => {
            _getCompleteData(BizChat.userDialogs, BizChat.commonDialogs,
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

        BizChat.refresh = () => {
            $rootScope.$broadcast('simulator-build');
        };

        return BizChat;
    });
})();
