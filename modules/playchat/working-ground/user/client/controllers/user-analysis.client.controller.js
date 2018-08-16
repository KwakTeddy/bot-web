'use strict';
angular.module("playchat").controller("UserStatisticsController", ['$scope', "$http", '$cookies','LanguageService', 'DateRangePickerService', 'ExcelDownloadService', function ($scope, $http, $cookies, LanguageService, DateRangePickerService, ExcelDownloadService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('User'), '/modules/playchat/gnb/client/imgs/user.png');

    $scope.$parent.loaded('working-ground');

    $scope.date = {
        start: "",
        end: ""
    };
    $scope.userType = "total";
    $scope.channel = "total";
    $scope.kakao = 0;
    $scope.facebook = 0;
    $scope.navertalk = 0;
    $scope.socket = 0;
    $scope.etc = 0;

    var chatbot = $cookies.getObject('chatbot');

    var dataBackup;
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
    var pieChart;
    var barChart;
    var pieDataTemplate = {
        labels: [LanguageService('KaKao Talk'), LanguageService('Facebook'), LanguageService('Naver talk talk'), LanguageService('Socket'),'ETC'],
        datasets: [
            {
                label: LanguageService('KaKao Talk'),
                backgroundColor: [
                    color.background.kakao,
                    color.background.facebook,
                    color.background.navertalk,
                    color.background.socket,
                    color.background.etc
                ],
                borderColor: [
                    color.border.kakao,
                    color.border.facebook,
                    color.border.navertalk,
                    color.border.socket,
                    color.border.etc
                ],
                borderWidth: 1,
                data: []
            }
        ]
    };
    var barDataTemplate = {
        labels: [],
        datasets: [{
            label: LanguageService('KaKao Talk'),
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
    var pieData = angular.copy(pieDataTemplate);
    var barData = angular.copy(barDataTemplate);
    var pieContext = document.getElementById("userRatioByChannel").getContext('2d');
    var barContext = document.getElementById("dailyUser").getContext('2d');
    //그래프 처음 그리는 함수
    var initChart = function () {
        pieChart = new Chart(pieContext, {
            type: 'doughnut',
            data: pieData,
            options: {}
        });
        barChart = new Chart(barContext, {
            type: 'bar',
            data: barData,
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
            },
            plugins: [
                {
                    afterInit: function() {
                        // document.getElementsByName('dataLoading')[0].style.setProperty("display", "none", "important");
                        // document.getElementsByName('dataLoading')[1].style.setProperty("display", "none", "important");
                    }
                }
            ]
        });
    };
    //그래프 업데이트 함수
    var updateChart = function () {
        barChart.data = barData;
        barChart.update();
        pieChart.data = pieData;
        pieChart.update();
        // document.getElementsByName('dataLoading')[0].style.setProperty("display", "none", "important");
        // document.getElementsByName('dataLoading')[1].style.setProperty("display", "none", "important");
    };
    //사용자 데이터 가져오는 함수
    var userCount = function (date, userType, channel, update) {
        $http.post("/api/userCount/" + chatbot.id, {date: date, userType: userType, channel: channel}).then(function (doc) {
            console.log(doc.data)
            dataBackup = angular.copy(doc.data);
            if(update){
                pieData = angular.copy(pieDataTemplate);
                barData = angular.copy(barDataTemplate);
                $scope.kakao = 0;
                $scope.facebook = 0;
                $scope.navertalk = 0;
                $scope.socket = 0;
                $scope.etc = 0;
            }
            var array = [];
            var startYear =  $scope.date.start.getFullYear();
            var startMonth = $scope.date.start.getMonth() + 1;
            var startDay =   $scope.date.start.getDate();
            var endYear =  $scope.date.end.getFullYear();
            var endMonth = $scope.date.end.getMonth() + 1;
            var endDay =   $scope.date.end.getDate();
            var year = startYear;
            var month = startMonth;
            var day = startDay;
            if((startDay == endDay) && (startMonth == endMonth) &&  (startYear == endYear)){
                array.push(startYear + '/'+ startMonth + '/' + startDay)
            }
            for(var i = startDay;(day != endDay) || (month != endMonth) ||  (year != endYear); i++){
                var date = new Date(startYear, startMonth - 1, i);
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                array.push(year + '/'+ month + '/' + day)
            }
            barData.labels = array;
            $scope.dateArray = array;

            array.forEach(function (date) {
                var Year =  parseInt(date.split('/')[0]);
                var Month = parseInt(date.split('/')[1]);
                var Day =   parseInt(date.split('/')[2]);
                var exist = false;

                for (var i = 0; i < doc.data.length; i++) {
                    if((doc.data[i]._id.year == Year) && (doc.data[i]._id.month == Month) && (doc.data[i]._id.day == Day)){
                        exist = true;
                        barData.datasets[0].data.push(doc.data[i].kakao);
                        barData.datasets[1].data.push(doc.data[i].facebook);
                        barData.datasets[2].data.push(doc.data[i].navertalk);
                        barData.datasets[3].data.push(doc.data[i].socket);
                        var etc = doc.data[i].total - (doc.data[i].kakao + doc.data[i].facebook + doc.data[i].navertalk + doc.data[i].socket);

                        barData.datasets[4].data.push(etc);

                        $scope.kakao = $scope.kakao + doc.data[i].kakao;
                        $scope.facebook = $scope.facebook + doc.data[i].facebook;
                        $scope.navertalk = $scope.navertalk + doc.data[i].navertalk;
                        $scope.socket = $scope.socket + doc.data[i].socket;
                        $scope.etc = $scope.etc + etc;
                        break;
                    }
                }
                if(!exist){
                    barData.datasets[0].data.push(0);
                    barData.datasets[1].data.push(0);
                    barData.datasets[2].data.push(0);
                    barData.datasets[3].data.push(0);
                    barData.datasets[4].data.push(0);
                }


                barData.datasets[0].backgroundColor.push(color.background.kakao);
                barData.datasets[1].backgroundColor.push(color.background.facebook);
                barData.datasets[2].backgroundColor.push(color.background.navertalk);
                barData.datasets[3].backgroundColor.push(color.background.socket);
                barData.datasets[4].backgroundColor.push(color.background.etc);

                barData.datasets[0].borderColor.push(color.border.kakao);
                barData.datasets[1].borderColor.push(color.border.facebook);
                barData.datasets[2].borderColor.push(color.border.navertalk);
                barData.datasets[3].borderColor.push(color.border.socket);
                barData.datasets[4].borderColor.push(color.border.etc);
            });
            pieData.datasets[0].data.push($scope.kakao);
            pieData.datasets[0].data.push($scope.facebook);
            pieData.datasets[0].data.push($scope.navertalk);
            pieData.datasets[0].data.push($scope.socket);
            pieData.datasets[0].data.push($scope.etc);


            if(!update) initChart();
            else        updateChart();
        }, function (err) {
            console.log(err);
        });
    };
    //Date 데이터를 String으로 변환 함수
    var formatDate = function (start, end) {
        var date = {start: "", end: ""};
        date.start = start.getFullYear() + '/' + (start.getMonth() +1) + '/' + start.getDate();
        date.end = end.getFullYear() + '/' + (end.getMonth() +1) + '/' + end.getDate();
        return date;
    };
    //시작할 때 불리는 함수
    $scope.init = function () {
        userCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
    };
    //데이터 엡데이트시 불리는 함수
    $scope.update = function () {
        // document.getElementsByName('dataLoading')[0].style.setProperty("display", "block", "important");
        // document.getElementsByName('dataLoading')[1].style.setProperty("display", "block", "important");
        userCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
    };

    //엑셀 다운로드 함수
    $scope.exelDownload = function () {
        var dataBackup1 = angular.copy(dataBackup);
        var data = [];
        $scope.dateArray.forEach(function (date) {
            var year =  parseInt(date.split('/')[0]);
            var month = parseInt(date.split('/')[1]);
            var day =   parseInt(date.split('/')[2]);
            var exist = false;
            for(var i = 0; i < dataBackup1.length; i++){
                if(dataBackup1[i]._id && (dataBackup1[i]._id.year == year) && (dataBackup1[i]._id.month == month) && (dataBackup1[i]._id.day == day)){
                    Object.keys(dataBackup1[i]._id).forEach(function (key) {
                        dataBackup1[i][key] = dataBackup1[i]._id[key]
                    });
                    delete dataBackup1[i]._id;
                    data.push(dataBackup1[i]);
                    exist = true;
                    break;
                }
            }
            if(!exist){
                data.push(
                    {
                        year: year,
                        month: month,
                        day: day,
                        kakao: 0,
                        facebook: 0,
                        navertalk: 0,
                        socket: 0,
                        etc: 0
                    }
                )
            }
        });


        var template = {
            sheetName: LanguageService('User Count'),
            columnOrder: ["year", "month", "day", "kakao", "facebook","navertalk", "socket", "etc"],
            orderedData: data
        };

        ExcelDownloadService.download(chatbot.name, LanguageService('User Count'), $scope.date, template);

    };

    DateRangePickerService.init('#createdRange', $scope.date, $scope.update);

    $scope.lan=LanguageService;
}]);
