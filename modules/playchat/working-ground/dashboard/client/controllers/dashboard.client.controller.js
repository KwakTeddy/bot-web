'use strict';

angular.module('playchat').controller('DashboardController', ['$window', '$scope', '$cookies', function ($window, $scope, $cookies)
{
    $scope.$parent.changeWorkingGroundName('Dashboard', '/modules/playchat/gnb/client/imgs/dashboard.png');

    var chatbot = $cookies.getObject('chatbot');

    $scope.chatbot = chatbot;

    $scope.$parent.loaded('working-ground');
}]);
