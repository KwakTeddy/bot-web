//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    var instance = undefined;
    var menuInstance = undefined;

    angular.module('playchat').factory('BizDialogGraph', function($window, $resource, $cookies, $rootScope)
    {
        console.log('================= biz dialog graph ============');

        // load chatbot obj
        var chatbot = $cookies.getObject('chatbot');

        // load api list

        // * graph load
        var GraphFileService = $resource('/api/:botId/biz-graphfiles/:fileName', { botId: '@botId', fileName: '@fileName' });

        // * function load
        var TaskService = $resource('/api/:botId/tasks', { botId: '@botId' }, { update: { method: 'PUT' } });

        // * sentence load





        var Sentences = function()
        {
            this.templateId = null;
            this.list = [];
        };





        var BizDialogGraph = function()
        {
            this.chatbotId = chatbot.id;
            this.type = 'bizchat';
            this.bizchatId = 'survey';

            this.commonDialogs = null;
            this.userDialogs = null;
            this.tasks = [];
        };

        BizDialogGraph.prototype.onReady = () => {
            var that = this;

            // load dialog list
            GraphFileService.get({ botId: chatbot.id, fileName: 'default.graph.js'}
                ,(res) => {
                    // it will be included dialogs, commonDialogs
                    that.commonDialogs = res.commonDialogs;
                    that.dialogs = res.dialogs;
                },(err) => {
                    console.log(err);
                });

            // load templates task list. attach the task name each dialog
            TaskService.query(
                { botId: chatbot.id
                },(res) => {
                    that.tasks = res
                },(err) => {
                    console.log(err);
                })
        };



        if(!instance)
            instance = new BizDialogGraph();
        return instance;
    });
})();
