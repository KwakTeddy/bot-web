'use strict';

angular.module('playchat').controller('SummaryAnalysisController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService', function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Summary'), '/modules/playchat/gnb/client/imgs/summary.png');

    var TotalDialogService = $resource('/api/:botId/analysis/total-dialog-count', { botId: '@botId' });
    var PeriodDialogService = $resource('/api/:botId/analysis/period-dialog-count', { botId: '@botId' });
    var TotalUserService = $resource('/api/:botId/analysis/total-user-count', { botId: '@botId' });
    var PeriodUserService = $resource('/api/:botId/analysis/period-user-count', { botId: '@botId' });
    var LiveUserService = $resource('/api/:botId/analysis/live-user-count', { botId: '@botId' });
    var DailyDialogUsage = $resource('/api/:botId/analysis/daily-dialog-usage', { botId: '@botId' });
    var UserInputStatistics = $resource('/api/:botId/analysis/user-input-statistics', { botId: '@botId' });
    var FailDialogsService = $resource('/api/:botId/analysis/fail-dialogs', { botId: '@botId' });
    var ScenarioUsageService = $resource('/api/:botId/analysis/scenario-usage', { botId: '@botId' });
    var chatbot = $cookies.getObject('chatbot');

    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    var endDate = new Date();

    $scope.data = {
        totalDialogCount: 0,
        periodDialogCount: 0,
        totalUserCount: 0,
        periodUserCount: 0,
        liveUserCount: 0
    };

    $scope.userInputStatistics = [];
    $scope.failDialogs = [];
    $scope.scenarioUsageList = [];

    var color = {
        background:{
            kakao: 'rgba(251, 230, 0, 0.70)',
            facebook: 'rgba(59, 89, 152, 0.70)',
            navertalk: 'rgba(0, 199, 60, 0.70)',
            socket: 'gray',
            success: "rgba(66, 133, 244, 0.70)",
            fail: "rgba(221, 81, 68, 0.70)"
        },
        border:{
            kakao: '#ede500',
            facebook: '#29487d',
            navertalk: '#00af35',
            socket: 'gray',
            success: "rgb(51, 126, 248)",
            fail: "rgb(147, 75, 61)"
        }
    };


    (function()
    {
        TotalDialogService.get({ botId: chatbot.id }, function(result)
        {
            $scope.data.totalDialogCount = result.count;
            console.log('totalDialogCount : ', result.count);
        },
        function(err)
        {
            alert(err.data.error || err.data.message);
        });

        PeriodDialogService.get({ botId: chatbot.id, startDate: startDate.toISOString(), endDate: endDate.toISOString() }, function(result)
        {
            $scope.data.periodDialogCount = result.count;
            console.log('periodDialogCount : ', result.count);
        },
        function(err)
        {
            alert(err.data.error || err.data.message);
        });

        TotalUserService.get({ botId: chatbot.id }, function(result)
        {
            $scope.data.totalUserCount = result.list.length;

            var facebook = 0;
            var kakao = 0;
            var naver = 0;
            var socket = 0;

            result.list.forEach(function (data) {
                switch (data.channel)
                {
                    case 'facebook':
                        facebook++;
                        break;
                    case 'kakao':
                        kakao++;
                        break;
                    case 'naver':
                        naver++;
                        break;
                    case 'socket':
                        socket++;
                        break;
                    default :
                        break;

                }
            });

            var context = document.getElementById("botUserByChannel").getContext('2d');
            var data = {
                labels: [LanguageService('KaKao Talk'), LanguageService('Facebook'), LanguageService('Naver talk talk'), LanguageService('Socket')],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        color.background.kakao,
                        color.background.facebook,
                        color.background.navertalk,
                        color.background.socket
                    ],
                    borderColor: [
                        color.border.kakao,
                        color.border.facebook,
                        color.border.navertalk,
                        color.border.socket
                    ],
                    borderWidth: 1
                }]
            };
            var options = {
            };
            data.datasets[0].data.push(kakao);
            data.datasets[0].data.push(facebook);
            data.datasets[0].data.push(naver);
            data.datasets[0].data.push(socket);

            var myChart = new Chart(context, {
                type: 'doughnut',
                data: data,
                options: options
            });

        },
        function(err)
        {
            alert(err.data.error || err.data.message);
        });

        PeriodUserService.get({ botId: chatbot.id, startDate: startDate.toISOString(), endDate: endDate.toISOString() }, function(result)
        {
            $scope.data.periodUserCount = result.count;
            console.log('periodUserCount : ', result.count);
        },
        function(err)
        {
            alert(err.data.error || err.data.message);
        });

        LiveUserService.get({ botId: chatbot.id }, function(result)
        {
            $scope.data.liveUserCount = result.count;
            console.log('liveUserCount : ', result.count);
        },
        function(err)
        {
            alert(err.data.error || err.data.message);
        });

        DailyDialogUsage.query({ botId: chatbot.id, startDate: startDate.toISOString(), endDate: endDate.toISOString() }, function(doc)
        {
            var context = document.getElementById("dailyDialogUsage").getContext('2d');
            var pieContext = document.getElementById("dialogSuccessRate").getContext('2d');
            var data = {
                labels: [],
                datasets: [
                    {
                        label: LanguageService('KaKao Talk'),
                        backgroundColor: color.border.kakao,
                        borderColor: color.background.kakao,
                        data: [],
                        lineTension: 0,
                        fill:false
                    },
                    {
                        label: LanguageService('Facebook'),
                        backgroundColor: color.border.facebook,
                        borderColor: color.background.facebook,
                        data: [],
                        lineTension: 0,
                        fill:false
                    },
                    {
                        label: LanguageService('Naver talk talk'),
                        backgroundColor: color.border.navertalk,
                        borderColor: color.background.navertalk,
                        data: [],
                        lineTension: 0,
                        fill:false
                    },
                    {
                        label: LanguageService('Socket'),
                        backgroundColor: color.border.socket,
                        borderColor: color.background.socket,
                        data: [],
                        lineTension: 0,
                        fill:false
                    },
                    {
                        label: LanguageService('Total'),
                        backgroundColor: "#444444",
                        borderColor: "#444444",
                        data: [],
                        lineTension: 0,
                        fill:false
                    }

                ]
            };

            var pieData = {
                labels: [LanguageService('Success'), LanguageService('Fail')],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        "#3367d6",
                        "#ca0a13"
                    ],
                    borderColor: [
                        "rgb(51, 126, 248)",
                        "rgb(147, 75, 61)"
                    ],
                    borderWidth: 1
                }]
            };

            var array = [];
            var startYear =  startDate.getFullYear();
            var startMonth = startDate.getMonth() + 1;
            var startDay =   startDate.getDate();
            var endYear =  endDate.getFullYear();
            var endMonth = endDate.getMonth() + 1;
            var endDay =   endDate.getDate();
            var year;
            var month;
            var day = startDay;

            var isFailDialogCount = 0;
            var isSuccessDialogCount = 0;

            for(var i = startDay;((day != endDay) || (month != endMonth) ||  (year != endYear)) && i<100; i++){
                var date = new Date(startYear, startMonth - 1, i);
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                array.push(year + '/'+ month + '/' + day)
            }
            data.labels = array;

            array.forEach(function (date, index) {
                var Year =  parseInt(date.split('/')[0]);
                var Month = parseInt(date.split('/')[1]);
                var Day =   parseInt(date.split('/')[2]);
                var exist = false;
                for (var i = 0; i < doc.length; i++) {
                    if((doc[i]._id.year == Year) && (doc[i]._id.month == Month) && (doc[i]._id.day == Day)){
                        exist = true;
                        data.datasets[0].data.push(doc[i].kakao);
                        data.datasets[1].data.push(doc[i].facebook);
                        data.datasets[2].data.push(doc[i].navertalk);
                        data.datasets[3].data.push(doc[i].socket);
                        data.datasets[4].data.push(doc[i].total);

                        isFailDialogCount += doc[i].fail;
                        isSuccessDialogCount += doc[i].total - doc[i].fail;

                        break;
                    }
                }
                if(!exist){
                    data.datasets[0].data.push(0);
                    data.datasets[1].data.push(0);
                    data.datasets[2].data.push(0);
                    data.datasets[3].data.push(0);
                    data.datasets[4].data.push(0);
                }
            });

            pieData.datasets[0].data.push(isSuccessDialogCount);
            pieData.datasets[0].data.push(isFailDialogCount);
            var myChart = new Chart(context, {
                type: 'line',
                data: data,
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                },
                plugins: [
                    {
                        afterInit: function() {
                        }
                    }
                ]
            });
            var pieChart = new Chart(pieContext, {
                type: 'pie',
                data: pieData,
                options: {
                }
            });
        },
        function(err)
        {
            alert(err.data.error || err.data.message);
        });

        UserInputStatistics.query({ botId: chatbot.id, startDate: startDate.toISOString(), endDate: endDate.toISOString(), limit: 10 }, function(result)
        {
            console.log(result)
            $scope.userInputStatistics = JSON.parse(JSON.stringify(result));
        },
        function(err)
        {
            alert(err.data.error || err.data.message);
        });

        FailDialogsService.query({ botId: chatbot.id, startDate: startDate.toISOString(), endDate: endDate.toISOString(), limit: 10 }, function(result)
        {
            console.log('ㅁㄴㅇㄹ', result);
            $scope.failDialogs = JSON.parse(JSON.stringify(result));
        },
        function(err)
        {
            alert(err.data.error || err.data.message);
        });

        ScenarioUsageService.get({ botId: chatbot.id, startDate: startDate.toISOString(), endDate: endDate.toISOString(), limit: 10 }, function(result)
        {
            $scope.scenarioUsageList = result.scenarioUsage;
        },
        function(err)
        {
            alert(err.data.error || err.data.message);
        });
    })();

    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
