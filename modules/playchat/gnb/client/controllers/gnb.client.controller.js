'use strict';

//플레이챗 전반적인 관리

angular.module('playchat.gnb').controller('GnbController', ['$window', '$scope', function ($window, $scope)
{
    $scope.$parent.loaded('side-menu');

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
