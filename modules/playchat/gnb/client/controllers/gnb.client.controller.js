'use strict';

//플레이챗 전반적인 관리

angular.module('playchat.gnb').controller('GnbController', ['$window', '$scope', function ($window, $scope)
{
    $scope.$parent.loaded('side-menu');

    (function()
    {
        // 최초 메뉴 초기화
        $scope.menus = [];

        $scope.menus.push({ name: 'Dashboard', icon: 'dashboard.png' });
        $scope.menus.push({ name: 'Development', icon: 'develop.png', childMenus: [
            { name: 'Dialog Set', url: '', icon: 'speech.png' },
            { name: 'Dialog Graph', url: '', icon: 'scenario.png' }
        ] });
        $scope.menus.push({ name: 'Management', icon: 'Managemant.png', childMenus: [
            { name: 'Dialog Set', url: '/management/dialog-learning', icon: 'speech.png' },
            { name: 'Dialog Graph', url: '', icon: '' },
            { name: 'Entity', url: '', icon: '' },
            { name: 'Intent', url: '', icon: '' },
            { name: 'Task', url: '', icon: '' }
        ] });
        $scope.menus.push({ name: 'Contents', icon: 'contents.png' });
        $scope.menus.push({ name: 'Channel', icon: 'channel.png' });
        $scope.menus.push({ name: 'Operating', icon: 'operating.png' });
        $scope.menus.push({ name: 'Analysis', icon: 'analysis.png' });
        $scope.menus.push({ name: 'Setting', icon: 'setting.png' });
    })();

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

        $scope.toggleGnb = function(e)
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

        if(subMenuItemGroup.className.indexOf('open') != -1)
        {
            subMenuItemGroup.className = subMenuItemGroup.className.replace('open', '');
        }
        else
        {
            subMenuItemGroup.className = subMenuItemGroup.className + ' open';
        }
    };
}]);
