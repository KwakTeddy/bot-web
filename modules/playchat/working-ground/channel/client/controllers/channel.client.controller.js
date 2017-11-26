'use strict';

angular.module('playchat').controller('ChannelController', ['$scope', '$resource', '$cookies', function ($scope, $resource, $cookies)
{
    $scope.$parent.changeWorkingGroundName('Channel', '/modules/playchat/gnb/client/imgs/channel.png');

    $scope.$parent.loaded('working-ground');

    console.log('채널');
}]);
