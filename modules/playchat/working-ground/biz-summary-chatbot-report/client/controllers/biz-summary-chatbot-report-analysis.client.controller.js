'use strict';

angular.module('playchat').controller('BizSummaryChatbotReportAnalysisController', ['$scope', '$rootScope', '$state', 'ModalService','$window','$timeout', '$stateParams', '$resource', '$cookies', 'Socket','LanguageService', function ($scope, $rootScope, $state,ModalService, $window, $timeout, $stateParams, $resource, $cookies, Socket, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary') + ' >> ' + LanguageService('Report'), '/modules/playchat/gnb/client/imgs/summary.png');
    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
    var user = $cookies.getObject('user');

    $scope.User = [];
    $scope.Messages = {};

    (function()
    {
        var data = JSON.parse(sessionStorage.getItem('SummaryReport'));

        console.log('데이터 : ', data);
        var reportDetailModal = new ModalService('reportDetailModal', $scope);

        //chart setting data
        var color = {
            background:'#38b0f2',
            background2:'#FF8000',
            border:'#38b0f2',
            border2:'#FF8000'
        };

        $scope.getList = function()
        {
            $scope.User.email = user.email;
            $scope.Messages = data;
            $scope.Messages.sendSuccAverageRate = Math.round((Number(data.sendSuccNum) - Number(data.sendSuccAverage)) / Number(data.sendSuccAverage)) * 100;
            document.getElementById("sendRateChart").getContext("2d");
            $scope.Messages.sendFeeAverageRate = Math.round((Number(data.sendFee) - Number(data.feeAverage)) / Number(data.feeAverage)) * 100;
            $scope.Messages.replyAverageRate = Math.round((Number(data.reply) - Number(data.replyAverage)) / Number(data.replyAverage)) * 100;
            $scope.Messages.feeForOneAverageRate = Math.round((data.sendFeeForOne - data.feeForOneAverage) / data.feeForOneAverage) * 100;
            if(Number(data.sendNum) >= 1000){
                $scope.Messages.sendNumK = Math.round(Number(data.sendNum) / 1000) + 'k';
            }
            else{
                $scope.Messages.sendNumK = data.sendNum;
            }

            if(Number(data.sendFee) >= 1000) {
                $scope.Messages.sendFeeK = Math.round(Number(data.sendFee) / 1000) + 'k';
            }
            else{
                $scope.Messages.sendFeeK = data.sendFee;
            }

            if(Number(data.sendNumAverage) >= 1000){
                $scope.Messages.sendNumAverageK = Math.round(Number(data.sendNumAverage) / 1000) + 'k';
            }
            else{
                $scope.Messages.sendNumAverageK = data.sendNumAverage;
            }

            if(Number(data.feeAverage) >= 1000){
                $scope.Messages.feeAverageK = Math.round(Number(data.feeAverage) / 1000) + 'k';
            }
            else{
                $scope.Messages.feeAverageK = data.feeAverage;
            }

            $scope.Messages.sendFee = Number(data.sendFee).toLocaleString();
            $scope.Messages.feeAverage = Number(data.feeAverage).toLocaleString();
            $scope.Messages.sendDate = $scope.dateFormat(data.sendDate);

            var datas = [];
            var labels = ["이탈률 = (실패) / (발송 대상)", "성공률 = (성공) / (발송 대상)", "응답률 = (답장을 한 고객) / (발송 대상)"];

            datas[0] = (data.sendNum - data.sendSuccNum)/ data.sendNum;
            datas[1] = data.sendSuccRate;
            datas[2] = data.reply / data.sendNum;

            var config = {
                type: 'bar',
                data: {
                    datasets: [{
                        data: datas,
                        backgroundColor: color.background,
                        borderColor: color.border,
                        borderWidth: 2,
                    }],
                    labels: labels
                },
                options: {
                    layout: {
                        padding: {
                            left: 0,
                            right: 10,
                            top: 30,
                            bottom: 50
                        }
                    },
                    title: false,
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
                    legend: {
                        display: false
                    },
                    tooltips: {
                        legend: {
                            display: false,
                        },
                        enabled: false
                    },
                    // scaleShowLabels : true,// 是否显示y轴的标签
                    // scaleLabel : "<%=value%>",// 标签显示值
                    // scaleFontFamily : "'Arial'",// 标签的字体
                    // scaleFontSize : 12,// 标签字体的大小
                    // scaleFontStyle : "normal",// 标签字体的样式
                    // scaleFontColor : "#666",// 标签字体的颜色
                    // barValueSpacing : 5,// 柱状块与x值所形成的线之间的距离
                    "animation": {
                        "duration": 1,
                        "onComplete": function() {
                            var chartInstance = this.chart,
                                ctx = chartInstance.ctx;

                            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';

                            this.data.datasets.forEach(function(dataset, i) {
                                var meta = chartInstance.controller.getDatasetMeta(i);
                                meta.data.forEach(function(bar, index) {
                                    var data = dataset.data[index];
                                    ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                });
                            });
                        }
                    },
                }
            };
            //chart draw
            var lineContext = document.getElementById("sendRateChart").getContext("2d");
            var LineChart = new Chart(lineContext, config);

            var lineContextModal = document.getElementById("sendRateChartModal").getContext("2d");
            var LineChartModal = new Chart(lineContextModal, config);

            angular.element('.main-logo-background').css('opacity', 0);
            angular.element('.main-logo-background').css('display', 'none');
        };

        $scope.dateFormat = function(date)
        {
            console.log("date-old1: " + date);
            if(!date)
                return;
            date = date.replace(/[.]/g, "-");
            console.log("date-old2: " + date);
            date = new Date(date);
            console.log("date-new: " + date);
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
            console.log("date-all: " + year + '년 ' + month + '월 ' + dateOfMonth + '일 ' + hour + '시 ' + min + '분');
            return year + '년 ' + month + '월 ' + dateOfMonth + '일 ' + hour + '시 ' + min + '분';
        };

        $scope.openModal = function()
        {
            reportDetailModal.open();
          // 페이지 11 그래프
            // var datas1 = [];
            // var labels1 = ["이탈률 = (실패) / (발송 대상)", "성공률 = (성공) / (발송 대상)", "응답률 = (답장을 한 고객) / (발송 대상)"];
            //
            // datas1[0] = (data.sendNum - data.sendSuccNum)/ data.sendNum;
            // datas1[1] = data.sendSuccRate;
            // datas1[2] = data.reply / data.sendNum;
            // var config = {
            //     type: 'bar',
            //     data: {
            //         datasets: [
            //             {
            //                 label: '발송',
            //                 data: [12,52],
            //                 backgroundColor: [],
            //                 borderColor: [],
            //                 borderWidth: 1
            //             }, {
            //                 label: '평균',
            //                 data: [12,52],
            //                 backgroundColor: [],
            //                 borderColor: [],
            //                 borderWidth: 1
            //             }
            //         ],
            //         labels: [],
            //         // labels: labels1
            //     },
            //     options: {
            //         layout: {
            //             padding: {
            //                 left: 0,
            //                 right: 10,
            //                 top: 30,
            //                 bottom: 50
            //             }
            //         },
            //         title: false,
            //         scales: {
            //             yAxes: [{
            //                 stacked: true,
            //                 ticks: {
            //                     min: 0
            //                 }
            //             }],
            //             xAxes: [{
            //                 stacked: true
            //             }]
            //         },
            //         // legend: {
            //         //     display: false
            //         // },
            //         tooltips: {
            //             legend: {
            //                 display: false,
            //             },
            //             enabled: false
            //         },
            //         // scaleShowLabels : true,// 是否显示y轴的标签
            //         // scaleLabel : "<%=value%>",// 标签显示值
            //         // scaleFontFamily : "'Arial'",// 标签的字体
            //         // scaleFontSize : 12,// 标签字体的大小
            //         // scaleFontStyle : "normal",// 标签字体的样式
            //         // scaleFontColor : "#666",// 标签字体的颜色
            //         // barValueSpacing : 5,// 柱状块与x值所形成的线之间的距离
            //         "animation": {
            //             "duration": 1,
            //             "onComplete": function() {
            //                 var chartInstance = this.chart,
            //                     ctx = chartInstance.ctx;
            //
            //                 ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            //                 ctx.textAlign = 'center';
            //                 ctx.textBaseline = 'bottom';
            //
            //                 this.data.datasets.forEach(function(dataset, i) {
            //                     var meta = chartInstance.controller.getDatasetMeta(i);
            //                     meta.data.forEach(function(bar, index) {
            //                         var data = dataset.data[index];
            //                         ctx.fillText(data, bar._model.x, bar._model.y - 5);
            //                     });
            //                 });
            //             }
            //         },
            //     }
            // };
            // //chart draw
            // var lineContext = document.getElementById("sendRateAvarageChartModal").getContext("2d");
            // var LineChart = new Chart(lineContext, config);
        }




    })();
    $scope.getList();
    $scope.$parent.loaded('working-ground');
    $scope.lan=LanguageService;
}]);
