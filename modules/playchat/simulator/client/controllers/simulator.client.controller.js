'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('SimulatorController', ['$window', '$scope', function ($window, $scope)
{
    $scope.$parent.loaded('simulator');

    $scope.isClosed = false;

    var workspace = angular.element('.workspace');
    $scope.$on('window.resize', function(a, b)
    {
        $scope.$apply(function()
        {
            workspace.removeClass('full');
            var link = angular.element('#simulator-responsive-css');
            link.removeAttr('disabled');
            if(link.attr('prev-media'))
                link.attr('media', link.attr('prev-media'));
        });
    });

    $scope.toggle = function(e)
    {
        if(e.currentTarget.className.indexOf('simulator-btn') != -1)
            $scope.isClosed = true;

        var link = angular.element('#simulator-responsive-css');

        if(!$scope.isClosed)
        {
            $scope.isClosed = true;

            //시뮬레이터를 안보이게 하는 부분
            workspace.addClass('full');

            link.removeAttr('disabled');
            var media = link.attr('media');
            link.attr('prev-media', media);
            link.removeAttr('media');
        }
        else
        {
            $scope.isClosed = false;

            //시뮬레이터가 보이게 하는 부분
            workspace.removeClass('full');
            link.attr('disabled', '');
        }
    };
}]);
