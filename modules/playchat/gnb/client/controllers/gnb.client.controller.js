'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('GnbController', ['$window', '$scope', '$location', '$cookies', '$resource', 'MenuService', function ($window, $scope, $location, $cookies, $resource, MenuService)
{
    var ChatbotService = $resource('/api/chatbots/:botId', { botId : '@botId'});

    var chatbot = $cookies.getObject('chatbot');

    $scope.menus = [];
    $scope.botName = chatbot.name;
    $scope.path = $location.path();

    (function()
    {
        ChatbotService.get({ botId: chatbot._id }, function(result)
        {
            if(result.templateId)
            {
                MenuService.get(result.templateId.id, function(menus)
                {
                    $scope.menus = menus;
                    $scope.$parent.loaded('side-menu');
                });
            }
            else
            {
                MenuService.get(function(menus)
                {
                    $scope.menus = menus;
                    $scope.$parent.loaded('side-menu');
                });
            }
        },
        function(err)
        {
            alert(err);
        });
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

        $scope.toggleGnb = function()
        {
            var isClosed = !angular.element('.gnb .logo-min img').is(':visible');

            console.log('하 : ', isClosed);

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

    $scope.checkUrl = function(menu)
    {
        if($scope.path.startsWith('/playchat' + menu.url))
        {
            return 'open';
        }

        return '';
    };
}]);
