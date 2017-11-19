//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DateRangePickerService', function($window, $rootScope)
    {
        var f = function(selector, dateObject, updateCallback)
        {
            var start = moment().subtract(29, 'days');
            var end = moment();

            function cb(start, end, isFirst) {
                dateObject.start = start._d;
                dateObject.end = end._d;
                $(selector + ' span').html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));

                if(isFirst !== true)
                {
                    updateCallback();
                }
            }

            $(selector).daterangepicker({
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

            cb(start, end, true);
        };

        return { init: f };
    });
})();
