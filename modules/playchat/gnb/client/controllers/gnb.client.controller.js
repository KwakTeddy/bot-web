'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('GnbController', ['$window', '$scope', '$location', '$cookies', function ($window, $scope, $location, $cookies)
{
    $scope.$parent.loaded('side-menu');

    (function()
    {
        // 최초 메뉴 초기화
        $scope.menus = [];

        $scope.menus.push({ name: 'Dashboard', url:'/', icon: 'dashboard.png' });
        $scope.menus.push({ name: 'Development', icon: 'develop.png', childMenus: [
            { name: 'Dialog Set', url: '/development/dialog-set', icon: 'speech.png' },
            { name: 'Dialog Graph', url: '/development/dialog-graph', icon: 'scenario_select.png' }
        ] });
        $scope.menus.push({ name: 'Management', icon: 'Managemant.png', childMenus: [
            { name: 'Dialog Set', url: '/management/dialog-set', icon: 'speech_select.png' },
            { name: 'Dialog Graph', url: '/management/dialog-graph', icon: 'scenario_select.png' },
            { name: 'Entity', url: '/management/entity', icon: 'entity_select.png' },
            { name: 'Intent', url: '/management/intent', icon: 'intent_select.png' },
            { name: 'Task', url: '/management/task', icon: 'task_select.png' }
        ] });
        $scope.menus.push({ name: 'Contents', icon: 'contents.png' });
        $scope.menus.push({ name: 'Channel', icon: 'channel.png' });
        $scope.menus.push({ name: 'Operation', icon: 'operation.png', childMenus: [
            { name: 'User', url: '/operation/user', icon: 'users_select.png' },
            { name: 'Human Chat log', url: '/operation/chat-log/human', icon: 'human_select.png' },
            { name: 'AI Chat log', url: '/operation/chat-log/ai', icon: 'ai_select.png' },
            { name: 'Failed Chat log', url: '/operation/failed-dialogs', icon: 'failed_select.png' }
        ] });
        $scope.menus.push({ name: 'Analysis', icon: 'analysis.png', childMenus: [
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
        ] });
        $scope.menus.push({ name: 'Setting', icon: 'setting.png' });

        $scope.path = $location.path();
    })();

    var chatbot = $cookies.getObject('chatbot');

    $scope.botName = chatbot.name;

    // --------- Gnb 접기 펼치기 기능.
    (function()
    {
        // 버튼 클릭으로 접기 펼치기 한 뒤 resize는 무시한다. 일단...
        // $scope.$on('window.resize', function(e)
        // {
        //     //사이드메뉴 강제로 접고 펼쳤던것 원상복구
        //     var link = angular.element('#gnb-responsive-css');
        //     link.removeAttr('disabled');
        //     if(link.attr('data-media'))
        //         link.attr('media', link.attr('data-media'));
        // });

        $scope.toggleGnb = function()
        {
            var isClosed = !angular.element('.gnb .logo-min img').is(':visible');

            //responsive 링크가 작동하면 접히고 그렇지 않으면 펼쳐진다.
            var link = angular.element('#gnb-responsive-css');
            if(!isClosed)
            {
                //접기
                link.attr('data-media', link.attr('media')).removeAttr('media').removeAttr('disabled');
            }
            else
            {
                //펼치기
                link.attr('media', link.attr('data-media')).attr('disabled', '');
            }
        };
    })();

    $scope.toggleMenuItem = function(e)
    {
        var target = e.currentTarget;
        var subMenuItemGroup = target.parentElement;

        angular.element('.menu-item-list .open').removeClass('open');
        subMenuItemGroup.className = subMenuItemGroup.className + ' open';
    };

    $scope.checkUrl = function(name)
    {
        if($scope.path.indexOf('/playchat/' + name.toLowerCase()) != -1)
        {
            return 'open';
        }

        return '';
    };
}]);
