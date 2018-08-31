'use strict';

angular.module('playchat').controller('DashboardController', ['$window', '$scope', '$cookies', '$location', 'LanguageService',function ($window, $scope, $cookies, $location, LanguageService)
{
    $scope.$parent.changeWorkingGroundName('Dashboard', '/modules/playchat/gnb/client/imgs/dashboard_grey_1.png');
    $location.url('/playchat/development/my-bot');
    var chatbot = $cookies.getObject('chatbot');

    $scope.chatbot = chatbot;

    $scope.isFirst = $location.search().isFirst;

    $scope.$parent.loaded('working-ground');

    $scope.lan=LanguageService;
}]);
