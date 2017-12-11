//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('MenuService', function($cookies, $resource, LanguageService)
    {
        var TemplateGnbService = $resource('/api/:templateId/gnb', { templateId : '@templateId' });

        var instance = undefined;

        var Menu = function()
        {
            // this.setting = { name: 'Setting', icon: 'setting.png' };
        };

        Menu.prototype.initialize = function()
        {
            this.dashboard = { name: LanguageService('Dashboard'), url:'/', icon: 'dashboard.png' };

            this.development = { name: LanguageService('Development'), url: '/development', icon: 'develop.png', childMenus: [
                { name: LanguageService('Dialog Set'), url: '/development/dialog-set', icon: 'speech_select_mini.png' },
                { name: LanguageService('Dialog Graph'), url: '/development/dialog-graph', icon: 'scenatio_select.png' }
            ] };

            this.management = { name: LanguageService('Management'), url: '/management', icon: 'Managemant.png', childMenus: [
                { name: LanguageService('Dialog Set'), url: '/management/dialog-set', icon: 'speech_select_mini.png' },
                { name: LanguageService('Dialog Graph'), url: '/management/dialog-graph', icon: 'scenatio_select.png' },
                { name: LanguageService('Entity'), url: '/management/entity', icon: 'entity_select_mini.png' },
                { name: LanguageService('Intent'), url: '/management/intent', icon: 'intent_select.png' },
                { name: LanguageService('Task'), url: '/management/task', icon: 'task_select_mini.png' }
            ] };

            this.contents = { name: LanguageService('Contents'), icon: 'contents.png' };
            this.channel = { name: LanguageService('Channel'), url: '/channel', icon: 'channel.png' };

            this.operation = { name: LanguageService('Operation'), icon: 'operat.png', url: '/operation', childMenus: [
                { name: LanguageService('User'), url: '/operation/user', icon: 'user_mini.png' },
                { name: LanguageService('Human Chat log'), url: '/operation/chat-log/human', icon: 'human_select.png' },
                { name: LanguageService('AI Chat log'), url: '/operation/chat-log/ai', icon: 'ai_select.png' },
                { name: LanguageService('Failed Chat log'), url: '/operation/failed-dialogs', icon: 'failed_select.png' }
            ] };

            this.analysis = { name: LanguageService('Analysis'), icon: 'analysis.png', url: '/analysis', childMenus: [
                { name: LanguageService('Summary'), url : '/analysis/summary', icon: 'summary_select.png' },
                { name: LanguageService('Dialog Traffic'), url : '/analysis/dialog-traffic', icon: 'traffic_select.png' },
                { name: LanguageService('User'), url : '/analysis/user', icon: 'user_mini.png' },
                { name: LanguageService('Session'), url : '/analysis/session', icon: 'session_select.png' },
                { name: LanguageService('Dialog Graph Path'), url : '/analysis/dialog-graph-path', icon: 'path_select.png' },
                { name: LanguageService('Dialog Training Usage'), url : '/analysis/dialog-training-usage', icon: 'training_select.png' },
                { name: LanguageService('Dialog Graph Usage'), url : '/analysis/dialog-graph-usage', icon: 'userusage_select.png' },
                { name: LanguageService('Dialog Training Input'), url : '/analysis/dialog-training-input', icon: 'traininginput_select.png' },
                { name: LanguageService('Dialog Graph Input'), url : '/analysis/dialog-graph-input', icon: 'graphinput_select.png' },
                { name: LanguageService('Intent'), url : '/analysis/intent', icon: 'intent_select.png' },
                { name: LanguageService('Failed Dialogs'), url : '/analysis/failed-dialogs', icon: 'failed_select.png' }
            ] };
        };

        Menu.prototype.get = function(templateId, callback)
        {
            this.initialize();
            var that = this;
            if(typeof templateId == 'string' && callback)
            {
                TemplateGnbService.get({ templateId : templateId }, function(menu)
                {
                    var menus = menu.menus;

                    for(var i=0; i<menus.length; i++)
                    {
                        menus[i].name = LanguageService(menus[i].name);
                    }

                    menus.push(that.channel);
                    menus.push(that.operation);
                    menus.push(that.analysis);

                    callback(menus);
                },
                function(err)
                {
                    alert(err);
                });
            }
            else if(typeof templateId == 'function')
            {
                var menus = [];
                menus.push(this.dashboard);
                menus.push(this.development);
                menus.push(this.management);
                // menus.push(this.contents);
                menus.push(this.channel);
                menus.push(this.operation);
                menus.push(this.analysis);
                // menus.push(this.setting);

                templateId(menus);
            }
        };

        return (function()
        {
            if(!instance)
            {
                instance = new Menu();
            }

            return instance;
        })();
    });
})();
