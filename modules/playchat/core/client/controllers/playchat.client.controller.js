'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('PlayChatController', ['$location', '$scope', '$timeout', function ($location, $scope, $timeout)
{
    $scope.componentsLoaded = {
        'side-menu': false
    };

    //각 컴포넌트가 자신의 로딩작업이 끝나면 호출한다.
    $scope.loaded = function()
    {
        for(var key in $scope.componentsLoaded)
        {
            if($scope[key] === false)
                return;
        }

        $scope.$parent.loading = false;
    };
}]);
