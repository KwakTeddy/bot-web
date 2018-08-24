'use strict';

angular.module('playchat').controller('BizSummaryChatbotAnalysisController', ['$scope', '$rootScope','PagingService', '$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope, $rootScope, PagingService, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService)
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

        //为data准备的数据
        var datas = [10,15,16,25];
        var labels = ["1","2","3","4"];
        var dataPoints = [
            {sendSuccNum: 100, sendSuccFee: 1000, sendDate: "2018.08.24 0601"},
            {sendSuccNum: 120, sendSuccFee: 1200, sendDate: "2018.08.24 0602"},
            {sendSuccNum: 120, sendSuccFee: 1200, sendDate: "2018.08.24 0603"},
            {sendSuccNum: 190, sendSuccFee: 1900, sendDate: "2018.08.24 0604"}

        ];

        var color = {
            background:'#38b0f2',
            border:'#38b0f2'
        };

        var config = {
            type: 'line',
            data: {
                labels:labels,
                datasets: [{
                    label: '챗봇 성공률',
                    fill: false,
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    lineTension: 0,
                    backgroundColor: color.background,
                    borderColor: color.border,
                    data: datas,
                    dataPoints: dataPoints,
                }]
            },
            options: {
                // responsive: true,
                tooltipCornerRadius: 5,
                animation: false,
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        title: function(tooltipItems, data) {
                            var sendDate = data.datasets[0].dataPoints[tooltipItems[0].index].sendDate;
                            return "" + sendDate;
                        },
                        label: function(tooltipItem, data) {
                            var sendSuccNum = data.datasets[0].dataPoints[tooltipItem.index].sendSuccNum;
                            var sendSuccFee = data.datasets[0].dataPoints[tooltipItem.index].sendSuccFee;
                            return "성공: " + sendSuccNum + "\n\n 비용: " + sendSuccFee;
                        }
                    }
                }
            }
        };



        var lineContext = document.getElementById("sendSuccRateChart").getContext("2d");
        var LineChart = new Chart(lineContext, config);

        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        $scope.getList = function(page)
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

                // var totalPage = list.length < 10 ? 1 : Math.round(list.length / 10);
                var totalPage = 5 < 10 ? 1 : Math.round(5 / 10);
                page = page || 1;
                $scope.pageOptions = PagingService(page, totalPage);
                console.log('$scope.pageOptions: ' + JSON.stringify($scope.pageOptions));
            }

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
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
    $scope.getList();
    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
