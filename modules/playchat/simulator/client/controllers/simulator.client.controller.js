'use strict';

//플레이챗 전반적인 관리

angular.module('playchat.simulator').controller('SimulatorController', ['$window', '$scope', function ($window, $scope)
{
    $scope.$parent.loaded('simulator');

    // --------- Simulator 접기 펼치기 기능.
    (function()
    {
        $scope.isClosed = false;
        $scope.toggle = function(e)
        {
            $scope.isClosed = angular.element('.simulator-btn').is(':visible');

            var link = angular.element('#simulator-responsive-css');
            if(!$scope.isClosed)
            {
                //접기
                link.attr('data-media', link.attr('media')).removeAttr('media').removeAttr('disabled');
            }
            else
            {
                //시뮬레이터가 보이게 하는 부분
                link.attr('media', link.attr('data-media')).attr('disabled', '');
            }
        };
    })();
}]);
