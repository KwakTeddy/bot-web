'use strict';

angular.module('playchat').controller('BizSummaryChatbotAnalysisController', ['$scope', '$location','$rootScope','PagingService', '$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope,$location, $rootScope, PagingService, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary') + ' >> ' + LanguageService('Chatbot'), '/modules/playchat/gnb/client/imgs/summary.png');
    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
    var user = $cookies.getObject('user');

    var SendNumBySendDateService = $resource('/api/:botId/:startDate/:endDate/analysis/sendMsgNumForSendDate', { botId: '@botId' });
    var ResponseHumNumService = $resource('/api/:botId/:startDate/:endDate/analysis/resHumNum', { botId: '@botId' });

    $scope.Bot = {};
    $scope.Messages = [];
    $scope.date = {};

    (function()
    {
        var data = JSON.parse(sessionStorage.getItem('botMsg'));
        // sessionStorage.removeItem('botMsg')
        console.log('데이터 : ', data);
        data.matched = true;

        //change page
        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        $scope.search = function(e)
        {
            if(e.keyCode >= 13)
            {
                if(e.currentTarget.value) {
                    $scope.searchword = e.currentTarget.value;

                    ChatBotService.query({ type : true}, function(lists)
                    {
                        $scope.Bot = {};
                        var Matched = false;
                        if(lists.length > 0 ){
                            lists.forEach((list,index) => {
                                if(list.name === $scope.searchword){
                                    $scope.Bot.name = list.name;
                                    $scope.Bot.id = list.id;

                                    data = $scope.Bot;

                                    data.matched = true;
                                    Matched = true;
                                    $scope.getList(1);
                                }
                                else if(index === lists.length -1 && Matched === false ){
                                    data = {};
                                    data.name = e.currentTarget.value;

                                    data.matched = false;
                                    $scope.getList(1);
                                }
                            });
                        }
                        else{
                            data = {};
                            data.name = e.currentTarget.value;
                            data.matched = false;
                            $scope.getList(1);
                        }
                    });
                }
                else{
                    data = {};
                    data.name = e.currentTarget.value;

                    data.matched = false;
                    $scope.searchword = undefined;
                    $scope.getList(1);
                }
            }
            else if(e.keyCode == 8)
            {
                //backspace

                if(e.currentTarget.value.length == 1)
                {
                    data = {};
                    data.name = e.currentTarget.value;
                    data.matched = false;
                    $scope.searchword = undefined;
                    $scope.getList(1);
                }
            }
        };


        $scope.getList = function(page)
        {
            var datas = [];
            var labels = [];
            var dataPoints = [];
            angular.element('#search').val(data.name);

            $scope.date.start = $scope.dateFormat($scope.date.start);
            $scope.date.end = $scope.dateFormat($scope.date.end);

            if(data.matched) {
                SendNumBySendDateService.get({ botId: data.id, startDate: $scope.date.start, endDate: $scope.date.end},function (result) {
                    // var totalPage = 5 < 10 ? 1 : Math.round(5 / 10);
                    //     page = page || 1;
                    //     $scope.pageOptions = PagingService(page, totalPage);
                    //     console.log('$scope.pageOptions: ' + JSON.stringify($scope.pageOptions));

                    console.log('result: ' + JSON.stringify(result));
                });
                // for (var i = 0; i < 6; i++) {
                //     $scope.Messages[i] = {};
                //     $scope.Messages[i].index = i + 1;
                //     $scope.Messages[i].sendDate = '2018.07.18 06:00';
                //     $scope.Messages[i].sendNum = "100";
                //     $scope.Messages[i].sendSuccNum = "20";
                //     $scope.Messages[i].sendFee = "100000";
                //     $scope.Messages[i].sendFeeForOne = 100;
                //     $scope.Messages[i].sendSuccRate = 40;
                //     $scope.Messages[i].id = '123456';
                //     $scope.Messages[i].reply = "70";
                //     $scope.Messages[i].sendSuccAverage = "15";
                //     $scope.Messages[i].replyAverage = "15";
                //     $scope.Messages[i].feeAverage = "1000";
                //     $scope.Messages[i].feeForOneAverage = 80;
                //     $scope.Messages[i].sendNumAverage = "300";
                //     $scope.Messages[i].botName = data.name;
                //     //chart datas
                //     datas.push(0);
                //     labels.push('0');
                //     dataPoints.push(
                //         {
                //             sendSuccNum: 100,
                //             sendSuccFee: 1000,
                //             sendDate: "2018.08.24 0601"
                //         }
                //     );
                //
                //     // var totalPage = list.length < 10 ? 1 : Math.round(list.length / 10);
                //     var totalPage = 5 < 10 ? 1 : Math.round(5 / 10);
                //     page = page || 1;
                //     $scope.pageOptions = PagingService(page, totalPage);
                //     console.log('$scope.pageOptions: ' + JSON.stringify($scope.pageOptions));
                // }
            }else{
                $scope.Messages = [];
            }

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

        $scope.goReportPage = function(event, data)
        {
            sessionStorage.setItem('SummaryReport',JSON.stringify(data));
            $location.path('/playchat/analysis/biz-summary-chatbot-report');
        };


    })();
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList); // startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()
    $scope.getList();
    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
