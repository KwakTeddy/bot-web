'use strict';

angular.module('playchat').controller('OperationUserController', ['$window', '$scope', '$resource', '$cookies', '$location', '$element', 'PagingService', 'LanguageService', 'DateRangePickerService', function ($window, $scope, $resource, $cookies, $location, $element, PagingService, LanguageService, DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Operation') + ' > ' + LanguageService('User'), '/modules/playchat/gnb/client/imgs/user.png');

    var BotUserService = $resource('/api/:botId/operation/users', { botId: '@botId' });
    var BotUserPageService = $resource('/api/:botId/operation/users/totalpage', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.searchValues = {};
    $scope.isAdvancedMode = false;

    $scope.myBotAuth = chatbot.myBotAuth;
    if(!$scope.myBotAuth.edit)
    {
        alert(LanguageService('You do not have permission to edit this bot'));
        location.href='/playchat/';
        return;
    }

    (function()
    {
        var start = moment().subtract(29, 'days');
        var end = moment();
        $scope.date = {
            start : start,
            end : end
        };

        var rangeCallback = function(id)
        {
            return function cb(start, end){
                start = start || moment($scope.date.start);
                end = end || moment($scope.date.end);
                $scope.searchValues[id.replace('Range', '') + 'Start'] = start.format('YYYY/MM/DD');
                $scope.searchValues[id.replace('Range', '') + 'End'] = end.format('YYYY/MM/DD');

            };
        };

        DateRangePickerService.init('#lastUpdateRange', $scope.date, rangeCallback('lastUpdateRange'));
        DateRangePickerService.init('#createdRange', $scope.date, rangeCallback('createdRange'));

        $scope.searchValues.lastUpdateStart = start.format('YYYY/MM/DD');
        $scope.searchValues.lastUpdateEnd = end.format('YYYY/MM/DD');
        $scope.searchValues.createdStart = start.format('YYYY/MM/DD');
        $scope.searchValues.createdEnd = end.format('YYYY/MM/DD');
    })();

    (function()
    {
        $scope.searchKeyDown = function(e)
        {
            if(e.keyCode == 13)
            {
                $scope.search();
                e.preventDefault();
            }
            else if(e.keyCode == 8)
            {
                if(e.currentTarget.value.length == 1)
                {
                    $scope.getList(1, '');
                }
            }
        };

        $scope.search = function()
        {
            if($scope.isAdvancedMode)
            {
                console.log('서치 : ', $scope.searchValues);
                $scope.getList(1);
            }
            else
            {
                var value = angular.element('#operationSearchInput').val();
                console.log('밸류 : ', value);
                $scope.getList(1, value);
            }
        };

        $scope.clear = function()
        {
            $scope.searchValues = {
                channel: '',
                userKey: '',
                mobile: '',
                dialogCountStart: '',
                dialogCountEnd: '',
                lastUpdateStart: '',
                lastUpdateEnd: '',
                createdStart: '',
                createdEnd: ''
            };

            angular.element('.range-input span').html('');
        };

        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        $scope.getList = function(page, searchValue)
        {
            page = page || $location.search().page || 1;
            var countPerPage = $location.search().countPerPage || 10;

            var query = {};
            query.botId = chatbot.id;
            query.countPerPage = countPerPage;

            if(searchValue)
            {
                if(/^[0-9\-]*$/gi.test(searchValue))
                {
                    query.mobile = searchValue;
                }
                else
                {
                    query.userKey = searchValue;
                }
            }
            else if($scope.isAdvancedMode)
            {
                for(var key in $scope.searchValues)
                {
                    query[key] = $scope.searchValues[key];
                }
            }

            BotUserPageService.get(query, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            query.page = page;

            BotUserService.query(query, function(list)
            {
                $scope.list = list;
                $scope.$parent.loaded('working-ground');
            });
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

    $scope.getList();
    $scope.lan=LanguageService;
}]);
