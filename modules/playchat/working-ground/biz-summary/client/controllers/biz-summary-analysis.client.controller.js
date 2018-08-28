'use strict';

angular.module('playchat').controller('BizSummaryAnalysisController', ['$scope', '$rootScope', 'PagingService','$state', '$window','$timeout', '$location','$stateParams', '$resource', '$cookies', 'Socket','LanguageService','DateRangePickerService', function ($scope, $rootScope, PagingService, $state, $window, $timeout, $location, $stateParams, $resource, $cookies, Socket, LanguageService, DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' >> ' + LanguageService('Summary'), '/modules/playchat/gnb/client/imgs/summary.png');
    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
    var user = $cookies.getObject('user');

    $scope.User = [];
    $scope.Bots = [];
    $scope.Messages = [];
    $scope.date = {};


    var mySqlPool = new mysql.createPool({
        // host: 'localhost',
        host: '172.31.15.9',
        port: '3306',
        user: 'root',
        password: 'Make01mb!',
        charset : 'utf8mb4',
        //database: 'kakao_agent',
        database: 'kt_mcs_agent',
        connectionLimit: 20,
        waitForConnections: false
    });

    mySqlPool.getConnection(function (err, connection) {
        var query = connection.query('INSERT INTO MZSENDTRAN (SN, SENDER_KEY, CHANNEL, PHONE_NUM, TMPL_CD, SND_MSG, REQ_DTM, TRAN_STS)' +
            'VALUES (' +
            '\'' + dateformat(new Date(), 'yyyymmddHHMMss') + '\',' +//'\'' + sendKakaoSeq + '\',' +
            '\'484a760f0ab588a483034d6d583f0ae8c2882829\',' +
            '\'A\',' +
            '\'' + phoneNum + '\',' +
            '\'code1\',' +
            '\'' + message + '\',' +
            '\'' + dateformat(new Date()+9*60*60, 'yyyymmddHHMMss') + '\',' +
            '\'1\');'
            , function (err, rows) {
                if (err) {
                    connection.release();
                    throw err;
                }

                connection.release();
            });
    })

    (function()
    {

        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        $scope.getList = function(page)
    {
        $scope.User.name = user.displayName;
        $scope.User.lastSendDate = '2018.08.24.0600';
        $scope.User.sendNum = 0;
        $scope.User.sendSuccNum = 0;
        $scope.User.sendSuccRate = 0;

        ChatBotService.query({ type : true }, function(list)
        {
            var totalPage = list.length < 10 ? 1 : Math.round(list.length / 10);
            page = page || 1;
            $scope.pageOptions = PagingService(page, totalPage);

            list.forEach((e,index) => {
                e.created = moment(e.created).format('YYYY.MM.DD');
                $scope.Bots[index] = {};
                $scope.Bots[index].index = index + 1;
                $scope.Bots[index].name = e.name;
                // message list load
                $scope.Bots[index].lastSendDate = '2018.08.24.0600';
                $scope.Bots[index].sendNum = 0;
                $scope.Bots[index].sendSuccNum = 0;
                $scope.Bots[index].sendSuccRate = 0;
                //
                index++;
            });

        });
        angular.element('.main-logo-background').css('opacity', 0);
        angular.element('.main-logo-background').css('display', 'none');

    };

        $scope.goDetailPage = function(event, data)
        {
            sessionStorage.setItem('botMsg',JSON.stringify(data));
            $location.path('/playchat/analysis/biz-summary-chatbot')
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
