'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('LayoutController', ['$location', '$scope', '$rootScope', 'EventService', '$state', '$stateParams', '$compile', function ($location, $scope, $rootScope, EventService, $state, $stateParams, $compile)
{
    $scope.componentsLoaded = {
        'side-menu': false,
        'top-bar': false,
        'simulator': false,
        'log-analysis': false,
        'working-ground': false
    };

    EventService.subscribeMe();

    var templateName = $stateParams.templateName || '';
    var templatePage = $stateParams.templatePage || '';

    //각 컴포넌트가 자신의 로딩작업이 끝나면 호출한다.
    $scope.loaded = function(name)
    {
        $scope.componentsLoaded[name] = true;
        for(var key in $scope.componentsLoaded)
        {
            if($scope.componentsLoaded[key] === false)
                return;
        }

        $scope.$parent.loading = false;

        angular.element('.working-ground').on('scroll', function(e)
        {
            if(e.currentTarget.scrollTop + e.currentTarget.offsetHeight >= e.currentTarget.scrollHeight)
            {
                $scope.$broadcast('working-ground-scroll-bottom', e);
            }
        });
    };

    $scope.changeWorkingGroundName = function(name, imgUrl)
    {
        $rootScope.$broadcast('update-topbar-title', { name: name, imgUrl: imgUrl });
    };

    if(templateName && templatePage)
    {
        $scope.page = '/templates/' + templateName + '/views/html/' + templatePage + '.html';

        $scope.loaded('working-ground');
    }
    else
    {
        var category = $stateParams.category ? $stateParams.category : '';
        var page = $stateParams.page ? $stateParams.page : 'dashboard';
        var detail = $stateParams.detail ? $stateParams.detail: '';

        $scope.page = '/modules/playchat/working-ground/' + page + '/client/views/' + page + (category ? '-' + category : '') + (detail ? '-' + detail : '') + '.client.view.html';
    }
}]);
