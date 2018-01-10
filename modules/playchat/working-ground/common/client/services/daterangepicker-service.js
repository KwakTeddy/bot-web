//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DateRangePickerService', function($window, $rootScope, LanguageService)
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
            var ranges = {};
            ranges[LanguageService('Today')] = [moment(), moment()];
            ranges[LanguageService('Last 7 days')]= [moment(), moment()];
            ranges[LanguageService('Last 30 days')]= [moment(), moment()];
            ranges[LanguageService('This Month')]= [moment(), moment()];
            ranges[LanguageService('Last Month')]= [moment(), moment()];

            $(selector).daterangepicker({
                parentEl: "#date-container",
                startDate: start,
                endDate: end,
                opens: "left",
                minDate : moment().subtract(62, 'days'),
                maxDate : moment().endOf('month'),
                // ranges: {
                //     '오늘': [moment(), moment()],
                //     '어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                //     '지난 7 일': [moment().subtract(6, 'days'), moment()],
                //     '지난 30 일': [moment().subtract(29, 'days'), moment()],
                //     '이번 달': [moment().startOf('month'), moment().endOf('month')],
                //     '지난 달': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                // },

                ranges: ranges,
                locale: {
                    "format": "YYYY/MM/DD",
                    "separator": " - ",
                    "applyLabel": LanguageService('Apply'),
                    "cancelLabel": LanguageService('Cancel'),
                    "fromLabel": LanguageService('from'),
                    "toLabel": LanguageService('to'),
                    "customRangeLabel": LanguageService('Select Dates'),
                    "weekLabel": LanguageService('week'),
                    "daysOfWeek": [
                        LanguageService('Sunday'),
                        LanguageService('Monday'),
                        LanguageService('Tuesday'),
                        LanguageService('Wednesday'),
                        LanguageService('Thursday'),
                        LanguageService('Friday'),
                        LanguageService('Saturday')
                    ],
                    monthNames: [
                        LanguageService('January'),
                        LanguageService('February'),
                        LanguageService('March'),
                        LanguageService('April'),
                        LanguageService('May'),
                        LanguageService('June'),
                        LanguageService('July'),
                        LanguageService('August'),
                        LanguageService('September'),
                        LanguageService('October'),
                        LanguageService('November'),
                        LanguageService('December')
                    ],
                    "firstDay": 1
                }
            }, cb);

            cb(start, end, true);
        };

        return { init: f };
    });
})();
