'use strict';

angular.module('playchat').controller('BizSummaryChatbotReportAnalysisController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService', function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary') + ' >> ' + LanguageService('Report'), '/modules/playchat/gnb/client/imgs/summary.png');
    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });

    $scope.Messages = [];

    (function()
    {
        var hash = location.hash;
        var data = JSON.parse(decodeURIComponent(hash.substring(1)));
        console.log('데이터 : ', data);
        $scope.Messages[0] = data;
        $scope.Messages[0].sendSuccAverageRate = (data.sendSuccNum - data.sendSuccAverage) / data.sendSuccAverage;
        $scope.Messages[0].sendSuccAverageRate = (data.sendSuccNum - data.sendSuccAverage) / data.sendSuccAverage;



        $scope.getList = function()
        {
            var datas = [];
            var labels = ["이탈률=(실패)/(발송 대상)", "성공률=(성공)/(발송 대상)", "응답률=(답장을 한 고객)/(발송 대상)"];

            datas[0] = (data.sendNum - data.sendSuccNum)/ data.sendNum;
            datas[1] = data.sendSuccRate;
            datas[2] = data.reply / data.sendNum;

            //chart setting data
            var color = {
                background:'#38b0f2',
                border:'#38b0f2'
            };

            var config = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '',
                        fill: false,
                        pointStyle: 'circle',
                        pointRadius: 7,
                        pointHoverRadius: 10,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: color.border,
                        pointBorderWidth: 3,
                        lineTension: 0,
                        backgroundColor: color.background,
                        borderColor: color.border,
                        borderWidth: 8,
                        data: datas
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            stacked: true,
                            ticks: {
                                min: 0
                            }
                        }],
                        xAxes: [{
                            stacked: true
                        }]
                    },
                    layout: {
                        padding: {
                            left: 0,
                            right: 10,
                            top: 30,
                            bottom: 50
                        }
                    },
                    tooltipCornerRadius: 5,
                    animation: false
                }
            };
            //chart draw
            var lineContext = document.getElementById("sendRateChart").getContext("2d");
            var LineChart = new Chart(lineContext, config);

            angular.element('.main-logo-background').css('opacity', 0);
            angular.element('.main-logo-background').css('display', 'none');
        };

        $scope.dateFormat = function(date)
        {
            if(!date)
                return;

            date = new Date(date);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var dateOfMonth = date.getDate();

            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();

            month = month < 10 ? '0' + month : month;
            dateOfMonth = dateOfMonth < 10 ? '0' + dateOfMonth : dateOfMonth;

            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;
            sec = sec < 10 ? '0' + sec : sec;

            return year + '-' + month + '-' + dateOfMonth + ' ' + hour + ':' + min + ':' + sec;
        };

    })();
    $scope.getList();
    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
