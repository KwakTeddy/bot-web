'use strict';

angular.module('playchat').controller('ChannelController', ['$scope', '$resource', '$cookies', 'LanguageService',function ($scope, $resource, $cookies, LanguageService)
{
    $scope.$parent.changeWorkingGroundName('Channel', '/modules/playchat/gnb/client/imgs/channel.png');

    $scope.$parent.loaded('working-ground');

    console.log('채널');

    $scope.lan=LanguageService;
}]);
