'use strict';

angular.module('playchat').controller('BizSummaryChatbotReportAnalysisController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService', function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary') + ' >> ' + LanguageService('Chatbot'), '/modules/playchat/gnb/client/imgs/summary.png');
    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });

    $scope.Bot = [];
    $scope.Messages = [];
    $scope.date = {};

    (function()
    {
        var hash = location.hash;
        var data = JSON.parse(decodeURIComponent(hash.substring(1)));
        console.log('데이터 : ', data);


        $scope.getList = function(page)
        {
            var datas = [];
            var labels = [];
            var dataPoints = [];

                for (var i = 0; i < 6; i++) {
                    $scope.Messages[i] = {};
                    $scope.Messages[i].index = i + 1;
                    $scope.Messages[i].sendDate = '2018.07.18.0600';
                    $scope.Messages[i].sendNum = 0;
                    $scope.Messages[i].sendSuccNum = 0;
                    $scope.Messages[i].sendFee = 0;
                    $scope.Messages[i].sendFeeForOne = 0;
                    $scope.Messages[i].sendSuccRate = 40;
                    //chart datas
                    datas.push(0);
                    labels.push('0');
                    dataPoints.push(
                        {
                            sendSuccNum: 100,
                            sendSuccFee: 1000,
                            sendDate: "2018.08.24 0601"
                        }
                    );

                    // var totalPage = list.length < 10 ? 1 : Math.round(list.length / 10);
                    var totalPage = 5 < 10 ? 1 : Math.round(5 / 10);
                    page = page || 1;
                    $scope.pageOptions = PagingService(page, totalPage);
                    console.log('$scope.pageOptions: ' + JSON.stringify($scope.pageOptions));

            //chart setting data
            var color = {
                background:'#38b0f2',
                border:'#38b0f2'
            };

            var config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '챗봇 성공률',
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
                        data: datas,
                        dataPoints: dataPoints
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
                    legend: {
                        display: true,
                        labels: {
                            usePointStyle: true,
                            generateLabels: function(chart){
                                return  chart.data.datasets.map(function(dataset, i) {
                                    return {
                                        text: '챗봇 성공률',
                                        fillStyle: dataset.backgroundColor,
                                        hidden: dataset.hidden,
                                        lineCap: 'round',
                                        lineDash: dataset.borderDash,
                                        lineDashOffset: dataset.borderDashOffset,
                                        lineJoin: dataset.borderJoinStyle,
                                        lineWidth: 6,
                                        strokeStyle: dataset.borderColor,
                                        pointStyle: 'line',
                                        datasetIndex: i
                                    };
                                });
                            }
                        },
                    },
                    tooltipCornerRadius: 5,
                    animation: false,
                    tooltips: {
                        legend: {
                            display: true,
                        },
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
            //chart draw
            var lineContext = document.getElementById("sendSuccRateChart").getContext("2d");
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
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
    $scope.getList();
    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
