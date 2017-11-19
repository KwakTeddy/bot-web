'use strict';

angular.module('playchat').controller('DialogTrafficAnalysisController', ['$window', '$scope', '$resource', '$cookies', '$http', function ($window, $scope, $resource, $cookies, $http)
{
    $scope.$parent.changeWorkingGroundName('Analysis > Dialog Traffic');

    $scope.$parent.loaded('working-ground');

    $scope.date = { start: "", end: "" };
    $scope.userType = "total";
    $scope.channel = "total";
    $scope.kakao = 0;
    $scope.facebook = 0;
    $scope.navertalk = 0;

    var chatbot = $cookies.getObject('chatbot');

    var dataBackup; //엑셀다운로드를 위한 백업
    var color = {
        background:{
            kakao: 'rgba(251, 230, 0, 0.70)',
            facebook: 'rgba(59, 89, 152, 0.70)',
            navertalk: 'rgba(0, 199, 60, 0.70)',
            success: "rgba(66, 133, 244, 0.70)",
            fail: "rgba(221, 81, 68, 0.70)"
        }, border:{
            kakao: '#ede500',
            facebook: '#29487d',
            navertalk: '#00af35',
            success: "rgb(51, 126, 248)",
            fail: "rgb(147, 75, 61)"
        }
    };
    var pieChart;
    var barChart;
    var isFailBarChart;
    var pieDataTemplate = {
        labels: ["카카오톡", "페이스북", "네이버톡톡"],
        datasets: [
            {
                label: "카카오톡",
                backgroundColor: [
                    color.background.kakao,
                    color.background.facebook,
                    color.background.navertalk
                ],
                borderColor: [
                    color.border.kakao,
                    color.border.facebook,
                    color.border.navertalk
                ],
                borderWidth: 1,
                data: []
            }
        ]
    };
    var barDataTemplate = {
        labels: [],
        datasets: [{
            label: '카카오톡',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }, {
            label: '페이스북',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }, {
            label: '네이버톡톡',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    };
    var isFailBarDataTemplate = {
        labels: [],
        datasets: [{
            label: '성공',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }, {
            label: '실패',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    };
    var pieData = angular.copy(pieDataTemplate);
    var barData = angular.copy(barDataTemplate);
    var isFailBarData = angular.copy(isFailBarDataTemplate);

    var pieContext = document.getElementById("dialogRatioByChannel").getContext('2d');
    var barContext = document.getElementById("dailyDialog").getContext('2d');
    var isFailBarContext = document.getElementById("isFailDialog").getContext('2d');


    //처음 그래프 그리는 함수
    var initChart = function ()
    {
        pieChart = new Chart(pieContext,
        {
            type: 'doughnut',
            data: pieData,
            options: {}
        });

        barChart = new Chart(barContext,
        {
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
                    }
                }
            ]
        });

        isFailBarChart = new Chart(isFailBarContext,
        {
            type: 'bar',
            data: isFailBarData,
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
    };

    //그래프 업데이트 함수
    var updateChart = function()
    {
        barChart.data = barData;
        barChart.update();
        pieChart.data = pieData;
        pieChart.update();
        isFailBarChart.data = isFailBarData;
        isFailBarChart.update();
    };

    //대화수 데이터 불러오는 함수
    var dialogCount = function(date, userType, channel, update)
    {
        $http.post("/api/daily-dialog-usage", {botId: chatbot.id, date: date, userType: userType, channel: channel}).then(function (doc)
        {
            dataBackup = angular.copy(doc.data);

            if(update)
            {
                pieData = angular.copy(pieDataTemplate);
                barData = angular.copy(barDataTemplate);
                isFailBarData = angular.copy(isFailBarDataTemplate);
                $scope.kakao = 0;
                $scope.facebook = 0;
                $scope.navertalk = 0;
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
            //단일 데이터 요구할 시
            if((startDay == endDay) || (startMonth == endMonth) ||  (startYear == endYear))
            {
                array.push(startYear + '/'+ startMonth + '/' + startDay)
            }

            for(var i = startDay;(day != endDay) || (month != endMonth) ||  (year != endYear); i++)
            {
                var date = new Date(startYear, startMonth - 1, i);
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                array.push(year + '/'+ month + '/' + day)
            }

            $scope.dateArray = array;

            barData.labels = array;
            isFailBarData.labels = array;

            array.forEach(function (date, index)
            {
                var Year =  parseInt(date.split('/')[0]);
                var Month = parseInt(date.split('/')[1]);
                var Day =   parseInt(date.split('/')[2]);

                var exist = false;
                for (var i = 0; i < doc.data.length; i++)
                {
                    if((doc.data[i]._id.year == Year) && (doc.data[i]._id.month == Month) && (doc.data[i]._id.day == Day))
                    {
                        exist = true;
                        barData.datasets[0].data.push(doc.data[i].kakao);
                        barData.datasets[1].data.push(doc.data[i].facebook);
                        barData.datasets[2].data.push(doc.data[i].navertalk);

                        isFailBarData.datasets[0].data.push(doc.data[i].total - doc.data[i].fail);
                        isFailBarData.datasets[1].data.push(doc.data[i].fail);

                        $scope.kakao = $scope.kakao + doc.data[i].kakao;
                        $scope.facebook = $scope.facebook + doc.data[i].facebook;
                        $scope.navertalk = $scope.navertalk + doc.data[i].navertalk;
                        break;
                    }
                }

                if(!exist)
                {
                    barData.datasets[0].data.push(0);
                    barData.datasets[1].data.push(0);
                    barData.datasets[2].data.push(0);
                }
                else
                {
                    barData.datasets[0].backgroundColor.push(color.background.kakao);
                    barData.datasets[1].backgroundColor.push(color.background.facebook);
                    barData.datasets[2].backgroundColor.push(color.background.navertalk);

                    barData.datasets[0].borderColor.push(color.border.kakao);
                    barData.datasets[1].borderColor.push(color.border.facebook);
                    barData.datasets[2].borderColor.push(color.border.navertalk);

                    isFailBarData.datasets[0].backgroundColor.push(color.background.success);
                    isFailBarData.datasets[1].backgroundColor.push(color.background.fail);

                    isFailBarData.datasets[0].borderColor.push(color.border.success);
                    isFailBarData.datasets[1].borderColor.push(color.border.success);
                }
            });

            pieData.datasets[0].data.push($scope.kakao);
            pieData.datasets[0].data.push($scope.facebook);
            pieData.datasets[0].data.push($scope.navertalk);

            if(!update)
            {
                initChart();
            }
            else
            {
                updateChart();
            }

        }, function (err) {
            console.log(err);
        });
    };
    //시간 데이터를 string으로 바꿔주는 함수
    var formatDate = function (start, end)
    {
        var date = {start: "", end: ""};
        date.start = start.getFullYear() + '/' + (start.getMonth() +1) + '/' + start.getDate();
        date.end = end.getFullYear() + '/' + (end.getMonth() +1) + '/' + end.getDate();

        return date;
    };
    //시작할 때 불리는 함수 - html에서 부름
    $scope.init = function () {
        dialogCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, false);
    };
    //업데이트 함수
    $scope.update = function () {
        dialogCount(formatDate($scope.date.start, $scope.date.end), $scope.userType, $scope.channel, true);
    };
    //Datepicker 스크립트
    (function()
    {
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
            minDate : moment().subtract(62, 'days'),
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

    //엑셀 다운받는 함수
    $scope.exelDownload = function () {
        var dataBackup1 = angular.copy(dataBackup);
        var data = [];
        $scope.dateArray.forEach(function (date) {
            var year =  parseInt(date.split('/')[0]);
            var month = parseInt(date.split('/')[1]);
            var day =   parseInt(date.split('/')[2]);
            var exist = false;
            //데이터 형식을 엑셀 만들기 위한 형식으로 변환
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
                        total: 0,
                        fail: 0
                    }
                )
            }
        });

        var exelDataTemplate = {
            sheetName: "일별 대화량 통계",
            columnOrder: ["year", "month", "day", "kakao", "facebook","navertalk", "total", "fail"],
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
        $http.post('/api/analytics/statistics/exel-download/' + $cookies.get("default_bot"), {data: exelDataTemplate, date: date}).then(function (doc) {
            var fileName = $cookies.get("default_bot") + '_' + "일별 대화량 통계" + '_' + startYear + '-' + startMonth + '-' + startDay + '~' + endYear + '-' + endMonth + '-' + endDay + '_' + '.xlsx';
            //엑셀 다운로드 함수-Filesaver.js 모듈 이용
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
}]);
