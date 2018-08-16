'use strict';

angular.module('playchat').controller('SessionAnalysisController', ['$scope', '$cookies', '$resource', 'DateRangePickerService', 'ExcelDownloadService','LanguageService', function ($scope, $cookies, $resource, DateRangePickerService, ExcelDownloadService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Session'), '/modules/playchat/gnb/client/imgs/session.png');

    var SessionAnalysisService = $resource('/api/:botId/analysis/session-usage', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');

    var color = {
        background:{
            kakao: '#fbe600',
            facebook: '#3b5998',
            navertalk: '#00c73c',
            socket: 'gray',
            etc: '#903cff'
        }, border:{
            kakao: '#ede500',
            facebook: '#29487d',
            navertalk: '#00af35',
            socket: 'gray',
            etc: '#722dce'
        }
    };

    var excelData = undefined;

    //스코프 변수 선언
    $scope.date = {};
    $scope.list = [];

    (function()
    {
        var checkNewSession = function(s, d)
        {
            var time = (d.getTime() - s.getTime()) / 1000;
            return (time / 60) > 5;
        };

        var sessionCountContext = document.getElementById("sessionCountChart").getContext('2d');
        var sessionAverageCountContext = document.getElementById('sessionAverageCountChart').getContext('2d');

        var sessionCountDataTemplate = {
            labels: [],
            datasets: [{
                label: LanguageService('Kakaotalk'),
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }, {
                label: LanguageService('Facebook'),
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }, {
                label: LanguageService('Naver talk talk'),
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }, {
                label: LanguageService('Socket'),
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }, {
                label: 'ETC',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }]
        };

        var sessionAverageCountDataTemplate = {
            labels: [],
            datasets: [{
                label: LanguageService('Average amount of traffic per session'),
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }]
        };

        var sessionCountChart = new Chart(sessionCountContext, {
            type: 'bar',
            data: angular.copy(sessionCountDataTemplate),
            options: {
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });

        var sessionAverageCountChart = new Chart(sessionAverageCountContext, {
            type: 'bar',
            data: angular.copy(sessionAverageCountDataTemplate),
            options: {
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });

        var excelData = [];

        $scope.getList = function()
        {
            SessionAnalysisService.query({ botId: chatbot.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(result)
            {
                excelData = [];

                var list = {};

                var check = {};

                for(var i=0; i<result.length; i++)
                {
                    var date = new Date(result[i].created);

                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var dayOfMonth = date.getDate();

                    if(!check[result[i].userId] || checkNewSession(check[result[i].userId], date))
                    {
                        if(!list[year + '-' + month + '-' + dayOfMonth])
                        {
                            list[year + '-' + month + '-' + dayOfMonth] = { kakao: 0, facebook: 0, navertalk: 0, dialogCount: 0, socket: 0, etc: 0};
                        }

                        //만약 UserID에 대해 새로운 세션이라면.
                        // 여기는 세션수 체크

                        var channelName = result[i].channel.name? result[i].channel.name : 'etc';

                        list[year + '-' + month + '-' + dayOfMonth][channelName]++;

                        check[result[i].userId] = date;
                    }

                    // 모든 대화 수
                    list[year + '-' + month + '-' + dayOfMonth].dialogCount++;
                }

                console.log('세션 : ', list);

                var labels = [];
                var dataset = [{
                    label: LanguageService('Kakaotalk'),
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }, {
                    label: LanguageService('Facebook'),
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }, {
                    label: LanguageService('Naver talk talk'),
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }, {
                    label: LanguageService('Socket'),
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }, {
                    label: 'ETC',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }];

                var averageDataset = [{
                    label: LanguageService('Average amount of traffic per session'),
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }];

                var startDate = new Date($scope.date.start);
                var endDate = new Date($scope.date.end);

                while(startDate.getTime() <= endDate.getTime())
                {
                    labels.push(startDate.getFullYear() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getDate());
                    var key = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
                    if(list[key])
                    {
                        dataset[0].data.push(list[key].kakao);
                        dataset[1].data.push(list[key].facebook);
                        dataset[2].data.push(list[key].navertalk);
                        dataset[3].data.push(list[key].socket);
                        dataset[4].data.push(list[key].etc);

                        var avg = Math.round(list[key].dialogCount / (list[key].kakao + list[key].facebook + list[key].navertalk + list[key].socket + list[key].etc));
                        averageDataset[0].data.push(avg);

                        excelData.push({ year: startDate.getFullYear(), month: startDate.getMonth() + 1, date : startDate.getDate(), kakao: list[key].kakao, facebook: list[key].facebook, navertalk: list[key].navertalk, socket: list[key].socket, etc: list[key].etc, average: avg });
                        // averageDatas.push({ date: key, count: Math.round(list[key].dialogCount / (list[key].kakao + list[key].facebook + list[key].navertalk)) });
                    }
                    else
                    {
                        dataset[0].data.push(0);
                        dataset[1].data.push(0);
                        dataset[2].data.push(0);
                        dataset[3].data.push(0);
                        dataset[4].data.push(0);

                        averageDataset[0].data.push(0);

                        excelData.push({ year: startDate.getFullYear(), month: startDate.getMonth() + 1, date : startDate.getDate(), kakao: 0, facebook: 0, navertalk: 0, socket : 0, etc : 0, average: 0 });
                        // datas.push({ date: key, kakao: 0, facebook: 0, navertalk: 0 });
                        // averageDatas.push({ date: key, count: 0 });
                    }

                    dataset[0].backgroundColor.push(color.background.kakao);
                    dataset[1].backgroundColor.push(color.background.facebook);
                    dataset[2].backgroundColor.push(color.background.navertalk);
                    dataset[3].backgroundColor.push(color.background.socket);
                    dataset[4].backgroundColor.push(color.background.etc);

                    averageDataset[0].backgroundColor.push('#00c73c');

                    dataset[0].borderColor.push(color.border.kakao);
                    dataset[1].borderColor.push(color.border.facebook);
                    dataset[2].borderColor.push(color.border.navertalk);
                    dataset[3].borderColor.push(color.border.socket);
                    dataset[4].borderColor.push(color.border.etc);

                    averageDataset[0].borderColor.push('#00af35');

                    startDate.setDate(startDate.getDate() + 1);
                }

                sessionCountChart.data = { labels: labels, datasets: dataset };
                sessionCountChart.update();

                sessionAverageCountChart.data = { labels: labels, datasets: averageDataset };
                sessionAverageCountChart.update();



                // createChart(parseData(list));
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.exelDownload = function()
        {
            var template = {
                sheetName: LanguageService('Amount of Session'),
                columnOrder: ["year", "month", "date", "kakao", "facebook", "navertalk", 'socket', 'etc', 'average'],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.name, LanguageService('Amount of Session'), $scope.date, template);
        };
    })();

    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();

    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
