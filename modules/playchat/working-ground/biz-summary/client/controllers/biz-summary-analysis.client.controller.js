'use strict';

angular.module('playchat').controller('BizSummaryAnalysisController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService', function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Summary') + LanguageService('Chatbot'), '/modules/playchat/gnb/client/imgs/summary.png');
    var user = $cookies.getObject('user');
    console.log('user' + JSON.stringify(user));

    $scope.User = [];

    (function()
    {
        $scope.getList = function()
        {
            $scope.User.name = user.displayName;
        };

    })();
    $scope.getList();
    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
