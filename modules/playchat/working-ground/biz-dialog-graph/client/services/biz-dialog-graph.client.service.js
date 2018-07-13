//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('BizChat', function($window, $resource, $cookies, $rootScope)
    {
        var chatbot = null;

        // load api list
        var GraphFileService = $resource('/api/:botId/biz-graphfiles/:fileName', { botId: '@botId', fileName: '@fileName' });
        var TaskService = $resource('/api/:botId/tasks', { botId: '@botId' }, { update: { method: 'PUT' } });
        var TypeService = $resource('/api/:botId/types', { botId: '@botId' }, { update: { method: 'PUT' } });
        var SentencesService = $resource('/api/:type/biz-sentences/:bizchatId', { type:'@type', bizchatId: '@bizchatId' });


        var BizChat = {
            type : 'bizchat',
            bizchatId : 'survey',
            dialogFileName : 'default.graph.js',
            taskFileName : 'default.js',
            commonDialogs : null,
            userDialogs : null,
            tasks : [],
            types : [],
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

        BizChat.onReady = (cb) => {
            // load chatbot obj
            chatbot = $cookies.getObject('chatbot');

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
                                            BizChat.sentences = res;

                                            cb();

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

        BizChat.addScript = (obj, arr) => {
            var is_exist = false;
            arr.forEach(function(v){
                if(obj.name == v.name) is_exist = true
            });
            if(!is_exist) arr.push(obj);
            return arr;
        };

        BizChat.saveScript = (datas,cb) => {
            if(!datas || datas.length <= 0){
                return null;
            }else{
                var scripts = 'module.exports = function (bot) { \n';

                datas.forEach((v) => {
                    var ck = v.fn.replace(' ','');
                    if(ck.startsWith('bot.set') && ck.endsWith('}')) scripts = [scripts,'\n',v.fn].join("")
                });

                scripts = scripts + '\n}';

                GraphFileService.post(
                    {botId: chatbot.id, fileName: BizChat.taskFileName, data : scripts},
                    (res) => {
                        cb(res);
                    }, (err) => {
                        console.log(err);
                    });
            }
        };

        BizChat.refresh = () => {
            $rootScope.$broadcast('simulator-build');
        };

        return BizChat;
    });
})();
