'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('GnbController', ['$window', '$scope', '$location', '$cookies', '$resource', 'MenuService','LanguageService', function ($window, $scope, $location, $cookies, $resource, MenuService, LanguageService)
{
    var chatbot = $cookies.getObject('chatbot');

    var ReportingService = $resource('/api/reporting');


    $scope.language = $cookies.get('language');
    $scope.menus = [];
    $scope.botName = chatbot.name;
    $scope.path = $location.path();
    $scope.botAuth = chatbot.myBotAuth;

    $scope.openReporting = false;

    (function()
    {

        $scope.drawMenu = function()
        {
            var savedMenu = [];
            if(chatbot.templateId)
            {
                MenuService.get(chatbot.templateId.id, function(menus)
                {
                    $scope.menus = savedMenu = menus;
                    $scope.$parent.loaded('side-menu');
                });
            }
            else
            {
                MenuService.get(function(menus)
                {
                    $scope.menus = savedMenu = menus;
                    $scope.$parent.loaded('side-menu');
                });
            }
        };

        $scope.drawMenu();

        $scope.$on('changeLanguage', function()
        {
            $scope.drawMenu();
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

        if(location.href.indexOf('/development/dialog-graph') == -1)
        {
            $scope.stopToggle = true;
        }
        else
        {
            $scope.stopToggle = false;
        }

        $scope.toggleGnb = function()
        {
            if($scope.stopToggle == false)
            {
                $scope.stopToggle = true;
                return;
            }

            var isClosed = !angular.element('.gnb .logo-min img').is(':visible');

            //responsive 링크가 작동하면 접히고 그렇지 않으면 펼쳐진다.
            var link = angular.element('#gnb-responsive-css');
            if(!isClosed)
            {
                $scope.stopToggle = false;

                //접기
                link.attr('data-media', link.attr('media')).removeAttr('media').removeAttr('disabled');
            }
            else
            {
                $scope.stopToggle = true;
                console.log('스탑 토글 : ', $scope.stopToggle);

                //펼치기
                link.attr('media', link.attr('data-media')).attr('disabled', '');
            }
        };

        $scope.openGnb = function ()
        {
            if(!$scope.stopToggle)
            {
                var link = angular.element('#gnb-responsive-css');
                link.attr('media', link.attr('data-media')).attr('disabled', '');
                angular.element('.video-popup').css('left', '255px');
            }
        };

        $scope.closeGnb = function ()
        {
            if(!$scope.stopToggle)
            {
                var link = angular.element('#gnb-responsive-css');
                link.attr('data-media', link.attr('media')).removeAttr('media').removeAttr('disabled');
                angular.element('.video-popup').css('left', '75px');
            }
        };


    })();


    $scope.toggleMenuItem = function(e)
    {
        var target = e.currentTarget;
        var subMenuItemGroup = target.parentElement;

        if(subMenuItemGroup.className.indexOf('open') == -1)
        {
            angular.element('.menu-item-list .open').removeClass('open');
            subMenuItemGroup.className = subMenuItemGroup.className + ' open';
        }
        else
        {
            angular.element('.menu-item-list .open').removeClass('open');
        }
    };

    $scope.checkUrl = function(menu)
    {
        if(menu)
        {
            if(menu.url == '/')
            {
                if($scope.path == '/playchat' || $scope.path == '/playchat/')
                {
                    return 'selected';
                }
            }
            else
            {
                if($scope.path.startsWith('/playchat' + menu.url))
                {
                    if(menu.childMenus)
                    {
                        return 'open';
                    }
                    else
                    {
                        return 'selected';
                    }
                }
            }
        }

        return '';
    };

    $scope.reporting = function()
    {
        if(confirm(LanguageService('Questions or error reports and suggestions for improvement are received as friends with KakaoTalk Plus. Move to the PlayChat Plus friend? if select the \'Cancel\', then you can send to our email.')))
        {
            window.open(
                'http://pf.kakao.com/_xoWVbC',
                '_blank' // <- This is what makes it open in a new window.
            );
        }
        else
        {
            $scope.openReporting = true;
            setTimeout(function()
            {
                angular.element('.reporting-content').focus();
            }, 100);
        }
    };

    $scope.sendReporting = function()
    {
        ReportingService.save({ content: $scope.reportContent }, function(result)
        {
            alert(LanguageService('Successfully transferred!'));
            $scope.reportContent = '';
            $scope.closeReporting();
        },
        function(err)
        {
            console.log('에러 : ', err);
        });
    };

    $scope.closeReporting = function()
    {
        $scope.openReporting = false;
    };

    $scope.lan=LanguageService;

}]);
