//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DateService', function($window, $rootScope)
    {
        return {
            formatDate: function(date)
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
            }
        };
    });
})();
