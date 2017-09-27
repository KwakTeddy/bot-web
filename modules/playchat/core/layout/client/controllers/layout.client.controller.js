'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('PlayChatController', ['$location', '$scope', 'WindowResizeService', '$state', '$stateParams', function ($location, $scope, WindowResizeService, $state, $stateParams)
{
    $scope.componentsLoaded = {
        'side-menu': false,
        'top-bar': false,
        'simulator': false,
        'log-analysis': false
    };

    WindowResizeService.subscribeMe();

    var page = $stateParams.page ? $stateParams.page : 'summary';
    $scope.page = '/modules/playchat/working-ground/' + page + '/client/views/' + page + '.client.view.html';

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
    };
}]);
