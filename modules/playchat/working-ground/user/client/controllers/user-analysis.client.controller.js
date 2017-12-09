'use strict';
angular.module("playchat").controller("UserStatisticsController", ['$scope', "$http", '$cookies','LanguageService', function ($scope, $http, $cookies, LanguageService)
{
    $scope.$parent.changeWorkingGroundName('Analysis > User');

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

    var dataBackup;
    var color = {
        background:{
            kakao: '#fbe600',
            facebook: '#3b5998',
            navertalk: '#00c73c',
            socket: 'gray'
        }, border:{
            kakao: '#ede500',
            facebook: '#29487d',
            navertalk: '#00af35',
            socket: 'gray'
        }
    };
    var pieChart;
    var barChart;
    var pieDataTemplate = {
        labels: [LanguageService('KaKao Talk'), LanguageService('Facebook'), LanguageService('Naver talk talk'), LanguageService('Socket')],
        datasets: [
            {
                label: LanguageService('KaKao Talk'),
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
        $http.post("/api/userCount/" + $cookies.getObject('chatbot').id, {date: date, userType: userType, channel: channel}).then(function (doc) {
            dataBackup = angular.copy(doc.data);
            if(update){
                pieData = angular.copy(pieDataTemplate);
                barData = angular.copy(barDataTemplate);
                $scope.kakao = 0;
                $scope.facebook = 0;
                $scope.navertalk = 0;
                $scope.socket = 0;
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
            if((startDay == endDay) || (startMonth == endMonth) ||  (startYear == endYear)){
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

                        $scope.kakao = $scope.kakao + doc.data[i].kakao;
                        $scope.facebook = $scope.facebook + doc.data[i].facebook;
                        $scope.navertalk = $scope.navertalk + doc.data[i].navertalk;
                        $scope.socket = $scope.socket + doc.data[i].socket;
                        break;
                    }
                }
                if(!exist){
                    barData.datasets[0].data.push(0);
                    barData.datasets[1].data.push(0);
                    barData.datasets[2].data.push(0);
                }
                barData.datasets[0].backgroundColor.push(color.background.kakao);
                barData.datasets[1].backgroundColor.push(color.background.facebook);
                barData.datasets[2].backgroundColor.push(color.background.navertalk);
                barData.datasets[3].backgroundColor.push(color.background.socket);

                barData.datasets[0].borderColor.push(color.border.kakao);
                barData.datasets[1].borderColor.push(color.border.facebook);
                barData.datasets[2].borderColor.push(color.border.navertalk);
                barData.datasets[3].borderColor.push(color.border.socket);
            });
            pieData.datasets[0].data.push($scope.kakao);
            pieData.datasets[0].data.push($scope.facebook);
            pieData.datasets[0].data.push($scope.navertalk);
            pieData.datasets[0].data.push($scope.socket);

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
        document.getElementsByName('dataLoading')[0].style.setProperty("display", "block", "important");
        document.getElementsByName('dataLoading')[1].style.setProperty("display", "block", "important");
        userCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
    };
    //Datepicker 함수
    (function() {
        var start = moment().subtract(29, 'days');
        var end = moment();

        function cb(start, end) {
            $scope.date.start = start._d;
            $scope.date.end = end._d;
            $('#createdRange span').html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
            if($scope.first) $scope.update();
            $scope.first = true;
        }

        $('#createdRange').daterangepicker({
            parentEl: "#date-container",
            startDate: start,
            endDate: end,
            opens: "left",
            minDate : moment().subtract(93, 'days'),
            maxDate : moment().endOf('month'),
            ranges: {
                '오늘': [moment(), moment()],
                '어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '지난 7 일': [moment().subtract(6, 'days'), moment()],
                '지난 30 일': [moment().subtract(29, 'days'), moment()],
                '이번 달': [moment().startOf('month'), moment().endOf('month')],
                '지난 달': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            locale: {
                "format": "YYYY/MM/DD",
                "separator": " - ",
                "applyLabel": "적용",
                "cancelLabel": "취소",
                "fromLabel": "부터",
                "toLabel": "까지",
                "customRangeLabel": "날짜 직접 선택",
                "weekLabel": "주",
                "daysOfWeek": [
                    "일",
                    "월",
                    "화",
                    "수",
                    "목",
                    "금",
                    "토"
                ],
                monthNames: [
                    "1월",
                    "2월",
                    "3월",
                    "4월",
                    "5월",
                    "6월",
                    "7월",
                    "8월",
                    "9월",
                    "10월",
                    "11월",
                    "12월"
                ],
                "firstDay": 1
            }
        }, cb);
        cb(start, end);
    })();
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
                        navertalk: 0
                    }
                )
            }
        });


        var exelDataTemplate = {
            sheetName: "사용자 통계",
            columnOrder: ["year", "month", "day", "kakao", "Facebook","navertalk"],
            orderedData: data
        };
        var startYear =  $scope.date.start.getFullYear();
        var startMonth = $scope.date.start.getMonth() + 1;
        var startDay =   $scope.date.start.getDate();
        var endYear =  $scope.date.end.getFullYear();
        var endMonth = $scope.date.end.getMonth() + 1;
        var endDay =   $scope.date.end.getDate();
        var date = {
            start: startYear + "/" + startMonth + "/" + startDay,
            end: endYear + "/" + endMonth + "/" + endDay
        };
        var fileName = $cookies.get("default_bot") + '_' + "사용자 통계" + '_' + startYear + '-' + startMonth + '-' + startDay + '~' + endYear + '-' + endMonth + '-' + endDay + '_' + '.xlsx';

        $http.post('/api/analytics/statistics/exel-download/' + $cookies.get("default_bot"), {data: exelDataTemplate, date : date}).then(function (doc) {
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }

            saveAs(new Blob([s2ab(doc.data)],{type:"application/octet-stream"}), fileName);
        }, function (err) {
            console.log(err);
        });
    };
    $scope.lan=LanguageService;
}]);
