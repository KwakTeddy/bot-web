'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('SideMenuController', ['$window', '$scope', function ($window, $scope)
{
    $scope.$parent.loaded('side-menu');

    $scope.$on('window.resize', function(e)
    {
        //사이드메뉴 강제로 접고 펼쳤던것 원상복구
        var link = angular.element('#side-menu-responsive-css');
        link.removeAttr('disabled');
        if(link.attr('prev-media'))
            link.attr('media', link.attr('prev-media'));
    });

    // 사이드메뉴 닫기, 열기
    $scope.toggleSideMenu = function(e)
    {
        //미디어 쿼리가 활성화되면 접힌다. 미디어 쿼리가 활성화된 상태에서 강제로 펼치려면 disabled속성을 넣어서 비활성화 시켜주면 된다.
        //미디어 쿼리가 비활성화됬을때 접으려면 media속성을 없애고 disabled도 없애면 된다. 그러면 무조건 접힘 css가 적용된다.
        var sidenav = document.querySelector('.sidenav');
        if(!sidenav)
            return;

        var link = angular.element('#side-menu-responsive-css');
        var style = getComputedStyle(sidenav);

        //PlayChat 로고를 클릭해서 메뉴가 접히는 현상을 막기 위함
        if(e && e.currentTarget.className == 'logo-min' && getComputedStyle(e.currentTarget).backgroundImage == 'none')
            return;

        if(style.width == '250px')
        {
            //펼쳐진 상태이므로 접어야 한다.
            link.removeAttr('disabled'); //disabled 제거 - 접힌상태에서 사람이 버튼 클릭으로 펼치면 disabled가 생기기 때문에 제거해줘야 함.
            var media = link.attr('media'); //media쿼리 제거 - 제거하지 않으면 미디어쿼리가 비활성화 된 조건에서는 접히지 않는다. 제거 하면 무조건 활성화 되므로 접힌다.
            link.attr('prev-media', media);
            link.removeAttr('media');
        }
        else
        {
            //접힌 상태이므로 펼쳐야 한다.
            link.attr('disabled', ''); //이거만 추가해도 접힘 css가 적용되지 않기 때문에 펼쳐진다.

            //사용자가 강제로 펼친경우에는 미디어쿼리가 활성화 되더라도 접히지 않는게 정상이다.
        }
    };

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


    (function()
    {
        //initialize scope variables
        if($window.__CONFIG.PLATFORM == 'mobile')
        {
        }
    })();
}]);
