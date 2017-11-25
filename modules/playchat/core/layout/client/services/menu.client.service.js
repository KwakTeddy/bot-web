//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('MenuService', function($cookies, $resource)
    {
        var TemplateGnbService = $resource('/api/:templateName/gnb', { templateName : '@templateName' });

        var instance = undefined;

        var Menu = function()
        {
            this.dashboard = { name: 'Dashboard', url:'/', icon: 'dashboard.png' };

            this.development = { name: 'Development', icon: 'develop.png', childMenus: [
                { name: 'Dialog Set', url: '/development/dialog-set', icon: 'speech.png' },
                { name: 'Dialog Graph', url: '/development/dialog-graph', icon: 'scenario_select.png' }
            ] };

            this.management = { name: 'Management', icon: 'Managemant.png', childMenus: [
                { name: 'Dialog Set', url: '/management/dialog-set', icon: 'speech_select.png' },
                { name: 'Dialog Graph', url: '/management/dialog-graph', icon: 'scenario_select.png' },
                { name: 'Entity', url: '/management/entity', icon: 'entity_select.png' },
                { name: 'Intent', url: '/management/intent', icon: 'intent_select.png' },
                { name: 'Task', url: '/management/task', icon: 'task_select.png' }
            ] };

            this.contents = { name: 'Contents', icon: 'contents.png' };
            this.channel = { name: 'Channel', icon: 'channel.png' };

            this.operation = { name: 'Operation', icon: 'operation.png', childMenus: [
                { name: 'User', url: '/operation/user', icon: 'users_select.png' },
                { name: 'Human Chat log', url: '/operation/chat-log/human', icon: 'human_select.png' },
                { name: 'AI Chat log', url: '/operation/chat-log/ai', icon: 'ai_select.png' },
                { name: 'Failed Chat log', url: '/operation/failed-dialogs', icon: 'failed_select.png' }
            ] };

            this.analysis = { name: 'Analysis', icon: 'analysis.png', childMenus: [
                { name: 'Summery', url : '/analysis/summary', icon: 'summary_select.png' },
                { name: 'Dialog Traffic', url : '/analysis/dialog-traffic', icon: 'traffic_select.png' },
                { name: 'User', url : '/analysis/user', icon: 'users_select.png' },
                { name: 'Session', url : '/analysis/session', icon: 'session_select.png' },
                { name: 'Dialog Graph Path', url : '/analysis/dialog-graph-path', icon: 'path_select.png' },
                { name: 'Dialog Training Usage', url : '/analysis/dialog-training-usage', icon: 'training_select.png' },
                { name: 'Dialog Graph Usage', url : '/analysis/dialog-graph-usage', icon: 'graphusage_select.png' },
                { name: 'Dialog Training Input', url : '/analysis/dialog-training-input', icon: 'traininginput_select.png' },
                { name: 'Dialog Graph Input', url : '/analysis/dialog-graph-input', icon: 'graphinput_select.png' },
                { name: 'Intent', url : '/analysis/intent', icon: 'intent_select.png' },
                { name: 'Failed Dialogs', url : '/analysis/failed-dialogs', icon: 'failed_select.png' }
            ] };

            this.setting = { name: 'Setting', icon: 'setting.png' };
        };

        Menu.prototype.get = function(templateName, callback)
        {
            var that = this;
            if(typeof templateName == 'string' && callback)
            {
                TemplateGnbService.get({ templateName : templateName }, function(menu)
                {
                    console.log('템플릿 메뉴 : ', menu);

                    var menus = menu.menus;

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
            else if(typeof templateName == 'function')
            {
                var menus = [];
                menus.push(this.dashboard);
                menus.push(this.development);
                menus.push(this.management);
                menus.push(this.contents);
                menus.push(this.channel);
                menus.push(this.operation);
                menus.push(this.analysis);
                menus.push(this.setting);

                templateName(menus);
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
