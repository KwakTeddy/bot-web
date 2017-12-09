'use strict';

angular.module('playchat').controller('DashboardController', ['$window', '$scope', '$cookies', 'LanguageService',function ($window, $scope, $cookies, LanguageService)
{
    $scope.$parent.changeWorkingGroundName('Dashboard', '/modules/playchat/gnb/client/imgs/dashboard_grey.png');

    var chatbot = $cookies.getObject('chatbot');

    console.log('챗봇 : ', chatbot);

    $scope.chatbot = chatbot;

    $scope.$parent.loaded('working-ground');

    $scope.lan=LanguageService;
}]);
