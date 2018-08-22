'use strict';

angular.module('playchat').controller('BizSummaryChatbotAnalysisController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary') + ' >> ' + LanguageService('Chatbot'), '/modules/playchat/gnb/client/imgs/summary.png');

    $scope.Bot = [];
    $scope.Messages = [];
    $scope.date = {};

    (function()
    {
        var hash = location.hash;
        var data = JSON.parse(decodeURIComponent(hash.substring(1)));
        console.log('데이터 : ', data);

        $scope.getList = function()
        {
            $scope.Bot.name = data.name;
            for(var i=0; i<6; i++){
                $scope.Messages[i] = {};
                $scope.Messages[i].index = i+1;
                $scope.Messages[i].sendDate = '2018.07.18.0600';
                $scope.Messages[i].sendNum = 0;
                $scope.Messages[i].sendSuccNum = 0;
                $scope.Messages[i].sendFee = 0;
                $scope.Messages[i].sendFeeForOne = 0;
                $scope.Messages[i].sendSuccRate = 40;
            }

            angular.element('.main-logo-background').css('opacity', 0);
            angular.element('.main-logo-background').css('display', 'none');
        };

    })();
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
    $scope.getList();
    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
