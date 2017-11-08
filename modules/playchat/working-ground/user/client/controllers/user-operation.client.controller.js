'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('OperationUserController', ['$window', '$scope', '$resource', '$cookies', '$location', '$element', 'PagingService', function ($window, $scope, $resource, $cookies, $location, $element, PagingService)
{
    $scope.$parent.changeWorkingGroundName('Operation > User');

    var BotUserService = $resource('/api/:botId/operation/users', { botId: '@botId' });
    var BotUserPageService = $resource('/api/:botId/operation/users/totalpage', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.searchValues = {};
    $scope.isAdvancedMode = false;

    (function()
    {
        var start = moment().subtract(29, 'days');
        var end = moment();

        function cb(start, end) {
            $('#lastUpdateRange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }

        angular.element('#lastUpdateRange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        cb(start, end);
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
            var value = angular.element('#operationSearchInput').val();
            $scope.getList(1, value);
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

            var searchString = angular.toJson($scope.searchValues);
            if(searchString)
            {
                var searchObject = JSON.parse(searchString);
                for(var key in searchObject)
                {
                    query[key] = searchObject[key];
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
}]);
