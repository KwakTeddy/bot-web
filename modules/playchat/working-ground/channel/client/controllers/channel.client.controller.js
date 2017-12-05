'use strict';

angular.module('playchat').controller('ChannelController', ['$scope', '$resource', '$cookies', '$location', 'LanguageService', function ($scope, $resource, $cookies, $location, LanguageService)
{
    $scope.$parent.changeWorkingGroundName('Channel', '/modules/playchat/gnb/client/imgs/channel.png');

    $scope.$parent.loaded('working-ground');

    console.log('채널');

    $scope.host = 'https://' + $location.host() + ($location.port() ? ':' + $location.port() : $location.port());
    $scope.chatbot = $cookies.getObject('chatbot');

    $scope.help = {
        kakao: false,
        naver: false,
        line: false,
        facebook: false
    }

    (function()
    {
        $scope.connectFacebook = function()
        {

        };

        $scope.viewHelp = function(name)
        {

        };
    })();


    $scope.lan=LanguageService;
}]);
